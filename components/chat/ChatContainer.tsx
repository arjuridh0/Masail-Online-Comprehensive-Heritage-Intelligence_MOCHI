"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, AlertCircle, RotateCcw, ShieldAlert } from "lucide-react";
import { ThoughtLine } from "@/components/ui/ThoughtLine";
import { KataBertahap, Muncul } from "@/components/mochi/Gerak";
import { MochiMascot } from "@/components/mochi/MochiMascot";
import { FormatJawabanMochi } from "@/components/chat/FormatJawabanMochi";

export interface MessageSource {
  id: string;
  kode: string;
  judul: string;
  slug: string;
  skor?: number;
  lembaga_nama?: string;
  tahun?: number;
  topik?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thoughts?: string[];
  sources?: MessageSource[];
  isStreaming?: boolean;
  startTime?: number;
  endTime?: number;
  error?: string;
}

const SARAN_PERTANYAAN = [
  "Hukum zakat penghasilan dan profesi bulanan",
  "Pemanfaatan tes DNA forensik untuk ilhaq al-nasab",
  "Keringanan jama' dan qashar bagi pekerja kilang",
  "Hukum skema paylater dengan denda keterlambatan",
  "Ketetapan mahar berupa hafalan surat Al-Qur'an",
];

const SAPAAN_MOCHI = [
  "Assalamu'alaikum!",
  "Ada fiqih yang mau ditelaah?",
  "Aku siap bantu cari ibarat!",
  "Tanya apa saja seputar bahtsul masail ✨",
  "Bismillah, mari kita kaji!",
];

