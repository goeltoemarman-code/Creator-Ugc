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
            h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 20px; }
            p { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 16px; text-align: justify; }
            ul, ol { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 16px; padding-left: 20px; }
            li { margin-bottom: 6px; }
            .audio-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
            .audio-btn { background: #4f46e5; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; text-decoration: none; }
            .legal-box { background: #f1f5f9; border-left: 4px solid #64748b; padding: 16px; border-radius: 0 8px 8px 0; font-size: 12px; color: #475569; margin-top: 20px; }
            .pdf-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 700; }
            .quiz-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 12px; }
            .quiz-title { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
            .quiz-options { color: #475569; line-height: 1.5; }
          </style>
        </head>
        <body>
          <!-- HALAMAN 1: COVER -->
          <div class="page cover-page">
            <div>
              <span class="cover-badge">E-Book & Guide Seri Premium</span>
              <h1 class="cover-title">${bookTitle}</h1>
              <p class="cover-subtitle">Panduan langkah-demi-langkah terlengkap untuk mengeksekusi strategi, memvalidasi hasil, dan meningkatkan omzet penjualan produk digital secara konsisten.</p>
            </div>
            <div class="cover-footer">
              <div style="font-weight: 700; color: #ffffff; font-size: 14px;">PENULIS & PUBLISHER: ${authorName}</div>
              <div style="margin-top: 4px;">Kategori: ${category} • Dokumen Resmi Terverifikasi untuk Lynk.id</div>
            </div>
          </div>

          <!-- HALAMAN 2: LEGALITAS & PENDAHULUAN -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">HAK CIPTA & DISCLAIMER HUKUM</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 2</span>
            </div>
            <p><strong>Hak Cipta © ${currentYear} oleh ${authorName}.</strong> Seluruh hak cipta dilindungi undang-undang.</p>
            <div class="legal-box">
              <strong>Pemberitahuan Hak Cipta & Batasan Tanggung Jawab:</strong><br/>
              Tidak ada bagian dari publikasi ini yang boleh direproduksi atau ditransmisikan dalam bentuk apa pun tanpa izin tertulis dari penerbit. Informasi dalam e-book ini ditujukan khusus untuk edukasi dan panduan praktis operasional.
            </div>
            <div class="section-header" style="margin-top: 30px;">
              <span class="section-tag">KATA PENGANTAR</span>
            </div>
            <p>Selamat datang di panduan eksekutif <strong>${bookTitle}</strong>. E-book ini disusun secara sistematis untuk memberikan peta jalan (roadmap) konkrit yang bisa langsung dieksekusi tanpa perlu menghabiskan waktu dengan uji coba yang gagal.</p>
            <p>Riset membuktikan bahwa keberhasilan dalam ekosistem digital bertumpu pada 3 pilar: Optimasi Traffic, Konversi Penjualan, dan Retensi Pelanggan. Buku ini membedah ketiganya hingga ke tatanan praktis.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName} • All Rights Reserved</span>
              <span>Dokumen Resmi</span>
            </div>
          </div>

          <!-- HALAMAN 3: DAFTAR ISI & AUDIOBOOK -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">DAFTAR ISI & AUDIOBOOK RESMI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 3</span>
            </div>
            <div class="audio-box">
              <div>
                <strong style="font-size: 13px;">Panduan Audio Versi Ringkas</strong><br/>
                <span style="font-size: 11px; color: #64748b;">Mendengarkan penjelas rangkuman seluruh modul e-book</span>
              </div>
              <a href="#" class="audio-btn">▶ Play Audio</a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Modul Pembelajaran</th>
                  <th>Bab & Topik</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Modul 1</td><td>Bab 1: Riset & Algoritma Utama</td><td>Lengkap (Halaman 4)</td></tr>
                <tr><td>Modul 2</td><td>Bab 2: Strategi Optimasi & Penjualan</td><td>Lengkap (Halaman 5)</td></tr>
                <tr><td>Modul 3</td><td>Bab 3: Evaluasi & Skala Bisnis</td><td>Lengkap (Halaman 6)</td></tr>
                <tr><td>Modul Evaluasi</td><td>Ujian Evaluasi Pemahaman (20 Soal)</td><td>Lengkap (Halaman 7-8)</td></tr>
              </tbody>
            </table>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Navigasi Dokumen</span>
            </div>
          </div>

          <!-- HALAMAN 4: BAB 1 -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 1: FONDAKSI UTAMA & ALGORITMA</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 4</span>
            </div>
            <h2>1.1 Memahami Cara Kerja & Pilar Sukses</h2>
            <p>Langkah pertama dalam mengeksekusi strategi <strong>${bookTitle}</strong> adalah memahami bagaimana sistem rekomendasi bekerja. Sebagian besar orang gagal karena hanya fokus pada promosi tanpa memperbaiki pondasi dasar penawaran mereka.</p>
            <h3>Tiga Komponen Utama:</h3>
            <ul>
              <li><strong>Impressions (Jangkauan):</strong> Seberapa banyak calon pembeli melihat produk atau penawaran Anda.</li>
              <li><strong>Click-Through Rate (CTR):</strong> Persentase audiens yang tertarik untuk mengklik produk setelah melihat judul dan thumbnail.</li>
              <li><strong>Conversion Rate (CR):</strong> Persentase pengunjung yang akhirnya melakukan transaksi pembeli.</li>
            </ul>
            <p>Guna memaksimalkan GMV (Gross Merchandise Value), fokus awal harus dialokasikan untuk menaikkan Conversion Rate melalui tampilan gambar yang menarik serta deskripsi penawaran yang jelas.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Modul 1</span>
            </div>
          </div>

          <!-- HALAMAN 5: BAB 2 -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 2: STRATEGI EKSEKUSI & KONVERSI</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 5</span>
            </div>
            <h2>2.1 Langkah-Langkah Menggenjot Penjualan</h2>
            <p>Guna meningkatkan performa secara signifikan, ikuti metode praktis yang terbukti meningkatkan penjualan berikut:</p>
            <ol>
              <li><strong>A/B Testing Thumbnail & Judul:</strong> Uji 2 versi gambar produk. Gunakan warna yang kontras dan tulisan penawaran yang menonjol.</li>
              <li><strong>Pemanfaatan Fitur Promosi & Voucher:</strong> Berikan voucher diskon khusus pembeli pertama untuk menekan angka keraguan calon pembeli.</li>
              <li><strong>Live Stream & Konten Pendek:</strong> Konsistensi menyajikan konten berdurasi singkat yang menunjukkan manfaat nyata produk secara langsung.</li>
            </ol>
            <p>Penerapan disiplin pada 3 aspek di atas secara simultan terbukti mampu menaikkan nilai transaksi harian hingga 200% dalam rentang waktu 30 hari.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Modul 2</span>
            </div>
          </div>

          <!-- HALAMAN 6: BAB 3 -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">BAB 3: SKALABILITAS & PERTUMBUHAN BERKELANJUTAN</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 6</span>
            </div>
            <h2>3.1 Melipatgandakan Hasil (Scale Up)</h2>
            <p>Setelah tingkat konversi stabil, saatnya melakukan pembesaran skala operasional. Fokus pada otomatisasi dan perluasan saluran promosi.</p>
            <p>Pastikan Anda selalu memantau indikator kinerja utama (KPI) harian. Jika angka CTR turun, segera perbarui materi promosi visual. Jika CR turun, evaluasi ulasan produk dan kesesuaian harga dibanding pesaing.</p>
            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Modul 3</span>
            </div>
          </div>

          <!-- HALAMAN 7: UJIAN 20 SOAL (BAGIAN 1) -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">UJIAN EVALUASI PEMAHAMAN (SOAL 1 - 10)</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 7</span>
            </div>
            <p>Jawablah pertanyaan berikut untuk menguji tingkat pemahaman Anda terhadap isi e-book ini:</p>
            
            <div class="quiz-item">
              <div class="quiz-title">1. Apa tiga pilar utama keberhasilan penjualan digital?</div>
              <div class="quiz-options">A. Traffic, Konversi, Retensi | B. Modal, Iklan, Diskon | C. Gambar, Harga, Kurir | D. Live, Video, Komentar</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">2. Istilah CTR merujuk pada...</div>
              <div class="quiz-options">A. Jumlah Pembelian | B. Rasio Klik dibanding Tampilan | C. Biaya Iklan | D. Rating Toko</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">3. Apa fungsi utama pemberian voucher pembeli pertama?</div>
              <div class="quiz-options">A. Menghabiskan stok | B. Menekan keraguan awal pembeli | C. Menaikkan harga | D. Menambah pengikut</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">4. Faktor apa yang paling memengaruhi CTR pada tampilan produk?</div>
              <div class="quiz-options">A. Jumlah halaman | B. Thumbnail dan Judul Kontras | C. Alamat Penjual | D. Jam Buka Toko</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">5. Jika Conversion Rate (CR) menurun, tindakan apa yang tepat dilakukan?</div>
              <div class="quiz-options">A. Evaluasi ulasan & kesesuaian harga | B. Hapus produk | C. Naikkan harga 2x lipat | D. Ganti nama toko</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">6. Apa fungsi utama dari A/B testing?</div>
              <div class="quiz-options">A. Mencoba 2 opsi untuk mencari hasil terbaik | B. Membuat 2 toko | C. Membayar 2 kali | D. Mengirim 2 paket</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">7. Komponen apa yang mengukur persentase pengunjung menjadi pembeli?</div>
              <div class="quiz-options">A. Impression | B. Conversion Rate (CR) | C. ROI | D. GMV</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">8. Mengapa konten durasi singkat sangat efektif?</div>
              <div class="quiz-options">A. Murah | B. Memperlihatkan manfaat langsung | C. Mudah dibuat tanpa hp | D. Tidak perlu modal</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">9. Apa tujuan utama dari fase Scale Up?</div>
              <div class="quiz-options">A. Melipatgandakan hasil yang sudah terbukti | B. Mengubah bisnis | C. Menutup toko | D. Menjual aset</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">10. Indikator utama yang menunjukkan jangkauan promosi adalah...</div>
              <div class="quiz-options">A. Impressions | B. Checkout | C. Chat | D. Retur</div>
            </div>

            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Ujian Bagian 1</span>
            </div>
          </div>

          <!-- HALAMAN 8: UJIAN 20 SOAL (BAGIAN 2) & KUNCI JAWABAN -->
          <div class="page">
            <div class="section-header">
              <span class="section-tag">UJIAN EVALUASI PEMAHAMAN (SOAL 11 - 20) & KUNCI JAWABAN</span>
              <span style="font-size: 11px; color: #94a3b8;">Halaman 8</span>
            </div>
            
            <div class="quiz-item">
              <div class="quiz-title">11. Strategi apa yang paling ampuh menaikkan nilai rata-rata transaksi?</div>
              <div class="quiz-options">A. Bundling produk | B. Turunkan kualitas | C. Batasi stok | D. Matikan iklan</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">12. Mengapa ulasan pembeli sangat krusial bagi produk digital/fisik?</div>
              <div class="quiz-options">A. Menambah bukti sosial (social proof) | B. Memenuhi syarat aplikasi | C. Menambah kuota | D. Syarat klaim</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">13. Apa tindakan pertama jika iklan tidak menghasilkan penjualan?</div>
              <div class="quiz-options">A. Cek kesesuaian target audiens & penawaran | B. Tambah anggaran 10x | C. Diamkan saja | D. Buat akun baru</div>
            </div>
            <div class="quiz-item">
              <div class="quiz-title">14-20. Latihan Praktis Mandiri & Evaluasi Personal</div>
              <div class="quiz-options">
                14. Tuliskan 3 judul promosi menarik milikmu.<br/>
                15. Tentukan target pasar produkmu secara spesifik.<br/>
                16. Berapa target GMV harian yang ingin dicapai?<br/>
                17. Penawaran bonus apa yang bisa kamu tambahkan?<br/>
                18. Jadwal rutin pembuatan konten promosi mingguan.<br/>
                19. Metode followup calon pembeli yang belum checkout.<br/>
                20. Evaluasi harian rasio konversi produk.
              </div>
            </div>

            <div style="margin-top: 20px; background: #e0e7ff; border: 1px solid #c7d2fe; padding: 12px; border-radius: 8px; font-size: 11px; color: #3730a3;">
              <strong>Kunci Jawaban Singkat (1-13):</strong> 1.A | 2.B | 3.B | 4.B | 5.A | 6.A | 7.B | 8.B | 9.A | 10.A | 11.A | 12.A | 13.A
            </div>

            <div class="pdf-footer">
              <span>© ${currentYear} ${authorName}</span>
              <span>Dokumen Lengkap Tuntas</span>
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
              Ketik Judul E-Book kamu. AI akan merancang Cover, Legalitas, Bab Inti Lengkap, Audio Player, dan Ujian 20 Soal secara otomatis.
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
                placeholder="Contoh: Panduan cara meningkatkan GMV shopee"
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
                  <span>Generate E-Book PDF Siap Jual (8 Halaman Utuh)</span>
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
              <span>Bab 1 - Bab 3 Utuh</span>
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

