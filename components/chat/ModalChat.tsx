"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { X, Maximize2 } from 'lucide-react'
import { MochiMascot } from '@/components/mochi/MochiMascot'
import { ChatContainer } from './ChatContainer'

interface ModalChatProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalChat({ isOpen, onClose }: ModalChatProps) {
  // Tutup dengan Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-chat-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none"
    >
      {/* Backdrop overlay: menutup modal saat klik di luar (mobile & desktop) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity pointer-events-auto"
      />

      {/* Kontainer Modal Chat */}
      <div className="relative w-full sm:w-[460px] h-[85vh] sm:h-[620px] max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl border border-[#D9D7CE] bg-[#F4F3EE] shadow-2xl overflow-hidden pointer-events-auto transition-transform z-10">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#1E3F30]/20 bg-[#1E3F30] px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <MochiMascot size={32} state="idle" className="h-8 w-8" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 id="modal-chat-title" className="text-sm font-bold text-white">
                  Tanya MOCHI
                </h2>
                <span className="rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/50 px-1.5 py-0.2 text-[9px] font-semibold text-[#C9A96E]">
                  RAG Turats
                </span>
              </div>
              <p className="text-[10px] text-white/70">
                Pencarian berbasis sanad bahtsul masail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/tanya"
              onClick={onClose}
              title="Buka Halaman Penuh"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Tanya MOCHI"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Isi Chat */}
        <div className="flex-1 min-h-0 bg-[#F4F3EE] flex flex-col overflow-hidden">
          <ChatContainer compact />
        </div>
      </div>
    </div>
  )
}
