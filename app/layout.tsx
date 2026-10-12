import type { Metadata, Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "@/styles/globals.css";
import { SwipeToastContainer } from "@/components/ui/SwipeToast";
import PemantauAktivitasSesi from "@/components/auth/PemantauAktivitasSesi";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MOCHI — Masail Online & Comprehensive Heritage Intelligence",
  description:
    "Repositori digital keputusan Bahtsul Masail pesantren Nusantara — menghimpun as'ilah, rumusan hukum, ibarat kitab, serta dewan mushohhih dari forum bahtsul masail pesantren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-stone-900 antialiased selection:bg-[#E2ECE6] selection:text-[#1E3F30]">
        <a href="#main-content" className="skip-to-content font-medium">
          Lewati ke konten utama
        </a>
        <div className="flex min-h-screen flex-col">{children}</div>
        <SwipeToastContainer />
        <PemantauAktivitasSesi />
      </body>
    </html>
  );
}
