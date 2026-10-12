"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ModalChat } from "./ModalChat";

export function TombolMelayangChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Sembunyikan tombol melayang jika sudah berada di halaman obrolan penuh
  if (pathname === "/tanya") return null;

  return (
    <>
      {/* Tombol Melayang Bulat Pojok Kanan Bawah */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Buka Tanya MOCHI"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A96E]/40 bg-[#1E3F30] text-white shadow-[0_8px_24px_rgba(30,63,48,0.35)] hover:bg-[#152e23] hover:shadow-[0_12px_28px_rgba(30,63,48,0.45)] hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {/* Maskot 3D Bulat */}
          <div className="relative flex h-9 w-9 items-center justify-center">
            <Image
              src="/mascot/mochi-3d.png"
              alt="MOCHI Mascot"
              width={36}
              height={36}
              className="h-9 w-9 object-contain drop-shadow-md transition-transform duration-300 group-hover:rotate-6"
            />
            {/* Dot Aksen Emas Berkedip */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A96E] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C9A96E]" />
            </span>
          </div>
        </button>
      </div>

      {/* Modal Dialog Chat */}
      <ModalChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
