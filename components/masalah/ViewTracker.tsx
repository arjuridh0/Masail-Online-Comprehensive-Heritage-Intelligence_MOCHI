"use client"

import { useEffect } from 'react'

interface ViewTrackerProps {
  targetId: string
  jenis: 'masalah' | 'forum'
}

export function ViewTracker({ targetId, jenis }: ViewTrackerProps) {
  useEffect(() => {
    try {
      fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetId, jenis }),
      }).catch(() => {
        // Abaikan error background view tracking
      })
    } catch {
      // Abaikan error
    }
  }, [targetId, jenis])

  return null
}
