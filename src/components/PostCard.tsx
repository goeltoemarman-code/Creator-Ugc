import React, { useState, useMemo } from 'react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { checkContentModeration } from '../utils/moderation';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Send,
  Tag,
  Clock,
  Check,
  AlertCircle,
  Wand2,
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
  const { firebaseUser, token, signInWithGoogle } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Fungsi Ekspor E-Book / Digital Product Siap Jual
  const handleExportPDF = () => {
    const contentText = post.content || '';
    const authorName = post.author?.name || 'Kreator Digital';
    const categoryName = post.category || 'Panduan E-Commerce & UGC';
    const titleText = post.title || 'Panduan Strategi Konten & Desain Digital';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>${titleText} - Digital E-Book</title>
          <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background-color: #ffffff; }
            .page { width: 210mm; min-height: 297mm; padding: 25mm 20mm; box-sizing: border-box; page-break-after: always; position: relative; }
            .cover-page { background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; height: 297mm; }
            .cover-badge { display: inline-block; background: rgba(99, 102, 241, 0.25); border: 1px solid #818cf8; color: #c7d2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 20px; }
            .cover-title { font-size: 28px; font-weight: 800; line-height: 1.3; margin: 20px 0; color: #ffffff; }
            .cover-footer { border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 20px; font-size: 13px; color: #94a3b8; }
            .section-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .section-tag { font-size: 12px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px; }
            .main-body { font-size: 15px; line-height: 1.8; color: #334155; white-space: pre-wrap; word-wrap: break-word; }
            .key-takeaway { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0; }
            .key-takeaway h4 { margin: 0 0 6px 0; color: #15803d; font-size: 14px; }
            .worksheet-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin-top: 30px; }
            .checklist-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #475569; }
            .checkbox { width: 16px; height: 16px; border: 1.5px solid #94a3b8; border-radius: 4px; }
            .pdf-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="page cover-page">
            <div>
              <span class="cover-badge">E-Book & Guide Seri Premium</span>
              <h1 class="cover-title">${titleText}</h1>
              <p style="color: #cbd5e1; font-size: 15px; max-width: 500px;">Panduan eksekutif dan materi instruksional untuk praktisi digital & kreator konten.</p>
            </div>
            <div class="cover-footer">
              <div style="font-weight: 600; color: #ffffff; margin-bottom: 4px;">Penulis: ${authorName}</div>
              <div>Kategori: ${categoryName} • Lisensi Komersial Lynk.id</div>
            </div>
          </div>
          <div class="page">
            <div class="section-header">
              <span class="section-tag">Modul Pembelajaran Utama</span>
              <span style="font-size: 12px; color: #94a3b8;">KreatorHub Publisher</span>
            </div>
            <div class="main-body">${contentText}</div>
            <div class="key-takeaway">
              <h4>💡 Ringkasan Poin Penting (Key Takeaways)</h4>
              <p style="margin: 0; font-size: 13.5px; color: #166534;">
                Gunakan panduan ini sebagai standar operasional pembuatan materi. Pastikan aspek visual dan pesan utama tersampaikan secara terstruktur sebelum dipublikasikan.
              </p>
            </div>
            <div class="worksheet-box">
              <h4 style="margin: 0 0 14px 0; color: #1e293b; font-size: 14px;">📋 Lembar Kerja & Checklist Eksekusi:</h4>
              <div class="checklist-item"><div class="checkbox"></div> Pahami konteks dan pesan utama materi.</div>
              <div class="checklist-item"><div class="checkbox"></div> Terapkan poin-poin rekomendasi ke dalam draf atau proyek kamu.</div>
              <div class="checklist-item"><div class="checkbox"></div> Evaluasi hasil akhir sebelum dipublikasikan/dijual.</div>
            </div>
            <div class="pdf-footer">
              <span>© ${new Date().getFullYear()} ${authorName} • All Rights Reserved</span>
              <span>Dokumen Digital Resmi</span>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  };

  const commentModeration = useMemo(() => {
    return checkContentModeration(commentInput);
  }, [commentInput]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!firebaseUser || !token) {
      await signInWithGoogle();
      return;
    }

    if (!commentModeration.isClean) {
      setCommentError(
        `Moderasi Otomatis: Komentar memuat kata tidak pantas (${commentModeration.flaggedWords.join(', ')}). Mohon sensor atau ubah kata tersebut.`
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
      className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Header: Author Info & Timestamp */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={post.author?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-neutral-900 text-sm">{post.author?.name || 'Pengguna'}</h3>
                {post.author?.handle && (
                  <span className="text-xs text-neutral-400 font-normal">@{post.author.handle}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {post.createdAt}
                </span>
                <span>•</span>
                <span className="bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Title & Content */}
      <div className="px-4 sm:px-5 pb-3">
        {post.title && (
          <h2 className="font-bold text-neutral-900 text-base sm:text-lg mb-2 leading-snug">
            {post.title}
          </h2>
        )}
        <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md"
              >
                <Tag className="w-2.5 h-2.5 text-neutral-400" />
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Attachment */}
      {post.imageUrl && (
        <div className="px-4 sm:px-5 pb-3">
          <img
            src={post.imageUrl}
            alt="Attachment"
            className="w-full max-h-96 object-cover rounded-xl border border-neutral-200/80"
          />
        </div>
      )}

      {/* Interaction Bar */}
      <div className="px-4 sm:px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between text-neutral-500 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLiking(!isLiking)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLiking ? 'text-rose-600' : 'hover:text-neutral-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiking ? 'fill-current text-rose-600' : ''}`} />
            <span>{post.likes + (isLiking ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 font-medium hover:text-neutral-900 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments?.length || 0}</span>
          </button>

          <button
            onClick={() => onToggleBookmark(post.id)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              post.isBookmarked ? 'text-amber-600' : 'hover:text-neutral-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current text-amber-500' : ''}`} />
          </button>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 font-medium hover:text-neutral-900 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
        </button>
      </div>

      {/* TOMBOL E-BOOK/PDF PREMIUM (TAMPIL DI SETIAP POSTINGAN) */}
      <div className="px-4 sm:px-5 py-3 bg-indigo-50/40 border-t border-indigo-100/60">
        <button
          onClick={handleExportPDF}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl transition-all shadow-sm"
          title="Ekspor ke E-Book PDF Siap Jual"
        >
          <Wand2 className="w-4 h-4 text-amber-300" />
          <span>Generate PDF Premium (Siap Jual)</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-100">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                  <img
                    src={comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={comment.author?.name || 'User'}
                    className="w-6 h-6 rounded-full object-cover mt-0.5 border border-neutral-200"
                  />
                  <div className="bg-white border border-neutral-200/80 rounded-xl p-2.5 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900">{comment.author?.name || 'Pengguna'}</span>
                      <span className="text-[10px] text-neutral-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 italic text-center py-2">Belum ada komentar.</p>
            )}
          </div>

          {/* Input Comment */}
          <form onSubmit={handleCommentSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  firebaseUser
                    ? `Tulis komentar sebagai ${firebaseUser.displayName}...`
                    : 'Masuk dengan Google untuk memberi komentar...'
                }
                value={commentInput}
                onChange={(e) => {
                  setCommentInput(e.target.value);
                  if (commentError) setCommentError('');
                }}
                className={`flex-1 px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-none transition text-neutral-800 ${
                  !commentModeration.isClean
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900/10'
                }`}
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmittingComment || !commentModeration.isClean}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmittingComment ? '...' : 'Kirim'}</span>
              </button>
            </div>

            {/* Moderation Warning */}
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
                  className="flex items-center gap-1 bg-white hover:bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-300 font-medium"
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
        </div>
      )}
    </article>
  );
};
