import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import FormProfilAdmin from './FormProfilAdmin'

export const metadata: Metadata = {
  title: 'Pengaturan Profil Admin | MOCHI',
}

export default async function AdminProfilPage() {
  const sesi = await getSesiPengguna()
  if (!sesi || sesi.peran !== 'admin') {
    redirect('/masuk')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#D9D3C3] pb-4">
        <h1 className="text-2xl font-black text-[#1E3F30]">
          Pengaturan Akun Administrator
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Kelola profil identitas dan keamanan kata sandi akun Admin Pusat MOCHI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Akun Admin */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2.5 text-[#1E3F30]">
            <ShieldCheck className="h-5 w-5 text-[#8C733E]" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Akses Admin Pusat
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-stone-400 block text-[11px]">Email Login:</span>
            <strong className="text-stone-800 font-mono block break-all">
              {sesi.email}
            </strong>
          </div>

          <div className="space-y-1 text-xs pt-2 border-t border-stone-100">
            <span className="text-stone-400 block text-[11px]">Nama Administrator:</span>
            <strong className="text-stone-800 block">
              {sesi.nama}
            </strong>
          </div>

          <div className="rounded-xl bg-[#FAF8F2] p-3 text-[11px] text-stone-600 leading-relaxed border border-[#E8E2D2]">
            Hak akses penuh terhadap verifikasi NSPP, moderasi lembaga mitra pesantren, dan pemeliharaan master kitab.
          </div>
        </div>

        {/* Formulir Edit Profil & Sandi */}
        <div className="md:col-span-2 space-y-6">
          <FormProfilAdmin namaAwal={sesi.nama} />
        </div>
      </div>
    </div>
  )
}
