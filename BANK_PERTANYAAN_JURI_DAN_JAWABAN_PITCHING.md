# 🛡️ Bank Pertanyaan Kritis Juri & Jawaban Taktis (Dual POV: Juri Inovasi & Project Manager)
### Dokumen Strategis Persiapan Tanya-Jawab Finalis Santrivision 2026
**Karya:** MOCHI (Masail Online & Comprehensive Heritage Intelligence)  
**Kategori:** Inovasi Digital — Ditjen Pendidikan Diniyah dan Pondok Pesantren, Kementerian Agama RI  
**URL Sistem Terverifikasi:** `https://mochi-six-ochre.vercel.app/`

---

## 🧭 Panduan Mental Presenter Menghadapi Sesi Q&A

1. **Juri tidak mencari kesalahan untuk menjatuhkan, melainkan menguji batas (*stress-test*) ketahanan sistem Anda.**
2. **Jangan pernah defensif atau memotong pertanyaan.** Dengarkan sampai selesai, anggukkan kepala dengan takzim, lalu jawab dengan tenang dan lugas.
3. **Pola 3 Detik:** Validasi pertanyaan juri (*"Pertanyaan yang sangat tajam dan mendalam dari Bapak/Ibu..."*) &rarr; Sebutkan prinsip solusi (*"Kami menerapkan prinsip..."*) &rarr; Berikan bukti konkret arsitektur/kodingan (*"Di sistem PostgreSQL Supabase kami..."*).
4. **Hindari jawaban mengambang.** Sebutkan angka, nama tabel, atau istilah arsitektur yang presisi.

---

## 📑 DAFTAR KATEGORI PERTANYAAN (32 Pertanyaan Lengkap)

