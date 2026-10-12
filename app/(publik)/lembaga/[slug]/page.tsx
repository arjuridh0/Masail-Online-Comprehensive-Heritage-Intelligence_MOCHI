import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatRentangTanggal } from '@/lib/sitasi'
import { hitungSkorKeaktifan, tentukanLencana } from '@/lib/skor'
import { BadgeLencana } from '@/components/lembaga/BadgeLencana'
import { TombolKembali } from '@/components/ui/TombolKembali'
import { Activity } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: lembaga } = await supabase
    .from('lembaga')
    .select('nama, kota, provinsi, deskripsi')
    .eq('slug', slug)
    .maybeSingle()

  if (!lembaga) {
    return {
      title: 'Lembaga Tidak Ditemukan | MOCHI',
    }
  }

  const title = `Profil ${lembaga.nama} | MOCHI`
  const description =
    lembaga.deskripsi ||
    `Arsip keputusan bahtsul masail yang diselenggarakan oleh ${lembaga.nama}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/lembaga/${slug}`,
    },
  }
}

export default async function ProfilLembagaPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Ambil data profil lembaga
  const { data: lembaga, error } = await supabase
    .from('lembaga')
    .select(`
      id,
      nama,
      slug,
      jenis,
      kota,
      provinsi,
      nspp,
      emis_id,
      logo_url,
      deskripsi,
      kontak_email,
      kontak_telepon,
      alamat,
      status
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (error || !lembaga || lembaga.status !== 'terverifikasi') {
    notFound()
  }

  // 2. Ambil seluruh forum terbit yang diselenggarakan oleh lembaga ini
  const { data: rawForum } = await supabase
    .from('forum')
    .select(`
      id,
      slug,
      nama,
      tuan_rumah,
      tanggal_mulai,
      tanggal_selesai,
      tanggal_hijriah,
      lokasi,
      masalah (
        id,
        kode,
        slug,
        judul,
        topik,
        corak,
        pertanyaan (
          id,
          rujukan (
            id
          )
        )
      )
    `)
    .eq('lembaga_id', lembaga.id)
    .eq('status', 'terbit')
    .order('tanggal_mulai', { ascending: false })

  let totalMasalah = 0
  let totalRujukan = 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const forumList = (rawForum || []).map((f: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    f.masalah?.forEach((m: any) => {
      totalMasalah += 1
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      m.pertanyaan?.forEach((p: any) => {
        totalRujukan += p.rujukan?.length || 0
      })
    })

    return f
  })

  // Hitung skor keaktifan dan lencana lembaga
  const now = Date.now()
  const cutoff90Hari = now - 90 * 24 * 3600 * 1000
  let forum90Hari = 0
  let masalah90Hari = 0
  const bulanUnik6Bulan = new Set<string>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forumList.forEach((f: any) => {
    if (f.tanggal_mulai) {
      const tgl = new Date(f.tanggal_mulai).getTime()
      if (tgl >= cutoff90Hari) {
        forum90Hari += 1
        masalah90Hari += f.masalah?.length || 0
      }
      const selisihBulan = (now - tgl) / (30 * 24 * 3600 * 1000)
      if (selisihBulan <= 6) {
        const dateObj = new Date(f.tanggal_mulai)
        bulanUnik6Bulan.add(`${dateObj.getFullYear()}-${dateObj.getMonth()}`)
      }
    }
  })

  const paramKeaktifan = {
    forum90Hari,
    masalah90Hari,
    bulanAktif6Bulan: bulanUnik6Bulan.size,
    totalForum: forumList.length,
    totalMasalah,
    totalTayangan: 250,
  }

  const skorKeaktifan = hitungSkorKeaktifan(paramKeaktifan)
  const daftarLencana = tentukanLencana(paramKeaktifan)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Tombol Kembali & Breadcrumb Navigasi */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC]/70 pb-4">
        <TombolKembali
          hrefDefault="/lembaga"
          label="Kembali ke Direktori Lembaga"
          testId="tombol-kembali-lembaga"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500"
        >
          <Link href="/" className="hover:text-[#1E3F30] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <Link href="/lembaga" className="hover:text-[#1E3F30] transition-colors">
            Direktori Lembaga
          </Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="font-medium text-stone-700">{lembaga.nama}</span>
        </nav>
      </div>

      {/* Header Profil Lembaga */}
      <div className="rounded-3xl border border-[#D9D3C3] bg-[#FAF8F2] p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white border border-[#D9D3C3] shadow-xs">
            {lembaga.logo_url ? (
              <Image
                src={lembaga.logo_url}
                alt={lembaga.nama}
                width={80}
                height={80}
                className="object-contain"
              />
            ) : (
              <Building2 className="h-10 w-10 text-[#1E3F30]" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#1E3F30] px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                {lembaga.jenis.replace('_', ' ')}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Terverifikasi Kemenag
              </span>

              {daftarLencana.map((l) => (
                <BadgeLencana key={l.tipe} lencana={l} size="sm" />
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3F30]">
              {lembaga.nama}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                {lembaga.kota ? `${lembaga.kota}, ` : ''}{lembaga.provinsi || 'Indonesia'}
              </span>

              {lembaga.nspp && (
                <span className="font-mono">
                  NSPP: <strong className="text-stone-800">{lembaga.nspp}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {lembaga.deskripsi && (
          <p className="mt-6 border-t border-[#E8E2D2] pt-5 text-sm leading-relaxed text-stone-700">
            {lembaga.deskripsi}
          </p>
        )}

        {/* Counter Statistik */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E8E2D2] pt-6 text-center">
          <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
            <FileText className="mx-auto h-5 w-5 text-[#8C733E] mb-1" />
            <span className="text-2xl font-black text-[#1E3F30]">
              {forumList.length}
            </span>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Forum Diselenggarakan
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
            <MessageSquare className="mx-auto h-5 w-5 text-[#1E3F30] mb-1" />
            <span className="text-2xl font-black text-[#1E3F30]">
              {totalMasalah}
            </span>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Keputusan Diterbitkan
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
            <BookOpen className="mx-auto h-5 w-5 text-emerald-700 mb-1" />
            <span className="text-2xl font-black text-[#1E3F30]">
              {totalRujukan}
            </span>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Ibarat Kitab Dirujuk
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
            <Activity className="mx-auto h-5 w-5 text-[#C9A96E] mb-1" />
            <span className="text-2xl font-black text-[#1E3F30]">
              {skorKeaktifan}
            </span>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Skor Keaktifan
            </p>
          </div>
        </div>
      </div>

      {/* Arsip Forum Bahtsul Masail Lembaga */}
      <section className="space-y-6">
        <div className="border-b border-[#E3DCB] pb-4">
          <h2 className="text-xl font-extrabold text-[#1E3F30]">
            Arsip Forum Bahtsul Masail
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar kegiatan forum dan risalah keputusan hukum yang diterbitkan oleh {lembaga.nama}.
          </p>
        </div>

        {forumList.length === 0 ? (
          <p className="text-sm text-stone-500 italic p-6 rounded-2xl bg-stone-50 border border-stone-200">
            Belum ada forum bahtsul masail yang diterbitkan ke publik.
          </p>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          forumList.map((f: any) => (
            <div
              key={f.id}
              className="rounded-2xl border border-[#D9D3C3] bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <Link
                    href={`/forum/${f.slug}`}
                    className="text-lg font-bold text-[#1E3F30] hover:underline"
                  >
                    {f.nama || 'Forum Bahtsul Masail'}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-[#8C733E]" />
                      {formatRentangTanggal(f.tanggal_mulai, f.tanggal_selesai)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-stone-400" />
                      {f.lokasi}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/forum/${f.slug}`}
                  className="rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Buka Risalah Forum
                </Link>
              </div>

              {/* Daftar Masalah dalam Forum Ini */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Keputusan Masail ({f.masalah?.length || 0}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {f.masalah?.map((m: any) => (
                    <Link
                      key={m.id}
                      href={`/masalah/${m.slug}`}
                      className="group rounded-xl border border-stone-200 bg-[#FAF8F2] p-3 text-xs transition-all hover:border-[#1E3F30] hover:bg-white"
                    >
                      <span className="font-mono text-[10px] font-bold text-[#8C733E] block">
                        {m.kode}
                      </span>
                      <p className="font-bold text-[#1E3F30] group-hover:underline line-clamp-1 mt-0.5">
                        {m.judul}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}