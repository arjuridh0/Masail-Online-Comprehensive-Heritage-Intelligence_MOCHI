/**
 * MOCHI — Sanitasi & Pencegahan XSS
 * Rujukan: docs/KEAMANAN.md & docs/02_SPESIFIKASI_TEKNIS.md §9
 */

/**
 * Escape karakter HTML dasar agar aman saat ditampilkan atau disimpan
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Bersihkan string dari script injection, tag berbahaya, dan event handlers
 */
export function sanitasiXss(str: string): string {
  if (!str) return ''
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"'\s]*/gi, '')
}
