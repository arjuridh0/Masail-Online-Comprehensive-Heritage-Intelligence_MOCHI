import type { Metadata } from "next";
import { ChatContainer } from "@/components/chat/ChatContainer";

export const metadata: Metadata = {
  title: "Tanya MOCHI — Pencarian Fiqih Berbasis Sanad Bahtsul Masail",
  description:
    "Ajukan pertanyaan fiqih kontemporer. MOCHI menjawab hanya dari keputusan forum bahtsul masail pesantren yang sah dengan sitasi rujukan kitab turats.",
};

export default function TanyaPage() {
  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col justify-between overflow-hidden">
      <main id="main-content" className="flex-1 mx-auto flex w-full max-w-4xl flex-col px-4 sm:px-6 min-h-0 overflow-hidden">
        <ChatContainer />
      </main>

      {/* FOOTER RESMI MINIMALIS */}
      <footer className="border-t border-[#E5E3DC] bg-white py-2.5 px-4 shrink-0">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-stone-500">
          <p className="font-semibold text-[#1E3F30]">MOCHI &mdash; Masail Online &amp; Comprehensive Heritage Intelligence</p>
          <p>&copy; 2026 Repositori Resmi Bahtsul Masail Pesantren Nusantara.</p>
        </div>
      </footer>
    </div>
  );
}