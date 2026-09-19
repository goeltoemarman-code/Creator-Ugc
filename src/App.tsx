import React, { useState } from 'react';
import { BookOpen, Sparkles, Wand2, ShieldCheck, Layers, FileText } from 'lucide-react';

export function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Umum & Panduan Praktis');
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
          <title>${bookTitle} - E-Book Panduan</title>
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
            h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin-top: 20px; }
            p { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 16px; text-align: justify; }
            ul, ol { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 16px; padding-left: 20px; }
            li { margin-bottom: 8px; }
            .legal-box { background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 14px; border-radius: 0 8px 8px 0; font-size: 12px; color: #475569; margin: 20px 0; }
            .pdf-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
            .box-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-size: 12.5px; }
          </style>
        </head>
        <body>
          <!-- HALAMAN 1: COVER -->
          <div class="page cover-page">
            <div>
              <span class="cover-badge">Panduan Praktis & Integratif</span>
              <h1 class="cover-title">${bookTitle}</h1>
              <p class="cover-subtitle">Panduan terstruktur yang menyajikan pemahaman mendalam, strategi pelaksanaan, serta langkah-langkah praktis untuk mempermudah pencapaian target Anda secara terukur.</p>
            </div>
            <div class="cover-footer">
              <div style="font-weight: 700; color: #ffffff; font-size: 14px;">PENULIS / PUBLISHER: ${authorName}</div>
              <div style="margin-top: 4px;">Kategori: ${category} • E-Book Edukasi Praktis</div>
            </div>
          </div>

          <!-- HALAMAN 2: PENDAHULUAN & PENGERTIAN -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 1: GAMBARAN UMUM & PONDASI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 2</span>
            </div>
            <h2>1.1 Pengenalan Pentingnya "${bookTitle}"</h2>
            <p>Selamat datang di modul panduan <strong>${bookTitle}</strong>. Di era yang menuntut efisiensi dan ketepatan langkah, memahami dasar-dasar topik ini menjadi aspek penting untuk meminimalkan kesalahan dan menghemat waktu.</p>
            <p>Banyak praktisi atau pemula menghadapi kendala karena tidak memiliki kerangka kerja yang jelas. Melalui panduan ini, Anda akan dipandu memahami alur proses secara bertahap mulai dari persiapan dasar hingga tahap pelaksanaan akhir.</p>
            
            <div class="legal-box">
              <strong>Prinsip Utama:</strong><br/>
              Keberhasilan dalam menjalankan panduan <em>${bookTitle}</em> sangat bergantung pada konsistensi, pemahaman konteks, serta evaluasi berkala terhadap hasil yang diperoleh.
            </div>

            <h3>3 Elemen Kunci yang Perlu Dipahami:</h3>
            <ul>
              <li><strong>Persiapan Awal:</strong> Mengidentifikasi kebutuhan utama, alat pendukung, serta menetapkan sasaran realistis yang ingin dicapai.</li>
              <li><strong>Pola Eksekusi:</strong> Menjalankan tahapan secara berurutan tanpa melompati langkah-langkah krusial.</li>
              <li><strong>Pemantauan & Penyesuaian:</strong> Menilai progres harian/mingguan dan melakukan perbaikan jika terjadi kendala.</li>
            </ul>

            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Bab 1 - Pendahuluan</span>
            </div>
          </div>

          <!-- HALAMAN 3: STRATEGI & LANGKAH EKSEKUSI -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 2: METODE DAN STRATEGI EKSEKUSI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 3</span>
            </div>
            <h2>2.1 Tahapan Eksekusi Langkah demi Langkah</h2>
            <p>Untuk memastikan proses mengenai <strong>${bookTitle}</strong> berjalan optimal, ikuti alur praktis yang telah disusun berikut:</p>
            
            <ol>
              <li><strong>Tahap Pemetaan (Persiapan):</strong> Susun rencana kerja dan kumpulkan semua informasi pendukung sebelum memulai. Pastikan target awal dapat diukur dengan jelas.</li>
              <li><strong>Tahap Penerapan (Eksekusi):</strong> Mulai terapkan rekomendasi teknis secara bertahap. Fokus pada kualitas proses agar hasil yang didapatkan stabil.</li>
              <li><strong>Tahap Evaluasi (Review):</strong> Amati perkembangan yang ada. Bandingkan kondisi saat ini dengan kondisi awal sebelum program dijalankan.</li>
            </ol>

            <p>Dengan menerapkan metode sistematis di atas, risiko kegagalan dapat ditekan secara signifikan, serta memudahkan Anda untuk mempertahankan hasil positif dalam jangka panjang.</p>

            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Bab 2 - Eksekusi</span>
            </div>
          </div>

          <!-- HALAMAN 4: LEMBAR EVALUASI & CHECKLIST -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 3: LEMBAR EVALUASI & CHECKLIST MANDIRI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 4</span>
            </div>
            <h2>3.1 Lembar Pemeriksaan Mandiri</h2>
            <p>Gunakan daftar periksa dan pertanyaan evaluasi berikut untuk memastikan Anda telah menerapkan materi <strong>${bookTitle}</strong> dengan benar:</p>

            <div class="box-item">
              <strong style="color:#0f172a;">1. Apakah sasaran awal sudah dirumuskan dengan spesifik?</strong>
              <p style="margin:4px 0 0 0; color:#64748b; font-size:11.5px;">Pastikan Anda mengetahui kondisi akhir yang ingin dicapai sebelum melangkah ke proses eksekusi.</p>
            </div>

            <div class="box-item">
              <strong style="color:#0f172a;">2. Seberapa konsisten penerapan langkah-langkah utama dilakukan?</strong>
              <p style="margin:4px 0 0 0; color:#64748b; font-size:11.5px;">Konsistensi harian jauh lebih efektif dibanding perubahan besar yang hanya bertahan sesaat.</p>
            </div>

            <div class="box-item">
              <strong style="color:#0f172a;">3. Langkah perbaikan apa yang diambil jika terjadi hambatan?</strong>
              <p style="margin:4px 0 0 0; color:#64748b; font-size:11.5px;">Lakukan pencatatan terhadap kendala yang ditemui lalu sesuaikan pendekatan berdasarkan hasil evaluasi.</p>
            </div>

            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Selesai</span>
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
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none">Universal E-Book Studio</h1>
            <p className="text-xs text-slate-400 mt-1">Generator Panduan PDF Semua Topik</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Buat E-Book Universal</h2>
            <p className="text-xs text-slate-400">
              Ketik judul topik apa saja. Generator akan merancang struktur materi yang sesuai dan natural secara otomatis.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Judul E-Book / Topik *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Cara cepat gemuk / Panduan Budidaya Lele / Strategi Bisnis"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Nama Penulis
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama kamu atau nama pena"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={!title.trim() || isGenerating}
              className="w-full mt-4 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span>Membuat PDF Universal...</span>
              ) : (
                <span>Generate PDF E-Book Universal</span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

