"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { StepNavigasi } from './StepNavigasi'
import { Step1InfoForum } from './Step1InfoForum'
import { Step2DaftarMasalah } from './Step2DaftarMasalah'
import { Step3PertanyaanJawaban } from './Step3PertanyaanJawaban'
import { Step4RujukanArab } from './Step4RujukanArab'
import { Step5TinjauTerbitkan } from './Step5TinjauTerbitkan'
import { SwipeToast, type SwipeToastProps } from '@/components/ui/SwipeToast'
import { simpanDrafForumAction, terbitkanForumAction } from '@/app/dasbor/forum/actions'
import type { WizardForumInput } from '@/lib/validation/wizard'

export interface WizardContainerProps {
  initialData?: Partial<WizardForumInput>
  isVerifiedLembaga: boolean
  masterKitab: Array<{ id: string; nama_latin: string; nama_arab: string }>
}

export function WizardContainer({
  initialData,
  isVerifiedLembaga,
  masterKitab,
}: WizardContainerProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [activeMasalahIdx, setActiveMasalahIdx] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const [toast, setToast] = useState<SwipeToastProps | null>(null)
  const isDirtyRef = useRef(false)

  // Default initial values
  const [formData, setFormData] = useState<WizardForumInput>({
    id: initialData?.id,
    nama: initialData?.nama || '',
    tuan_rumah: initialData?.tuan_rumah || '',
    tanggal_mulai: initialData?.tanggal_mulai || new Date().toISOString().split('T')[0],
    tanggal_selesai: initialData?.tanggal_selesai || '',
    tanggal_hijriah: initialData?.tanggal_hijriah || '',
    lokasi: initialData?.lokasi || '',
    moderator: initialData?.moderator || [],
    pentashih: initialData?.pentashih || [],
    perumus: initialData?.perumus || [],
    status: initialData?.status || 'draf',
    dokumentasi: initialData?.dokumentasi || [],
    masalah: initialData?.masalah?.length
      ? initialData.masalah
      : [
          {
            judul: '',
            deskripsi: '',
            topik: ['muamalah'],
            corak: 'waqi_iyyah',
            kata_kunci: [],
            urutan: 1,
            pertanyaan: [
              {
                label: 'a',
                teks: '',
                jawaban: '',
                urutan: 1,
                rujukan: [],
              },
            ],
          },
        ],
  })

  // Tandai dirty saat form berubah
  const handleFormChange = (updated: Partial<WizardForumInput>) => {
    isDirtyRef.current = true
    setFormData((prev) => ({
      ...prev,
      ...updated,
    }))
  }

  // Peringatan sebelum meninggalkan halaman jika ada perubahan belum disimpan
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Auto-save debounce 30 detik
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirtyRef.current && formData.tuan_rumah && formData.tanggal_mulai) {
        simpanDrafForumAction(formData).then((res) => {
          if (res.success) {
            isDirtyRef.current = false
            if (res.forumId && !formData.id) {
              setFormData((prev) => ({ ...prev, id: res.forumId }))
            }
            const now = new Date()
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
            setToast({
              message: `Draf tersimpan otomatis pukul ${timeStr}`,
              variant: 'info',
              durationMs: 3000,
            })
          }
        })
      }
    }, 30000)

    return () => clearInterval(timer)
  }, [formData])

  // Evaluasi completed steps
  const completedSteps: number[] = []
  if (formData.tuan_rumah && formData.tanggal_mulai) completedSteps.push(1)
  if (formData.masalah.length > 0 && formData.masalah[0]?.judul) completedSteps.push(2)
  if (
    formData.masalah.every((m) =>
      m.pertanyaan.length > 0 && m.pertanyaan.every((p) => p.teks && p.jawaban)
    )
  ) {
    completedSteps.push(3)
  }
  if (
    formData.masalah.some((m) =>
      m.pertanyaan.some((p) => p.rujukan && p.rujukan.length > 0)
    )
  ) {
    completedSteps.push(4)
  }

  const handleSimpanDraf = async () => {
    setIsPending(true)
    try {
      const res = await simpanDrafForumAction(formData)
      if (res.success) {
        isDirtyRef.current = false
        if (res.forumId && !formData.id) {
          setFormData((prev) => ({ ...prev, id: res.forumId }))
        }
        setToast({
          message: 'Draf keputusan bahtsul masail berhasil disimpan!',
          variant: 'success',
          durationMs: 3000,
        })
      } else {
        setToast({
          message: res.error || 'Gagal menyimpan draf.',
          variant: 'error',
          durationMs: 5000,
        })
      }
    } finally {
      setIsPending(false)
    }
  }

  const handleTerbitkan = async () => {
    setIsPending(true)
    try {
      const res = await terbitkanForumAction(formData)
      if (res.success) {
        isDirtyRef.current = false
        setToast({
          message: 'Keputusan Bahtsul Masail Berhasil Diterbitkan Resmi!',
          variant: 'success',
          actionLabel: 'Buka Halaman Publik →',
          actionHref: `/forum/${res.slug}`,
          durationMs: 6000,
        })
        setTimeout(() => {
          router.push('/dasbor/forum')
        }, 1500)
      } else {
        setToast({
          message: res.error || 'Gagal menerbitkan forum.',
          variant: 'error',
          durationMs: 5000,
        })
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Toast Feedback */}
      {toast && (
        <SwipeToast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Bar Stepper Navigasi */}
      <StepNavigasi
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        completedSteps={completedSteps}
      />

      {/* Konten Step Aktif */}
      <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-sm">
        {currentStep === 1 && (
          <Step1InfoForum data={formData} onChange={handleFormChange} />
        )}

        {currentStep === 2 && (
          <Step2DaftarMasalah
            data={formData}
            onChange={handleFormChange}
            activeMasalahIdx={activeMasalahIdx}
            setActiveMasalahIdx={setActiveMasalahIdx}
          />
        )}

        {currentStep === 3 && (
          <Step3PertanyaanJawaban
            data={formData}
            onChange={handleFormChange}
            activeMasalahIdx={activeMasalahIdx}
          />
        )}

        {currentStep === 4 && (
          <Step4RujukanArab
            data={formData}
            onChange={handleFormChange}
            activeMasalahIdx={activeMasalahIdx}
            masterKitab={masterKitab}
          />
        )}

        {currentStep === 5 && (
          <Step5TinjauTerbitkan
            data={formData}
            onChange={handleFormChange}
            onTerbitkan={handleTerbitkan}
            onSimpanDraf={handleSimpanDraf}
            isPending={isPending}
            isVerifiedLembaga={isVerifiedLembaga}
          />
        )}

        {/* Bilah Navigasi Bawah Langkah (1 s.d. 4) */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-stone-200">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Sebelumnya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSimpanDraf}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Draf</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimpanDraf}
                disabled={isPending}
                className="hidden sm:inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Draf</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-5 py-2 text-xs font-bold text-white hover:bg-[#162f24] shadow-sm transition-colors"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}