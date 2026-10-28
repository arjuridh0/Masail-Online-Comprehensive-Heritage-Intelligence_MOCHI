"use client"

import Image from 'next/image'

interface LoadingMochiProps {
  pesan?: string
  ukuran?: 'sm' | 'md' | 'lg'
}

export function LoadingMochi({ pesan = "Memuat data...", ukuran = 'md' }: LoadingMochiProps) {
  const ukuranPx = ukuran === 'sm' ? 36 : ukuran === 'lg' ? 64 : 48

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 space-y-3 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Lingkaran Berputar Halus */}
        <div 
          className="absolute rounded-full border-2 border-emerald-200 border-t-[#1E3F30] animate-spin"
          style={{ width: ukuranPx + 16, height: ukuranPx + 16 }}
        />
        
        {/* Ikon Maskot Mochi */}
        <div className="relative rounded-full bg-white p-1.5 shadow-2xs">
          <Image
            src="/mochi-symbol-64.png"
            alt="Maskot Mochi"
            width={ukuranPx}
            height={ukuranPx}
            className="animate-pulse object-contain"
            priority
          />
        </div>
      </div>

      {pesan && (
        <p className="text-xs font-semibold text-stone-600 tracking-wide text-center">
          {pesan}
        </p>
      )}
    </div>
  )
}
