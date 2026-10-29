import { NextResponse } from 'next/server'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sesi = await getSesiPengguna()

  if (!sesi || sesi.peran !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Administrator & Tim Pengembang.' }, { status: 403 })
  }

  const adminDb = createAdminClient()
  const timestamp = new Date().toISOString()

  // 1. Uji Latensi Koneksi Database Supabase
  let dbStatus: 'healthy' | 'degraded' | 'down' = 'healthy'
  let dbLatency = 0
  let totalMasalah = 0
  let totalForum = 0
  let totalLembaga = 0

  try {
    const t0 = performance.now()
    const [masalahRes, forumRes, lembagaRes] = await Promise.all([
      adminDb.from('masalah').select('*', { count: 'exact', head: true }),
      adminDb.from('forum').select('*', { count: 'exact', head: true }),
      adminDb.from('lembaga').select('*', { count: 'exact', head: true }),
    ])
    dbLatency = Math.round(performance.now() - t0)
    totalMasalah = masalahRes.count || 0
    totalForum = forumRes.count || 0
    totalLembaga = lembagaRes.count || 0

    if (dbLatency > 1500) {
      dbStatus = 'degraded'
    }
  } catch {
    dbStatus = 'down'
  }

  // 2. Uji Status Storage Buckets
  let storageStatus: 'healthy' | 'degraded' | 'down' = 'healthy'
  let bucketList: string[] = []
  try {
    const { data: buckets, error: storageErr } = await adminDb.storage.listBuckets()
    if (storageErr || !buckets) {
      storageStatus = 'degraded'
      bucketList = ['bukti-lembaga', 'dokumentasi', 'logo'] // default buckets
    } else {
      bucketList = buckets.map((b) => b.name)
    }
  } catch {
    storageStatus = 'degraded'
    bucketList = ['bukti-lembaga', 'dokumentasi', 'logo']
  }

  // 3. Status Konfigurasi AI Inference Engine
  const aiGroqConfigured = Boolean(process.env.GROQ_API_KEY)
  const aiGoogleConfigured = Boolean(process.env.GOOGLE_AI_API_KEY)

  // 4. Ambil Audit Log & Laporan Tertunda
  const [auditRes, laporanRes] = await Promise.all([
    adminDb
      .from('log_audit')
      .select('id, aksi, tabel, dibuat_pada, keterangan')
      .order('dibuat_pada', { ascending: false })
      .limit(8),
    adminDb
      .from('laporan')
      .select('id, alasan, detail, status, dibuat_pada')
      .eq('status', 'menunggu')
      .order('dibuat_pada', { ascending: false })
      .limit(5),
  ])

  // 5. Metrik Memori & Runtime Server
  const mem = process.memoryUsage()
  const memUsedMb = Math.round(mem.rss / 1024 / 1024)
  const memHeapMb = Math.round(mem.heapUsed / 1024 / 1024)

  return NextResponse.json({
    status: 'ok',
    timestamp,
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'production',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: memUsedMb,
        heapUsedMb: memHeapMb,
      },
    },
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
      counts: {
        masalah: totalMasalah,
        forum: totalForum,
        lembaga: totalLembaga,
      },
    },
    storage: {
      status: storageStatus,
      buckets: bucketList,
    },
    ai: {
      groqChat: {
        configured: aiGroqConfigured,
        model: process.env.AI_CHAT_MODEL || 'llama-3.3-70b-versatile',
        status: aiGroqConfigured ? 'operational' : 'missing_key',
      },
      googleEmbedding: {
        configured: aiGoogleConfigured,
        model: process.env.AI_EMBEDDING_MODEL || 'text-embedding-004',
        dimension: Number(process.env.AI_EMBEDDING_DIMENSION || 768),
        status: aiGoogleConfigured ? 'operational' : 'missing_key',
      },
      fallbackChat: {
        model: process.env.AI_FALLBACK_CHAT_MODEL || 'gemini-1.5-flash',
        status: aiGoogleConfigured ? 'operational' : 'inactive',
      },
    },
    incidents: {
      laporanMenungguCount: (laporanRes.data || []).length,
      recentLaporan: laporanRes.data || [],
      recentAudit: auditRes.data || [],
    },
  })
}
