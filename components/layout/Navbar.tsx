"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Menu,
  X,
  Home,
  BookOpen,
  Building2,
  LogIn,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { logoutAction } from "@/app/api/auth/actions";

export interface RingkasanSesiNavbar {
  id: string;
  nama: string;
  email: string;
  peran: "admin" | "lembaga";
  lembagaNama?: string | null;
  lembagaSlug?: string | null;
}

const NAV = [
  { ke: "/", label: "Beranda", icon: Home },
  { ke: "/perpustakaan", label: "Perpustakaan", icon: BookOpen },
  { ke: "/lembaga", label: "Lembaga", icon: Building2 },
];

function isAktif(pathname: string, ke: string) {
  if (ke === "/") return pathname === "/";
  if (ke === "/perpustakaan") return pathname.startsWith("/perpustakaan") || pathname.startsWith("/masalah");
  if (ke === "/lembaga") return pathname.startsWith("/lembaga") || pathname.startsWith("/forum");
  return pathname.startsWith(ke);
}

export default function Navbar({ sesi }: { sesi?: RingkasanSesiNavbar | null }) {
  const pathname = usePathname();
  const [tergulung, setTergulung] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setTergulung(scrollPos > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu saat navigasi rute berubah
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Auto-tutup user menu saat klik di luar
  useEffect(() => {
    if (!userMenuOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [userMenuOpen]);

  // Auto-tutup saat klik/touch di luar menu atau tekan Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Kunci scroll body saat menu mobile aktif
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        tergulung || mobileMenuOpen
          ? "border-b border-[#E5E3DC]/80 bg-[#F4F3EE]/80 backdrop-blur-md shadow-[0_4px_20px_rgba(30,63,48,0.04)]"
          : "border-b border-transparent bg-[#F4F3EE]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand Logo Resmi dengan Subteks Penjelas */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0" data-testid="logo-mochi">
          <span className="relative h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/brand/mochi-symbol.svg"
              alt="Logo Resmi MOCHI"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[16px] font-extrabold tracking-tight text-stone-900">
                MOCHI
              </span>
              <span className="rounded-xs bg-[#1E3F30]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#1E3F30] uppercase tracking-wider">
                Pesantren
              </span>
            </div>
            <span className="mt-0.5 text-[10px] font-medium text-stone-500 tracking-tight leading-none">
              Repositori Bahtsul Masail
            </span>
          </div>
        </Link>

        {/* Navigasi Utama Pill Emergent Style dengan Hover Efek Jelas (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex rounded-full bg-stone-200/40 p-1" aria-label="Navigasi utama">
          {NAV.map((n) => {
            const on = isAktif(pathname, n.ke);
            return (
              <Link
                key={n.ke}
                href={n.ke}
                className={`relative rounded-full px-3.5 py-1 text-[13.5px] font-medium transition-all duration-200 ${
                  on
                    ? "bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold"
                    : "text-stone-600 hover:text-stone-950 hover:bg-white/60"
                }`}
              >
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons Kanan */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {sesi ? (
            /* Menu Dropdown Profil Akun Aktif Desktop */
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-300/80 bg-white/90 pl-2.5 pr-3 text-xs font-semibold text-[#1E3F30] shadow-2xs hover:border-[#1E3F30] transition-colors"
              >
                {sesi.peran === "admin" ? (
                  <ShieldCheck className="h-4 w-4 text-[#8C733E]" />
                ) : (
                  <Building2 className="h-4 w-4 text-[#1E3F30]" />
                )}
                <span className="max-w-[130px] truncate">
                  {sesi.peran === "admin" ? "Admin Pusat" : (sesi.lembagaNama || sesi.nama)}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-stone-500 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl z-50"
                  >
                    <div className="p-2 border-b border-stone-100 mb-1">
                      <span className="text-xs font-bold text-stone-900 block truncate">
                        {sesi.nama}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono block truncate">
                        {sesi.email}
                      </span>
                    </div>

                    {sesi.peran === "admin" ? (
                      <>
                        <Link
                          href="/admin/verifikasi"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-[#8C733E]" />
                          <span>Panel Verifikasi NSPP</span>
                        </Link>
                        <Link
                          href="/admin/lembaga"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <Building2 className="h-3.5 w-3.5 text-[#1E3F30]" />
                          <span>Kelola Lembaga</span>
                        </Link>
                        <Link
                          href="/admin/profil"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <User className="h-3.5 w-3.5 text-stone-500" />
                          <span>Profil &amp; Sandi Admin</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dasbor"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-[#8C733E]" />
                          <span>Dasbor Lembaga</span>
                        </Link>
                        <Link
                          href="/dasbor/forum/baru"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <Plus className="h-3.5 w-3.5 text-[#1E3F30]" />
                          <span>+ Buat Forum Baru</span>
                        </Link>
                        <Link
                          href="/dasbor/profil"
                          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FAF8F2] hover:text-[#1E3F30] font-medium"
                        >
                          <Building2 className="h-3.5 w-3.5 text-stone-500" />
                          <span>Kelola Profil Lembaga</span>
                        </Link>
                      </>
                    )}

                    <div className="pt-1 mt-1 border-t border-stone-100">
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 font-semibold transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Keluar Sesi</span>
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/masuk"
              data-testid="tautan-masuk"
              className="hidden sm:inline-flex h-9 items-center rounded-full px-3.5 text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-200/60 transition-colors"
            >
              Masuk
            </Link>
          )}

          <Link
            href="/tanya"
            data-testid="tombol-tanya-header"
            className="group hidden h-9 sm:inline-flex items-center gap-2 rounded-full bg-[#1E3F30] pl-1.5 pr-3.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 hover:bg-[#2D5A46] hover:shadow-[0_8px_20px_-8px_rgba(30,63,48,0.6)] active:scale-[0.98]"
          >
            <span className="relative h-6 w-6 overflow-hidden rounded-full bg-white shrink-0">
              <Image
                src="/mascot/mochi-3d.png"
                alt=""
                fill
                className="object-cover"
              />
            </span>
            <span>Tanya MOCHI</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {/* Tombol Hamburger Menu Mobile */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
            data-testid="tombol-hamburger"
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full border border-stone-300/80 bg-white/90 text-stone-700 shadow-2xs backdrop-blur-sm transition-all hover:border-stone-400 hover:bg-white hover:text-stone-900 active:scale-95"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Drawer Menu Navigasi Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-50 bg-stone-900/40 backdrop-blur-xs md:hidden"
              aria-hidden="true"
            />

            {/* Panel Menu Mobile */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-stone-200/80 bg-[#F4F3EE] px-4 pb-6 pt-3 shadow-xl backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto max-w-md space-y-3">
                {/* Tautan Navigasi */}
                <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-1.5 shadow-2xs">
                  {NAV.map((n) => {
                    const on = isAktif(pathname, n.ke);
                    const Icon = n.icon;
                    return (
                      <Link
                        key={n.ke}
                        href={n.ke}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                          on
                            ? "bg-[#1E3F30] text-white shadow-2xs font-semibold"
                            : "text-stone-700 hover:bg-stone-100 active:bg-stone-200"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${on ? "text-[#C9A96E]" : "text-stone-500"}`} />
                        <span>{n.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Kartu Spesial Tanya MOCHI */}
                <Link
                  href="/tanya"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-between gap-2.5 rounded-xl bg-[#1E3F30] px-3.5 py-2 text-white shadow-2xs transition-all active:scale-[0.99] hover:bg-[#254d3b]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#C9A96E]/50">
                      <Image
                        src="/mascot/mochi-3d.png"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="text-sm font-semibold text-white">Tanya MOCHI</span>
                    <span className="rounded-full bg-[#C9A96E] px-1.5 py-0.5 text-[9px] font-bold text-stone-950 leading-none">
                      AI
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#C9A96E] shrink-0" />
                </Link>

                {/* Akun Status Mobile */}
                {sesi ? (
                  <div className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {sesi.peran === "admin" ? (
                          <ShieldCheck className="h-4 w-4 text-[#8C733E]" />
                        ) : (
                          <Building2 className="h-4 w-4 text-[#1E3F30]" />
                        )}
                        <span className="text-xs font-bold text-stone-900">
                          {sesi.peran === "admin" ? "Admin Pusat" : (sesi.lembagaNama || sesi.nama)}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {sesi.email}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={sesi.peran === "admin" ? "/admin/verifikasi" : "/dasbor"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1E3F30] py-2 text-xs font-bold text-white hover:bg-[#2D5A46]"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>Buka Panel</span>
                      </Link>

                      <form action={logoutAction} className="w-full">
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Keluar</span>
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/masuk"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-stone-300/80 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-2xs transition-all hover:bg-stone-50 active:scale-[0.99]"
                  >
                    <LogIn className="h-4 w-4 text-stone-500" />
                    <span>Masuk ke Akun Lembaga</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}