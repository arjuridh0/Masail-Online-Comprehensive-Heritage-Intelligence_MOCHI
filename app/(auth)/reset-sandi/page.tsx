"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetSandiPage() {
  const router = useRouter();
  const [sandiBaru, setSandiBaru] = useState("");
  const [konfirmasiSandi, setKonfirmasiSandi] = useState("");
  const [showSandi, setShowSandi] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (sandiBaru.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    if (sandiBaru !== konfirmasiSandi) {
      setError("Konfirmasi kata sandi tidak cocok. Silakan ketik ulang.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: sandiBaru,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/masuk?pesan=sandi_berhasil_diperbarui");
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui kata sandi. Tautan pemulihan mungkin sudah kedaluwarsa."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <Link
            href="/masuk"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#1E3F30] mb-3 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#1E3F30]">
              <KeyRound className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-black text-[#1E3F30]">
              Buat Kata Sandi Baru
            </h1>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Ketik kata sandi baru untuk akun pengelola pesantren atau administrator Anda.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
            <h2 className="text-base font-bold text-emerald-900">
              Kata Sandi Berhasil Diperbarui
            </h2>
            <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
              Kata sandi baru Anda telah aktif. Mengalihkan Anda ke halaman masuk...
            </p>
            <Link
              href="/masuk"
              className="mt-6 inline-block rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2D5A46] transition-colors"
            >
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="sandi_baru_reset"
                className="text-xs font-semibold text-stone-700 block mb-1"
              >
                Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  id="sandi_baru_reset"
                  type={showSandi ? "text" : "password"}
                  required
                  value={sandiBaru}
                  onChange={(e) => setSandiBaru(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-stone-300 py-2.5 pl-3 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowSandi((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showSandi ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  tabIndex={-1}
                >
                  {showSandi ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="konfirmasi_sandi_reset"
                className="text-xs font-semibold text-stone-700 block mb-1"
              >
                Konfirmasi Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  id="konfirmasi_sandi_reset"
                  type={showKonfirmasi ? "text" : "password"}
                  required
                  value={konfirmasiSandi}
                  onChange={(e) => setKonfirmasiSandi(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full rounded-xl border border-stone-300 py-2.5 pl-3 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowKonfirmasi((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showKonfirmasi ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  tabIndex={-1}
                >
                  {showKonfirmasi ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#1E3F30] py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2D5A46] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              <span>{isSubmitting ? "Menyimpan Kata Sandi..." : "Simpan Kata Sandi Baru"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
