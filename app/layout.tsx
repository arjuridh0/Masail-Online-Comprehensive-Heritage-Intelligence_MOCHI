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
  themeColor: "#1E3F30",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mochi.pesantren.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOCHI — Masail Online & Comprehensive Heritage Intelligence",
    template: "%s | MOCHI Pesantren",
  },
  description:
    "Repositori digital keputusan Bahtsul Masail pesantren Nusantara — menghimpun as'ilah, rumusan hukum, ibarat kitab turats, serta dewan mushohhih dari forum bahtsul masail pesantren Nahdlatul Ulama.",
  keywords: [
    "bahtsul masail",
    "fiqih pesantren",
    "turats",
    "kitab kuning",
    "santrivision 2026",
    "hukum islam",
    "nahdlatul ulama",
    "fatwa",
    "mochi",
  ],
  authors: [{ name: "Tim Santrivision MOCHI 2026" }],
  creator: "Kemenag RI — Santrivision 2026",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "MOCHI — Repositori Keputusan Bahtsul Masail Pesantren",
    description:
      "Jawaban hukum Islam dari musyawarah ulama bersanad. Menghimpun as'ilah, rumusan fiqih, dan ibarat kitab turats berharakat.",
    siteName: "MOCHI",
    images: [
      {
        url: "/screenshots/beranda.png",
        width: 1280,
        height: 800,
        alt: "Pratinjau Antarmuka MOCHI Pesantren",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOCHI — Keputusan Bahtsul Masail Pesantren Nusantara",
    description: "Repositori resmi digital keputusan fiqih musyawarah ulama bersanad.",
    images: ["/screenshots/beranda.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/mascot/mochi-2d.png",
    apple: "/mascot/mochi-2d.png",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "MOCHI",
      description: "Repositori Digital Keputusan Bahtsul Masail Pesantren Nusantara",
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/perpustakaan?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "MOCHI — Khazanah Bahtsul Masail Pesantren",
      url: siteUrl,
      logo: `${siteUrl}/mascot/mochi-2d.png`,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
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
