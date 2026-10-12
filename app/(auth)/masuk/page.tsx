"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import KerangkaAkun, { Bidang, gayaInput, gayaTombolUtama } from "@/components/mochi/KerangkaAkun";
import { loginAction } from "@/app/api/auth/actions";

export default function MasukPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div data-testid="halaman-masuk">
      <KerangkaAkun
        alis="Masuk"
        judul={
          <>
            Selamat datang <em className="text-[#1E3F30]">kembali.</em>
          </>
        }
        deskripsi="Masuk sebagai pengelola lembaga pesantren atau admin pusat."
        kaki={
          <>
            Lembaga Anda belum terdaftar?{" "}
            <Link
              href="/daftar"
              className="font-medium text-[#1E3F30] tautan-garis"
              data-testid="ke-daftar"
            >
              Daftarkan lembaga
            </Link>
          </>
        }
      >
        <form action={formAction} className="space-y-4" noValidate>
          <Bidang label="Email" id="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={gayaInput}
              data-testid="masuk-email"
              placeholder="nama@lembaga.id"
            />
          </Bidang>

          <Bidang label="Kata sandi" id="password">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${gayaInput} pr-12`}
                data-testid="masuk-sandi"
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

          <div className="flex justify-end">
            <Link
              href="/lupa-sandi"
              className="text-sm text-stone-500 hover:text-[#1E3F30] tautan-garis"
              data-testid="ke-lupa-sandi"
            >
              Lupa kata sandi?
            </Link>
          </div>

          {state?.error && (
            <p
              className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-200"
              role="alert"
              data-testid="masuk-galat"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !email || !password}
            className={gayaTombolUtama}
            data-testid="masuk-kirim"
          >
            {isPending ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </KerangkaAkun>
    </div>
  );
}