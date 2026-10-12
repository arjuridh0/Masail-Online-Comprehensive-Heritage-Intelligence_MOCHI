# Third-Party Libraries & Assets - MOCHI

### Masail Online & Comprehensive Heritage Intelligence

> Catatan lisensi pihak ketiga sesuai TOR Santrivision 2026 (bagian 5.3).
> Verifikasi lisensi tiap paket saat instalasi.
> Versi 1.0 · 9 Oktober 2026

---

## Framework & Runtime

| Nama       | Versi    | Lisensi    | Catatan                      |
| ---------- | -------- | ---------- | ---------------------------- |
| Next.js    | 16.4.0   | MIT        | Framework utama (App Router) |
| React      | 19.0.0   | MIT        | UI library                   |
| React DOM  | 19.0.0   | MIT        | Virtual DOM renderer         |
| TypeScript | 5.7.3    | Apache-2.0 | Type system strict           |
| Node.js    | 20+ LTS  | MIT        | Runtime                      |

## Styling & UI

| Nama                     | Versi   | Lisensi    | Catatan                          |
| ------------------------ | ------- | ---------- | -------------------------------- |
| Tailwind CSS             | 4.3.3   | MIT        | Utility-first CSS                |
| @tailwindcss/postcss     | 4.3.3   | MIT        | PostCSS plugin untuk Tailwind v4 |
| class-variance-authority | 0.7.1   | Apache-2.0 | CVA varian komponen              |
| clsx                     | 2.1.1   | MIT        | Conditional class names          |
| tailwind-merge           | 3.0.1   | MIT        | Merge Tailwind classes           |
| lucide-react             | 0.475.0 | ISC        | Ikon SVG open source             |

## Micro-Interactions (ReactBits)

| Nama             | Sumber                                             | Lisensi | Catatan                    |
| ---------------- | -------------------------------------------------- | ------- | -------------------------- |
| FuseButton       | https://reactbits.dev/micro/fuse-button            | MIT     | Tombol dengan undo window  |
| SwipeToast       | https://reactbits.dev/micro/swipe-toast            | MIT     | Toast swipe dismiss        |
| ThoughtLine      | https://reactbits.dev/micro/thought-line           | MIT     | Indikator thinking chatbot |
| AccordionGallery | https://reactbits.dev/components/accordion-gallery | MIT     | Galeri Rak Kitab           |

## Database & Backend

| Nama                  | Versi  | Lisensi | Catatan             |
| --------------------- | ------ | ------- | ------------------- |
| @supabase/supabase-js | 2.49.1 | MIT     | Client Supabase     |
| @supabase/ssr         | 0.6.1  | MIT     | SSR helper Supabase |

## Validasi

| Nama | Versi  | Lisensi | Catatan         |
| ---- | ------ | ------- | --------------- |
| zod  | 3.24.2 | MIT     | Validasi schema |

## Pengujian

| Nama             | Versi  | Lisensi    | Catatan                    |
| ---------------- | ------ | ---------- | -------------------------- |
| vitest           | 5.0.3  | MIT        | Unit & integration testing |
| @playwright/test | 1.64.0 | Apache-2.0 | E2E testing (Chromium)     |

## Dev Tools

| Nama                        | Versi  | Lisensi | Catatan                |
| --------------------------- | ------ | ------- | ---------------------- |
| prettier                    | 3.x    | MIT     | Code formatter         |
| prettier-plugin-tailwindcss | latest | MIT     | Tailwind class sorting |
| eslint                      | 9.x    | MIT     | Linter                 |

## Utilitas

| Nama     | Versi | Lisensi | Catatan            |
| -------- | ----- | ------- | ------------------ |
| date-fns | 3.x   | MIT     | Manipulasi tanggal |

## Font (SIL OFL 1.1 — Boleh untuk produk proprietary)

| Nama              | Sumber       | Lisensi     | Penggunaan                    |
| ----------------- | ------------ | ----------- | ----------------------------- |
| Inter             | Google Fonts | SIL OFL 1.1 | Font Latin utama              |
| Amiri             | Google Fonts | SIL OFL 1.1 | Font Arab Naskh utama (kitab) |
| Noto Naskh Arabic | Google Fonts | SIL OFL 1.1 | Font Arab cadangan            |

## Gambar & Aset

| Nama            | Sumber                  | Status Lisensi              | Catatan                           |
| --------------- | ----------------------- | --------------------------- | --------------------------------- |
| Maskot MOCHI 2D | ChatGPT Image Generator | Perlu verifikasi ToS OpenAI | Karakter bulat berpeci baca kitab |
| Maskot MOCHI 3D | Meshy AI                | Perlu verifikasi ToS Meshy  | Versi 3D maskot                   |

> PERHATIAN: Verifikasi ToS ChatGPT (OpenAI) dan Meshy AI terkait kepemilikan
> gambar yang dihasilkan AI sebelum digunakan untuk keperluan lomba resmi.

---

## Catatan Penting

1. MIT, Apache-2.0, ISC, SIL OFL = lisensi permisif — boleh dalam produk proprietary
2. Tidak ada GPL/LGPL dalam daftar ini — sesuai TOR (hak cipta dapat dialihkan)
3. ReactBits: verifikasi lisensi tiap komponen sebelum install
4. Gambar AI: cek ToS platform generator sebelum penggunaan lomba

### Verifikasi Lisensi Setelah Install

`bash
npx license-checker --summary
npx license-checker --failOn GPL
`
