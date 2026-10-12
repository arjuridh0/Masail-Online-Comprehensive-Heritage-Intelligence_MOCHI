"use client"

import { Check } from 'lucide-react'

export interface StepNavigasiProps {
  currentStep: number
  onSelectStep: (step: number) => void
  completedSteps: number[]
}

const STEPS = [
  { step: 1, label: 'Info Forum', desc: 'Waktu, Tempat & Sanad' },
  { step: 2, label: 'Masalah', desc: 'Judul, Topik & Corak' },
  { step: 3, label: 'Tanya-Jawab', desc: 'As-ilah & Keputusan' },
  { step: 4, label: 'Rujukan Arab', desc: 'Ibarat Kitab Turats' },
  { step: 5, label: 'Tinjau & Terbit', desc: 'Dokumentasi & Terbit' },
]

export function StepNavigasi({
  currentStep,
  onSelectStep,
  completedSteps,
}: StepNavigasiProps) {
  return (
    <nav aria-label="Tahapan Wizard" className="w-full bg-white border border-[#D9D3C3] rounded-2xl p-3 shadow-sm mb-6">
      <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STEPS.map((s) => {
          const isActive = s.step === currentStep
          const isDone = completedSteps.includes(s.step)

          return (
            <li key={s.step} className="relative">
              <button
                type="button"
                onClick={() => onSelectStep(s.step)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#1E3F30] text-white shadow-sm ring-1 ring-[#1E3F30]'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isActive
                      ? 'bg-[#C9A96E] text-stone-900 font-black'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {isDone && !isActive ? <Check className="h-3.5 w-3.5" /> : s.step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : ''}`}>
                    {s.label}
                  </div>
                  <div
                    className={`text-[10px] truncate hidden md:block ${
                      isActive ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {s.desc}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}