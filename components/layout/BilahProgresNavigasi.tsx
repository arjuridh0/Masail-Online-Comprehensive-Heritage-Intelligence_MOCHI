"use client"

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function BilahProgresNavigasi() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [progres, setProgres] = useState<number>(0)
  const [aktif, setAktif] = useState<boolean>(false)
  const [memudar, setMemudar] = useState<boolean>(false)

  const timersRef = useRef<NodeJS.Timeout[]>([])

  const bersihkanSemuaTimer = () => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }

  // Selesaikan animasi ke 100% full saat rute berganti (pathname/searchParams berubah)
  useEffect(() => {
    if (!aktif) return

    bersihkanSemuaTimer()

    // 1. Geser bilah sampai 100% penuh ke ujung kanan layar
    setProgres(100)

    // 2. Beri waktu 250ms agar mata pengguna melihat bilah mencapai ujung kanan 100%
    const timerFade = setTimeout(() => {
      setMemudar(true)

      // 3. Setelah memudar secara halus (300ms), matikan dan reset posisi
      const timerSelesai = setTimeout(() => {
        setAktif(false)
        setMemudar(false)
        setProgres(0)
      }, 300)
      timersRef.current.push(timerSelesai)
    }, 250)

    timersRef.current.push(timerFade)

    return () => bersihkanSemuaTimer()
  }, [pathname, searchParams])

  // Tangkap klik anchor internal dan popstate untuk umpan balik instan
  useEffect(() => {
    const handleMulai = (isSameRoute = false) => {
      bersihkanSemuaTimer()
      setMemudar(false)
      setAktif(true)
      setProgres(25)

      if (isSameRoute) {
        // Jika rute sama, langsung selesaikan ke 100% agar tidak macet
        const t = setTimeout(() => {
          setProgres(100)
          const tf = setTimeout(() => {
            setMemudar(true)
            setTimeout(() => {
              setAktif(false)
              setMemudar(false)
              setProgres(0)
            }, 300)
          }, 200)
          timersRef.current.push(tf)
        }, 150)
        timersRef.current.push(t)
        return
      }

      // Trickle progress bertahap (25% -> 55% -> 75% -> 88%)
      const t1 = setTimeout(() => setProgres(55), 180)
      const t2 = setTimeout(() => setProgres(75), 450)
      const t3 = setTimeout(() => setProgres(88), 900)

      // Safety timeout: jika dalam 4.5 detik tidak ada navigasi, selesaikan otomatis
      const tSafety = setTimeout(() => {
        setProgres(100)
        const tf = setTimeout(() => {
          setMemudar(true)
          setTimeout(() => {
            setAktif(false)
            setMemudar(false)
            setProgres(0)
          }, 300)
        }, 200)
        timersRef.current.push(tf)
      }, 4500)

      timersRef.current.push(t1, t2, t3, tSafety)
    }

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
        const currentPath = window.location.pathname + window.location.search
        const isSame = href === currentPath
        handleMulai(isSame)
      }
    }

    const handlePopState = () => {
      handleMulai(false)
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('popstate', handlePopState)
      bersihkanSemuaTimer()
    }
  }, [])

  if (!aktif) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[999999] h-[3px] pointer-events-none transition-all duration-300 ease-out"
      style={{
        width: `${progres}%`,
        background: 'linear-gradient(90deg, #1E3F30 0%, #2D6A4F 60%, #C9A96E 100%)',
        boxShadow: '0 0 12px rgba(201, 169, 110, 0.85), 0 0 4px rgba(30, 63, 48, 0.5)',
        opacity: memudar ? 0 : 1,
      }}
    />
  )
}

export default BilahProgresNavigasi
