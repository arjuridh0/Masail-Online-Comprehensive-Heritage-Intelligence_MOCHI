'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface TombolKembaliProps {
  hrefDefault?: string
  label?: string
  className?: string
  testId?: string
}

export function TombolKembali({
  hrefDefault = '/',
  label = 'Kembali',
  className = '',
  testId = 'tombol-kembali',
}: TombolKembaliProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(hrefDefault)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      data-testid={testId}
      className={`group inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-stone-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-all hover:border-[#1E3F30] hover:text-[#1E3F30] active:scale-95 cursor-pointer ${className}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-stone-500 group-hover:text-[#1E3F30]" />
      <span>{label}</span>
    </button>
  )
}

export default TombolKembali
