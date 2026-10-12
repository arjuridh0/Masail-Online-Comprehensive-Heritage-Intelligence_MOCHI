import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  Calendar,
  ChevronRight,
  Eye,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { KartuMasalahData } from '@/components/perpustakaan/KartuMasalah'
import KartuMasalah from '@/components/perpustakaan/KartuMasalah'
import { ViewTracker } from '@/components/masalah/ViewTracker'
import { TombolKembali } from '@/components/ui/TombolKembali'
import { formatRentangTanggal } from '@/lib/sitasi'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: forum } = await supabase
    .from('forum')
    .select(`
      nama,
      lokasi,
      tanggal_mulai,
      lembaga:lembaga_id (
        nama
      )
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (!forum) {
    return {
      title: 'Forum Tidak Ditemukan | MOCHI',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lembaga = forum.lembaga as any
  const title = `${forum.nama || 'Forum Bahtsul Masail'} | MOCHI`
  const description = `Dokumentasi dan arsip keputusan bahtsul masail diselenggarakan oleh ${lembaga?.nama || 'Lembaga Pesantren'}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/forum/${slug}`,
    },
  }
}

export default async function DetailForumPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Ambil data forum
  const { data: forum, error } = await supabase
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
      kota,
      provinsi,
      sumber_materi,
      moderator,
      pentashih,
      perumus,
      status,
      tayangan,
      lembaga:lembaga_id (
        id,
        slug,
        nama,
        kota,
        provinsi,
        nspp,
        logo_url
      )
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (error || !forum || forum.status !== 'terbit') {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lembaga = forum.lembaga as any

  // 2. Ambil masalah yang diputuskan dalam forum ini
  const { data: rawMasalah } = await supabase
    .from('masalah')
    .select(`
      id,
      kode,
      slug,
      judul,
      deskripsi,
      topik,
      corak,
      tayangan,
      pertanyaan (
        id,
        rujukan (
          id
        )
      )
    `)
    .eq('forum_id', forum.id)
    .order('urutan', { ascending: true })

  // Format ke KartuMasalahData untuk KartuMasalah
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const daftarMasalah: KartuMasalahData[] = (rawMasalah || []).map((m: any) => {
    let jumlahRujukan = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m.pertanyaan?.forEach((p: any) => {
      jumlahRujukan += p.rujukan?.length || 0
    })

    return {
      id: m.id,
      kode: m.kode,
      slug: m.slug,
      judul: m.judul,
      deskripsi: m.deskripsi,
      topik: m.topik || [],
      corak: m.corak || null,
      tayangan: m.tayangan || 0,
      forum_nama: forum.nama || 'Forum Bahtsul Masail',
      lembaga_nama: lembaga?.nama || 'Pesantren Mitra',
      lembaga_slug: lembaga?.slug || '',
      tanggal_mulai: forum.tanggal_mulai,
      lokasi: forum.lokasi,
      jumlah_rujukan: jumlahRujukan,
      jumlah_forum_terkait: 1,
    }
  })

  // 3. Ambil dokumentasi foto forum
  const { data: rawDokumentasi } = await supabase
    .from('dokumentasi')
    .select('id, url, keterangan, urutan')
    .eq('forum_id', forum.id)
    .order('urutan', { ascending: true })

  return (
    <>
      <ViewTracker targetId={forum.id} jenis="forum" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Tombol Kembali & Breadcrumb Navigasi */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC]/70 pb-4">
          <TombolKembali
            hrefDefault="/perpustakaan"
            label="Kembali ke Perpustakaan"
            testId="tombol-kembali-forum"
          />
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500"
          >
            <Link href="/" className="hover:text-[#1E3F30] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3 text-stone-400" />
            <Link
              href="/perpustakaan"
              className="hover:text-[#1E3F30] transition-colors"
            >
              Perpustakaan
            </Link>
            <ChevronRight className="h-3 w-3 text-stone-400" />
            <span className="font-medium text-stone-700">Detail Forum</span>
          </nav>
        </div>

        {/* Header Forum */}
        <div className="rounded-3xl border border-[#D9D3C3] bg-[#FAF8F2] p-6 sm:p-10 shadow-sm mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3F30] px-3.5 py-1 text-xs font-bold text-white shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9A96E]" />
              Forum Terbit Resmi
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
              <Eye className="h-3.5 w-3.5" />
              <span>{forum.tayangan || 1}x dilihat</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1E3F30]">
            {forum.nama || 'Forum Bahtsul Masail'}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-700">
            <Link
              href={`/lembaga/${lembaga?.slug}`}
              className="flex items-center gap-1.5 font-bold text-[#1E3F30] hover:underline"
            >
              <Building2 className="h-4 w-4 text-[#8C733E]" />
              {lembaga?.nama}
            </Link>

            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#8C733E]" />
              {formatRentangTanggal(forum.tanggal_mulai, forum.tanggal_selesai)}
              {forum.tanggal_hijriah && (
                <span className="text-stone-500 font-normal">
                  ({forum.tanggal_hijriah})
                </span>
              )}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-stone-400" />
              {forum.lokasi}
            </span>
          </div>

          {/* Dewan Mushohhih & Perumus Card */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 border-t border-[#E8E2D2] pt-6 text-xs">
            {forum.pentashih && forum.pentashih.length > 0 && (
              <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-800 text-[11px] mb-2">
                  <UserCheck className="h-4 w-4 text-emerald-700" /> Dewan Mushohhih
                </span>
                <ul className="space-y-1">
                  {forum.pentashih.map((p: string, idx: number) => (
                    <li key={idx} className="font-medium text-stone-800">
                      &bull; {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {forum.perumus && forum.perumus.length > 0 && (
              <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1E3F30] text-[11px] mb-2">
                  <Users className="h-4 w-4 text-[#1E3F30]" /> Perumus Masail
                </span>
                <ul className="space-y-1">
                  {forum.perumus.map((p: string, idx: number) => (
                    <li key={idx} className="font-medium text-stone-800">
                      &bull; {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {forum.moderator && forum.moderator.length > 0 && (
              <div className="rounded-xl bg-white p-4 border border-[#E8E2D2] shadow-2xs">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-600 text-[11px] mb-2">
                  Moderator Sidang
                </span>
                <p className="font-medium text-stone-800">
                  {forum.moderator.join(', ')}
                </p>
                {forum.tuan_rumah && (
                  <p className="text-stone-500 mt-2">
                    Tuan Rumah: <span className="font-semibold text-stone-700">{forum.tuan_rumah}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Daftar Masalah yang Diputuskan */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E3DCB] pb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-[#8C733E]" />
              <h2 className="text-xl font-extrabold text-[#1E3F30]">
                Keputusan Masail yang Dihasilkan
              </h2>
            </div>
            <span className="rounded-full bg-[#EAE5D5] px-3 py-1 text-xs font-bold text-[#1E3F30]">
              {daftarMasalah.length} Masalah Diputuskan
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {daftarMasalah.map((masalah) => (
              <KartuMasalah key={masalah.id} masalah={masalah} />
            ))}
          </div>
        </section>

        {/* Galeri Dokumentasi */}
        {rawDokumentasi && rawDokumentasi.length > 0 && (
          <section className="mt-12 rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-10 shadow-xs">
            <h3 className="text-lg font-bold text-[#1E3F30] mb-6">
              Dokumentasi Kegiatan Forum
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rawDokumentasi.map((dok) => (
                <div
                  key={dok.id}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-2xs"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                    <Image
                      src={dok.url}
                      alt={dok.keterangan || 'Dokumentasi Forum'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {dok.keterangan && (
                    <p className="p-3 text-xs text-stone-600 font-medium">
                      {dok.keterangan}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}