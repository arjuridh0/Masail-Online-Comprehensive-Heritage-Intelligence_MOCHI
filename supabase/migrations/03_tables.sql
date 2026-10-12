-- ============================================================
-- MOCHI: Fase 2 — Tabel Utama
-- ============================================================

-- ===== PROFIL PENGGUNA (terhubung ke auth.users) =====
create table if not exists profil (
  id          uuid primary key references auth.users(id) on delete cascade,
  nama        text not null,
  peran       peran_pengguna not null default 'lembaga',
  dibuat_pada timestamptz not null default now()
);

-- ===== LEMBAGA =====
create table if not exists lembaga (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nama              text not null,
  jenis             jenis_lembaga not null,
  induk_id          uuid references lembaga(id),
  deskripsi         text,
  kota              text,
  provinsi          text,
  alamat            text,
  situs_web         text,
  kontak_email      text,
  kontak_telepon    text,
  nspp              text unique,
  emis_id           text,
  logo_url          text,
  dokumen_bukti_url text,
  status            status_lembaga not null default 'menunggu',
  alasan_status     text,
  diverifikasi_pada timestamptz,
  dibuat_pada       timestamptz not null default now(),
  diperbarui_pada   timestamptz not null default now()
);

-- NSPP wajib untuk jenis pesantren
alter table lembaga drop constraint if exists nspp_wajib_pesantren;
alter table lembaga add constraint nspp_wajib_pesantren
  check (jenis <> 'pesantren' or nspp is not null);

-- ===== PENGELOLA LEMBAGA =====
create table if not exists pengelola (
  lembaga_id uuid references lembaga(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  primary key (lembaga_id, user_id)
);

-- ===== KITAB (MASTER DATA) =====
create table if not exists kitab (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  nama_latin      text not null,
  nama_arab       text,
  pengarang       text,
  pengarang_arab  text,
  wafat_h         int,
  bidang          text,
  alias           text[] default '{}',
  disetujui       boolean not null default true,
  diusulkan_oleh  uuid references auth.users(id),
  dibuat_pada     timestamptz not null default now()
);

-- ===== FORUM BAHTSUL MASAIL =====
create table if not exists forum (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  lembaga_id       uuid not null references lembaga(id) on delete restrict,
  nama             text,
  tuan_rumah       text,
  tanggal_mulai    date not null,
  tanggal_selesai  date,
  tanggal_hijriah  text,
  lokasi           text not null,
  kota             text,
  provinsi         text,
  sumber_materi    text,
  jenis            jenis_pembahasan,
  moderator        text[] not null default '{}',
  pentashih        text[] not null default '{}',
  perumus          text[] not null default '{}',
  catatan_arsip    text,
  status           status_konten not null default 'draf',
  diterbitkan_pada timestamptz,
  tayangan         bigint not null default 0,
  dibuat_oleh      uuid references auth.users(id),
  dibuat_pada      timestamptz not null default now(),
  diperbarui_pada  timestamptz not null default now(),
  dihapus_pada     timestamptz
);

-- ===== DOKUMENTASI KEGIATAN FORUM =====
create table if not exists dokumentasi (
  id         uuid primary key default gen_random_uuid(),
  forum_id   uuid not null references forum(id) on delete cascade,
  url        text not null,
  keterangan text,
  urutan     int not null default 0
);

-- ===== MASALAH / AS'ILAH =====
create sequence if not exists masalah_kode_seq;

create table if not exists masalah (
  id              uuid primary key default gen_random_uuid(),
  kode            text unique not null,
  slug            text unique not null,
  forum_id        uuid not null references forum(id) on delete cascade,
  judul           text not null,
  deskripsi       text not null,
  topik           topik_enum[] not null,
  corak           jenis_pembahasan default 'waqiiyyah',
  kata_kunci      text[] not null default '{}',
  urutan          int not null default 0,
  tayangan        bigint not null default 0,
  teks_cari       tsvector,
  dibuat_pada     timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now(),
  constraint topik_tidak_kosong check (array_length(topik, 1) >= 1)
);

-- ===== PERTANYAAN + JAWABAN (per masalah) =====
create table if not exists pertanyaan (
  id         uuid primary key default gen_random_uuid(),
  masalah_id uuid not null references masalah(id) on delete cascade,
  label      text not null default 'a',
  teks       text not null,
  jawaban    text not null,
  urutan     int not null default 0
);

-- ===== RUJUKAN (AL-MA'KHADZ / IBARAT KITAB) =====
create table if not exists rujukan (
  id            uuid primary key default gen_random_uuid(),
  pertanyaan_id uuid not null references pertanyaan(id) on delete cascade,
  kitab_id      uuid references kitab(id),
  kitab_teks    text,
  juz           text,
  halaman       text,
  teks_arab     text,
  terjemah      text,
  urutan        int not null default 0,
  constraint kitab_wajib check (kitab_id is not null or kitab_teks is not null)
);

-- ===== POTONGAN UNTUK RAG / PENCARIAN SEMANTIK =====
create table if not exists potongan (
  id            uuid primary key default gen_random_uuid(),
  pertanyaan_id uuid not null references pertanyaan(id) on delete cascade,
  masalah_id    uuid not null references masalah(id) on delete cascade,
  isi           text not null,
  embedding     vector(768),
  dibuat_pada   timestamptz not null default now()
);

-- ===== RIWAYAT REVISI =====
create table if not exists revisi (
  id         uuid primary key default gen_random_uuid(),
  entitas    text not null,
  entitas_id uuid not null,
  snapshot   jsonb not null,
  ringkasan  text,
  oleh       uuid references auth.users(id),
  pada       timestamptz not null default now()
);

-- ===== LAPORAN KONTEN =====
create table if not exists laporan (
  id            uuid primary key default gen_random_uuid(),
  masalah_id    uuid references masalah(id) on delete set null,
  alasan        text not null,
  detail        text,
  kontak        text,
  status        status_laporan not null default 'baru',
  catatan_admin text,
  dibuat_pada   timestamptz not null default now()
);

-- ===== LOG AUDIT =====
create table if not exists log_audit (
  id         bigserial primary key,
  user_id    uuid,
  aksi       text not null,
  entitas    text,
  entitas_id text,
  meta       jsonb,
  pada       timestamptz not null default now()
);

-- ===== LOG CHAT ANONIM =====
create table if not exists log_chat (
  id             bigserial primary key,
  pertanyaan     text not null,
  ada_sumber     boolean not null,
  jumlah_sumber  int,
  skor_tertinggi real,
  umpan_balik    smallint,
  pada           timestamptz not null default now()
);

-- ===== TAYANGAN UNIK HARIAN (ANTI-MANIPULASI) =====
create table if not exists tayangan_harian (
  tanggal   date not null,
  jenis     text not null,
  target_id uuid not null,
  sesi_hash text not null,
  primary key (tanggal, jenis, target_id, sesi_hash)
);
