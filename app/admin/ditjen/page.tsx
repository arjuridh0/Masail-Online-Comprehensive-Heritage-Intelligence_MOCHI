import type { Metadata } from 'next'
import {
  Building2,
  FileText,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Eye,
  Activity,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { hitungSkorKeaktifan } from '@/lib/skor'
import { TombolEksporCsv } from '@/components/admin/TombolEksporCsv'

export const metadata: Metadata = {
  title: 'Dashboard Nasional Ditjen Pesantren Kemenag RI | Admin MOCHI',
  description:
    'Rekapitulasi nasional penyelenggaraan bahtsul masail pesantren untuk Ditjen Pendidikan Diniyah dan Pondok Pesantren Kemenag RI.',
}

export default async function AdminDitjenPage() {
  const adminDb = createAdminClient()

  // Ambil data agregat seluruh lembaga, forum, dan masalah
  const [
    { data: daftarLembaga },
    { count: totalForum },
    { count: totalMasalah },
    { count: totalRujukan },
  ] = await Promise.all([
    adminDb
      .from('lembaga')
      .select(`
        id,
        nama,
        nspp,
        kota,
        provinsi,
        status,
        jenis,
        dibuat_pada,
        forum (
          id,
          status,
          tanggal_mulai,
          masalah (
            id,
            tayangan,
            topik
          )
        )
      `)
      .order('nama', { ascending: true }),
    adminDb.from('forum').select('*', { count: 'exact', head: true }).eq('status', 'terbit'),
    adminDb.from('masalah').select('*', { count: 'exact', head: true }),
    adminDb.from('rujukan').select('*', { count: 'exact', head: true }),
  ])

  const now = Date.now()
  const cutoff90Hari = now - 90 * 24 * 3600 * 1000

  let totalTayanganNasional = 0
  const provinsiCount: Record<string, number> = {}
  const topikCount: Record<string, number> = {
    ibadah: 0,
    muamalah: 0,
    munakahat: 0,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rekapLembaga = (daftarLembaga || []).map((l: any) => {
    let fCount = 0
    let mCount = 0
    let f90 = 0
    let m90 = 0
    const b6 = new Set<string>()

    // Hitung persebaran provinsi
    const prov = l.provinsi || 'Lainnya'
    provinsiCount[prov] = (provinsiCount[prov] || 0) + 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    l.forum?.forEach((f: any) => {
      if (f.status === 'terbit') {
        fCount += 1
        const ms = f.masalah || []
        mCount += ms.length

        if (f.tanggal_mulai) {
          const tgl = new Date(f.tanggal_mulai).getTime()
          if (tgl >= cutoff90Hari) {
            f90 += 1
            m90 += ms.length
          }
          const diffMonth = (now - tgl) / (30 * 24 * 3600 * 1000)
          if (diffMonth <= 6) {
            const d = new Date(f.tanggal_mulai)
            b6.add(`${d.getFullYear()}-${d.getMonth()}`)
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ms.forEach((m: any) => {
          totalTayanganNasional += m.tayangan || 0
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          m.topik?.forEach((tp: any) => {
            if (topikCount[tp] !== undefined) {
              topikCount[tp] += 1
            }
          })
        })
      }
    })

    const skor = hitungSkorKeaktifan({
      forum90Hari: f90,
      masalah90Hari: m90,
      bulanAktif6Bulan: b6.size,
    })

    return {
      nama: l.nama,
      nspp: l.nspp || '-',
      kota: l.kota || '-',
      provinsi: l.provinsi || '-',
      totalForum: fCount,
      totalMasalah: mCount,
      skorKeaktifan: skor,
      status: l.status,
    }
  })

  const totalTerverifikasi = (daftarLembaga || []).filter((l) => l.status === 'terverifikasi').length
  const totalMenunggu = (daftarLembaga || []).filter((l) => l.status === 'menunggu').length

  return (
    <div className="space-y-8">
      {/* Header Dashboard Ditjen */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9D7CE] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3F30]/10 px-3 py-1 text-xs font-semibold text-[#1E3F30] mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span>Kemenag RI — Ditjen Pendidikan Diniyah dan Pondok Pesantren</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3F30]">
            Dashboard Integrasi Nasional Ditjen Pesantren
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
            Sistem rekapitulasi data keputusan Bahtsul Masail, keaktifan pesantren ber-NSPP,
            dan diseminasi literasi hukum Islam berbasis turats Nusantara.
          </p>
        </div>

        {/* Tombol Ekspor CSV */}
        <div className="shrink-0">
          <TombolEksporCsv data={rekapLembaga} />
        </div>
      </div>

      {/* Grid Indikator Kinerja Nasional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Pesantren Ber-NSPP
            </span>
            <Building2 className="h-4 w-4 text-[#1E3F30]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalTerverifikasi}</span>
            <span className="text-xs text-[#5C5856]">Mitra ({totalMenunggu} antrean)</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Lembaga tervalidasi nomor NSPP resmi
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
            <span className="text-3xl font-black text-[#1E3F30]">{totalForum || 0}</span>
            <span className="text-xs text-[#5C5856]">Kegiatan</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Musyawarah ulama &amp; santri terbit
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Diktum Masail Terbit
            </span>
            <BookOpen className="h-4 w-4 text-[#C9A96E]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalMasalah || 0}</span>
            <span className="text-xs text-[#5C5856]">Keputusan</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Didukung {totalRujukan || 0} ibarat kitab kuning
          </p>
        </div>

        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7672]">
              Dampak Diseminasi
            </span>
            <Eye className="h-4 w-4 text-[#1E3F30]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E3F30]">{totalTayanganNasional}</span>
            <span className="text-xs text-[#5C5856]">Pembacaan</span>
          </div>
          <p className="mt-1 text-[11px] text-[#7A7672]">
            Akses publik terhadap fatwa pesantren
          </p>
        </div>
      </div>

      {/* Persebaran Geografis & Klasifikasi Fiqih */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persebaran Wilayah Provinsi */}
        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1E3F30] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C9A96E]" />
              <span>Persebaran Pesantren per Wilayah</span>
            </h3>
            <span className="text-xs font-semibold text-[#7A7672]">
              {Object.keys(provinsiCount).length} Provinsi
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(provinsiCount)
              .sort((a, b) => b[1] - a[1])
              .map(([prov, cnt]) => {
                const total = daftarLembaga?.length || 1
                const persen = Math.round((cnt / total) * 100)
                return (
                  <div key={prov}>
                    <div className="flex justify-between text-xs font-medium text-[#2C2A29] mb-1">
                      <span>{prov}</span>
                      <span>{cnt} Pesantren ({persen}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full bg-[#1E3F30]"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Klasifikasi Bidang Masail */}
        <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1E3F30] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#C9A96E]" />
              <span>Komposisi Bidang Keputusan Fiqih</span>
            </h3>
            <span className="text-xs font-semibold text-[#7A7672]">
              {totalMasalah || 0} Masalah
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                bidang: 'Ibadah',
                count: topikCount.ibadah,
                deskripsi: 'Thaharah, shalat kontemporer, zakat digital, haji',
                color: 'bg-emerald-600',
              },
              {
                bidang: 'Muamalah',
                count: topikCount.muamalah,
                deskripsi: 'Fintech, e-commerce, paylater, kripto, perbankan syariah',
                color: 'bg-blue-600',
              },
              {
                bidang: 'Munakahat',
                count: topikCount.munakahat,
                deskripsi: 'Nikah online, tes DNA nasab, hak waris, keluarga sakinah',
                color: 'bg-amber-600',
              },
            ].map((item) => {
              const totalM = totalMasalah || 1
              const pct = Math.round((item.count / totalM) * 100)
              return (
                <div key={item.bidang} className="bg-white p-3.5 rounded-xl border border-[#D9D7CE]">
                  <div className="flex justify-between text-xs font-bold text-[#2C2A29] mb-1">
                    <span>{item.bidang}</span>
                    <span className="text-[#1E3F30]">{item.count} Masalah ({pct}%)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2">{item.deskripsi}</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabel Data Rekapitulasi Pesantren Mitra */}
      <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1E3F30]">
            Daftar Lembaga Penyelenggara Bahtsul Masail
          </h3>
          <span className="text-xs text-stone-500">
            Total {rekapLembaga.length} Lembaga Tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#1E3F30] text-white">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Nama Lembaga</th>
                <th className="py-2.5 px-3">NSPP</th>
                <th className="py-2.5 px-3">Kab/Kota</th>
                <th className="py-2.5 px-3">Provinsi</th>
                <th className="py-2.5 px-3 text-center">Forum</th>
                <th className="py-2.5 px-3 text-center">Masalah</th>
                <th className="py-2.5 px-3 text-center">Skor</th>
                <th className="py-2.5 px-3 rounded-r-lg text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D7CE]/70">
              {rekapLembaga.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#1E3F30]">{item.nama}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">{item.nspp}</td>
                  <td className="py-2.5 px-3">{item.kota}</td>
                  <td className="py-2.5 px-3">{item.provinsi}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#1E3F30]">{item.totalForum}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#1E3F30]">{item.totalMasalah}</td>
                  <td className="py-2.5 px-3 text-center font-black text-[#C9A96E]">{item.skorKeaktifan}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'terverifikasi' && <CheckCircle2 className="h-3 w-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
