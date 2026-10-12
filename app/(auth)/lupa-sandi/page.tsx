"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { lupaSandiAction } from "@/app/api/auth/actions";

export default function LupaSandiPage() {
  const [state, formAction, isPending] = useActionState(lupaSandiAction, null);
  const [email, setEmail] = useState("");

  return (
    <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 border-b border-stone-100 pb-4">
        <Link
          href="/masuk"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#1E3F30] mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Masuk</span>
        </Link>
        <h1 className="text-xl font-black text-[#1E3F30]">
          Reset Kata Sandi
        </h1>
        <p className="mt-1 text-xs text-stone-500">
          Masukkan alamat email terdaftar untuk menerima tautan pemulihan kata sandi akun Anda.
        </p>
      </div>

      {state?.success ? (
        <div className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
          <h2 className="text-base font-bold text-emerald-900">
            Tautan Terkirim
          </h2>
          <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
            Instruksi pemulihan kata sandi telah dikirimkan ke <strong>{state.email}</strong>. Silakan periksa kotak masuk atau folder spam email Anda.
          </p>

          {state.pesanTambahan && (
            <p className="mt-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-left leading-relaxed">
              {state.pesanTambahan}
            </p>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/masuk"
              className="inline-block rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2D5A46] shadow-xs"
            >
              Kembali ke Masuk
            </Link>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 border border-rose-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {state.error}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Alamat Email Terdaftar
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sekretariat@pesantren.id"
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#1E3F30] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[#1E3F30] py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#2D5A46] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isPending ? "Memeriksa Database & Mengirim..." : "Kirim Tautan Pemulihan"}
          </button>
        </form>
      )}
    </div>
  );
}