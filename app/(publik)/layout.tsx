import React from 'react'
import Navbar from '@/components/layout/Navbar'
import { TombolMelayangChat } from '@/components/chat/TombolMelayangChat'
import { StatusKoneksi } from '@/components/ui/StatusKoneksi'
import { getSesiPengguna } from '@/lib/auth/session'

export default async function PublikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sesi = await getSesiPengguna()
  const ringkasanSesi = sesi
    ? {
        id: sesi.id,
        nama: sesi.nama,
        email: sesi.email,
        peran: sesi.peran,
        lembagaNama: sesi.lembaga?.nama || null,
        lembagaSlug: sesi.lembaga?.slug || null,
      }
    : null

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F3EE]">
      <Navbar sesi={ringkasanSesi} />
      <div className="flex-1">{children}</div>
      {/* Tombol Melayang Tanya MOCHI di semua halaman publik */}
      <TombolMelayangChat />
      {/* Indikator Status Koneksi / Mode Offline */}
      <StatusKoneksi />
    </div>
  )
}
