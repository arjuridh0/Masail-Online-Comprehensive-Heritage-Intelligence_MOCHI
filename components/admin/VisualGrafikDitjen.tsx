"use client"

import { useState } from 'react'
import { MapPin, Compass, BookOpen, Layers, Info } from 'lucide-react'

interface PulauStat {
  id: string
  nama: string
  count: number
  persen: number
  provinsiList: string[]
  color: string
}

interface TopikStat {
  bidang: string
  count: number
  persen: number
  deskripsi: string
  tagTren: string[]
  color: string
  badgeColor: string
}

interface VisualGrafikDitjenProps {
  totalPesantren: number
  totalMasalah: number
  totalForum: number
  totalTayangan: number
  totalRujukan: number
  pulauStats: PulauStat[]
  topikStats: TopikStat[]
}

export function VisualGrafikDitjen({
  totalPesantren,
  totalMasalah,
  totalRujukan,
  pulauStats,
  topikStats,
}: VisualGrafikDitjenProps) {
  const [activeTab, setActiveTab] = useState<'regional' | 'tematik'>('regional')

  const avgRujukan = totalMasalah > 0 ? (totalRujukan / totalMasalah).toFixed(1) : '0'

  return (
    <div className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Tab Switcher & Judul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6DF] pb-4">
        <div>
          <h2 className="text-base font-bold text-[#1E3F30] flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#C9A96E]" />
            <span>Diagram Analisis Distribusi &amp; Dinamika Hukum Fiqih</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualisasi data persebaran pesantren ber-NSPP dan tren tema keputusan bahtsul masail secara nasional.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('regional')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'regional'
                ? 'bg-white text-[#1E3F30] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span>Sebaran Regional Pulau</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tematik')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'tematik'
                ? 'bg-white text-[#1E3F30] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#1E3F30]" />
            <span>Komposisi Fiqih &amp; Turats</span>
          </button>
        </div>
      </div>

      {/* Konten Tab 1: Sebaran Regional Pulau */}
      {activeTab === 'regional' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Bar Chart Gugus Pulau */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-semibold text-stone-700">Gugus Wilayah Pulau</span>
                <span>Proporsi dari Total {totalPesantren} Pesantren Mitra</span>
              </div>

              {pulauStats.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#E8E6DF] bg-white p-3.5 shadow-2xs hover:border-[#1E3F30]/30 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C2A29] mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span>{item.nama}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#1E3F30] font-black">{item.count} Pesantren</span>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.persen}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Visual */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100 relative">
                    <div
                      className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(item.persen, 2)}%` }}
                    />
                  </div>

                  {item.provinsiList.length > 0 && (
                    <p className="text-[10px] text-stone-400 mt-2 truncate">
                      Mencakup: {item.provinsiList.slice(0, 4).join(', ')}
                      {item.provinsiList.length > 4 ? ` (+${item.provinsiList.length - 4} provinsi lain)` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Panel Ringkasan Demografi Kebijakan */}
            <div className="lg:col-span-4 rounded-xl border border-[#C9A96E]/40 bg-[#FAF8F2] p-4 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F30] flex items-center gap-1.5">
                <Info className="h-4 w-4 text-[#C9A96E]" />
                <span>Indeks Disparitas Teritorial</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="rounded-lg bg-white p-3 border border-[#E8E6DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Konsentrasi Pulau Jawa</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-[#1E3F30]">
                      {pulauStats.find((p) => p.id === 'jawa')?.persen || 0}%
                    </span>
                    <span className="text-[11px] text-stone-500">Basis Turats Kuat</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Jawa Timur dan Jawa Tengah menjadi episentrum perumusan hukum bahtsul masail nasional.
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3 border border-[#E8E6DF]">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Peluang Afirmasi Luar Jawa</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-[#C9A96E]">
                      {100 - (pulauStats.find((p) => p.id === 'jawa')?.persen || 0)}%
                    </span>
                    <span className="text-[11px] text-stone-500">Luar Jawa &amp; Timur</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Direkomendasikan program bantuan digitalisasi bahtsul masail untuk pesantren di Sumatera, Kalimantan, dan Sulawesi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konten Tab 2: Komposisi Fiqih & Turats */}
      {activeTab === 'tematik' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {topikStats.map((item) => (
              <div
                key={item.bidang}
                className="rounded-xl border border-[#E8E6DF] bg-white p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Bidang {item.bidang}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.persen}% Masail
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#1E3F30]">{item.count}</span>
                    <span className="text-xs text-stone-500">Diktum Terbit</span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-stone-100">
                    {item.tagTren.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 mt-3">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.persen}%` }} />
                  </div>
                </div>
              </div>
            ))}
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
      )}
    </div>
  )
}

export default VisualGrafikDitjen
