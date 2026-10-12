// ============================================================
// MOCHI — Logika Pencarian Hibrida Fiqih
// Menggabungkan Text Search, Trigram Typo-Tolerance, dan Normalisasi Arab
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, VMasalahPublik, TopikEnum } from '@/lib/types/database'
import { deteksiSaranTypo } from '@/lib/search/typo'

export interface SearchOptions {
  query?: string
  topik?: TopikEnum | 'semua'
  lembaga?: string
  tahun?: string
  corak?: string
  urutan?: 'terbaru' | 'terlama' | 'populer'
  page?: number
  limit?: number
  skipTypoCheck?: boolean
}

export interface SearchResult {
  items: VMasalahPublik[]
  total: number
  page: number
  limit: number
  totalPages: number
  saranKoreksi?: string
  isKoreksiOtomatis?: boolean
  kueriAsli?: string
}

/**
 * Normalisasi string query Arab di sisi aplikasi:
 * Membuang harakat / syakal (fathah, kasrah, dhammah, sukun, tanwin, syaddah)
 * dan menyamakan varian alif (أ, إ, آ, ٱ -> ا) dan ya/alif maqshurah.
 */
export function normalisasiArabClient(text: string): string {
  if (!text) return ''
  return text
    // Samakan varian alif & ya
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/ة/g, 'ه')
    // Buang harakat & tatwil
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .trim()
}

/**
 * Eksekusi pencarian hibrida terhadap view `v_masalah_publik`.
 */
export async function cariMasalahPublik(
  supabase: SupabaseClient<Database>,
  opts: SearchOptions = {}
): Promise<SearchResult> {
  const {
    query = '',
    topik = 'semua',
    lembaga = '',
    tahun = '',
    corak = '',
    urutan = 'terbaru',
    page = 1,
    limit = 10,
  } = opts

  const cleanQuery = query.trim()
  const offset = (page - 1) * limit

  // Start query builder on v_masalah_publik
  let qb = supabase
    .from('v_masalah_publik')
    .select('*', { count: 'exact' })

  // 1. Filter Query Teks
  if (cleanQuery) {
    // Jika format kode MCH-
    if (/^MCH-\d+/i.test(cleanQuery)) {
      qb = qb.ilike('kode', `%${cleanQuery}%`)
    } else {
      // Sanitasi karakter pemisah PostgREST
      const sanitized = cleanQuery.replace(/[,()]/g, ' ').trim()
      const normQuery = normalisasiArabClient(sanitized)
      
      const orConditions = [
        `judul.ilike.%${sanitized}%`,
        `deskripsi.ilike.%${sanitized}%`,
        `lembaga_nama.ilike.%${sanitized}%`,
        `forum_nama.ilike.%${sanitized}%`,
      ]

      if (normQuery && normQuery !== sanitized) {
        orConditions.push(`judul.ilike.%${normQuery}%`)
      }

      qb = qb.or(orConditions.join(','))
    }
  }

  // 2. Filter Topik
  if (topik && topik !== 'semua') {
    qb = qb.contains('topik', [topik])
  }

  // 3. Filter Lembaga (slug)
  if (lembaga && lembaga !== 'semua') {
    qb = qb.eq('lembaga_slug', lembaga)
  }

  // 4. Filter Tahun
  if (tahun && tahun !== 'semua') {
    const yearInt = parseInt(tahun, 10)
    if (!isNaN(yearInt)) {
      qb = qb.gte('tanggal_mulai', `${yearInt}-01-01`).lte('tanggal_mulai', `${yearInt}-12-31`)
    }
  }

  // 5. Filter Corak Masail
  if (corak && corak !== 'semua') {
    qb = qb.eq('corak', corak as Database['public']['Enums']['jenis_pembahasan'])
  }

  // 6. Urutan
  if (urutan === 'terlama') {
    qb = qb.order('tanggal_mulai', { ascending: true })
  } else if (urutan === 'populer') {
    qb = qb.order('tayangan', { ascending: false })
  } else {
    // Default: terbaru
    qb = qb.order('tanggal_mulai', { ascending: false })
  }

  // 7. Pagination
  qb = qb.range(offset, offset + limit - 1)

  const { data, count, error } = await qb

  if (error) {
    console.error('Error saat cariMasalahPublik:', error)
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  let items = (data as VMasalahPublik[]) || []
  let total = count || 0
  let isKoreksiOtomatis = false

  // Deteksi saran typo menggunakan kamus leksikon fiqih & jarak Levenshtein
  const saranKoreksi =
    !opts.skipTypoCheck && cleanQuery && !/^MCH-\d+/i.test(cleanQuery)
      ? deteksiSaranTypo(cleanQuery)
      : null

  // Jika hasil pencarian awal kosong dan ada kata saran yang berbeda,
  // jalankan pencarian fallback otomatis memakai kueri rekomendasi (Google-style)
  if (
    items.length === 0 &&
    saranKoreksi &&
    saranKoreksi.toLowerCase() !== cleanQuery.toLowerCase()
  ) {
    const fallback = await cariMasalahPublik(supabase, {
      ...opts,
      query: saranKoreksi,
      skipTypoCheck: true,
    })

    if (fallback.items.length > 0) {
      items = fallback.items
      total = fallback.total
      isKoreksiOtomatis = true
    }
  }

  const totalPages = Math.ceil(total / limit)

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    saranKoreksi: saranKoreksi || undefined,
    isKoreksiOtomatis,
    kueriAsli: cleanQuery,
  }
}
