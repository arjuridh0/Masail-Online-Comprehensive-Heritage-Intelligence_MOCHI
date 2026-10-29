"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  BookCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileEdit,
  Send,
  XCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import {
  tanggapiTashihLembagaAction,
  terapkanKoreksiTashihAction,
} from '@/app/dasbor/actions'
import { toast } from '@/components/ui/SwipeToast'

export interface ItemLaporanTashih {
  id: string
  alasan: string
  detail: string | null
  kontak: string | null
  status: 'baru' | 'diproses' | 'selesai' | 'ditolak'
  catatan_admin: string | null
  dibuat_pada: string
  masalah: {
    id: string
    kode: string
    judul: string
    slug: string
    forum?: {
      id: string
      nama: string | null
      lembaga_id: string
    } | null
    pertanyaan?: {
      id: string
      rujukan?: {
        id: string
        kitab_teks: string
        teks_arab: string | null
        terjemah: string | null
      }[]
    }[]
  } | null
}

interface KotakTashihLembagaProps {
  daftarLaporan: ItemLaporanTashih[]
}

export function KotakTashihLembaga({ daftarLaporan }: KotakTashihLembagaProps) {
  const [bukaFormAksi, setBukaFormAksi] = useState<string | null>(null)
  const [bukaQuickApply, setBukaQuickApply] = useState<string | null>(null)
  const [catatanDewan, setCatatanDewan] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Quick apply form state
  const [targetKolom, setTargetKolom] = useState<'teks_arab' | 'terjemah' | 'deskripsi'>('teks_arab')
  const [selectedRujukanId, setSelectedRujukanId] = useState<string>('')
  const [teksPerbaikan, setTeksPerbaikan] = useState<string>('')
  const [ringkasanRevisi, setRingkasanRevisi] = useState<string>('')

  const handleTanggapi = async (laporanId: string, status: 'selesai' | 'ditolak') => {
    setLoadingId(laporanId)
    const formData = new FormData()
    formData.append('laporan_id', laporanId)
    formData.append('status', status)
    formData.append('catatan_lembaga', catatanDewan)

    try {
      const res = await tanggapiTashihLembagaAction(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(res?.message || 'Tanggapan berhasil disimpan.')
        setBukaFormAksi(null)
        setCatatanDewan('')
      }
    } catch {
      toast.error('Gagal menyimpan tanggapan.')
    } finally {
      setLoadingId(null)
    }
  }

  const handleTerapkanKoreksi = async (laporanId: string, masalahId: string) => {
    if (!teksPerbaikan.trim()) {
      toast.error('Teks perbaikan wajib diisi.')
      return
    }

    setLoadingId(laporanId)
    const formData = new FormData()
    formData.append('laporan_id', laporanId)
    formData.append('masalah_id', masalahId)
    if (selectedRujukanId) {
      formData.append('rujukan_id', selectedRujukanId)
    }
    formData.append('target_kolom', targetKolom)
    formData.append('teks_baru', teksPerbaikan.trim())
    formData.append('ringkasan_revisi', ringkasanRevisi.trim())

    try {
      const res = await terapkanKoreksiTashihAction(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(res?.message || 'Tashih berhasil diterapkan ke naskah publik!')
        setBukaQuickApply(null)
        setTeksPerbaikan('')
        setRingkasanRevisi('')
      }
    } catch {
      toast.error('Gagal menerapkan tashih.')
    } finally {
      setLoadingId(null)
    }
  }

  // Ekstrak teks usulan dari detail jika ada pola terstruktur
  const parseDetail = (text: string | null) => {
    if (!text) return { pengusul: null, usulan: null, catatan: null }
    const pengusulMatch = text.match(/Pengusul:\s*([^\n]+)/)
    const usulanMatch = text.match(/---\s*TEKS USULAN PERBAIKAN\s*---\n([\s\S]*?)\n---------------------------/)
    const catatanMatch = text.match(/Catatan & Referensi:\n([\s\S]*)/)

    return {
      pengusul: pengusulMatch ? pengusulMatch[1]?.trim() : null,
      usulan: usulanMatch ? usulanMatch[1]?.trim() : null,
      catatan: catatanMatch ? catatanMatch[1]?.trim() : text,
    }
  }

  return (
    <div className="space-y-4">
      {daftarLaporan.map((lap) => {
        const m = lap.masalah
        const parsed = parseDetail(lap.detail)
        const tgl = new Date(lap.dibuat_pada).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })

        const daftarRujukan =
          m?.pertanyaan?.flatMap((p) => p.rujukan || []) || []

        const isActionOpen = bukaFormAksi === lap.id
        const isQuickApplyOpen = bukaQuickApply === lap.id
        const isLoading = loadingId === lap.id

        return (
          <div
            key={lap.id}
            className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-[#8C733E]/50 transition-all"
          >
            {/* Header Laporan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    lap.status === 'baru'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : lap.status === 'diproses'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : lap.status === 'selesai'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {lap.status === 'baru' && <Clock className="h-3 w-3" />}
                  {lap.status === 'diproses' && <AlertTriangle className="h-3 w-3" />}
                  {lap.status === 'selesai' && <CheckCircle2 className="h-3 w-3" />}
                  {lap.status === 'ditolak' && <XCircle className="h-3 w-3" />}
                  <span>
                    {lap.status === 'baru'
                      ? 'Usulan Baru'
                      : lap.status === 'selesai'
                      ? 'Telah Ditashih'
                      : lap.status === 'ditolak'
                      ? 'Diarsipkan'
                      : 'Sedang Ditelaah'}
                  </span>
                </span>

                <span className="text-[11px] text-stone-500">• {tgl}</span>
                <span className="text-[11px] font-semibold text-stone-700">
                  • {lap.alasan.replace(/^tashih_/, 'Tashih: ').replace(/_/g, ' ')}
                </span>
                {parsed.pengusul && (
                  <span className="text-[11px] text-emerald-800 font-medium">
                    • Oleh: {parsed.pengusul}
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

            {/* Kotak Catatan Pembaca & Usulan Teks */}
            <div className="space-y-3">
              {parsed.usulan && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Usulan Redaksi Perbaikan dari Pembaca:</span>
                  </div>
                  <div
                    dir="auto"
                    className="p-2.5 rounded-lg bg-white border border-emerald-200 text-stone-900 font-serif text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {parsed.usulan}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-stone-200 bg-white p-3.5 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                <span className="font-bold text-stone-900 block mb-1">
                  Catatan &amp; Referensi Santri/Pembaca:
                </span>
                {parsed.catatan}
              </div>

              {lap.catatan_admin && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-950 leading-relaxed">
                  <span className="font-bold block mb-0.5">Tanggapan Dewan Pentashih / Admin:</span>
                  {lap.catatan_admin}
                </div>
              )}
            </div>

            {/* Form Quick Apply Tashih (Terapkan Koreksi Cepat) */}
            {isQuickApplyOpen && m && (
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 p-4 space-y-3 animate-in fade-in zoom-in-98 duration-150">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <BookCheck className="h-4 w-4 text-emerald-700" />
                    <span>Terapkan Koreksi Cepat ke Naskah Publik</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setBukaQuickApply(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Target Bagian yang Diperbarui:
                    </label>
                    <select
                      value={targetKolom}
                      onChange={(e) => setTargetKolom(e.target.value as 'teks_arab' | 'terjemah' | 'deskripsi')}
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                    >
                      <option value="teks_arab">Teks Arab (Ibarat Kitab)</option>
                      <option value="terjemah">Terjemahan Ibarat</option>
                      <option value="deskripsi">Deskripsi Masalah</option>
                    </select>
                  </div>

                  {(targetKolom === 'teks_arab' || targetKolom === 'terjemah') && (
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Pilih Rujukan Kitab:
                      </label>
                      <select
                        value={selectedRujukanId}
                        onChange={(e) => {
                          const rid = e.target.value
                          setSelectedRujukanId(rid)
                          const found = daftarRujukan.find((r) => r.id === rid)
                          if (found) {
                            setTeksPerbaikan(
                              targetKolom === 'teks_arab'
                                ? found.teks_arab || ''
                                : found.terjemah || ''
                            )
                          }
                        }}
                        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                      >
                        <option value="">-- Pilih Rujukan Target --</option>
                        {daftarRujukan.map((r, idx) => (
                          <option key={r.id} value={r.id}>
                            #{idx + 1} {r.kitab_teks}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Redaksi Teks Baru yang Disahkan:
                  </label>
                  <textarea
                    rows={3}
                    dir={targetKolom === 'teks_arab' ? 'rtl' : 'auto'}
                    value={teksPerbaikan}
                    onChange={(e) => setTeksPerbaikan(e.target.value)}
                    placeholder="Masukkan naskah yang sudah diperbaiki..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-900 font-serif leading-relaxed focus:border-[#1E3F30] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Ringkasan Catatan Riwayat Revisi (Tampil di Publik):
                  </label>
                  <input
                    type="text"
                    value={ringkasanRevisi}
                    onChange={(e) => setRingkasanRevisi(e.target.value)}
                    placeholder="Contoh: Koreksi harakat kata كذا pada Fathul Wahhab juz 1"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setBukaQuickApply(null)}
                    className="rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleTerapkanKoreksi(lap.id, m.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#2D5A46] disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isLoading ? 'Menerapkan...' : 'Sahkan & Perbarui Naskah'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form Tanggapi Catatan (Tandai Selesai / Tolak Manual) */}
            {isActionOpen && (
              <div className="rounded-2xl border border-stone-300 bg-white p-4 space-y-3 animate-in fade-in zoom-in-98 duration-150">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h4 className="text-xs font-bold text-stone-800">
                    Tanggapi Catatan Tashih Dewan Pentashih
                  </h4>
                  <button
                    type="button"
                    onClick={() => setBukaFormAksi(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={catatanDewan}
                  onChange={(e) => setCatatanDewan(e.target.value)}
                  placeholder="Tuliskan catatan pentashih atau rujukan cetakan yang digunakan..."
                  className="w-full rounded-xl border border-stone-300 bg-[#FAF8F5] p-2.5 text-xs text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                />

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleTanggapi(lap.id, 'ditolak')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5 text-stone-500" />
                    <span>Arsipkan (Tanpa Ralat)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleTanggapi(lap.id, 'selesai')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#2D5A46] disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Tandai Selesai Ditashih</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bilah Tombol Aksi Lembaga */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/70">
              <div className="flex items-center gap-2">
                {lap.status !== 'selesai' && (
                  <>
                    {m && (
                      <button
                        type="button"
                        onClick={() => {
                          setBukaQuickApply(isQuickApplyOpen ? null : lap.id)
                          setBukaFormAksi(null)
                          if (parsed.usulan) {
                            setTeksPerbaikan(parsed.usulan)
                          }
                          if (daftarRujukan[0]?.id) {
                            setSelectedRujukanId(daftarRujukan[0].id)
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Terapkan Koreksi Cepat</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setBukaFormAksi(isActionOpen ? null : lap.id)
                        setBukaQuickApply(null)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 text-stone-500" />
                      <span>Beri Tanggapan</span>
                      <ChevronDown className="h-3 w-3 text-stone-400" />
                    </button>
                  </>
                )}
              </div>

              {m?.forum && (
                <Link
                  href={`/dasbor/forum/${m.forum.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-stone-300 px-3.5 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs"
                >
                  <FileEdit className="h-3.5 w-3.5 text-[#8C733E]" />
                  <span>Buka Editor Lengkap</span>
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
