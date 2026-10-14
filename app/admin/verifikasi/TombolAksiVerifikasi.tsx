"use client"

import { useState, useTransition } from 'react'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { verifikasiAction } from '@/app/admin/actions'
import { toast } from '@/components/ui/SwipeToast'

export function TombolAksiVerifikasi({ lembagaId }: { lembagaId: string }) {
  const [isPending, startTransition] = useTransition()
  const [alasan, setAlasan] = useState('')
  const [showTolakInput, setShowTolakInput] = useState(false)

  const handleSetujui = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('lembaga_id', lembagaId)
      formData.set('status', 'terverifikasi')
      const res = await verifikasiAction(formData)
      if (res?.success) {
        toast.success(res.message || 'Lembaga berhasil disetujui.')
      } else if (res?.error) {
        toast.error(res.error)
      }
    })
  }

  const handleTolak = (e: React.FormEvent) => {
    e.preventDefault()
    if (!alasan.trim() || alasan.trim().length < 5) {
      toast.error('Alasan penolakan minimal 5 karakter.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('lembaga_id', lembagaId)
      formData.set('status', 'ditolak')
      formData.set('alasan', alasan.trim())
      const res = await verifikasiAction(formData)
      if (res?.success) {
        toast.success(res.message || 'Permohonan ditolak.')
      } else if (res?.error) {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
      {/* Tombol Setujui */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSetujui}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>Setujui Lembaga</span>
          </>
        )}
      </button>

      {/* Kontrol Penolakan */}
      {!showTolakInput ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowTolakInput(true)}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
        >
          <XCircle className="h-4 w-4" />
          <span>Tolak...</span>
        </button>
      ) : (
        <form onSubmit={handleTolak} className="flex items-center gap-2">
          <input
            type="text"
            required
            autoFocus
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Alasan penolakan resmi..."
            className="rounded-xl border border-rose-300 px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-rose-600 w-56 sm:w-64"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-800 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Kirim'}
          </button>
          <button
            type="button"
            onClick={() => setShowTolakInput(false)}
            className="text-xs text-stone-500 hover:text-stone-800 px-1"
          >
            Batal
          </button>
        </form>
      )}
    </div>
  )
}
