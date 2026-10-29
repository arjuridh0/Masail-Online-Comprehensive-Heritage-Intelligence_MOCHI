"use client"

import { useState } from 'react'
import Image from 'next/image'

interface LoadingMochiProps {
  pesan?: string
  subPesan?: string
  ukuran?: 'sm' | 'md' | 'lg'
}

export function LoadingMochi({
  pesan = "Memuat data...",
  subPesan = "Si Mochi sedang menelaah arsip turats...",
  ukuran = 'md',
}: LoadingMochiProps) {
  const [imageError, setImageError] = useState(false)

  const ukuranConfig = {
    sm: {
      mascotSize: 48,
      ringSize: 64,
      containerPadding: 'py-6',
      fontSize: 'text-xs',
    },
    md: {
      mascotSize: 64,
      ringSize: 84,
      containerPadding: 'py-10',
      fontSize: 'text-sm',
    },
    lg: {
      mascotSize: 84,
      ringSize: 108,
      containerPadding: 'py-14',
      fontSize: 'text-base',
    },
  }[ukuran]

  return (
    <div
      className={`flex flex-col items-center justify-center ${ukuranConfig.containerPadding} px-4 select-none animate-in fade-in duration-300`}
      role="status"
      aria-live="polite"
    >
      {/* Container Maskot Berpikir Interaktif */}
      <div className="relative flex items-center justify-center mb-3">
        {/* Lingkaran Orbit Berputar Halus (Aura Ilmu) */}
        <div
          className="absolute rounded-full border-2 border-dashed border-[#C9A96E]/50 animate-spin"
          style={{
            width: ukuranConfig.ringSize,
            height: ukuranConfig.ringSize,
            animationDuration: '8s',
          }}
        />

        {/* Cincin Cahaya Berdenyut */}
        <div
          className="absolute rounded-full bg-emerald-500/10 animate-ping opacity-60"
          style={{
            width: ukuranConfig.ringSize - 8,
            height: ukuranConfig.ringSize - 8,
            animationDuration: '3s',
          }}
        />

        {/* Maskot 3D Si Mochi dengan Efek Napas Mengambang */}
        <div className="relative z-10 flex items-center justify-center rounded-full bg-white/90 p-2 shadow-md border border-[#E8E4DA] backdrop-blur-xs transition-transform hover:scale-105">
          {!imageError ? (
            <Image
              src="/mascot/mochi-3d.png"
              alt="Si Mochi sedang berpikir"
              width={ukuranConfig.mascotSize}
              height={ukuranConfig.mascotSize}
              className="object-contain napas drop-shadow-xs"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback Vektor SVG Halus jika Gambar Bermasalah */
            <div
              className="flex items-center justify-center rounded-full bg-[#1E3F30] text-[#C9A96E] font-black text-xs"
              style={{
                width: ukuranConfig.mascotSize,
                height: ukuranConfig.mascotSize,
              }}
            >
              MOCHI
            </div>
          )}

          {/* Titik Pikiran (Thought Bubbles) di Atas Songkok Mochi */}
          <div className="absolute -top-2.5 -right-1 flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 shadow-xs border border-[#DDD6C5]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#1E3F30] animate-bounce"
              style={{ animationDuration: '1s', animationDelay: '-0.3s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#C9A96E] animate-bounce"
              style={{ animationDuration: '1s', animationDelay: '-0.15s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#2D5A46] animate-bounce"
              style={{ animationDuration: '1s' }}
            />
          </div>
        </div>
      </div>

      {/* Teks Pesan Loading */}
      {pesan && (
        <div className="space-y-1 text-center max-w-xs">
          <p className={`${ukuranConfig.fontSize} font-bold text-[#1E3F30] tracking-tight`}>
            {pesan}
          </p>
          {subPesan && (
            <p className="text-[11px] font-medium text-stone-500 animate-pulse">
              {subPesan}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default LoadingMochi
