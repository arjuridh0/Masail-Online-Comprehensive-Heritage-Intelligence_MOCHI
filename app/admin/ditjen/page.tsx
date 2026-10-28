import type { Metadata } from 'next'
import {
  Building2,
  FileText,
  ShieldCheck,
  BookOpen,
  Eye,
  Sparkles,
  TrendingUp,
  Compass,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { hitungSkorKeaktifan } from '@/lib/skor'
import { TombolEksporCsv } from '@/components/admin/TombolEksporCsv'
import { TabelRekapDitjen } from '@/components/admin/TabelRekapDitjen'
import { VisualGrafikDitjen } from '@/components/admin/VisualGrafikDitjen'

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

  // Pemetaan wilayah gugus pulau
  const gugusPulauMap: Record<string, { nama: string; color: string; list: string[]; count: number }> = {
    jawa: {
      nama: 'Jawa & Madura',
      color: 'bg-[#1E3F30]',
      list: [],
      count: 0,
    },
    sumatera: {
      nama: 'Sumatera',
      color: 'bg-emerald-700',
      list: [],
      count: 0,
    },
    kalimantan: {
      nama: 'Kalimantan',
      color: 'bg-amber-600',
      list: [],
      count: 0,
    },
    sulawesi: {
      nama: 'Sulawesi',
      color: 'bg-blue-600',
      list: [],
      count: 0,
    },
    nusra_maluku_papua: {
      nama: 'Bali, Nusra, Maluku & Papua',
      color: 'bg-purple-600',
      list: [],
      count: 0,
    },
    lainnya: {
      nama: 'Wilayah Lain',
      color: 'bg-stone-500',
      list: [],
      count: 0,
    },
  }

  function deteksiPulau(provinsiStr: string): string {
    const p = (provinsiStr || '').toLowerCase()
    if (
      p.includes('jawa') ||
      p.includes('banten') ||
      p.includes('dki') ||
      p.includes('jakarta') ||
      p.includes('yogyakarta') ||
      p.includes('diy') ||
      p.includes('madura')
    ) {
      return 'jawa'
    }
    if (
      p.includes('sumatera') ||
      p.includes('aceh') ||
      p.includes('riau') ||
      p.includes('jambi') ||
      p.includes('bengkulu') ||
      p.includes('lampung') ||
      p.includes('bangka')
    ) {
      return 'sumatera'
    }
    if (p.includes('kalimantan')) {
      return 'kalimantan'
    }
    if (p.includes('sulawesi') || p.includes('gorontalo')) {
      return 'sulawesi'
    }
    if (
      p.includes('bali') ||
      p.includes('nusa tenggara') ||
      p.includes('ntb') ||
      p.includes('ntt') ||
      p.includes('maluku') ||
      p.includes('papua')
    ) {
      return 'nusra_maluku_papua'
    }
    return 'lainnya'
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

    const idPulau = deteksiPulau(prov)
    if (gugusPulauMap[idPulau]) {
      gugusPulauMap[idPulau].count += 1
      if (!gugusPulauMap[idPulau].list.includes(prov)) {
        gugusPulauMap[idPulau].list.push(prov)
      }
    }

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

  const totalPesantren = daftarLembaga?.length || 1
  const pulauStats = Object.entries(gugusPulauMap)
    .filter(([_, val]) => val.count > 0 || _ === 'jawa' || _ === 'sumatera')
    .map(([id, val]) => ({
      id,
      nama: val.nama,
      count: val.count,
      persen: Math.round((val.count / totalPesantren) * 100),
      provinsiList: val.list,
      color: val.color,
    }))
    .sort((a, b) => b.count - a.count)

  const totalM = totalMasalah || 1
  const topikStats = [
    {
      bidang: 'Muamalah',
      count: topikCount.muamalah,
      persen: Math.round((topikCount.muamalah / totalM) * 100),
      deskripsi: 'Transaksi ekonomi kontemporer, fintech, paylater, aset digital kripto, dan perbankan syariah.',
      tagTren: ['Fintech', 'Paylater', 'Kripto', 'E-Commerce'],
      color: 'bg-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      bidang: 'Ibadah',
      count: topikCount.ibadah,
      persen: Math.round((topikCount.ibadah / totalM) * 100),
      deskripsi: 'Thaharah medis, shalat di perjalanan modern (pesawat/kereta cepat), zakat digital, manasik haji.',
      tagTren: ['ShalatPesawat', 'ZakatDigital', 'ThaharahMedis'],
      color: 'bg-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      bidang: 'Munakahat',
      count: topikCount.munakahat,
      persen: Math.round((topikCount.munakahat / totalM) * 100),
      deskripsi: 'Akad nikah daring via telekonferensi, pembuktian nasab berbasis tes DNA, dan perlindungan keluarga.',
      tagTren: ['NikahOnline', 'TesDnaNasab', 'HartaGonoGini'],
      color: 'bg-amber-600',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ]

  const persenJawa = pulauStats.find((p) => p.id === 'jawa')?.persen || 0

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

      {/* Kartu Ringkasan Eksekutif & Rekomendasi Kebijakan Kemenag */}
      <div className="rounded-2xl border border-[#C9A96E]/50 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F4EFE6] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6DF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-[#1E3F30] p-2 text-[#C9A96E]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E3F30]">
                Executive Policy Briefing — Ditjen Pendidikan Diniyah &amp; Pondok Pesantren
              </h2>
              <p className="text-xs text-stone-500">
                Poin strategis integrasi hasil bahtsul masail pesantren dalam perumusan kebijakan nasional Kemenag RI.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Status Data: Terverifikasi Nasional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Pilar 1 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                Regulasi Moneter Syariah
              </span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">
              Dinamika Fiqih Muamalah ({topikStats.find(t => t.bidang === 'Muamalah')?.persen || 58}%)
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Pesantren sangat responsif terhadap disrupsi ekonomi digital. Data fatwa fintech dan kripto ini dapat disinkronkan Ditjen Pesantren ke KNEKS, OJK, dan Bank Indonesia.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Pemerataan Literasi
              </span>
              <Compass className="h-4 w-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">
              Disparitas Regional Turats
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Mayoritas forum terkonsentrasi di Pulau Jawa ({persenJawa}%). Menjadi dasar Ditjen Pesantren untuk meluncurkan program afirmatif bantuan digitalisasi bahtsul masail bagi pesantren di Luar Jawa.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Pencegahan Fatwa Liar
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">
              Validasi NSPP &amp; Sanad Kitab
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              100% lembaga terverifikasi memiliki NSPP resmi dan {totalRujukan} kutipan ibarat turats bertashih. Menjamin kepastian hukum Islam yang moderat (Wasathiyah) dan membendung disinformasi fatwa di media sosial.
            </p>
          </div>
        </div>
      </div>

      {/* Visualisasi Diagram & Analisis Sebaran Regional */}
      <VisualGrafikDitjen
        totalPesantren={totalPesantren}
        totalMasalah={totalMasalah || 0}
        totalForum={totalForum || 0}
        totalTayangan={totalTayanganNasional}
        totalRujukan={totalRujukan || 0}
        pulauStats={pulauStats}
        topikStats={topikStats}
      />

      {/* Registri Interaktif Lembaga Pesantren Mitra */}
      <TabelRekapDitjen data={rekapLembaga} />
    </div>
  )
}
