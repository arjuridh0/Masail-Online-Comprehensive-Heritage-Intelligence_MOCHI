import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { WizardContainer } from '@/components/wizard/WizardContainer'

export const metadata: Metadata = {
  title: 'Edit Draf Bahtsul Masail | Dasbor MOCHI',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ForumEditPage({ params }: PageProps) {
  const { id } = await params
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    redirect(`/masuk?redirect=/dasbor/forum/${id}/edit`)
  }

  const adminDb = createAdminClient()

  // Ambil forum milik lembaga ini
  const { data: forum } = await adminDb
    .from('forum')
    .select('*')
    .eq('id', id)
    .single()

  if (!forum || forum.lembaga_id !== sesi.lembaga.id) {
    notFound()
  }

  // Ambil dokumentasi
  const { data: dokumentasi } = await adminDb
    .from('dokumentasi')
    .select('url')
    .eq('forum_id', id)
    .order('urutan', { ascending: true })

  // Ambil masalah beserta pertanyaan dan rujukan
  const { data: daftarMasalah } = await adminDb
    .from('masalah')
    .select(`
      id,
      kode,
      judul,
      deskripsi,
      topik,
      corak,
      kata_kunci,
      urutan,
      pertanyaan (
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
          urutan
        )
      )
    `)
    .eq('forum_id', id)
    .order('urutan', { ascending: true })

  // Ambil master kitab untuk autocomplete
  const { data: daftarKitab } = await adminDb
    .from('kitab')
    .select('id, nama_latin, nama_arab')
    .order('nama_latin', { ascending: true })

  const isVerified = sesi.lembaga.status === 'terverifikasi'

interface RawRujukan {
  id?: string
  kitab_id?: string | null
  kitab_teks: string
  juz?: string | null
  halaman?: string | null
  teks_arab: string
  terjemah?: string | null
  urutan?: number
}

interface RawPertanyaan {
  id?: string
  label?: string
  teks: string
  jawaban: string
  urutan?: number
  rujukan?: RawRujukan[]
}

interface RawMasalah {
  id?: string
  kode?: string
  judul: string
  deskripsi?: string | null
  topik?: Array<'ibadah' | 'muamalah' | 'munakahat'>
  corak?: 'waqi_iyyah' | 'maudhu_iyyah' | 'qanuniyyah'
  kata_kunci?: string[]
  urutan?: number
  pertanyaan?: RawPertanyaan[]
}

  // Format initialData untuk wizard
  const rawList = (daftarMasalah || []) as unknown as RawMasalah[]
  const formattedMasalah = rawList.map((m) => ({
    id: m.id,
    kode: m.kode,
    judul: m.judul,
    deskripsi: m.deskripsi || '',
    topik: m.topik || ['muamalah'],
    corak: m.corak || 'waqi_iyyah',
    kata_kunci: m.kata_kunci || [],
    urutan: m.urutan || 1,
    pertanyaan: (m.pertanyaan || []).map((p) => ({
      id: p.id,
      label: p.label || 'a',
      teks: p.teks,
      jawaban: p.jawaban,
      urutan: p.urutan || 1,
      rujukan: (p.rujukan || []).map((r) => ({
        id: r.id,
        kitab_id: r.kitab_id,
        kitab_teks: r.kitab_teks,
        juz: r.juz || '',
        halaman: r.halaman || '',
        teks_arab: r.teks_arab,
        terjemah: r.terjemah || '',
        urutan: r.urutan || 1,
      })),
    })),
  }))

  const initialData = {
    id: forum.id,
    nama: forum.nama || '',
    tuan_rumah: forum.tuan_rumah,
    tanggal_mulai: forum.tanggal_mulai,
    tanggal_selesai: forum.tanggal_selesai || '',
    tanggal_hijriah: forum.tanggal_hijriah || '',
    lokasi: forum.lokasi || '',
    moderator: forum.moderator || [],
    pentashih: forum.pentashih || [],
    perumus: forum.perumus || [],
    status: forum.status as 'draf' | 'terbit',
    dokumentasi: (dokumentasi || []).map((d) => d.url),
    masalah: formattedMasalah,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dasbor/forum"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#1E3F30]">
            Edit Forum: {forum.nama || forum.tuan_rumah}
          </h1>
          <p className="text-xs text-stone-600">
            Status: <span className="font-bold uppercase">{forum.status}</span>
          </p>
        </div>
      </div>

      <WizardContainer
        initialData={initialData}
        isVerifiedLembaga={isVerified}
        masterKitab={daftarKitab || []}
      />
    </div>
  )
}