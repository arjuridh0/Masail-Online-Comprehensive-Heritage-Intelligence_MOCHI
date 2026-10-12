/**
 * MOCHI — Modul Toleransi Salah Ketik (Typo Tolerance) & Did-You-Mean
 * Menggunakan Algoritma Jarak Levenshtein dan Kamus Kosakata Khazanah Fiqih Bahtsul Masail
 */

export const KAMUS_FIQIH: string[] = [
  // Istilah Fiqih Dasar & Hukum
  "dosa",
  "pahala",
  "hukum",
  "wajib",
  "sunnah",
  "mubah",
  "makruh",
  "haram",
  "sah",
  "batal",
  "halal",
  "syubhat",
  "rukhsah",
  "azimah",
  "masyaqqah",
  "dharurah",
  "hajat",
  "maslahat",
  "mafsadah",

  // Ibadah & Thaharah
  "shalat",
  "sholat",
  "sembahyang",
  "thaharah",
  "bersuci",
  "wudhu",
  "tayammum",
  "tayamum",
  "hadas",
  "najis",
  "mandi",
  "junub",
  "adzan",
  "iqamah",
  "jumat",
  "jamaah",
  "jamak",
  "qashar",
  "musafir",
  "puasa",
  "ramadhan",
  "zakat",
  "fitrah",
  "mal",
  "profesi",
  "sedekah",
  "infak",
  "haji",
  "umrah",
  "kurban",
  "qurban",
  "akikah",
  "aqiqah",
  "jenazah",
  "kubur",
  "tahlil",
  "ziarah",
  "masjid",
  "kiblat",

  // Muamalah & Keuangan Kontemporer
  "muamalah",
  "jual",
  "beli",
  "akad",
  "dropship",
  "dropshipping",
  "kripto",
  "crypto",
  "cryptocurrency",
  "bitcoin",
  "nft",
  "paylater",
  "pinjaman",
  "pinjol",
  "bunga",
  "bank",
  "riba",
  "ziyadah",
  "denda",
  "keterlambatan",
  "cashback",
  "dompet",
  "digital",
  "qris",
  "e-wallet",
  "marketplace",
  "online",
  "investasi",
  "saham",
  "trading",
  "forex",
  "emas",
  "uang",
  "uang elektronik",
  "wakalah",
  "ujrah",
  "mudharabah",
  "musyarakah",
  "murabahah",
  "ijarah",
  "sewa",
  "qardh",
  "rahn",
  "gadai",
  "kafalah",
  "hawalah",
  "sulh",
  "damai",
  "hibah",
  "hadiah",
  "wakaf",
  "qabadh",
  "salam",
  "istishna",
  "gharar",
  "qimar",
  "judi",
  "taruhan",
  "lotere",
  "asuransi",

  // Munakahat & Keluarga
  "munakahat",
  "nikah",
  "pernikahan",
  "kawin",
  "ijab",
  "kabul",
  "wali",
  "mahar",
  "mas kawin",
  "saksi",
  "khitbah",
  "lamaran",
  "talak",
  "cerai",
  "khulu",
  "fasakh",
  "rujuk",
  "iddah",
  "nafkah",
  "hadhanah",
  "nasab",
  "dna",
  "ilhaq",
  "li'an",
  "lian",
  "poligami",
  "wali hakim",
  "video call",
  "teleconference",

  // Mawaris / Kewarisan
  "waris",
  "warisan",
  "harta",
  "tirkah",
  "faraidh",
  "ashabah",
  "furudh",
  "hijab",
  "takharuj",
  "ishlah",
  "wasiat",

  // Medis & Sains Kontemporer
  "vaksin",
  "tripsin",
  "babi",
  "enzim",
  "istihalah",
  "imunisasi",
  "darah",
  "donor",
  "transplantasi",
  "organ",
  "kornea",
  "mata",
  "ginjal",
  "jantung",
  "kematian",
  "klinis",
  "mati otak",
  "autopsi",
  "operasi",
  "bedah",
  "plastik",
  "aborsi",
  "bayi tabung",
  "sperma",
  "ovum",
  "inseminasi",
  "stunting",
  "obat",
  "alkohol",
  "khamr",
  "bius",

  // Makanan & Sembelihan
  "sembelih",
  "penyembelihan",
  "unggas",
  "ayam",
  "sapi",
  "kambing",
  "mesin",
  "mekanik",
  "tasmiyah",
  "bismillah",
  "kornet",
  "kaleng",
  "daging",
  "olahan",
  "bangkai",

  // Kelembagaan & Tradisi Pesantren
  "bahtsul",
  "masail",
  "pesantren",
  "pondok",
  "santri",
  "kiai",
  "ulama",
  "mushohhih",
  "pentashih",
  "perumus",
  "moderator",
  "as'ilah",
  "pertanyaan",
  "jawaban",
  "diktum",
  "turats",
  "kitab",
  "kuning",
  "ibarat",
  "mak'hadz",
  "sanad",
  "lirboyo",
  "sidogiri",
  "ploso",
  "tebuireng",
  "sarang",
  "sukorejo",
  "pwnu",
  "pcnu",
  "lbm",
];

/**
 * Menghitung jarak Levenshtein antara dua kata (case-insensitive).
 */
export function hitungLevenshtein(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();

  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Hapus
        dp[i][j - 1] + 1, // Sisip
        dp[i - 1][j - 1] + cost // Ganti
      );
    }
  }

  return dp[m][n];
}

/**
 * Mencari saran kata terdekat dari kamus untuk sebuah kata tunggal.
 * Mentolerir 1 perbedaan karakter untuk kata <= 4 huruf, dan 2 perbedaan untuk kata > 4 huruf.
 */
export function cariSaranKata(kata: string): string | null {
  const clean = kata.trim().toLowerCase();
  if (clean.length < 3) return null;

  // Jika kata sudah persis ada di kamus, tidak perlu koreksi
  if (KAMUS_FIQIH.includes(clean)) return null;

  let bestMatch: string | null = null;
  let minDistance = Infinity;

  const maxAllowedDist = clean.length <= 4 ? 1 : 2;

  for (const candidate of KAMUS_FIQIH) {
    // Optimasi awal: jika selisih panjang terlalu besar, lewati
    if (Math.abs(candidate.length - clean.length) > maxAllowedDist) continue;

    const dist = hitungLevenshtein(clean, candidate);

    if (dist <= maxAllowedDist && dist < minDistance) {
      minDistance = dist;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

/**
 * Menganalisis kueri teks pengguna (bisa multi-kata) dan mendeteksi saran koreksi.
 * Menghasilkan string kueri terkoreksi jika ditemukan typo, atau null jika tidak ada.
 */
export function deteksiSaranTypo(kueri: string): string | null {
  if (!kueri) return null;
  const cleanQuery = kueri.trim();
  if (!cleanQuery) return null;

  const words = cleanQuery.split(/\s+/);
  let adaKoreksi = false;

  const correctedWords = words.map((w) => {
    // Bersihkan tanda baca tepi seperti koma atau tanda tanya
    const stripped = w.replace(/^[^\w\u0600-\u06FF]+|[^\w\u0600-\u06FF]+$/g, "");
    if (!stripped) return w;

    const saran = cariSaranKata(stripped);
    if (saran && saran.toLowerCase() !== stripped.toLowerCase()) {
      adaKoreksi = true;
      return saran;
    }
    return w;
  });

  if (!adaKoreksi) return null;
  return correctedWords.join(" ");
}
