"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Search,
  X,
  BookOpen,
  Scale,
  Users,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

interface RekomendasiPerpus {
  id: string;
  label: string;
  topik: "ibadah" | "muamalah" | "munakahat";
  topikLabel: string;
  kode: string;
  tahun: string;
}

const REKOMENDASI_PERPUS: RekomendasiPerpus[] = [
  {
    id: "1",
    label: "Status Hukum Aset Kripto (Cryptocurrency)",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2023-0001",
    tahun: "2023",
  },
  {
    id: "2",
    label: "Keabsahan Akad Dropship dengan Model Wakalah bil Ujrah",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2024-0001",
    tahun: "2024",
  },
  {
    id: "3",
    label: "Ijab Kabul Pernikahan via Video Call dan Teleconference",
    topik: "munakahat",
    topikLabel: "Munakahat",
    kode: "MCH-2024-0003",
    tahun: "2024",
  },
  {
    id: "4",
    label: "Penggunaan Vaksin yang Mengandung Enzim Tripsin Babi",
    topik: "ibadah",
    topikLabel: "Ibadah",
    kode: "MCH-2024-0004",
    tahun: "2024",
  },
  {
    id: "5",
    label: "Hukum Test Deoxyribo Nucleic Acid (DNA)",
    topik: "munakahat",
    topikLabel: "Munakahat",
    kode: "MCH-2004-0001",
    tahun: "2004",
  },
  {
    id: "6",
    label: "Skema Transaksi Paylater dan Denda Keterlambatan",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2023-0003",
    tahun: "2023",
  },
  {
    id: "7",
    label: "Pemanfaatan Daging Kurban dalam Bentuk Olahan Kornet / Kalengan",
    topik: "ibadah",
    topikLabel: "Ibadah",
    kode: "MCH-2024-0002",
    tahun: "2024",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, height: 0, scale: 0.98 },
  show: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      height: { duration: 0.28 },
      staggerChildren: 0.04,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.98,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.15 },
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15 },
  },
};

export default function SearchBar({
  defaultValue = "",
  placeholder = "Cari as'ilah (misal: zakat kripto, akad dropship, tes DNA, MCH-2024)...",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const [q, setQ] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Sync defaultValue jika berubah dari luar (misal URL params)
  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  // Keyboard shortcut: Tekan '/' untuk langsung fokus ke bilah pencarian
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Klik di luar dan tombol Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const submitSearch = (queryVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = queryVal.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    setIsFocused(false);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch(q);
  };

  const handleClear = () => {
    setQ("");
    submitSearch("");
    inputRef.current?.focus();
  };

  const pilihRekomendasi = (item: RekomendasiPerpus) => {
    setQ(item.label);
    submitSearch(item.label);
  };

  const terfilter = q.trim()
    ? REKOMENDASI_PERPUS.filter((item) => {
        const queryLower = q.toLowerCase();
        return (
          item.label.toLowerCase().includes(queryLower) ||
          item.topikLabel.toLowerCase().includes(queryLower) ||
          item.kode.toLowerCase().includes(queryLower)
        );
      })
    : REKOMENDASI_PERPUS.slice(0, 5);

  const getTopicIcon = (topik: string) => {
    if (topik === "ibadah") return <BookOpen className="h-3.5 w-3.5 text-emerald-700" />;
    if (topik === "munakahat") return <Users className="h-3.5 w-3.5 text-rose-700" />;
    return <Scale className="h-3.5 w-3.5 text-amber-700" />;
  };

  const getTopicBadgeStyle = (topik: string) => {
    if (topik === "ibadah") return "bg-emerald-50 text-emerald-800 border-emerald-200/60";
    if (topik === "munakahat") return "bg-rose-50 text-rose-800 border-rose-200/60";
    return "bg-amber-50 text-amber-800 border-amber-200/60";
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center rounded-2xl border border-[#E5E3DC] bg-white p-1.5 shadow-[0_4px_20px_rgba(30,63,48,0.06)] focus-within:border-[#1E3F30] focus-within:ring-2 focus-within:ring-[#1E3F30]/15 transition-all">
        <div className="flex flex-1 items-center gap-3 px-3.5 py-1.5">
          <Search
            className={`h-5 w-5 shrink-0 transition-colors ${
              isFocused ? "text-[#1E3F30]" : "text-stone-400"
            }`}
          />
          <input
            ref={inputRef}
            name="q"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              title="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 pr-2">
          <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-stone-400">
            /
          </kbd>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2D5A46] active:scale-[0.98] transition-all shrink-0"
        >
          <Search className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Cari Keputusan</span>
        </button>
      </div>

      {/* ActionSearchBar Animated Recommendation Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-2.5 overflow-hidden rounded-2xl border border-[#E5E3DC] bg-white p-2.5 shadow-[0_24px_56px_rgba(30,63,48,0.16)] ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#C9A96E]" />
                {q.trim() ? "Saran As'ilah Sesuai Ketikan" : "Sering Dicari di Perpustakaan"}
              </span>
              <span className="text-[10px] text-stone-400 font-normal">
                {q.trim() ? `${terfilter.length} saran` : "Pilih cepat"}
              </span>
            </div>

            {/* List */}
            <motion.ul className="mt-1 space-y-1">
              {terfilter.length > 0 ? (
                terfilter.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    layout
                    onClick={() => pilihRekomendasi(item)}
                    className="group/item flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 group-hover/item:bg-white group-hover/item:shadow-xs transition-colors">
                        {getTopicIcon(item.topik)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-stone-900 group-hover/item:text-[#1E3F30] transition-colors">
                          {item.label}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                          <span
                            className={`rounded-full border px-1.5 py-0.2 font-medium ${getTopicBadgeStyle(
                              item.topik
                            )}`}
                          >
                            {item.topikLabel}
                          </span>
                          <span>•</span>
                          <span>{item.kode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 pl-2">
                      <span className="hidden text-[11px] text-stone-400 sm:inline">
                        {item.tahun} M
                      </span>
                      <CornerDownLeft className="h-3.5 w-3.5 text-stone-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  variants={itemVariants}
                  onClick={() => submitSearch(q)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-xs text-stone-700 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-[#1E3F30]" />
                    <span>
                      Cari as&apos;ilah &ldquo;<strong className="text-stone-900">{q}</strong>&rdquo;
                    </span>
                  </div>
                  <CornerDownLeft className="h-4 w-4 text-stone-400" />
                </motion.li>
              )}
            </motion.ul>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between border-t border-stone-100 px-3 pt-2 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                Tekan{" "}
                <kbd className="rounded border border-stone-200 bg-stone-50 px-1 py-0.5 font-mono text-[10px] text-stone-600">
                  Enter
                </kbd>{" "}
                untuk mencari
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-stone-200 bg-stone-50 px-1 py-0.5 font-mono text-[10px] text-stone-600">
                  Esc
                </kbd>{" "}
                menutup
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
