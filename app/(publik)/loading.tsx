export default function LoadingPublik() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Skeleton Header / Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-4 w-32 rounded-full bg-stone-200" />
        <div className="h-9 w-3/4 rounded-xl bg-stone-200" />
        <div className="h-4 w-1/2 rounded-md bg-stone-100" />
      </div>

      {/* Skeleton Filter / Search Bar */}
      <div className="h-14 w-full rounded-2xl bg-stone-200/80" />

      {/* Skeleton Grid Kartu */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-[#D9D3C3] bg-white p-6 shadow-xs space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-stone-200" />
                <div className="h-4 w-16 rounded bg-stone-100" />
              </div>
              <div className="h-6 w-full rounded-md bg-stone-200" />
              <div className="h-4 w-4/5 rounded bg-stone-100" />
              <div className="h-12 w-full rounded bg-stone-50" />
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-stone-200" />
              <div className="h-3 w-16 rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
