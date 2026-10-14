"use client";

import { useState, useActionState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  Save,
  Upload,
} from "lucide-react";
import {
  updateProfilLembagaAction,
  ubahKataSandiLembagaAction,
} from "@/app/dasbor/actions";
import { toast } from "@/components/ui/SwipeToast";

export interface ProfilLembagaData {
  nama: string;
  jenis: string;
  nspp: string | null;
  namaPenanggungJawab: string;
  deskripsi: string | null;
  alamat: string | null;
  kota: string;
  provinsi: string;
  kontak_telepon: string | null;
  kontak_email: string | null;
  situs_web: string | null;
  logo_url: string | null;
}

export default function FormProfilLembaga({
  initialData,
}: {
  initialData: ProfilLembagaData;
}) {
  const [activeTab, setActiveTab] = useState<"profil" | "sandi">("profil");
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData.logo_url
  );
  const [showSandi, setShowSandi] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const [profilState, profilAction, isPendingProfil] = useActionState(
    updateProfilLembagaAction,
    null
  );
  const [sandiState, sandiAction, isPendingSandi] = useActionState(
    ubahKataSandiLembagaAction,
    null
  );

  // Trigger SwipeToast setelah aksi profil selesai
  useEffect(() => {
    if (profilState?.success) {
      toast.success(profilState.message || "Profil berhasil diperbarui.");
    } else if (profilState?.error) {
      toast.error(profilState.error);
    }
  }, [profilState]);

  // Trigger SwipeToast setelah aksi sandi selesai
  useEffect(() => {
    if (sandiState?.success) {
      toast.success(sandiState.message || "Kata sandi berhasil diubah.");
    } else if (sandiState?.error) {
      toast.error(sandiState.error);
    }
  }, [sandiState]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };


  return (
    <div className="space-y-6">
      {/* Tab Navigasi Profil / Kata Sandi */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("profil")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "profil"
              ? "bg-[#1E3F30] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Identitas &amp; Informasi Lembaga</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sandi")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "sandi"
              ? "bg-[#1E3F30] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>Keamanan &amp; Kata Sandi</span>
        </button>
      </div>

      {activeTab === "profil" && (
        <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Bidang Terkunci (Read-Only) */}
          <div className="rounded-2xl border border-stone-200 bg-[#FAF8F2] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Identitas Terverifikasi Kemenag (Terkunci)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <span className="text-stone-500 block">Nama Lembaga:</span>
                <strong className="text-stone-900 block mt-0.5">
                  {initialData.nama}
                </strong>
              </div>

              <div>
                <span className="text-stone-500 block">Jenis Lembaga:</span>
                <strong className="text-stone-900 block mt-0.5 capitalize">
                  {initialData.jenis.replace("_", " ")}
                </strong>
              </div>

              <div>
                <span className="text-stone-500 block">NSPP (Nomor Statistik):</span>
                <span className="font-mono font-extrabold text-[#1E3F30] block mt-0.5">
                  {initialData.nspp || "Non-Pesantren (SK Kepengurusan)"}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/60">
              * Nomor NSPP dan nama resmi dikunci demi integritas keabsahan data Kemenag. Hubungi Admin Pusat jika memerlukan koreksi legalitas.
            </p>
          </div>

          <form action={profilAction} className="space-y-5">
            {/* Bagian Logo Lembaga */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-2">
                Logo Resmi Pesantren / Lembaga
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo Lembaga"
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-stone-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label
                    htmlFor="logo_file"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-all"
                  >
                    <Upload className="h-3.5 w-3.5 text-stone-500" />
                    <span>Pilih Berkas Logo Baru</span>
                    <input
                      id="logo_file"
                      name="logo_file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-[11px] text-stone-400">
                    Format JPG, PNG, atau WebP (maksimal 3 MB). Disarankan rasio persegi (1:1).
                  </p>
                </div>
              </div>

              {/* Opsi Fallback URL Logo */}
              <input
                type="hidden"
                name="logo_url"
                defaultValue={initialData.logo_url || ""}
              />
            </div>

            {/* Nama Penanggung Jawab */}
            <div className="pt-2 border-t border-stone-100">
              <label
                htmlFor="nama_penanggung_jawab"
                className="text-xs font-semibold text-stone-700 block mb-1"
              >
                Nama Lengkap Penanggung Jawab / Admin Pengelola *
              </label>
              <div className="relative">
                <input
                  id="nama_penanggung_jawab"
                  type="text"
                  name="nama_penanggung_jawab"
                  required
                  defaultValue={initialData.namaPenanggungJawab}
                  placeholder="Contoh: Ustadz Ahmad Fauzi"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
                />
              </div>
            </div>

            {/* Deskripsi Profil */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Deskripsi Lembaga / Riwayat Singkat Bahtsul Masail
              </label>
              <textarea
                name="deskripsi"
                rows={4}
                defaultValue={initialData.deskripsi || ""}
                placeholder="Jelaskan sejarah singkat, pengasuh, tradisi bahtsul masail, dan fokus keilmuan pesantren..."
                className="w-full rounded-xl border border-stone-300 p-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#1E3F30] focus:outline-hidden"
              />
            </div>

            {/* Wilayah */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kabupaten / Kota *
                </label>
                <input
                  type="text"
                  name="kota"
                  required
                  defaultValue={initialData.kota}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Provinsi *
                </label>
                <input
                  type="text"
                  name="provinsi"
                  required
                  defaultValue={initialData.provinsi}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Alamat Lengkap
              </label>
              <input
                type="text"
                name="alamat"
                defaultValue={initialData.alamat || ""}
                placeholder="Jl. KH. Abdul Karim No. ..., Desa/Kel. ..."
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
              />
            </div>

            {/* Kontak Telepon & Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Kontak Resmi
                </label>
                <input
                  type="email"
                  name="kontak_email"
                  defaultValue={initialData.kontak_email || ""}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  name="kontak_telepon"
                  defaultValue={initialData.kontak_telepon || ""}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
                />
              </div>
            </div>

            {/* Situs Web */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Situs Web Resmi (Opsional)
              </label>
              <input
                type="url"
                name="situs_web"
                defaultValue={initialData.situs_web || ""}
                placeholder="https://pesantren.org"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
              />
            </div>

            {profilState?.error && (
              <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 border border-rose-200" role="alert">
                {profilState.error}
              </p>
            )}

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={isPendingProfil}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F30] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2D5A46] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isPendingProfil ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Pembaruan Profil</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "sandi" && (
        <div className="rounded-3xl border border-[#D9D3C3] bg-white p-6 sm:p-8 shadow-xs max-w-xl">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 text-stone-900 font-bold text-sm">
            <KeyRound className="h-4 w-4 text-[#8C733E]" />
            <span>Perbarui Kata Sandi Akun Pengelola</span>
          </div>

          <form action={sandiAction} className="space-y-4">
            <div>
              <label
                htmlFor="sandi_baru"
                className="text-xs font-semibold text-stone-700 block mb-1"
              >
                Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  id="sandi_baru"
                  type={showSandi ? "text" : "password"}
                  name="sandi_baru"
                  required
                  placeholder="Minimal 10 karakter"
                  className="w-full rounded-xl border border-stone-300 py-2 pl-3 pr-10 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
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
                htmlFor="konfirmasi_sandi"
                className="text-xs font-semibold text-stone-700 block mb-1"
              >
                Konfirmasi Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  id="konfirmasi_sandi"
                  type={showKonfirmasi ? "text" : "password"}
                  name="konfirmasi_sandi"
                  required
                  placeholder="Ulangi kata sandi baru"
                  className="w-full rounded-xl border border-stone-300 py-2 pl-3 pr-10 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#1E3F30]"
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E3F30] px-4 py-2 text-xs font-bold text-white hover:bg-[#2D5A46] transition-colors"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{isPendingSandi ? "Mengubah..." : "Ubah Kata Sandi"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
