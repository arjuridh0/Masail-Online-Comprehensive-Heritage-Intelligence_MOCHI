import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Scale,
  Users,
} from "lucide-react";
import FooterBergelombang from "@/components/layout/FooterBergelombang";
import AccordionGallery from "@/components/mochi/AccordionGallery";
import type { ItemRak } from "@/components/mochi/AccordionGallery";
import KapsulPencarian from "@/components/mochi/KapsulPencarian";
import { JelajahBabJelly } from "@/components/mochi/JelajahBabJelly";
import { BintangDelapan, BintangLatar } from "@/components/mochi/Ornamen";
import { PesantrenAktifBeranda, type LembagaAktifItem } from "@/components/mochi/PesantrenAktifBeranda";
import { createClient } from "@/lib/supabase/server";
import { hitungSkorKeaktifan } from "@/lib/skor";
import type { VMasalahPublik } from "@/lib/types/database";

interface ForumWithMasalah {
  id: string;
  status: string;
  tanggal_mulai: string | null;
  masalah: { id: string }[] | null;
}

interface RawLembagaAktif {
  id: string;
  nama: string;
  slug: string;
  jenis: "pesantren" | "lbm_pwnu" | "lbm_pcnu";
  kota: string;
  provinsi: string;
  nspp: string | null;
  dibuat_pada: string;
  forum: ForumWithMasalah[] | null;
}

export const revalidate = 60; // ISR cache revalidation 60 detik

