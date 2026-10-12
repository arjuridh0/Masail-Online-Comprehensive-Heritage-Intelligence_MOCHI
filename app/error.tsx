"use client"

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 h-32 w-32">
        <Image
          src="/mascot/mochi-3d.png"
          alt="Maskot MOCHI"
          fill
          className="object-contain"
          priority
        />
      </div>

      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-rose-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Kendala Teknis Sistem
      </span>

      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E3F30]">
        Terjadi Kendala Memuat Data
      </h1>

      <p className="mt-3 max-w-md text-sm text-stone-600 leading-relaxed">
        Sistem sedang mengalami kendala sementara saat mengambil arsip keputusan. Silakan coba muat ulang halaman.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Coba Muat Ulang</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[#C8C4BB] bg-white px-5 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  )
}