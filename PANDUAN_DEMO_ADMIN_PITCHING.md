# 🎙️ Panduan Presentasi Demo Admin MOCHI
### Khusus Presenter Sesi Demo Fitur Administrasi & Tata Kelola
**Lomba Santrivision 2026 — Ditjen Pendidikan Diniyah & Pondok Pesantren Kemenag RI**

---

## 📑 DAFTAR ISI PANDUAN
1. [Arsitektur Tingkatan Layer Pengguna (User Hierarchy)](#1-arsitektur-tingkatan-layer-pengguna-user-hierarchy)
2. [Alur Pembuka: Halaman Masuk & Keamanan Login](#2-alur-pembuka-halaman-masuk--keamanan-login)
3. [Alur Registrasi Lembaga & Strategi Jawaban NSPP (Safe Pitching)](#3-alur-registrasi-lembaga--strategi-jawaban-nspp-safe-pitching)
4. [Demo Layer 1: Admin Lembaga (LBM MWC NU Lenteng)](#4-demo-layer-1-admin-lembaga-lbm-mwc-nu-lenteng)
   - [4.1 Dasbor Utama Lembaga & Catatan Koreksi](#41-dasbor-utama-lembaga--catatan-koreksi)
   - [4.2 Pengelolaan Forum Bahtsul Masail](#42-pengelolaan-forum-bahtsul-masail)
   - [4.3 Wizard Masalah Baru (Alur 5 Langkah Bersanad)](#43-wizard-masalah-baru-alur-5-langkah-bersanad)
   - [4.4 Statistik & Analisis Keaktifan Lembaga](#44-statistik--analisis-keaktifan-lembaga)
   - [4.5 Manajemen Profil Lembaga](#45-manajemen-profil-lembaga)
5. [Demo Layer 2: Admin Pusat / Kementerian Agama RI](#5-demo-layer-2-admin-pusat--kementerian-agama-ri)
   - [5.1 Antrean Verifikasi NSPP & Legalitas](#51-antrean-verifikasi-nspp--legalitas)
   - [5.2 Manajemen Direktori Seluruh Lembaga](#52-manajemen-direktori-seluruh-lembaga)
   - [5.3 Master Kitab Turats Rujukan & Roadmap Repo Kitab (Fase 2)](#53-master-kitab-turats-rujukan--roadmap-repo-kitab-fase-2)
   - [5.4 Moderasi Laporan Koreksi Publik (Alur End-to-End dari Pembaca ke Admin)](#54-moderasi-laporan-koreksi-publik-alur-end-to-end-dari-pembaca-ke-admin)
   - [5.5 Dashboard Nasional Ditjen Pesantren (Integrasi Kemenag)](#55-dashboard-nasional-ditjen-pesantren-integrasi-kemenag)
   - [5.6 Profil Admin & Pengamanan Sesi](#56-profil-admin--pengamanan-sesi)
6. [Tabel Skrip Presentasi Singkat (Cheatsheet Waktu Demo 3 Menit)](#6-tabel-skrip-presentasi-singkat-cheatsheet-waktu-demo-3-menit)
7. [Antisipasi Pertanyaan Kritis Juri Seputar Admin & Jawaban Mantap](#7-antisipasi-pertanyaan-kritis-juri-seputar-admin--jawaban-mantap)

---

## 1. Arsitektur Tingkatan Layer Pengguna (User Hierarchy)

Sebelum membuka layar peramban, sampaikan pembagian layer pengguna ini dalam 30 detik:

> *"Bapak/Ibu Dewan Juri yang terhormat, sistem MOCHI dirancang dengan prinsip **Tata Kelola Khazanah Fiqih yang Berintegritas**. Kami membagi ekosistem pengguna ke dalam 3 peran aplikasi yang terisolasi ketat, ditambah 1 layer fondasi infrastruktur:"*

```mermaid
graph TD
    subgraph "Infrastruktur & Rekayasa Sistem"
        Dev["Layer 0: Tim Rekayasa (Developer)<br/>• Di balik layar (DevOps, Supabase RLS, Server Actions)<br/>• Tanpa peran di UI & tanpa backdoor konten"]
    end

    subgraph "Aplikasi MOCHI (3 Peran Resmi)"
        Admin["Layer 1: Admin Pusat / Kemenag RI<br/>• admin@mochi.pesantren.id<br/>• Verifikasi NSPP, Moderasi Lembaga, Master Kitab, Laporan Koreksi, Dashboard Ditjen"]
        Lembaga["Layer 2: Lembaga Penyelenggara (Multi-Tenant)<br/>• Pesantren ber-NSPP & LBM NU ber-SK<br/>• Kelola forum, input masail bersanad, statistik tayangan"]
        Publik["Layer 3: Pengunjung Publik / Santri / Umat<br/>• Akses publik terbuka tanpa login<br/>• Cari fatwa, filter corak/topik, Tanya MOCHI, kirim koreksi ibarat"]
    end

    Dev -. Menjamin Keamanan .-> Admin
    Admin -->|Verifikasi & Aktivasi| Lembaga
    Lembaga -->|Menerbitkan Masail Bersanad| Publik
    Publik -->|Kirim Laporan Koreksi Ijtima'i| Admin
```

### 🎯 Poin Inti Tingkatan Pengguna (Cukup Sebutkan Inti Ini):
* 🔴 **Pengunjung Publik:** Akses bebas membaca naskah fatwa, Tanya MOCHI (AI bersanad), dan mengirim koreksi teks Arab.
* 🟢 **Lembaga Pesantren / LBM NU:** Ruang kerja mandiri (*multi-tenant*) untuk mencatat dan menerbitkan fatwa hasil bahtsul masail lembaganya sendiri.
* 🔵 **Admin Pusat Kemenag:** Otoritas verifikasi berkas legalitas (NSPP/SK), moderasi laporan publik, dan pemantauan intelijen data nasional.
* ⚪ **Developer (Di Balik Layar):** Sengaja **tidak ada peran di UI**, menjamin tidak ada pintu belakang (*backdoor*) untuk mengintervensi fatwa para ulama.

---

## 2. Alur Pembuka: Halaman Masuk & Keamanan Login

**URL Uji:** `https://mochi-six-ochre.vercel.app/masuk`  
**Kredensial:** Ada di berkas [`docs/AKUN_DEMO.md`](file:///d:/LOMBA2/SANTRIVISION/docs/AKUN_DEMO.md)

![Halaman Masuk MOCHI](public/demo_screenshots/demo_01_masuk.png)

### 🔍 Deskripsi Fitur:
* **Single Entry Point:** Gerbang masuk tunggal untuk seluruh peran (baik pesantren maupun admin kementerian).
* **Toggle Password Visibility:** Ikon mata interaktif untuk kenyamanan santri saat mengetik sandi di perangkat bersama (laboratorium pesantren).
* **Proteksi Brute-Force:** Pembatasan maksimal 5 kali percobaan login per menit untuk mencegah upaya pembobolan sandi.
* **Smart Redirection:** Sistem mengenali hak akses dan langsung mengarahkan Admin ke `/admin` dan Lembaga ke `/dasbor`.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Pintu masuk tunggal yang cerdas (*smart role-redirection*).
> 2. Dilindungi *rate limiter* anti brute-force untuk keamanan akun pesantren.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Kami memulai dari gerbang akses resmi MOCHI di tautan `/masuk`. Portal masuk ini dilengkapi perlindungan brute-force dan secara cerdas langsung mengarahkan pengguna ke ruang kerjanya masing-masing sesuai hak aksesnya—admin diarahkan ke konsol kementerian, dan pesantren langsung masuk ke dasbor kerjanya."*

---

## 3. Alur Registrasi Lembaga & Strategi Jawaban NSPP (Safe Pitching)

**URL Uji:** `https://mochi-six-ochre.vercel.app/daftar`

![Pendaftaran Pesantren dengan NSPP](public/demo_screenshots/demo_02_daftar_pesantren.png)
![Pendaftaran Lembaga LBM NU dengan SK](public/demo_screenshots/demo_02b_daftar_organisasi.png)

### 🔍 Deskripsi Fitur:
* **Pilihan 2 Tipe Lembaga:** Mengakomodasi realitas di lapangan:
  1. **Tipe Pesantren:** Wajib memasukkan **NSPP (Nomor Statistik Pesantren)** 12 digit standar Kemenag dan mengunggah dokumen piagam izin operasional.
  2. **Tipe Struktur Jam'iyyah (LBM PCNU / MWC NU):** Mengakomodasi forum tingkat cabang/kecamatan dengan mengunggah **SK Kepengurusan Resmi**.
* **Two-Tier Governance:** Validasi format di sisi sistem, diikuti verifikasi keabsahan dokumen oleh Admin Pusat di meja persetujuan.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Gerbang seleksi ketat: Hanya pesantren ber-NSPP 12 digit dan LBM ber-SK resmi yang boleh mendaftar.
> 2. Pendekatan dua tahap (*Two-Tier Governance*) menjamin marwah dan legalitas fatwa sebelum akun dapat menerbitkan naskah.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Untuk menjaga marwah fatwa keagamaan, MOCHI menerapkan registrasi selektif di halaman `/daftar`. Kami membedakan pesantren yang wajib menyertakan 12 digit NSPP Kemenag, dan forum LBM NU wilayah/cabang yang menyertakan SK kepengurusan resmi."*

> [!IMPORTANT]
> ### 🛡️ STRATEGI JAWABAN AMAN: Jika Ditanya *"Apakah NSPP sudah terkoneksi langsung ke API EMIS Kemenag?"*
> **JANGAN KATAKAN:** *"Sudah otomatis terhubung live ke EMIS."* (Karena butuh PKS resmi).  
> **GUNAKAN KALIMAT INI (Sangat Mantap & Diapresiasi Juri):**  
> *"Kami sengaja menerapkan **Two-Tier Governance (Tata Kelola Dua Tahap)**: validasi format 12 digit numerik di sistem, disusul verifikasi berkas izin operasional oleh Admin Pusat. Hal ini berpijak pada prinsip kehati-hatian (*ihtiyath*) fatwa agama. Namun dari sisi teknologi, skema basis data kami sudah memiliki kolom NSPP berindeks unik yang siap dihubungkan langsung (*plug-and-play*) ke API EMIS Ditjen Pesantren begitu integrasi kedinasan dibuka."*

---

## 4. Demo Layer 1: Admin Lembaga (LBM MWC NU Lenteng)

**Kredensial Akun:**  
- **Email:** `lenteng@mochi.pesantren.id`  
- **Kata Sandi:** `Lenteng2023!`  
- **Entitas:** Lembaga Bahtsul Masail MWC NU Lenteng, Kab. Sumenep, Madura.

---

### 4.1 Dasbor Utama Lembaga & Catatan Koreksi
**URL:** `https://mochi-six-ochre.vercel.app/dasbor`

![Dasbor Utama Lembaga Lenteng](public/demo_screenshots/demo_03_dasbor_lembaga_lenteng.png)

### 🔍 Deskripsi Fitur:
* **Lencana "Terverifikasi":** Menandakan pesantren berhak menerbitkan keputusan fiqih ke publik. Jika akun belum disetujui, tombol terbit dibekukan.
* **Isolasi Data (Multi-Tenant RLS):** Pesantren Lenteng hanya mengelola forum miliknya sendiri. Draf musyawarah tidak bocor ke pesantren lain.
* **Catatan Koreksi Publik Masail:** Bagian khusus di dasbor yang menampilkan masukan koreksi teks Arab/halaman kitab dari pembaca, lengkap dengan catatan arahan admin kementerian dan tombol langsung ke editor masalah.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Status lencana resmi "Terverifikasi" membuka hak penerbitan fatwa.
> 2. Kerahasiaan draf antar-pesantren terjamin 100% aman berkat isolasi *Row-Level Security*.
> 3. Pesantren menerima umpan balik koreksi naskah dari pembaca secara transparan.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Masuk ke dasbor LBM MWC NU Lenteng: akun ini telah berstatus Terverifikasi. Seluruh data di sini terisolasi aman dengan Row-Level Security PostgreSQL sehingga draf fatwa internal tidak bocor. Di bagian bawah dasbor, pesantren juga dapat langsung memantau catatan koreksi teks yang dilaporkan oleh masyarakat pembaca."*

---

### 4.2 Pengelolaan Forum Bahtsul Masail
**URL:** `https://mochi-six-ochre.vercel.app/dasbor/forum`

![Daftar Forum Bahtsul Masail Lembaga](public/demo_screenshots/demo_04_forum_lembaga_lenteng.png)

### 🔍 Deskripsi Fitur:
* **Tabel Riwayat Forum:** Mencatat nama acara (*"Bahtsul Masail MWCNU Lenteng 2023"*), tanggal Masehi dan Hijriah, lokasi tuan rumah, dan jumlah masalah yang dibahas.
* **Kontrol Dua Status:** Sesuai PRD, status naskah hanya ada dua: `draf` (tahap perumusan internal) dan `terbit` (sudah disahkan dewan mushohhih dan terbuka bagi umat).

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Manajemen arsip forum yang rapi dan terstruktur berdasarkan tanggal Hijriah & Masehi.
> 2. Alur penerbitan sederhana dan tegas: hanya status `draf` atau `terbit`, tanpa birokrasi berbelit.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Di menu Pengelolaan Forum, seluruh arsip musyawarah tersusun rapi. Kami menerapkan alur tegas dua status: status draf saat perumusan, dan status terbit seketika dewan mushohhih mengesahkan hasil bahtsul masail."*

---

### 4.3 Wizard Masalah Baru (Alur 5 Langkah Bersanad)
**URL:** `https://mochi-six-ochre.vercel.app/dasbor/forum/baru`

![Wizard Masalah Baru Langkah 1](public/demo_screenshots/demo_05_wizard_langkah1.png)

> [!IMPORTANT]
> **INILAH JANTUNG INOVASI PRODUK MOCHI — ALOKASIKAN 45 DETIK UNTUK MENJELASKAN WIZARD INI.**

### 🔍 Deskripsi Fitur:
* Menggantikan notulensi kertas fotokopi yang mudah hilang menjadi **arsip digital bersanad ilmiah**:
  1. **Langkah 1 (Sanad Tokoh):** Catat tanggal Masehi-Hijriah otomatis, nama Dewan Mushohhih, Dewan Perumus, dan Moderator.
  2. **Langkah 2 (Rincian Kasus):** Deskripsi latar belakang masalah (*taswirul mas'alah*), topik wajib (*Ibadah, Muamalah, Munakahat*), dan corak kajian (*waqi'iyyah, maudhu'iyyah, qanuniyyah*).
  3. **Langkah 3 (Pertanyaan & Jawaban):** Rumusan diktum hukum yang tegas.
  4. **Langkah 4 (Ibarat Kitab Kuning):** Terhubung ke 35 Master Kitab Turats, editor teks Arab berfont Amiri RTL dengan harakat lengkap, nomor juz, dan nomor halaman kitab.
  5. **Langkah 5 (Tashih & Terbit):** Pratinjau akhir sebelum diterbitkan ke publik dan diindeks oleh AI.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Standarisasi sanad: Wajib mencantumkan dewan mushohhih dan perumus yang bertanggung jawab.
> 2. Digitalisasi turats: Teks Arab asli berharakat lengkap dengan jangkar 35 Master Kitab Turats muktabarah.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Inovasi terbesar MOCHI ada di Wizard 5 Langkah ini: kami mengubah tradisi notulensi kertas fotokopi menjadi standarisasi sanad digital. Setiap fatwa wajib memiliki pertanggungjawaban ilmiah: siapa dewan mushohhihnya, apa diktum hukumnya, dan dari kitab apa ibarat Arab rujukannya secara presisi."*

---

### 4.4 Statistik & Analisis Keaktifan Lembaga
**URL:** `https://mochi-six-ochre.vercel.app/dasbor/statistik`

![Statistik Lembaga Lenteng](public/demo_screenshots/demo_06_statistik_lembaga.png)

### 🔍 Deskripsi Fitur:
* **Metrik Tayangan Riil:** Menghitung jumlah pembaca keputusan fatwa milik lembaga di portal publik.
* **Algoritma Skor Keaktifan (0–100):** Dihitung otomatis berbasis frekuensi forum dan produktivitas masail untuk memberikan lencana apresiasi (Aktif / Sangat Aktif / Teladan).
* **Top 5 Masail Terpopuler:** Mengidentifikasi isu fiqih yang paling dibutuhkan oleh masyarakat.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Transparansi dampak publik: Pesantren mengetahui seberapa luas fatwanya dibaca masyarakat.
> 2. Algoritma skor keaktifan yang memotivasi gairah literasi intelektual di pesantren.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Melalui dasbor statistik, pesantren dapat melihat dampak nyata karyanya di masyarakat: berapa kali dibaca, apa topik yang paling diminati umat, serta capaian indeks keaktifan ilmiah lembaga."*

---

### 4.5 Manajemen Profil Lembaga
**URL:** `https://mochi-six-ochre.vercel.app/dasbor/profil`

![Profil Lembaga Lenteng](public/demo_screenshots/demo_07_profil_lembaga.png)

### 🔍 Deskripsi Fitur:
* **Identitas Resmi:** Menampilkan data SK/NSPP, alamat domisili, email, kontak narahubung, dan logo resmi lembaga.
* **Keamanan Akun:** Fitur ubah kata sandi mandiri untuk menjaga keamanan akses pengurus pesantren.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Manajemen identitas resmi pesantren yang transparan dan dapat diperbarui secara mandiri.

---

## 5. Demo Layer 2: Admin Pusat / Kementerian Agama RI

**Kredensial Akun:**  
- **Email:** `admin@mochi.pesantren.id`  
- **Kata Sandi:** `MochiAdmin2026!`  
- **Entitas:** Administrator Pusat MOCHI / Ditjen Pendidikan Diniyah dan Pondok Pesantren Kemenag RI.

---

### 5.1 Antrean Verifikasi NSPP & Legalitas
**URL:** `https://mochi-six-ochre.vercel.app/admin/verifikasi`

![Antrean Verifikasi NSPP Admin](public/demo_screenshots/demo_08_admin_verifikasi.png)

### 🔍 Deskripsi Fitur:
* **Gerbang Kurasi Legalitas:** Tempat Admin Pusat meninjau permohonan pendaftaran lembaga baru.
* **Inspeksi Dokumen Bertanda Tangan (Signed URL):** Berkas piagam izin operasional / SK kepengurusan dapat dibuka melalui tautan aman berbatas waktu dari Supabase Storage.
* **Aksi Verifikasi:** Tombol satu-klik untuk *"Setujui Lembaga"* atau *"Tolak Permohonan"* disertai catatan resmi.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Admin Kemenag bertindak sebagai penjaga gerbang kualitas (*gatekeeper*) legalitas lembaga.
> 2. Dokumen legalitas diperiksa dengan tautan aman bertanda tangan (*Signed URL*).

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Berpindah ke peran Administrator Pusat Kementerian Agama: di menu Antrean Verifikasi, admin memeriksa berkas izin operasional pesantren secara aman sebelum memberikan tanda persetujuan penerbitan fatwa."*

---

### 5.2 Manajemen Direktori Seluruh Lembaga
**URL:** `https://mochi-six-ochre.vercel.app/admin/lembaga`

![Manajemen Direktori Seluruh Lembaga](public/demo_screenshots/demo_09_admin_kelola_lembaga.png)

### 🔍 Deskripsi Fitur:
* **Pangkalan Data Lembaga Nasional:** Menampilkan direktori seluruh pesantren dan LBM NU se-Indonesia (Lirboyo, Tebuireng, Sidogiri, Lenteng, dll.).
* **Kendali Etik (Tombol Suspend):** Jika ditemukan pelanggaran etik penerbitan, Admin Pusat dapat menangguhkan (*suspend*) status lembaga agar naskahnya sementara ditarik dari peredaran publik.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Direktori sentral lembaga pesantren dan LBM se-Indonesia.
> 2. Dilengkapi kendali mitigasi risiko (penangguhan akun) untuk melindungi masyarakat dari naskah yang melanggar etik.

---

### 5.3 Master Kitab Turats Rujukan & Roadmap Repo Kitab (Fase 2)
**URL:** `https://mochi-six-ochre.vercel.app/admin/kitab`

![Kelola Master Kitab Turats Rujukan](public/demo_screenshots/demo_admin_kelola_kitab.png)

### 🔍 Deskripsi Fitur:
* **35 Master Kitab Muktabarah:** Terindeks di database (Fathul Wahhab, Al-Majmu', Bughyatul Mustarsyidin, Ihya' Ulumiddin, dll.) lengkap dengan judul Arab Amiri, nama mualif, dan tahun wafat.
* **Mencegah Kitab Fiktif:** Pesantren memilih dalil dari daftar kitab standar saat pengisian wizard ibarat.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. 35 Master Kitab Kuning standar muktabarah sudah aktif di database dan terhubung ke wizard.
> 2. **Roadmap Fase 2:** Menjadi Repositori Katalog Kitab Terbuka untuk pencarian silang (*cross-reference*) seluruh fatwa yang memakai dalil dari kitab yang sama.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Menjawab saran berharga dewan juri terkait Master Kitab: saat ini kami telah menanamkan 35 Master Kitab Turats muktabarah di database. Fokus kami saat ini adalah mengamankan naskah fatwanya. Namun pada fase kedua, modul ini siap menjadi Katalog Repositori Kitab Terbuka untuk pencarian silang dalil antar-pesantren se-Indonesia."*

---

### 5.4 Moderasi Laporan Koreksi Publik (Alur End-to-End dari Pembaca ke Admin)
**URL Publik:** `/masalah/[slug]` &rarr; **URL Meja Admin:** `/admin/laporan`

![Modal Laporan Koreksi di Halaman Publik](public/demo_screenshots/demo_modal_lapor_publik.png)
![Meja Moderasi Laporan Koreksi Admin](public/demo_screenshots/demo_10_admin_laporan_publik.png)

### 🔍 Deskripsi Fitur (Alur Peer-Review Umat):
1. **Titik Lapor di Halaman Publik:** Pembaca menemukan tombol jelas *"Laporkan Koreksi / Typo Ibarat"* di samping naskah fatwa dan di bawah kutipan ibarat.
2. **Modal Pelaporan Ringkas:** Pembaca memilih kategori (*Typo Arab / Nomor Halaman Keliru / Diktum Kurang Lengkap*) dan menuliskan catatan perbaikan.
3. **Meja Moderasi Admin Kemenag:** Laporan difilter anti-spam oleh sistem, masuk ke meja admin, lalu diteruskan ke pesantren terkait (*Tindak Lanjuti*, *Selesai*, atau *Tolak*).

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Mekanisme *Community Peer-Review*: Umat dan santri se-Indonesia ikut menjaga kesucian teks Arab kitab kuning.
> 2. Admin Pusat memoderasi secara transparan sebelum diteruskan ke pesantren pembuat fatwa.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script):
> *"Untuk menjaga akurasi jutaan huruf Arab teks kitab kuning, MOCHI membuka mekanisme uji publik ijtima'i (*community peer-review*). Pembaca yang menemukan salah cetak harakat dapat melapor, dan Admin Pusat memoderasinya sebelum diteruskan langsung ke dewan perumus pesantren."*

---

### 5.5 Dashboard Nasional Ditjen Pesantren (Integrasi Kemenag)
**URL:** `https://mochi-six-ochre.vercel.app/admin/ditjen`

![Dashboard Nasional Ditjen Pesantren](public/demo_screenshots/demo_11_admin_ditjen_integrasi.png)

> [!IMPORTANT]
> **TUTUP DEMO ANDA DI SINI — INILAH NILAI JUAL TERTINGGI BAGI KEMENTERIAN AGAMA RI.**

### 🔍 Deskripsi Fitur:
* **Agregat Data Nasional:** Total pembaca riil, total forum terselenggara, total keputusan terbit, dan ribuan dalil terdigitalisasi.
* **Grafik Tren Topik Fiqih:** Membandingkan isu Ibadah vs Muamalah (fintech, pinjol, ekonomi syariah) vs Munakahat (ketahanan keluarga).
* **Peta Sebaran Keaktifan:** Pemetaan provinsi paling aktif dalam literasi hukum Islam santri.
* **Ekspor CSV Kedinasan:** Tombol satu-klik untuk mengunduh laporan rekapitulasi resmi format CSV.

> ### 🎯 POIN INTI YANG PERLU DISAMPAIKAN:
> 1. Instrumen pembuat kebijakan (*policy-making tool*) pertama untuk Kemenag RI berbasis dinamika fatwa riil.
> 2. Ekspor data kedinasan dalam hitungan detik untuk kebutuhan laporan dinas dan arsip negara.

### 🗣️ Cara Menjelaskan di Depan Juri (Pitching Script Penutup):
> *"Puncaknya, inilah kontribusi terbesar MOCHI bagi Kementerian Agama RI: Dashboard Nasional Ditjen Pesantren. Untuk pertama kalinya, Kemenag memiliki radar dinamika fatwa umat secara real-time, peta keaktifan pesantren per wilayah, dan instrumen ekspor data kedinasan dalam satu klik. Terima kasih."*

---

### 5.6 Profil Admin & Pengamanan Sesi
**URL:** `https://mochi-six-ochre.vercel.app/admin/profil`

![Profil Admin dan Keamanan Sesi](public/demo_screenshots/demo_12_admin_profil_keamanan.png)

### 🔍 Deskripsi Fitur:
* **Pengamanan Sesi Otomatis (Idle Monitor 60 Menit):** Sesi kedinasan akan tertutup otomatis bila tidak ada aktivitas selama 60 menit demi menjaga kerahasiaan data di perangkat kantor kementerian.

---

## 6. Tabel Skrip Presentasi Singkat (Cheatsheet Waktu Demo 3 Menit)

| Waktu | Layar yang Ditampilkan | Yang Ditunjuk di Layar | Skrip Kalimat Panggung |
|---|---|---|---|
| **00:00 - 00:30** | `/masuk` & `/daftar` | Form login & switch tipe lembaga (NSPP) | *"Sistem MOCHI memisahkan 3 peran terisolasi: Pengunjung, Lembaga Pesantren, dan Admin Kemenag. Pendaftaran menerapkan Two-Tier Governance dengan validasi 12 digit NSPP untuk pesantren dan SK untuk LBM NU."* |
| **00:30 - 01:20** | `/dasbor` & `/dasbor/forum/baru` | Login Lenteng & Wizard 5 Langkah | *"Ini dasbor LBM MWC NU Lenteng yang sudah terverifikasi. Inovasi utama kami ada di Wizard 5 Langkah: pencatatan masail bersanad lengkap mulai dari dewan mushohhih, rincian kasus, hingga teks Arab ibarat kitab kuning berfont Amiri."* |
| **01:20 - 01:50** | `/admin/kitab` & `/admin/laporan` | Master Kitab & Meja Laporan Koreksi | *"Di Admin Pusat, kami sudah mengindeks 35 Master Kitab turats dan menyiapkan roadmap repo kitab terbuka. Di menu laporan, kami mengelola koreksi publik yang dikirim langsung oleh pembaca masail secara transparan."* |
| **01:50 - 02:40** | `/admin/ditjen` | Grafik tren topik & tombol Ekspor CSV | *"Sebagai kontribusi nyata bagi Kemenag, Dashboard Ditjen Pesantren menyajikan pemetaan nasional: sebaran forum per provinsi, tren topik fatwa, dan ekspor CSV untuk pelaporan kedinasan."* |
| **02:40 - 03:00** | Kesimpulan & Penutup | Kursor mengarah ke logo MOCHI & Kemenag | *"Dengan tata kelola berjenjang, keamanan RLS, dan verifikasi bersanad, MOCHI siap menjadi infrastruktur digital resmi khazanah fiqih pesantren Indonesia. Terima kasih."* |

---

## 7. Antisipasi Pertanyaan Kritis Juri Seputar Admin & Jawaban Mantap

### Pertanyaan 1: *"Bagaimana kalian menjamin data draf pesantren A tidak bisa diintip atau diubah oleh pesantren B?"*
> **Jawaban Mantap:**  
> *"Kami menerapkan sistem **Multi-Tenancy dengan Row-Level Security (RLS) di level PostgreSQL Supabase**. Otorisasi tidak hanya dicek di antarmuka frontend, melainkan langsung di query database melalui fungsi otentikasi `auth.uid() = profil.id`. Sebuah pesantren secara matematis dan kriptografis mustahil membaca atau mengedit data yang bukan miliknya. Kami juga telah membuktikannya dengan 90 unit test otomatis di Vitest dan alur pengujian Playwright."*

---

### Pertanyaan 2: *"Kenapa validasi NSPP tidak langsung terhubung API EMIS Kementerian Agama?"*
> **Jawaban Mantap:**  
> *"Saat ini, akses API EMIS Kemenag membutuhkan perjanjian kerja sama (PKS) antar-lembaga kedinasan. Oleh karena itu, untuk fase inovasi ini kami mengimplementasikan **Two-Tier Governance**: validasi format 12 digit numerik di sisi sistem, dilanjutkan dengan verifikasi bukti izin operasional oleh Administrator Pusat. Hal ini justru menjamin kehati-hatian ganda (*ihtiyath*) dalam penerbitan fatwa keagamaan. Namun secara arsitektur, seluruh tabel data lembaga kami sudah memiliki kolom NSPP berindeks unik, sehingga begitu PKS integrasi API EMIS diresmikan, sistem MOCHI siap terhubung secara instan tanpa migrasi ulang."*

---

### Pertanyaan 3: *"Apakah masyarakat umum benar-benar bisa mengirim koreksi, dan bagaimana jika laporannya berupa spam?"*
> **Jawaban Mantap:**  
> *"Benar sekali, fitur ini sudah aktif di setiap halaman detail keputusan masail (`/masalah/[slug]`). Pembaca dapat mengeklik tombol 'Laporkan Koreksi / Typo Ibarat' untuk mengirim catatan teks Arab atau nomor juz/halaman yang keliru. Untuk mencegah spam, kami memasang **IP-based Rate Limiter (maksimal 5 laporan per 10 menit)** dan validasi panjang masukan dengan Zod schema. Laporan langsung masuk ke meja `/admin/laporan` untuk diverifikasi oleh admin sebelum diteruskan ke pesantren terkait."*

---

### Pertanyaan 4: *"Terkait fitur Master Kitab yang kemarin sempat disarankan juri, bagaimana posisinya sekarang?"*
> **Jawaban Mantap:**  
> *"Saran dewan juri sangat berharga bagi kami. Di sistem MOCHI saat ini, kami telah menanamkan **35 Master Kitab Turats rujukan utama** di basis data dan menyediakan menu manajemen di `/admin/kitab`. Saat ini fokus kami adalah memastikan hasil musyawarah fiqih terdokumentasi rapi. Pada fase kedua, master kitab ini akan kami kembangkan menjadi **Katalog Repositori Kitab Kuning Terbuka** untuk pencarian silang (*cross-reference*) seluruh fatwa yang menggunakan dalil dari kitab yang sama."*

---

### Pertanyaan 5: *"Bagaimana jika ada lembaga yang mengunggah fatwa bermuatan radikalisme atau bertentangan dengan konsensus ulama?"*
> **Jawaban Mantap:**  
> *"Pertama, sejak gerbang awal hanya pesantren ber-NSPP dan LBM ber-SK resmi yang bisa mendaftar. Kedua, jika terjadi penyimpangan di kemudian hari, Admin Pusat memiliki tombol **'Tangguhkan Lembaga' (Suspend)** di menu `/admin/lembaga`. Sekali diklik, seluruh status publikasi dibekukan dan konten otomatis ditarik dari peredaran publik maupun basis pengetahuan chatbot AI."*

---

*Dokumen ini dibuat dan diverifikasi langsung melalui pengujian peramban ego-browser pada sistem produksi MOCHI.*  
**Status Sistem:** 100% Siap Pitching & Live Demo. Sukses untuk presentasi besok! 🚀
