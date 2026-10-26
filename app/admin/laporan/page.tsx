import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  XCircle,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { prosesLaporanAction } from '@/app/admin/actions'

export const metadata: Metadata = {
  title: 'Manajemen Laporan Koreksi Konten | Admin MOCHI',
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminLaporanPage({ searchParams }: PageProps) {
  const { status = 'semua' } = await searchParams
  const adminDb = createAdminClient()

  let query = adminDb
    .from('laporan')
    .select(`
      id,
      alasan,
      detail,
      kontak,
      status,
      catatan_admin,
      dibuat_pada,
      masalah:masalah_id (
        id,
        kode,
        judul,
        slug
      )
    `)
    .order('dibuat_pada', { ascending: false })

  if (status !== 'semua') {
    const filterStatus = status === 'menunggu' ? 'baru' : status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.eq('status', filterStatus as any)
  }

  const { data: daftarLaporan } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E3F30]">
            Laporan Koreksi Masail
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Daftar masukan, sanggahan, atau laporan kesalahan teks ibarat dari publik untuk ditinjau.
          </p>
        </div>

        {/* Filter Tab Status */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'baru', label: 'Baru / Menunggu' },
            { id: 'diproses', label: 'Diproses' },
            { id: 'selesai', label: 'Selesai' },
            { id: 'ditolak', label: 'Ditolak' },
          ].map((tab) => {
            const isSelected = status === tab.id || (tab.id === 'baru' && status === 'menunggu')
            return (
              <Link
                key={tab.id}
                href={`/admin/laporan?status=${tab.id}`}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1E3F30] text-white shadow-2xs'
                    : 'bg-[#F2EDE0] text-stone-700 hover:bg-[#E5DDC9]'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Daftar Laporan */}
      {!daftarLaporan || daftarLaporan.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D9D3C3] bg-[#FAF8F2] p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-stone-400" />
          <h3 className="mt-3 text-base font-bold text-stone-800">
            Tidak Ada Laporan
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            Tidak ditemukan laporan konten dengan filter status &ldquo;{status}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {daftarLaporan.map((lap) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const m = lap.masalah as any
            const tgl = new Date(lap.dibuat_pada).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={lap.id}
                className="rounded-2xl border border-[#D9D7CE] bg-[#FAF8F5] p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9D7CE]/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        lap.status === 'baru' || lap.status === 'menunggu'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : lap.status === 'diproses'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : lap.status === 'selesai'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {(lap.status === 'baru' || lap.status === 'menunggu') && <Clock className="h-3 w-3" />}
                      {lap.status === 'diproses' && <AlertTriangle className="h-3 w-3" />}
                      {lap.status === 'selesai' && <CheckCircle2 className="h-3 w-3" />}
                      {lap.status === 'ditolak' && <XCircle className="h-3 w-3" />}
                      <span>{lap.status}</span>
                    </span>

                    <span className="text-xs text-stone-500">• {tgl}</span>
                    {lap.kontak && (
                      <span className="text-xs text-stone-500">
                        • Pelapor: <strong className="text-stone-700">{lap.kontak}</strong>
                      </span>
                    )}
                  </div>

                  {m && (
                    <Link
                      href={`/masalah/${m.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3F30] hover:underline"
                    >
                      <span>{m.kode} — {m.judul}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3F30]">
                    Alasan: {lap.alasan}
                  </h4>
                  <p className="mt-1 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-xl border border-[#D9D7CE]">
                    {lap.detail}
                  </p>
                </div>

                {lap.catatan_admin && (
                  <div className="bg-stone-100 p-3 rounded-xl text-xs text-stone-600 border border-stone-200">
                    <span className="font-semibold text-stone-800">Catatan Admin:</span> {lap.catatan_admin}
                  </div>
                )}

                {/* Form Aksi Penanganan Laporan */}
                <form action={prosesLaporanAction} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input type="hidden" name="id" value={lap.id} />

                  <input
                    type="text"
                    name="catatan_admin"
                    defaultValue={lap.catatan_admin || ''}
                    placeholder="Tulis catatan penanganan..."
                    className="flex-1 rounded-xl border border-[#D9D7CE] bg-white px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                  />

                  <div className="flex items-center gap-1.5">
                    {lap.status !== 'diproses' && (
                      <button
                        type="submit"
                        name="status"
                        value="diproses"
                        className="rounded-xl border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Tindak Lanjuti
                      </button>
                    )}

                    {lap.status !== 'selesai' && (
                      <button
                        type="submit"
                        name="status"
                        value="selesai"
                        className="rounded-xl bg-[#1E3F30] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#152e23] transition-colors"
                      >
                        Tandai Selesai
                      </button>
                    )}

                    {lap.status !== 'ditolak' && (
                      <button
                        type="submit"
                        name="status"
                        value="ditolak"
                        className="rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Tolak Laporan
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
