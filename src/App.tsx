import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Image as ImageIcon,
  Volume2,
  ShieldCheck,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Library,
  FileText,
} from "lucide-react";

type Source = {
  title: string;
  url: string;
  domain?: string;
};

type Section = {
  title: string;
  content: string;
  bullets?: string[];
  illustrationPrompt?: string;
};

type Chapter = {
  number: number;
  title: string;
  objective: string;
  sections: Section[];
};

type Ebook = {
  title: string;
  subtitle: string;
  author: string;
  audience: string;
  category: string;
  introduction: string;
  chapters: Chapter[];
  checklist: string[];
  worksheet: string[];
  actionPlan: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  conclusion: string;
  disclaimer: string;
  sources: Source[];
};

type Quality = {
  score: number;
  passed: boolean;
  errors: string[];
  warnings: string[];
};

export default function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("Indonesia");
  const [chapterCount, setChapterCount] = useState(6);

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [sources, setSources] = useState<Source[]>([]);

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const [images, setImages] = useState<
    { chapter: number; data: string }[]
  >([]);

  const [audios, setAudios] = useState<
    { chapter: number; data: string }[]
  >([]);

  async function researchTopic() {
    if (!title.trim()) {
      setError("Masukkan topik terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setStage("Mencari referensi online...");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          audience,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan riset.");
      }

      const data = await response.json();

      setSources(data.sources || []);
      setStage("Referensi berhasil dikumpulkan.");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function generateBook() {
    if (!title.trim()) {
      setError("Masukkan topik terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setStage("Menganalisis topik dan referensi...");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          audience,
          language,
          chapterCount,
          sources,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat ebook.");
      }

      const data = await response.json();

      setEbook(data.ebook);
      setSources(data.ebook.sources || sources);

      setStage("Melakukan Quality Control...");

      await runQualityCheck(data.ebook);

      setStage("Produk selesai dibuat.");
    } catch (err: any) {
      setError(err.message || "Gagal membuat produk.");
    } finally {
      setLoading(false);
    }
  }

  async function runQualityCheck(book: Ebook) {
    try {
      const response = await fetch("/api/quality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ebook: book,
        }),
      });

      if (!response.ok) {
        throw new Error("Quality Control gagal.");
      }

      const data = await response.json();

      setQuality(data);
    } catch (err: any) {
      setError(err.message || "Quality Control gagal.");
    }
  }

  async function generateImages() {
    if (!ebook) return;

    setLoading(true);
    setError("");

    try {
      const result: { chapter: number; data: string }[] = [];

      for (const chapter of ebook.chapters) {
        setStage(
          `Membuat ilustrasi Bab ${chapter.number} dari ${ebook.chapters.length}...`
        );

        const response = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: ebook.title,
            chapter,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Gagal membuat ilustrasi Bab ${chapter.number}.`
          );
        }

        const data = await response.json();

        result.push({
          chapter: chapter.number,
          data: data.image,
        });

        setImages([...result]);
      }
    } catch (err: any) {
      setError(err.message || "Gagal membuat ilustrasi.");
    } finally {
      setLoading(false);
      setStage("");
    }
  }

  async function generateAudio() {
    if (!ebook) return;

    setLoading(true);
    setError("");

    try {
      const result: { chapter: number; data: string }[] = [];

      for (const chapter of ebook.chapters) {
        setStage(
          `Membuat audio Bab ${chapter.number} dari ${ebook.chapters.length}...`
        );

        const text = chapter.sections
          .map((section) => {
            return `${section.title}. ${section.content}`;
          })
          .join("\n");

        const response = await fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            language,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Gagal membuat audio Bab ${chapter.number}.`
          );
        }

        const data = await response.json();

        result.push({
          chapter: chapter.number,
          data: data.audio,
        });

        setAudios([...result]);
      }
    } catch (err: any) {
      setError(err.message || "Gagal membuat audio.");
    } finally {
      setLoading(false);
      setStage("");
    }
  }

  function exportPDF() {
    if (!ebook || !quality?.passed) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Popup diblokir browser. Izinkan popup untuk aplikasi ini."
      );
      return;
    }

    printWindow.document.write(
      createPDFDocument(ebook, images, audios)
    );

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900 px-5 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl">
            <BookOpen />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              AI PDF Digital Product Factory
            </h1>

            <p className="text-xs text-slate-400">
              Research • Write • Illustrate • Audio • Quality Control
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-indigo-400" />

              <div>
                <h2 className="font-bold text-lg">
                  Konfigurasi Produk
                </h2>

                <p className="text-xs text-slate-400">
                  Masukkan satu topik dan biarkan AI membangun
                  struktur yang relevan.
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <div>
                <label className="text-xs font-bold uppercase">
                  Topik / Judul *
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Panduan Skripsi dari Nol sampai Sidang"
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase">
                  Penulis
                </label>

                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis / brand"
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase">
                  Target Pembaca
                </label>

                <textarea
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Contoh: mahasiswa semester akhir"
                  className="mt-2 w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase">
                  Bahasa
                </label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
                >
                  <option>Indonesia</option>
                  <option>English</option>
                  <option>Malay</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase">
                  Jumlah Bab
                </label>

                <select
                  value={chapterCount}
                  onChange={(e) =>
                    setChapterCount(Number(e.target.value))
                  }
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
                >
                  {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} Bab
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={researchTopic}
                disabled={loading || !title.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-bold flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                🔎 Cari Referensi Online
              </button>

              <button
                onClick={generateBook}
                disabled={loading || !title.trim()}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                📕 Buat PDF Lengkap
              </button>
            </div>

            {loading && (
              <div className="mt-5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="animate-spin text-indigo-400" />

                  <div>
                    <div className="font-bold text-sm">
                      AI sedang bekerja
                    </div>

                    <div className="text-xs text-slate-400">
                      {stage}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
                {error}
              </div>
            )}
          </section>

          {/* DASHBOARD */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            {!ebook ? (
              <div className="min-h-[500px] flex flex-col justify-center items-center text-center">
                <Library className="w-16 h-16 text-slate-700 mb-4" />

                <h2 className="font-bold text-lg">
                  Belum ada PDF
                </h2>

                <p className="text-sm text-slate-500 max-w-sm mt-2">
                  Mulai dengan mencari referensi atau langsung
                  membuat produk.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs text-indigo-400 font-bold">
                      PRODUK DIGITAL
                    </div>

                    <h2 className="font-bold text-xl mt-1">
                      {ebook.title}
                    </h2>
                  </div>

                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold">
                    {quality?.score || 0}/100
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <Stat
                    icon={<BookOpen />}
                    value={ebook.chapters.length}
                    label="Bab"
                  />

                  <Stat
                    icon={<Search />}
                    value={sources.length}
                    label="Sumber"
                  />

                  <Stat
                    icon={<ImageIcon />}
                    value={images.length}
                    label="Ilustrasi"
                  />

                  <Stat
                    icon={<Volume2 />}
                    value={audios.length}
                    label="Audio"
                  />

                </div>

                {/* SOURCES */}
                {sources.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-sm mb-3">
                      Referensi Online
                    </h3>

                    <div className="space-y-2">
                      {sources.slice(0, 8).map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-slate-950 border border-slate-800 rounded-xl p-3 hover:border-indigo-500"
                        >
                          <div className="text-xs font-bold">
                            {source.title}
                          </div>

                          <div className="text-[10px] text-slate-500 mt-1">
                            {source.domain || source.url}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUALITY */}
                <div className="mt-6">
                  <div className="flex gap-2 items-center mb-3">
                    <ShieldCheck className="text-emerald-400" />
                    <h3 className="font-bold">
                      Quality Control
                    </h3>
                  </div>

                  {quality?.passed ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300">
                      <CheckCircle2 className="inline w-4 h-4 mr-2" />
                      Struktur produk lolos pemeriksaan dasar.
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      {quality?.errors.map((item, i) => (
                        <div
                          key={i}
                          className="text-xs text-red-300 mb-2"
                        >
                          <AlertTriangle className="inline w-4 h-4 mr-1" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-6">

                  <button
                    onClick={generateImages}
                    className="py-3 bg-slate-800 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    🖼️ Ilustrasi
                  </button>

                  <button
                    onClick={generateAudio}
                    className="py-3 bg-slate-800 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    🎧 Audio
                  </button>

                  <button
                    onClick={() => alert("Preview tersedia saat export.")}
                    className="py-3 bg-slate-800 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>

                  <button
                    onClick={exportPDF}
                    disabled={!quality?.passed}
                    className="py-3 bg-indigo-600 rounded-xl text-sm font-bold disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>

                </div>
              </>
            )}
          </section>
        </div>

        {/* CHAPTER PREVIEW */}
        {ebook && (
          <section className="mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="text-indigo-400" />

              <div>
                <h2 className="font-bold">
                  Struktur Buku
                </h2>

                <p className="text-xs text-slate-400">
                  Struktur dibuat berdasarkan topik.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {ebook.chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <div className="text-xs text-indigo-400 font-bold">
                    BAB {chapter.number}
                  </div>

                  <h3 className="font-bold mt-1">
                    {chapter.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2">
                    {chapter.objective}
                  </p>

                  <div className="mt-3 space-y-1">
                    {chapter.sections.map((section, index) => (
                      <div
                        key={index}
                        className="text-xs text-slate-400"
                      >
                        • {section.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-slate-950 rounded-xl p-4">
      <div className="text-indigo-400">{icon}</div>

      <div className="text-xl font-bold mt-2">
        {value}
      </div>

      <div className="text-xs text-slate-500">
        {label}
      </div>
    </div>
  );
}

function createPDFDocument(
  ebook: Ebook,
  images: { chapter: number; data: string }[],
  audios: { chapter: number; data: string }[]
) {
  const imageMap = new Map(
    images.map((item) => [item.chapter, item.data])
  );

  const audioMap = new Map(
    audios.map((item) => [item.chapter, item.data])
  );

  const chapterHTML = ebook.chapters
    .map((chapter) => {
      const image = imageMap.get(chapter.number);
      const audio = audioMap.get(chapter.number);

      return `
        <section class="page">
          <div class="kicker">BAB ${chapter.number}</div>

          <h2>${escapeHTML(chapter.title)}</h2>

          <div class="objective">
            <strong>Tujuan bab:</strong>
            ${escapeHTML(chapter.objective)}
          </div>

          ${
            image
              ? `
                <img
                  class="chapter-image"
                  src="${image}"
                />
              `
              : ""
          }

          ${
            audio
              ? `
                <div class="audio-box">
                  <strong>🎧 Dengarkan Bab ${chapter.number}</strong>
                  <audio controls src="${audio}"></audio>
                  <small>
                    Audio disediakan sebagai fitur pendamping.
                  </small>
                </div>
              `
              : ""
          }

          ${chapter.sections
            .map(
              (section) => `
                <h3>${escapeHTML(section.title)}</h3>

                <p>${escapeHTML(section.content)}</p>

                ${
                  section.bullets?.length
                    ? `
                      <ul>
                        ${section.bullets
                          .map(
                            (bullet) =>
                              `<li>${escapeHTML(bullet)}</li>`
                          )
                          .join("")}
                      </ul>
                    `
                    : ""
                }
              `
            )
            .join("")}

          <div class="footer">
            ${escapeHTML(ebook.author)}
            <span>Bab ${chapter.number}</span>
          </div>
        </section>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">

<title>${escapeHTML(ebook.title)}</title>

<style>

@page {
  size:A4;
  margin:0;
}

* {
  box-sizing:border-box;
}

body {
  margin:0;
  font-family:Arial, sans-serif;
  color:#1e293b;
}

.page {
  width:210mm;
  min-height:297mm;
  padding:22mm 20mm 25mm;
  position:relative;
  page-break-after:always;
}

.cover {
  background:linear-gradient(
    135deg,
    #0f172a,
    #312e81
  );

  color:white;

  display:flex;
  flex-direction:column;
  justify-content:space-between;
}

.cover h1 {
  font-size:34px;
  line-height:1.2;
  margin-top:25mm;
}

.subtitle {
  font-size:15px;
  color:#cbd5e1;
  line-height:1.7;
}

h2 {
  font-size:22px;
  color:#0f172a;
}

h3 {
  font-size:15px;
  margin-top:20px;
}

p,
li {
  font-size:12.5px;
  line-height:1.75;
}

.objective {
  background:#eef2ff;
  border-left:4px solid #4f46e5;
  padding:12px;
  margin:15px 0;
  font-size:11.5px;
  line-height:1.6;
}

.chapter-image {
  display:block;
  width:100%;
  max-height:105mm;
  object-fit:cover;
  border-radius:8px;
  margin:18px 0;
}

.audio-box {
  background:#f8fafc;
  border:1px solid #e2e8f0;
  padding:12px;
  border-radius:8px;
  margin:15px 0;
}

.audio-box audio {
  width:100%;
  margin-top:8px;
}

.audio-box small {
  display:block;
  margin-top:5px;
  color:#64748b;
}

.footer {
  position:absolute;
  bottom:10mm;
  left:20mm;
  right:20mm;

  border-top:1px solid #e2e8f0;
  padding-top:7px;

  display:flex;
  justify-content:space-between;

  font-size:9px;
  color:#94a3b8;
}

</style>
</head>

<body>

<section class="page cover">
  <div>
    <div>AI DIGITAL PRODUCT</div>

    <h1>
      ${escapeHTML(ebook.title)}
    </h1>

    <div class="subtitle">
      ${escapeHTML(ebook.subtitle)}
    </div>
  </div>

  <div>
    <strong>${escapeHTML(ebook.author)}</strong>
    <br/>
    ${new Date().getFullYear()}
  </div>
</section>

<section class="page">

  <div class="kicker">
    PENDAHULUAN
  </div>

  <h2>
    Tentang Panduan Ini
  </h2>

  <p>
    ${escapeHTML(ebook.introduction)}
  </p>

  <h3>
    Target Pembaca
  </h3>

  <p>
    ${escapeHTML(ebook.audience)}
  </p>

</section>

<section class="page">

  <div class="kicker">
    DAFTAR ISI
  </div>

  <h2>
    Daftar Isi
  </h2>

  <ol>
    ${ebook.chapters
      .map(
        (chapter) =>
          `<li>${escapeHTML(chapter.title)}</li>`
      )
      .join("")}
  </ol>

</section>

${chapterHTML}

<section class="page">

  <div class="kicker">
    ACTION PLAN
  </div>

  <h2>
    Rencana Tindakan
  </h2>

  <ol>
    ${ebook.actionPlan
      .map(
        (item) =>
          `<li>${escapeHTML(item)}</li>`
      )
      .join("")}
  </ol>

</section>

<section class="page">

  <div class="kicker">
    CHECKLIST
  </div>

  <h2>
    Checklist Penerapan
  </h2>

  ${ebook.checklist
    .map(
      (item) => `
        <div style="
          padding:10px;
          border:1px solid #ddd;
          margin:7px 0;
          border-radius:6px;
        ">
          ☐ ${escapeHTML(item)}
        </div>
      `
    )
    .join("")}

</section>

<section class="page">

  <div class="kicker">
    WORKSHEET
  </div>

  <h2>
    Lembar Kerja
  </h2>

  ${ebook.worksheet
    .map(
      (item) => `
        <div style="margin:15px 0;">
          <strong>${escapeHTML(item)}</strong>
          <div style="
            height:45px;
            border:1px solid #cbd5e1;
            margin-top:7px;
          "></div>
        </div>
      `
    )
    .join("")}

</section>

<section class="page">

  <div class="kicker">
    FAQ
  </div>

  <h2>
    Pertanyaan yang Sering Diajukan
  </h2>

  ${ebook.faqs
    .map(
      (faq) => `
        <div style="
          background:#f8fafc;
          padding:13px;
          margin:10px 0;
          border-radius:8px;
        ">
          <strong>
            ${escapeHTML(faq.question)}
          </strong>

          <p>
            ${escapeHTML(faq.answer)}
          </p>
        </div>
      `
    )
    .join("")}

</section>

<section class="page">

  <div class="kicker">
    PENUTUP
  </div>

  <h2>
    Kesimpulan
  </h2>

  <p>
    ${escapeHTML(ebook.conclusion)}
  </p>

  <div class="objective">

    <strong>Disclaimer</strong>

    <br/><br/>

    ${escapeHTML(ebook.disclaimer)}

  </div>

  <h3>
    Referensi
  </h3>

  <ol>
    ${ebook.sources
      .map(
        (source) => `
          <li>
            ${escapeHTML(source.title)}
            —
            ${escapeHTML(source.url)}
          </li>
        `
      )
      .join("")}
  </ol>

</section>

</body>
</html>
`;
}

function escapeHTML(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
