import React, { useState } from 'react';
import { BookOpen, Sparkles, Wand2, CheckCircle2, Music, Layers, ShieldCheck } from 'lucide-react';

export function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Bisnis Digital & AI');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = () => {
    if (!title.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const bookTitle = title.trim();
      const authorName = author.trim() || 'Kreator Digital';
      const currentYear = new Date().getFullYear();

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setIsGenerating(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>${bookTitle} - E-Book Premium</title>
          <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background-color: #ffffff; }
            .page { width: 210mm; min-height: 297mm; padding: 25mm 20mm; box-sizing: border-box; page-break-after: always; position: relative; }
            .cover-page { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; height: 297mm; }
            .cover-badge { display: inline-block; background: rgba(99, 102, 241, 0.25); border: 1px solid #818cf8; color: #c7d2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 6px 16px; border-radius: 20px; }
            .cover-title { font-size: 32px; font-weight: 800; line-height: 1.25; margin: 24px 0 16px 0; color: #ffffff; }
            .cover-subtitle { font-size: 15px; color: #94a3b8; line-height: 1.6; max-width: 500px; }
            .cover-footer { border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 20px; font-size: 13px; color: #cbd5e1; }
            .section-tag { font-size: 11px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 1px; }
            .section-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; }
            p { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 16px; }
            .audio-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
            .audio-btn { background: #4f46e5; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; text-decoration: none; }
            .legal-box { background: #f1f5f9; border-left: 4px solid #64748b; padding: 16px; border-radius: 0 8px 8px 0; font-size: 12px; color: #475569; margin-top: 20px; }
            .pdf-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 700; }
            .checklist-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; color: #334155; }
            .checkbox { width: 14px; height: 14px; border: 1.5px solid #64748b; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="page cover-page">
            <div>
              <span class="cover-badge">E-Book & Guide Seri Premium</span>
              <h1 class="cover-title">${bookTitle}</h1>
              <p class="cover-subtitle">Panduan langkah-demi-langkah terlengkap untuk mengeksekusi strategi, memvalidasi hasil, dan membangun aset digital bernilai tinggi.</p>
            </div>
            <div class="cover-footer">
              <div style="font-weight: 700; color: #ffffff; font-size: 14px;">PENULIS & PUBLISHER: ${authorName}</div>
              <div style="margin-top: 4px;">Kategori: ${category} • Dokumen Resmi Terverifikasi untuk Lynk.id</div>
            </div>
          </div>
          <div class="page">
            <div class="section-header">
              <span class="section-tag">HAK CIPTA & DISCLAIMER HUKUM</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 2</span>
            </div>
            <p><strong>Hak Cipta © ${currentYear} oleh ${authorName}.</strong> Seluruh hak cipta dilindungi undang-undang.</p>
            <div class="legal-box">
              <strong>Pemberitahuan Hak Cipta & Batasan Tanggung Jawab:</strong><br/>
              Tidak ada bagian dari publikasi ini yang boleh direproduksi atau ditransmisikan dalam bentuk apa pun tanpa izin tertulis dari penerbit. Informasi dalam e-book ini ditujukan khusus untuk edukasi dan panduan praktis.
            </div>
            <div class="section-header" style="margin-top: 40px;">
              <span class="section-tag">KATA PENGANTAR & PENDAHULUAN</span>
            </div>
            <p>Selamat datang di panduan eksekutif <strong>${bookTitle}</strong>. Buku ini dirancang untuk memangkas kurva belajar Anda secara drastis melalui alur kerja terstruktur yang langsung fokus pada eksekusi nyata.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName} • All Rights Reserved</span>
              <span>E-Book Digital Resmi</span>
            </div>
          </div>
          <div class="page">
            <div class="section-header">
              <span class="section-tag">DAFTAR ISI & AUDIOBOOK RESMI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 3</span>
            </div>
            <div class="audio-box">
              <div>
                <strong style="font-size: 13px;">BAB 1: Memahami Fondasi Utama</strong><br/>
                <span style="font-size: 11px; color: #64748b;">Durasi: ~5 Menit • Narasi Audio Digital</span>
              </div>
              <a href="#" class="audio-btn">▶ Dengarkan Audio</a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Modul Pembelajaran</th>
                  <th>Tipe Aset</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Bab 1: Memahami Fondasi Utama</td><td>Isi Inti</td><td>Terverifikasi</td></tr>
                <tr><td>Lembar Kerja Interaktif (Worksheet)</td><td>Praktek</td><td>Siap Pakai</td></tr>
                <tr><td>Ujian Evaluasi Pemahaman (20 Soal)</td><td>Evaluasi</td><td>Kunci Jawaban (+)</td></tr>
              </tbody>
            </table>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Navigasi Dokumen</span>
            </div>
          </div>
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 1: MEMAHAMI FONDASI UTAMA</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 4</span>
            </div>
            <h2>1.1 Prinsip Dasar & Strategi Operasional</h2>
            <p>Memasuki pembahasan utama pada topik <strong>${bookTitle}</strong>, keberhasilan bertumpu pada konsistensi penerapan prinsip dasar.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Modul Utama</span>
            </div>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        setIsGenerating(false);
      }, 600);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none">Lynk.id E-Book Studio AI</h1>
            <p className="text-xs text-slate-400 mt-1">Generator Digital Product Premium Siap Jual</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Format E-Book A4 Standar ISO</span>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Buat Produk Digital Baru</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Ketik Judul E-Book kamu. AI akan merancang Cover, Legalitas, Bab Inti, Audio Player, dan Worksheet lengkap secara otomatis.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Judul E-Book / Produk Digital *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Panduan Strategi TikTok Affiliate 2026"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Nama Penulis / Publisher
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Eva S."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Kategori Produk
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Bisnis Digital & AI">Bisnis Digital & AI</option>
                  <option value="Panduan E-Commerce & UGC">Panduan E-Commerce & UGC</option>
                  <option value="Pemasaran & Media Sosial">Pemasaran & Media Sosial</option>
                  <option value="Keuangan & Investasi">Keuangan & Investasi</option>
                  <option value="Pengembangan Diri">Pengembangan Diri</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={!title.trim() || isGenerating}
              className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-5 h-5 animate-spin text-amber-300" />
                  <span>Sedang Memproses E-Book Utuh...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate E-Book PDF Siap Jual</span>
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cover & Legalitas</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Audio Player</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Worksheet</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ujian 20 Soal</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Lynk.id Digital Product Generator • Ekspor PDF A4 Komersial
      </footer>
    </div>
  );
}
