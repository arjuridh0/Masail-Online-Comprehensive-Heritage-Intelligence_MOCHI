/**
 * Konversi tanggal Masehi ke tanggal Hijriah standar Indonesia.
 * Menggunakan Intl.DateTimeFormat native bawaan V8 / Node.js (Ponytail stdlib).
 */
export function konversiKeHijriah(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return ''

    // Kalender Islam Umalqura dengan format lokal Indonesia
    const formatter = new Intl.DateTimeFormat('id-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const formatted = formatter.format(d)
    // Standarisasi suffix H (Hijriah) jika belum ada
    if (!formatted.includes('H') && !formatted.includes('Hijriah')) {
      return `${formatted} H`
    }
    return formatted
  } catch {
    return ''
  }
}

/**
 * Format tanggal Masehi singkat Indonesia
 */
export function formatMasehi(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return ''

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}