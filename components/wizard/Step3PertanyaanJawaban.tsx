"use client"

import { Plus, Trash2, HelpCircle, CheckSquare } from 'lucide-react'
import type { WizardForumInput, PertanyaanInput } from '@/lib/validation/wizard'

export interface Step3Props {
  data: WizardForumInput
  onChange: (updated: Partial<WizardForumInput>) => void
  activeMasalahIdx: number
}

const ALPHABETS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

export function Step3PertanyaanJawaban({
  data,
  onChange,
  activeMasalahIdx,
}: Step3Props) {
  const currentMasalah = data.masalah[activeMasalahIdx]

  if (!currentMasalah) {
    return (
      <div className="p-8 text-center text-stone-500 text-xs">
        Silakan pilih masalah terlebih dahulu di Langkah 2.
      </div>
    )
  }

  const updatePertanyaan = (pertanyaanIdx: number, updated: Partial<PertanyaanInput>) => {
    const pList = [...currentMasalah.pertanyaan]
    pList[pertanyaanIdx] = {
      ...pList[pertanyaanIdx],
      ...updated,
    }

    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: pList,
    }
    onChange({ masalah: mList })
  }

  const tambahPertanyaan = () => {
    const nextLabel = ALPHABETS[currentMasalah.pertanyaan.length] || `${currentMasalah.pertanyaan.length + 1}`
    const baru: PertanyaanInput = {
      label: nextLabel,
      teks: '',
      jawaban: '',
      rujukan: [],
      urutan: currentMasalah.pertanyaan.length + 1,
    }

    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: [...currentMasalah.pertanyaan, baru],
    }
    onChange({ masalah: mList })
  }

  const hapusPertanyaan = (pertanyaanIdx: number) => {
    if (currentMasalah.pertanyaan.length <= 1) return
    const pList = currentMasalah.pertanyaan.filter((_, i) => i !== pertanyaanIdx)
    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: pList,
    }
    onChange({ masalah: mList })
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1E3F30]">
            Langkah 3: Pertanyaan (As-ilah) & Diktum Jawaban Hukum
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Masalah: <span className="font-bold text-stone-900">{currentMasalah.judul || '(Belum ada judul)'}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={tambahPertanyaan}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Tambah Sub-Pertanyaan ({ALPHABETS[currentMasalah.pertanyaan.length] || '+'})</span>
        </button>
      </div>

      {/* Daftar Pertanyaan & Jawaban */}
      <div className="space-y-6">
        {currentMasalah.pertanyaan.map((p, pIdx) => (
          <div
            key={pIdx}
            className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm relative"
          >
            {/* Header sub-pertanyaan */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FAF8F2] border border-[#D9D3C3] text-xs font-black text-[#1E3F30]">
                  {p.label}.
                </span>
                <span className="text-xs font-bold text-stone-800">
                  Pertanyaan As-ilah {p.label.toUpperCase()}
                </span>
              </div>
              {currentMasalah.pertanyaan.length > 1 && (
                <button
                  type="button"
                  onClick={() => hapusPertanyaan(pIdx)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            {/* Input Teks Pertanyaan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#8C733E]" />
                <span>Rumusan Pertanyaan <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                rows={2}
                required
                value={p.teks}
                onChange={(e) => updatePertanyaan(pIdx, { teks: e.target.value })}
                placeholder="Contoh: Bagaimana hukum transaksi jual beli menggunakan uang kripto menurut hukum Islam?"
                className="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
              />
            </div>

            {/* Input Diktum Jawaban Hukum */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Diktum Keputusan Hukum / Jawaban <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                rows={4}
                required
                value={p.jawaban}
                onChange={(e) => updatePertanyaan(pIdx, { jawaban: e.target.value })}
                placeholder="Contoh: Haram, karena tidak memenuhi kriteria sil'ah (komoditas berharga) dan mengandung unsur gharar (ketidakpastian spekulatif)..."
                className="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-[#1E3F30] outline-none font-sans leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}