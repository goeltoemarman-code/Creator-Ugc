import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, SAMPLE_IMAGE_PRESETS } from '../data/initialData';
import { checkContentModeration } from '../lib/moderation';
import {
  X,
  Image as ImageIcon,
  Tag,
  Sparkles,
  LogIn,
  AlertTriangle,
  ShieldCheck,
  Check,
  Wand2,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const { firebaseUser, token, signInWithGoogle } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Teknologi');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['kreator', 'opini']);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showImagePresets, setShowImagePresets] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live content moderation check
  const moderation = useMemo(() => {
    return checkContentModeration(content);
  }, [content]);

  if (!isOpen) return null;

  const handleAddTag = (newTag: string) => {
    const cleaned = newTag.trim().replace(/^#/, '').toLowerCase();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Auto-censor button to fix content instantly
  const handleApplyCensor = () => {
    setContent(moderation.sanitizedText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!firebaseUser || !token) {
      setServerError('Anda harus masuk dengan akun Google untuk mempublikasikan konten.');
      return;
    }

    if (!content.trim()) {
      setServerError('Konten postingan tidak boleh kosong.');
      return;
    }

    // Client-side moderation gate
    if (!moderation.isClean) {
      setServerError(
        `Moderasi Otomatis: Konten mengandung kata tidak pantas (${moderation.flaggedWords.join(
          ', '
        )}). Gunakan tombol "Sensor Otomatis" atau ubah kata tersebut.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          category,
          tags,
          mediaUrl: mediaUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan postingan ke database.');
      }

      // Reset form on success
      setContent('');
      setCategory('Teknologi');
      setTags(['kreator', 'opini']);
      setMediaUrl('');
      setServerError('');
      setImageError(false);
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submit post error:', err);
      setServerError(err.message || 'Terjadi kesalahan saat mempublikasikan postingan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="create-post-modal"
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Buat Postingan Komunitas</h2>
              <p className="text-[11px] text-neutral-500">Tersimpan di Cloud SQL dengan filter moderasi</p>
            </div>
          </div>
          <button
            id="close-create-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Auth Banner if not logged in */}
          {!firebaseUser ? (
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <LogIn className="w-4 h-4" />
                <span>Masuk Diperlukan</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Untuk mempublikasikan konten baru, silakan hubungkan akun Google Anda dengan sekali klik.
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-3.5 py-1.5 rounded-lg transition text-xs shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk dengan Google
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <img
                src={
                  firebaseUser.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={firebaseUser.displayName || 'User'}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {firebaseUser.displayName || 'Kreator Terdaftar'}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">{firebaseUser.email}</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Akun Terverifikasi
              </span>
            </div>
          )}

          {/* Post Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">
                Teks Postingan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-neutral-400">{content.length} karakter</span>
            </div>
            <textarea
              id="post-content-textarea"
              rows={4}
              placeholder="Tuliskan pengalaman, pandangan, wawasan teknis, atau ide karyamu di sini..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (serverError) setServerError('');
              }}
              className={`w-full p-3 text-sm bg-white border rounded-xl focus:outline-none transition text-neutral-800 placeholder:text-neutral-400 resize-none ${
                !moderation.isClean
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900'
              }`}
            />

            {/* Live Moderation Status Indicator */}
            <div className="mt-2">
              {!moderation.isClean ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-rose-900">
                        Sistem Moderasi: Terdeteksi Kata Tidak Pantas
                      </p>
                      <p className="text-rose-700 mt-0.5 leading-relaxed">
                        Kata yang melanggar standar komunitas:{' '}
                        <span className="font-semibold bg-rose-200/60 px-1 py-0.5 rounded">
                          {moderation.flaggedWords.join(', ')}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-rose-200/60 text-xs">
                    <span className="text-rose-700 text-[11px]">
                      Sensor kata ini secara otomatis agar dapat diterbitkan:
                    </span>
                    <button
                      type="button"
                      onClick={handleApplyCensor}
                      className="flex items-center gap-1 font-semibold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-lg transition text-[11px] shadow-xs"
                    >
                      <Wand2 className="w-3 h-3 text-amber-600" />
                      Sensor Otomatis (***)
                    </button>
                  </div>
                </div>
              ) : content.length > 5 ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Konten memenuhi panduan komunitas (bersih dari kata kasar).</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Pilih Kategori
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter((c) => c.id !== 'Semua').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                    category === cat.id
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Topik / Label
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ketik tag lalu tekan Enter (misal: teknologi, ide)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 text-neutral-800 placeholder:text-neutral-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg transition font-semibold"
              >
                + Tambah
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Link & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">
                Link Gambar Media (URL)
              </label>
              <button
                type="button"
                onClick={() => setShowImagePresets(!showImagePresets)}
                className="text-[11px] text-neutral-600 hover:text-neutral-900 underline font-medium"
              >
                {showImagePresets ? 'Tutup Pilihan Contoh' : 'Pilih dari Contoh Gambar'}
              </button>
            </div>

            <div className="relative">
              <ImageIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="media-url-input"
                type="url"
                placeholder="Tempelkan tautan URL gambar (https://...)"
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  setImageError(false);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 text-neutral-800 placeholder:text-neutral-400"
              />
            </div>

            {/* Quick Sample Image Presets */}
            {showImagePresets && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setMediaUrl(preset.url);
                      setImageError(false);
                      setShowImagePresets(false);
                    }}
                    className="group text-left rounded-lg overflow-hidden border border-neutral-200 bg-white hover:border-neutral-900 transition"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-14 object-cover group-hover:opacity-90"
                    />
                    <p className="text-[10px] font-medium text-neutral-700 p-1 truncate text-center">
                      {preset.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Media Image Preview */}
            {mediaUrl && !imageError && (
              <div className="mt-2.5 relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 max-h-48">
                <img
                  src={mediaUrl}
                  alt="Pratinjau Media"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover"
                  onError={() => setImageError(true)}
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-900 text-white p-1 rounded-full text-xs"
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {imageError && (
              <p className="text-[11px] text-rose-500 mt-1">
                URL gambar tidak valid atau gambar tidak dapat diakses langsung.
              </p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={isSubmitting || !firebaseUser || !moderation.isClean}
              className="px-5 py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition flex items-center gap-1.5 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Publikasikan Konten</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
