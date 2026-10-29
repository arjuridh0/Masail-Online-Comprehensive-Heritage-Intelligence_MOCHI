"use client"

import { useState } from 'react'
import { MapPin, Info, CheckCircle2, TrendingUp, Building2 } from 'lucide-react'

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

  const getIslandHighlightClass = (id: string) => {
    const isSelected = selectedId === id
    if (isSelected) {
      return 'fill-[#1E3F30] stroke-[#C9A96E] stroke-[2.5] filter drop-shadow-md'
    }
    return 'fill-[#EAE5D9] stroke-[#CBC4B3] stroke-1 hover:fill-[#D8D0BF] hover:stroke-[#1E3F30] transition-colors duration-200'
  }

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
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
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

        {/* Peta SVG Nusantara Murni */}
        <div className="relative aspect-[950/420] w-full max-w-4xl mx-auto py-2">
          <svg
            viewBox="0 0 950 420"
            className="w-full h-full select-none"
            aria-label="Peta Geografis Kepulauan Nusantara Indonesia"
          >
            <defs>
              <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#E8E4DA" />
              </pattern>
            </defs>
            <rect width="950" height="420" fill="url(#grid-dots)" rx="16" />

            {/* 1. SUMATERA */}
            <g
              onClick={() => setSelectedId('sumatera')}
              className="cursor-pointer group focus:outline-hidden"
              role="button"
              tabIndex={0}
              aria-label="Gugus Wilayah Sumatera"
            >
              <path
                d="M 120 70 L 140 60 L 165 75 L 195 110 L 220 150 L 245 200 L 260 250 L 250 270 L 235 255 L 210 215 L 175 160 L 145 120 L 125 85 Z"
                className={getIslandHighlightClass('sumatera')}
              />
              {/* Pulau-pulau Nias & Mentawai */}
              <ellipse cx="140" cy="180" rx="6" ry="14" transform="rotate(-30 140 180)" className={getIslandHighlightClass('sumatera')} />
              <ellipse cx="180" cy="245" rx="6" ry="20" transform="rotate(-30 180 245)" className={getIslandHighlightClass('sumatera')} />
              {/* Bangka & Belitung */}
              <ellipse cx="280" cy="225" rx="12" ry="18" transform="rotate(20 280 225)" className={getIslandHighlightClass('sumatera')} />
              <ellipse cx="310" cy="240" rx="9" ry="9" className={getIslandHighlightClass('sumatera')} />
              <text x="185" y="180" textAnchor="middle" className="text-[12px] font-bold fill-[#1E3F30] pointer-events-none tracking-wider">
                SUMATERA
              </text>
            </g>

            {/* 2. JAWA & MADURA */}
            <g
              onClick={() => setSelectedId('jawa')}
              className="cursor-pointer group focus:outline-hidden"
              role="button"
              tabIndex={0}
              aria-label="Gugus Wilayah Jawa dan Madura"
            >
              {/* Pulau Jawa */}
              <path
                d="M 270 295 C 290 290, 320 292, 350 295 C 380 297, 420 293, 460 298 C 490 300, 520 305, 545 315 L 540 330 C 510 325, 470 322, 430 325 C 390 328, 340 323, 300 320 L 270 310 Z"
                className={getIslandHighlightClass('jawa')}
              />
              {/* Pulau Madura */}
              <path
                d="M 525 292 C 540 288, 565 290, 575 295 C 570 302, 550 305, 530 303 Z"
                className={getIslandHighlightClass('jawa')}
              />
              <text x="415" y="315" textAnchor="middle" className="text-[12px] font-bold fill-[#1E3F30] pointer-events-none tracking-wider">
                JAWA &amp; MADURA
              </text>
            </g>

            {/* 3. KALIMANTAN */}
            <g
              onClick={() => setSelectedId('kalimantan')}
              className="cursor-pointer group focus:outline-hidden"
              role="button"
              tabIndex={0}
              aria-label="Gugus Wilayah Kalimantan"
            >
              <path
                d="M 330 145 C 360 120, 420 125, 455 140 C 475 160, 490 190, 480 225 C 470 250, 435 260, 400 262 C 360 265, 335 245, 330 220 C 320 190, 325 160, 330 145 Z"
                className={getIslandHighlightClass('kalimantan')}
              />
              <text x="405" y="195" textAnchor="middle" className="text-[12px] font-bold fill-[#1E3F30] pointer-events-none tracking-wider">
                KALIMANTAN
              </text>
            </g>

            {/* 4. SULAWESI */}
            <g
              onClick={() => setSelectedId('sulawesi')}
              className="cursor-pointer group focus:outline-hidden"
              role="button"
              tabIndex={0}
              aria-label="Gugus Wilayah Sulawesi"
            >
              {/* Bentuk K Sulawesi */}
              <path
                d="M 545 150 C 570 145, 600 155, 620 145 L 615 155 C 590 162, 570 162, 555 170 C 545 185, 550 205, 565 215 C 585 220, 605 210, 620 220 L 610 230 C 590 225, 570 232, 555 240 C 550 255, 555 275, 545 285 L 535 280 C 540 260, 535 240, 530 220 C 525 190, 535 165, 545 150 Z"
                className={getIslandHighlightClass('sulawesi')}
              />
              <text x="585" y="190" textAnchor="middle" className="text-[12px] font-bold fill-[#1E3F30] pointer-events-none tracking-wider">
                SULAWESI
              </text>
            </g>

            {/* 5. BALI, NUSA TENGGARA, MALUKU & PAPUA */}
            <g
              onClick={() => setSelectedId('nusra_maluku_papua')}
              className="cursor-pointer group focus:outline-hidden"
              role="button"
              tabIndex={0}
              aria-label="Gugus Wilayah Bali, Nusa Tenggara, Maluku, dan Papua"
            >
              {/* Bali, Lombok, Sumbawa, Flores, Timor */}
              <ellipse cx="565" cy="328" rx="8" ry="6" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="585" cy="330" rx="9" ry="6" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="615" cy="332" rx="16" ry="7" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="660" cy="335" rx="24" ry="8" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="710" cy="345" rx="22" ry="9" transform="rotate(-15 710 345)" className={getIslandHighlightClass('nusra_maluku_papua')} />

              {/* Maluku */}
              <ellipse cx="660" cy="180" rx="12" ry="22" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="685" cy="225" rx="18" ry="9" className={getIslandHighlightClass('nusra_maluku_papua')} />
              <ellipse cx="675" cy="275" rx="14" ry="8" className={getIslandHighlightClass('nusra_maluku_papua')} />

              {/* Papua */}
              <path
                d="M 740 185 C 755 170, 780 180, 800 175 C 830 180, 875 195, 900 205 L 905 270 C 875 275, 840 265, 805 255 C 785 245, 765 240, 750 230 C 730 220, 730 200, 740 185 Z"
                className={getIslandHighlightClass('nusra_maluku_papua')}
              />
              <text x="825" y="225" textAnchor="middle" className="text-[12px] font-bold fill-[#1E3F30] pointer-events-none tracking-wider">
                PAPUA &amp; TIMUR
              </text>
            </g>
          </svg>
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
