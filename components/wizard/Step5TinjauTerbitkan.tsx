"use client"

import { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  BookOpen,
  Upload,
  Loader2,
  Image as ImageIcon,
  Plus,
  XCircle,
} from 'lucide-react'
import { FuseButton } from '@/components/ui/FuseButton'
import type { WizardForumInput } from '@/lib/validation/wizard'
import { uploadFotoDokumentasiAction } from '@/app/dasbor/actions'

export interface Step5Props {
  data: WizardForumInput
  onChange: (updated: Partial<WizardForumInput>) => void
  onTerbitkan: () => Promise<void>
  onSimpanDraf: () => Promise<void>
  isPending: boolean
  isVerifiedLembaga: boolean
}

export function Step5TinjauTerbitkan({
  data,
  onChange,
  onTerbitkan,
  onSimpanDraf,
  isPending,
  isVerifiedLembaga,
}: Step5Props) {
  const [isUploadingFoto, setIsUploadingFoto] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Hitung kelengkapan data
  const hasInfo = Boolean(data.tuan_rumah && data.tanggal_mulai)
  const hasMasalah = data.masalah.length > 0 && Boolean(data.masalah[0]?.judul)
  const totalPertanyaan = data.masalah.reduce((acc, m) => acc + (m.pertanyaan?.length || 0), 0)
  const totalRujukan = data.masalah.reduce(
    (acc, m) => acc + m.pertanyaan.reduce((pAcc, p) => pAcc + (p.rujukan?.length || 0), 0),
    0
  )

  const isReadyToPublish = hasInfo && hasMasalah && totalPertanyaan > 0 && isVerifiedLembaga

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const currentCount = data.dokumentasi?.length || 0
    if (currentCount >= 6) {
      setUploadError('Maksimal 6 foto dokumentasi forum.')
      return
    }

    setUploadError(null)
    setIsUploadingFoto(true)

    const remainingSlots = 6 - currentCount
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    const newUrls: string[] = []

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`Berkas "${file.name}" melebihi batas 5 MB.`)
        continue
      }

      const fd = new FormData()
      fd.set('file', file)
      const res = await uploadFotoDokumentasiAction(fd)
      if (res?.success && res.url) {
        newUrls.push(res.url)
      } else if (res?.error) {
        setUploadError(res.error)
      }
    }

    if (newUrls.length > 0) {
      onChange({ dokumentasi: [...(data.dokumentasi || []), ...newUrls] })
    }

    setIsUploadingFoto(false)
    e.target.value = ''
  }

  const handleAddFotoUrl = (url: string) => {
    if (!url.trim()) return
    const currentCount = data.dokumentasi?.length || 0
    if (currentCount >= 6) {
      setUploadError('Maksimal 6 foto dokumentasi forum.')
      return
    }
    onChange({ dokumentasi: [...(data.dokumentasi || []), url.trim()] })
  }

  const handleRemoveFoto = (idx: number) => {
    onChange({ dokumentasi: (data.dokumentasi || []).filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-lg font-black text-[#1E3F30]">
          Langkah 5: Tinjau Kelengkapan & Terbitkan Keputusan
        </h2>
        <p className="text-xs text-stone-600 mt-1">
          Periksa kembali seluruh rangkaian keputusan musyawarah sebelum dipublikasikan ke Repositori MOCHI.
        </p>
      </div>

      {/* Warning jika belum terverifikasi */}
      {!isVerifiedLembaga && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Status Lembaga Belum Terverifikasi</span>
            <p className="mt-0.5 text-amber-800">
              Akun lembaga Anda saat ini berstatus &quot;Menunggu Verifikasi&quot; oleh Admin MOCHI.
              Anda dapat menyimpan keputusan ini sebagai <strong>Draf</strong>, namun penerbitan publik membutuhkan verifikasi resmi.
            </p>
          </div>
        </div>
      )}

      {/* Checklist Ringkasan Kelengkapan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#8C733E]">
            Daftar Centang Standar Mutu
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${hasInfo ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={hasInfo ? 'text-stone-800 font-semibold' : 'text-stone-400'}>
                Identitas Forum & Waktu Penyelenggaraan
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${data.pentashih?.length ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={data.pentashih?.length ? 'text-stone-800 font-semibold' : 'text-stone-400'}>
                Sanad Ulama Mushohhih ({data.pentashih?.length || 0} tercatat)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${hasMasalah ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={hasMasalah ? 'text-stone-800 font-semibold' : 'text-stone-400'}>
                Masalah Hukum & Corak Pembahasan ({data.masalah.length} masalah)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${totalPertanyaan > 0 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={totalPertanyaan > 0 ? 'text-stone-800 font-semibold' : 'text-stone-400'}>
                Rumusan As-ilah & Diktum Jawaban ({totalPertanyaan} as-ilah)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${totalRujukan > 0 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={totalRujukan > 0 ? 'text-stone-800 font-semibold' : 'text-stone-400'}>
                Kutipan Ibarat Kitab Turats ({totalRujukan} rujukan)
              </span>
            </li>
          </ul>
        </div>

        {/* Ringkasan Metadata Forum */}
        <div className="rounded-2xl border border-[#D9D3C3] bg-[#FAF8F2] p-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3F30]">
            Pratinjau Ringkas
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-[#8C733E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900">{data.tuan_rumah || '(Penyelenggara belum diisi)'}</span>
                {data.nama && <span className="block text-stone-600 text-[11px]">{data.nama}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#8C733E] shrink-0" />
              <span className="text-stone-700">
                {data.tanggal_mulai || '-'} ({data.tanggal_hijriah || 'Hijriah belum diatur'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#8C733E] shrink-0" />
              <span className="text-stone-700">
                {data.masalah.length} Masalah · {totalPertanyaan} As-ilah · {totalRujukan} Ibarat Kitab
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dokumentasi Kegiatan Forum */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#8C733E] flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              <span>Dokumentasi Foto Kegiatan Forum</span>
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Unggah foto suasana sidang bahtsul masail (maksimal 6 foto, setiap foto maksimal 5 MB).
            </p>
          </div>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-700">
            {data.dokumentasi?.length || 0} / 6 Foto
          </span>
        </div>

        {uploadError && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {uploadError}
          </div>
        )}

        {/* Upload Button & Dropzone */}
        {(data.dokumentasi?.length || 0) < 6 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label
              htmlFor="upload-foto-forum"
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E3F30] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] active:scale-[0.98] transition-all ${
                isUploadingFoto ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              {isUploadingFoto ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Mengunggah Foto...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Pilih Berkas Foto (JPG/PNG/WebP)</span>
                </>
              )}
              <input
                id="upload-foto-forum"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploadingFoto}
                onChange={handleUploadFoto}
                className="sr-only"
              />
            </label>

            <span className="text-[11px] text-stone-400 text-center sm:text-left">
              atau tambahkan tautan URL gambar publik
            </span>
          </div>
        )}

        {/* Input URL Alternatif */}
        {(data.dokumentasi?.length || 0) < 6 && (
          <div className="flex gap-2">
            <input
              type="url"
              id="input-foto-url"
              placeholder="https://... tempel tautan URL foto"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-1.5 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const target = e.currentTarget
                  handleAddFotoUrl(target.value)
                  target.value = ''
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('input-foto-url') as HTMLInputElement
                if (el) {
                  handleAddFotoUrl(el.value)
                  el.value = ''
                }
              }}
              className="rounded-xl bg-stone-100 px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-200 transition-colors"
            >
              Tambah URL
            </button>
          </div>
        )}

        {/* Grid Preview Foto */}
        {data.dokumentasi && data.dokumentasi.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
            {data.dokumentasi.map((url, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-50 h-28 shadow-xs"
              >
                <img
                  src={url}
                  alt={`Dokumentasi forum ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFoto(idx)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-rose-600 transition-colors"
                  aria-label="Hapus foto"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center text-xs text-stone-400 flex flex-col items-center justify-center gap-1.5">
            <ImageIcon className="h-6 w-6 text-stone-300" />
            <span>Belum ada foto dokumentasi forum ditambahkan.</span>
          </div>
        )}
      </div>

      {/* Tombol Aksi Akhir */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          disabled={isPending}
          onClick={onSimpanDraf}
          className="w-full sm:w-auto rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-sm transition-colors"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Draf Saja'}
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <FuseButton
            label="Terbitkan Keputusan Resmi"
            fuseLabel="Batalkan Penerbitan"
            durationSeconds={2}
            variant="success"
            disabled={!isReadyToPublish || isPending}
            onComplete={onTerbitkan}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  )
}