import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 h-32 w-32 animate-bounce-slow">
        <Image
          src="/mascot/mochi-3d.png"
          alt="Maskot MOCHI Bingung"
          fill
          className="object-contain"
          priority
        />
      </div>

      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8C733E]">
        Galat 404 &bull; Halaman Tidak Ditemukan
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1E3F30]">
        Afwan, Halaman Tidak Ditemukan
      </h1>

      <p className="mt-3 max-w-md text-sm text-stone-600 leading-relaxed">
        Keputusan mas'alah, forum, atau halaman yang antum cari tidak tersedia atau mungkin telah dipindahkan ke arsip lain.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link
          href="/perpustakaan"
          className="inline-flex items-center gap-2 rounded-xl border border-[#C8C4BB] bg-white px-5 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition-all"
        >
          <BookOpen className="h-4 w-4 text-[#8C733E]" />
          <span>Buka Perpustakaan Masail</span>
        </Link>
      </div>
    </main>
  )
}