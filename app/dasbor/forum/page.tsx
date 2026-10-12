import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Calendar, MapPin, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { ForumAksiBilah } from '@/components/forum/ForumAksiBilah'

export const metadata: Metadata = {
  title: 'Kelola Forum Bahtsul Masail | Dasbor MOCHI',
}

export default async function DasborForumPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'semua' } = await searchParams
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    redirect('/masuk?redirect=/dasbor/forum')
  }

  const adminDb = createAdminClient()

  let query = adminDb
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
      status,
      dibuat_pada,
      masalah ( id )
    `)
    .eq('lembaga_id', sesi.lembaga.id)
    .order('dibuat_pada', { ascending: false })

  if (tab === 'terbit') {
    query = query.eq('status', 'terbit')
  } else if (tab === 'draf') {
    query = query.eq('status', 'draf')
  }

  const { data: daftarForum } = await query

  const isSuspended = sesi.lembaga.status === 'ditangguhkan'

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1E3F30]">
            Kelola Forum Bahtsul Masail
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Arsip penyelenggaraan forum musyawarah & keputusan hukum milik {sesi.lembaga.nama}
          </p>
        </div>

        {isSuspended ? (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-200 px-4 py-2.5 text-xs font-bold text-stone-500 cursor-not-allowed shadow-none"
            title="Penerbitan dibekukan karena akun sedang ditangguhkan"
          >
            <Plus className="h-4 w-4" />
            <span>+ Buat Forum (Dibekukan)</span>
          </button>
        ) : (
          <Link
            href="/dasbor/forum/baru"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>+ Buat Forum Baru</span>
          </Link>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <Link
          href="/dasbor/forum"
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
            tab === 'semua'
              ? 'bg-[#1E3F30] text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          Semua Forum
        </Link>
        <Link
          href="/dasbor/forum?tab=terbit"
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
            tab === 'terbit'
              ? 'bg-[#1E3F30] text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          Terbit
        </Link>
        <Link
          href="/dasbor/forum?tab=draf"
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
            tab === 'draf'
              ? 'bg-[#1E3F30] text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          Draf
        </Link>
      </div>

      {/* Daftar Kartu Forum */}
      {!daftarForum || daftarForum.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-stone-300 mb-3" />
          <h3 className="text-sm font-bold text-stone-800">Belum ada forum {tab !== 'semua' ? `status ${tab}` : ''}</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Mulailah mencatat keputusan musyawarah santri dengan membuat forum masail baru.
          </p>
          <Link
            href="/dasbor/forum/baru"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white hover:bg-[#162f24] mt-5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Mulai Catat Forum</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {daftarForum.map((forum) => {
            const isTerbit = forum.status === 'terbit'
            const jumlahMasalah = forum.masalah?.length || 0

            return (
              <div
                key={forum.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3 hover:border-stone-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isTerbit
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isTerbit ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <span>{forum.status}</span>
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {jumlahMasalah} Masalah Diputuskan
                      </span>
                    </div>

                    <h2 className="text-sm font-black text-[#1E3F30]">
                      {forum.nama || `Forum ${forum.tuan_rumah}`}
                    </h2>
                  </div>
                </div>

                {/* Metadata Waktu & Lokasi */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#8C733E]" />
                    <span>
                      {forum.tanggal_mulai} {forum.tanggal_hijriah ? `(${forum.tanggal_hijriah})` : ''}
                    </span>
                  </div>
                  {forum.lokasi && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#8C733E]" />
                      <span>{forum.lokasi}</span>
                    </div>
                  )}
                </div>

                {/* Bilah Aksi Interaktif */}
                <ForumAksiBilah
                  forumId={forum.id}
                  slug={forum.slug}
                  status={forum.status as 'draf' | 'terbit'}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}