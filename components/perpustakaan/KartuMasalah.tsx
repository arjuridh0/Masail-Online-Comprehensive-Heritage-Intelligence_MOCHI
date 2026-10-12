import Link from "next/link";
import { BookOpen, Calendar, Eye, Building2, ArrowRight } from "lucide-react";
import type { VMasalahPublik, TopikEnum } from "@/lib/types/database";

const WARNA_TOPIK: Record<TopikEnum, { bg: string; text: string; border: string }> = {
  ibadah: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", border: "border-[#BFDBFE]" },
  muamalah: { bg: "bg-[#DCFCE7]", text: "text-[#166534]", border: "border-[#BBF7D0]" },
  munakahat: { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]", border: "border-[#E9D5FF]" },
};

export type KartuMasalahData = Pick<
  VMasalahPublik,
  | 'id'
  | 'kode'
  | 'slug'
  | 'judul'
  | 'deskripsi'
  | 'topik'
  | 'corak'
  | 'tayangan'
  | 'lembaga_nama'
  | 'forum_nama'
  | 'tanggal_mulai'
>

export interface KartuMasalahProps {
  masalah: KartuMasalahData
}

export default function KartuMasalah({ masalah }: KartuMasalahProps) {
  const tahunMasehi = masalah.tanggal_mulai
    ? new Date(masalah.tanggal_mulai).getFullYear()
    : "";

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E3DC] bg-white p-5 sm:p-6 shadow-xs hover:border-[#C9A96E]/60 hover:shadow-md transition-all duration-200">
      <div>
        {/* Header Kartu: Badges Topik + Kode */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {masalah.topik?.map((t) => {
              const style = WARNA_TOPIK[t] || {
                bg: "bg-stone-100",
                text: "text-stone-700",
                border: "border-stone-200",
              };
              return (
                <span
                  key={t}
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold capitalize ${style.bg} ${style.text} ${style.border}`}
                >
                  {t}
                </span>
              );
            })}
            {masalah.corak && (
              <span className="inline-flex items-center rounded-md border border-[#C9A96E]/40 bg-[#C9A96E]/15 px-2 py-0.5 text-[11px] font-semibold text-[#8C6D32] capitalize">
                {masalah.corak}
              </span>
            )}
          </div>
          <span className="font-mono text-xs font-semibold text-stone-500">
            {masalah.kode}
          </span>
        </div>

        {/* Judul Masalah */}
        <h3 className="mt-3.5 text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#1E3F30] transition-colors leading-snug">
          <Link href={`/masalah/${masalah.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {masalah.judul}
          </Link>
        </h3>

        {/* Snippet Taswirul Mas'alah */}
        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          {masalah.deskripsi}
        </p>
      </div>

      {/* Footer Kartu: Forum, Lembaga & Meta */}
      <div className="mt-5 border-t border-[#E5E3DC]/80 pt-4">
        <div className="flex flex-col gap-1.5 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 font-medium text-stone-800">
            <Building2 className="h-3.5 w-3.5 text-[#5B7B69] shrink-0" />
            <span className="truncate">{masalah.lembaga_nama}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1 truncate">
              <BookOpen className="h-3 w-3 text-stone-400 shrink-0" />
              <span className="truncate">{masalah.forum_nama}</span>
            </div>
            {tahunMasehi && (
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Calendar className="h-3 w-3 text-stone-400" />
                <span>{tahunMasehi} M</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
          <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
            <Eye className="h-3 w-3" />
            <span>{Number(masalah.tayangan || 0).toLocaleString("id-ID")} dibaca</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3F30] group-hover:translate-x-0.5 transition-transform">
            <span>Baca Hasil</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
