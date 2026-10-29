"use client"

import { useState } from 'react'
import { MapPin, Info, CheckCircle2, TrendingUp, Building2 } from 'lucide-react'
import { PetaSvgNusantara } from './PetaSvgNusantara'

export interface GugusPulauItem {
  id: string
  nama: string
  count: number
  persen: number
  provinsiList: string[]
  color: string
}

interface PetaNusantaraDitjenProps {
  pulauStats: GugusPulauItem[]
  totalPesantren: number
}

export function PetaNusantaraDitjen({ pulauStats, totalPesantren }: PetaNusantaraDitjenProps) {
  const [selectedId, setSelectedId] = useState<string>('jawa')

  const selectedPulau =
    pulauStats.find((p) => p.id === selectedId) ||
    pulauStats.find((p) => p.id === 'jawa') ||
    pulauStats[0]

  // Rekomendasi afirmasi per gugus wilayah
  const rekomendasiKebijakan: Record<string, { fokus: string; narasi: string }> = {
    jawa: {
      fokus: 'Episentrum Standarisasi Fiqih',
      narasi:
        'Sentra tradisi musyawarah terpadat dengan densitas perumusan hukum tertinggi. Fokus Ditjen pada harmonisasi standar kurikulum bahtsul masail ma’had aly dan preservasi naskah turats kuno.',
    },
    sumatera: {
      fokus: 'Penguatan Koridor Dayah & Pesantren',
      narasi:
        'Potensi keilmuan kuat pada dayah Aceh dan pesantren Minang. Direkomendasikan fasilitasi sinkronisasi fatwa daerah dan digitalisasi manuskrip kitab lokal ke khazanah MOCHI.',
    },
    kalimantan: {
      fokus: 'Inkubasi Fiqih Ekologis & IKN',
      narasi:
        'Prioritas afirmasi bantuan perangkat digitalisasi bahtsul masail untuk merespons dinamika hukum fiqih lingkungan, pertambangan, dan transisi kebudayaan kawasan IKN Nusantara.',
    },
    sulawesi: {
      fokus: 'Jejaring Turats Maritim',
      narasi:
        'Basis pesantren As’adiyah, DDI, dan kawasan Mandar memiliki kekhasan hukum muamalah maritim. Perlu percepatan pendataan NSPP dan integrasi perumus muda.',
    },
    nusra_maluku_papua: {
      fokus: 'Afirmasi Wilayah 3T & Kerukunan',
      narasi:
        'Fokus bantuan beasiswa teknologi bahtsul masail Ditjen Pesantren untuk penguatan literasi fiqih minoritas, toleransi kemasyarakatan, dan akreditasi kelembagaan.',
    },
    lainnya: {
      fokus: 'Perluasan Registri Nasional',
      narasi: 'Penertiban administrasi izin operasional pesantren dan verifikasi NSPP berkelanjutan.',
    },
  }

  const kebijakanAktif = rekomendasiKebijakan[selectedPulau.id] || {
    fokus: 'Perluasan Registri Nasional',
    narasi: 'Penertiban administrasi izin operasional pesantren dan verifikasi NSPP berkelanjutan.',
  }

  return (
    <div className="space-y-6">
      {/* Container Peta Kartografi */}
      <div className="relative rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-4 sm:p-6 shadow-2xs overflow-hidden">
        {/* Header Peta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6DF] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3F30]">
                Peta Tematik Sebaran Pesantren Mitra Bahtsul Masail
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Klik atau sentuh gugus kepulauan untuk membedah densitas institusi dan fokus kebijakan Ditjen Pesantren.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-[#E5E3DC]">
            <Building2 className="h-3.5 w-3.5 text-[#1E3F30]" />
            <span>Total Terpetakan: <strong>{totalPesantren} Lembaga Ber-NSPP</strong></span>
          </div>
        </div>

        {/* Peta SVG Nusantara Geografis Otentik */}
        <div className="relative aspect-[2021/922] w-full max-w-5xl mx-auto py-2">
          <PetaSvgNusantara
            selectedId={selectedId}
            onSelectId={setSelectedId}
          />
        </div>

        {/* Legend Pilihan Cepat Gugus Pulau */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[#E8E6DF]">
          {pulauStats.map((item) => {
            const isSelected = selectedId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3F30] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#DDD6C5] hover:bg-stone-50'
                }`}
              >
                <div className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-[#C9A96E]' : item.color}`} />
                <span>{item.nama}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {item.persen}%
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail Kartu Teritorial Terpilih */}
      <div className="rounded-2xl border border-[#C9A96E]/50 bg-gradient-to-br from-[#FAF8F2] to-white p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Kolom Kiri: Statistik Utama */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#E8E4DA] pb-4 md:pb-0 md:pr-6 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-[#8C733E] uppercase flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#C9A96E]" />
              Wilayah Terpilih
            </span>
            <h4 className="text-xl font-extrabold text-[#1E3F30]">
              {selectedPulau.nama}
            </h4>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1E3F30]">{selectedPulau.count}</span>
              <span className="text-xs text-stone-600 font-semibold">Pesantren Ber-NSPP</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-[#1E3F30] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(selectedPulau.persen, 3)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[#8C733E]">{selectedPulau.persen}% Proporsi</span>
            </div>

            {selectedPulau.provinsiList.length > 0 && (
              <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
                <strong>Provinsi:</strong> {selectedPulau.provinsiList.join(', ')}
              </p>
            )}
          </div>

          {/* Kolom Kanan: Arahan Strategis Kebijakan Ditjen */}
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
              <Info className="h-4 w-4 text-[#C9A96E]" />
              <span>Fokus Strategis Ditjen Pesantren: {kebijakanAktif.fokus}</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {kebijakanAktif.narasi}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#EFECE3] text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Sanad Turats Tervalidasi
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                <TrendingUp className="h-3.5 w-3.5 text-[#8C733E]" />
                Kesiapan Digitalisasi Santrivision
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetaNusantaraDitjen
