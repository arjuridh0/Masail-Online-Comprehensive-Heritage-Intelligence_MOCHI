export default function LoadingDetailMasalah() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 rounded bg-stone-200 mb-6" />

      {/* Header skeleton */}
      <div className="border-b border-stone-200 pb-8 mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-28 rounded-md bg-stone-300" />
          <div className="h-6 w-20 rounded-md bg-stone-200" />
        </div>
        <div className="h-10 w-4/5 rounded-xl bg-stone-300" />
        <div className="h-4 w-1/2 rounded bg-stone-200" />
        {/* Tasawwur skeleton */}
        <div className="rounded-2xl border border-stone-200 bg-[#FAF8F2] p-6 space-y-3">
          <div className="h-4 w-40 rounded bg-stone-200" />
          <div className="h-4 w-full rounded bg-stone-100" />
          <div className="h-4 w-5/6 rounded bg-stone-100" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-2 border-b border-stone-100 pb-4">
                <div className="h-5 w-24 rounded bg-stone-200" />
                <div className="h-6 w-3/4 rounded bg-stone-300" />
              </div>
              <div className="rounded-xl border border-emerald-100 bg-[#F5F8F6] p-5 space-y-2">
                <div className="h-4 w-32 rounded bg-emerald-200/60" />
                <div className="h-4 w-full rounded bg-emerald-100/50" />
                <div className="h-4 w-4/5 rounded bg-emerald-100/50" />
              </div>
              {/* Kotak Ibarat skeleton */}
              <div className="rounded-xl border border-[#D9D3C3] bg-[#FAF8F2] p-6 space-y-4">
                <div className="h-5 w-48 rounded bg-stone-200" />
                <div className="h-20 w-full rounded bg-white" />
                <div className="h-4 w-3/4 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-36 rounded-xl border border-stone-200 bg-[#FAF8F2]" />
          <div className="h-72 rounded-2xl border border-stone-200 bg-white" />
        </div>
      </div>
    </div>
  )
}
