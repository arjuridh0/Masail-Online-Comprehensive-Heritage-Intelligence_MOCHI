import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronRight, Hash } from 'lucide-react'
import SearchBarKitab from '@/components/kitab/SearchBarKitab'
import { TombolKembali } from '@/components/ui/TombolKembali'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Katalog Kitab Turats Rujukan | MOCHI',
  description:
    'Daftar kitab-kitab turats klasik yang menjadi al-ma’khadz dan rujukan dalam forum Bahtsul Masail Nahdlatul Ulama.',
}

export default async function KatalogKitabPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  // Ambil semua master kitab turats
  const { data: rawKitab } = await supabase
    .from('kitab')
    .select(`
      id,
      slug,
      nama_latin,
      nama_arab,
      pengarang,
      pengarang_arab,
      wafat_h,
      bidang,
      rujukan (
        id
      )
    `)
    .order('nama_latin', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listKitab = (rawKitab || []).map((k: any) => ({
    id: k.id,
    slug: k.slug,
    nama_latin: k.nama_latin,
    nama_arab: k.nama_arab,
    pengarang: k.pengarang,
    pengarang_arab: k.pengarang_arab,
    wafat_h: k.wafat_h,
    bidang: k.bidang || 'Fiqih',
    jumlah_rujukan: k.rujukan?.length || 0,
  }))

  if (q) {
    const qLower = q.toLowerCase()
    listKitab = listKitab.filter(
      (k) =>
        k.nama_latin.toLowerCase().includes(qLower) ||
        (k.nama_arab && k.nama_arab.includes(q)) ||
        (k.pengarang && k.pengarang.toLowerCase().includes(qLower)) ||
        (k.bidang && k.bidang.toLowerCase().includes(qLower))
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Tombol Kembali & Breadcrumb Navigasi */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC]/70 pb-4">
        <TombolKembali
          hrefDefault="/perpustakaan"
          label="Kembali ke Perpustakaan"
          testId="tombol-kembali-kitab"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500"
        >
          <Link href="/" className="hover:text-[#1E3F30] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="font-medium text-stone-700">Kitab Rujukan</span>
        </nav>
      </div>

      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE5D5] px-3.5 py-1 text-xs font-bold text-[#1E3F30] mb-3">
          <BookOpen className="h-3.5 w-3.5 text-[#8C733E]" />
          Al-Ma'khadz (Sumber Nash)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3F30]">
          Indeks Kitab Turats Rujukan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
          Kutipan ibarat dan nash dari kitab-kitab muktabarah mazhab Syafi'i dan mazhab empat yang menjadi fondasi pengambilan keputusan hukum para kiai dan santri.
        </p>
      </div>

      {/* Pencarian Kitab */}
      <div className="mb-8 flex justify-center">
        <SearchBarKitab defaultValue={q || ''} />
      </div>

      {/* Grid Kartu Kitab */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listKitab.map((kitab) => (
          <div
            key={kitab.id}
            className="group flex flex-col justify-between rounded-2xl border border-[#D9D3C3] bg-white p-6 shadow-xs transition-all hover:border-[#C9A96E] hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                <span className="rounded-md bg-[#FAF8F2] px-2.5 py-1 text-xs font-semibold text-[#8C733E] border border-[#E8E2D2]">
                  {kitab.bidang}
                </span>

                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#1E3F30]">
                  <Hash className="h-3 w-3 text-stone-400" />
                  {kitab.jumlah_rujukan} Ibarat
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#1E3F30]">
                {kitab.nama_latin}
              </h2>

              {kitab.nama_arab && (
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-1 font-serif text-xl font-medium text-[#8C733E]"
                  style={{ fontFamily: 'var(--font-amiri), serif' }}
                >
                  {kitab.nama_arab}
                </p>
              )}

              {kitab.pengarang && (
                <p className="mt-3 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Musonnif: </span>
                  {kitab.pengarang}
                  {kitab.wafat_h && (
                    <span className="text-stone-500 font-mono">
                      {' '}(w. {kitab.wafat_h} H)
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between">
              <Link
                href={`/perpustakaan?q=${encodeURIComponent(kitab.nama_latin)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3F30] hover:underline"
              >
                <span>Cari Keputusan yang Merujuk</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
