"use client"

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function BilahProgresNavigasi() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progres, setProgres] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Ketika rute berubah, selesaikan progres bar ke 100% lalu sembunyikan
  useEffect(() => {
    if (progres !== null) {
      setProgres(100)
      const timer = setTimeout(() => {
        setProgres(null)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // Tangkap klik pada seluruh anchor link internal untuk umpan balik instan
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return
      }

      // Pastikan tautan internal
      const isInternal = href.startsWith('/') || href.startsWith(window.location.origin)
      if (isInternal) {
        // Mulai animasi bilah progres seketika
        if (timerRef.current) clearInterval(timerRef.current)
        setProgres(20)

        timerRef.current = setTimeout(() => {
          setProgres(65)
          timerRef.current = setTimeout(() => {
            setProgres(85)
          }, 400)
        }, 150)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (progres === null) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] h-1 pointer-events-none transition-all duration-200 ease-out"
      style={{
        width: `${progres}%`,
        background: 'linear-gradient(90deg, #1E3F30 0%, #2D6A4F 60%, #C9A96E 100%)',
        boxShadow: '0 0 10px rgba(201, 169, 110, 0.7)',
        opacity: progres === 100 ? 0 : 1,
      }}
    />
  )
}

export default BilahProgresNavigasi

