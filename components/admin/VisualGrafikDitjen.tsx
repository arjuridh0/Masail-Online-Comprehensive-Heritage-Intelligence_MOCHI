"use client"

import { useState } from 'react'
import { MapPin, Compass, Layers } from 'lucide-react'
import { PetaNusantaraDitjen, type GugusPulauItem } from './PetaNusantaraDitjen'
import { DiagramDonatFiqih, type TopikStatItem } from './DiagramDonatFiqih'

interface VisualGrafikDitjenProps {
  totalPesantren: number
  totalMasalah: number
  totalForum: number
  totalTayangan: number
  totalRujukan: number
  pulauStats: GugusPulauItem[]
  topikStats: TopikStatItem[]
}

export function VisualGrafikDitjen({
  totalPesantren,
  totalMasalah,
  totalRujukan,
  pulauStats,
  topikStats,
}: VisualGrafikDitjenProps) {
  const [activeTab, setActiveTab] = useState<'regional' | 'tematik'>('regional')

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
            <span>Peta Nusantara Interaktif</span>
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
            <span>Diagram Donat Fiqih &amp; Turats</span>
          </button>
        </div>
      </div>

      {/* Konten Tab 1: Peta Regional Nusantara */}
      {activeTab === 'regional' && (
        <PetaNusantaraDitjen
          pulauStats={pulauStats}
          totalPesantren={totalPesantren}
        />
      )}

      {/* Konten Tab 2: Diagram Donat Fiqih & Komposisi Turats */}
      {activeTab === 'tematik' && (
        <DiagramDonatFiqih
          topikStats={topikStats}
          totalMasalah={totalMasalah}
          totalRujukan={totalRujukan}
        />
      )}
    </div>
  )
}

export default VisualGrafikDitjen
