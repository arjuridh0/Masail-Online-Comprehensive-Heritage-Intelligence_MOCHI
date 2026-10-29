"use client"

import { useState, useEffect } from 'react'
import {
  BookCheck,
  Check,
  Copy,
  Quote,
  Share2,
  ShieldAlert,
  X,
} from 'lucide-react'

interface BilahAksiProps {
  masalahId: string
  kode: string
  judul: string
  sitasiTeks: string
  urlTeks: string
  fontSize: 'md' | 'lg' | 'xl'
  onChangeFontSize: (size: 'md' | 'lg' | 'xl') => void
  daftarRujukan?: {
    id: string
    kitab: string
    juz?: string | null
    halaman?: string | null
    teksArab?: string | null
  }[]
}

export function BilahAksi({
  masalahId,
  kode,
  judul,
  sitasiTeks,
  urlTeks,
  fontSize,
  onChangeFontSize,
  daftarRujukan = [],
}: BilahAksiProps) {
  const [showKutip, setShowKutip] = useState(false)
  const [showBagikan, setShowBagikan] = useState(false)
  const [showLapor, setShowLapor] = useState(false)

  // Copy states
  const [copiedSitasi, setCopiedSitasi] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Form Lapor / Tashih states
  const [jenisLapor, setJenisLapor] = useState<'tashih' | 'pelanggaran'>('tashih')
  const [selectedRujukanId, setSelectedRujukanId] = useState('')
  const [usulanTeks, setUsulanTeks] = useState('')
  const [namaPengusul, setNamaPengusul] = useState('')
  const [alasanLapor, setAlasanLapor] = useState('ibarat_kurang_tepat')
  const [detailLapor, setDetailLapor] = useState('')
  const [kontakLapor, setKontakLapor] = useState('')
  const [honeypot, setHoneypot] = useState('') // Anti-spam bot honeypot
  const [isSubmittingLapor, setIsSubmittingLapor] = useState(false)
  const [laporSuccess, setLaporSuccess] = useState(false)
  const [laporMessage, setLaporMessage] = useState('')
  const [laporError, setLaporError] = useState('')

  useEffect(() => {
    const handleOpenLapor = () => {
      setJenisLapor('pelanggaran')
      setAlasanLapor('pelanggaran_konten')
      setShowLapor(true)
    }

    const handleOpenTashih = (e: Event) => {
      const custom = e as CustomEvent<{
        rujukanId?: string
        kitabNama?: string
        teksArab?: string
      }>
      setJenisLapor('tashih')
      setAlasanLapor('ibarat_kurang_tepat')
      if (custom.detail?.rujukanId) {
        setSelectedRujukanId(custom.detail.rujukanId)
      }
      if (custom.detail?.teksArab) {
        setUsulanTeks(custom.detail.teksArab)
      }
      setShowLapor(true)
    }

    window.addEventListener('open-mochi-lapor', handleOpenLapor)
    window.addEventListener('open-mochi-tashih', handleOpenTashih)
    return () => {
      window.removeEventListener('open-mochi-lapor', handleOpenLapor)
      window.removeEventListener('open-mochi-tashih', handleOpenTashih)
    }
  }, [])

  const handleCopySitasi = async () => {
    try {
      await navigator.clipboard.writeText(sitasiTeks)
      setCopiedSitasi(true)
      setTimeout(() => setCopiedSitasi(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(urlTeks)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleSubmitLapor = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingLapor(true)
    setLaporError('')

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masalah_id: masalahId,
          jenis: jenisLapor,
          alasan: alasanLapor,
          rujukan_id: selectedRujukanId || undefined,
          usulan_teks: usulanTeks || undefined,
          nama_pengusul: namaPengusul || undefined,
          detail: detailLapor,
          kontak: kontakLapor,
          website_url: honeypot || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim catatan masukan')
      }

      setLaporSuccess(true)
      setLaporMessage(
        data.message ||
          (jenisLapor === 'tashih'
            ? 'Jazakallahu khairan. Catatan tashih Anda telah diteruskan ke Dewan Pentashih lembaga.'
            : 'Laporan Anda telah diterima oleh administrator MOCHI.')
      )
      setTimeout(() => {
        setShowLapor(false)
        setLaporSuccess(false)
        setDetailLapor('')
        setUsulanTeks('')
      }, 3000)
    } catch (err: unknown) {
      setLaporError(err instanceof Error ? err.message : 'Terjadi kendala saat mengirim masukan')
    } finally {
      setIsSubmittingLapor(false)
    }
  }

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `*Keputusan Bahtsul Masail MOCHI*\n${kode} - ${judul}\n\nSelengkapnya di:\n${urlTeks}`
  )}`

  return (
    <div className="space-y-4">
      {/* Pengatur Ukuran Huruf Arab */}
      <div className="rounded-xl border border-[#D9D3C3] bg-[#FAF8F2] p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
          <span>Ukuran Teks Arab:</span>
          <span className="font-mono text-[#1E3F30]">
            {fontSize === 'md' ? 'Sedang' : fontSize === 'lg' ? 'Besar' : 'Ekstra'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeFontSize('md')}
            className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
              fontSize === 'md'
                ? 'bg-[#1E3F30] text-white shadow-xs'
                : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize('lg')}
            className={`rounded-lg py-1.5 text-sm font-bold transition-all ${
              fontSize === 'lg'
                ? 'bg-[#1E3F30] text-white shadow-xs'
                : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize('xl')}
            className={`rounded-lg py-1.5 text-base font-bold transition-all ${
              fontSize === 'xl'
                ? 'bg-[#1E3F30] text-white shadow-xs'
                : 'border border-[#DDD6C5] bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            A++
          </button>
        </div>
      </div>

      {/* Tombol Aksi Utama */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowKutip(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C8C4BB] bg-white px-4 py-2.5 text-xs font-bold text-[#1E3F30] shadow-xs hover:bg-[#FAF8F2] hover:border-[#1E3F30] transition-all cursor-pointer"
        >
          <Quote className="h-4 w-4 text-[#8C733E]" />
          <span>Kutip Keputusan</span>
        </button>

        <button
          type="button"
          onClick={() => setShowBagikan(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C8C4BB] bg-white px-4 py-2.5 text-xs font-bold text-stone-800 shadow-xs hover:bg-stone-50 transition-all cursor-pointer"
        >
          <Share2 className="h-4 w-4 text-emerald-700" />
          <span>Bagikan Keputusan</span>
        </button>

        {/* Tombol Community Peer-Review / Tashih Komunitas */}
        <button
          type="button"
          onClick={() => {
            setJenisLapor('tashih')
            setAlasanLapor('ibarat_kurang_tepat')
            setShowLapor(true)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A96E]/60 bg-[#FAF8F2] px-4 py-2.5 text-xs font-bold text-[#1E3F30] shadow-2xs hover:bg-[#F2EDE0] hover:border-[#1E3F30] transition-all cursor-pointer"
          data-testid="tombol-laporkan-koreksi"
        >
          <BookCheck className="h-4 w-4 text-[#8C733E]" />
          <span>Usulkan Tashih / Koreksi Ibarat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setJenisLapor('pelanggaran')
            setAlasanLapor('pelanggaran_konten')
            setShowLapor(true)
          }}
          className="text-center text-[10px] text-stone-600 hover:text-stone-900 transition-colors pt-1"
        >
          Ada pelanggaran etika/hukum? Laporkan ke Admin
        </button>
      </div>

      {/* Modal Kutip Keputusan */}
      {showKutip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9D3C3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-[#8C733E]" />
                <h3 className="text-base font-bold text-[#1E3F30]">
                  Kutip Format MOCHI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKutip(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-stone-600 mb-2">
                Format sitasi baku sesuai kaidah penulisan ilmiah &amp; tradisi bahtsul masail santri (PRD §7.5):
              </p>
              <div className="rounded-xl border border-[#D9D3C3] bg-[#FAF8F2] p-4 text-xs font-mono leading-relaxed text-stone-800">
                {sitasiTeks}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKutip(false)}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleCopySitasi}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${
                  copiedSitasi
                    ? 'bg-emerald-700'
                    : 'bg-[#1E3F30] hover:bg-[#2D5A46]'
                }`}
              >
                {copiedSitasi ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Sitasi Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Salin Sitasi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bagikan */}
      {showBagikan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D9D3C3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-emerald-700" />
                <h3 className="text-base font-bold text-[#1E3F30]">
                  Bagikan Keputusan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBagikan(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <span>Bagikan ke WhatsApp</span>
              </a>

              <div className="pt-2">
                <span className="text-xs font-medium text-stone-600 block mb-1">
                  Tautan Langsung:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={urlTeks}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-mono text-stone-700 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all cursor-pointer ${
                      copiedUrl
                        ? 'bg-emerald-700'
                        : 'bg-[#1E3F30] hover:bg-[#2D5A46]'
                    }`}
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Usul Tashih / Laporkan Konten */}
      {showLapor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#D9D3C3] animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                {jenisLapor === 'tashih' ? (
                  <div className="rounded-xl bg-emerald-100 p-2 text-[#1E3F30]">
                    <BookCheck className="h-5 w-5 text-emerald-800" />
                  </div>
                ) : (
                  <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-[#1E3F30]">
                    {jenisLapor === 'tashih'
                      ? 'Usul Tashih & Koreksi Ilmiah'
                      : 'Laporkan Pelanggaran Konten'}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-mono truncate max-w-[280px]">
                    {kode} — {judul}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLapor(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Switcher: Tashih Komunitas vs Lapor Pelanggaran */}
            <div className="mt-3 flex rounded-xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setJenisLapor('tashih')
                  setAlasanLapor('ibarat_kurang_tepat')
                }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  jenisLapor === 'tashih'
                    ? 'bg-white text-[#1E3F30] shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tashih Ilmiah (Pesantren)
              </button>
              <button
                type="button"
                onClick={() => {
                  setJenisLapor('pelanggaran')
                  setAlasanLapor('pelanggaran_konten')
                }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  jenisLapor === 'pelanggaran'
                    ? 'bg-white text-rose-800 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Lapor Pelanggaran (Admin)
              </button>
            </div>

            {laporSuccess ? (
              <div className="my-6 rounded-xl bg-emerald-50 p-4 text-center border border-emerald-200">
                <Check className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="mt-2 text-sm font-bold text-emerald-800">
                  {jenisLapor === 'tashih' ? 'Usulan Tashih Terkirim' : 'Laporan Diterima'}
                </p>
                <p className="text-xs text-emerald-700 mt-1">{laporMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLapor} className="mt-4 space-y-3.5">
                {/* Honeypot field untuk menangkal spam bot otomatis */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {laporError && (
                  <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                    {laporError}
                  </div>
                )}

                {jenisLapor === 'tashih' && (
                  <div className="rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-900 border border-emerald-200/80 leading-relaxed">
                    Masukan Anda akan diteruskan <strong>langsung ke Dewan Pentashih lembaga pesantren</strong> penyelenggara untuk ditelaah dan disempurnakan.
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {jenisLapor === 'tashih' ? 'Kategori Tashih' : 'Jenis Pelanggaran'}
                  </label>
                  <select
                    value={alasanLapor}
                    onChange={(e) => setAlasanLapor(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                  >
                    {jenisLapor === 'tashih' ? (
                      <>
                        <option value="ibarat_kurang_tepat">Teks Ibarat / Harakat Kurang Tepat</option>
                        <option value="terjemah_keliru">Kekeliruan Makna Terjemah</option>
                        <option value="nomor_halaman_juz">Koreksi Nomor Juz / Halaman Kitab</option>
                        <option value="sanad_tidak_sesuai">Nama Mushohhih / Forum Berbeda</option>
                        <option value="lainnya">Lainnya</option>
                      </>
                    ) : (
                      <>
                        <option value="pelanggaran_konten">Konten Hoax / Menyesatkan / Ujaran Kebencian</option>
                        <option value="duplikasi">Pencatutan Nama Ulama / Pembajakan Hak Cipta</option>
                        <option value="lainnya">Pelanggaran Syarat &amp; Ketentuan Lain</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Pemilihan Rujukan Spesifik jika ada */}
                {jenisLapor === 'tashih' && daftarRujukan.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Target Rujukan Ibarat (Opsional)
                    </label>
                    <select
                      value={selectedRujukanId}
                      onChange={(e) => {
                        const rid = e.target.value
                        setSelectedRujukanId(rid)
                        const found = daftarRujukan.find((r) => r.id === rid)
                        if (found?.teksArab) {
                          setUsulanTeks(found.teksArab)
                        }
                      }}
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:border-[#1E3F30] focus:outline-hidden"
                    >
                      <option value="">-- Seluruh Keputusan / Umum --</option>
                      {daftarRujukan.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.kitab} {r.juz ? `(Juz ${r.juz})` : ''} {r.halaman ? `Hal. ${r.halaman}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Usulan Teks Perbaikan (Khusus Tashih) */}
                {jenisLapor === 'tashih' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">
                        Usulan Teks Perbaikan (Arab / Terjemah)
                      </label>
                      <span className="text-[10px] text-stone-400">Opsional</span>
                    </div>
                    <textarea
                      rows={2}
                      value={usulanTeks}
                      onChange={(e) => setUsulanTeks(e.target.value)}
                      placeholder="Tuliskan redaksi teks Arab atau terjemahan yang tepat menurut Anda..."
                      dir="auto"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden font-serif"
                    />
                  </div>
                )}

                {/* Detail Penjelasan Catatan */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      Penjelasan &amp; Referensi Kitab *
                    </label>
                    <span
                      className={`text-[10px] ${
                        detailLapor.length >= 5 ? 'text-stone-400' : 'text-amber-600 font-semibold'
                      }`}
                    >
                      {detailLapor.length}/1000 (min 5)
                    </span>
                  </div>
                  <textarea
                    required
                    minLength={5}
                    maxLength={1000}
                    rows={3}
                    value={detailLapor}
                    onChange={(e) => setDetailLapor(e.target.value)}
                    placeholder={
                      jenisLapor === 'tashih'
                        ? 'Contoh: Pada Fathul Wahhab juz 1 hal. 45 cetakan Thaha Putra, harakat kata كذا seharusnya kasrah...'
                        : 'Jelaskan kronologi atau bukti pelanggaran konten ini...'
                    }
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nama Santri / Peneliti (Opsional)
                    </label>
                    <input
                      type="text"
                      value={namaPengusul}
                      onChange={(e) => setNamaPengusul(e.target.value)}
                      placeholder="Ust. Ahmad (Santri)"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Kontak Email / WA (Opsional)
                    </label>
                    <input
                      type="text"
                      value={kontakLapor}
                      onChange={(e) => setKontakLapor(e.target.value)}
                      placeholder="Untuk kabar ralat naskah"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowLapor(false)}
                    className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingLapor}
                    className="rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white hover:bg-[#2D5A46] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingLapor ? 'Mengirim...' : jenisLapor === 'tashih' ? 'Kirim Usulan Tashih' : 'Kirim Laporan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
