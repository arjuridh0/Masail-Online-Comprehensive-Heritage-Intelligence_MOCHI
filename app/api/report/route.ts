import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<iframe\b|javascript:|onerror\s*=/i

const reportSchema = z.object({
  masalah_id: z.string().uuid('ID masalah tidak valid'),
  alasan: z.string().min(3, 'Alasan pelaporan/tashih wajib dipilih'),
  jenis: z.enum(['tashih', 'pelanggaran']).default('tashih'),
  detail: z.string().min(5, 'Detail penjelasan minimal 5 karakter').max(1000, 'Maksimal 1000 karakter').optional().or(z.literal('')),
  usulan_teks: z.string().max(2000, 'Usulan perbaikan maksimal 2000 karakter').optional().or(z.literal('')),
  rujukan_id: z.string().uuid().optional().or(z.literal('')),
  nama_pengusul: z.string().max(100, 'Nama pengusul maksimal 100 karakter').optional().or(z.literal('')),
  kontak: z.string().max(100, 'Kontak maksimal 100 karakter').optional().or(z.literal('')),
  website_url: z.string().optional(), // Honeypot anti-bot
})

// Rate limiter per IP: max 5 submit per 10 menit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip'
    const now = Date.now()
    const rate = rateLimitMap.get(ip)

    if (rate && now < rate.resetAt) {
      if (rate.count >= 5) {
        return NextResponse.json(
          { error: 'Batas pengiriman tercapai. Mohon tunggu beberapa saat sebelum mengirim kembali.' },
          { status: 429 }
        )
      }
      rate.count += 1
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 })
    }

    const body = await req.json()

    // 1. Deteksi Honeypot (Bot Scraper)
    if (body.website_url && typeof body.website_url === 'string' && body.website_url.trim() !== '') {
      return NextResponse.json(
        { error: 'Permintaan ditolak oleh sistem keamanan (spam bot).' },
        { status: 400 }
      )
    }

    const parsed = reportSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data masukan tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      masalah_id,
      alasan,
      jenis,
      detail = '',
      usulan_teks = '',
      rujukan_id,
      nama_pengusul = '',
      kontak = '',
    } = parsed.data

    // 2. Proteksi XSS (Cross-Site Scripting)
    if (
      xssPattern.test(detail) ||
      xssPattern.test(usulan_teks) ||
      xssPattern.test(nama_pengusul) ||
      xssPattern.test(kontak)
    ) {
      return NextResponse.json(
        { error: 'Masukan memuat karakter atau pola skrip yang tidak diizinkan.' },
        { status: 400 }
      )
    }

    // 3. Format struktur detail usulan agar informatif bagi Lembaga & Admin
    const parts: string[] = []
    if (jenis === 'tashih') {
      parts.push('[USULAN TASHIH KOMUNITAS]')
    } else {
      parts.push('[LAPORAN PELANGGARAN KONTEN]')
    }

    if (nama_pengusul.trim()) {
      parts.push(`Pengusul: ${nama_pengusul.trim()}`)
    }
    if (rujukan_id) {
      parts.push(`Target Rujukan ID: ${rujukan_id}`)
    }
    if (usulan_teks.trim()) {
      parts.push(`\n--- TEKS USULAN PERBAIKAN ---\n${usulan_teks.trim()}\n---------------------------`)
    }
    if (detail.trim()) {
      parts.push(`\nCatatan & Referensi:\n${detail.trim()}`)
    }

    const finalDetail = parts.length > 1 ? parts.join('\n') : detail.trim()

    // 4. Format kontak
    const finalKontak = kontak.trim()
      ? `${kontak.trim()}${nama_pengusul.trim() ? ` (a.n. ${nama_pengusul.trim()})` : ''}`
      : nama_pengusul.trim()
      ? `(a.n. ${nama_pengusul.trim()})`
      : null

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('laporan')
      .insert({
        masalah_id,
        alasan: jenis === 'tashih' ? (alasan.startsWith('tashih_') ? alasan : `tashih_${alasan}`) : alasan,
        detail: finalDetail || null,
        kontak: finalKontak,
        status: 'baru',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error inserting laporan:', error)
      return NextResponse.json(
        { error: 'Gagal menyimpan catatan masukan' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        jenis === 'tashih'
          ? 'Jazakallahu khairan. Usulan tashih Anda telah diteruskan ke Dewan Pentashih lembaga penyelenggara.'
          : 'Laporan Anda telah diterima oleh tim administrator MOCHI untuk ditindaklanjuti.',
      id: data.id,
    })
  } catch (error) {
    console.error('API Report Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses masukan' },
      { status: 500 }
    )
  }
}
