"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";

export interface ItemRak {
  kode: string;
  tahun: string;
  judul: string;
  slug: string;
  topik: "Ibadah" | "Muamalah" | "Munakahat";
  corak: "Waqi'iyyah" | "Maudhu'iyyah" | "Qanuniyyah";
  lembaga: string;
  jumlahRujukan: number;
  gradasi: string;
}

const CONTOH_ITEM: ItemRak[] = [
  {
    kode: "MCH-2026-0019",
    tahun: "2026 M",
    judul: "Aqiqah untuk Anak Perempuan dengan Satu Ekor Kambing",
    slug: "aqiqah-anak-perempuan-satu-kambing",
    topik: "Ibadah",
    corak: "Waqi'iyyah",
    lembaga: "LBM Pesantren Al-Amien Madura",
    jumlahRujukan: 4,
    gradasi: "from-[#1E3F30] via-[#163324] to-[#0E1F17]",
  },
  {
    kode: "MCH-2024-0012",
    tahun: "2024 M",
    judul: "Keabsahan Hasil Tes DNA sebagai Bukti Penetapan Nasab Anak",
    slug: "keabsahan-tes-dna-penetapan-nasab",
    topik: "Munakahat",
    corak: "Waqi'iyyah",
    lembaga: "PP. Lirboyo Kediri",
    jumlahRujukan: 5,
    gradasi: "from-[#244A38] via-[#1A382B] to-[#10241B]",
  },
  {
    kode: "MCH-2025-0008",
    tahun: "2025 M",
    judul: "Hukum Akad Dropshipping dan Transaksi Paylater Tanpa Riba",
    slug: "hukum-dropshipping-paylater",
    topik: "Muamalah",
    corak: "Waqi'iyyah",
    lembaga: "LBM PWNU Jawa Timur",
    jumlahRujukan: 6,
    gradasi: "from-[#3B2F23] via-[#2A2118] to-[#1A140F]",
  },
  {
    kode: "MCH-2024-0031",
    tahun: "2024 M",
    judul: "Status Air PDAM Keruh untuk Thaharah dan Bersuci Shalat",
    slug: "status-air-pdam-keruh-thaharah",
    topik: "Ibadah",
    corak: "Maudhu'iyyah",
    lembaga: "PP. Sidogiri Pasuruan",
    jumlahRujukan: 3,
    gradasi: "from-[#1A3340] via-[#13252F] to-[#0C171D]",
  },
  {
    kode: "MCH-2025-0014",
    tahun: "2025 M",
    judul: "Kewajiban Zakat Profesi atas Penghasilan Digital Creator",
    slug: "zakat-profesi-digital-creator",
    topik: "Muamalah",
    corak: "Qanuniyyah",
    lembaga: "PP. Tebuireng Jombang",
    jumlahRujukan: 4,
    gradasi: "from-[#382026] via-[#28161B] to-[#180C10]",
  },
  {
    kode: "MCH-2024-0022",
    tahun: "2024 M",
    judul: "Batas Shalat Jama' Qashar bagi Musafir Pekerja Komuter",
    slug: "jama-qashar-pekerja-komuter",
    topik: "Ibadah",
    corak: "Waqi'iyyah",
    lembaga: "PP. Al-Falah Ploso",
    jumlahRujukan: 4,
    gradasi: "from-[#283828] via-[#1C281C] to-[#111811]",
  },
];

const WARNA_TOPIK: Record<ItemRak["topik"], { bg: string; teks: string }> = {
  Ibadah: { bg: "bg-[#DBEAFE]", teks: "text-[#1E40AF]" },
  Muamalah: { bg: "bg-[#DCFCE7]", teks: "text-[#166534]" },
  Munakahat: { bg: "bg-[#F3E8FF]", teks: "text-[#7E22CE]" },
};

