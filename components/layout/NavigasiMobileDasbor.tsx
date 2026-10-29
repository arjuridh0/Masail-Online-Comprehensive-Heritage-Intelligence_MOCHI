"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Activity,
  BookOpen,
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { logoutAction } from '@/app/api/auth/actions'

interface NavigasiMobileDasborProps {
  namaLembaga?: string | null
  slugLembaga?: string | null
  namaPengguna?: string | null
  emailPengguna?: string | null
}

const NAV_ITEMS = [
  {
    href: '/dasbor',
    label: 'Ringkasan Dasbor',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dasbor/forum',
    label: 'Kelola Forum Masail',
    icon: BookOpen,
    exact: false,
  },
  {
    href: '/dasbor/statistik',
    label: 'Statistik & Keaktifan',
    icon: Activity,
    exact: false,
  },
  {
    href: '/dasbor/profil',
    label: 'Profil Lembaga',
    icon: Building2,
    exact: false,
  },
]

export function NavigasiMobileDasbor({
  namaLembaga,
  slugLembaga,
  namaPengguna,
  emailPengguna,
}: NavigasiMobileDasborProps) {
  const [buka, setBuka] = useState(false)
  const pathname = usePathname()

  // Auto-tutup drawer saat route berpindah
  useEffect(() => {
    setBuka(false)
  }, [pathname])

  // Tangani tombol keyboard ESC
  useEffect(() => {
    if (!buka) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBuka(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [buka])

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Tombol Hamburger Trigger */}
      <button
        type="button"
        onClick={() => setBuka(true)}
        aria-label="Buka Menu Navigasi Dasbor"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-2xs"
      >
        <Menu className="h-5 w-5 text-[#1E3F30]" />
      </button>

      {/* Brand Header Mobile */}
      <div className="flex items-center gap-2">
        <div className="relative h-7 w-7 shrink-0">
          <Image
            src="/brand/mochi-symbol.svg"
            alt="MOCHI"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <span className="font-extrabold text-xs text-[#1E3F30] tracking-tight block leading-tight">
            PORTAL LEMBAGA
          </span>
          <span className="text-[10px] text-stone-500 font-mono truncate max-w-[140px] block leading-tight">
            {namaLembaga || 'Pesantren Mitra'}
          </span>
        </div>
      </div>

      {/* Modal Drawer Slide-Over */}
      <AnimatePresence>
        {buka && (
          <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Menu Navigasi Dasbor Lembaga">
            {/* Backdrop Gelap Transparan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setBuka(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Sidebar Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-72 max-w-[85vw] bg-white border-r border-[#D9D3C3] flex flex-col justify-between shadow-2xl z-10 h-full"
            >
              <div>
                {/* Header Atas Drawer */}
                <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8 shrink-0">
                      <Image
                        src="/brand/mochi-symbol.svg"
                        alt="MOCHI"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-black text-xs text-[#1E3F30] tracking-tight block">
                        PORTAL LEMBAGA
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono truncate max-w-[130px] block">
                        {namaLembaga || 'Pesantren Mitra'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBuka(false)}
                    aria-label="Tutup Menu Dasbor"
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 active:scale-95 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigasi Utama */}
                <nav className="p-3 space-y-1.5" aria-label="Navigasi Mobile Dasbor">
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item.href, item.exact)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setBuka(false)}
                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors ${
                          active
                            ? 'bg-[#1E3F30] text-white shadow-xs'
                            : 'text-stone-700 hover:bg-stone-50 active:bg-stone-100'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#C9A96E]' : 'text-stone-500'}`} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}

                  {slugLembaga && (
                    <Link
                      href={`/lembaga/${slugLembaga}`}
                      onClick={() => setBuka(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Home className="h-4 w-4 shrink-0 text-[#8C733E]" />
                      <span>Lihat Profil Publik</span>
                    </Link>
                  )}

                  <Link
                    href="/"
                    onClick={() => setBuka(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <Globe className="h-4 w-4 shrink-0 text-stone-400" />
                    <span>Kembali ke Beranda Utama</span>
                  </Link>
                </nav>
              </div>

              {/* Profil Pengguna & Keluar */}
              <div className="p-4 border-t border-stone-100 bg-[#FAF8F5]">
                <div className="mb-3 px-1">
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {namaPengguna || 'Pengelola Lembaga'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono truncate block">
                    {emailPengguna || ''}
                  </span>
                </div>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-2xs"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar Sesi</span>
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
