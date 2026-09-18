import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import {
  X,
  User as UserIcon,
  Trash2,
  Heart,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Tag,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onRefreshFeed: () => void;
  onOpenCreateModal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  posts,
  onRefreshFeed,
  onOpenCreateModal,
}) => {
  const { firebaseUser, dbUser, token, signInWithGoogle } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter posts created by this user
  const userPosts = posts.filter((p) => {
    if (!firebaseUser) return false;
    // Check by user ID from database or name/uid match
    if (dbUser?.id && p.author.id === dbUser.id) return true;
    if (firebaseUser.displayName && p.author.name === firebaseUser.displayName) return true;
    return false;
  });

  // Calculate stats
  const totalLikes = userPosts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = userPosts.reduce((acc, p) => acc + p.comments.length, 0);

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!token) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus postingan.');
      }

      setDeleteSuccess('Postingan berhasil dihapus secara permanen.');
      setPostToDelete(null);
      onRefreshFeed();

      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Delete post error:', err);
      setDeleteError(err.message || 'Terjadi kesalahan saat menghapus postingan.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="user-profile-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Profil Kreator Saya</h2>
              <p className="text-[11px] text-neutral-500">Kelola informasi akun dan daftar postingan Anda</p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!firebaseUser ? (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mx-auto">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-neutral-800 text-sm">Masuk untuk Melihat Profil</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Silakan masuk dengan akun Google untuk melihat postingan Anda dan mengelola konten Anda.
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
              >
                Masuk dengan Google
              </button>
            </div>
          ) : (
            <>
              {/* Profile Card Summary */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={
                    firebaseUser.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={firebaseUser.displayName || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      {firebaseUser.displayName || dbUser?.name || 'Kreator Terdaftar'}
                    </h3>
                    <span className="text-xs font-medium text-neutral-500">
                      {dbUser?.handle || `@${firebaseUser.email?.split('@')[0] || 'kreator'}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full self-center sm:self-auto">
                      <ShieldCheck className="w-3 h-3" />
                      Terverifikasi
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{firebaseUser.email}</p>
                  <p className="text-xs text-neutral-600 italic pt-1">
                    {dbUser?.bio || 'Kreator aktif di platform UGC PostgreSQL.'}
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-neutral-200 rounded-xl p-3 text-center shadow-2xs">
                  <p className="text-xl font-bold text-neutral-900">{userPosts.length}</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Postingan Dibuat</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-3 text-center shadow-2xs">
                  <p className="text-xl font-bold text-rose-600">{totalLikes}</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Suka Diterima</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-3 text-center shadow-2xs">
                  <p className="text-xl font-bold text-neutral-700">{totalComments}</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Komentar Diterima</p>
                </div>
              </div>

              {/* Success / Error Alerts */}
              {deleteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{deleteSuccess}</span>
                </div>
              )}

              {deleteError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              {/* User Posts Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Daftar Postingan Saya ({userPosts.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateModal();
                    }}
                    className="text-xs font-semibold text-neutral-900 hover:text-neutral-700 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Buat Postingan Baru
                  </button>
                </div>

                {userPosts.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-neutral-200 rounded-xl space-y-2">
                    <p className="text-xs text-neutral-500">
                      Anda belum pernah menerbitkan postingan.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCreateModal();
                      }}
                      className="text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-1.5 rounded-lg transition"
                    >
                      Mulai Tulis Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        id={`user-post-item-${post.id}`}
                        className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs hover:border-neutral-300 transition space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 text-xs text-neutral-400">
                              <span className="font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px]">
                                {post.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.createdAt}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                              {post.content}
                            </p>
                          </div>

                          {/* Media Thumbnail if any */}
                          {post.mediaUrl && (
                            <img
                              src={post.mediaUrl}
                              alt="Thumbnail"
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-lg object-cover border border-neutral-200 shrink-0"
                            />
                          )}
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded flex items-center gap-0.5"
                              >
                                <Tag className="w-2.5 h-2.5" />#{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer stats & Delete button */}
                        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              {post.likes} Suka
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                              {post.comments.length} Komentar
                            </span>
                          </div>

                          {/* Delete Action Button with Confirmation */}
                          {postToDelete === post.id ? (
                            <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                              <span className="text-[11px] text-rose-700 font-medium">
                                Hapus permanen?
                              </span>
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleDeletePost(post.id)}
                                className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-0.5 rounded transition disabled:opacity-50"
                              >
                                {isDeleting ? '...' : 'Ya, Hapus'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPostToDelete(null)}
                                className="text-[11px] text-neutral-600 hover:text-neutral-900 px-1 font-medium"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              id={`delete-post-btn-${post.id}`}
                              onClick={() => setPostToDelete(post.id)}
                              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition font-medium"
                              title="Hapus postingan ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
