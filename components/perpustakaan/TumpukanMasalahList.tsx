"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Building2,
  ArrowUpRight,
  ChevronDown,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { VMasalahPublik, TopikEnum } from "@/lib/types/database";

const WARNA_TOPIK: Record<TopikEnum, { bg: string; text: string; border: string }> = {
  ibadah: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", border: "border-[#BFDBFE]" },
  muamalah: { bg: "bg-[#DCFCE7]", text: "text-[#166534]", border: "border-[#BBF7D0]" },
  munakahat: { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]", border: "border-[#E9D5FF]" },
};

interface TumpukanMasalahListProps {
  items: VMasalahPublik[];
}

export default function TumpukanMasalahList({ items }: TumpukanMasalahListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const handleCardClick = (m: VMasalahPublik) => {
    // Di layar sentuh/mobile:
    // Jika belum expand -> buka expand (klik 1x)
    // Jika sudah expand -> navigasi ke detail (klik 2x)
    const isMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    if (isMobile) {
      if (expandedId === m.id) {
        router.push(`/masalah/${m.slug}`);
      } else {
        setExpandedId(m.id);
      }
    } else {
      // Desktop: klik langsung navigasi (hover sudah menangani expand)
      router.push(`/masalah/${m.slug}`);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((m, idx) => {
        const isExpanded = expandedId === m.id;
        const tahunMasehi = m.tanggal_mulai
          ? new Date(m.tanggal_mulai).getFullYear()
          : "";

        return (
          <article
            key={m.id}
            onMouseEnter={() => setExpandedId(m.id)}
            onClick={() => handleCardClick(m)}
            className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 cursor-pointer shadow-2xs ${
              isExpanded
                ? "border-[#1E3F30] shadow-md ring-1 ring-[#1E3F30]/15"
                : "border-[#E5E3DC] hover:border-stone-400 hover:shadow-xs"
            }`}
          >
            {/* Aksen Punggung Kitab Tipis di Sisi Kiri (Spine Accent) */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                isExpanded ? "bg-[#1E3F30]" : "bg-stone-200 group-hover:bg-[#C9A96E]"
              }`}
            />

            <div className="p-4 sm:p-5 pl-5 sm:pl-6">
              {/* BARIS UTAMA (SELALU TERLIHAT) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="flex-1 min-w-0">
                  {/* Badges Metadata & Kode */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-stone-500">
                      {m.kode || `MCH-2024-${String(idx + 1).padStart(4, "0")}`}
                    </span>

                    {tahunMasehi && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-stone-700">
                        <Calendar className="h-3 w-3 text-stone-400" />
                        <span>{tahunMasehi} M</span>
                      </span>
                    )}

                    {m.topik?.map((t) => {
                      const style = WARNA_TOPIK[t] || {
                        bg: "bg-stone-100",
                        text: "text-stone-700",
                        border: "border-stone-200",
                      };
                      return (
                        <span
                          key={t}
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold capitalize ${style.bg} ${style.text} ${style.border}`}
                        >
                          {t}
                        </span>
                      );
                    })}

                    {m.corak && (
                      <span className="inline-flex items-center rounded-md border border-[#C9A96E]/40 bg-[#C9A96E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#8C6D32] capitalize">
                        {m.corak}
                      </span>
                    )}
                  </div>

                  {/* Judul Keputusan */}
                  <h3
                    className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                      isExpanded
                        ? "text-[#1E3F30]"
                        : "text-stone-900 group-hover:text-[#1E3F30]"
                    }`}
                  >
                    {m.judul}
                  </h3>

                  {/* Lembaga Penyelenggara Singkat */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-600">
                    <Building2 className="h-3.5 w-3.5 text-[#5B7B69] shrink-0" />
                    <span className="font-medium truncate">{m.lembaga_nama}</span>
                  </div>
                </div>

                {/* Tombol Indikator Status Expand */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] text-stone-400 block">
                      {isExpanded ? "Keputusan Terbuka" : "Arahkan kursor / klik"}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-700">
                      #{idx + 1}
                    </span>
                  </div>

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                      isExpanded
                        ? "bg-[#1E3F30] text-white border-[#1E3F30] rotate-180"
                        : "bg-stone-50 text-stone-500 border-stone-200 group-hover:border-stone-400"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* KONTEN EXPAND (MEKAR SECARA VERTIKAL MIRIP RAK KITAB) */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`expand-${m.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-stone-100/90 space-y-3">
                      {/* Deskripsi Masalah / As'ilah */}
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {m.deskripsi ||
                          "Rumusan musyawarah bahtsul masail memuat diktum keputusan hukum fikih berdasarkan dalil dan ibarat kitab turats mu'tabarah."}
                      </p>

                      {/* Info Forum & Detail Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                          {m.forum_nama && (
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-stone-400" />
                              <span className="font-medium text-stone-700">
                                {m.forum_nama}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                            <Layers className="h-3 w-3 text-[#C9A96E]" />
                            <span>Sanad Terverifikasi</span>
                          </div>
                        </div>

                        {/* Tombol Aksi Buka Keputusan */}
                        <Link
                          href={`/masalah/${m.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#2D5A46] active:scale-98 transition-all"
                        >
                          <span>Buka Keputusan Lengkap</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </article>
        );
      })}
    </div>
  );
}
