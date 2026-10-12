"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List, Building2 } from "lucide-react";
import { KartuLembaga, type LembagaCardData } from "./KartuLembaga";
import { BarisLembagaList } from "./BarisLembagaList";

interface TampilanDirektoriLembagaProps {
  items: LembagaCardData[];
}

export function TampilanDirektoriLembaga({ items }: TampilanDirektoriLembagaProps) {
  const [mode, setMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mochi_lembaga_view_mode");
      if (saved === "grid" || saved === "list") {
        setMode(saved);
      }
    } catch {
      // Abaikan jika localStorage tidak diakses
    }
  }, []);

  const handleToggle = (newMode: "grid" | "list") => {
    setMode(newMode);
    try {
      localStorage.setItem("mochi_lembaga_view_mode", newMode);
    } catch {
      // Abaikan
    }
  };

  return (
    <div>
      {/* Switcher Mode Tampilan: Grid vs List */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC]/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1E3F30]">
            {items.length} Lembaga &amp; Pesantren Terdaftar
          </span>
          <span className="text-stone-400 text-xs">&bull;</span>
          <span className="text-xs text-stone-500">
            {mode === "grid" ? "Tampilan Kartu Kotak" : "Tampilan Daftar Baris"}
          </span>
        </div>

        {/* Tombol Pilihan Switcher Pill */}
        <div className="flex items-center gap-1 rounded-xl border border-[#D9D7CE] bg-[#FAF8F5] p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle("grid")}
            data-testid="toggle-mode-grid"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              mode === "grid"
                ? "bg-[#1E3F30] text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/80"
            }`}
            title="Tampilan Kartu Kotak (Grid)"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kartu</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggle("list")}
            data-testid="toggle-mode-list"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              mode === "list"
                ? "bg-[#1E3F30] text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/80"
            }`}
            title="Tampilan Daftar Baris (List)"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Daftar Baris</span>
          </button>
        </div>
      </div>

      {/* Konten Direktori */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-[#D9D3C3] bg-[#FAF8F2] p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-stone-400 mb-3" />
          <h3 className="text-lg font-bold text-stone-900">
            Tidak ada pesantren atau lembaga yang cocok
          </h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter jenis dan provinsi di atas.
          </p>
        </div>
      ) : mode === "grid" ? (
        <div
          data-testid="wadah-lembaga-grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200"
        >
          {items.map((lembaga) => (
            <KartuLembaga key={lembaga.id} lembaga={lembaga} />
          ))}
        </div>
      ) : (
        <div
          data-testid="wadah-lembaga-list"
          className="flex flex-col gap-3.5 transition-opacity duration-200"
        >
          {items.map((lembaga) => (
            <BarisLembagaList key={lembaga.id} lembaga={lembaga} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TampilanDirektoriLembaga;