export default function AccordionGallery({
  items = CONTOH_ITEM,
}: {
  items?: ItemRak[];
}) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="w-full">
      {/* TAMPILAN DESKTOP: Rak Buku Interaktif (Hover to Expand) */}
      <div className="hidden h-[440px] w-full gap-2.5 md:flex">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const topikStyle = WARNA_TOPIK[item.topik];

          return (
            <div
              key={item.kode}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                if (isActive) {
                  router.push(`/masalah/${item.slug}`);
                } else {
                  setActiveIndex(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isActive}
              aria-label={`Keputusan: ${item.judul} (Klik untuk membuka rincian)`}
              className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#C9A96E]/20 bg-gradient-to-b ${item.gradasi} text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-2 focus:ring-[#C9A96E] ${
                isActive ? "flex-[4.5]" : "flex-1 hover:flex-[1.3]"
              }`}
            >
              {/* Garis Aksen Emas di Atas Punggung Kitab */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />

              {/* KEADAAN TERTUTUP (COLLAPSED SPINE) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-4 transition-opacity duration-300 ${
                  isActive ? "pointer-events-none opacity-0" : "opacity-90"
                }`}
              >
                {/* Kode Mini di Atas */}
                <span className="font-mono text-[10px] tracking-widest text-stone-300/70">
                  {item.tahun.slice(0, 4)}
                </span>

                {/* Judul Vertikal di Punggung Kitab */}
                <div className="teks-vertikal my-auto max-h-[290px] overflow-hidden text-center text-xs font-medium tracking-wide text-stone-100/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                  {item.judul}
                </div>

                {/* Ornamen Geometris Mini di Bawah */}
                <div className="flex flex-col items-center gap-1 text-[#C9A96E]/70">
                  <span className="h-1 w-1 rounded-full bg-[#C9A96E]/60" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
                    {item.topik.slice(0, 3)}
                  </span>
                </div>
              </div>

              {/* KEADAAN TERBUKA (EXPANDED CONTENT) */}
              <div
                className={`flex h-full flex-col justify-between p-6 transition-all duration-500 ${
                  isActive
                    ? "opacity-100 delay-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-4"
                }`}
              >
                {/* Baris Atas: Kode & Metadata */}
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-300/80">
                    <span className="font-mono tracking-wider font-semibold text-[#DFC48E]">
                      {item.kode}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm">
                      {item.tahun}
                    </span>
                  </div>

                  {/* Badges Topik & Corak */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${topikStyle.bg} ${topikStyle.teks}`}
                    >
                      {item.topik}
                    </span>
                    <span className="rounded-md border border-[#C9A96E]/40 bg-[#C9A96E]/15 px-2 py-0.5 text-[11px] font-medium text-[#F5EED6]">
                      {item.corak}
                    </span>
                  </div>

                  {/* Judul Utama dengan Font Display Instrument Serif */}
                  <h3 className="font-display mt-4 text-2xl font-normal leading-[1.1] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)] lg:text-3xl">
                    {item.judul}
                  </h3>

                  {/* Nama Lembaga Penyelenggara */}
                  <p className="mt-2.5 text-xs text-stone-300/90 leading-relaxed">
                    {item.lembaga}
                  </p>
                </div>

                {/* Baris Bawah: Rujukan & Tombol Aksi */}
                <div className="border-t border-white/15 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs text-stone-300">
                      <BookOpen className="h-4 w-4 text-[#DFC48E]" />
                      <span>{item.jumlahRujukan} Ibarat Kitab</span>
                    </div>

                    <Link
                      href={`/masalah/${item.slug}`}
                      className="group/btn inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#1E3F30] shadow hover:bg-[#F4F3EE] transition-all"
                    >
                      <span>Buka Keputusan</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TAMPILAN MOBILE: Horizontal Scroll Carousel dengan Snap */}
      <div className="tanpa-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:hidden">
        {items.map((item) => {
          const topikStyle = WARNA_TOPIK[item.topik];
          return (
            <div
              key={item.kode}
              className={`relative h-[380px] w-[82vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[20px] border border-[#C9A96E]/30 bg-gradient-to-b ${item.gradasi} p-5 text-white shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-300/80">
                  <span className="font-mono font-semibold text-[#DFC48E]">
                    {item.kode}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                    {item.tahun}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${topikStyle.bg} ${topikStyle.teks}`}
                  >
                    {item.topik}
                  </span>
                  <span className="rounded-md border border-[#C9A96E]/40 bg-[#C9A96E]/15 px-2 py-0.5 text-[10px] text-[#F5EED6]">
                    {item.corak}
                  </span>
                </div>

                <h3 className="font-display mt-3 text-xl font-normal leading-snug text-white">
                  {item.judul}
                </h3>

                <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                  {item.lembaga}
                </p>
              </div>

              <div className="border-t border-white/15 pt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-stone-300">
                  <BookOpen className="h-3.5 w-3.5 text-[#DFC48E]" />
                  <span>{item.jumlahRujukan} Ibarat</span>
                </span>
                <Link
                  href={`/masalah/${item.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E3F30]"
                >
                  <span>Buka</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
