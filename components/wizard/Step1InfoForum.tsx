"use client"

import { useState } from 'react'
import { Calendar, MapPin, Users, Plus, X, Sparkles, UploadCloud } from 'lucide-react'
import { konversiKeHijriah } from '@/lib/hijri'
import type { WizardForumInput } from '@/lib/validation/wizard'
import { ModalSmartIngestion } from './ModalSmartIngestion'

export interface Step1Props {
  data: WizardForumInput
  onChange: (updated: Partial<WizardForumInput>) => void
}

export function Step1InfoForum({ data, onChange }: Step1Props) {
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false)
  const [tagInputs, setTagInputs] = useState({
    pentashih: '',
    perumus: '',
    moderator: '',
  })

  const handleTanggalMulaiChange = (val: string) => {
    const saranHijriah = konversiKeHijriah(val)
    onChange({
      tanggal_mulai: val,
      // Jika tanggal hijriah belum diisi atau sebelumnya adalah auto, update saran
      tanggal_hijriah: data.tanggal_hijriah || saranHijriah,
    })
  }

  const addTag = (field: 'pentashih' | 'perumus' | 'moderator') => {
    const val = tagInputs[field].trim()
    if (!val) return
    const currentList = data[field] || []
    if (!currentList.includes(val)) {
      onChange({ [field]: [...currentList, val] })
    }
    setTagInputs({ ...tagInputs, [field]: '' })
  }

  const removeTag = (field: 'pentashih' | 'perumus' | 'moderator', index: number) => {
    const currentList = data[field] || []
    onChange({ [field]: currentList.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {/* Banner Wadah Smart Ingestion / OCR */}
      <div className="rounded-2xl border border-dashed border-[#C9A96E] bg-[#FAF8F2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3F30] text-[#C9A96E]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#1E3F30]">Punya Berkas Notulensi / Hasil Ketikan Masail?</h3>
              <span className="rounded-full bg-[#C9A96E]/20 px-2 py-0.5 text-[9px] font-bold text-[#8C733E]">Vision AI</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Unggah berkas Word (.docx), PDF, atau foto naskah fisik untuk diparsing otomatis ke form wizard.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsSmartModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white border border-[#D9D3C3] px-3.5 py-2 text-xs font-bold text-[#1E3F30] hover:bg-[#1E3F30] hover:text-white hover:border-[#1E3F30] transition-colors shadow-2xs"
        >
          <UploadCloud className="h-3.5 w-3.5 text-[#8C733E]" />
          <span>Unggah Berkas Notulensi</span>
        </button>
      </div>

      <ModalSmartIngestion
        isOpen={isSmartModalOpen}
        onClose={() => setIsSmartModalOpen(false)}
      />

      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-lg font-black text-[#1E3F30]">Langkah 1: Identitas & Sanad Forum</h2>
        <p className="text-xs text-stone-600 mt-1">
          Lengkapi informasi forum bahtsul masail, waktu musyawarah, serta susunan ulama mushohhih dan perumus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tuan Rumah */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-stone-800">
            Penyelenggara / Tuan Rumah Forum <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={data.tuan_rumah}
            onChange={(e) => onChange({ tuan_rumah: e.target.value })}
            placeholder="Contoh: Pondok Pesantren Lirboyo Kediri / LBM PWNU Jawa Timur"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none"
          />
        </div>

        {/* Nama Forum (Opsional) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-stone-800">
            Nama / Tajuk Forum Masail <span className="text-stone-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={data.nama || ''}
            onChange={(e) => onChange({ nama: e.target.value })}
            placeholder="Contoh: Bahtsul Masail Kubro FMPP se-Jawa Madura Ke-37"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none"
          />
        </div>

        {/* Tanggal Mulai */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-800">
            Tanggal Pelaksanaan Masehi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={data.tanggal_mulai}
              onChange={(e) => handleTanggalMulaiChange(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none"
            />
            <Calendar className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-stone-400" />
          </div>
        </div>

        {/* Tanggal Hijriah (Auto-suggest) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800">Tanggal Hijriah (Otomatis / Manual)</label>
            {data.tanggal_mulai && (
              <button
                type="button"
                onClick={() => onChange({ tanggal_hijriah: konversiKeHijriah(data.tanggal_mulai) })}
                className="text-[10px] font-bold text-[#8C733E] hover:underline"
              >
                Reset ke Kalender Umalqura
              </button>
            )}
          </div>
          <input
            type="text"
            value={data.tanggal_hijriah || ''}
            onChange={(e) => onChange({ tanggal_hijriah: e.target.value })}
            placeholder="Contoh: 10 Dzulqa'dah 1445 H"
            className="w-full rounded-xl border border-stone-300 bg-[#FAF8F2] px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none font-medium"
          />
        </div>

        {/* Lokasi Forum */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-stone-800">Lokasi / Tempat Pelaksanaan</label>
          <div className="relative">
            <input
              type="text"
              value={data.lokasi || ''}
              onChange={(e) => onChange({ lokasi: e.target.value })}
              placeholder="Contoh: Gedung Yayasan Pondok Pesantren Lirboyo, Kota Kediri"
              className="w-full rounded-xl border border-stone-300 pl-9 pr-3.5 py-2.5 text-xs text-stone-900 focus:border-[#1E3F30] focus:ring-1 focus:ring-[#1E3F30] outline-none"
            />
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          </div>
        </div>
      </div>

      {/* Sanad: Mushohhih, Perumus, Moderator */}
      <div className="space-y-4 pt-2 border-t border-stone-100">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#8C733E] flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>Sanad Ulama & Notulensi Forum</span>
        </h3>

        {/* Dewan Mushohhih */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">
            Dewan Mushohhih (Ulama Pentashih Keputusan)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs.pentashih}
              onChange={(e) => setTagInputs({ ...tagInputs, pentashih: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag('pentashih')
                }
              }}
              placeholder="Ketik nama ulama lalu Enter (misal: KH. Azizi Hasbullah)"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
            />
            <button
              type="button"
              onClick={() => addTag('pentashih')}
              className="flex items-center gap-1 rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>
          {data.pentashih && data.pentashih.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.pentashih.map((nama, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-900"
                >
                  <span>{nama}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('pentashih', idx)}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tim Perumus */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">Tim Perumus Jawaban</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs.perumus}
              onChange={(e) => setTagInputs({ ...tagInputs, perumus: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag('perumus')
                }
              }}
              placeholder="Ketik nama perumus lalu Enter (misal: Gus Aniq Nawawi)"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
            />
            <button
              type="button"
              onClick={() => addTag('perumus')}
              className="flex items-center gap-1 rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>
          {data.perumus && data.perumus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.perumus.map((nama, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-100 border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-800"
                >
                  <span>{nama}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('perumus', idx)}
                    className="text-stone-500 hover:text-stone-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Moderator */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-800">Pimpinan Sidang / Moderator</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs.moderator}
              onChange={(e) => setTagInputs({ ...tagInputs, moderator: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag('moderator')
                }
              }}
              placeholder="Ketik nama moderator lalu Enter"
              className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-stone-900 focus:border-[#1E3F30] outline-none"
            />
            <button
              type="button"
              onClick={() => addTag('moderator')}
              className="flex items-center gap-1 rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>
          {data.moderator && data.moderator.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.moderator.map((nama, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-100 border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-800"
                >
                  <span>{nama}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('moderator', idx)}
                    className="text-stone-500 hover:text-stone-800"
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