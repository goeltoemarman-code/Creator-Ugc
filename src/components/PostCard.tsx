import React, { useState, useMemo } from 'react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { checkContentModeration } from '../lib/moderation';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Send,
  Tag,
  Clock,
  Check,
  LogIn,
  AlertCircle,
  Wand2,
  Trash2,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onToggleBookmark: (postId: string) => void;
  onRefreshFeed: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleBookmark,
  onRefreshFeed,
}) => {
  const { firebaseUser, dbUser, token, signInWithGoogle } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if current logged-in user is author of this post
  const isAuthor = Boolean(
    (dbUser && post.author.id === dbUser.id) ||
    (firebaseUser?.displayName && post.author.name === firebaseUser.displayName)
  );

  // Handle post deletion by author
  const handleDelete = async () => {
    if (!token) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onRefreshFeed();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal menghapus postingan');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Comment moderation check
  const commentModeration = useMemo(() => {
    return checkContentModeration(commentInput);
  }, [commentInput]);

  // Handle like toggle with PostgreSQL backend
  const handleLike = async () => {
    if (!firebaseUser || !token) {
      await signInWithGoogle();
      return;
    }

    try {
      setIsLiking(true);
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onRefreshFeed();
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submit with automatic moderation
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!firebaseUser || !token) {
      await signInWithGoogle();
      return;
    }

    if (!commentModeration.isClean) {
      setCommentError(
        `Moderasi Otomatis: Komentar memuat kata tidak pantas (${commentModeration.flaggedWords.join(
          ', '
        )}). Mohon sensor atau ubah kata tersebut.`
      );
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError('');

      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentInput.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim komentar.');
      }

      setCommentInput('');
      setShowComments(true);
      onRefreshFeed();
    } catch (err: any) {
      console.error('Comment error:', err);
      setCommentError(err.message || 'Gagal mengirim komentar.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    setCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition-all duration-200"
    >
      {/* Header: Author Info & Timestamp */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-neutral-900 text-sm">{post.author.name}</h3>
                <span className="text-xs text-neutral-400 font-normal">{post.author.handle}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {post.createdAt}
                </span>
                <span>•</span>
                <span className="bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Author Delete Action */}
          {isAuthor && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-lg text-xs">
                  <span className="text-rose-700 text-[11px] font-medium hidden sm:inline">Hapus?</span>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2 py-0.5 rounded transition disabled:opacity-50"
                  >
                    {isDeleting ? '...' : 'Ya'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-neutral-500 hover:text-neutral-800 text-[10px] px-1 font-medium"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id={`author-delete-post-${post.id}`}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus postingan saya"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content text */}
        <p className="mt-3.5 text-neutral-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-0.5 rounded-md font-medium"
              >
                <Tag className="w-2.5 h-2.5 text-neutral-400" />
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Image */}
      {post.mediaUrl && (
        <div className="px-4 sm:px-5 pb-3">
          <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 max-h-[440px]">
            <img
              src={post.mediaUrl}
              alt="Media postingan UGC"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Actions Toolbar: Like, Comment count, Bookmark, Share */}
      <div className="px-4 sm:px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-neutral-600 bg-neutral-50/30">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            id={`like-btn-${post.id}`}
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition active:scale-95 ${
              post.isLiked
                ? 'text-rose-600'
                : 'hover:text-rose-600 text-neutral-600'
            }`}
            title={post.isLiked ? 'Batal menyukai' : 'Sukai postingan'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                post.isLiked ? 'fill-rose-600 text-rose-600 scale-110' : ''
              }`}
            />
            <span>{post.likes}</span>
            <span className="hidden sm:inline font-normal text-neutral-500">Suka</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            id={`comment-toggle-${post.id}`}
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition ${
              showComments
                ? 'text-neutral-900'
                : 'hover:text-neutral-900 text-neutral-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments.length}</span>
            <span className="hidden sm:inline font-normal text-neutral-500">Komentar</span>
          </button>

          {/* Bookmark Button */}
          <button
            id={`bookmark-btn-${post.id}`}
            onClick={() => onToggleBookmark(post.id)}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition ${
              post.isBookmarked ? 'text-amber-600' : 'hover:text-amber-600 text-neutral-500'
            }`}
            title="Simpan postingan"
          >
            <Bookmark
              className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`}
            />
          </button>
        </div>

        {/* Share Button */}
        <button
          id={`share-btn-${post.id}`}
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition font-medium"
          title="Salin tautan"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan</span>
            </>
          )}
        </button>
      </div>

      {/* Discussion & Comments Area */}
      {showComments && (
        <div className="bg-neutral-50/70 border-t border-neutral-200/80 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Komentar & Diskusi ({post.comments.length})
            </h4>
            <span className="text-[11px] text-neutral-400">PostgreSQL Cloud SQL</span>
          </div>

          {/* Comment List */}
          {post.comments.length === 0 ? (
            <div className="py-4 text-center bg-white rounded-xl border border-neutral-200/60 p-4">
              <p className="text-xs text-neutral-400 italic">
                Belum ada komentar untuk postingan ini. Berikan tanggapan pertamamu!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-neutral-200/70 text-xs shadow-2xs"
                >
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-neutral-900">{comment.author.name}</span>
                      <span className="text-[10px] text-neutral-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-neutral-700 mt-1 leading-relaxed whitespace-pre-line">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input or Sign In Prompt */}
          {!firebaseUser ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3.5 bg-white border border-neutral-200 rounded-xl text-xs">
              <span className="text-neutral-600 text-center sm:text-left">
                Masuk dengan Google untuk menulis tanggapan dan berdiskusi.
              </span>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-1.5 rounded-lg transition shadow-xs text-xs shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    firebaseUser.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={firebaseUser.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-200 hidden sm:block"
                />
                <input
                  type="text"
                  placeholder={`Tulis komentar sebagai ${firebaseUser.displayName}...`}
                  value={commentInput}
                  onChange={(e) => {
                    setCommentInput(e.target.value);
                    if (commentError) setCommentError('');
                  }}
                  className={`flex-1 px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none transition text-neutral-800 placeholder:text-neutral-400 ${
                    !commentModeration.isClean
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim() || isSubmittingComment || !commentModeration.isClean}
                  className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmittingComment ? '...' : 'Kirim'}</span>
                </button>
              </div>

              {/* Comment Moderation Warning */}
              {!commentModeration.isClean && (
                <div className="flex items-center justify-between p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>
                      Kata tidak pantas: <strong>{commentModeration.flaggedWords.join(', ')}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCommentInput(commentModeration.sanitizedText)}
                    className="flex items-center gap-1 bg-white hover:bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200 font-semibold"
                  >
                    <Wand2 className="w-3 h-3 text-amber-500" />
                    Sensor
                  </button>
                </div>
              )}

              {commentError && (
                <p className="text-[11px] text-rose-600 font-medium">{commentError}</p>
              )}
            </form>
          )}
        </div>
      )}
    </article>
  );
};
