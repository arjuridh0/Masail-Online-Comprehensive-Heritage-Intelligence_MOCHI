"use client"

import { useState } from 'react'
import { Plus, Trash2, Tag, X } from 'lucide-react'
import type { WizardForumInput, MasalahInput } from '@/lib/validation/wizard'
import { TOPIK_OPTIONS } from '@/lib/validation/wizard'

export interface Step2Props {
  data: WizardForumInput
  onChange: (updated: Partial<WizardForumInput>) => void
  activeMasalahIdx: number
  setActiveMasalahIdx: (idx: number) => void
}

export function Step2DaftarMasalah({
  data,
  onChange,
  activeMasalahIdx,
  setActiveMasalahIdx,
}: Step2Props) {
  const [keywordInput, setKeywordInput] = useState('')

  const currentMasalah: MasalahInput = data.masalah[activeMasalahIdx] || {
    judul: '',
    deskripsi: '',
    topik: ['muamalah'],
    corak: 'waqi_iyyah',
    kata_kunci: [],
    urutan: 1,
    pertanyaan: [{ label: 'a', teks: '', jawaban: '', rujukan: [], urutan: 1 }],
  }

  const updateCurrentMasalah = (updated: Partial<MasalahInput>) => {
    const list = [...data.masalah]
    list[activeMasalahIdx] = {
      ...currentMasalah,
      ...updated,
    }
    onChange({ masalah: list })
  }

  const tambahMasalahBaru = () => {
    const baru: MasalahInput = {
      judul: '',
      deskripsi: '',
      topik: ['muamalah'],
      corak: 'waqi_iyyah',
      kata_kunci: [],
      urutan: data.masalah.length + 1,
      pertanyaan: [{ label: 'a', teks: '', jawaban: '', rujukan: [], urutan: 1 }],
    }
    const updatedList = [...data.masalah, baru]
    onChange({ masalah: updatedList })
    setActiveMasalahIdx(updatedList.length - 1)
  }

  const hapusMasalah = (idx: number) => {
    if (data.masalah.length <= 1) return
    const updatedList = data.masalah.filter((_, i) => i !== idx)
    onChange({ masalah: updatedList })
    if (activeMasalahIdx >= updatedList.length) {
      setActiveMasalahIdx(updatedList.length - 1)
    }
  }

  const toggleTopik = (topikItem: 'ibadah' | 'muamalah' | 'munakahat') => {
    const current = currentMasalah.topik || []
    if (current.includes(topikItem)) {
      if (current.length > 1) {
        updateCurrentMasalah({ topik: current.filter((t) => t !== topikItem) })
      }
    } else {
      updateCurrentMasalah({ topik: [...current, topikItem] })
    }
  }

  const addKeyword = () => {
    const val = keywordInput.trim()
    if (!val) return
    const currentList = currentMasalah.kata_kunci || []
    if (!currentList.includes(val)) {
      updateCurrentMasalah({ kata_kunci: [...currentList, val] })
    }
    setKeywordInput('')
  }

  const removeKeyword = (idx: number) => {
    const currentList = currentMasalah.kata_kunci || []
    updateCurrentMasalah({ kata_kunci: currentList.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1E3F30]">Langkah 2: Daftar Masalah / Judul Keputusan</h2>
          <p className="text-xs text-stone-600 mt-1">
            Dalam satu forum bahtsul masail dapat diputuskan 1 atau beberapa masalah hukum fiqih.
          </p>
        </div>
        <button
          type="button"
          onClick={tambahMasalahBaru}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Tambah Masalah Lain</span>
        </button>
      </div>

      {/* Selector Tab Masalah */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {data.masalah.map((m, idx) => (
          <div
            key={idx}
            className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all shrink-0 cursor-pointer ${
              activeMasalahIdx === idx
                ? 'border-[#1E3F30] bg-[#FAF8F2] font-bold text-[#1E3F30] ring-1 ring-[#1E3F30]'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
            onClick={() => setActiveMasalahIdx(idx)}
          >
            <span>Masalah #{idx + 1}: {m.judul ? m.judul.slice(0, 24) + '...' : '(Belum ada judul)'}</span>
            {data.masalah.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  hapusMasalah(idx)
                }}
                className="text-stone-400 hover:text-rose-600 p-0.5 rounded"
                title="Hapus masalah ini"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Form Masalah Aktif */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        {/* Judul Masalah */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-800">
            Judul Masalah Fiqih <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={currentMasalah.judul}
            onChange={(e) => updateCurrentMasalah({ judul: e.target.value })}
            placeholder="Contoh: Hukum Penggunaan Paylater dengan Skema Bunga Denda"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none font-semibold"
          />
        </div>

        {/* Corak Masail */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">Corak Masail (Karakteristik Pembahasan)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'waqi_iyyah', title: "Waqi'iyyah", desc: 'Kasus riil kemasyarakatan' },
              { id: 'maudhu_iyyah', title: "Maudhu'iyyah", desc: 'Kajian tematik konseptual' },
              { id: 'qanuniyyah', title: 'Qanuniyyah', desc: 'Tinjauan hukum/undang-undang' },
            ].map((c) => (
              <label
                key={c.id}
                className={`flex flex-col rounded-xl border p-3 cursor-pointer transition-all ${
                  currentMasalah.corak === c.id
                    ? 'border-[#1E3F30] bg-emerald-50/50 ring-1 ring-[#1E3F30]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="corak"
                    value={c.id}
                    checked={currentMasalah.corak === c.id}
                    onChange={() => updateCurrentMasalah({ corak: c.id as 'waqi_iyyah' | 'maudhu_iyyah' | 'qanuniyyah' })}
                    className="accent-[#1E3F30]"
                  />
                  <span className="text-xs font-bold text-stone-900">{c.title}</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 pl-5">{c.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Topik Multi-Pilih */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">
            Topik Masail <span className="text-rose-500">*</span> <span className="text-stone-400 font-normal">(bisa pilih lebih dari satu)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPIK_OPTIONS.map((t) => {
              const isSelected = currentMasalah.topik?.includes(t)
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTopik(t)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all border ${
                    isSelected
                      ? 'border-[#1E3F30] bg-[#1E3F30] text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* Deskripsi / Tasawwur Masalah */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-800">
            Deskripsi Kasus / Tasawwur Mas-alah <span className="text-stone-400 font-normal">(latar belakang realitas)</span>
          </label>
          <textarea
            rows={3}
            value={currentMasalah.deskripsi || ''}
            onChange={(e) => updateCurrentMasalah({ deskripsi: e.target.value })}
            placeholder="Jelaskan gambaran permasalahan yang melatarbelakangi pertanyaan..."
            className="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
          />
        </div>

        {/* Kata Kunci */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">Kata Kunci / Tag Pencarian</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addKeyword()
                  }
                }}
                placeholder="Ketik kata kunci lalu Enter (misal: fintech, denda, riba)"
                className="w-full rounded-xl border border-stone-300 pl-8 pr-3 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
              />
              <Tag className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            </div>
            <button
              type="button"
              onClick={addKeyword}
              className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-200"
            >
              Tambah
            </button>
          </div>
          {currentMasalah.kata_kunci && currentMasalah.kata_kunci.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentMasalah.kata_kunci.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 text-xs text-stone-800 border border-stone-200"
                >
                  <span>#{kw}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(idx)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}