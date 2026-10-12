import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import FormProfilLembaga from './FormProfilLembaga'

export const metadata: Metadata = {
  title: 'Kelola Profil Lembaga | Dasbor MOCHI',
}

export default async function DasborProfilPage() {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    redirect('/masuk')
  }

  const adminDb = createAdminClient()
  const { data: profilLembaga } = await adminDb
    .from('lembaga')
    .select('*')
    .eq('id', sesi.lembaga.id)
    .single()

  if (!profilLembaga) {
    redirect('/masuk')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#D9D3C3] pb-4">
        <h1 className="text-2xl font-black text-[#1E3F30]">
          Kelola Profil Lembaga
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Perbarui identitas publik, logo resmi, informasi kontak, dan kata sandi akun pesantren mitra Anda.
        </p>
      </div>

      <FormProfilLembaga
        initialData={{
          nama: profilLembaga.nama,
          jenis: profilLembaga.jenis,
          nspp: profilLembaga.nspp,
          namaPenanggungJawab: sesi.nama,
          deskripsi: profilLembaga.deskripsi,
          alamat: profilLembaga.alamat,
          kota: profilLembaga.kota || '',
          provinsi: profilLembaga.provinsi || '',
          kontak_telepon: profilLembaga.kontak_telepon,
          kontak_email: profilLembaga.kontak_email,
          situs_web: profilLembaga.situs_web,
          logo_url: profilLembaga.logo_url,
        }}
      />
    </div>
  )
}