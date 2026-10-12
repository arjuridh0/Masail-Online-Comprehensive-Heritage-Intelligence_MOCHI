import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import TabelKelolaLembaga from '@/components/admin/TabelKelolaLembaga'

export const metadata: Metadata = {
  title: 'Daftar Lembaga | Admin MOCHI',
}

export default async function AdminLembagaPage() {
  const adminDb = createAdminClient()

  const { data: daftarLembaga } = await adminDb
    .from('lembaga')
    .select('*')
    .order('dibuat_pada', { ascending: false })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#D9D3C3] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E3F30]">
            Daftar Seluruh Lembaga
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Daftar seluruh pesantren dan LBM NU yang terdaftar dalam sistem MOCHI.
          </p>
        </div>

        <span className="rounded-full bg-[#EAE5D5] px-3 py-1 text-xs font-bold text-[#1E3F30]">
          {daftarLembaga?.length || 0} Lembaga Terdaftar
        </span>
      </div>

      <TabelKelolaLembaga daftarLembaga={daftarLembaga || []} />
    </div>
  )
}