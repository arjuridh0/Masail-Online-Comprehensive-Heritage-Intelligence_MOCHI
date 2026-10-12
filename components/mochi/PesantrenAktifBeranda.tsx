"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Flame } from "lucide-react";

export interface LembagaAktifItem {
  id: string;
  nama: string;
  slug: string;
  jenis: "pesantren" | "lbm_pwnu" | "lbm_pcnu";
  kota: string;
  provinsi: string;
  nspp?: string | null;
  totalForum: number;
  totalMasalah: number;
  skor: number;
}

export function PesantrenAktifBeranda({
  dataLembaga,
}: {
  dataLembaga: LembagaAktifItem[];
}) {
  // Nilai maksimum skor untuk persentase bar
  const maxSkor = Math.max(...dataLembaga.map((l) => l.skor), 100);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header Bagian Papan Peringkat */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-1.5 alis mb-1">
            <Flame className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span>Papan Keaktifan Musyawarah</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-[#1E3F30] tracking-tight">
            Peringkat Keaktifan <em className="text-[#C9A96E] not-italic">Pesantren Mitra.</em>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
            Akumulasi intensitas penyelenggaraan sidang bahtsul masail, ketepatan perumusan ibarat turats, dan volume masail terverifikasi.
          </p>
        </div>

        <Link
          href="/lembaga"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E3F30] hover:text-[#2D5A46] tautan-garis"
        >
          <span>Lihat seluruh direktori lembaga</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* LIST CARD RANKING BAR BERTINGKAT KE BAWAH */}
      <div className="space-y-3">
        {dataLembaga.map((lembaga, idx) => {
          const peringkat = idx + 1;
          const labelJenis =
            lembaga.jenis === "pesantren"
              ? "Pondok Pesantren"
              : lembaga.jenis === "lbm_pwnu"
              ? "LBM PWNU"
              : "LBM PCNU";

          // Persentase panjang bar keaktifan
          const persenBar = Math.min(100, Math.max(20, Math.round((lembaga.skor / maxSkor) * 100)));

          // Styling badge nomor peringkat
          const badgePeringkatStyle =
            peringkat === 1
              ? "bg-[#C9A96E] text-stone-950 font-black shadow-xs ring-2 ring-[#C9A96E]/30"
              : peringkat === 2
              ? "bg-stone-200 text-stone-800 font-bold ring-1 ring-stone-300"
              : peringkat === 3
              ? "bg-[#E5DDC9] text-stone-800 font-bold"
              : "bg-stone-100 text-stone-600 font-semibold";

          return (
            <Link
              key={lembaga.id}
              href={`/lembaga/${lembaga.slug}`}
              className="group relative flex flex-col gap-3.5 rounded-2xl border border-[#E5E3DC] bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1E3F30]/40 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Kolom Kiri: Nomor Peringkat + Identitas Pesantren */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Badge Nomor Peringkat */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm transition-transform duration-300 group-hover:scale-105 ${badgePeringkatStyle}`}
                  >
                    #{peringkat}
                  </div>

                  {/* Info Nama Lembaga & Lokasi */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
                        {labelJenis}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1E3F30]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E3F30]">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Terverifikasi</span>
                      </span>
                    </div>

                    <h3 className="mt-1 text-base font-bold text-stone-900 group-hover:text-[#1E3F30] transition-colors truncate">
                      {lembaga.nama}
                    </h3>

                    <p className="mt-0.5 text-xs text-stone-500 truncate">
                      {lembaga.kota}, {lembaga.provinsi}
                      {lembaga.nspp ? ` • NSPP: ${lembaga.nspp}` : ""}
                    </p>
                  </div>
                </div>

                {/* Kolom Kanan: Poin Skor & Statistik Musyawarah */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t border-stone-100 pt-2 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline sm:justify-end gap-1">
                      <span className="font-display text-xl sm:text-2xl font-bold text-[#1E3F30]">
                        {lembaga.skor}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 uppercase">
                        Poin
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium">
                      {lembaga.totalForum} Forum &bull; {lembaga.totalMasalah} Masail
                    </p>
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-all duration-200 group-hover:bg-[#1E3F30] group-hover:text-white shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Progress Bar Keaktifan Visual */}
              <div className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1E3F30] to-[#C9A96E] transition-all duration-700 ease-out"
                    style={{ width: `${persenBar}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}