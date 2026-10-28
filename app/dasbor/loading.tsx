import { LoadingMochi } from '@/components/ui/LoadingMochi'

export default function LoadingDasbor() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <LoadingMochi pesan="Menyiapkan dasbor lembaga..." ukuran="sm" />

      <div className="space-y-6 animate-pulse">
        {/* Sapaan Pengelola Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-stone-200" />
            <div className="h-8 w-64 rounded-xl bg-stone-300" />
          </div>
          <div className="h-10 w-44 rounded-xl bg-stone-300" />
        </div>

        {/* Grid Statistik Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3"
            >
              <div className="h-3 w-24 rounded bg-stone-200" />
              <div className="h-8 w-16 rounded bg-stone-300" />
              <div className="h-3 w-32 rounded bg-stone-100" />
            </div>
          ))}
        </div>

        {/* Tabel / List Forum Skeleton */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-stone-300" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full rounded-xl border border-stone-100 bg-stone-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
