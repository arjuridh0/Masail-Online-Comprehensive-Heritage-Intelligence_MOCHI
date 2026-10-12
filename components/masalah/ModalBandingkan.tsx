"use client"

import { useState } from 'react'
import {
  ArrowLeftRight,
  BookOpen,
  Building2,
  Calendar,
  X,
} from 'lucide-react'

export interface ItemPerbandingan {
  id: string
  kode: string
  slug: string
  judul: string
  lembaga: string
  forum: string
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

interface ModalBandingkanProps {
  masalahUtama: ItemPerbandingan
  masalahPembanding: ItemPerbandingan
  isOpen: boolean
  onClose: () => void
}

export function ModalBandingkan({
  masalahUtama,
  masalahPembanding,
  isOpen,
  onClose,
}: ModalBandingkanProps) {
  const [activeTab, setActiveTab] = useState<'utama' | 'pembanding'>('utama')

  if (!isOpen) return null

  const items = [
    { key: 'utama' as const, label: `${masalahUtama.lembaga} (${masalahUtama.tahun})`, data: masalahUtama },
    { key: 'pembanding' as const, label: `${masalahPembanding.lembaga} (${masalahPembanding.tahun})`, data: masalahPembanding },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl border border-[#D9D3C3] animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#E3DCB] bg-[#F7F5EE] px-5 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3F30] text-[#C9A96E]">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E3F30]">
                Komparasi Keputusan Bahtsul Masail
              </h2>
              <p className="text-xs text-stone-600">
                Membandingkan diktum hukum dan ibarat rujukan antar forum secara objektif dan netral
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher untuk layar HP (< 768px) */}
        <div className="flex border-b border-stone-200 bg-stone-50 p-2 md:hidden">
          {items.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#1E3F30] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Komparasi */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Tampilan Desktop: 2 Kolom Berdampingan */}
          <div className="hidden grid-cols-2 gap-6 md:grid">
            {items.map((col) => (
              <KolomKeputusan key={col.key} item={col.data} />
            ))}
          </div>

          {/* Tampilan Mobile: Tab Switcher */}
          <div className="md:hidden">
            <KolomKeputusan
              item={activeTab === 'utama' ? masalahUtama : masalahPembanding}
            />
          </div>
        </div>

        {/* Footer Penafian Netral */}
        <div className="border-t border-[#E8E2D2] bg-[#FAF8F2] px-5 py-3 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-600">
          <p className="italic">
            * Perbedaan rumusan hukum mencerminkan khazanah ijtihad dan kekayaan furu'iyah dalam tradisi Bahtsul Masail Nahdlatul Ulama.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-900"
          >
            Tutup Komparasi
          </button>
        </div>
      </div>
    </div>
  )
}

function KolomKeputusan({ item }: { item: ItemPerbandingan }) {
  return (
    <div className="rounded-xl border border-[#D9D3C3] bg-[#FCFBF8] p-5 space-y-4">
      {/* Profil Forum */}
      <div className="border-b border-[#E8E2D2] pb-3">
        <span className="font-mono text-[11px] font-bold text-[#8C733E]">
          {item.kode}
        </span>
        <h3 className="text-base font-bold text-[#1E3F30] mt-0.5">
          {item.judul}
        </h3>

        <div className="mt-2 space-y-1 text-xs text-stone-600">
          <p className="flex items-center gap-1.5 font-medium text-stone-800">
            <Building2 className="h-3.5 w-3.5 text-[#1E3F30]" /> {item.lembaga}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#1E3F30]" /> {item.forum} ({item.tahun}) &bull; {item.lokasi}
          </p>
        </div>
      </div>

      {/* Rangkaian As'ilah & Jawaban */}
      <div className="space-y-4">
        {item.pertanyaan.map((pert, idx) => (
          <div key={idx} className="rounded-lg bg-white p-4 border border-[#E8E2D2] shadow-2xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E3F30] text-[10px] font-bold text-white">
                {pert.label.toUpperCase()}
              </span>
              <p className="text-xs font-semibold text-stone-800">
                {pert.teks}
              </p>
            </div>

            <div className="pl-7">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Diktum Keputusan Hukum:
              </span>
              <p className="text-xs leading-relaxed text-stone-700 whitespace-pre-line">
                {pert.jawaban}
              </p>

              {/* Rujukan Ibarat */}
              {pert.rujukan && pert.rujukan.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-dashed border-[#DDD6C5]">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Ibarat Kitab Rujukan:
                  </span>
                  <div className="space-y-1.5">
                    {pert.rujukan.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded bg-[#FAF8F2] p-2 text-[11px] border border-[#ECE5D2]"
                      >
                        <p className="font-semibold text-[#1E3F30] flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-[#8C733E]" /> {r.kitab}
                          {(r.juz || r.halaman) && (
                            <span className="text-stone-500 font-normal">
                              ({r.juz ? `Juz ${r.juz}` : ''}{r.juz && r.halaman ? ', ' : ''}{r.halaman ? `Hal. ${r.halaman}` : ''})
                            </span>
                          )}
                        </p>
                        {r.teks_arab && (
                          <p
                            dir="rtl"
                            lang="ar"
                            className="mt-1 font-serif text-xs text-stone-800 text-right line-clamp-2"
                            style={{ fontFamily: 'var(--font-amiri), serif' }}
                          >
                            {r.teks_arab}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mushohhih */}
      {item.pentashih && item.pentashih.length > 0 && (
        <div className="pt-2 border-t border-[#E8E2D2] text-[11px] text-stone-600">
          <span className="font-semibold text-stone-700">Dewan Pentashih: </span>
          {item.pentashih.join(', ')}
        </div>
      )}
    </div>
  )
}
