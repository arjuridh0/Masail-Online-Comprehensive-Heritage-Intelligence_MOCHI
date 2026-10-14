"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, FileCheck2, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import KerangkaAkun, { Bidang, gayaInput, gayaTombolUtama } from "@/components/mochi/KerangkaAkun";
import { daftarAction } from "@/app/api/auth/actions";

const LANGKAH = ["Identitas Lembaga", "Akun Pengelola", "Dokumen Legalitas"];

export default function DaftarPage() {
  const [state, formAction, isPending] = useActionState(daftarAction, null);
  const [langkah, setLangkah] = useState(0);

  // Form State
  const [namaLembaga, setNamaLembaga] = useState("");
  const [jenis, setJenis] = useState("pesantren");
  const [nspp, setNspp] = useState("");
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kontak, setKontak] = useState("");
  const [namaPj, setNamaPj] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [berkasNama, setBerkasNama] = useState("");

  const [langkahGalat, setLangkahGalat] = useState("");

  const isPesantren = jenis === "pesantren";

  // Validasi sebelum pindah langkah
  const handleLanjut = () => {
    setLangkahGalat("");
    if (langkah === 0) {
      if (!namaLembaga.trim()) {
        setLangkahGalat("Nama lembaga wajib diisi.");
        return;
      }
      if (isPesantren) {
        if (!nspp || !/^\d{12}$/.test(nspp.trim())) {
          setLangkahGalat("Nomor Statistik Pesantren (NSPP) wajib 12 digit angka.");
          return;
        }
      }
      if (!kota.trim() || !provinsi.trim()) {
        setLangkahGalat("Kota dan provinsi wajib diisi.");
        return;
      }
      if (!kontak.trim() || kontak.trim().length < 8) {
        setLangkahGalat("Nomor kontak minimal 8 karakter.");
        return;
      }
    } else if (langkah === 1) {
      if (!namaPj.trim()) {
        setLangkahGalat("Nama penanggung jawab wajib diisi.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setLangkahGalat("Format email penanggung jawab tidak valid.");
        return;
      }
      if (!password || password.length < 10) {
        setLangkahGalat("Kata sandi minimal 10 karakter.");
        return;
      }
    }
    setLangkah((prev) => Math.min(prev + 1, 2));
  };

  if (state?.success) {
    return (
      <div data-testid="halaman-daftar-sukses">
        <KerangkaAkun
          alis="Pendaftaran Berhasil"
          judul={
            <>
              Permohonan <em className="text-[#1E3F30]">Terkirim.</em>
            </>
          }
          deskripsi="Admin Pusat MOCHI akan memverifikasi keabsahan data lembaga dan dokumen bukti legalitas sebelum mengaktifkan hak penerbitan keputusan bahtsul masail."
          kaki={
            <Link href="/masuk" className="font-semibold text-[#1E3F30] tautan-garis">
              Masuk ke Halaman Login &rarr;
            </Link>
          }
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-800">
            <p className="font-semibold">Status: Menunggu Verifikasi Admin</p>
            <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
              Kami telah menerima permohonan pendaftaran lembaga Anda. Notifikasi verifikasi akan diinformasikan ke email pengelola yang didaftarkan.
            </p>
          </div>
        </KerangkaAkun>
      </div>
    );
  }

  return (
    <div data-testid="halaman-daftar">
      <KerangkaAkun
        alis="Daftarkan lembaga"
        judul={
          <>
            Pendaftaran <em className="text-[#1E3F30]">Lembaga.</em>
          </>
        }
        deskripsi="Tiga langkah singkat. Setelah diverifikasi admin, lembaga Anda dapat menerbitkan hasil bahtsul masail."
        kaki={
          <>
            Sudah punya akun lembaga?{" "}
            <Link href="/masuk" className="font-medium text-[#1E3F30] tautan-garis">
              Masuk
            </Link>
          </>
        }
      >
        {/* Progress Bar 3 Langkah */}
        <ol className="mb-8 flex items-center gap-2" aria-label="Langkah pendaftaran">
          {LANGKAH.map((l, i) => (
            <li key={l} className="flex flex-1 flex-col gap-2">
              <span
                className={`h-1 rounded-full transition-colors duration-500 ${
                  i <= langkah ? "bg-[#1E3F30]" : "bg-[#E5E3DC]"
                }`}
              />
              <span
                className={`text-xs ${
                  i === langkah ? "font-semibold text-stone-900" : "text-stone-400"
                }`}
              >
                {i + 1}. {l}
              </span>
            </li>
          ))}
        </ol>

        <form action={formAction} className="space-y-4">
          {/* Nilai tersembunyi untuk mempertahankan integritas data seluruh langkah */}
          <input type="hidden" name="nama_lembaga" value={namaLembaga} />
          <input type="hidden" name="jenis" value={jenis} />
          <input type="hidden" name="nspp" value={isPesantren ? nspp : ""} />
          <input type="hidden" name="kota" value={kota} />
          <input type="hidden" name="provinsi" value={provinsi} />
          <input type="hidden" name="telepon" value={kontak} />
          <input type="hidden" name="nama_penanggung_jawab" value={namaPj} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="password" value={password} />

          <AnimatePresence mode="wait">
            <motion.div
              key={langkah}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {langkah === 0 && (
                <>
                  <Bidang
                    label="Nama Resmi Lembaga / Pesantren *"
                    id="nama_lembaga_input"
                    hint="Contoh: LBM PCNU Surabaya atau LBM PP Lirboyo"
                  >
                    <input
                      id="nama_lembaga_input"
                      required
                      value={namaLembaga}
                      onChange={(e) => setNamaLembaga(e.target.value)}
                      className={gayaInput}
                      placeholder="Nama lembaga atau pondok pesantren"
                    />
                  </Bidang>

                  <Bidang label="Jenis Lembaga *" id="jenis">
                    <select
                      id="jenis"
                      value={jenis}
                      onChange={(e) => setJenis(e.target.value)}
                      className={gayaInput}
                    >
                      <option value="pesantren">Pondok Pesantren (Verifikasi via NSPP Kemenag)</option>
                      <option value="lbm_pwnu">LBM PWNU (Verifikasi via SK Kepengurusan)</option>
                      <option value="lbm_pcnu">LBM PCNU (Verifikasi via SK Kepengurusan)</option>
                      <option value="ptki">Perguruan Tinggi Keagamaan Islam</option>
                      <option value="mahad_aly">Ma&apos;had Aly</option>
                    </select>
                  </Bidang>

                  {isPesantren ? (
                    <Bidang
                      label="NSPP (Nomor Statistik Pesantren) *"
                      id="nspp_input"
                      hint="12 digit nomor statistik resmi dari EMIS Ditjen Pesantren Kemenag"
                    >
                      <input
                        id="nspp_input"
                        inputMode="numeric"
                        required
                        value={nspp}
                        onChange={(e) => setNspp(e.target.value)}
                        className={gayaInput}
                        placeholder="Contoh: 510035140003"
                      />
                    </Bidang>
                  ) : (
                    <div className="rounded-xl border border-stone-200 bg-[#FAF8F2] p-3 text-xs text-stone-600">
                      <p className="font-semibold text-[#1E3F30]">Lembaga Non-Pesantren (Tanpa NSPP)</p>
                      <p className="mt-0.5 text-stone-500">
                        Untuk LBM PCNU / PWNU, verifikasi dilakukan melalui unggahan <strong>SK Kepengurusan resmi</strong> pada langkah ke-3.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Bidang label="Kota/Kabupaten *" id="kota_input">
                      <input
                        id="kota_input"
                        required
                        value={kota}
                        onChange={(e) => setKota(e.target.value)}
                        className={gayaInput}
                        placeholder="Surabaya"
                      />
                    </Bidang>
                    <Bidang label="Provinsi *" id="provinsi_input">
                      <input
                        id="provinsi_input"
                        required
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                        className={gayaInput}
                        placeholder="Jawa Timur"
                      />
                    </Bidang>
                  </div>

                  <Bidang label="Kontak Resmi Lembaga (HP / WhatsApp) *" id="kontak_input">
                    <input
                      id="kontak_input"
                      required
                      value={kontak}
                      onChange={(e) => setKontak(e.target.value)}
                      className={gayaInput}
                      placeholder="0812xxxxxxxx"
                    />
                  </Bidang>
                </>
              )}

              {langkah === 1 && (
                <>
                  <Bidang
                    label="Nama Penanggung Jawab / Admin Lembaga *"
                    id="nama_pj_input"
                    hint="Nama ustadz atau sekretaris LBM yang ditugaskan mengelola akun"
                  >
                    <input
                      id="nama_pj_input"
                      required
                      value={namaPj}
                      onChange={(e) => setNamaPj(e.target.value)}
                      className={gayaInput}
                      placeholder="Nama lengkap penanggung jawab"
                    />
                  </Bidang>

                  <Bidang label="Email Akun Masuk *" id="email_input">
                    <input
                      id="email_input"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={gayaInput}
                      placeholder="admin@lembaga.org"
                    />
                  </Bidang>

                  <Bidang
                    label="Kata Sandi Akun *"
                    id="password_input"
                    hint="Minimal 10 karakter kombinasi huruf dan angka"
                  >
                    <div className="relative">
                      <input
                        id="password_input"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${gayaInput} pr-12`}
                        placeholder="••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </Bidang>
                </>
              )}

              {langkah === 2 && (
                <>
                  {isPesantren ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-xs text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="h-5 w-5 text-emerald-700 shrink-0" />
                        <span className="font-bold text-sm text-[#1E3F30]">
                          Verifikasi Berbasis NSPP Kemenag
                        </span>
                      </div>
                      <p className="text-emerald-800 leading-relaxed">
                        Sebagai Pondok Pesantren, keabsahan lembaga Anda diverifikasi langsung melalui <strong>12 digit Nomor Statistik Pesantren (NSPP: {nspp || '-'})</strong> yang terdaftar di pangkalan data EMIS Kemenag RI. Anda <strong>tidak perlu mengunggah dokumen fisik / SK</strong>.
                      </p>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="dokumen_bukti"
                        className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#C8C4BB] bg-white px-6 py-8 text-center transition-colors hover:border-[#1E3F30]"
                      >
                        {berkasNama ? (
                          <FileCheck2 className="h-8 w-8 text-emerald-600" />
                        ) : (
                          <Upload className="h-8 w-8 text-stone-400" />
                        )}
                        <span className="mt-3 text-sm font-medium text-stone-900">
                          {berkasNama || "Unggah SK Kepengurusan Resmi (Wajib) *"}
                        </span>
                        <span className="mt-1 text-xs text-stone-400">
                          Surat Keputusan (SK) Kepengurusan PCNU / PWNU / Asosiasi (PDF, JPG, PNG maks 10 MB)
                        </span>
                        <input
                          id="dokumen_bukti"
                          name="dokumen_bukti"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setBerkasNama(e.target.files?.[0]?.name || "")}
                          className="sr-only"
                        />
                      </label>

                      <p className="text-[11px] text-stone-500 italic text-center">
                        * Demi efisiensi dan keamanan data, berkas SK kepengurusan akan otomatis dihapus dari penyimpanan setelah verifikasi selesai.
                      </p>
                    </>
                  )}

                  <div className="rounded-2xl bg-stone-100/70 p-4 text-xs text-stone-600 space-y-1">
                    <p className="font-semibold text-stone-900">Ringkasan Calon Mitra:</p>
                    <p>Lembaga: {namaLembaga || "-"}</p>
                    <p>Wilayah: {kota}, {provinsi} {isPesantren && nspp ? `• NSPP: ${nspp}` : "• Verifikasi SK Kepengurusan"}</p>
                    <p>Pengelola: {namaPj || "-"} ({email || "-"})</p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {(langkahGalat || state?.error) && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700 border border-rose-200" role="alert">
              {langkahGalat || state?.error}
            </p>
          )}

          {/* Navigasi Langkah */}
          <div className="mt-6 flex gap-3">
            {langkah > 0 && (
              <button
                type="button"
                onClick={() => {
                  setLangkahGalat("");
                  setLangkah((prev) => prev - 1);
                }}
                className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-stone-700 border border-[#E5E3DC] bg-white hover:bg-stone-50 active:scale-[0.98] transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
            )}

            {langkah < 2 ? (
              <button
                type="button"
                onClick={handleLanjut}
                className={gayaTombolUtama}
              >
                <span>Lanjut</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className={gayaTombolUtama}
              >
                {isPending ? "Mengirim Pendaftaran..." : "Kirim Pendaftaran Resmi"}
              </button>
            )}
          </div>
        </form>
      </KerangkaAkun>
    </div>
  );
}