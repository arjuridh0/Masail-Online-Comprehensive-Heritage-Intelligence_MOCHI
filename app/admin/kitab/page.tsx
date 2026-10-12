import type { Metadata } from 'next'
import { Plus, Trash2 } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { tambahKitabAction, hapusKitabAction } from '@/app/admin/actions'

export const metadata: Metadata = {
  title: 'Kelola Master Kitab | Admin MOCHI',
}

export default async function AdminKitabPage() {
  const adminDb = createAdminClient()

  const { data: daftarKitab } = await adminDb
    .from('kitab')
    .select('*')
    .order('nama_latin', { ascending: true })

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#D9D3C3] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E3F30]">
            Master Kitab Turats Rujukan
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Daftar kitab muktabarah yang menjadi sumber ibarat dalam persidangan bahtsul masail.
          </p>
        </div>

        <span className="rounded-full bg-[#EAE5D5] px-3 py-1 text-xs font-bold text-[#1E3F30]">
          {daftarKitab?.length || 0} Kitab Terdaftar
        </span>
      </div>

      {/* Form Tambah Kitab Baru */}
      <div className="rounded-2xl border border-[#D9D3C3] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-4">
          <Plus className="h-4 w-4 text-[#8C733E]" />
          <h2 className="text-sm font-bold text-[#1E3F30]">
            Tambah Kitab Turats Baru
          </h2>
        </div>

        <form action={tambahKitabAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Nama Latin Kitab *
            </label>
            <input
              type="text"
              name="nama_latin"
              required
              placeholder="Contoh: Fathul Wahhab"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Nama Arab Kitab (RTL)
            </label>
            <input
              type="text"
              name="nama_arab"
              dir="rtl"
              placeholder="فتح الوهاب"
              className="w-full font-serif rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden text-right"
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Pengarang / Musonnif
            </label>
            <input
              type="text"
              name="pengarang"
              placeholder="Zakariyya al-Anshari"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Wafat (H)
              </label>
              <input
                type="number"
                name="wafat_h"
                placeholder="926"
                className="w-full font-mono rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Bidang *
              </label>
              <input
                type="text"
                name="bidang"
                required
                defaultValue="Fiqih"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#1E3F30] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] transition-all"
            >
              Simpan Kitab Baru
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Kitab */}
      <div className="rounded-2xl border border-[#D9D3C3] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF8F2] border-b border-[#E8E2D2] text-[11px] font-bold text-[#1E3F30] uppercase">
              <tr>
                <th className="px-4 py-3">Nama Kitab</th>
                <th className="px-4 py-3">Nama Arab</th>
                <th className="px-4 py-3">Musonnif</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {daftarKitab?.map((k) => (
                <tr key={k.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-semibold text-stone-900">
                    {k.nama_latin}
                  </td>
                  <td
                    dir="rtl"
                    className="px-4 py-3 font-serif text-sm text-[#8C733E] text-right"
                    style={{ fontFamily: 'var(--font-amiri), serif' }}
                  >
                    {k.nama_arab || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {k.pengarang || '-'}
                    {k.wafat_h && (
                      <span className="text-stone-400 font-mono"> (w. {k.wafat_h} H)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                      {k.bidang}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={hapusKitabAction} className="inline">
                      <input type="hidden" name="id" value={k.id} />
                      <button
                        type="submit"
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Hapus kitab"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}