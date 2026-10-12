import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Activity,
  Award,
  Eye,
  FileText,
  TrendingUp,
  BookOpen,
} from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { hitungSkorKeaktifan, tentukanLencana } from '@/lib/skor'
import { BadgeLencana } from '@/components/lembaga/BadgeLencana'

export const metadata: Metadata = {
  title: 'Statistik & Analisis Keaktifan | Dasbor MOCHI',
  description: 'Statistik performa forum bahtsul masail, pembacaan publik, dan skor lencana pesantren.',
}

export default async function DasborStatistikPage() {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    redirect('/masuk')
  }

  const lembaga = sesi.lembaga
  const supabase = await createClient()

  // Ambil detail dibuat_pada lembaga
  const { data: detailLembaga } = await supabase
    .from('lembaga')
    .select('dibuat_pada')
    .eq('id', lembaga.id)
    .maybeSingle()

  // Ambil seluruh data forum dan masalah lembaga ini
  const { data: rawForum } = await supabase
    .from('forum')
    .select(`
      id,
      nama,
      status,
      tanggal_mulai,
      masalah (
        id,
        kode,
        judul,
        slug,
        topik,
        corak,
        tayangan
      )
    `)
    .eq('lembaga_id', lembaga.id)

  const now = Date.now()
  const cutoff90Hari = now - 90 * 24 * 3600 * 1000

  let totalForumTerbit = 0
  let totalDraf = 0
  let totalMasalah = 0
  let totalTayangan = 0
  let forum90Hari = 0
  let masalah90Hari = 0
  const bulanUnik6Bulan = new Set<string>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const daftarMasalahSemua: any[] = []
  const topikCount: Record<string, number> = {
    ibadah: 0,
    muamalah: 0,
    munakahat: 0,
  }

  const listForum = rawForum || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listForum.forEach((f: any) => {
    if (f.status === 'terbit') {
      totalForumTerbit += 1
      const countM = f.masalah?.length || 0
      totalMasalah += countM

      if (f.tanggal_mulai) {
        const tgl = new Date(f.tanggal_mulai).getTime()
        if (tgl >= cutoff90Hari) {
          forum90Hari += 1
          masalah90Hari += countM
        }
        const selisihBulan = (now - tgl) / (30 * 24 * 3600 * 1000)
        if (selisihBulan <= 6) {
          const dateObj = new Date(f.tanggal_mulai)
          bulanUnik6Bulan.add(`${dateObj.getFullYear()}-${dateObj.getMonth()}`)
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      f.masalah?.forEach((m: any) => {
        totalTayangan += m.tayangan || 0
        daftarMasalahSemua.push(m)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        m.topik?.forEach((tp: any) => {
          if (topikCount[tp] !== undefined) {
            topikCount[tp] += 1
          }
        })
      })
    } else {
      totalDraf += 1
    }
  })

  // Urutkan masalah berdasarkan tayangan tertinggi
  daftarMasalahSemua.sort((a, b) => (b.tayangan || 0) - (a.tayangan || 0))
  const masalahTerpopuler = daftarMasalahSemua.slice(0, 5)

  const paramKeaktifan = {
    forum90Hari,
    masalah90Hari,
    bulanAktif6Bulan: bulanUnik6Bulan.size,
    totalForum: totalForumTerbit,
    totalMasalah,
    totalTayangan,
    dibuatPada: detailLembaga?.dibuat_pada,
  }

  const skorKeaktifan = hitungSkorKeaktifan(paramKeaktifan)
  const daftarLencana = tentukanLencana(paramKeaktifan)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1E3F30]">
          Statistik &amp; Keaktifan Lembaga
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Analisis jangkauan notulensi bahtsul masail, skor keaktifan berkala, dan lencana mutu pesantren.
        </p>
      </div>

      {/* Grid Kartu Skor Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Skor Keaktifan
            </span>
            <Activity className="h-4 w-4 text-[#C9A96E]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{skorKeaktifan}</span>
            <span className="text-xs text-[#5C5856]">Poin</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Bobot forum 90h + masalah + bulan aktif
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Total Pembacaan
            </span>
            <Eye className="h-4 w-4 text-[#1E3F30]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalTayangan}</span>
            <span className="text-xs text-[#5C5856]">Tayangan</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Dibaca oleh santri dan masyarakat
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Forum Bahtsul Masail
            </span>
            <FileText className="h-4 w-4 text-[#1E3F30]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalForumTerbit}</span>
            <span className="text-xs text-[#5C5856]">Terbit ({totalDraf} Draf)</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Dokumentasi musyawarah resmi
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Keputusan Diterbitkan
            </span>
            <BookOpen className="h-4 w-4 text-[#C9A96E]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalMasalah}</span>
            <span className="text-xs text-[#5C5856]">Masalah</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            As&apos;ilah dan diktum hukum tersimpan
          </p>
        </div>
      </div>

      {/* Lencana Penghargaan Keaktifan */}
      <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-[#C9A96E]" />
          <h2 className="text-base font-bold text-[#1E3F30]">
            Lencana Mutu &amp; Dedikasi Pesantren
          </h2>
        </div>

        {daftarLencana.length === 0 ? (
          <p className="text-xs text-[#7A7672]">
            Belum ada lencana yang disandang. Publikasikan forum masail secara konsisten untuk meraih lencana keaktifan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {daftarLencana.map((l) => (
              <div
                key={l.tipe}
                className="flex items-start gap-3 rounded-xl border border-[#D9D7CE] bg-white p-3.5 shadow-2xs"
              >
                <div className="mt-0.5">
                  <BadgeLencana lencana={l} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#5C5856] leading-relaxed">
                    {l.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distribusi Topik & Masalah Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Topik */}
        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#1E3F30] mb-4">
            Distribusi Bidang Fiqih
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Ibadah', count: topikCount.ibadah, color: 'bg-emerald-600' },
              { label: 'Muamalah', count: topikCount.muamalah, color: 'bg-blue-600' },
              { label: 'Munakahat', count: topikCount.munakahat, color: 'bg-amber-600' },
            ].map((tp) => {
              const persentase = totalMasalah > 0 ? Math.round((tp.count / totalMasalah) * 100) : 0
              return (
                <div key={tp.label}>
                  <div className="flex justify-between text-xs font-medium text-[#2C2A29] mb-1">
                    <span>{tp.label}</span>
                    <span>{tp.count} Masalah ({persentase}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={`h-full ${tp.color}`}
                      style={{ width: `${persentase}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Masalah Paling Sering Dibaca */}
        <div className="lg:col-span-2 rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1E3F30]">
              Masalah Fiqih Paling Sering Dibaca
            </h3>
            <TrendingUp className="h-4 w-4 text-[#1E3F30]" />
          </div>

          {masalahTerpopuler.length === 0 ? (
            <p className="text-xs text-[#7A7672]">
              Belum ada data tayangan masalah terbit.
            </p>
          ) : (
            <div className="divide-y divide-[#D9D7CE]/60">
              {masalahTerpopuler.map((m) => (
                <div key={m.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#1E3F30] bg-[#1E3F30]/10 px-1.5 py-0.5 rounded">
                        {m.kode}
                      </span>
                      <Link
                        href={`/masalah/${m.slug}`}
                        className="text-xs font-bold text-[#2C2A29] hover:text-[#1E3F30] hover:underline truncate"
                      >
                        {m.judul}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3F30] shrink-0">
                    <Eye className="h-3.5 w-3.5 text-[#7A7672]" />
                    <span>{m.tayangan || 0}x</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
