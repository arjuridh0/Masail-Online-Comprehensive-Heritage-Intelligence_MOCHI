import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()
  let dbStatus = 'terputus'
  let dbLatencyMs = 0

  try {
    const adminDb = createAdminClient()
    const dbStart = Date.now()
    const { count, error } = await adminDb
      .from('lembaga')
      .select('*', { count: 'exact', head: true })

    dbLatencyMs = Date.now() - dbStart

    if (!error && typeof count === 'number') {
      dbStatus = 'terhubung'
    } else {
      dbStatus = `galat: ${error?.message || 'gagal menghitung baris'}`
    }
  } catch (err: unknown) {
    dbStatus = `galat: ${err instanceof Error ? err.message : 'koneksi gagal'}`
  }

  const isHealthy = dbStatus === 'terhubung'
  const statusCode = isHealthy ? 200 : 503

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      sistem: 'MOCHI (Masail Online & Comprehensive Heritage Intelligence)',
      kategori: 'Santrivision 2026 — Inovasi Digital Pesantren (Kemenag RI)',
      versi: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime_detik: Math.round(process.uptime()),
      respon_ms: Date.now() - startTime,
      database: {
        status: dbStatus,
        latensi_ms: dbLatencyMs,
      },
      layanan: {
        demo_mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
        embedding_provider: process.env.AI_EMBEDDING_PROVIDER || 'google',
        chat_provider: process.env.AI_CHAT_PROVIDER || 'groq',
      },
    },
    { status: statusCode }
  )
}
