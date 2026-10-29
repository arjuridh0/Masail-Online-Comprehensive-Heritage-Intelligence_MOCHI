"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Building2, Calendar, ChevronRight } from 'lucide-react'
import type { ItemPerbandingan} from './ModalBandingkan';
import { ModalBandingkan } from './ModalBandingkan'

export interface TerkaitItem {
  id: string
  kode: string
  slug: string
  judul: string
  deskripsi: string
  lembaga_nama: string
  forum_nama: string
  tahun: string | number
  lokasi: string
  pertanyaan: {
    label: string
    teks: string
    jawaban: string
    rujukan: {
      kitab: string
      juz?: string | null
      halaman?: string | null
      teks_arab?: string | null
    }[]
  }[]
  pentashih?: string[]
}

interface PanelTerkaitProps {
  masalahUtama: ItemPerbandingan
  daftarTerkait: TerkaitItem[]
}

export function PanelTerkait({ masalahUtama, daftarTerkait }: PanelTerkaitProps) {
  const [selectedPembanding, setSelectedPembanding] = useState<ItemPerbandingan | null>(null)

  if (!daftarTerkait || daftarTerkait.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl border border-[#D9D3C3] bg-[#FAF8F2] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E8E2D2] pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-[#8C733E]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E3F30]">
            Pernah Dibahas di Forum Lain
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-stone-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E8E2D2]">
          {daftarTerkait.length} Keputusan Terkait
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {daftarTerkait.map((item) => {
          const itemForBandingkan: ItemPerbandingan = {
            id: item.id,
            kode: item.kode,
            slug: item.slug,
            judul: item.judul,
            lembaga: item.lembaga_nama,
            forum: item.forum_nama,
            tahun: item.tahun,
            lokasi: item.lokasi,
            pertanyaan: item.pertanyaan,
            pentashih: item.pentashih,
          }

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-xl border border-[#E3DCB] bg-white p-4 shadow-2xs transition-all hover:border-[#C9A96E] hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#8C733E]">
                    {item.kode}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#8C733E]" /> {item.tahun}
                  </span>
                </div>

                <Link
                  href={`/masalah/${item.slug}`}
                  className="mt-1.5 block font-bold text-sm text-[#1E3F30] hover:underline line-clamp-2 leading-snug"
                >
                  {item.judul}
                </Link>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-600">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                  <span className="truncate">{item.lembaga_nama}</span>
                </div>

                <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedPembanding(itemForBandingkan)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF8F2] px-3 py-1.5 text-xs font-bold text-[#1E3F30] border border-[#DDD6C5] hover:bg-[#F0EBDC] transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-[#8C733E]" />
                  <span>Bandingkan</span>
                </button>

                <Link
                  href={`/masalah/${item.slug}`}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-stone-600 hover:text-[#1E3F30]"
                >
                  <span>Buka</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {selectedPembanding && (
        <ModalBandingkan
          masalahUtama={masalahUtama}
          masalahPembanding={selectedPembanding}
          isOpen={true}
          onClose={() => setSelectedPembanding(null)}
        />
      )}
    </div>
  )
}
