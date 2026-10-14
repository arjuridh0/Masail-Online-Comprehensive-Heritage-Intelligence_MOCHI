import type { Metadata } from 'next'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { TombolAksiVerifikasi } from './TombolAksiVerifikasi'

export const metadata: Metadata = {
  title: 'Verifikasi Lembaga & NSPP | Admin MOCHI',
}

export default async function AdminVerifikasiPage() {
  const adminDb = createAdminClient()

  // Ambil antrean lembaga yang menunggu verifikasi
  const { data: antrean } = await adminDb
    .from('lembaga')
    .select(`
      id,
      nama,
      slug,
      jenis,
      kota,
      provinsi,
      nspp,
      kontak_email,
      kontak_telepon,
      dokumen_bukti_url,
      status,
      dibuat_pada
    `)
    .eq('status', 'menunggu')
    .order('dibuat_pada', { ascending: false })

  // Siapkan signed URL untuk dokumen bukti
  const antreanDenganDokumen = await Promise.all(
    (antrean || []).map(async (lembaga) => {
      let signedUrl: string | null = null
      if (lembaga.dokumen_bukti_url) {
        const { data } = await adminDb.storage
          .from('bukti-lembaga')
          .createSignedUrl(lembaga.dokumen_bukti_url, 3600) // 1 jam
        signedUrl = data?.signedUrl || null
      }
      return { ...lembaga, signedUrl }
    })
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#D9D3C3] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E3F30]">
            Antrean Verifikasi NSPP Lembaga
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Periksa keabsahan identitas pesantren dan nomor NSPP sebelum menerbitkan hak publikasi masail.
          </p>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          {antreanDenganDokumen.length} Menunggu Verifikasi
        </span>
      </div>

      {antreanDenganDokumen.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D9D3C3] bg-white p-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
          <h2 className="text-base font-bold text-stone-800">
            Tidak Ada Antrean Pendaftaran
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Seluruh permohonan pendaftaran lembaga telah selesai diverifikasi oleh tim admin.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {antreanDenganDokumen.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D9D3C3] bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#1E3F30] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                      {item.jenis.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-stone-500">
                      <Clock className="h-3 w-3" />
                      Daftar: {new Date(item.dibuat_pada).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h2 className="mt-1.5 text-lg font-bold text-[#1E3F30]">
                    {item.nama}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-stone-400" />
                      {item.kota}, {item.provinsi}
                    </span>
                    {item.kontak_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-stone-400" />
                        {item.kontak_email}
                      </span>
                    )}
                    {item.kontak_telepon && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-stone-400" />
                        {item.kontak_telepon}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info NSPP */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-right">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    NSPP Terdaftar:
                  </span>
                  <span className="font-mono text-sm font-extrabold text-[#1E3F30]">
                    {item.nspp || 'Non-Pesantren (Tanpa NSPP)'}
                  </span>
                </div>
              </div>

              {/* Dokumen Bukti Signed URL */}
              <div className="flex items-center justify-between text-xs bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E2D2]">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-[#8C733E]" />
                  <span className="font-semibold text-stone-700">
                    Dokumen Bukti Legalitas / SK Kemenag:
                  </span>
                </div>
                {item.signedUrl ? (
                  <a
                    href={item.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#1E3F30] hover:underline"
                  >
                    <span>Buka Berkas Bukti (Signed URL)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-stone-400 italic">
                    Tidak ada berkas bukti diunggah
                  </span>
                )}
              </div>

              {/* Form Aksi Verifikasi dengan Loading & Feedback */}
              <TombolAksiVerifikasi lembagaId={item.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}