export function ChatContainer({
  compact = false,
  _onOpenFullPage,
}: {
  compact?: boolean;
  _onOpenFullPage?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sapaanIdx, setSapaanIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHydrated = useRef(false);

  // 1. Muat riwayat obrolan dari sessionStorage saat komponen dimuat (tahan navigasi & expand modal)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("mochi_chat_history");
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Pastikan flag streaming ditutup jika sempat terputus
          setMessages(parsed.map((m) => ({ ...m, isStreaming: false })));
        }
      }
    } catch (e) {
      console.warn("Gagal memulihkan sesi obrolan MOCHI:", e);
    } finally {
      isHydrated.current = true;
    }
  }, []);

  // 2. Sinkronkan riwayat obrolan ke sessionStorage setiap kali ada pesan baru
  useEffect(() => {
    if (!isHydrated.current || typeof window === "undefined") return;
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("mochi_chat_history", JSON.stringify(messages));
      } else {
        sessionStorage.removeItem("mochi_chat_history");
      }
    } catch (e) {
      console.warn("Gagal menyimpan sesi obrolan MOCHI:", e);
    }
  }, [messages]);

  const handleReset = () => {
    setMessages([]);
    setInput("");
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("mochi_chat_history");
      } catch {}
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = (customQuery || input).trim();
    if (!q || isPending) return;

    setInput("");
    setIsPending(true);

    const userMsgId = `user_${Date.now()}`;
    const assistantMsgId = `assistant_${Date.now()}`;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: q,
      },
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        thoughts: [],
        sources: [],
        isStreaming: true,
        startTime: Date.now(),
      },
    ];

    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pertanyaan: q }),
      });

      if (!res.ok) {
        let errMessage = "Gagal menghubungi sistem AI";
        try {
          const errData = await res.json();
          if (errData.error) errMessage = errData.error;
        } catch {}
        throw new Error(errMessage);
      }

      if (!res.body) throw new Error("Respon server kosong.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6);

          try {
            const chunk = JSON.parse(jsonStr);

            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantMsgId) return msg;

                if (chunk.type === "thought" && chunk.content) {
                  return {
                    ...msg,
                    thoughts: [...(msg.thoughts || []), chunk.content],
                  };
                }

                if (chunk.type === "token" && chunk.content) {
                  return {
                    ...msg,
                    content: msg.content + chunk.content,
                  };
                }

                if (chunk.type === "sources" && chunk.sources) {
                  return {
                    ...msg,
                    sources: chunk.sources,
                  };
                }

                if (chunk.type === "error" && chunk.error) {
                  return {
                    ...msg,
                    error: chunk.error,
                  };
                }

                if (chunk.type === "done") {
                  return {
                    ...msg,
                    isStreaming: false,
                    endTime: Date.now(),
                  };
                }

                return msg;
              })
            );
          } catch {}
        }
      }
    } catch (err: unknown) {
      let pesanError =
        err instanceof Error ? err.message : "Terjadi kesalahan saat memproses jawaban.";
      if (
        typeof pesanError === "string" &&
        (pesanError.toLowerCase().includes("failed to fetch") ||
          pesanError.toLowerCase().includes("networkerror") ||
          pesanError.toLowerCase().includes("load failed"))
      ) {
        pesanError =
          "Mohon maaf, koneksi ke asisten AI terputus sesaat. Pastikan jaringan internet stabil atau klik Coba Lagi di bawah.";
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== assistantMsgId) return msg;
          return {
            ...msg,
            isStreaming: false,
            error: pesanError,
          };
        })
      );
    } finally {
      setIsPending(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  const isStreamingNow = messages.some((m) => m.role === "assistant" && m.isStreaming);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#F4F3EE]">
      {/* 0. SEAMLESS COMPACT COMPANION TOPBAR (HANYA MUNCUL KETIKA PERCAKAPAN AKTIF) */}
      {messages.length > 0 && (
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E3DC]/70 bg-[#F4F3EE]/85 px-4 py-2 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <MochiMascot
              size={compact ? 34 : 40}
              state={
                isPending
                  ? "thinking"
                  : isStreamingNow
                  ? "answering"
                  : isInputFocused || input.length > 0
                  ? "listening"
                  : "idle"
              }
              isInputFocused={isInputFocused || input.length > 0}
              showSpeechBubble={false}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3F30]">
                <span>Tanya MOCHI</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-stone-500 font-medium">
                {isPending
                  ? "Sedang menelaah kitab turats..."
                  : isStreamingNow
                  ? "Menjawab dari arsip bahtsul masail..."
                  : isInputFocused || input.length > 0
                  ? "Mendengarkan pertanyaan Anda..."
                  : "Sanad Fiqih Pesantren Terverifikasi"}
              </span>
            </div>
          </div>

          {/* Tombol Mulai Ulang / Obrolan Baru */}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E3DC] bg-white/80 px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 hover:bg-white hover:text-stone-900 transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Mulai obrolan baru"
          >
            <RotateCcw className="h-3 w-3 text-stone-400" />
            <span className="hidden sm:inline">Obrolan Baru</span>
          </button>
        </div>
      )}

      {/* 1. AREA PERCAKAPAN DENGAN SCROLL INTERNAL TERISOLASI */}
      <div className={`flex-1 overflow-y-auto overscroll-contain ${compact ? "p-4 space-y-4" : "p-5 md:p-8 space-y-6"}`}>
        {messages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-6" : "py-10 md:py-14"}`}>
            {/* HERO MASCOT DI TENGAH KANVAS (LEGA, INTERAKTIF, MENYATU DENGAN OBROLAN) */}
            <div
              className="relative mb-5 flex flex-col items-center pt-8 cursor-pointer group"
              onClick={() => setSapaanIdx((prev) => (prev + 1) % SAPAAN_MOCHI.length)}
              title="Klik MOCHI untuk menyapa santri!"
            >
              <MochiMascot
                size={compact ? 84 : 102}
                state={
                  isInputFocused || input.length > 0
                    ? "listening"
                    : "idle"
                }
                isInputFocused={isInputFocused || input.length > 0}
                showSpeechBubble={true}
                speechText={
                  isInputFocused || input.length > 0
                    ? "Aku mendengarkan..."
                    : SAPAAN_MOCHI[sapaanIdx]
                }
              />
            </div>

            <h1
              className={`font-display text-stone-900 tracking-tight ${
                compact ? "text-2xl" : "text-3xl md:text-4xl"
              }`}
            >
              <KataBertahap
                teks="Tanya MOCHI"
                kelasKata={(_: string, i: number) => (i === 1 ? "italic text-[#1E3F30]" : "")}
              />
            </h1>

            <Muncul
              delay={0.2}
              className={`mx-auto text-stone-600 leading-relaxed ${
                compact ? "mt-2 max-w-xs text-xs" : "mt-2.5 max-w-md text-xs md:text-sm"
              }`}
            >
              Jawaban hanya dari arsip bahtsul masail pesantren Nusantara. Lengkap dengan sanad lembaga, tahun forum, dan rujukan ibarat kitab turats.
            </Muncul>

            {/* Rekomendasi Pertanyaan Cepat */}
            <Muncul
              delay={0.35}
              className={`flex flex-wrap justify-center gap-1.5 ${
                compact ? "mt-5 max-w-sm" : "mt-6 max-w-2xl gap-2"
              }`}
            >
              {SARAN_PERTANYAAN.slice(0, compact ? 3 : 5).map((saran, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSubmit(undefined, saran)}
                  className={`rounded-full border border-[#E5E3DC] bg-white text-stone-700 shadow-2xs transition-all duration-200 hover:border-stone-400 hover:text-stone-900 active:scale-[0.98] ${
                    compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs md:text-[13px]"
                  }`}
                >
                  {saran}
                </button>
              ))}
            </Muncul>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-[20px] rounded-tr-xs bg-[#1E3F30] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xs">
                    {msg.content}
                  </div>
                ) : (
                  <div className="w-full rounded-[22px] rounded-tl-xs border border-[#E5E3DC] bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
                    {/* Header Kartu Asisten MOCHI dengan Maskot Hidup */}
                    <div className="flex items-center justify-between border-b border-[#E5E3DC]/60 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="cursor-pointer transition-transform hover:scale-110 active:scale-95 shrink-0"
                          title="MOCHI — Asisten Fiqih Pesantren"
                        >
                          <MochiMascot
                            size={32}
                            state={
                              msg.isStreaming
                                ? "thinking"
                                : (msg.sources && msg.sources.length > 0)
                                ? "happy"
                                : "answering"
                            }
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#1E3F30]">Tanya MOCHI</span>
                            <span className="rounded-full bg-emerald-100/80 px-1.5 py-0.2 text-[9px] font-bold text-[#1E3F30] border border-emerald-200">
                              Asisten Fiqih
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {msg.isStreaming
                              ? "Sedang menelaah ibarat kitab turats..."
                              : (msg.sources && msg.sources.length > 0)
                              ? "Sanad terverifikasi dari arsip forum"
                              : "Jawaban telaah khazanah pesantren"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning ThoughtLine */}
                    <ThoughtLine
                      thoughts={msg.thoughts || []}
                      isStreaming={Boolean(msg.isStreaming)}
                      startTime={msg.startTime}
                      endTime={msg.endTime}
                    />

                    {/* PENAFIAN TEGAS & ADAB MERUJUK (BUKAN FATWA MANDIRI) */}
                    {(msg.content || msg.isStreaming) && (
                      <div className="rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-50/70 to-amber-50 p-3 text-xs text-amber-950 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold tracking-wide text-amber-900 text-[11px] uppercase">
                          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
                          <span>PENAFIAN PENTING & ADAB MERUJUK (BUKAN FATWA MANDIRI)</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
                          Ikhtisar ini dirangkum oleh kecerdasan buatan (AI) dari dokumen musyawarah Bahtsul Masail Nahdlatul Ulama yang terhimpun di repositori MOCHI. <strong>Bukan fatwa hukum perorangan</strong>. Untuk kepastian hukum persoalan pribadi, konsultasikan langsung kepada para kiai dan alim ulama terpercaya.
                        </p>
                      </div>
                    )}

                    {/* Konten Jawaban Terformat Rapi & Elegan */}
                    {(msg.content || msg.isStreaming) && (
                      <div className="w-full">
                        <FormatJawabanMochi
                          content={msg.content}
                          isStreaming={msg.isStreaming}
                        />
                      </div>
                    )}

                    {/* Sumber Sitasi Terverifikasi */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 border-t border-[#E5E3DC] pt-3">
                        <p className="alis mb-2 text-[10px]">Rujukan Keputusan Terarsip:</p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {msg.sources.map((s, idx) => (
                            <Link
                              key={s.id || idx}
                              href={`/masalah/${s.slug}`}
                              className="group flex items-start justify-between gap-2 rounded-xl border border-[#E5E3DC] bg-stone-50/70 p-2.5 transition-all hover:border-stone-400 hover:bg-white"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-xs text-stone-900 group-hover:text-[#1E3F30]">
                                  {s.judul}
                                </span>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                                  <span className="font-mono text-stone-500">
                                    {s.kode}
                                  </span>
                                  {s.skor && s.skor > 0 ? (
                                    <span className="rounded-full bg-[#1E3F30]/10 border border-[#1E3F30]/20 px-1.5 py-0.2 font-bold text-[#1E3F30] text-[9px] leading-none">
                                      Kemiripan {Math.round(s.skor * 100)}%
                                    </span>
                                  ) : null}
                                  {s.tahun ? (
                                    <span className="text-stone-400">
                                      &bull; {s.tahun}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-stone-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1E3F30]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Penanganan Galat */}
                    {msg.error && (
                      <div className="mt-2 flex flex-col gap-2 rounded-xl bg-red-50/90 p-3 text-xs text-red-700 border border-red-200/80">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                          <p className="flex-1 font-medium">{msg.error}</p>
                        </div>
                        {messages[messages.indexOf(msg) - 1]?.content && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const idx = messages.indexOf(msg);
                                const prevUserMsg = messages[idx - 1]?.content;
                                if (prevUserMsg) {
                                  handleSubmit(undefined, prevUserMsg);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1 text-[11px] font-bold text-red-800 hover:bg-red-200 transition-colors active:scale-95 shadow-2xs"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Coba Lagi</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timestamp & Penafian Halus */}
                    <div className="pt-1 text-[10px] text-stone-400">
                      Rangkuman keputusan musyawarah bahtsul masail pesantren, bukan fatwa pribadi.
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 2. FOOTER INPUT SOLID */}
      <div className={`shrink-0 border-t border-[#E5E3DC] bg-[#F4F3EE] ${compact ? "p-3" : "p-4 md:p-5"}`}>
        <form onSubmit={(e) => handleSubmit(e)} className="w-full">
          <div className="flex items-center gap-2 rounded-full border border-[#E5E3DC] bg-white p-1 pl-4 shadow-xs focus-within:border-[#1E3F30] focus-within:shadow-md transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isPending}
              placeholder="Tulis pertanyaan fiqih Anda..."
              aria-label="Pertanyaan fiqih untuk MOCHI"
              maxLength={300}
              className={`flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400 ${
                compact ? "h-9 text-xs" : "h-11 text-sm md:text-[15px]"
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              aria-label="Kirim pertanyaan"
              className={`flex items-center justify-center rounded-full bg-[#1E3F30] text-white transition-all hover:bg-[#2D5A46] active:scale-[0.98] disabled:opacity-30 shrink-0 shadow-xs ${
                compact ? "h-9 w-9" : "h-11 w-11"
              }`}
            >
              <ArrowUp className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-stone-400">
            MOCHI merangkum dari data arsip forum, bukan fatwa mandiri.
          </p>
        </form>
      </div>
    </div>
  );
}
