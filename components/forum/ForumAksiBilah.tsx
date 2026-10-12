"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit3, ExternalLink, Trash2, Undo2 } from 'lucide-react'
import { FuseButton } from '@/components/ui/FuseButton'
import { SwipeToast } from '@/components/ui/SwipeToast'
import { tarikForumAction, hapusForumAction } from '@/app/dasbor/forum/actions'

export interface ForumAksiBilahProps {
  forumId: string
  slug: string
  status: 'draf' | 'terbit'
}

export function ForumAksiBilah({
  forumId,
  slug,
  status,
}: ForumAksiBilahProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastVariant, setToastVariant] = useState<'success' | 'warning' | 'error'>('success')

  const handleTarik = async () => {
    const res = await tarikForumAction(forumId)
    if (res.success) {
      setToastVariant('warning')
      setToastMessage(res.message || null)
    } else {
      setToastVariant('error')
      setToastMessage(res.error || 'Gagal menarik forum')
    }
  }

  const handleHapus = async () => {
    const res = await hapusForumAction(forumId)
    if (res.success) {
      setToastVariant('success')
      setToastMessage(res.message || null)
    } else {
      setToastVariant('error')
      setToastMessage(res.error || 'Gagal menghapus forum')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100">
      {toastMessage && (
        <SwipeToast
          message={toastMessage}
          variant={toastVariant}
          durationMs={4000}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Edit di Wizard */}
      <Link
        href={`/dasbor/forum/${forumId}/edit`}
        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
      >
        <Edit3 className="h-3.5 w-3.5 text-stone-500" />
        <span>{status === 'draf' ? 'Lanjutkan Edit' : 'Edit Forum'}</span>
      </Link>

      {/* Pratinjau Publik jika sudah terbit */}
      {status === 'terbit' && (
        <Link
          href={`/forum/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 text-stone-500" />
          <span>Lihat Publik</span>
        </Link>
      )}

      {/* Tarik kembali ke draf jika terbit */}
      {status === 'terbit' && (
        <FuseButton
          label="Tarik ke Draf"
          fuseLabel="Batalkan Tarik"
          durationSeconds={3}
          variant="warning"
          icon={<Undo2 className="h-3.5 w-3.5" />}
          onComplete={handleTarik}
          className="py-1.5 px-3 text-xs"
        />
      )}

      {/* Hapus forum */}
      <FuseButton
        label="Hapus"
        fuseLabel="Batalkan Hapus"
        durationSeconds={5}
        variant="danger"
        icon={<Trash2 className="h-3.5 w-3.5" />}
        onComplete={handleHapus}
        className="py-1.5 px-3 text-xs ml-auto"
      />
    </div>
  )
}