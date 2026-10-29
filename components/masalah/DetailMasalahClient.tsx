"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  Hash,
  MapPin,
  Tag,
} from 'lucide-react'
import type { RujukanItem } from './KotakIbarat';
import { KotakIbarat } from './KotakIbarat'
import type { SanadMasalahData } from './KartuSanad';
import { KartuSanad } from './KartuSanad'
import { BilahAksi } from './BilahAksi'
import type { TerkaitItem } from './PanelTerkait';
import { PanelTerkait } from './PanelTerkait'
import { ViewTracker } from './ViewTracker'
import type { ItemPerbandingan } from './ModalBandingkan'
import { formatRentangTanggal } from '@/lib/sitasi'
import { TombolKembali } from '@/components/ui/TombolKembali'

interface DetailMasalahClientProps {
  masalah: {
    id: string
    kode: string
    slug: string
    judul: string
    deskripsi: string
    topik: string[]
    corak?: string | null
    kata_kunci: string[]
    tayangan: number
  }
  forum: SanadMasalahData['forum']
  lembaga: SanadMasalahData['lembaga']
  pertanyaan: {
    id: string
    label: string
    teks: string
    jawaban: string
    urutan: number
    rujukan: RujukanItem[]
  }[]
  dokumentasi: {
    id: string
    url: string
    keterangan?: string | null
  }[]
  terkait: TerkaitItem[]
  sitasiTeks: string
  canonicalUrl: string
}

