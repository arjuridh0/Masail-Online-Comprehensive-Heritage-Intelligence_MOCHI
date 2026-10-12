"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { BintangDelapan, BintangLatar } from "./Ornamen";
import { Muncul } from "./Gerak";

export function Bidang({
  label,
  id,
  hint,
  galat,
  children,
}: {
  label: string;
  id?: string;
  hint?: string;
  galat?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-900">
        {label}
      </label>
      {children}
      {hint && !galat && <p className="mt-1.5 text-xs text-stone-400">{hint}</p>}
      {galat && <p className="mt-1.5 text-xs text-rose-600" role="alert">{galat}</p>}
    </div>
  );
}

export const gayaInput =
  "h-12 w-full rounded-xl border border-[#E5E3DC] bg-white px-4 text-[15px] text-stone-900 outline-none transition-[border-color,box-shadow] placeholder:text-stone-400 hover:border-stone-400 focus:border-[#1E3F30] focus:shadow-[0_0_0_4px_rgba(30,63,48,0.08)]";

export const gayaTombolUtama =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1E3F30] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#2D5A46] disabled:opacity-50 active:scale-[0.98]";

// Tata letak halaman akun: formulir kiri (tanpa nested box bertumpuk), panel ornamen hijau kanan
export default function KerangkaAkun({
  alis,
  judul,
  deskripsi,
  children,
  kaki,
}: {
  alis?: string;
  judul: React.ReactNode;
  deskripsi?: string;
  children: React.ReactNode;
  kaki?: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:py-16 lg:grid-cols-[1fr_440px]">
      <Muncul className="mx-auto w-full max-w-md lg:mx-0">
        <Link
          href="/"
          data-testid="tombol-kembali-beranda"
          className="group mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-stone-400 transition-transform group-hover:-translate-x-1 group-hover:text-stone-800" />
          <span>Kembali ke Beranda</span>
        </Link>
        {alis && <p className="alis mb-3">{alis}</p>}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.08] text-stone-900 tracking-tight">
          {judul}
        </h1>
        {deskripsi && (
          <p className="mt-3 text-base leading-relaxed text-stone-600">
            {deskripsi}
          </p>
        )}
        <div className="mt-8">{children}</div>
        {kaki && <div className="mt-6 text-sm text-stone-600">{kaki}</div>}
      </Muncul>

      <aside className="relative hidden overflow-hidden rounded-[32px] bg-[#1E3F30] p-10 text-white lg:sticky lg:top-24 lg:flex lg:h-[560px] lg:flex-col lg:justify-between lg:self-start shadow-xl">
        <BintangLatar className="putar-pelan pointer-events-none absolute -right-24 -top-24 w-[520px] text-[#C9A96E] opacity-30" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/20">
            <Image
              src="/mascot/mochi-3d.png"
              alt="MOCHI"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-semibold tracking-tight text-white">MOCHI</span>
        </Link>
        <div className="relative">
          <BintangDelapan className="mb-5 h-7 w-7 text-[#C9A96E]" />
          <p className="font-display text-[34px] leading-[1.12] text-white">
            Arsipkan hasil bahtsul masail lembaga Anda &mdash;{" "}
            <em className="text-[#C9A96E] not-italic">
              agar mudah dicari dan dirujuk umat.
            </em>
          </p>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Setiap lembaga diverifikasi admin pusat. Pesantren diverifikasi melalui NSPP.
          </p>
        </div>
      </aside>
    </div>
  );
}
