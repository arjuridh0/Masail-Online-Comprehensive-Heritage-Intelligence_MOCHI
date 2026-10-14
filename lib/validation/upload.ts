/**
 * MOCHI — Validator Unggahan Berkas & Anti-Malware Sanitize
 * Rujukan: docs/KEAMANAN.md & docs/02_SPESIFIKASI_TEKNIS.md §9
 */

export const MIME_GAMBAR_VALID = ['image/jpeg', 'image/png', 'image/webp']
export const MIME_DOKUMEN_VALID = ['application/pdf', 'image/jpeg', 'image/png']

export const MAX_UKURAN_GAMBAR = 3 * 1024 * 1024 // 3 MB
export const MAX_UKURAN_DOKUMENTASI = 5 * 1024 * 1024 // 5 MB (Dokumentasi Foto Kegiatan Forum)
export const MAX_UKURAN_DOKUMEN = 10 * 1024 * 1024 // 10 MB (SK Kepengurusan LBM & Bukti Pesantren)

export interface HasilValidasiBerkas {
  valid: boolean
  error?: string
  namaAman?: string
}

/**
 * Validasi ketat berkas sebelum diunggah ke Supabase Storage:
 * 1. Cek ukuran file
 * 2. Cek tipe MIME
 * 3. Cek ekstensi file (mencegah ekstensi ganda seperti .php.jpg atau .html)
 */
export function validasiBerkasUpload(
  file: { name: string; size: number; type: string },
  kategori: 'gambar' | 'dokumen' | 'dokumentasi'
): HasilValidasiBerkas {
  const maxUkuran =
    kategori === 'gambar'
      ? MAX_UKURAN_GAMBAR
      : kategori === 'dokumentasi'
      ? MAX_UKURAN_DOKUMENTASI
      : MAX_UKURAN_DOKUMEN
  const mimeDiizinkan = kategori === 'dokumen' ? MIME_DOKUMEN_VALID : MIME_GAMBAR_VALID

  // 1. Cek ukuran
  if (file.size <= 0) {
    return { valid: false, error: 'Berkas kosong (0 bytes)' }
  }

  if (file.size > maxUkuran) {
    const maxMb = maxUkuran / (1024 * 1024)
    return { valid: false, error: `Ukuran berkas melebihi batas maksimal ${maxMb} MB` }
  }

  // 2. Cek MIME
  if (!mimeDiizinkan.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Format berkas ${file.type} tidak didukung. Harap unggah format resmi (${mimeDiizinkan.join(', ')}).`,
    }
  }

  // 3. Cek ekstensi aman
  const ekstensi = file.name.split('.').pop()?.toLowerCase() || ''
  const ekstensiAman =
    kategori === 'dokumen'
      ? ['pdf', 'jpg', 'jpeg', 'png']
      : ['jpg', 'jpeg', 'png', 'webp']

  if (!ekstensiAman.includes(ekstensi)) {
    return {
      valid: false,
      error: `Ekstensi berkas .${ekstensi} tidak diizinkan.`,
    }
  }

  // 4. Cegah potensi serangan SVG script injection & HTML executable
  if (
    file.name.toLowerCase().includes('.html') ||
    file.name.toLowerCase().includes('.svg') ||
    file.name.toLowerCase().includes('.php') ||
    file.name.toLowerCase().includes('.sh') ||
    file.name.toLowerCase().includes('.exe')
  ) {
    return { valid: false, error: 'Nama berkas mengandung ekstensi berisiko.' }
  }

  const namaAman = buatNamaFileAman(file.name, kategori)
  return { valid: true, namaAman }
}

/**
 * Hasilkan nama berkas acak yang diacak di storage
 * Pola: [prefix]_[timestamp]_[random].ext
 */
export function buatNamaFileAman(namaAsli: string, prefix = 'upload'): string {
  const ekstensi = namaAsli.split('.').pop()?.toLowerCase() || 'bin'
  const acak = Math.random().toString(36).substring(2, 10)
  const waktu = Date.now()
  return `${prefix}_${waktu}_${acak}.${ekstensi}`
}
