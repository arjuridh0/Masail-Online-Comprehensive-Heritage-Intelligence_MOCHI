import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, CheckCircle2, MapPin, MessageSquare, ArrowRight, Activity } from 'lucide-react'
import { BadgeLencana } from './BadgeLencana'
import type { LembagaCardData } from './KartuLembaga'

interface BarisLembagaListProps {
  lembaga: LembagaCardData
}

export function BarisLembagaList({ lembaga }: BarisLembagaListProps) {
  return (
    <Link
      href={`/lembaga/${lembaga.slug}`}
      className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-4 sm:p-5 shadow-xs hover:border-[#1E3F30] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer block"
    >
      {/* Kolom Kiri: Identitas Lembaga & Logo */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D9D7CE] bg-white shadow-xs">
          {lembaga.logo_url ? (
            <Image
              src={lembaga.logo_url}
              alt={lembaga.nama}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-7 w-7 text-[#1E3F30]" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#1E3F30]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E3F30]">
              <CheckCircle2 className="h-3 w-3 text-[#1E3F30]" />
              <span>NSPP Terverifikasi</span>
            </span>
            {lembaga.nspp && (
              <span className="font-mono text-[10px] text-[#7A7672]">
                #{lembaga.nspp}
              </span>
            )}
            <span className="rounded-md bg-stone-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 uppercase">
              {lembaga.jenis.replace('_', ' ')}
            </span>
          </div>

          <h3 className="font-bold text-[#1E3F30] text-base group-hover:underline line-clamp-1">
            {lembaga.nama}
          </h3>

          <div className="flex items-center gap-3 text-xs text-[#5C5856] flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7A7672]" />
              <span>{lembaga.kota}, {lembaga.provinsi}</span>
            </span>

            {lembaga.deskripsi && (
              <span className="hidden lg:inline text-stone-400">&bull;</span>
            )}

            {lembaga.deskripsi && (
              <span className="hidden lg:inline text-stone-500 line-clamp-1 max-w-md">
                {lembaga.deskripsi}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Lencana, Statistik & Tombol Aksi */}
      <div className="flex items-center justify-between md:justify-end gap-5 border-t border-[#D9D7CE]/70 pt-3 md:border-t-0 md:pt-0 shrink-0">
        {/* Lencana */}
        {lembaga.lencana.length > 0 && (
          <div className="hidden sm:flex items-center gap-1">
            {lembaga.lencana.slice(0, 2).map((l) => (
              <BadgeLencana key={l.tipe} lencana={l} size="sm" />
            ))}
          </div>
        )}

        {/* Statistik */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5" title="Jumlah Forum Bahtsul Masail">
            <MessageSquare className="h-4 w-4 text-[#1E3F30]" />
            <div className="flex flex-col">
              <span className="font-bold text-[#1E3F30] leading-none">{lembaga.jumlahForum}</span>
              <span className="text-[10px] text-[#7A7672]">Forum</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5" title="Skor Keaktifan Pesantren">
            <Activity className="h-4 w-4 text-[#C9A96E]" />
            <div className="flex flex-col">
              <span className="font-bold text-[#1E3F30] leading-none">{lembaga.skorKeaktifan}</span>
              <span className="text-[10px] text-[#7A7672]">Poin</span>
            </div>
          </div>
        </div>

        {/* Tombol Profil */}
        <div className="flex items-center gap-1 text-xs font-semibold text-[#1E3F30] group-hover:text-[#152e23] pl-2 border-l border-stone-200">
          <span className="hidden sm:inline">Lihat Profil</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
export default BarisLembagaList
