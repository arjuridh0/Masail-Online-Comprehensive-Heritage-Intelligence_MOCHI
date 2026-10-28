import { LoadingMochi } from '@/components/ui/LoadingMochi'

export default function LoadingAdmin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <LoadingMochi pesan="Menyiapkan data konsol admin..." ukuran="sm" />

      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-stone-200" />
          <div className="h-8 w-60 rounded-xl bg-stone-300" />
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="h-5 w-40 rounded bg-stone-200" />
            <div className="h-8 w-32 rounded-lg bg-stone-200" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 w-full rounded-xl border border-stone-100 bg-stone-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
