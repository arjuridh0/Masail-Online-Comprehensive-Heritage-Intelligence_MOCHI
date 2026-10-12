import { Award, Info } from 'lucide-react'

export function BannerDemo() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (!isDemo) return null

  return (
    <div className="bg-[#1E3F30] text-[#F4F3EE] px-4 py-2 text-xs border-b border-[#C9A96E]/40">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A96E] text-[#1E3F30] font-bold">
            <Award className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium">
            <strong className="font-bold text-[#C9A96E]">SANTRIVISION 2026:</strong> Prototipe Penilaian Lomba Inovasi Digital Pesantren (Ditjen Pendis Kemenag RI)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-stone-300">
          <Info className="h-3.5 w-3.5 text-[#C9A96E]" />
          <span>Arsip Masail Resmi &bull; Noindex Aktif</span>
        </div>
      </div>
    </div>
  )
}
