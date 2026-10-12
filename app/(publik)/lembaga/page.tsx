import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  Flame,
  TrendingUp,
  Clock,
} from 'lucide-react'
// Layout level Navbar handles navigation
import FooterBergelombang from '@/components/layout/FooterBergelombang'
import { FilterLembagaJelly } from '@/components/lembaga/FilterLembagaJelly'
import SearchBarLembaga from '@/components/lembaga/SearchBarLembaga'
import { TampilanDirektoriLembaga } from '@/components/lembaga/TampilanDirektoriLembaga'
import type { LembagaCardData } from '@/components/lembaga/KartuLembaga'
import { createClient } from '@/lib/supabase/server'
import { hitungSkorKeaktifan, tentukanLencana } from '@/lib/skor'

export const revalidate = 60 // Caching ISR 60 detik untuk skalabilitas 100k+ pengguna

export const metadata: Metadata = {
  title: 'Direktori Lembaga & Pesantren Mitra | MOCHI',
  description:
    'Daftar lembaga pesantren dan LBM Nahdlatul Ulama penyelenggara forum bahtsul masail terverifikasi dengan skor keaktifan dan lencana di repositori digital MOCHI.',
}

export default async function DirektoriLembagaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jenis?: string; provinsi?: string; tab?: string }>
}) {
  const { q, jenis, provinsi, tab = 'teraktif' } = await searchParams
  const supabase = await createClient()

  // Ambil seluruh lembaga yang terverifikasi
  let query = supabase
    .from('lembaga')
    .select(`
      id,
      nama,
      slug,
      jenis,
      kota,
      provinsi,
      nspp,
      logo_url,
      status,
      deskripsi,
      dibuat_pada,
      forum (
        id,
        status,
        tanggal_mulai,
        masalah (
          id
        )
      )
    `)
    .eq('status', 'terverifikasi')

  if (jenis && jenis !== 'semua') {
    if (jenis === 'pesantren') {
      query = query.eq('jenis', 'pesantren')
    } else if (jenis === 'lembaga') {
      query = query.in('jenis', ['lbm_pwnu', 'lbm_pcnu'])
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = query.eq('jenis', jenis as any)
    }
  }

  if (provinsi && provinsi !== 'semua') {
    query = query.eq('provinsi', provinsi)
  }

  const { data: rawLembaga } = await query

  const now = Date.now()
  const cutoff90Hari = now - 90 * 24 * 3600 * 1000

  // Proses data lembaga, hitung skor keaktifan dan lencana
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listLembaga: LembagaCardData[] = (rawLembaga || []).map((l: any) => {
    let jumlahForum = 0
    let jumlahMasalah = 0
    let forum90Hari = 0
    let masalah90Hari = 0
    const bulanUnik6Bulan = new Set<string>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    l.forum?.forEach((f: any) => {
      if (f.status === 'terbit') {
        jumlahForum += 1
        const countM = f.masalah?.length || 0
        jumlahMasalah += countM

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
      }
    })

    const paramKeaktifan = {
      forum90Hari,
      masalah90Hari,
      bulanAktif6Bulan: bulanUnik6Bulan.size,
      totalForum: jumlahForum,
      totalMasalah: jumlahMasalah,
      totalTayangan: 120, // default estimasi tayangan
      dibuatPada: l.dibuat_pada,
    }

    const skorKeaktifan = hitungSkorKeaktifan(paramKeaktifan)
    const lencana = tentukanLencana(paramKeaktifan)

    return {
      id: l.id,
      nama: l.nama,
      slug: l.slug,
      jenis: l.jenis,
      kota: l.kota || '',
      provinsi: l.provinsi || '',
      nspp: l.nspp,
      logo_url: l.logo_url,
      deskripsi: l.deskripsi,
      jumlahForum,
      jumlahMasalah,
      skorKeaktifan,
      lencana,
    }
  })

  // Filter teks pencarian (q)
  if (q) {
    const qLower = q.toLowerCase()
    listLembaga = listLembaga.filter(
      (l) =>
        l.nama.toLowerCase().includes(qLower) ||
        l.kota.toLowerCase().includes(qLower) ||
        l.provinsi.toLowerCase().includes(qLower) ||
        (l.nspp && l.nspp.includes(qLower))
    )
  }

  // Pengurutan berdasarkan tab
  if (tab === 'teraktif') {
    listLembaga.sort((a, b) => b.skorKeaktifan - a.skorKeaktifan)
  } else if (tab === 'terpopuler') {
    listLembaga.sort((a, b) => b.jumlahMasalah - a.jumlahMasalah)
  } else if (tab === 'terbaru') {
    listLembaga.sort((a, b) => b.jumlahForum - a.jumlahForum)
  }

  return (
    <>
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Header Banner */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE5D5] px-3.5 py-1 text-xs font-bold text-[#1E3F30] mb-3">
            <Building2 className="h-3.5 w-3.5 text-[#8C733E]" />
            Pesantren &amp; LBM Terverifikasi
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E3F30]">
            Direktori Lembaga Pesantren Mitra
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed">
            Penyelenggara forum bahtsul masail terdaftar dengan skor keaktifan dan lencana
            penjaga turats di repositori digital MOCHI.
          </p>
        </div>

        {/* Tab Peringkat: Teraktif, Terpopuler, Terbaru */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'teraktif', label: 'Paling Aktif', icon: Flame },
            { id: 'terpopuler', label: 'Terbanyak Masail', icon: TrendingUp },
            { id: 'terbaru', label: 'Paling Baru', icon: Clock },
          ].map((t) => {
            const Icon = t.icon
            const isSelected = tab === t.id
            return (
              <Link
                key={t.id}
                href={`/lembaga?tab=${t.id}${jenis ? `&jenis=${jenis}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1E3F30] text-white shadow-xs'
                    : 'bg-[#F2EDE0] text-stone-700 hover:bg-[#E5DDC9]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Bar Pencarian & Filter Jenis */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Form Cari dengan Rekomendasi Animatif */}
          <SearchBarLembaga defaultValue={q || ''} />

          {/* Filter Chip Jenis dengan Animasi JellyRadio ReactBits (Semua, Pesantren, Lembaga) */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <FilterLembagaJelly jenisTerpilih={jenis || 'semua'} />
          </div>
        </div>

        {/* Tampilan Direktori Lembaga: Dual View Switcher (Grid Kartu vs List Baris) */}
        <TampilanDirektoriLembaga items={listLembaga} />
      </main>

      {/* FOOTER BERGELOMBANG ORGANIK */}
      <FooterBergelombang />
    </>
  )
}

