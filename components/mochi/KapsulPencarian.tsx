"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Check,
  X,
  BookOpen,
  Scale,
  Users,
  CornerDownLeft,
} from "lucide-react";

const CONTOH = [
  "hukum dropshipping e-commerce",
  "aset kripto dan cryptocurrency",
  "skema paylater marketplace",
  "uji tes DNA pembuktian nasab",
  "vaksin enzim tripsin babi",
  "daging kurban kalengan",
];

export interface MasailAction {
  id: string;
  label: string;
  topik: "ibadah" | "muamalah" | "munakahat";
  topikLabel: string;
  kode: string;
  tahun: string;
}

const MASAIL_ACTIONS: MasailAction[] = [
  {
    id: "1",
    label: "Praktik Dropshipping Tanpa Qabadh Hissi",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2022-0002",
    tahun: "2022",
  },
  {
    id: "2",
    label: "Hukum Test Deoxyribo Nucleic Acid (DNA)",
    topik: "munakahat",
    topikLabel: "Munakahat",
    kode: "MCH-2004-0001",
    tahun: "2004",
  },
  {
    id: "3",
    label: "Status Hukum Aset Kripto (Cryptocurrency)",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2023-0001",
    tahun: "2023",
  },
  {
    id: "4",
    label: "Skema Transaksi Paylater dan Denda Keterlambatan",
    topik: "muamalah",
    topikLabel: "Muamalah",
    kode: "MCH-2023-0003",
    tahun: "2023",
  },
  {
    id: "5",
    label: "Penggunaan Vaksin yang Mengandung Enzim Tripsin Babi",
    topik: "ibadah",
    topikLabel: "Ibadah",
    kode: "MCH-2024-0004",
    tahun: "2024",
  },
  {
    id: "6",
    label: "Jama' Qashar Shalat Bagi Pekerja Proyek",
    topik: "ibadah",
    topikLabel: "Ibadah",
    kode: "MCH-2022-0006",
    tahun: "2022",
  },
  {
    id: "7",
    label: "Mahar Pernikahan Berupa Hafalan Al-Qur'an",
    topik: "munakahat",
    topikLabel: "Munakahat",
    kode: "MCH-2021-0007",
    tahun: "2021",
  },
];

// Stagger Animation Variants sesuai referensi ActionSearchBar
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

