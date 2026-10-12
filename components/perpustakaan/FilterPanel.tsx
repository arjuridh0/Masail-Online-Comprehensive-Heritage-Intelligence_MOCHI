"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";

interface LembagaOption {
  slug: string;
  nama: string;
}

interface FilterPanelProps {
  lembagaOptions: LembagaOption[];
  tahunOptions: string[];
}

export default function FilterPanel({
  lembagaOptions,
  tahunOptions,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTopik = searchParams.get("topik") || "semua";
  const currentLembaga = searchParams.get("lembaga") || "semua";
  const currentTahun = searchParams.get("tahun") || "semua";
  const currentCorak = searchParams.get("corak") || "semua";
  const currentUrutan = searchParams.get("urutan") || "terbaru";

  const hasActiveFilters =
    searchParams.has("topik") ||
    searchParams.has("lembaga") ||
    searchParams.has("tahun") ||
    searchParams.has("corak") ||
    searchParams.has("urutan");

  const [bukaMobile, setBukaMobile] = useState(hasActiveFilters);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "semua") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // reset page

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <aside className="rounded-2xl border border-[#E5E3DC] bg-white p-3.5 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setBukaMobile((prev) => !prev)}
          className="flex flex-1 items-center justify-between text-xs font-bold text-[#1E3F30] lg:cursor-default"
          aria-expanded={bukaMobile}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Penelusuran</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-[#1E3F30] px-1.5 py-0.2 text-[9px] font-bold text-white">
                Aktif
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-stone-400 transition-transform duration-200 lg:hidden ${
              bukaMobile ? "rotate-180" : ""
            }`}
          />
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div
        className={`mt-3 space-y-3.5 border-t border-stone-100 pt-3 text-xs ${
          bukaMobile ? "block" : "hidden"
        } lg:block`}
      >
        {/* Filter 1: Topik Masail */}
        <div>
          <label className="block text-[11px] font-bold text-stone-800 mb-1.5">
            Topik Fiqih
          </label>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: "semua", label: "Semua Topik" },
              { id: "ibadah", label: "Ibadah" },
              { id: "muamalah", label: "Muamalah" },
              { id: "munakahat", label: "Munakahat" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateFilter("topik", t.id)}
                className={`flex items-center justify-center rounded-lg px-2 py-1.5 text-center text-[11px] font-medium transition-all ${
                  currentTopik === t.id
                    ? "bg-[#1E3F30] font-bold text-white shadow-xs"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter 2: Lembaga Penyelenggara */}
        <div>
          <label htmlFor="filter-lembaga" className="block text-[11px] font-bold text-stone-800 mb-1">
            Lembaga / Pesantren
          </label>
          <select
            id="filter-lembaga"
            value={currentLembaga}
            onChange={(e) => updateFilter("lembaga", e.target.value)}
            className="w-full rounded-lg border border-[#E5E3DC] bg-stone-50/60 px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:border-[#1E3F30] focus:outline-none"
          >
            <option value="semua">Semua Lembaga</option>
            {lembagaOptions.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Tahun Forum */}
        <div>
          <label htmlFor="filter-tahun" className="block text-[11px] font-bold text-stone-800 mb-1">
            Tahun Penyelenggaraan
          </label>
          <select
            id="filter-tahun"
            value={currentTahun}
            onChange={(e) => updateFilter("tahun", e.target.value)}
            className="w-full rounded-lg border border-[#E5E3DC] bg-stone-50/60 px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:border-[#1E3F30] focus:outline-none"
          >
            <option value="semua">Semua Tahun</option>
            {tahunOptions.map((th) => (
              <option key={th} value={th}>
                Tahun {th} M
              </option>
            ))}
          </select>
        </div>

        {/* Filter 4: Corak Masail */}
        <div>
          <label htmlFor="filter-corak" className="block text-[11px] font-bold text-stone-800 mb-1">
            Corak Bahtsul Masail
          </label>
          <select
            id="filter-corak"
            value={currentCorak}
            onChange={(e) => updateFilter("corak", e.target.value)}
            className="w-full rounded-lg border border-[#E5E3DC] bg-stone-50/60 px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:border-[#1E3F30] focus:outline-none"
          >
            <option value="semua">Semua Corak</option>
            <option value="waqiiyyah">Masail Waqi&apos;iyyah (Kasus Aktual)</option>
            <option value="maudhuiyyah">Masail Maudhu&apos;iyyah (Tematik Konseptual)</option>
            <option value="qanuniyyah">Masail Qanuniyyah (Perundang-undangan)</option>
          </select>
        </div>

        {/* Filter 5: Urutan */}
        <div>
          <label htmlFor="filter-urutan" className="block text-[11px] font-bold text-stone-800 mb-1">
            Urutan Penampilan
          </label>
          <select
            id="filter-urutan"
            value={currentUrutan}
            onChange={(e) => updateFilter("urutan", e.target.value)}
            className="w-full rounded-lg border border-[#E5E3DC] bg-stone-50/60 px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:border-[#1E3F30] focus:outline-none"
          >
            <option value="terbaru">Terbaru Ditashih</option>
            <option value="terlama">Arsip Terlama</option>
            <option value="populer">Paling Sering Dibaca</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
