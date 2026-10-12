"use client";

import React from "react";
import { Copy } from "lucide-react";
import { FuseButton } from "@/components/ui/FuseButton";
import { toast } from "@/components/ui/SwipeToast";

export function SalinIbaratButton({ teks }: { teks: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(teks);
      toast.success("Teks ibarat berhasil disalin ke papan klip");
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

  return (
    <FuseButton
      label="Salin Ibarat"
      fuseLabel="Tersalin!"
      duration={1800}
      onConfirm={handleCopy}
      variant="secondary"
      icon={<Copy className="h-3 w-3 text-stone-500" />}
      className="bg-white/90 shadow-2xs text-[11px]"
    />
  );
}
