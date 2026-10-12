import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, CheckCircle2, MapPin, MessageSquare, ArrowRight, Activity } from 'lucide-react'
import { BadgeLencana } from './BadgeLencana'
import type { InfoLencana } from '@/lib/skor'

export interface LembagaCardData {
  id: string
  nama: string
  slug: string
  jenis: string
  kota: string
  provinsi: string
  nspp?: string | null
  logo_url?: string | null
  deskripsi?: string | null
  jumlahForum: number
  jumlahMasalah: number
  skorKeaktifan: number
  lencana: InfoLencana[]
}

interface KartuLembagaProps {
  lembaga: LembagaCardData
}

export function KartuLembaga({ lembaga }: KartuLembagaProps) {
  return (
    <Link
      href={`/lembaga/${lembaga.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs hover:border-[#1E3F30] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer block"
    >
      <div>
        {/* Header: Logo, Nama, dan Verifikasi */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D9D7CE] bg-white shadow-xs">
            {lembaga.logo_url ? (
              <Image
                src={lembaga.logo_url}
                alt={lembaga.nama}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-[#1E3F30]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#1E3F30]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E3F30]">
                <CheckCircle2 className="h-3 w-3 text-[#1E3F30]" />
                <span>NSPP Terverifikasi</span>
              </span>
              {lembaga.nspp && (
                <span className="font-mono text-[10px] text-[#7A7672]">
                  #{lembaga.nspp}
                </span>
              )}
            </div>

            <h3 className="mt-1 block font-bold text-[#1E3F30] text-base group-hover:underline line-clamp-1">
              {lembaga.nama}
            </h3>

            <div className="mt-0.5 flex items-center gap-1 text-xs text-[#5C5856]">
              <MapPin className="h-3 w-3 shrink-0 text-[#7A7672]" />
              <span className="truncate">
                {lembaga.kota}, {lembaga.provinsi}
              </span>
            </div>
          </div>
        </div>

        {/* Lencana Keaktifan Pesantren */}
        {lembaga.lencana.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {lembaga.lencana.map((l) => (
              <BadgeLencana key={l.tipe} lencana={l} size="sm" />
            ))}
          </div>
        )}

        {/* Deskripsi Singkat */}
        {lembaga.deskripsi && (
          <p className="mt-3 text-xs text-[#5C5856] line-clamp-2 leading-relaxed">
            {lembaga.deskripsi}
          </p>
        )}
      </div>

      {/* Footer: Statistik Forum & Link Detail */}
      <div className="mt-5 border-t border-[#D9D7CE]/70 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#5C5856]">
          <div className="flex items-center gap-1" title="Jumlah Forum Bahtsul Masail">
            <MessageSquare className="h-3.5 w-3.5 text-[#1E3F30]" />
            <span className="font-semibold text-[#1E3F30]">{lembaga.jumlahForum}</span>
            <span className="text-[11px] text-[#7A7672]">Forum</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1" title="Skor Keaktifan Pesantren">
            <Activity className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="font-semibold text-[#1E3F30]">{lembaga.skorKeaktifan}</span>
            <span className="text-[11px] text-[#7A7672]">Poin</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3F30] group-hover:text-[#152e23]">
          <span>Profil</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
