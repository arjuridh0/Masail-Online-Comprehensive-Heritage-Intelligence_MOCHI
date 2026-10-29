import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { PemantauanClient } from './PemantauanClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Konsol Pemantauan Sistem & Telemetri Pengembang | Admin MOCHI',
  description:
    'Pusat pemantauan kesehatan sistem, stabilitas database, latensi API AI, memori server, dan buku catatan insiden untuk tim pengembang MOCHI.',
}

export default async function PemantauanPage() {
  const sesi = await getSesiPengguna()

  if (!sesi || sesi.peran !== 'admin') {
    redirect('/masuk?redirect=/admin/pemantauan')
  }

  const adminDb = createAdminClient()

  // Ambil data awal server
  const [
    masalahRes,
    forumRes,
    lembagaRes,
    auditRes,
    laporanRes,
  ] = await Promise.all([
    adminDb.from('masalah').select('id, tayangan', { count: 'exact' }),
    adminDb.from('forum').select('id', { count: 'exact' }),
    adminDb.from('lembaga').select('id', { count: 'exact' }),
    adminDb
      .from('log_audit')
      .select('id, aksi, tabel, dibuat_pada, keterangan')
      .order('dibuat_pada', { ascending: false })
      .limit(10),
    adminDb
      .from('laporan')
      .select('id, alasan, detail, status, dibuat_pada, masalah:masalah_id (kode, judul)')
      .order('dibuat_pada', { ascending: false })
      .limit(8),
  ])

  let totalTayangan = 0
  if (masalahRes.data) {
    totalTayangan = masalahRes.data.reduce((acc, m) => acc + (m.tayangan || 0), 0)
  }

  const initialData = {
    totalMasalah: masalahRes.count || 0,
    totalForum: forumRes.count || 0,
    totalLembaga: lembagaRes.count || 0,
    totalTayangan,
    recentAudit: auditRes.data || [],
    recentLaporan: laporanRes.data || [],
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'production',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8 space-y-8">
      <PemantauanClient initialData={initialData} />
    </div>
  )
}
