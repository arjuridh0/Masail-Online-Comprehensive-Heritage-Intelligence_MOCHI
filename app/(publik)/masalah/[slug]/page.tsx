import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DetailMasalahClient } from '@/components/masalah/DetailMasalahClient'
import { formatSitasiMochi } from '@/lib/sitasi'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: masalah } = await supabase
    .from('masalah')
    .select(`
      judul,
      deskripsi,
      kode,
      topik,
      forum:forum_id (
        nama,
        lembaga:lembaga_id (
          nama
        )
      )
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (!masalah) {
    return {
      title: 'Keputusan Tidak Ditemukan | MOCHI',
      description: 'Halaman keputusan bahtsul masail tidak ditemukan di MOCHI.',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const forum = masalah.forum as any
  const lembagaNama = forum?.lembaga?.nama || 'Pesantren Mitra'
  const title = `${masalah.judul} (${masalah.kode}) | MOCHI`
  const description = `${masalah.deskripsi.slice(0, 155)}... Diputuskan oleh ${lembagaNama}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/masalah/${slug}`,
      siteName: 'MOCHI - Masail Online & Comprehensive Heritage Intelligence',
      images: [
        {
          url: '/brand/mochi-symbol-512.png',
          width: 512,
          height: 512,
          alt: `Keputusan Bahtsul Masail: ${masalah.judul}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function DetailMasalahPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Ambil data masalah beserta forum dan lembaga
  const { data: masalah, error: masalahErr } = await supabase
    .from('masalah')
    .select(`
      id,
      kode,
      slug,
      forum_id,
      judul,
      deskripsi,
      topik,
      corak,
      kata_kunci,
      tayangan,
      forum:forum_id (
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
        lembaga:lembaga_id (
          id,
          slug,
          nama,
          kota,
          provinsi,
          nspp,
          logo_url,
          status
        )
      )
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (masalahErr || !masalah || !masalah.forum) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const forum = masalah.forum as any
  if (forum.status !== 'terbit') {
    notFound()
  }
  const lembaga = forum.lembaga

  // 2. Ambil pertanyaan dan rujukan
  const { data: rawPertanyaan } = await supabase
    .from('pertanyaan')
    .select(`
      id,
      label,
      teks,
      jawaban,
      urutan,
      rujukan (
        id,
        kitab_id,
        kitab_teks,
        juz,
        halaman,
        teks_arab,
        terjemah,
        urutan,
        kitab:kitab_id (
          nama_latin,
          nama_arab,
          pengarang
        )
      )
    `)
    .eq('masalah_id', masalah.id)
    .order('urutan', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedPertanyaan = (rawPertanyaan || []).map((p: any) => ({
    id: p.id,
    label: p.label,
    teks: p.teks,
    jawaban: p.jawaban,
    urutan: p.urutan,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rujukan: (p.rujukan || []).map((r: any) => ({
      id: r.id,
      kitab_latin: r.kitab?.nama_latin || r.kitab_teks || 'Kitab Turats',
      kitab_arab: r.kitab?.nama_arab || null,
      pengarang: r.kitab?.pengarang || null,
      juz: r.juz,
      halaman: r.halaman,
      teks_arab: r.teks_arab,
      terjemah: r.terjemah,
      urutan: r.urutan,
    })),
  }))

  // 3. Ambil dokumentasi foto forum
  const { data: rawDokumentasi } = await supabase
    .from('dokumentasi')
    .select('id, url, keterangan, urutan')
    .eq('forum_id', forum.id)
    .order('urutan', { ascending: true })

  // 4. Ambil masalah terkait (dari forum lain yang memiliki kemiripan topik atau kata kunci)
  const topikUtama = masalah.topik?.[0] || 'muamalah'
  const { data: rawTerkait } = await supabase
    .from('masalah')
    .select(`
      id,
      kode,
      slug,
      judul,
      deskripsi,
      topik,
      forum:forum_id (
        nama,
        lokasi,
        tanggal_mulai,
        pentashih,
        lembaga:lembaga_id (
          nama
        )
      ),
      pertanyaan (
        label,
        teks,
        jawaban,
        rujukan (
          juz,
          halaman,
          teks_arab,
          kitab:kitab_id (nama_latin)
        )
      )
    `)
    .neq('id', masalah.id)
    .contains('topik', [topikUtama])
    .limit(4)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedTerkait = (rawTerkait || []).map((t: any) => {
    const f = t.forum || {}
    const l = f.lembaga || {}
    return {
      id: t.id,
      kode: t.kode,
      slug: t.slug,
      judul: t.judul,
      deskripsi: t.deskripsi,
      lembaga_nama: l.nama || 'Lembaga Pesantren',
      forum_nama: f.nama || 'Forum Bahtsul Masail',
      tahun: f.tanggal_mulai ? new Date(f.tanggal_mulai).getFullYear() : 2024,
      lokasi: f.lokasi || 'Indonesia',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pertanyaan: (t.pertanyaan || []).map((pt: any) => ({
        label: pt.label,
        teks: pt.teks,
        jawaban: pt.jawaban,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rujukan: (pt.rujukan || []).map((rk: any) => ({
          kitab: rk.kitab?.nama_latin || 'Kitab Turats',
          juz: rk.juz,
          halaman: rk.halaman,
          teks_arab: rk.teks_arab,
        })),
      })),
      pentashih: f.pentashih || [],
    }
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mochi.pesantren.id'
  const sitasiTeks = formatSitasiMochi({
    lembagaNama: lembaga.nama,
    masalahJudul: masalah.judul,
    forumNama: forum.nama,
    tempat: forum.kota || forum.lokasi,
    tanggalMulai: forum.tanggal_mulai,
    tanggalSelesai: forum.tanggal_selesai,
    kode: masalah.kode,
    slug: masalah.slug,
    baseUrl,
  })

  const canonicalUrl = `${baseUrl.replace(/\/$/, '')}/masalah/${masalah.slug}`

  return (
    <DetailMasalahClient
      masalah={masalah}
      forum={forum}
      lembaga={lembaga}
      pertanyaan={formattedPertanyaan}
      dokumentasi={rawDokumentasi || []}
      terkait={formattedTerkait}
      sitasiTeks={sitasiTeks}
      canonicalUrl={canonicalUrl}
    />
  )
}