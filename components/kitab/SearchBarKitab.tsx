"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Search, X, BookOpen, User, CornerDownLeft, Sparkles } from "lucide-react";

interface SaranKitab {
  id: string;
  nama: string;
  pengarang: string;
  bidang: string;
}

const SARAN_KITAB: SaranKitab[] = [
  {
    id: "1",
    nama: "Fathul Qorib Al-Mujib",
    pengarang: "Ibnu Qasim Al-Ghazi",
    bidang: "Fiqih Syafi'i",
  },
  {
    id: "2",
    nama: "Fathul Mu'in bi Syarhi Qurratil 'Ain",
    pengarang: "Zainuddin Al-Malibari",
    bidang: "Fiqih Syafi'i",
  },
  {
    id: "3",
    nama: "Al-Majmu' Syarah Al-Muhadzdzab",
    pengarang: "Imam An-Nawawi",
    bidang: "Fiqih Perbandingan",
  },
  {
    id: "4",
    nama: "I'anatut Thalibin",
    pengarang: "Sayyid Abu Bakar Syatha",
    bidang: "Hasyiyah Fiqih",
  },
  {
    id: "5",
    nama: "Raudhatut Thalibin wa Umdatul Muftin",
    pengarang: "Imam An-Nawawi",
    bidang: "Fiqih Syafi'i",
  },
  {
    id: "6",
    nama: "Bughyatul Mustarsyidin",
    pengarang: "Sayyid Abdurrahman Ba'alawi",
    bidang: "Fatawa Fiqih",
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

export default function SearchBarKitab({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

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
    setIsFocused(false);
    router.push(`/kitab?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch(q);
  };

  const pilih = (item: SaranKitab) => {
    setQ(item.nama);
    submitSearch(item.nama);
  };

  const terfilter = q.trim()
    ? SARAN_KITAB.filter((item) => {
        const queryLower = q.toLowerCase();
        return (
          item.nama.toLowerCase().includes(queryLower) ||
          item.pengarang.toLowerCase().includes(queryLower) ||
          item.bidang.toLowerCase().includes(queryLower)
        );
      })
    : SARAN_KITAB.slice(0, 5);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative flex items-center rounded-2xl border border-[#D9D3C3] bg-white px-3.5 py-1.5 shadow-2xs focus-within:border-[#1E3F30] focus-within:ring-2 focus-within:ring-[#1E3F30]/15 transition-all">
        <Search
          className={`h-4 w-4 shrink-0 transition-colors ${
            isFocused ? "text-[#1E3F30]" : "text-stone-400"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Cari nama kitab, musonnif, atau bidang..."
          className="w-full bg-transparent px-2.5 py-1 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              submitSearch("");
              inputRef.current?.focus();
            }}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            title="Hapus pencarian"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#E5E3DC] bg-white p-2.5 shadow-[0_20px_48px_rgba(30,63,48,0.16)] ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between px-3 py-1 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#C9A96E]" />
                {q.trim() ? "Saran Kitab Sesuai Ketikan" : "Kitab Turats Sering Dirujuk"}
              </span>
              <span className="text-[10px] text-stone-400 font-normal">
                {q.trim() ? `${terfilter.length} saran` : "Pilih cepat"}
              </span>
            </div>

            <motion.ul className="mt-1 space-y-1">
              {terfilter.length > 0 ? (
                terfilter.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    layout
                    onClick={() => pilih(item)}
                    className="group/item flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 group-hover/item:bg-white group-hover/item:shadow-xs transition-colors">
                        <BookOpen className="h-3.5 w-3.5 text-[#1E3F30]" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-stone-900 group-hover/item:text-[#1E3F30] transition-colors">
                          {item.nama}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                          <User className="h-2.5 w-2.5 shrink-0" />
                          <span>{item.pengarang}</span>
                          <span>•</span>
                          <span className="rounded-md bg-stone-100 px-1 py-0.2 font-medium text-stone-600">
                            {item.bidang}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CornerDownLeft className="h-3.5 w-3.5 text-stone-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </motion.li>
                ))
              ) : (
                <motion.li
                  variants={itemVariants}
                  onClick={() => submitSearch(q)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-[#1E3F30]" />
                    <span>
                      Cari kitab &ldquo;<strong className="text-stone-900">{q}</strong>&rdquo;
                    </span>
                  </div>
                  <CornerDownLeft className="h-3.5 w-3.5 text-stone-400" />
                </motion.li>
              )}
            </motion.ul>

            <div className="mt-2 flex items-center justify-between border-t border-stone-100 px-3 pt-2 text-[10px] text-stone-400">
              <span>Tekan Enter untuk mencari</span>
              <span>Esc menutup</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
