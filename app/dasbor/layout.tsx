import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import {
  Activity,
  BookOpen,
  Building2,
  Clock,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { logoutAction } from '@/app/api/auth/actions'
import { NavigasiMobileDasbor } from '@/components/layout/NavigasiMobileDasbor'

export const dynamic = 'force-dynamic'

export default async function DasborLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sesi = await getSesiPengguna()

  if (!sesi) {
    redirect('/masuk?redirect=/dasbor')
  }

  const isPending = sesi.lembaga?.status === 'menunggu'
  const isSuspended = sesi.lembaga?.status === 'ditangguhkan'
  const isRejected = sesi.lembaga?.status === 'ditolak'

  return (
    <div className="flex min-h-screen bg-[#F4F3EE]">
      {/* Sidebar Dasbor */}
      <aside className="w-64 shrink-0 border-r border-[#D9D3C3] bg-white hidden md:flex flex-col justify-between sticky top-0 h-screen z-20">
        <div className="flex flex-col min-h-0 overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center gap-3 shrink-0">
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
                PORTAL LEMBAGA
              </span>
              <span className="text-[10px] text-stone-500 font-mono truncate max-w-[140px] block">
                {sesi.lembaga?.nama || 'Pesantren Mitra'}
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <Link
              href="/dasbor"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#1E3F30] hover:bg-[#FAF8F2] transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#8C733E]" />
              <span>Ringkasan Dasbor</span>
            </Link>

            <Link
              href="/dasbor/forum"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-[#1E3F30]" />
              <span>Kelola Forum Masail</span>
            </Link>

            <Link
              href="/dasbor/statistik"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Activity className="h-4 w-4 text-[#C9A96E]" />
              <span>Statistik &amp; Keaktifan</span>
            </Link>

            <Link
              href="/dasbor/profil"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Building2 className="h-4 w-4 text-[#1E3F30]" />
              <span>Profil Lembaga</span>
            </Link>

            {sesi.lembaga && (
              <Link
                href={`/lembaga/${sesi.lembaga.slug}`}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Home className="h-4 w-4 text-stone-400" />
                <span>Lihat Profil Publik</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Profil Bawah & Keluar */}
        <div className="p-4 border-t border-stone-100 shrink-0 bg-white">
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
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#D9D3C3] bg-white px-4 sm:px-6 flex items-center justify-between md:justify-end">
          <NavigasiMobileDasbor
            namaLembaga={sesi.lembaga?.nama}
            slugLembaga={sesi.lembaga?.slug}
            namaPengguna={sesi.nama}
            emailPengguna={sesi.email}
          />
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-[#1E3F30] flex items-center gap-1"
          >
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span> &rarr;
          </Link>
        </header>

        {/* Banner Status Menunggu Verifikasi */}
        {isPending && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3 text-xs text-amber-900">
            <Clock className="h-4 w-4 text-amber-700 shrink-0" />
            <p>
              <strong>Status Lembaga: Menunggu Verifikasi Kemenag.</strong> Pengajuan akun pesantren Anda sedang ditinjau oleh Admin Pusat MOCHI. Anda dapat melengkapi profil lembaga selagi menunggu persetujuan.
            </p>
          </div>
        )}

        {/* Banner Status Ditangguhkan (Diblokir) */}
        {isSuspended && (
          <div className="bg-rose-50 border-b border-rose-300 px-6 py-4 flex items-start gap-3 text-xs text-rose-950">
            <ShieldAlert className="h-5 w-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-rose-900">
                Akun Lembaga Ditangguhkan oleh Admin Pusat
              </p>
              <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                Alasan: <em>&ldquo;{sesi.lembaga?.alasan_status || 'Pelanggaran ketentuan publikasi atau ketidaksesuaian data'}&rdquo;</em>.
              </p>
              <p className="mt-1 text-[11px] text-rose-700">
                Hak penerbitan bahtsul masail dibekukan sementara. Silakan hubungi Admin Pusat MOCHI di <strong>admin@mochi.pesantren.id</strong> untuk proses klarifikasi atau pengaktifan kembali.
              </p>
            </div>
          </div>
        )}

        {/* Banner Status Ditolak */}
        {isRejected && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-start gap-3 text-xs text-rose-900">
            <XCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
            <p>
              <strong>Permohonan Pendaftaran Ditolak:</strong> {sesi.lembaga?.alasan_status || 'Dokumen bukti tidak sesuai'}. Silakan perbaiki data lembaga pada menu Profil Lembaga.
            </p>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}