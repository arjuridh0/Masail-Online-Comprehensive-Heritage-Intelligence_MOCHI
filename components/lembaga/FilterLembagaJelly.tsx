"use client";

import { useRouter, useSearchParams } from "next/navigation";
import JellyRadio, { type JellyRadioItem } from "@/components/ui/JellyRadio";

const FILTER_ITEMS: JellyRadioItem[] = [
  { value: "semua", label: "Semua" },
  { value: "pesantren", label: "Pesantren" },
  { value: "lembaga", label: "Lembaga" },
];

export function FilterLembagaJelly({
  jenisTerpilih = "semua",
}: {
  jenisTerpilih?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (val === "semua") {
      params.delete("jenis");
    } else {
      params.set("jenis", val);
    }
    router.push(`/lembaga?${params.toString()}`);
  };

  return (
    <div className="flex items-center">
      <JellyRadio
        items={FILTER_ITEMS}
        value={jenisTerpilih}
        onChange={handleChange}
        size="sm"
        chipColor="#FFFFFF"
        activeColor="#1E3F30"
        textColor="#57534E"
        activeTextColor="#FFFFFF"
        gap={6}
        ariaLabel="Filter Kategori Lembaga"
      />
    </div>
  );
}