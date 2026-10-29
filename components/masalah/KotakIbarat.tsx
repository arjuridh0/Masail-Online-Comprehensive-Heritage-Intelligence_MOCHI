"use client"

import { BookOpen, Copy, BookCheck } from 'lucide-react'
import { FuseButton } from '@/components/ui/FuseButton'
import { toast } from '@/components/ui/SwipeToast'

export interface RujukanItem {
  id: string
  kitab_latin: string
  kitab_arab?: string | null
  pengarang?: string | null
  juz?: string | null
  halaman?: string | null
  teks_arab?: string | null
  terjemah?: string | null
  urutan: number
}

interface KotakIbaratProps {
  rujukan: RujukanItem
  fontSizeClass?: string
}

export function KotakIbarat({ rujukan, fontSizeClass = 'text-2xl sm:text-3xl' }: KotakIbaratProps) {
  const handleCopy = async () => {
    try {
      const teksKutipan = `[Ibarat: ${rujukan.kitab_latin}${
        rujukan.juz || rujukan.halaman ? ` (${rujukan.juz ? `Juz ${rujukan.juz}` : ''}${rujukan.juz && rujukan.halaman ? ', ' : ''}${rujukan.halaman ? `Hal. ${rujukan.halaman}` : ''})` : ''
      }]\n\n${rujukan.teks_arab || ''}\n\nTerjemah:\n"${rujukan.terjemah || ''}"`

      await navigator.clipboard.writeText(teksKutipan)
      toast.success("Kutipan ibarat berhasil disalin ke papan klip")
    } catch {
      toast.error("Gagal menyalin teks")
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#D9D3C3] bg-[#FAF8F2] shadow-sm transition-all hover:border-[#C9A96E]">
      {/* Header Rujukan Kitab */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D2] bg-[#F2EDE0] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#8C733E]" />
          <span className="font-semibold text-[#1E3F30]">
            {rujukan.kitab_latin}
          </span>
          {rujukan.kitab_arab && (
            <span className="font-serif text-sm font-medium text-[#8C733E] dir-rtl">
              ({rujukan.kitab_arab})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600">
          {rujukan.pengarang && (
            <span className="hidden sm:inline">Karya: {rujukan.pengarang}</span>
          )}
          {(rujukan.juz || rujukan.halaman) && (
            <span className="rounded bg-[#E5DDC9] px-2 py-0.5 font-medium text-stone-800">
              {rujukan.juz ? `Juz ${rujukan.juz}` : ''}
              {rujukan.juz && rujukan.halaman ? ', ' : ''}
              {rujukan.halaman ? `Hlm. ${rujukan.halaman}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Konten Ibarat Teks Arab & Terjemahan */}
      <div className="p-3.5 sm:p-6 space-y-4">
        {rujukan.teks_arab && (
          <div className="relative rounded-lg bg-[#FFFDF9] p-3.5 sm:p-5 border border-[#EBE4D5] overflow-x-auto">
            <p
              dir="rtl"
              lang="ar"
              className={`font-serif leading-[2.2] tracking-wide text-stone-900 text-right break-words ${fontSizeClass}`}
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            >
              {rujukan.teks_arab}
            </p>
          </div>
        )}

        {rujukan.terjemah && (
          <div className="border-t border-dashed border-[#DDD6C5] pt-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-500">
              Terjemahan Makna:
            </span>
            <p className="mt-1 text-sm leading-relaxed text-stone-700 italic">
              &ldquo;{rujukan.terjemah}&rdquo;
            </p>
          </div>
        )}

        {/* Tombol Aksi Ibarat: Usulkan Tashih & Salin */}
        <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-mochi-tashih', {
                  detail: {
                    rujukanId: rujukan.id,
                    kitabNama: rujukan.kitab_latin,
                    teksArab: rujukan.teks_arab || '',
                  },
                })
              )
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#D9D3C3] bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-[#FAF8F2] hover:text-[#1E3F30] hover:border-[#8C733E] transition-colors cursor-pointer"
            title="Usulkan perbaikan harakat atau teks ibarat ini ke dewan pentashih"
          >
            <BookCheck className="h-4 w-4 text-[#8C733E]" />
            <span>Usulkan Tashih</span>
          </button>

          <FuseButton
            label="Salin Ibarat & Terjemah"
            fuseLabel="Tersalin ke Clipboard!"
            duration={2000}
            onConfirm={handleCopy}
            variant="secondary"
            icon={<Copy className="h-3.5 w-3.5 text-stone-500" />}
            className="min-h-[44px] px-4 touch-manipulation"
          />
        </div>
      </div>
    </div>
  )
}
