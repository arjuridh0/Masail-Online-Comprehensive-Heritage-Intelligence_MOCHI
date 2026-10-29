"use client"

import { useState } from 'react'
import { BookOpen, Sparkles } from 'lucide-react'

export interface TopikStatItem {
  bidang: string
  count: number
  persen: number
  deskripsi: string
  tagTren: string[]
  color: string
  badgeColor: string
}

interface DiagramDonatFiqihProps {
  topikStats: TopikStatItem[]
  totalMasalah: number
  totalRujukan: number
}

export function DiagramDonatFiqih({
  topikStats,
  totalMasalah,
  totalRujukan,
}: DiagramDonatFiqihProps) {
  const [hoveredBidang, setHoveredBidang] = useState<string | null>(null)

  // Parameter geometri lingkaran donut SVG
  const radius = 68
  const circumference = 2 * Math.PI * radius // ~427.25

  let accumulatedPercent = 0
  const slices = topikStats.map((item) => {
    const strokeDasharray = `${(item.persen / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
    accumulatedPercent += item.persen

    const hexColor =
      item.bidang.toLowerCase() === 'muamalah'
        ? '#1E3F30' // Deep Forest Green
        : item.bidang.toLowerCase() === 'ibadah'
        ? '#C9A96E' // Amber Gold
        : '#2D5A46' // Emerald Forest

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      hexColor,
    }
  })

  const activeStat = hoveredBidang
    ? topikStats.find((s) => s.bidang === hoveredBidang)
    : null

  const avgRujukan = totalMasalah > 0 ? (totalRujukan / totalMasalah).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Kolom Donut Visual SVG */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-[#D9D7CE] bg-white p-6 shadow-2xs">
          <div className="relative h-64 w-64 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full -rotate-90 transform"
              aria-label="Diagram Donat Distribusi Tema Bahtsul Masail"
            >
              {/* Lingkaran Background Base */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-stone-100 fill-none"
                strokeWidth="24"
              />

              {/* Slices Donut */}
              {slices.map((slice) => {
                const isHovered = hoveredBidang === slice.bidang
                return (
                  <circle
                    key={slice.bidang}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={slice.hexColor}
                    strokeWidth={isHovered ? '28' : '24'}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="cursor-pointer transition-all duration-300 focus:outline-hidden"
                    onMouseEnter={() => setHoveredBidang(slice.bidang)}
                    onMouseLeave={() => setHoveredBidang(null)}
                    style={{
                      filter: isHovered ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none',
                    }}
                  />
                )
              })}
            </svg>

            {/* Konten Cutout Tengah Donut */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              {activeStat ? (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C733E]">
                    {activeStat.bidang}
                  </span>
                  <span className="text-3xl font-black text-[#1E3F30] leading-none my-1">
                    {activeStat.persen}%
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {activeStat.count} Masalah
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Total Khazanah
                  </span>
                  <span className="text-3xl font-black text-[#1E3F30] leading-none my-1">
                    {totalMasalah}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8C733E]">
                    Keputusan Fiqih
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 text-center mt-3">
            Arahkan kursor pada lingkaran donat untuk melihat rincian bidang kajian.
          </p>
        </div>

        {/* Kolom Kanan: Rincian 3 Ranah Hukum Kanonik */}
        <div className="lg:col-span-7 space-y-3.5">
          {topikStats.map((item) => {
            const isHovered = hoveredBidang === item.bidang
            return (
              <div
                key={item.bidang}
                onMouseEnter={() => setHoveredBidang(item.bidang)}
                onMouseLeave={() => setHoveredBidang(null)}
                className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'border-[#1E3F30] bg-[#F7F5EE] shadow-sm'
                    : 'border-[#E8E6DF] bg-white hover:border-[#1E3F30]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        item.bidang.toLowerCase() === 'muamalah'
                          ? 'bg-[#1E3F30]'
                          : item.bidang.toLowerCase() === 'ibadah'
                          ? 'bg-[#C9A96E]'
                          : 'bg-emerald-700'
                      }`}
                    />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
                      Bidang {item.bidang}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#1E3F30]">{item.count} Masail</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.persen}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {item.deskripsi}
                </p>

                {/* Tag Isu Kontemporer */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#C9A96E]" /> Tren Isu:
                  </span>
                  {item.tagTren.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-[#FAF8F5] border border-[#E5E3DC] text-stone-700 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Indikator Sanad Turats Kitab Kuning */}
      <div className="rounded-xl border border-[#1E3F30]/20 bg-emerald-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#1E3F30] p-2.5 text-[#C9A96E] shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1E3F30] uppercase tracking-wide">
              Rasio Rujukan Turats Mu&apos;tabarah
            </h4>
            <p className="text-xs text-stone-600">
              Rata-rata didukung <strong>{avgRujukan} ibarat kitab kuning</strong> per masalah hukum, menjamin otentisitas sanad fiqih pesantren.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs">
          <div className="text-right">
            <span className="text-stone-500 block text-[10px]">Total Kitab Terkoneksi</span>
            <span className="text-base font-black text-[#1E3F30]">{totalRujukan} Kutipan Tervalidasi</span>
          </div>
          <div className="text-right border-l border-emerald-200 pl-4">
            <span className="text-stone-500 block text-[10px]">Tingkat Akuntabilitas</span>
            <span className="text-base font-black text-emerald-700">100% Mushohhih</span>
          </div>
        </div>
      </div>
    </div>
  )
}
