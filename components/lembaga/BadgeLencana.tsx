import React from 'react'
import { Sparkles, Flame, CalendarCheck, Eye, ShieldCheck } from 'lucide-react'
import type { InfoLencana } from '@/lib/skor'

const ICON_MAP = {
  Sparkles,
  Flame,
  CalendarCheck,
  Eye,
  ShieldCheck,
}

interface BadgeLencanaProps {
  lencana: InfoLencana
  size?: 'sm' | 'md'
  showDescription?: boolean
}

export function BadgeLencana({
  lencana,
  size = 'sm',
  showDescription = false,
}: BadgeLencanaProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (ICON_MAP as any)[lencana.ikon] || Sparkles

  return (
    <span
      title={lencana.deskripsi}
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight transition-all ${
        lencana.warna
      } ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : 'px-2.5 py-1 text-xs'
      }`}
    >
      <IconComponent className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{lencana.label}</span>
      {showDescription && (
        <span className="text-[10px] font-normal opacity-80">({lencana.deskripsi})</span>
      )}
    </span>
  )
}
