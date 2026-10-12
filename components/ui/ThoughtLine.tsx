"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

export interface ThoughtLineProps {
  thoughts: string[]
  isStreaming: boolean
  startTime?: number
  endTime?: number
  className?: string
}

export function ThoughtLine({
  thoughts,
  isStreaming,
  startTime,
  endTime,
  className = '',
}: ThoughtLineProps) {
  const [elapsed, setElapsed] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(true)

  // Timer live saat streaming aktif
  useEffect(() => {
    if (!isStreaming) {
      if (startTime && endTime) {
        setElapsed(Math.max(0.1, Number(((endTime - startTime) / 1000).toFixed(1))))
      }
      return
    }

    const start = startTime || Date.now()
    const timer = setInterval(() => {
      setElapsed(Number(((Date.now() - start) / 1000).toFixed(1)))
    }, 100)

    return () => clearInterval(timer)
  }, [isStreaming, startTime, endTime])

  // Saat streaming selesai, tutup accordion otomatis secara anggun bila pengguna belum membukanya
  useEffect(() => {
    if (!isStreaming && thoughts.length > 0) {
      const timeout = setTimeout(() => {
        setIsOpen(false)
      }, 1200)
      return () => clearTimeout(timeout)
    }
  }, [isStreaming, thoughts.length])

  if (thoughts.length === 0 && !isStreaming) {
    return null
  }

  return (
    <div
      className={`rounded-xl border border-[#1E3F30]/15 bg-[#1E3F30]/5 p-3.5 text-xs text-[#2C2A29] transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
            <Image
              src="/mascot/mochi-3d.png"
              alt="Mascot MOCHI"
              width={24}
              height={24}
              className={`h-6 w-6 object-contain ${
                isStreaming ? 'napas' : ''
              }`}
            />
            {isStreaming && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A96E] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1E3F30]" />
              </span>
            )}
          </div>

          <span className="font-medium text-[#1E3F30]">
            {isStreaming ? (
              <span className="flex items-center gap-1.5">
                <span>Sedang menelaah arsip turats...</span>
                <span className="font-mono text-[11px] text-[#7A7672]">{elapsed}s</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#5C5856]">
                <span>Ditelaah selama {elapsed}s</span>
              </span>
            )}
          </span>
        </div>

        {thoughts.length > 0 && !isStreaming && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-[#1E3F30] hover:bg-[#1E3F30]/10 transition-colors"
          >
            <span>{isOpen ? 'Sembunyikan' : 'Lihat pertimbangan'}</span>
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>

      {/* Daftar jejak reasoning langkah-demi-langkah */}
      {(isOpen || isStreaming) && thoughts.length > 0 && (
        <div className="mt-2.5 space-y-1.5 border-t border-[#1E3F30]/10 pt-2 pl-8">
          {thoughts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-[11.5px] leading-relaxed text-[#5C5856]"
            >
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1E3F30]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
