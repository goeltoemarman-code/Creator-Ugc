import { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, SortOption } from './types';
import { INITIAL_POSTS, CATEGORIES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { UserProfileModal } from './components/UserProfileModal';
import { RoadmapPanel } from './components/RoadmapPanel';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sparkles, SlidersHorizontal, BookmarkCheck, RefreshCw, PlusCircle, User } from 'lucide-react';

function UGCAppContent() {
  const { firebaseUser, dbUser, signInWithGoogle } = useAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ugc_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch all posts from PostgreSQL Cloud SQL backend
  const fetchPostsFromDb = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error('Gagal mengambil data dari database PostgreSQL');
      }
      const data = await res.json();
      if (data.posts && data.posts.length > 0) {
        // Map backend schema to frontend model
        const formattedPosts: Post[] = data.posts.map((p: any) => {
          // Check if current logged-in user liked this post
          const isUserLiked = Array.isArray(p.likes)
            ? p.likes.some((l: any) => l.userId === dbUser?.id)
            : false;

          return {
            id: p.id,
            author: {
              id: p.author?.id || 'unknown',
              name: p.author?.name || 'Kreator',
              handle: p.author?.handle || '@kreator',
              avatar:
                p.author?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              bio: p.author?.bio || '',
            },
            content: p.content,
            mediaUrl: p.mediaUrl || undefined,
            category: p.category || 'Teknologi',
            tags: Array.isArray(p.tags) ? p.tags : [],
            likes: p.likesCount || 0,
            isLiked: isUserLiked,
            isBookmarked: bookmarkedIds.includes(p.id),
            createdAt: new Date(p.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            comments: Array.isArray(p.comments)
              ? p.comments.map((c: any) => ({
                  id: c.id,
                  author: {
                    id: c.author?.id || 'unknown',
                    name: c.author?.name || 'Anggota',
                    handle: c.author?.handle || '@anggota',
                    avatar:
                      c.author?.avatarUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  },
                  text: c.text,
                  createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  }),
                }))
              : [],
          };
        });

        setPosts(formattedPosts);
      } else {
        setPosts(INITIAL_POSTS);
      }
    } catch (err: any) {
      console.warn('API notice, fallback to current posts state:', err);
    } finally {
      setLoading(false);
    }
  }, [bookmarkedIds, dbUser]);

  useEffect(() => {
    fetchPostsFromDb();
  }, [fetchPostsFromDb]);

  // Save bookmarks to localStorage
  const handleToggleBookmark = (postId: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId];
      localStorage.setItem('ugc_bookmarks', JSON.stringify(next));
      return next;
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  // Filter and sort posts (Order by newest first by default)
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (selectedCategory !== 'Semua' && post.category !== selectedCategory) {
          return false;
        }
        if (showBookmarksOnly && !post.isBookmarked) {
          return false;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesContent = post.content.toLowerCase().includes(query);
          const matchesAuthor =
            post.author.name.toLowerCase().includes(query) ||
            post.author.handle.toLowerCase().includes(query);
          const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(query));
          const matchesCategory = post.category.toLowerCase().includes(query);
          return matchesContent || matchesAuthor || matchesTags || matchesCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'popular') {
          return b.likes + b.comments.length * 2 - (a.likes + a.comments.length * 2);
        }
        // By default, preserve newest first order from backend (descending)
        return 0;
      });
  }, [posts, selectedCategory, showBookmarksOnly, searchQuery, sortOption]);

  const bookmarkedCount = posts.filter((p) => p.isBookmarked).length;

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Architecture & Cloud SQL Status Panel */}
        <RoadmapPanel />

        {/* Quick Create Prompt Bar */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 cursor-pointer transition group"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 font-bold shrink-0 overflow-hidden">
            {firebaseUser ? (
              <img
                src={firebaseUser.photoURL || ''}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <PlusCircle className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition" />
            )}
          </div>
          <div className="flex-1 bg-neutral-50 group-hover:bg-neutral-100/80 border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-400 transition">
            {firebaseUser
              ? `Apa yang ingin kamu bagikan hari ini, ${firebaseUser.displayName}? (Dilengkapi filter moderasi)`
              : 'Buat postingan baru atau bagikan ide karya Anda ke komunitas...'}
          </div>
          <button
            id="quick-create-btn"
            className="hidden sm:flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Buat Postingan
          </button>
        </div>

        {/* Feed Controls & Category Filter */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
          {/* Categories Tab Scroll */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`filter-category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition shrink-0 ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Bookmarks Filter */}
            <button
              id="filter-bookmarks-btn"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition shrink-0 ${
                showBookmarksOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <BookmarkCheck
                className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'text-amber-600' : 'text-neutral-400'}`}
              />
              <span>Tersimpan</span>
              {bookmarkedCount > 0 && (
                <span className="bg-neutral-200 text-neutral-700 text-[10px] px-1.5 rounded-full font-bold">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          </div>

          {/* Sub-bar: Status count & Sorting */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span>
                Feed Komunitas: <strong className="text-neutral-800">{filteredPosts.length}</strong> postingan
                {selectedCategory !== 'Semua' && ` di kategori "${selectedCategory}"`}
              </span>
              {firebaseUser && (
                <button
                  type="button"
                  id="feed-my-profile-btn"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="hidden md:inline-flex items-center gap-1 font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 px-2.5 py-1 rounded-md transition"
                >
                  <User className="w-3 h-3 text-neutral-500" />
                  Postingan Saya
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline font-medium">Urutan:</span>
              <select
                id="sort-posts-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-700 focus:outline-none focus:border-neutral-900 font-medium"
              >
                <option value="latest">Terbaru (Default)</option>
                <option value="popular">Terpopuler (Paling Disukai)</option>
              </select>

              <button
                onClick={fetchPostsFromDb}
                title="Perbarui feed dari PostgreSQL"
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition ml-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Feed Posts List */}
        <div className="space-y-4">
          {loading && posts.length === 0 ? (
            <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl">
              <RefreshCw className="w-6 h-6 text-neutral-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-neutral-500">Memuat postingan terbaru dari PostgreSQL Cloud SQL...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-neutral-800 text-base">Tidak ada konten ditemukan</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery
                  ? `Tidak ada postingan yang sesuai dengan kata kunci "${searchQuery}".`
                  : 'Belum ada postingan di filter ini. Jadilah yang pertama membuat konten!'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                  setShowBookmarksOnly(false);
                }}
                className="text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleBookmark={handleToggleBookmark}
                onRefreshFeed={fetchPostsFromDb}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/90 bg-white py-6 mt-12 text-center text-xs text-neutral-500">
        <p className="font-semibold text-neutral-700">
          KreatorHub UGC • Platform Konten Pengguna Full-Stack
        </p>
        <p className="mt-1 text-neutral-400">
          Cloud SQL (PostgreSQL) • Drizzle ORM • Firebase Auth • Sistem Moderasi Otomatis
        </p>
      </footer>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={fetchPostsFromDb}
      />

      {/* User Profile & My Posts Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        posts={posts}
        onRefreshFeed={fetchPostsFromDb}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UGCAppContent />
    </AuthProvider>
  );
}
