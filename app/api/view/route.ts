import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHash, randomUUID } from 'crypto'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const viewSchema = z.object({
  target_id: z.string().uuid(),
  jenis: z.enum(['masalah', 'forum']),
})

const BOT_REGEX = /bot|crawler|spider|crawling|slurp|facebookexternalhit|whatsapp|preview|headless/i

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || ''
    if (BOT_REGEX.test(userAgent)) {
      return NextResponse.json({ success: true, bot: true, viewed: false })
    }

    const body = await req.json()
    const parsed = viewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Parameter tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { target_id, jenis } = parsed.data

    const cookieStore = await cookies()
    let sesiId = cookieStore.get('mochi_sesi')?.value

    const response = NextResponse.json({ success: true, viewed: true })

    if (!sesiId) {
      sesiId = randomUUID()
      response.cookies.set('mochi_sesi', sesiId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 hari
        path: '/',
      })
    }

    const salt = process.env.SESI_SALT || 'mochi-secret-session-salt-2026'
    const sesiHash = createHash('sha256')
      .update(`${sesiId}:${salt}`)
      .digest('hex')

    const tanggalHariIni = new Date().toISOString().split('T')[0]
    const supabase = createAdminClient()

    // 1. Cek apakah sudah pernah dilihat di hari yang sama
    const { data: existingView } = await supabase
      .from('tayangan_harian')
      .select('target_id')
      .eq('tanggal', tanggalHariIni)
      .eq('jenis', jenis)
      .eq('target_id', target_id)
      .eq('sesi_hash', sesiHash)
      .maybeSingle()

    if (existingView) {
      return NextResponse.json({ success: true, viewed: false, message: 'Sudah tercatat hari ini' })
    }

    // 2. Simpan catatan ke tayangan_harian
    const { error: insertError } = await supabase.from('tayangan_harian').insert({
      tanggal: tanggalHariIni,
      jenis,
      target_id,
      sesi_hash: sesiHash,
    })

    if (insertError) {
      // Duplikasi key aman diabaikan
      return NextResponse.json({ success: true, viewed: false })
    }

    // 3. Tambah hitungan tayangan pada entitas target
    if (jenis === 'masalah') {
      const { data: current } = await supabase
        .from('masalah')
        .select('tayangan')
        .eq('id', target_id)
        .single()

      if (current) {
        await supabase
          .from('masalah')
          .update({ tayangan: (current.tayangan || 0) + 1 })
          .eq('id', target_id)
      }
    } else if (jenis === 'forum') {
      const { data: current } = await supabase
        .from('forum')
        .select('tayangan')
        .eq('id', target_id)
        .single()

      if (current) {
        await supabase
          .from('forum')
          .update({ tayangan: (current.tayangan || 0) + 1 })
          .eq('id', target_id)
      }
    }

    return response
  } catch (error) {
    console.error('API View Error:', error)
    return NextResponse.json(
      { error: 'Gagal mencatat tayangan' },
      { status: 500 }
    )
  }
}
