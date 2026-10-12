import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const reportSchema = z.object({
  masalah_id: z.string().uuid(),
  alasan: z.string().min(3, 'Alasan pelaporan wajib dipilih'),
  detail: z.string().min(5, 'Detail penjelasan minimal 5 karakter').max(1000, 'Maksimal 1000 karakter').optional().or(z.literal('')),
  kontak: z.string().max(100).optional().or(z.literal('')),
})

// Simple in-memory rate limiter per IP: max 5 report per 10 menit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip'
    const now = Date.now()
    const rate = rateLimitMap.get(ip)

    if (rate && now < rate.resetAt) {
      if (rate.count >= 5) {
        return NextResponse.json(
          { error: 'Batas pelaporan tercapai. Mohon tunggu beberapa saat sebelum mengirim laporan baru.' },
          { status: 429 }
        )
      }
      rate.count += 1
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 })
    }

    const body = await req.json()
    const parsed = reportSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data pelaporan tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { masalah_id, alasan, detail, kontak } = parsed.data
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('laporan')
      .insert({
        masalah_id,
        alasan,
        detail: detail || null,
        kontak: kontak || null,
        status: 'baru',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error inserting laporan:', error)
      return NextResponse.json(
        { error: 'Gagal menyimpan laporan' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Laporan Anda telah diterima oleh tim pentashih & administrator MOCHI.',
      id: data.id,
    })
  } catch (error) {
    console.error('API Report Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses laporan' },
      { status: 500 }
    )
  }
}
