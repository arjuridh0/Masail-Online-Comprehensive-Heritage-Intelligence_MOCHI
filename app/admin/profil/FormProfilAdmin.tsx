"use client";

import { useState, useActionState } from "react";
import { Eye, EyeOff, KeyRound, Save, UserCheck } from "lucide-react";
import {
  ubahProfilAdminAction,
  ubahKataSandiAdminAction,
} from "@/app/admin/actions";

export default function FormProfilAdmin({ namaAwal }: { namaAwal: string }) {
  const [showSandi, setShowSandi] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [profilState, profilAction, isPendingProfil] = useActionState(
    ubahProfilAdminAction,
    null
  );
  const [sandiState, sandiAction, isPendingSandi] = useActionState(
    ubahKataSandiAdminAction,
    null
  );

  return (
    <div className="space-y-6">
      {/* 1. Form Edit Nama Profil */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 text-[#1E3F30] font-bold text-sm">
          <UserCheck className="h-4 w-4" />
          <span>Perbarui Nama Administrator</span>
        </div>

        <form action={profilAction} className="space-y-4">
          <div>
            <label
              htmlFor="nama_admin_input"
              className="text-xs font-semibold text-stone-700 block mb-1"
            >
              Nama Tampilan Admin *
            </label>
            <input
              id="nama_admin_input"
              name="nama"
              required
              defaultValue={namaAwal}
              placeholder="Contoh: Admin Pusat MOCHI"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
            />
          </div>

          {profilState?.error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 border border-rose-200">
              {profilState.error}
            </p>
          )}

          {profilState?.success && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-200">
              {profilState.message}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPendingProfil}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white hover:bg-[#2D5A46] transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isPendingProfil ? "Menyimpan..." : "Simpan Nama Admin"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Form Ubah Kata Sandi */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 text-stone-900 font-bold text-sm">
          <KeyRound className="h-4 w-4 text-[#8C733E]" />
          <span>Ubah Kata Sandi Admin</span>
        </div>

        <form action={sandiAction} className="space-y-4">
          <div>
            <label
              htmlFor="sandi_baru_admin"
              className="text-xs font-semibold text-stone-700 block mb-1"
            >
              Kata Sandi Baru *
            </label>
            <div className="relative">
              <input
                id="sandi_baru_admin"
                type={showSandi ? "text" : "password"}
                name="sandi_baru"
                required
                placeholder="Minimal 10 karakter"
                className="w-full rounded-xl border border-stone-300 py-2 pl-3 pr-10 text-xs text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
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
              htmlFor="konfirmasi_sandi_admin"
              className="text-xs font-semibold text-stone-700 block mb-1"
            >
              Konfirmasi Kata Sandi Baru *
            </label>
            <div className="relative">
              <input
                id="konfirmasi_sandi_admin"
                type={showKonfirmasi ? "text" : "password"}
                name="konfirmasi_sandi"
                required
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-stone-300 py-2 pl-3 pr-10 text-xs text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
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

          {sandiState?.error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 border border-rose-200">
              {sandiState.error}
            </p>
          )}

          {sandiState?.success && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-200">
              {sandiState.message}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPendingSandi}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-800 px-4 py-2 text-xs font-bold text-white hover:bg-stone-900 transition-colors"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>{isPendingSandi ? "Mengubah..." : "Ubah Kata Sandi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
