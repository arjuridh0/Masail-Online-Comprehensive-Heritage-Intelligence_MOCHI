"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function FooterBergelombang() {
  return (
    <footer className="relative mt-16 bg-[#1E3F30] text-white">
      {/* 1. Kurva Bergelombang Organik (SVG Wave Transition dari Krem ke Hijau Botol) */}
      <div className="absolute left-0 right-0 -top-12 md:-top-16 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-16 preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Layer Bayangan Kurva Halus */}
          <path
            d="M0,32 C280,78 480,12 720,48 C960,84 1160,24 1440,60 L1440,120 L0,120 Z"
            fill="#163324"
            opacity="0.45"
          />
          {/* Layer Utama Gelombang Organik */}
          <path
            d="M0,45 C320,105 540,18 800,58 C1060,98 1240,28 1440,70 L1440,120 L0,120 Z"
            fill="#1E3F30"
          />
        </svg>
      </div>

      {/* 2. Isi Footer */}
      <div className="relative mx-auto max-w-5xl px-5 pt-8 pb-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 pb-10 border-b border-white/10">
          {/* Kolom 1: Brand & Visi (5 Kolom) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-[#C9A96E]/40 bg-white/10">
                <Image
                  src="/mascot/mochi-3d.png"
                  alt="MOCHI"
                  fill
                  className="object-cover"
                />
              </span>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white">
                  MOCHI
                </span>
                <span className="ml-2 rounded-xs bg-[#C9A96E]/20 border border-[#C9A96E]/40 px-1.5 py-0.2 text-[9px] font-bold text-[#DFC48E] uppercase tracking-wider">
                  Pesantren
                </span>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Masail Online &amp; Comprehensive Heritage Intelligence — Repositori digital keputusan bahtsul masail pesantren nusantara yang terarsip rapi, bersanad, dan bertashih.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#DFC48E]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Arsip Fiqih &bull; Rujukan Turats &bull; Dewan Pentashih Sah</span>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat (3 Kolom) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-[#DFC48E] tracking-wider uppercase">
              Jelajah Arsip
            </p>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/perpustakaan" className="hover:text-white transition-colors">
                  Katalog Masail
                </Link>
              </li>
              <li>
                <Link href="/perpustakaan?topik=ibadah" className="hover:text-white transition-colors">
                  Bab Ibadah
                </Link>
              </li>
              <li>
                <Link href="/perpustakaan?topik=muamalah" className="hover:text-white transition-colors">
                  Bab Muamalah
                </Link>
              </li>
              <li>
                <Link href="/perpustakaan?topik=munakahat" className="hover:text-white transition-colors">
                  Bab Munakahat
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Lembaga & Bantuan (4 Kolom) */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold text-[#DFC48E] tracking-wider uppercase">
              Mitra Pesantren
            </p>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/lembaga" className="hover:text-white transition-colors">
                  Direktori Lembaga Terdaftar
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="hover:text-white transition-colors">
                  Pendaftaran Pesantren &amp; LBM
                </Link>
              </li>
              <li>
                <Link href="/masuk" className="hover:text-white transition-colors">
                  Portal Pengelola Lembaga
                </Link>
              </li>
              <li>
                <Link href="/tanya" className="hover:text-white transition-colors">
                  Konsultasi &ldquo;Tanya MOCHI&rdquo; AI
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Baris Hak Cipta & Identitas Resmi */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/60">
          <p>
            &copy; 2026 MOCHI &mdash; Repositori Resmi Keputusan Bahtsul Masail Pesantren Nusantara.
          </p>
          <div className="flex items-center gap-1 text-white/50">
            <span>Dikelola bersama para masyayikh &amp; pesantren mitra</span>
          </div>
        </div>
      </div>
    </footer>
  );
}