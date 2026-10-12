import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/perpustakaan/SearchBar";
import FilterPanel from "@/components/perpustakaan/FilterPanel";
import TampilanPerpustakaan from "@/components/perpustakaan/TampilanPerpustakaan";
import { createClient } from "@/lib/supabase/server";
import { cariMasalahPublik } from "@/lib/search/hybrid";
import type { TopikEnum } from "@/lib/types/database";
import { BookOpen, AlertCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Perpustakaan Hasil Bahtsul Masail — MOCHI",
  description:
    "Katalog dan arsip lengkap keputusan bahtsul masail pesantren Nusantara. Jelajahi as'ilah, diktum hukum, dan ibarat kitab kuning terverifikasi.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    topik?: string;
    lembaga?: string;
    tahun?: string;
    corak?: string;
    urutan?: string;
    page?: string;
    force?: string;
  }>;
}

export default async function PerpustakaanPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const topik = (resolvedParams.topik || "semua") as TopikEnum | "semua";
  const lembaga = resolvedParams.lembaga || "semua";
  const tahun = resolvedParams.tahun || "semua";
  const corak = resolvedParams.corak || "semua";
  const urutan = (resolvedParams.urutan || "terbaru") as "terbaru" | "terlama" | "populer";
  const force = resolvedParams.force === "1";
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;
  const pageSize = 9;

  const supabase = await createClient();

  // 1. Eksekusi pencarian
  const searchResult = await cariMasalahPublik(supabase, {
    query: q,
    topik,
    lembaga,
    tahun,
    corak,
    urutan,
    page: currentPage,
    limit: pageSize,
    skipTypoCheck: force,
  });

  // 2. Ambil opsi lembaga terverifikasi untuk filter
  const { data: lembagaData } = await supabase
    .from("lembaga")
    .select("slug, nama")
    .eq("status", "terverifikasi")
    .order("nama");

  const lembagaOptions = (lembagaData || []).map((l) => ({
    slug: l.slug,
    nama: l.nama,
  }));

  // 3. Tahun-tahun unik
  const tahunOptions = ["2024", "2023", "2022", "2021", "2004"];

  // Helper untuk membuat link paginasi
  const createPageLink = (targetPage: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (topik !== "semua") p.set("topik", topik);
    if (lembaga !== "semua") p.set("lembaga", lembaga);
    if (tahun !== "semua") p.set("tahun", tahun);
    if (corak !== "semua") p.set("corak", corak);
    if (urutan !== "terbaru") p.set("urutan", urutan);
    p.set("page", targetPage.toString());
    return `/perpustakaan?${p.toString()}`;
  };

  return (
    <>
      <main id="main-content" className="flex-1 pb-16">
        {/* HEADER PERPUSTAKAAN */}
        <section className="border-b border-[#E5E3DC] bg-white/70 px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B7B69]">
                  <BookOpen className="h-4 w-4" />
                  <span>Katalog Khazanah Fiqih</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3F30] tracking-tight">
                  Perpustakaan Hasil Bahtsul Masail
                </h1>
                <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
                  Telusuri ribuan as&apos;ilah persoalan hukum Islam kontemporer dan
                  klasik, lengkap dengan ibarat rujukan kitab kuning dan dewan mushohhih.
                </p>
              </div>

              {/* Status Hasil */}
              <div className="text-xs font-medium text-stone-500">
                Menampilkan{" "}
                <strong className="text-stone-900">{searchResult.total}</strong>{" "}
                keputusan bahtsul masail
              </div>
            </div>

            {/* Bilah Pencarian */}
            <div className="relative z-30 mt-6">
              <SearchBar defaultValue={q} />
            </div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* SIDEBAR FILTER (1 Kolom) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain pr-0.5">
                <FilterPanel
                  lembagaOptions={lembagaOptions}
                  tahunOptions={tahunOptions}
                />
              </div>
            </div>

            {/* HASIL PENCARIAN (3 Kolom) */}
            <div className="lg:col-span-3">
              {/* GOOGLE-STYLE TYPO CORRECTION / DID-YOU-MEAN BANNER */}
              {searchResult.saranKoreksi &&
                searchResult.saranKoreksi.toLowerCase() !== q.toLowerCase() && (
                  searchResult.isKoreksiOtomatis ? (
                    <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-emerald-50 p-4 text-xs sm:text-sm text-stone-800 shadow-2xs">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-[#1E3F30]">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="leading-relaxed">
                            Menampilkan hasil untuk{" "}
                            <Link
                              href={`/perpustakaan?q=${encodeURIComponent(
                                searchResult.saranKoreksi
                              )}`}
                              className="font-bold text-[#1E3F30] underline underline-offset-2 hover:text-[#2D5A46]"
                            >
                              {searchResult.saranKoreksi}
                            </Link>
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            Telusuri{" "}
                            <Link
                              href={`/perpustakaan?q=${encodeURIComponent(
                                q
                              )}&force=1`}
                              className="italic text-stone-600 underline underline-offset-2 hover:text-stone-900"
                            >
                              {q}
                            </Link>{" "}
                            sebagai gantinya.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3.5 text-xs sm:text-sm text-stone-700">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-[#C9A96E] shrink-0" />
                        <p>
                          Mungkin yang Anda maksud:{" "}
                          <Link
                            href={`/perpustakaan?q=${encodeURIComponent(
                              searchResult.saranKoreksi
                            )}`}
                            className="font-bold text-[#1E3F30] underline underline-offset-2 hover:text-[#2D5A46]"
                          >
                            {searchResult.saranKoreksi}
                          </Link>
                        </p>
                      </div>
                    </div>
                  )
                )}

              {searchResult.items.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E3DC] bg-white p-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-4">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Tidak Ditemukan As&apos;ilah yang Cocok
                  </h3>
                  <p className="mt-2 max-w-md text-xs sm:text-sm text-stone-500 leading-relaxed">
                    Kueri &quot;{q}&quot; tidak menghasilkan rekaman keputusan hukum.
                    Coba gunakan kata kunci yang lebih umum, periksa ejaan, atau reset filter topik.
                  </p>
                  <Link
                    href="/perpustakaan"
                    className="mt-6 rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2D5A46] transition-colors"
                  >
                    Reset Semua Filter
                  </Link>
                </div>
              ) : (
                /* RESULTS TAMPILAN GANDA (KARTU / RAK KITAB) */
                <>
                  <TampilanPerpustakaan items={searchResult.items} />

                  {/* PAGINATION CONTROLS */}
                  {searchResult.totalPages > 1 && (
                    <nav
                      aria-label="Navigasi Halaman"
                      className="mt-10 flex items-center justify-between border-t border-[#E5E3DC] pt-5 text-xs font-medium text-stone-600"
                    >
                      <div>
                        Halaman <strong>{searchResult.page}</strong> dari{" "}
                        <strong>{searchResult.totalPages}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        {searchResult.page > 1 ? (
                          <Link
                            href={createPageLink(searchResult.page - 1)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#E5E3DC] bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Sebelumnya</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-400 cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Sebelumnya</span>
                          </button>
                        )}

                        {searchResult.page < searchResult.totalPages ? (
                          <Link
                            href={createPageLink(searchResult.page + 1)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#E5E3DC] bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <span>Selanjutnya</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-400 cursor-not-allowed"
                          >
                            <span>Selanjutnya</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
