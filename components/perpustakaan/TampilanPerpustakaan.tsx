"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Layers } from "lucide-react";
import KartuMasalah from "./KartuMasalah";
import TumpukanMasalahList from "./TumpukanMasalahList";
import type { VMasalahPublik } from "@/lib/types/database";

interface TampilanPerpustakaanProps {
  items: VMasalahPublik[];
}

export default function TampilanPerpustakaan({ items }: TampilanPerpustakaanProps) {
  const [mode, setMode] = useState<"kartu" | "list">("kartu");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mochi_library_view_mode");
      if (saved === "kartu" || saved === "list") {
        setMode(saved);
      } else if (saved === "rak") {
        // Migrasi preferensi lama "rak" menjadi "list" (tumpukan buku vertikal)
        setMode("list");
      }
    } catch {
      // Abaikan jika localStorage tidak diizinkan
    }
  }, []);

  const handleToggleMode = (newMode: "kartu" | "list") => {
    setMode(newMode);
    try {
      localStorage.setItem("mochi_library_view_mode", newMode);
    } catch {
      // Abaikan
    }
  };

  return (
    <div className="space-y-6">
      {/* BILAH PENGATUR MODE TAMPILAN */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E3DC] bg-white px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Layers className="h-4 w-4 text-[#1E3F30]" />
          <span>Mode Tampilan Hasil:</span>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1 border border-stone-200/80">
          <button
            type="button"
            onClick={() => handleToggleMode("kartu")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              mode === "kartu"
                ? "bg-white text-[#1E3F30] shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Daftar Kartu</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleMode("list")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              mode === "list"
                ? "bg-[#1E3F30] text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span>Tumpukan Kitab (List)</span>
          </button>
        </div>
      </div>

      {/* RENDER SESUAI MODE PILIHAN */}
      {mode === "kartu" ? (
        /* 1. MODE DAFTAR KARTU (GRID 3 KOLOM) */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((m) => (
            <KartuMasalah key={m.id} masalah={m} />
          ))}
        </div>
      ) : (
        /* 2. MODE TAMPILAN LIST (TUMPUKAN KITAB PUTIH VERTIKAL DENGAN EXPAND) */
        <TumpukanMasalahList items={items} />
      )}
    </div>
  );
}
