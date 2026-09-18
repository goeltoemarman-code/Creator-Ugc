/**
 * Sistem Moderasi Konten Otomatis untuk Platform UGC
 * Menyaring kata-kata kasar dan tidak pantas dalam bahasa Indonesia & Inggris.
 */

// Daftar kata kasar dan tidak pantas umum (Indonesian & English profanity / slur list)
export const INAPPROPRIATE_WORDS: string[] = [
  // Bahasa Indonesia
  'anjing',
  'babi',
  'bangsat',
  'bajingan',
  'kontol',
  'memek',
  'pantek',
  'itil',
  'jembut',
  'kampret',
  'bodoh',
  'tolol',
  'goblok',
  'idiot',
  'asu',
  'pepek',
  'ngentot',
  'brengsek',
  'perek',
  'lonte',
  'sontoloyo',
  'tai',
  'setan',
  'bejad',
  'bego',
  'cuki',
  'puki',
  // Bahasa Inggris umum
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'cunt',
  'dick',
  'pussy',
  'fucker',
  'motherfucker',
];

export interface ModerationResult {
  isClean: boolean;
  flaggedWords: string[];
  sanitizedText: string;
  warningMessage?: string;
}

/**
 * Normalisasi teks untuk mendeteksi variasi karakter tipuan (leetspeak & tanda baca acak)
 */
function normalizeForCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[3]/g, 'e')
    .replace(/[+]/g, 't');
}

/**
 * Memeriksa apakah teks memuat kata-kata kasar/tidak pantas.
 */
export function checkContentModeration(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return {
      isClean: true,
      flaggedWords: [],
      sanitizedText: text,
    };
  }

  const flaggedSet = new Set<string>();
  const normalized = normalizeForCheck(text);

  let sanitized = text;

  // Lakukan pengecekan berbasis boundary kata
  for (const word of INAPPROPRIATE_WORDS) {
    // Regex boundary yang aman terhadap variasi tanda baca
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])(${word})(?:[^a-zA-Z0-9]|$)`, 'gi');
    
    // Periksa pada teks asli dan teks normalisasi
    if (regex.test(normalized) || regex.test(text.toLowerCase())) {
      flaggedSet.add(word);
      
      // Buat sensor pengganti (misal: 'a***g' atau '***')
      const censorRegex = new RegExp(`\\b${word}\\b`, 'gi');
      sanitized = sanitized.replace(censorRegex, '*'.repeat(word.length));
    }
  }

  const flaggedWords = Array.from(flaggedSet);
  const isClean = flaggedWords.length === 0;

  return {
    isClean,
    flaggedWords,
    sanitizedText: sanitized,
    warningMessage: isClean
      ? undefined
      : `Konten terdeteksi memuat kata tidak pantas: "${flaggedWords.join(', ')}". Mohon jaga kesopanan komunitas.`,
  };
}
