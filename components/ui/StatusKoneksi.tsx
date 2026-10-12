"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { WifiOff, Wifi } from 'lucide-react'

export function StatusKoneksi() {
  const [isOffline, setIsOffline] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 3000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowReconnected(false)
    }

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline && !showReconnected) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {isOffline ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50/95 p-3.5 shadow-lg backdrop-blur-md">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/mascot/mochi-3d.png"
              alt="MOCHI Offline"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-xs text-amber-900 leading-tight">
            <div className="flex items-center gap-1 font-bold">
              <WifiOff className="h-3.5 w-3.5 text-amber-700" />
              <span>Koneksi Terputus</span>
            </div>
            <p className="mt-0.5 text-amber-800 text-[11px]">
              Menampilkan arsip dari cache perangkat.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <Wifi className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-bold text-emerald-900">
            Koneksi internet kembali terhubung
          </span>
        </div>
      )}
    </div>
  )
}