export function DetailMasalahClient({
  masalah,
  forum,
  lembaga,
  pertanyaan,
  dokumentasi,
  terkait,
  sitasiTeks,
  canonicalUrl,
}: DetailMasalahClientProps) {
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mochi_arab_font_size')
      if (saved === 'md' || saved === 'lg' || saved === 'xl') {
        setFontSize(saved)
      }
    } catch {
      // Ignore localStorage error
    }
  }, [])

  const handleFontSizeChange = (size: 'md' | 'lg' | 'xl') => {
    setFontSize(size)
    try {
      localStorage.setItem('mochi_arab_font_size', size)
    } catch {
      // Ignore
    }
  }

  const fontSizeClass =
    fontSize === 'md'
      ? 'text-xl sm:text-2xl leading-[2.1]'
      : fontSize === 'lg'
      ? 'text-2xl sm:text-3xl leading-[2.3]'
      : 'text-3xl sm:text-4xl leading-[2.5]'

  const sanadData: SanadMasalahData = { lembaga, forum }

  const masalahUtamaBandingkan: ItemPerbandingan = {
    id: masalah.id,
    kode: masalah.kode,
    slug: masalah.slug,
    judul: masalah.judul,
    lembaga: lembaga.nama,
    forum: forum.nama || 'Forum Bahtsul Masail',
    tahun: new Date(forum.tanggal_mulai).getFullYear(),
    lokasi: forum.lokasi,
    pertanyaan: pertanyaan.map((p) => ({
      label: p.label,
      teks: p.teks,
      jawaban: p.jawaban,
      rujukan: p.rujukan.map((r) => ({
        kitab: r.kitab_latin,
        juz: r.juz,
        halaman: r.halaman,
        teks_arab: r.teks_arab,
      })),
    })),
    pentashih: forum.pentashih,
  }

  return (
    <>
      <ViewTracker targetId={masalah.id} jenis="masalah" />

      <article className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
        {/* Tombol Kembali & Breadcrumb Navigasi */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC]/70 pb-4">
          <TombolKembali
            hrefDefault="/perpustakaan"
            label="Kembali ke Perpustakaan"
            testId="tombol-kembali-detail"
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
            {masalah.topik[0] && (
              <>
                <Link
                  href={`/perpustakaan?topik=${masalah.topik[0]}`}
                  className="capitalize hover:text-[#1E3F30] transition-colors"
                >
                  {masalah.topik[0]}
                </Link>
                <ChevronRight className="h-3 w-3 text-stone-400" />
              </>
            )}
            <span className="font-mono font-medium text-stone-700">
              {masalah.kode}
            </span>
          </nav>
        </div>

        {/* Header Utama Keputusan */}
        <header className="border-b border-[#E3DCB] pb-8 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#1E3F30] px-2.5 py-1 text-xs font-mono font-bold text-white shadow-2xs">
              <Hash className="h-3.5 w-3.5 text-[#C9A96E]" />
              {masalah.kode}
            </span>

            {masalah.topik.map((t) => (
              <span
                key={t}
                className="rounded-md border border-[#D9D3C3] bg-[#F7F5EE] px-2.5 py-1 text-xs font-semibold capitalize text-[#1E3F30]"
              >
                {t}
              </span>
            ))}

            {masalah.corak && (
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 capitalize">
                Corak {masalah.corak}
              </span>
            )}

            <span className="ml-auto inline-flex items-center gap-1 text-xs text-stone-500">
              <Eye className="h-3.5 w-3.5" />
              <span>{masalah.tayangan || 1}x dilihat</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1E3F30] leading-tight">
            {masalah.judul}
          </h1>

          {/* Baris Sanad Ringkas Header */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-600">
            <Link
              href={`/lembaga/${lembaga.slug}`}
              className="font-bold text-[#1E3F30] hover:underline"
            >
              {lembaga.nama}
            </Link>
            <span className="text-stone-300">&bull;</span>
            <Link
              href={`/forum/${forum.slug}`}
              className="font-medium hover:text-[#1E3F30] hover:underline"
            >
              {forum.nama || 'Forum Bahtsul Masail'}
            </Link>
            <span className="text-stone-300">&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#8C733E]" />
              {formatRentangTanggal(forum.tanggal_mulai, forum.tanggal_selesai)}
            </span>
            <span className="text-stone-300">&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-stone-400" />
              {forum.lokasi}
            </span>
          </div>

          {/* Deskripsi Kasus / Latar Belakang Mas'alah */}
          <div className="mt-6 rounded-2xl border border-[#D9D3C3] bg-[#FAF8F2] p-5 sm:p-6 text-stone-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Deskripsi Masalah (Tasawwur al-Mas'alah):
            </h2>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-stone-800">
              {masalah.deskripsi}
            </p>

            {masalah.kata_kunci && masalah.kata_kunci.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#E8E2D2]">
                <Tag className="h-3.5 w-3.5 text-stone-400" />
                <span className="text-xs text-stone-500">Kata kunci:</span>
                {masalah.kata_kunci.map((k, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-stone-200/70 px-2 py-0.5 text-xs text-stone-700 font-medium"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Layout Grid 2 Kolom: Konten Utama & Sidebar Sanad */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Kolom Kiri: Rangkaian Pertanyaan, Diktum Jawaban & Ibarat Kitab */}
          <main className="lg:col-span-8 space-y-10">
            {/* Daftar Isi Mini (Jika > 1 Pertanyaan) */}
            {pertanyaan.length > 1 && (
              <div className="rounded-xl border border-[#E3DCB] bg-[#FCFBF8] p-4 text-xs">
                <span className="font-bold text-[#1E3F30] block mb-2">
                  Daftar Pertanyaan As'ilah:
                </span>
                <ul className="space-y-1.5">
                  {pertanyaan.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`#pertanyaan-${p.label.toLowerCase()}`}
                        className="flex items-center gap-2 text-stone-700 hover:text-[#1E3F30] hover:underline"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3F30] text-[9px] font-bold text-white">
                          {p.label.toUpperCase()}
                        </span>
                        <span className="line-clamp-1">{p.teks}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Font Size Switcher untuk Kenyamanan Pembacaan Turats */}
            <div className="flex items-center justify-between rounded-xl border border-[#D9D3C3] bg-[#FAF8F2] px-4 py-2.5 text-xs text-stone-700 shadow-2xs">
              <span className="font-semibold text-stone-700">Ukuran Teks Arab:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('md')}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'md'
                      ? 'bg-[#1E3F30] text-white shadow-2xs'
                      : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                  aria-label="Ukuran huruf Arab sedang"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('lg')}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'lg'
                      ? 'bg-[#1E3F30] text-white shadow-2xs'
                      : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                  aria-label="Ukuran huruf Arab besar"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('xl')}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'xl'
                      ? 'bg-[#1E3F30] text-white shadow-2xs'
                      : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                  aria-label="Ukuran huruf Arab ekstra besar"
                >
                  A++
                </button>
              </div>
            </div>

            {/* Loop Pertanyaan */}
            {pertanyaan.map((item, idx) => (
              <section
                key={item.id}
                id={`pertanyaan-${item.label.toLowerCase()}`}
                className="scroll-mt-24 space-y-6 rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-8 shadow-xs"
              >
                {/* As'ilah Header */}
                <div className="border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E3F30] text-xs font-bold text-white shadow-2xs">
                      {item.label.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C733E]">
                      As'ilah {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                    {item.teks}
                  </h3>
                </div>

                {/* Diktum Keputusan Hukum (Jawaban) */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Diktum Keputusan Hukum:
                  </span>
                  <div className="rounded-xl border border-emerald-100 bg-[#F5F8F6] p-4 sm:p-5 text-stone-900 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-2xs font-normal">
                    {item.jawaban}
                  </div>
                </div>

                {/* Al-Ma'khadz / Ibarat Rujukan Kitab */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#8C733E]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Al-Ma'khadz (Ibarat Rujukan Kitab)
                      </h4>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {item.rujukan.length} Ibarat
                    </span>
                  </div>

                  {item.rujukan.length === 0 ? (
                    <p className="text-xs text-stone-500 italic rounded-lg bg-stone-50 p-3 border border-stone-200">
                      Rujukan tercatat dalam arsip tanpa kutipan nash terpisah.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {item.rujukan.map((rujuk) => (
                        <KotakIbarat
                          key={rujuk.id}
                          rujukan={rujuk}
                          fontSizeClass={fontSizeClass}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}

            {/* Panel Pernah Dibahas di Forum Lain (Perbandingan Lintas Bahtsul Masail) */}
            <PanelTerkait
              masalahUtama={masalahUtamaBandingkan}
              daftarTerkait={terkait}
            />

            {/* Dokumentasi Foto Forum */}
            {dokumentasi && dokumentasi.length > 0 && (
              <section className="rounded-2xl border border-[#D9D3C3] bg-white p-5 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3F30] mb-4">
                  Dokumentasi Persidangan Forum
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dokumentasi.map((dok) => (
                    <div
                      key={dok.id}
                      className="group overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                        <Image
                          src={dok.url}
                          alt={dok.keterangan || 'Dokumentasi Bahtsul Masail'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      {dok.keterangan && (
                        <p className="p-3 text-xs text-stone-600">
                          {dok.keterangan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Kolom Kanan: Bilah Aksi, Sticky Kartu Sanad, & Panel Terkait */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Bilah Aksi (Kutip, Bagikan, Lapor, Font Size) */}
            <BilahAksi
              masalahId={masalah.id}
              kode={masalah.kode}
              judul={masalah.judul}
              sitasiTeks={sitasiTeks}
              urlTeks={canonicalUrl}
              fontSize={fontSize}
              onChangeFontSize={handleFontSizeChange}
            />

            {/* Kartu Sanad Lengkap */}
            <div className="sticky top-20">
              <KartuSanad data={sanadData} />
            </div>
          </aside>
        </div>
      </article>
    </>
  )
}
