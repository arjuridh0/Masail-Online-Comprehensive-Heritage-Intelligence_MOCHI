import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSesiPengguna } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { WizardContainer } from '@/components/wizard/WizardContainer'

export const metadata: Metadata = {
  title: 'Input Keputusan Bahtsul Masail Baru | Dasbor MOCHI',
}

export default async function ForumBaruPage() {
  const sesi = await getSesiPengguna()
  if (!sesi || !sesi.lembaga) {
    redirect('/masuk?redirect=/dasbor/forum/baru')
  }

  if (sesi.lembaga.status === 'ditangguhkan') {
    redirect('/dasbor')
  }

  const adminDb = createAdminClient()
  const { data: daftarKitab } = await adminDb
    .from('kitab')
    .select('id, nama_latin, nama_arab')
    .order('nama_latin', { ascending: true })

  const isVerified = sesi.lembaga.status === 'terverifikasi'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dasbor/forum"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#1E3F30]">
            Input Keputusan Bahtsul Masail Baru
          </h1>
          <p className="text-xs text-stone-600">
            Pencatatan hasil musyawarah fiqih secara terstruktur & bersanad
          </p>
        </div>
      </div>

      <WizardContainer
        isVerifiedLembaga={isVerified}
        masterKitab={daftarKitab || []}
        initialData={{
          tuan_rumah: sesi.lembaga.nama,
          lokasi: sesi.lembaga.kota || '',
        }}
      />
    </div>
  )
}