1. [Kategori 1: Fiqih, Validitas Fatwa, & Otoritas Keagamaan (Juri Ulama/Kemenag)](#kategori-1-fiqih-validitas-fatwa--otoritas-keagamaan-pov-juri-ulama--tokoh-pesantren) — *Q01 s.d. Q05*
2. [Kategori 2: AI, Chatbot RAG, & Mitigasi Halusinasi (Juri Pakar AI)](#kategori-2-ai-chatbot-rag--mitigasi-halusinasi-pov-juri-teknologi-ai) — *Q06 s.d. Q10*
3. [Kategori 3: Arsitektur Sistem, Basis Data, & Multi-Tenancy (Juri System Architect)](#kategori-3-arsitektur-sistem-basis-data--multi-tenancy-pov-juri-lead-architect) — *Q11 s.d. Q15*
4. [Kategori 4: Keamanan Siber, Kerahasiaan, & OWASP (Juri Cyber Security)](#kategori-4-keamanan-siber-kerahasiaan--owasp-pov-juri-cyber-security) — *Q16 s.d. Q19*
5. [Kategori 5: Tata Kelola, Legalitas, & Integrasi NSPP/EMIS (Juri Birokrat Kemenag)](#kategori-5-tata-kelola-legalitas--integrasi-nsppemis-pov-pejabat-kemenag) — *Q20 s.d. Q23*
6. [Kategori 6: Desain UI/UX, Aksesibilitas, & Tipografi Arab (Juri Desain Produk)](#kategori-6-desain-uiux-aksesibilitas--tipografi-arab-pov-juri-uxui) — *Q24 s.d. Q26*
7. [Kategori 7: Manajemen Produk, Skalabilitas, & Biaya Operasional (POV Project Manager)](#kategori-7-manajemen-produk-skalabilitas--biaya-operasional-pov-project-manager) — *Q27 s.d. Q29*
8. [Kategori 8: Kepatuhan Regulasi Lomba Santrivision & Alih Hak Cipta (POV Panitia)](#kategori-8-kepatuhan-regulasi-lomba-santrivision--alih-hak-cipta-pov-panitia) — *Q30 s.d. Q32*

---

## Kategori 1: Fiqih, Validitas Fatwa, & Otoritas Keagamaan (POV Juri Ulama / Tokoh Pesantren)

### Q01: *"Jika Pesantren A memutuskan hukum suatu perkara adalah HARAM, tetapi Pesantren B memutuskan BOLEH, bagaimana MOCHI menentukannya? Apakah sistem memilih mana yang benar?"*
* **🎯 Motif Penguji:** Menguji apakah platform bertindak sok tahu menjadi "Mufti Digital" atau menghormati tradisi *khilafiyah* (perbedaan pendapat) dalam fiqih Islam Ahlussunnah wal Jama'ah.
* **🛡️ Poin Kunci Jawaban:**
  * MOCHI adalah **repositori ilmiah bersanad**, bukan dewan fatwa tunggal.
  * Perbedaan pendapat antar-pesantren adalah kekayaan intelektual (*ikhtilaf al-ulama rahmah*).
  * Sistem memaparkan kedua fatwa secara netral, berdampingan, lengkap dengan sanad mushohhih dan ibarat rujukan masing-masing.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Pertanyaan yang sangat esensial. MOCHI berpegang teguh pada kaidah Ahlussunnah wal Jama'ah bahwa perbedaan pendapat para ulama muktabar adalah rahmat. Sistem kami secara arsitektural **menolak menyeragamkan fatwa**. Jika Pesantren Lirboyo dan MWCNU Lenteng memiliki ketetapan hukum yang berbeda pada suatu perkara, MOCHI menampilkan keduanya secara objektif dan berdampingan. Pembaca disajikan sanad lengkap: siapa dewan mushohhihnya dan dari kitab kuning apa ibarat dalilnya diambil. Keputusan hukum dikembalikan kepada kedaulatan masing-masing dewan musyawarah pesantren."*

---

### Q02: *"Siapa yang menjamin kebenaran isi fatwa yang diunggah ke MOCHI? Apakah ada tim pentashih dari pengelola MOCHI?"*
* **🎯 Motif Penguji:** Mencari celah apakah platform mengambil alih wewenang para kyai atau memiliki proses sensor sepihak.
* **🛡️ Poin Kunci Jawaban:**
  * Sesuai aturan inti PRD MOCHI (Aturan Produk #1): **Tidak ada verifikasi isi fatwa oleh platform**.
  * Pentashihan mutlak terjadi di forum aslinya oleh Dewan Mushohhih pesantren.
  * Yang diverifikasi oleh Admin Pusat Kemenag hanyalah **legalitas lembaga penyelenggara** (NSPP/SK).
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami tegaskan bahwa MOCHI **tidak melakukan sensor atau pentashihan isi fatwa**. Pentashihan (*tashih*) secara syar'i telah selesai dan sah di forum bahtsul masail itu sendiri oleh para kyai dewan mushohhih. Peran platform MOCHI adalah memverifikasi keabsahan lembaganya—memastikan yang mengunggah benar-benar pesantren ber-NSPP atau LBM ber-SK resmi. Jadi tanggung jawab ilmiah fatwa tetap melekat pada dewan mushohhih yang namanya tercatat secara abadi di sanad digital masalah tersebut."*

---

### Q03: *"Mengapa klasifikasi topik di MOCHI hanya dibatasi 3: Ibadah, Muamalah, dan Munakahat? Di mana posisi Jinayat (Pidana) atau Siyasah (Politik Kebangsaan)?"*
* **🎯 Motif Penguji:** Menguji kedalaman taksonomi fiqih dan alasan pembatasan arsitektur.
* **🛡️ Poin Kunci Jawaban:**
  * Mengacu pada realitas forum bahtsul masail kontemporer: Jinayat di Indonesia berada di bawah hukum positif nasional.
  * Isu kebangsaan (*Siyasah*) dan regulasi hukum positif diwadahi dalam topik **Muamalah** dengan corak kajian **Qanuniyyah** (tinjauan hukum negara) atau **Maudhu'iyyah** (tematik kebangsaan).
  * 3 topik ini membuat taksonomi basis data terstruktur tajam tanpa ambiguitas klasifikasi bagi pengguna.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Dalam literatur fiqih mazhab Syafi'i, pembagian tripartit (Ibadah, Muamalah, Munakahat) adalah klasifikasi induk yang paling kokoh. Di konteks Indonesia, perkara jinayat tunduk pada hukum pidana nasional. Untuk isu-isu kontemporer seperti hukum pajak, cryptocurrency, hingga etika politik kebangsaan (*fiqih siyasah*), di MOCHI diklasifikasikan ke dalam ranah **Muamalah** dengan corak kajian **Qanuniyyah** (harmonisasi hukum Islam dan regulasi negara). Hal ini menjaga konsistensi filter dan kemudahan navigasi publik."*

---

### Q04: *"Bagaimana kalian mencegah teks ibarat Arab kitab kuning agar tidak salah harakat atau terpotong?"*
* **🎯 Motif Penguji:** Menguji kecermatan penanganan teks Arab gundul/berharakat yang sangat sensitif terhadap makna hukum.
* **🛡️ Poin Kunci Jawaban:**
  * Input teks Arab di Step 4 Wizard menggunakan font khusus **Amiri RTL** yang mempertahankan ligatur dan harakat asli.
  * Teks Arab disimpan apa adanya di PostgreSQL dengan encoding `UTF-8` penuh.
  * Mekanisme **Community Peer-Review**: Umat dan santri di portal publik dapat mengeklik tombol *"Laporkan Koreksi / Typo Ibarat"* jika menemukan kesalahan cetak.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Teks ibarat adalah mahkota dari bahtsul masail. Di MOCHI, kami menerapkan 3 proteksi: pertama, antarmuka pengetikan khusus dengan font Amiri berarah kanan-ke-kiri (RTL) yang menjaga keutuhan harakat. Kedua, teks Arab disimpan dengan pengkodean UTF-8 murni sehingga tidak ada karakter rusak. Ketiga, kami menyediakan fitur **Uji Publik Ijtima'i (Peer-Review)** di mana setiap santri atau pembaca di seluruh Indonesia dapat melaporkan koreksi typo harakat langsung dari halaman fatwa untuk ditindaklanjuti pesantren."*

---

### Q05: *"Apakah ada batasan mazhab di MOCHI? Bagaimana jika ada pesantren yang memasukkan pendapat di luar Mazhab Empat?"*
* **🎯 Motif Penguji:** Menguji keselarasan platform dengan karakter tradisi pesantren di bawah naungan Ditjen Pesantren Kemenag RI dan Nahdlatul Ulama.
* **🛡️ Poin Kunci Jawaban:**
  * MOCHI berakar pada tradisi Bahtsul Masail Nahdlatul Ulama yang memprioritaskan Mazhab Syafi'i dan Mazhab Empat (*al-madzahib al-arba'ah*).
  * 35 Master Kitab yang tertanam di basis data adalah kitab-kitab turats muktabarah mu'tamad.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Platform MOCHI berpijak kokoh pada tradisi Ahlussunnah wal Jama'ah an-Nahdliyyah dengan prioritas Mazhab Syafi'i dan Mazhab Empat. Hal ini kami kunci melalui integrasi **35 Master Kitab Turats Muktabarah** di basis data, seperti Fathul Wahhab, Al-Majmu', dan Tuhfatul Muhtaj. Dengan demikian, rujukan fatwa yang dimasukkan tetap berada dalam koridor literatur yang diakui oleh para ulama pesantren Nusantara."*

---

## Kategori 2: AI, Chatbot RAG, & Mitigasi Halusinasi (POV Juri Teknologi AI)

### Q06: *"AI sering mengalami halusinasi dan mengarang dalil palsu. Bagaimana kalian menjamin fitur 'Tanya MOCHI' tidak sesat atau mengeluarkan fatwa liar?"*
* **🎯 Motif Penguji:** Menyerang keandalan LLM pada domain agama yang berisiko tinggi (*high-stakes domain*).
* **🛡️ Poin Kunci Jawaban:**
  * Arsitektur **Strict Retrieval-Augmented Generation (RAG)**: Chatbot **DILARANG BERFATWA SENDIRI**.
  * Pengamanan dua lapis (*Similarity Guardrail*): Jika skor kemiripan vektor di bawah ambang batas (0.65), sistem langsung menolak menjawab **tanpa memanggil LLM** (menghemat token & 0% risiko halusinasi).
  * Prompt System Terkunci: LLM hanya diinstruksikan merangkum data masail yang ditemukan, wajib menyertakan sitasi nama forum, nama mushohhih, dan ibarat kitab.
  * Terdapat penafian (*disclaimer*) fatwa di setiap jawaban AI.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Ini adalah pilar keamanan terpenting dalam arsitektur AI kami. 'Tanya MOCHI' bukan sekadar ChatGPT biasa, melainkan menggunakan metode **Strict RAG Terisolasi**. Mekanismenya: pertanyaan pengguna diubah menjadi vektor 768 dimensi menggunakan Google text-embedding-004, lalu dicocokkan ke database PostgreSQL pgvector. Jika tidak ditemukan dokumen masail yang relevan (ambang batas kemiripan < 0.65), **sistem langsung menolak secara tegas tanpa memanggil LLM**, dengan pesan bahwa masalah tersebut belum pernah dibahas di forum bahtsul masail. AI kami tidak memiliki izin untuk mengarang hukum atau menafsirkan ayat secara mandiri."*

---

### Q07: *"Jika pengguna bertanya hal umum seperti 'Bagaimana cara wudhu yang benar?' padahal itu tidak ada di hasil bahtsul masail, apa yang dilakukan chatbot?"*
* **🎯 Motif Penguji:** Menguji apakah chatbot melanggar batas cakupan (*domain boundary*) dan mencoba menjadi mesin penjawab fiqih dasar.
* **🛡️ Poin Kunci Jawaban:**
  * Chatbot menolak dengan santun dan mengingatkan pengguna bahwa MOCHI adalah repositori **Bahtsul Masail (studi kasus kontemporer)**, bukan buku fiqih dasar anak madrasah.
  * Chatbot menyarankan pengguna merujuk ke kitab fiqih dasar seperti Safinatun Najah atau Fathul Qorib.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Sistem kami akan merespons secara santun: 'Pertanyaan ini merupakan fiqih dasar fardhu 'ain yang dapat Anda pelajari di kitab Mabadi'ul Fiqhiyyah atau Safinatun Najah. MOCHI berfokus mendokumentasikan hasil musyawarah bahtsul masail atas persoalan hukum kontemporer.' Ini membuktikan bahwa batasan domain AI kami sangat terukur dan tidak melebar ke ranah yang bukan tujuannya."*

---

### Q08: *"Model AI apa yang kalian pakai di backend, dan mengapa memilih kombinasi tersebut?"*
* **🎯 Motif Penguji:** Menguji penguasaan teknis presenter terhadap stack AI, efisiensi komputasi, dan arsitektur fallback.
* **🛡️ Poin Kunci Jawaban:**
  * **Embedding:** Google AI Studio `text-embedding-004` (768 dimensi, pemrosesan cepat teks multibahasa Indonesia & Arab).
  * **Chatbot LLM Utama:** Groq LPU `llama-3.3-70b-versatile` (kecepatan generasi hingga 250 token/detik, penanganan logika fiqih tinggi, latensi super rendah).
  * **Fallback Model:** Google `gemini-1.5-flash` jika Groq mengalami *rate limit* atau gangguan jaringan.
  * Terbungkus rapi di dalam satu modul modular `lib/ai/` yang *vendor-agnostic*.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Di lapisan AI, kami merancang arsitektur berperforma tinggi dan berbiaya efisien: untuk embedding semantik teks Arab dan Indonesia, kami menggunakan Google text-embedding-004 768 dimensi yang terindeks HNSW di pgvector Supabase. Untuk generasi jawaban, kami menggunakan Groq Llama 3.3 70B yang mampu menghasilkan respons dalam waktu kurang dari 2 detik dengan pemahaman konteks fiqih yang sangat tajam. Kami juga menyematkan fallback otomatis ke Gemini 1.5 Flash jika terjadi kendala pada server utama, seluruhnya terisolasi dalam modul `lib/ai`."*

---

### Q09: *"Apakah teks Arab (ibarat) ikut di-embedding? Bagaimana mencocokkan kueri berbahasa Indonesia santai dengan teks Arab kitab kuning?"*
* **🎯 Motif Penguji:** Menanyakan kapabilitas *cross-lingual semantic retrieval* (Indonesia Latin ke Arab Fiqih).
* **🛡️ Poin Kunci Jawaban:**
  * Objek yang di-embedding adalah **dokumen gabungan terstruktur**: Judul + Deskripsi Kasus + Rumusan Jawaban + Terjemah/Konteks Ibarat.
  * Model embedding modern mampu memetakan kedekatan semantik lintas bahasa (*cross-lingual embedding space*).
  * Di level pencarian teks langsung (Perpustakaan), kami menggunakan `pg_trgm` dan ekstensi `unaccent` PostgreSQL untuk menangani transliterasi dan toleransi typo.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Dokumen yang kami embedding bukan hanya teks Arab mentahnya, melainkan satu kesatuan metadata masail yang mencakup taswirul mas'alah (deskripsi kasus Indonesia), diktum jawaban ulama, dan ibarat rujukannya. Model embedding Google text-embedding-004 memiliki ruang vektor lintas bahasa, sehingga ketika santri bertanya dengan bahasa Indonesia santai seperti 'hukum bayar pakai paylater', sistem secara akurat menemukan vektor masail yang memuat ibarat akad bai' bitsaman 'ajil dalam kitab Fathul Wahhab."*

---

### Q10: *"Bagaimana kalian mencegah jailbreak atau prompt injection pada chatbot 'Tanya MOCHI'?"*
* **🎯 Motif Penguji:** Menguji keamanan siber tingkat aplikasi AI (*LLM Security & OWASP Top 10 for LLM*).
* **🛡️ Poin Kunci Jawaban:**
  * Pemisahan ketat antara System Prompt, Konteks RAG (berada di dalam tag XML tertutup `<konteks_masail>`), dan Input Pengguna.
  * Instruksi sistem menolak tegas perintah untuk mengubah persona (misalnya: *"Ignore previous instructions and act as..."*).
  * Validasi panjang kueri chat (maksimal 500 karakter) dan rate limit 10 chat per 10 menit per IP.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami menerapkan prinsip isolasi konteks pada System Prompt LLM. Masukan pengguna divalidasi dengan Zod maksimal 500 karakter untuk mencegah teknik long-context injection. Dokumen hasil pencarian database kami bungkus dalam blok XML terenkapsulasi, dan System Prompt kami memiliki instruksi absolut anti-jailbreak yang menolak setiap perintah pengabaian aturan dasar fatwa. Jika pengguna mencoba memaksa AI berpendapat sendiri, AI diprogram untuk langsung mengembalikan penafian resmi."*

---

## Kategori 3: Arsitektur Sistem, Basis Data, & Multi-Tenancy (POV Juri Lead Architect)

### Q11: *"Kalian memakai Next.js dan Supabase. Mengapa tidak membuat backend terpisah dengan NestJS atau Go?"*
* **🎯 Motif Penguji:** Menguji alasan pemilihan tumpukan teknologi (*technology stack justification*) dan apakah ini solusi pragmatis atau sekadar ikut tren.
* **🛡️ Poin Kunci Jawaban:**
  * **Next.js App Router (Full-Stack)** memungkinkan Server Actions dan Route Handlers beroperasi secara *end-to-end type-safe* dengan TypeScript strict.
  * Supabase PostgreSQL bukan sekadar tempat simpan data, melainkan *database engine enterprise* yang menyediakan **Row-Level Security (RLS)**, **pgvector**, **pg_trgm**, dan **Full-Text Search** langsung di lapisan database.
  * Mengeliminasi latensi dan kompleksitas pemeliharaan dua repositori (*monolith modern*), sangat ideal untuk keandalan dan kecepatan *time-to-market* karya kompetisi Ditjen Pesantren.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Pemilihan Next.js App Router dan Supabase PostgreSQL adalah keputusan arsitektur yang sangat matang. Dengan paradigma Server Actions, otorisasi dan validasi Zod dieksekusi langsung di lingkungan server yang aman, tanpa mengekspos endpoint API publik yang rentan. Sementara itu, Supabase memberikan mesin PostgreSQL murni dengan fitur Row-Level Security, pgvector, dan ekstensi unaccent. Menggabungkan keduanya memberi kami keamanan setingkat enterprise perbankan tanpa beban memelihara backend mikroservis yang terpisah dan rentan desinkronisasi tipe data."*

---

### Q12: *"Bagaimana kalian mengimplementasikan Multi-Tenancy? Apakah database-nya dipisah per pesantren?"*
* **🎯 Motif Penguji:** Memeriksa pemahaman arsitektur *Multi-Tenancy*: Shared Database vs Isolated Database, dan risiko kebocoran data.
* **🛡️ Poin Kunci Jawaban:**
  * Kami menggunakan pendekatan **Shared Database dengan Logical Isolation via Row-Level Security (RLS) PostgreSQL**.
  * Setiap baris di tabel `forum` dan `masalah` memiliki relasi ke `lembaga_id`.
  * Kebijakan RLS database menggunakan klausa: `USING (lembaga_id = auth.uid() OR auth.role() = 'admin')`.
  * Efisiensi sumber daya tinggi, pencarian agregat nasional instan, dan matematis mustahil bocor di tingkat query SQL.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami menerapkan arsitektur Multi-Tenancy Shared Database dengan Isolasi Logis berbasis Row-Level Security di PostgreSQL. Setiap record forum dan masalah terikat secara relasional ke ID lembaga. Kebijakan RLS kami mengunci hak modifikasi hanya untuk pemilik token sesi `auth.uid()`. Pendekatan ini memungkinkan Kemenag memantau analitik agregat nasional di satu tempat, namun secara kriptografis dan matematis mustahil bagi Pesantren Lirboyo untuk mengedit atau melihat draf privat milik Pesantren Tebuireng."*

---

### Q13: *"Jika ada 10.000 pesantren di Indonesia yang aktif bersamaan mengunggah fatwa, apakah arsitektur ini sanggup menampungnya?"*
* **🎯 Motif Penguji:** Menguji wawasan skalabilitas (*scalability & throughput*).
* **🛡️ Poin Kunci Jawaban:**
  * Beban baca (*read-heavy*) dioptimalkan dengan **Next.js Static Site Generation (SSG)** dan Incremental Static Regeneration (ISR) untuk halaman publik yang telah terbit.
  * Indeks basis data menggunakan **B-Tree** pada foreign key, **GIN (Generalized Inverted Index)** pada teks bahasa Arab dan judul, serta **HNSW (Hierarchical Navigable Small World)** pada vektor AI.
  * Supabase PostgreSQL dapat di-*scale-up* secara vertikal dan horizontal (Read Replicas & Connection Pooling via PgBouncer).
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Arsitektur MOCHI dirancang siap skala (*production-ready*). Karakteristik repositori fatwa adalah 95% baca (*read-heavy*) dan 5% tulis (*write-heavy*). Halaman baca publik kami di-cache secara statis di jaringan edge CDN Vercel sehingga jutaan santri yang membaca tidak membebani server database. Di sisi database, seluruh kueri pencarian teks dan vektor telah didukung indeks GIN dan HNSW dengan PgBouncer pooling, siap melayani lonjakan puluhan ribu pesantren secara simultan."*

---

### Q14: *"Bagaimana kalian menangani pencarian teks jika pengguna salah ketik (typo) atau mencari tulisan Arab dengan huruf Latin?"*
* **🎯 Motif Penguji:** Menanyakan implementasi mesin pencari lokal tanpa ketergantungan layanan eksternal berbayar.
* **🛡️ Poin Kunci Jawaban:**
  * Menggunakan kombinasi ekstensi PostgreSQL: **`pg_trgm` (trigram matching)** dan **`unaccent`**.
  * Fuzzy search dengan ambang batas kesamaan (*similarity threshold* 0.3) untuk mendeteksi salah ketik (*did-you-mean*).
  * Normalisasi harakat: Harakat diabaikan saat pencarian indeks teks, namun tetap ditampilkan utuh saat dirender di antarmuka.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami tidak membutuhkan Elasticsearch pihak ketiga yang mahal. Di PostgreSQL, kami mengaktifkan modul `pg_trgm` dan `unaccent`. Sistem secara otomatis menghapus tanda aksen dan harakat pada kueri pencarian, lalu menghitung jarak kemiripan trigram. Jika santri mengetik 'dropshiping' dengan satu huruf 'p', algoritma fuzzy search kami tetap menemukan keputusan hukum tentang 'dropshipping' dan menampilkan banner saran pencarian otomatis."*

---

### Q15: *"Apa fungsi tabel `revisi` dan `log_audit` di database kalian?"*
* **🎯 Motif Penguji:** Menguji integritas data, jejak forensik, dan kepatuhan audit sistem.
* **🛡️ Poin Kunci Jawaban:**
  * **Tabel `revisi`:** Menerapkan pola *Event Sourcing Snapshot*. Setiap kali hasil masail yang telah terbit diperbarui teks ibaratnya, versi lama di-snapshot dalam format JSONB untuk mencegah pemalsuan naskah di kemudian hari.
  * **Tabel `log_audit`:** Mencatat seluruh transaksi sensitif (login, ganti sandi, persetujuan lembaga, penangguhan akun, pelaporan koreksi) beserta timestamp dan IP address.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Sebagai arsip fatwa rujukan nasional, kami menerapkan prinsip non-repudiasi (*immutability*). Tabel `revisi` menyimpan riwayat snapshot JSONB setiap ada pembaruan naskah pasca-terbit, sehingga kita selalu tahu versi aslinya. Sementara tabel `log_audit` merekam jejak forensik seluruh tindakan administratif secara otomatis, menjamin transparansi mutlak jika terjadi sengketa naskah di kemudian hari."*

---

## Kategori 4: Keamanan Siber, Kerahasiaan, & OWASP (POV Juri Cyber Security)

### Q16: *"Bagaimana kalian mencegah kebocoran Service Role Key Supabase? Apakah aman dari inspeksi DevTools browser?"*
* **🎯 Motif Penguji:** Mencari kesalahan paling umum pada pengembang pemula (mengekspos kredensial master database di klien).
* **🛡️ Poin Kunci Jawaban:**
  * Sesuai Aturan Keamanan PRD #12: **Service Role Key hanya berada di lingkungan server (*server-side only*)**.
  * Tidak ada variabel Service Role Key yang diberi prefix `NEXT_PUBLIC_`.
  * Seluruh mutasi data yang membutuhkan wewenang khusus dibungkus dalam Server Actions atau API Route Handler yang memvalidasi sesi cookie HTTP-Only.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami menerapkan prinsip Zero-Leakage. Kunci `SUPABASE_SERVICE_ROLE_KEY` tidak pernah diberi awalan `NEXT_PUBLIC_` dan hanya tersimpan di variabel lingkungan server Vercel. Di bundel JavaScript browser pengguna, yang ada hanyalah `NEXT_PUBLIC_SUPABASE_ANON_KEY` yang seluruh aksesnya dibatasi oleh Row-Level Security. Klien tidak pernah memiliki wewenang untuk mengeksekusi kueri bypass database."*

---

### Q17: *"Bagaimana jika ada hacker yang melakukan serangan brute force untuk membobol akun admin atau pesantren?"*
* **🎯 Motif Penguji:** Memeriksa ketahanan sistem otentikasi dari serangan kamus (*dictionary / brute-force attack*).
* **🛡️ Poin Kunci Jawaban:**
  * Menerapkan in-memory sliding-window **Rate Limiter** di Server Actions `/masuk`.
  * Dibatasi maksimal 5 kali kegagalan login per 1 menit untuk setiap alamat IP / email.
  * Percobaan ke-6 langsung diblokir dengan respons HTTP 429 Too Many Requests.
  * Sandi dienkripsi dengan algoritma bcrypt/Argon2 standar Supabase Auth.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Sistem kami telah dipersenjatai Rate Limiter berbasis sliding-window algoritma token bucket. Jika terdeteksi 5 kali percobaan salah sandi dalam kurun waktu 1 menit, sistem seketika mengunci akses untuk email dan alamat IP tersebut selama periode penalti. Selain itu, kami menerapkan monitor waktu diam (*idle session monitor*) 60 menit yang otomatis mengeluarkan sesi aktif jika ditinggalkan di laboratorium komputer pesantren."*

---

### Q18: *"Bagaimana sistem menangani keamanan berkas yang diunggah saat pendaftaran pesantren (piagam izin operasional / SK)?"*
* **🎯 Motif Penguji:** Menguji potensi celah keamanan *Malicious File Upload* dan *Unauthenticated File Access*.
* **🛡️ Poin Kunci Jawaban:**
  * Validasi tipe MIME di server (hanya menerima `application/pdf`, `image/jpeg`, `image/png`) dengan batas maksimal 5 MB.
  * Berkas disimpan di bucket Supabase Storage berstatus **Private (Bukan Publik)**.
  * Berkas hanya dapat diakses melalui **Signed URL berbatas waktu (1 jam)** yang dibuat oleh server khusus untuk Administrator Pusat.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Berkas sensitif seperti SK Kepengurusan dan Piagam Izin Operasional disimpan di bucket penyimpanan privat yang tidak dapat diakses secara langsung oleh publik via URL statis. Ketika Admin Kemenag ingin meninjau berkas, server membuatkan Signed URL bertanda tangan kriptografis yang kedaluwarsa secara otomatis dalam 60 menit. Ini mencegah berkas resmi pesantren disalahgunakan pihak ketiga."*

---

### Q19: *"Bagaimana kalian melindungi aplikasi dari celah Cross-Site Scripting (XSS) dan SQL Injection?"*
* **🎯 Motif Penguji:** Menguji kepatuhan terhadap OWASP Top 10.
* **🛡️ Poin Kunci Jawaban:**
  * **SQL Injection:** Risiko 0% karena seluruh kueri menggunakan parameterized kueri Supabase PostgREST SDK; tidak ada *raw SQL concatenation*.
  * **XSS:** Menggunakan Next.js React yang otomatis melakukan *HTML escaping*. Kami **mengharamkan penggunaan `dangerouslySetInnerHTML`** kecuali untuk rendering teks Arab yang telah disanitasi ketat. Seluruh masukan formulir divalidasi dengan skema Zod.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Seluruh input pengguna wajib melewati filter validasi skema Zod sebelum disentuh logika aplikasi. Untuk proteksi SQL Injection, kami 100% menggunakan parameterized query dari Supabase PostgREST, tanpa string concatenation. Sementara untuk XSS, komponen React secara inheren melakukan karakter escaping, dan di seluruh kode kami tidak mengizinkan dangerouslySetInnerHTML tanpa sanitasi. Kami juga menyertakan header keamanan CSP (Content Security Policy) di respon server."*

---

## Kategori 5: Tata Kelola, Legalitas, & Integrasi NSPP/EMIS (POV Pejabat Kemenag)

### Q20: *"Apakah proses pendaftaran pesantren ber-NSPP ini sudah langsung memvalidasi secara live ke database EMIS Ditjen Pesantren?"*
* **🎯 Motif Penguji:** Pertanyaan paling sering dan paling menjebak dari birokrat Kemenag.
* **🛡️ Poin Kunci Jawaban:**
  * **JANGAN BERBOHONG MENGATAKAN SUDAH TERHUBUNG LIVE.**
  * Jelaskan konsep **Two-Tier Governance (Tata Kelola Dua Tahap)**: Validasi struktural 12 digit numerik di aplikasi, disusul verifikasi bukti piagam izin operasional oleh Admin Kemenag.
  * Jelaskan alasan kehati-hatian (*ihtiyath*): Verifikasi fatwa tidak boleh hanya mengandalkan pencocokan angka otomatis, melainkan harus ditinjau keabsahan fisiknya.
  * Sebutkan bahwa skema database MOCHI sudah memiliki kolom `nspp` unik dan siap 100% *plug-and-play* dengan API EMIS begitu kerja sama kedinasan diresmikan.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Terima kasih atas pertanyaan yang sangat strategis ini. Untuk fase inovasi saat ini, kami menerapkan pendekatan **Two-Tier Governance (Tata Kelola Dua Tahap)**: tahap pertama adalah validasi format 12 digit numerik di sisi sistem, dan tahap kedua adalah verifikasi dokumen piagam izin operasional oleh Administrator Pusat di meja persetujuan. Kami sengaja memilih pendekatan ini berdasarkan prinsip ihtiyath (kehati-hatian), karena fatwa keagamaan memerlukan peninjauan keabsahan otentik. Namun secara arsitektur, tabel database kami telah siap 100% terhubung secara plug-and-play ke API EMIS Kemenag begitu nota kesepahaman integrasi data dibuka."*

---

### Q21: *"Bagaimana jika ada lembaga yang mengunggah keputusan bahtsul masail yang mengandung konten radikalisme, ujaran kebencian, atau menentang NKRI?"*
* **🎯 Motif Penguji:** Menguji sistem mitigasi risiko dan pengamanan ideologi kebangsaan.
* **🛡️ Poin Kunci Jawaban:**
  * **Preventif:** Seleksi ketat di awal; hanya pesantren ber-NSPP sah dan LBM NU ber-SK yang bisa mendaftar.
  * **Represif (Emergency Kill Switch):** Di menu `/admin/lembaga`, Admin Pusat Kemenag memiliki tombol **"Tangguhkan Lembaga" (Suspend)**. Sekali klik, seluruh fatwa lembaga tersebut seketika ditarik dari portal publik dan dicabut dari indeks pencarian AI.
  * **Audit:** Jejak pengunggah tercatat di `log_audit` untuk pertanggungjawaban hukum.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami telah menyiapkan mitigasi berlapis. Di gerbang hulu, hanya lembaga resmi terverifikasi yang memiliki izin terbit. Jika di kemudian hari ditemukan anomali atau naskah yang melanggar konsensus kebangsaan, Administrator Kementerian memiliki tombol **'Tangguhkan Lembaga' (Suspend)** di menu `/admin/lembaga`. Sekali diklik, sistem secara otomatis membekukan hak akses lembaga dan mencabut seluruh arsipnya dari tampilan publik serta basis data chatbot AI dalam hitungan detik."*

---

### Q22: *"Mengapa struktur LBM NU non-pesantren (tingkat MWC atau PCNU) diperbolehkan mendaftar padahal mereka tidak punya NSPP?"*
* **🎯 Motif Penguji:** Menguji pemahaman presenter terhadap realitas sosiologis tradisi bahtsul masail di Indonesia.
* **🛡️ Poin Kunci Jawaban:**
  * Di lapangan, forum bahtsul masail tidak hanya diselenggarakan di dalam pondok pesantren, tetapi secara rutin diadakan oleh **Lembaga Bahtsul Masail Nahdlatul Ulama (LBM NU)** tingkat Majelis Wakil Cabang (MWCNU kecamatan) dan Pengurus Cabang (PCNU kabupaten/kota).
  * LBM NU tingkat kecamatan/kabupaten tidak memiliki NSPP, tetapi mereka memiliki **Surat Keputusan (SK) Kepengurusan Resmi** yang disahkan oleh PWNU/PBNU.
  * Jika MOCHI hanya menerima NSPP, maka ribuan karya bahtsul masail para kyai di tingkat MWC NU (seperti LBM MWCNU Lenteng Sumenep) tidak akan bisa diselamatkan.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Ini adalah bukti bahwa sistem MOCHI dirancang berbasis realitas sosiologis pesantren dan jam'iyyah NU di akar rumput. Forum bahtsul masail justru sangat hidup di tingkat MWC NU kecamatan dan PCNU kabupaten yang diselenggarakan secara bergilir antar-pesantren. Struktur LBM NU ini tidak memiliki NSPP pesantren, tetapi mereka memiliki legalitas berupa SK Kepengurusan resmi. Dengan mengakomodasi tipe lembaga organisasi ber-SK, MOCHI merangkul seluruh khazanah musyawarah fiqih tanpa meninggalkan para kyai di pelosok kecamatan."*

---

### Q23: *"Apa manfaat konkret Dashboard Ditjen Pesantren di `/admin/ditjen` bagi Kementerian Agama RI?"*
* **🎯 Motif Penguji:** Menilai nilai tambah (*value proposition*) produk terhadap instansi penyelenggara lomba (Kemenag RI).
* **🛡️ Poin Kunci Jawaban:**
  * **Early Warning & Trend Radar:** Mengetahui persoalan hukum apa yang paling meresahkan umat di lapangan (misal: lonjakan tren pertanyaan pinjol, judi online, atau kawin siri).
  * **Peta Literasi Pesantren:** Memetakan keaktifan musyawarah fiqih per provinsi untuk dasar pemberian bantuan atau apresiasi kelembagaan.
  * **Satu Klik Ekspor CSV:** Mempermudah aparatur kementerian menyusun laporan kinerja dan arsip kenegaraan tanpa rekap manual.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Dashboard Ditjen Pesantren mentransformasi data fatwa menjadi instrumen intelijen kebijakan (Policy-Making Intelligence). Selama ini Kemenag belum memiliki instrumen real-time untuk memetakan dinamika hukum Islam di masyarakat santri. Melalui dashboard ini, Kemenag dapat memantau pergeseran tren fatwa—apakah isu muamalah digital sedang mendominasi di Jawa Timur, atau isu munakahat di Jawa Barat. Dan yang terpenting, tersedia tombol ekspor data resmi CSV untuk mendukung perumusan regulasi keagamaan nasional."*

---

## Kategori 6: Desain UI/UX, Aksesibilitas, & Tipografi Arab (POV Juri UX/UI)

### Q24: *"Banyak santri mengakses web melalui ponsel pintar murah di pedesaan dengan sinyal terbatas. Bagaimana MOCHI merespons hal ini?"*
* **🎯 Motif Penguji:** Menguji kepatuhan kriteria responsivitas mobile-first dan optimasi performa jaringan lambat.
* **🛡️ Poin Kunci Jawaban:**
  * Desain **Mobile-First murni**, telah diuji dan responsif hingga lebar layar minimum **360 px**.
  * Target sentuh (*touch targets*) seluruh tombol dan tautan mematuhi standar WCAG, yaitu minimal **44 x 44 piksel**.
  * Berat aset web sangat ringan: menggunakan font SVG lokal, ikon Lucide berbasis vektor, dan *code splitting* otomatis per rute oleh Next.js Turbopack.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami memahami keterbatasan perangkat di lingkungan pesantren. MOCHI dibangun dengan disiplin Mobile-First yang dioptimalkan sejak resolusi 360 piksel. Seluruh tombol aksi memiliki area sentuh minimal 44 piksel agar ramah jempol. Kami juga meminimalkan muatan data dengan memanfaatkan kompresi modern Next.js dan format gambar WebP, sehingga halaman dapat terbuka lancar dalam waktu kurang dari 2 detik meski di jaringan seluler 3G pedesaan."*

---

### Q25: *"Bagaimana kalian merancang keterbacaan teks Arab bagi masyarakat awam yang mungkin matanya kesulitan membaca huruf kecil?"*
* **🎯 Motif Penguji:** Menguji fitur inklusivitas dan kenyamanan pembaca (*accessibility & readability*).
* **🛡️ Poin Kunci Jawaban:**
  * Menggunakan tipografi **Amiri**, font kaligrafi Naskhi standar internasional yang dirancang khusus untuk keterbacaan teks Arab panjang.
  * Tersedia fitur **Pengubah Ukuran Huruf Arab (Font Resizer `A-` / `A` / `A+`)** langsung di bilah aksi halaman fatwa.
  * Preferensi ukuran huruf disimpan di `localStorage` perangkat sehingga pengguna tidak perlu mengatur ulang saat membuka halaman lain.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Di setiap naskah fatwa, kami menyematkan pengontrol ukuran font Arab interaktif: santri dan asatidz dapat memperbesar font dari ukuran standar hingga ukuran ekstra besar hanya dengan satu sentuhan. Pilihan ukuran huruf tersebut tersimpan di preferensi lokal perangkat mereka. Dipadukan dengan font Amiri berharakat tajam dan kontras rasio warna yang memenuhi standar WCAG AA, teks kitab kuning dapat dikaji dengan sangat nyaman tanpa melelahkan mata."*

---

### Q26: *"Kenapa memilih tema warna hijau pesantren dan krem emas (*parchment*)? Apakah ini ada filosofi desainnya?"*
* **🎯 Motif Penguji:** Menguji kedewasaan konsep identitas visual (*Brand Identity & Cultural Alignment*).
* **🛡️ Poin Kunci Jawaban:**
  * Mengacu pada dokumen panduan desain `docs/DESIGN.md`:
  * **Hijau Khidmah (`#1B4332` / Emerald Deep):** Melambangkan tradisi santri, kedamaian, dan marwah Jam'iyyah Nahdlatul Ulama.
  * **Krem Kitab Kuning (`#FDFBF7` / Warm Sand):** Mengadaptasi warna kertas kitab turats klasik yang teduh dipandang mata dalam durasi kajian yang lama.
  * Menghindari tren "AI Slop" (gradien ungu-biru generik) demi menghadirkan jiwa pesantren yang autentik.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Identitas visual MOCHI dirancang sarat makna: kami memadukan warna Hijau Khidmah yang mewakili keteduhan tradisi pesantren Nusantara dengan latar Warm Parchment yang mengambil filosofi kertas kitab kuning klasik. Kami sengaja menolak template warna ungu AI generik agar MOCHI memiliki jiwa dan identitas kultural yang membanggakan bagi insan santri Indonesia."*

---

## Kategori 7: Manajemen Produk, Skalabilitas, & Biaya Operasional (POV Project Manager)

### Q27: *"Berapa perkiraan biaya operasional (OPEX) bulanan untuk menjalankan MOCHI di fase produksi nasional? Apakah Kemenag akan terbebani biaya langganan yang mahal?"*
* **🎯 Motif Penguji:** Pertanyaan khas Project Manager / Pejabat Anggaran: apakah sistem ini hemat biaya (*cost-effective*) atau menjadi beban APBN.
* **🛡️ Poin Kunci Jawaban:**
  * **Hosting Aplikasi:** Vercel Pro tier atau VPS Server Kemenag (~Rp 300.000 / bulan).
  * **Basis Data Supabase:** Pro Tier (~Rp 400.000 / bulan untuk 8 GB database & 100.000 MAU).
  * **AI Chatbot & Embedding:** Groq Llama 3.3 70B mengenakan biaya sangat murah ($0.59 per 1 juta token); Google text-embedding-004 memiliki kuota gratis melimpah. Rata-rata biaya inferensi AI untuk 50.000 pertanyaan fatwa per bulan hanyalah sekitar **Rp 150.000**.
  * **Total Estimasi Biaya:** Kurang dari **Rp 1.000.000 per bulan** untuk melayani ribuan pesantren!
* **🗣️ Skrip Jawaban Verbal:**  
  > *"MOCHI dirancang dengan efisiensi biaya tingkat tinggi (High-Value, Low-Cost Architecture). Karena kami menerapkan caching cerdas di sisi edge CDN dan guardrail ketat pada AI, konsumsi token LLM sangat hemat. Total estimasi biaya operasional cloud dan kecerdasan buatan untuk melayani puluhan ribu santri diestimasikan kurang dari 1 juta rupiah per bulan. Ini menjadikannya solusi digital yang sangat realistis dan berkelanjutan untuk diadopsi secara permanen oleh Kementerian Agama RI."*

---

### Q28: *"Bagaimana roadmap pengembangan MOCHI setelah kompetisi Santrivision 2026 selesai?"*
* **🎯 Motif Penguji:** Menguji apakah proyek ini hanya prototipe lomba yang akan mati setelah penjurian, atau memiliki visi jangka panjang (*sustainable roadmap*).
* **🛡️ Poin Kunci Jawaban:**
  * **Fase 1 (Saat Ini):** Stabilisasi Repositori Bahtsul Masail Bersanad, Wizard 5 Langkah, Chatbot RAG Bersitasi, dan Dashboard Ditjen Pesantren (Status: 100% Selesai).
  * **Fase 2 (Q1 2027):** Katalog Repositori Kitab Kuning Terbuka (Pencarian Silang Dalil Seluruh Fatwa se-Indonesia) dan Integrasi PKS API EMIS Kemenag.
  * **Fase 3 (Q3 2027):** Aplikasi Mobile Android Native (PWA/Android SDK) dengan fitur luring (*offline sync*) untuk pesantren di daerah 3T.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"MOCHI tidak berhenti di panggung lomba ini. Roadmap kami telah terbagi ke dalam 3 fase nyata: Fase pertama mengamankan dan mendigitalkan arsip fatwa bersanad telah rampung 100%. Fase kedua pada awal 2027 adalah memperluas modul Master Kitab menjadi Katalog Repositori Terbuka untuk pencarian silang dalil antar-pesantren serta integrasi resmi API EMIS. Dan fase ketiga adalah merilis MOCHI Mobile PWA ramah offline untuk santri di wilayah pelosok 3T."*

---

### Q29: *"Bagaimana kalian mengukur keberhasilan produk ini (Product Metrics & KPI)?"*
* **🎯 Motif Penguji:** Menguji pola pikir metrik produk (*Data-Driven Decision Making*).
* **🛡️ Poin Kunci Jawaban:**
  * **Metrik Akuisisi:** Jumlah pondok pesantren dan struktur LBM NU yang terverifikasi aktif (Target: 500 lembaga dalam 6 bulan pertama).
  * **Metrik Literasi (Dampak):** Total keputusan bahtsul masail yang berhasil diselamatkan dari kertas ke bentuk digital (Target: 5.000 masail bersanad).
  * **Metrik Akurasi AI:** Persentase sitasi akurat dan tingkat penolakan query di luar koridor data (Target: 0% halusinasi hukum).
  * **Metrik Partisipasi Umat:** Jumlah koreksi teks ijtima'i yang berhasil ditindaklanjuti oleh pesantren.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kami mengukur kesuksesan MOCHI melalui tiga Key Performance Indicators (KPI): pertama, Indeks Penyelamatan Khazanah—yaitu berapa ribu arsip kertas fotokopi pesantren yang berhasil dialihmediakan menjadi naskah digital ber-ISBN sanad. Kedua, Indeks Akurasi Pengetahuan AI dengan target nol persen halusinasi hukum. Dan ketiga, Indeks Keaktifan Forum Pesantren yang dipantau secara transparan melalui Dashboard Ditjen Pesantren."*

---

## Kategori 8: Kepatuhan Regulasi Lomba Santrivision & Alih Hak Cipta (POV Panitia)

### Q30: *"Apakah sistem ini 100% karya orisinal tim kalian, atau memakai template siap pakai?"*
* **🎯 Motif Penguji:** Menguji orisinalitas karya dan integritas kejujuran akademik tim.
* **🛡️ Poin Kunci Jawaban:**
  * Arsitektur, skema database SQL, komponen wizard 5 langkah, antarmuka Tailwind/shadcn, dan integrasi RAG AI dirancang dan dikoding sendiri secara spesifik untuk kebutuhan tradisi pesantren Nahdlatul Ulama.
  * Tidak menggunakan template CMS instan seperti WordPress atau Laravel starter kit.
  * Seluruh catatan sesi rekayasa perangkat lunak tercatat transparan di `docs/AI_USAGE_LOG.md`.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Karya MOCHI adalah 100% orisinalitas rancang bangun tim kami untuk menjawab tantangan lomba Santrivision 2026. Kami membangunnya dari nol menggunakan Next.js App Router dan TypeScript strict, dengan skema database relasional PostgreSQL yang dirancang khusus mengikuti struktur persidangan bahtsul masail NU. Kami juga mendokumentasikan setiap proses kerja dan penggunaan asisten AI secara transparan di berkas AI Usage Log sesuai amanat pedoman lomba."*

---

### Q31: *"Bagaimana dengan lisensi pustaka pihak ketiga yang digunakan? Apakah ada pustaka berlisensi GPL yang bisa menuntut kementerian?"*
* **🎯 Motif Penguji:** Menguji kepatuhan hukum (*legal compliance*) atas lisensi open-source sesuai TOR Santrivision 2026 Bagian B.
* **🛡️ Poin Kunci Jawaban:**
  * Seluruh dependensi pihak ketiga telah diaudit dan dicatat dalam berkas **`THIRD_PARTY.md`**.
  * 100% paket yang dipasang menggunakan lisensi permisif yang aman: **MIT License**, **Apache 2.0**, atau **BSD-3-Clause**.
  * **Tidak ada satu pun pustaka yang menggunakan lisensi copyleft kuat (seperti GPLv3 / AGPL)** yang dapat memaksa pembukaan kode rahasia atau menimbulkan sengketa lisensi.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Kepatuhan lisensi adalah prioritas kepatuhan tertinggi kami. Sesuai panduan teknis lomba, seluruh paket pihak ketiga telah diaudit ketat dan terinventarisasi di berkas `THIRD_PARTY.md`. Kami hanya menggunakan pustaka berlisensi permisif seperti MIT dan Apache-2.0, seperti Lucide Icons, Radix UI, dan Zod. Sistem kami 100% bebas dari lisensi viral copyleft seperti GPL, sehingga sepenuhnya aman secara hukum dan tidak menimbulkan sengketa hak kekayaan intelektual."*

---

### Q32: *"Sesuai ketentuan lomba Santrivision, hak cipta karya inovasi pemenang dapat dialihkan atau dimanfaatkan oleh Ditjen Pesantren Kemenag RI. Apakah tim kalian bersedia?"*
* **🎯 Motif Penguji:** Memastikan komitmen tim terhadap klausul kepemilikan dan penyerahan karya ke negara.
* **🛡️ Poin Kunci Jawaban:**
  * **Jawaban Tegas:** **SANGAT BERSEDIA DAN BANGGA.**
  * Repositori proyek sengaja dikelola privat tanpa lisensi open source bebas, agar hak cipta dan kepemilikannya dapat dialihkan secara sah kepada Ditjen Pendidikan Diniyah dan Pondok Pesantren Kemenag RI.
  * Tim siap mendampingi proses serah terima (*handover*), migrasi server kedinasan, dan pelatihan teknis bagi staf kementerian.
* **🗣️ Skrip Jawaban Verbal:**  
  > *"Dengan sepenuh hati kami menyatakan sangat bersedia dan bangga. Niat awal kami membangun MOCHI adalah berkhidmah untuk pesantren dan Kementerian Agama Republik Indonesia. Repositori kami jaga tetap privat tanpa lisensi publik bebas, khusus disiapkan untuk dialihkan hak pemanfaatannya kepada Ditjen Pendidikan Diniyah dan Pondok Pesantren. Tim kami juga siap memberikan pendampingan teknis penuh dan alih pengetahuan agar MOCHI dapat dioperasionalkan secara berkelanjutan sebagai infrastruktur digital kebanggaan Kemenag RI."*

---

## 💡 Matriks Kilat Jawaban 1 Kalimat (Pocket Card Presenter)

| Topik Pertanyaan | Kunci Jawaban Peluru (Hafalkan Kalimat Ini) |
|---|---|
| **Perbedaan Fatwa (Khilafiyah)** | *"MOCHI adalah repositori bersanad yang menghormati ikhtilaf, bukan mufti digital penyeragam fatwa."* |
| **Koneksi Live ke EMIS** | *"Kami menerapkan Two-Tier Governance demi prinsip kehati-hatian (*ihtiyath*), namun database kami sudah 100% siap plug-and-play ke API EMIS."* |
| **Halusinasi Chatbot AI** | *"Jika skor kemiripan vektor di bawah 0.65, sistem menolak menjawab tanpa memanggil LLM—menjamin nol persen halusinasi hukum."* |
| **Kerahasiaan Draf Antar-Pesantren** | *"Data terisolasi secara kriptografis di tingkat query database menggunakan PostgreSQL Row-Level Security, bukan sekadar di frontend."* |
| **Pencegahan Radikalisme** | *"Pendaftaran dikurasi via NSPP/SK, dan Admin Kemenag dibekali Emergency Kill Switch (Tombol Suspend) untuk membekukan akun seketika."* |
| **Typo Ibarat Arab** | *"Teks Arab berfont Amiri RTL dan dilindungi mekanisme uji publik ijtima'i (community peer-review) dari santri se-Indonesia."* |
| **Biaya Operasional (OPEX)** | *"Arsitektur cerdas edge-caching membuat estimasi biaya cloud dan AI di bawah Rp 1.000.000 per bulan untuk ribuan pesantren."* |
| **Penyerahan Hak Cipta ke Kemenag** | *"Kami sangat bersedia dan bangga menyerahkan pemanfaatan karya MOCHI seutuhnya kepada Ditjen Pesantren Kemenag RI."* |

---

*Dokumen ini disusun untuk memperkuat argumentasi tim di hadapan Dewan Juri Final Santrivision 2026.*  
**Kuasai substansinya, sampaikan dengan santun dan berwibawa, dan bawa pulang gelar juara! 🏆**