export default function KapsulPencarian({
  nilaiAwal = "",
  topikAwal = "semua",
  tahunAwal = "semua",
  opsiTahun = [2024, 2023, 2022, 2021, 2020, 2019, 2018],
  besar = true,
}: {
  nilaiAwal?: string;
  topikAwal?: string;
  tahunAwal?: string;
  opsiTahun?: number[];
  besar?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(nilaiAwal);
  const [tahun, setTahun] = useState(tahunAwal);
  const [idx, setIdx] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotasi teks contoh animasi idle (hanya saat tidak mengetik dan tidak fokus)
  useEffect(() => {
    if (q || isInputFocused) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % CONTOH.length), 3200);
    return () => clearInterval(t);
  }, [q, isInputFocused]);

  // Klik di luar form untuk menutup dropdown tahun & saran searchbox
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsInputFocused(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsInputFocused(false);
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

  const kirim = (e?: React.FormEvent, customQ?: string) => {
    e?.preventDefault();
    const queryToSearch = (customQ !== undefined ? customQ : q).trim();
    const params = new URLSearchParams();
    if (queryToSearch) params.set("q", queryToSearch);
    if (topikAwal && topikAwal !== "semua") params.set("topik", topikAwal);
    if (tahun && tahun !== "semua") params.set("tahun", tahun);

    setIsInputFocused(false);
    setIsDropdownOpen(false);
    router.push(`/perpustakaan?${params.toString()}`);
  };

  const pilihSaran = (action: MasailAction) => {
    setQ(action.label);
    kirim(undefined, action.label);
  };

  const labelTahunAktif = tahun === "semua" ? "Semua Tahun" : `${tahun} M`;

  // Filter saran as'ilah berdasarkan input pengguna
  const saranTerfilter = q.trim()
    ? MASAIL_ACTIONS.filter((item) => {
        const queryLower = q.toLowerCase();
        return (
          item.label.toLowerCase().includes(queryLower) ||
          item.topikLabel.toLowerCase().includes(queryLower) ||
          item.kode.toLowerCase().includes(queryLower)
        );
      })
    : MASAIL_ACTIONS.slice(0, 5);

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
    <form
      ref={containerRef}
      onSubmit={kirim}
      data-testid="kapsul-pencarian"
      className={`group/kapsul relative mx-auto flex w-full max-w-2xl flex-col gap-1 rounded-[28px] border border-[#E5E3DC] bg-white p-1.5 shadow-[0_8px_32px_rgba(30,63,48,0.08)] transition-all duration-300 focus-within:shadow-[0_16px_48px_rgba(30,63,48,0.18)] focus-within:border-[#1E3F30] md:flex-row md:items-center md:rounded-full ${
        besar ? "md:p-2" : ""
      }`}
    >
      {/* SEGMEN 1: Input Kata Kunci dengan Action Search Bar Interaktif */}
      <div className="relative flex min-w-0 flex-1 items-center gap-2.5 px-3.5">
        <Search
          className={`h-[18px] w-[18px] shrink-0 transition-colors ${
            isInputFocused ? "text-[#1E3F30]" : "text-stone-400"
          }`}
          aria-hidden="true"
        />

        {/* Input Text Nyata - Tanpa Outline Kotak Default Browser */}
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            setIsInputFocused(true);
            setIsDropdownOpen(false);
          }}
          autoComplete="off"
          spellCheck={false}
          aria-label="Kata kunci pencarian"
          placeholder="Cari persoalan fiqih..."
          data-testid="input-pencarian"
          className={`peer z-10 w-full bg-transparent text-[15px] text-stone-900 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
            !q && !isInputFocused ? "placeholder:opacity-0" : "placeholder:text-stone-400"
          } ${besar ? "h-12 md:text-base" : "h-12"}`}
        />

        {/* Tombol Clear Cepat saat Ada Teks */}
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="z-10 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            title="Hapus ketikan"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Action Search Bar Smooth Floating Placeholder (Hanya tampil saat kosong & TIDAK SEDANG FOKUS) */}
        {!q && !isInputFocused && (
          <div
            className="pointer-events-none absolute left-10 right-4 top-1/2 -translate-y-1/2 flex items-center overflow-hidden text-[15px] text-stone-400"
            aria-hidden="true"
          >
            <span className="mr-1.5 shrink-0 text-stone-400 font-normal">Cari:</span>
            <div className="relative h-6 w-full overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={idx}
                  initial={{ y: 16, opacity: 0, filter: "blur(2px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -16, opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 flex items-center truncate font-medium text-stone-600"
                >
                  &ldquo;{CONTOH[idx]}&rdquo;
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* SEGMEN KONTROL: Dropdown Tahun & Tombol Cari (Berdampingan di Mobile, Terintegrasi di Desktop) */}
      <div className="flex w-full items-center gap-1.5 border-t border-[#E5E3DC] pt-1.5 md:w-auto md:gap-0 md:border-t-0 md:border-l md:border-[#E5E3DC] md:pt-0">
        {/* Dropdown Tahun */}
        <div ref={dropdownRef} className="relative flex-1 md:flex-initial">
          <button
            type="button"
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
              setIsInputFocused(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Pilih filter tahun"
            className="flex h-10 w-full items-center justify-between gap-2 rounded-xl bg-stone-50/80 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 md:h-12 md:w-44 md:rounded-none md:bg-transparent md:px-4 md:text-[13.5px] select-none transition-colors"
          >
            <span className="truncate whitespace-nowrap">{labelTahunAktif}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-stone-400 transition-transform duration-200 md:h-4 md:w-4 ${
                isDropdownOpen ? "rotate-180 text-[#1E3F30]" : ""
              }`}
            />
          </button>

          {/* Popover Menu Tahun Melayang */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 top-full z-50 mt-2 w-full min-w-[140px] md:w-48 rounded-2xl border border-[#E5E3DC] bg-white p-2 shadow-[0_20px_48px_rgba(0,0,0,0.14)] ring-1 ring-black/5 backdrop-blur-md"
              >
                <div className="max-h-64 md:max-h-80 overflow-y-auto overscroll-contain p-0.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTahun("semua");
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      tahun === "semua"
                        ? "bg-[#1E3F30] text-white"
                        : "text-stone-700 hover:bg-stone-100/80 hover:text-stone-950"
                    }`}
                  >
                    <span className="whitespace-nowrap">Semua Tahun</span>
                    {tahun === "semua" && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>

                  {opsiTahun.map((t) => {
                    const valStr = String(t);
                    const isDipilih = tahun === valStr;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTahun(valStr);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                          isDipilih
                            ? "bg-[#1E3F30] text-white"
                            : "text-stone-700 hover:bg-stone-100/80 hover:text-stone-950"
                        }`}
                      >
                        <span className="whitespace-nowrap">{t} M</span>
                        {isDipilih && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tombol Cari */}
        <button
          type="submit"
          data-testid="tombol-cari"
          className="group/cari inline-flex h-10 flex-1 md:flex-initial md:h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[#1E3F30] px-4 md:px-7 text-xs md:text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2D5A46] active:scale-[0.98]"
        >
          <span>Cari</span>
          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* SEGMEN 4: Action Search Bar Animated Suggestion Dropdown (Staggered Animation) */}
      <AnimatePresence>
        {isInputFocused && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-[#E5E3DC] bg-white p-2.5 shadow-[0_24px_56px_rgba(30,63,48,0.16)] ring-1 ring-black/5"
          >
            {/* Header Kategori Saran */}
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
              <span>{q.trim() ? "Hasil Pencarian As'ilah" : "Rekomendasi Musyawarah Populer"}</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {q.trim() ? `${saranTerfilter.length} saran` : "Pilih cepat"}
              </span>
            </div>

            {/* List Saran As'ilah dengan Animasi Stagger */}
            <motion.ul className="mt-1 space-y-1">
              {saranTerfilter.length > 0 ? (
                saranTerfilter.map((action) => (
                  <motion.li
                    key={action.id}
                    variants={itemVariants}
                    layout
                    onClick={() => pilihSaran(action)}
                    className="group/item flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 group-hover/item:bg-white group-hover/item:shadow-xs transition-colors">
                        {getTopicIcon(action.topik)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-stone-900 group-hover/item:text-[#1E3F30] transition-colors">
                          {action.label}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                          <span
                            className={`rounded-full border px-1.5 py-0.2 font-medium ${getTopicBadgeStyle(
                              action.topik
                            )}`}
                          >
                            {action.topikLabel}
                          </span>
                          <span>•</span>
                          <span>{action.kode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 pl-2">
                      <span className="hidden text-[11px] text-stone-400 sm:inline">
                        {action.tahun} M
                      </span>
                      <CornerDownLeft className="h-3.5 w-3.5 text-stone-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  variants={itemVariants}
                  onClick={() => kirim(undefined, q)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-xs text-stone-700 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-[#1E3F30]" />
                    <span>
                      Cari keputusan tentang &ldquo;<strong className="text-stone-900">{q}</strong>&rdquo;
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-400" />
                </motion.li>
              )}
            </motion.ul>

            {/* Footer Petunjuk Tombol */}
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