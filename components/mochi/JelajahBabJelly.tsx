"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const BAB_ITEMS = [
  { value: "semua", label: "Semua" },
  { value: "ibadah", label: "Ibadah" },
  { value: "muamalah", label: "Muamalah" },
  { value: "munakahat", label: "Munakahat" },
];

export function JelajahBabJelly({
  nilaiAwal = "semua",
}: {
  nilaiAwal?: string;
}) {
  const router = useRouter();
  const [dipilih, setDipilih] = useState(nilaiAwal);

  const handleClick = (val: string) => {
    setDipilih(val);
    if (val === "semua") {
      router.push("/perpustakaan");
    } else {
      router.push(`/perpustakaan?topik=${val}`);
    }
  };

  return (
    <div className="w-full max-w-sm px-1 sm:px-2">
      <div
        role="radiogroup"
        aria-label="Pilih Topik Fiqih"
        className="grid grid-cols-4 gap-1 rounded-full border border-stone-200/90 bg-white/95 p-1 shadow-2xs backdrop-blur-sm"
      >
        {BAB_ITEMS.map((item) => {
          const aktif = dipilih === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={aktif}
              onClick={() => handleClick(item.value)}
              className={`relative flex min-h-[36px] items-center justify-center rounded-full px-1.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                aktif ? "text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {aktif && (
                <motion.div
                  layoutId="bubbleBabFiqih"
                  className="absolute inset-0 rounded-full bg-[#1E3F30] shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 truncate text-[11px] sm:text-xs">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}