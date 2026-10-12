/**
 * Utilitas Sitasi Ilmiah & Santri MOCHI
 * Format sesuai PRD §7.5 (FR-09):
 * [Nama Lembaga], "[Judul Masalah]", Hasil Bahtsul Masail [Nama Forum], [Tempat], [Tanggal], [kode MOCHI]. Diakses melalui MOCHI: https://[domain]/masalah/[slug]
 */

export interface FormatSitasiParams {
  lembagaNama: string
  masalahJudul: string
  forumNama?: string | null
  tempat?: string | null
  tanggalMulai?: string | null
  tanggalSelesai?: string | null
  kode: string
  slug: string
  baseUrl?: string
}

const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

/**
 * Format rentang tanggal ramah bahasa Indonesia.
 * Contoh: "31 Agustus – 2 September 2004" atau "14 Oktober 2024"
 */
export function formatRentangTanggal(
  mulaiIso?: string | null,
  selesaiIso?: string | null
): string {
  if (!mulaiIso) return 'Tanggal tidak tercatat'

  const d1 = new Date(mulaiIso)
  if (isNaN(d1.getTime())) return mulaiIso

  const tgl1 = d1.getDate()
  const bln1 = BULAN_INDONESIA[d1.getMonth()]
  const thn1 = d1.getFullYear()

  if (!selesaiIso || selesaiIso === mulaiIso) {
    return `${tgl1} ${bln1} ${thn1}`
  }

  const d2 = new Date(selesaiIso)
  if (isNaN(d2.getTime())) return `${tgl1} ${bln1} ${thn1}`

  const tgl2 = d2.getDate()
  const bln2 = BULAN_INDONESIA[d2.getMonth()]
  const thn2 = d2.getFullYear()

  if (thn1 === thn2 && bln1 === bln2) {
    return `${tgl1}–${tgl2} ${bln1} ${thn1}`
  }

  if (thn1 === thn2) {
    return `${tgl1} ${bln1} – ${tgl2} ${bln2} ${thn1}`
  }

  return `${tgl1} ${bln1} ${thn1} – ${tgl2} ${bln2} ${thn2}`
}

/**
 * Format sitasi standar MOCHI
 */
export function formatSitasiMochi({
  lembagaNama,
  masalahJudul,
  forumNama,
  tempat,
  tanggalMulai,
  tanggalSelesai,
  kode,
  slug,
  baseUrl,
}: FormatSitasiParams): string {
  const domain =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://mochi.pesantren.id'

  const namaForum = forumNama || 'Forum Bahtsul Masail'
  const lokasi = tempat || 'Indonesia'
  const rentangTanggal = formatRentangTanggal(tanggalMulai, tanggalSelesai)
  const url = `${domain.replace(/\/$/, '')}/masalah/${slug}`

  return `${lembagaNama}, "${masalahJudul}", Hasil Bahtsul Masail ${namaForum}, ${lokasi}, ${rentangTanggal}, ${kode}. Diakses melalui MOCHI: ${url}`
}

/**
 * Validasi dan bersihkan penanda sitasi [S1], [S2] dalam teks jawaban RAG.
 * Menghapus tag script berbahaya dan menyaring sitasi di luar rentang sumber sah.
 */
export function bersihkanSitasiTeks(teks: string, maxSumber = 99): string {
  // Strip dangerous scripts/tags
  const bersih = teks
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

  if (maxSumber <= 0) {
    return bersih.replace(/\[S\d+\]/g, '')
  }
  return bersih.replace(/\[S(\d+)\]/g, (match, p1) => {
    const num = parseInt(p1, 10)
    if (num >= 1 && num <= maxSumber) {
      return match
    }
    return ''
  })
}
