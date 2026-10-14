import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  Flag,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { logoutAction } from '@/app/api/auth/actions'
import { NavigasiMobileAdmin } from '@/components/layout/NavigasiMobileAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sesi = await getSesiPengguna()

  if (!sesi) {
    redirect('/masuk?redirect=/admin/verifikasi')
  }

  if (sesi.peran !== 'admin') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#F4F3EE]">
        <ShieldAlert className="h-16 w-16 text-rose-600 mb-4" />
        <h1 className="text-2xl font-bold text-stone-900">403 — Akses Ditolak</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-md">
          Akun Anda ({sesi.email}) tidak memiliki hak istimewa Administrator Pusat MOCHI.
        </p>
        <Link
          href="/dasbor"
          className="mt-6 rounded-xl bg-[#1E3F30] px-5 py-2 text-xs font-bold text-white"
        >
          Kembali ke Dasbor Lembaga
        </Link>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F4F3EE]">
      {/* Sidebar Admin */}
      <aside className="w-64 shrink-0 border-r border-[#D9D3C3] bg-white hidden md:flex flex-col justify-between">
        <div>
          {/* Logo Brand Admin */}
          <div className="p-5 border-b border-stone-100 flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image
                src="/brand/mochi-symbol.svg"
                alt="MOCHI"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-sm text-[#1E3F30] tracking-tight block">
                ADMIN MOCHI
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Pusat Verifikasi
              </span>
            </div>
          </div>

          {/* Navigasi Menu */}
          <nav className="p-3 space-y-1">
            <Link
              href="/admin/verifikasi"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#1E3F30] hover:bg-[#FAF8F2] transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-[#8C733E]" />
              <span>Verifikasi NSPP Lembaga</span>
            </Link>

            <Link
              href="/admin/kitab"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-[#1E3F30]" />
              <span>Kelola Master Kitab</span>
            </Link>

            <Link
              href="/admin/lembaga"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Building2 className="h-4 w-4 text-[#1E3F30]" />
              <span>Daftar Seluruh Lembaga</span>
            </Link>

            <Link
              href="/admin/laporan"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Flag className="h-4 w-4 text-[#C9A96E]" />
              <span>Laporan Koreksi Masail</span>
            </Link>

            <Link
              href="/admin/ditjen"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-[#1E3F30]" />
              <span>Dashboard Ditjen Kemenag</span>
            </Link>

            <Link
              href="/admin/profil"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-[#8C733E]" />
              <span>Profil &amp; Sandi Admin</span>
            </Link>
          </nav>
        </div>

        {/* Profil Bawah & Keluar */}
        <div className="p-4 border-t border-stone-100">
          <div className="mb-3 px-2">
            <span className="text-xs font-bold text-stone-900 block truncate">
              {sesi.nama}
            </span>
            <span className="text-[11px] text-stone-500 font-mono truncate block">
              {sesi.email}
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar Sesi Admin</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#D9D3C3] bg-white px-4 sm:px-6 flex items-center justify-between md:justify-end">
          <NavigasiMobileAdmin
            namaAdmin={sesi.nama}
            emailAdmin={sesi.email}
          />
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-[#1E3F30] flex items-center gap-1"
          >
            <span className="hidden sm:inline">Lihat Portal Publik</span>
            <span className="sm:hidden">Publik</span> &rarr;
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}