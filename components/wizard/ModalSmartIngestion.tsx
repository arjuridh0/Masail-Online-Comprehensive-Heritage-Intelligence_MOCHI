"use client"

import { useState } from 'react'
import { Sparkles, FileText, UploadCloud, ShieldCheck, X, ArrowRight, CheckCircle2 } from 'lucide-react'

interface ModalSmartIngestionProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalSmartIngestion({ isOpen, onClose }: ModalSmartIngestionProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationDone, setSimulationDone] = useState(false)

  if (!isOpen) return null

  const handleSimulateUpload = (filename: string) => {
    setSelectedFile(filename)
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setSimulationDone(true)
    }, 1200)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setIsSimulating(false)
    setSimulationDone(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white border border-[#D9D3C3] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal */}
        <div className="bg-[#1E3F30] px-6 py-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#C9A96E] border border-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A96E]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F3E5C8] mb-1">
                <span>Riset Inovasi AI &bull; Roadmap Fase 2</span>
              </div>
              <h3 className="text-base font-extrabold tracking-tight text-white">
                Smart Document Ingestion (OCR Vision AI)
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset()
              onClose()
            }}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Isi Modal */}
        <div className="p-6 space-y-5">
          {/* Prinsip Zero-Storage Retention */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex gap-3 text-emerald-900">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Prinsip Arsitektur: Zero-Storage Retention</p>
              <p className="text-emerald-800 leading-relaxed">
                Dokumen notulensi atau foto kertas fotokopi yang diunggah diproses sementara dalam memori server 
                untuk ekstraksi struktur teks, lalu <strong>seketika dihapus secara permanen</strong> tanpa disimpan ke storage. 
                Kerahasiaan naskah internal pesantren terjamin 100%.
              </p>
            </div>
          </div>

          {/* Area Dropzone / Mock Upload */}
          {!simulationDone ? (
            <div className="rounded-2xl border-2 border-dashed border-[#D9D3C3] bg-[#FAF8F5] p-6 text-center hover:border-[#1E3F30] transition-colors">
              <UploadCloud className="h-10 w-10 text-[#8C733E] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[#1E3F30]">
                Unggah Berkas Notulensi Bahtsul Masail
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Mendukung dokumen Microsoft Word (.docx), PDF hasil ketikan, atau foto jepretan lembaran kertas fotokopi.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateUpload("Notulensi_BM_PWNU_2024.docx")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 disabled:opacity-50"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Simulasi Berkas Word (.docx)</span>
                </button>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateUpload("Foto_Kertas_BahtsulMasail_Hal1.jpg")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 disabled:opacity-50"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  <span>Simulasi Foto Kertas (.jpg)</span>
                </button>
              </div>

              {isSimulating && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#1E3F30]">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1E3F30] border-t-transparent" />
                  <span>AI Vision mengekstrak struktur teks ({selectedFile})...</span>
                </div>
              )}
            </div>
          ) : (
            /* Tampilan Hasil Simulasi Ekstraksi */
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Simulasi Berhasil: Berkas {selectedFile} siap diekstrak</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Di rilis versi selanjutnya (Fase 2), modul ini akan memetakan otomatis:
                nama forum ke Langkah 1, deskripsi kasus ke Langkah 2, diktum ke Langkah 3, dan kutipan ibarat Arab ke Langkah 4.
              </p>
            </div>
          )}

          {/* Catatan Status Rilis */}
          <p className="text-[11px] text-stone-500 text-center italic">
            *Fitur ini disiapkan sebagai penguatan arsitektur digitalisasi arsip fisik pesantren di panggung inovasi Santrivision 2026.
          </p>
        </div>

        {/* Footer Modal */}
        <div className="bg-[#FAF8F5] border-t border-stone-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Ingin mengisi langsung sekarang?
          </span>
          <button
            type="button"
            onClick={() => {
              handleReset()
              onClose()
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#2A5742] transition-colors"
          >
            <span>Lanjutkan 5 Langkah Bersanad</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
