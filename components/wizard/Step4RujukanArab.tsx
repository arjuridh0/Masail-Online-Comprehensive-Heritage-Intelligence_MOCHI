"use client"

import { useState } from 'react'
import { Plus, Trash2, BookOpen, Languages } from 'lucide-react'
import type { WizardForumInput, RujukanInput } from '@/lib/validation/wizard'

export interface Step4Props {
  data: WizardForumInput
  onChange: (updated: Partial<WizardForumInput>) => void
  activeMasalahIdx: number
  masterKitab?: Array<{ id: string; nama_latin: string; nama_arab: string }>
}

export function Step4RujukanArab({
  data,
  onChange,
  activeMasalahIdx,
  masterKitab = [],
}: Step4Props) {
  const currentMasalah = data.masalah[activeMasalahIdx]
  const [activePertanyaanIdx, setActivePertanyaanIdx] = useState(0)

  if (!currentMasalah) {
    return (
      <div className="p-8 text-center text-stone-500 text-xs">
        Silakan pilih masalah terlebih dahulu di Langkah 2.
      </div>
    )
  }

  const currentPertanyaan = currentMasalah.pertanyaan[activePertanyaanIdx] || currentMasalah.pertanyaan[0]

  const updateRujukan = (rujukanIdx: number, updated: Partial<RujukanInput>) => {
    if (!currentPertanyaan) return
    const rList = [...(currentPertanyaan.rujukan || [])]
    rList[rujukanIdx] = {
      ...rList[rujukanIdx],
      ...updated,
    }

    const pList = [...currentMasalah.pertanyaan]
    pList[activePertanyaanIdx] = {
      ...currentPertanyaan,
      rujukan: rList,
    }

    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: pList,
    }
    onChange({ masalah: mList })
  }

  const tambahRujukan = () => {
    if (!currentPertanyaan) return
    const baru: RujukanInput = {
      kitab_teks: '',
      juz: '',
      halaman: '',
      teks_arab: '',
      terjemah: '',
      urutan: (currentPertanyaan.rujukan?.length || 0) + 1,
    }

    const pList = [...currentMasalah.pertanyaan]
    pList[activePertanyaanIdx] = {
      ...currentPertanyaan,
      rujukan: [...(currentPertanyaan.rujukan || []), baru],
    }

    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: pList,
    }
    onChange({ masalah: mList })
  }

  const hapusRujukan = (rujukanIdx: number) => {
    if (!currentPertanyaan) return
    const rList = currentPertanyaan.rujukan.filter((_, i) => i !== rujukanIdx)

    const pList = [...currentMasalah.pertanyaan]
    pList[activePertanyaanIdx] = {
      ...currentPertanyaan,
      rujukan: rList,
    }

    const mList = [...data.masalah]
    mList[activeMasalahIdx] = {
      ...currentMasalah,
      pertanyaan: pList,
    }
    onChange({ masalah: mList })
  }

  const handleSelectMasterKitab = (rujukanIdx: number, kitabId: string) => {
    const k = masterKitab.find((item) => item.id === kitabId)
    if (k) {
      updateRujukan(rujukanIdx, {
        kitab_id: k.id,
        kitab_teks: k.nama_latin,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#1E3F30]">
            Langkah 4: Rujukan & Kutipan Ibarat Kitab Turats
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Lampirkan nash teks Arab dari kitab kuning rujukan mu-tabaroh beserta jilid, halaman, dan terjemahnya.
          </p>
        </div>
        <button
          type="button"
          onClick={tambahRujukan}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Tambah Rujukan Kitab</span>
        </button>
      </div>

      {/* Tabs Pertanyaan jika ada lebih dari 1 */}
      {currentMasalah.pertanyaan.length > 1 && (
        <div className="flex gap-2 border-b border-stone-200 pb-2">
          {currentMasalah.pertanyaan.map((p, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActivePertanyaanIdx(idx)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activePertanyaanIdx === idx
                  ? 'bg-[#1E3F30] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Pertanyaan {p.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Info pertanyaan aktif */}
      {currentPertanyaan && (
        <div className="rounded-xl bg-[#FAF8F2] border border-[#D9D3C3] p-3 text-xs">
          <span className="font-bold text-[#1E3F30]">Pertanyaan {currentPertanyaan.label.toUpperCase()}: </span>
          <span className="text-stone-700">{currentPertanyaan.teks || '(Belum mengisi pertanyaan)'}</span>
        </div>
      )}

      {/* List Rujukan */}
      {currentPertanyaan?.rujukan?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center bg-stone-50/50">
          <BookOpen className="mx-auto h-8 w-8 text-stone-400 mb-2" />
          <h3 className="text-xs font-bold text-stone-700">Belum ada rujukan kitab</h3>
          <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
            Klik tombol &quot;+ Tambah Rujukan Kitab&quot; untuk menyematkan kutipan ibarat turats.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentPertanyaan?.rujukan?.map((r, rIdx) => (
            <div
              key={rIdx}
              className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm relative"
            >
              {/* Header Rujukan */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-[#8C733E] flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>Rujukan #{rIdx + 1}</span>
                </span>
                <button
                  type="button"
                  onClick={() => hapusRujukan(rIdx)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              {/* Pilihan Kitab Master & Nama Kitab */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-800">
                    Nama Kitab Rujukan <span className="text-rose-500">*</span>
                  </label>
                  <div className="space-y-1.5">
                    {masterKitab.length > 0 && (
                      <select
                        value={r.kitab_id || ''}
                        onChange={(e) => handleSelectMasterKitab(rIdx, e.target.value)}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-700 outline-none"
                      >
                        <option value="">Pilih dari Master Kitab Turats...</option>
                        {masterKitab.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama_latin} ({k.nama_arab})
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      required
                      value={r.kitab_teks}
                      onChange={(e) => updateRujukan(rIdx, { kitab_teks: e.target.value })}
                      placeholder="Atau ketik nama kitab manual (misal: Takmilah al-Majmu')"
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Juz / Jilid</label>
                    <input
                      type="text"
                      value={r.juz || ''}
                      onChange={(e) => updateRujukan(rIdx, { juz: e.target.value })}
                      placeholder="Contoh: 1"
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800">Halaman</label>
                    <input
                      type="text"
                      value={r.halaman || ''}
                      onChange={(e) => updateRujukan(rIdx, { halaman: e.target.value })}
                      placeholder="Contoh: 45"
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Teks Arab (Ibarat) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 text-[#1E3F30]" />
                    <span>Teks Arab Ibarat (RTL) <span className="text-rose-500">*</span></span>
                  </label>
                  <span className="text-[10px] text-stone-400">Harap sertakan harakat jika tersedia</span>
                </div>
                <textarea
                  dir="rtl"
                  rows={4}
                  required
                  value={r.teks_arab}
                  onChange={(e) => updateRujukan(rIdx, { teks_arab: e.target.value })}
                  placeholder="اكتب عبارة الكتاب هنا..."
                  className="w-full rounded-xl border border-stone-300 bg-[#FAF8F2] p-4 text-base font-serif text-stone-900 focus:border-[#1E3F30] outline-none leading-loose text-right font-arab"
                />
              </div>

              {/* Terjemahan Makna Indonesia */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">
                  Terjemah / Makna Bahasa Indonesia <span className="text-stone-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  rows={2}
                  value={r.terjemah || ''}
                  onChange={(e) => updateRujukan(rIdx, { terjemah: e.target.value })}
                  placeholder="Terjemahan makna ibarat dalam bahasa Indonesia untuk memudahkan pembaca umum..."
                  className="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}