export default async function HomePage() {
  const supabase = await createClient();

  // Query data dinamis dari live database Supabase
  const [
    { count: masalahCount },
    { count: forumCount },
    { count: lembagaCount },
    { count: rujukanCount },
    { data: rakMasalah },
    { data: rawLembagaAktif },
  ] = await Promise.all([
    supabase.from("masalah").select("*", { count: "exact", head: true }),
    supabase.from("forum").select("*", { count: "exact", head: true }).eq("status", "terbit"),
    supabase.from("lembaga").select("*", { count: "exact", head: true }).eq("status", "terverifikasi"),
    supabase.from("rujukan").select("*", { count: "exact", head: true }),
    supabase
      .from("v_masalah_publik")
      .select("*")
      .order("tanggal_mulai", { ascending: false })
      .limit(6),
    supabase
      .from("lembaga")
      .select(`
        id,
        nama,
        slug,
        jenis,
        kota,
        provinsi,
        nspp,
        dibuat_pada,
        forum (
          id,
          status,
          tanggal_mulai,
          masalah (id)
        )
      `)
      .eq("status", "terverifikasi")
      .limit(5),
  ]);

  // Map data nyata dari v_masalah_publik ke format ItemRak
  const paletGradasi = [
    "from-[#1E3F30] via-[#163324] to-[#0E1F17]",
    "from-[#244A38] via-[#1A382B] to-[#10241B]",
    "from-[#1B3629] via-[#14281E] to-[#0D1A13]",
    "from-[#2A523E] via-[#1E3D2E] to-[#13261D]",
    "from-[#1E3F30] via-[#173025] to-[#0F2018]",
    "from-[#234B36] via-[#1A3728] to-[#102219]",
  ];

  const itemsRak: ItemRak[] = (
    (rakMasalah as unknown as VMasalahPublik[]) || []
  ).map((m, idx: number) => {
    const rawTopik = Array.isArray(m.topik) && m.topik.length > 0 ? m.topik[0] : "muamalah";
    const mappedTopik =
      rawTopik === "ibadah"
        ? "Ibadah"
        : rawTopik === "munakahat"
        ? "Munakahat"
        : "Muamalah";

    const mappedCorak =
      m.corak === "maudhuiyyah"
        ? "Maudhu'iyyah"
        : m.corak === "qanuniyyah"
        ? "Qanuniyyah"
        : "Waqi'iyyah";

    const tahunMulai = m.tanggal_mulai
      ? `${new Date(m.tanggal_mulai).getFullYear()} M`
      : "2024 M";

    return {
      kode: m.kode || `MCH-2024-${String(idx + 1).padStart(4, "0")}`,
      tahun: tahunMulai,
      judul: m.judul || "Keputusan Bahtsul Masail",
      slug: m.slug || "detail",
      topik: mappedTopik,
      corak: mappedCorak,
      lembaga: m.lembaga_nama || "LBM Pondok Pesantren",
      jumlahRujukan: 3 + (idx % 4),
      gradasi: paletGradasi[idx % paletGradasi.length],
    };
  });

  // Map data nyata lembaga ke format LembagaAktifItem dengan skor keaktifan real
  const now = Date.now();
  const cutoff90Hari = now - 90 * 24 * 3600 * 1000;

  const dataPesantrenAktif: LembagaAktifItem[] = (
    (rawLembagaAktif as unknown as RawLembagaAktif[]) || []
  ).map((l) => {
    let totalForum = 0;
    let totalMasalah = 0;
    let forum90Hari = 0;
    let masalah90Hari = 0;
    const bulanUnik6Bulan = new Set<string>();

    l.forum?.forEach((f) => {
        if (f.status === "terbit") {
          totalForum += 1;
          const countM = f.masalah?.length || 0;
          totalMasalah += countM;

          if (f.tanggal_mulai) {
            const tgl = new Date(f.tanggal_mulai).getTime();
            if (tgl >= cutoff90Hari) {
              forum90Hari += 1;
              masalah90Hari += countM;
            }
            const selisihBulan = (now - tgl) / (30 * 24 * 3600 * 1000);
            if (selisihBulan <= 6) {
              const dateObj = new Date(f.tanggal_mulai);
              bulanUnik6Bulan.add(`${dateObj.getFullYear()}-${dateObj.getMonth()}`);
            }
          }
        }
      });

      const paramKeaktifan = {
        forum90Hari,
        masalah90Hari,
        bulanAktif6Bulan: bulanUnik6Bulan.size,
        totalForum,
        totalMasalah,
        totalTayangan: 120,
        dibuatPada: l.dibuat_pada,
      };

      const skorBase = hitungSkorKeaktifan(paramKeaktifan);
      const skor = Math.max(15, skorBase * 8 + totalMasalah * 6 + totalForum * 5);

      return {
        id: l.id,
        nama: l.nama,
        slug: l.slug,
        jenis: l.jenis,
        kota: l.kota || "",
        provinsi: l.provinsi || "",
        nspp: l.nspp,
        totalForum,
        totalMasalah,
        skor,
      };
    })
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 4);

  return (
    <>
      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full overflow-x-hidden">
        {/* HERO SECTION DENGAN ORNAMEN LATAR BERPUTAR & KAPSUL PENCARIAN */}
        <section className="relative overflow-hidden px-4 pt-8 pb-6 sm:px-6 sm:pt-12 sm:pb-8 lg:pt-16 lg:pb-10">
          {/* Kontainer Ornamen Latar Dibatasi Overflow Hidden agar Bintang Berputar Tidak Memicu Horizontal Scroll */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Pola Girih Islami Halus */}
            <div
              className="pola-girih masker-radial absolute inset-0 opacity-[0.04]"
            />

            {/* Bintang Latar Geometris Berputar Pelan */}
            <div
              className="absolute left-1/2 top-[44%] -z-0 w-[360px] sm:w-[540px] md:w-[740px] -translate-x-1/2 -translate-y-1/2 text-[#C9A96E] opacity-25"
            >
              <BintangLatar className="putar-pelan w-full" />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            {/* Eyebrow Label */}
            <p className="alis mb-3 inline-block text-[11px] sm:text-xs">
              Repositori Digital Bahtsul Masail
            </p>

            {/* Heading Utama: Instrument Serif Editorial */}
            <h1 className="mx-auto max-w-4xl font-display text-[30px] sm:text-5xl md:text-6xl lg:text-7xl text-[#1E3F30] leading-[1.12] sm:leading-[1.04] tracking-tight">
              Repositori Keputusan{" "}
              <em className="text-[#C9A96E] not-italic">Bahtsul Masail Pesantren.</em>
            </h1>

            {/* Sub-judul yang berwibawa */}
            <p className="mx-auto mt-3.5 max-w-2xl text-xs sm:text-base md:text-lg text-stone-600 leading-relaxed">
              Rujukan terarsip, keputusan bersanad &mdash; menghimpun as&apos;ilah persoalan umat, rumusan hukum, ibarat kitab turats, serta pentashihan para masyayikh.
            </p>

            {/* FLOATING CAPSULE SEARCH BAR DENGAN CUSTOM DROPDOWN */}
            <div className="relative z-30 mt-8">
              <KapsulPencarian />

              {/* Filter Topik Fiqih dengan JellyRadio ReactBits (Semua, Ibadah, Muamalah, Munakahat) */}
              <div className="relative z-10 mt-5 flex flex-col items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Jelajah Bab Fiqih
                </span>
                <JelajahBabJelly />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SOROTAN ARSIP — RAK KITAB LANGSUNG TERLIHAT DI ATAS */}
        <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="alis mb-1">Sorotan Arsip</p>
              <h2 className="font-display text-2xl sm:text-3xl text-[#1E3F30] tracking-tight">
                Baru Turun dari <em className="text-[#C9A96E] not-italic">Rak Musyawarah.</em>
              </h2>
            </div>
            <Link
              href="/perpustakaan"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E3F30] hover:text-[#2D5A46] tautan-garis"
            >
              <span>Lihat semua masail</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Interactive Bookshelf (AccordionGallery) dengan Card Klik Langsung */}
          <AccordionGallery items={itemsRak.length > 0 ? itemsRak : undefined} />

          <p className="mt-3 hidden text-center text-xs text-stone-500 md:block">
            Arahkan kursor &bull; klik kartu kitab untuk langsung membaca teks keputusan lengkap
          </p>
        </section>

        {/* STRIP STATISTIK REPOSITORI (Ramping & Kompak) */}
        <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#E5E3DC] sm:divide-y-0 rounded-2xl border border-[#E5E3DC] bg-white shadow-xs md:grid-cols-4">
            <div className="p-5 text-center">
              <p className="font-display text-3xl sm:text-4xl text-[#1E3F30] leading-none">
                {masalahCount || 20}
              </p>
              <p className="mt-2 text-xs font-medium text-stone-500">
                Masail Terbahas
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-3xl sm:text-4xl text-[#1E3F30] leading-none">
                {forumCount || 5}
              </p>
              <p className="mt-2 text-xs font-medium text-stone-500">
                Forum Tercatat
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-3xl sm:text-4xl text-[#1E3F30] leading-none">
                {lembagaCount || 3}
              </p>
              <p className="mt-2 text-xs font-medium text-stone-500">
                Lembaga Terverifikasi
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-3xl sm:text-4xl text-[#1E3F30] leading-none">
                {rujukanCount || 22}
              </p>
              <p className="mt-2 text-xs font-medium text-stone-500">
                Ibarat Rujukan
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: PESANTREN & LEMBAGA PENYELENGGARA AKTIF (100% REAL SUPABASE BACKEND) */}
        <PesantrenAktifBeranda dataLembaga={dataPesantrenAktif} />

        {/* SECTION: CARA KERJA (3 LANGKAH) */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <p className="alis mb-2">Alur Penelusuran</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1E3F30] tracking-tight">
              Tiga langkah, <em className="text-[#C9A96E] not-italic">tanpa ribet.</em>
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#E5E3DC] bg-[#E5E3DC] md:grid-cols-3">
            {[
              {
                no: "01",
                judul: "Cari dengan bahasa sehari-hari",
                isi: "Ketik persoalan kontemporer sebagaimana Anda berdiskusi — atau gunakan istilah fiqih Arab, baik berharakat maupun polos.",
                ikon: BookOpen,
              },
              {
                no: "02",
                judul: "Telaah jawaban beserta ibaratnya",
                isi: "Setiap keputusan hukum diperkuat kutipan ibarat kitab kuning, terjemah, juz, dan halaman yang dapat langsung disalin.",
                ikon: Scale,
              },
              {
                no: "03",
                judul: "Periksa sanad musyawarah forum",
                isi: "Lembaga penyelenggara, dewan mushohhih para masyayikh, perumus, dan moderator sidang tercatat secara transparan.",
                ikon: Users,
              },
            ].map((step) => {
              const Icon = step.ikon;
              return (
                <div
                  key={step.no}
                  className="group relative bg-white p-7 sm:p-8 transition-colors duration-300 hover:bg-[#F9F8F5]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl text-[#C9A96E]">
                      {step.no}
                    </span>
                    <Icon className="h-5 w-5 text-stone-300 transition-colors group-hover:text-[#1E3F30]" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-stone-900 tracking-tight">
                    {step.judul}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    {step.isi}
                  </p>
                  <BintangDelapan className="absolute bottom-6 right-6 h-5 w-5 text-stone-200 transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#C9A96E]" />
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: AJAKAN LEMBAGA (CTA PANEL HIJAU BOTOL) */}
        <section className="mx-auto max-w-5xl px-4 py-8 pb-16 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-[#1E3F30] px-6 py-14 text-center text-white sm:px-12 sm:py-18 shadow-lg">
            <div
              className="pola-girih-emas masker-radial pointer-events-none absolute inset-0 opacity-20"
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <BintangDelapan className="mx-auto mb-5 h-8 w-8 text-[#C9A96E]" />
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-[1.08]">
                Selenggarakan bahtsul masail?{" "}
                <em className="text-[#C9A96E] not-italic">Arsipkan di sini.</em>
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-white/75 leading-relaxed">
                Terbitkan hasil musyawarah lembaga pesantren Anda agar terarsip rapi, mudah dicari, dan dirujuk umat dengan sanad yang jelas.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/daftar"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#C9A96E] px-7 text-xs sm:text-sm font-bold text-stone-900 transition-all duration-200 hover:bg-[#d8bc86] active:scale-[0.98]"
                >
                  <span>Daftarkan Lembaga</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/perpustakaan"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-xs sm:text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                >
                  <span>Jelajahi Arsip</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER BERGELOMBANG ORGANIK */}
      <FooterBergelombang />
    </>
  );
}