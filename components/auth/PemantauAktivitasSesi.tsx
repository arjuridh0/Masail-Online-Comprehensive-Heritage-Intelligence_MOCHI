"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Batas idle timeout: 60 menit (1 jam)
const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const STORAGE_KEY = "mochi_terakhir_aktif";

export default function PemantauAktivitasSesi() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Catat waktu aktivitas terkini
    const catatAktivitas = () => {
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch {
        // Abaikan jika storage dinonaktifkan
      }
    };

    // Periksa apakah waktu idle sudah melebihi 60 menit
    const periksaIdle = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Hanya aktif bila ada sesi login
        if (!session) return;

        const tersimpan = localStorage.getItem(STORAGE_KEY);
        const terakhirAktif = tersimpan ? parseInt(tersimpan, 10) : Date.now();
        const selisih = Date.now() - terakhirAktif;

        if (selisih >= IDLE_TIMEOUT_MS) {
          // Lakukan logout otomatis
          await supabase.auth.signOut();
          localStorage.removeItem(STORAGE_KEY);
          router.push("/masuk?alasan=timeout");
        }
      } catch (err) {
        console.error("Gagal periksa idle sesi:", err);
      }
    };

    catatAktivitas();

    // Event listener interaksi pengguna
    const events = ["pointerdown", "keydown", "wheel", "touchstart"];
    const handleEvent = () => {
      catatAktivitas();
    };

    events.forEach((ev) => window.addEventListener(ev, handleEvent, { passive: true }));

    // Cek idle setiap 30 detik
    timerRef.current = setInterval(periksaIdle, 30_000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleEvent));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [router]);

  return null;
}
