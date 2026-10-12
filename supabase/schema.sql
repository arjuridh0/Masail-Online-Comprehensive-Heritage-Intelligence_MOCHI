-- ============================================================
-- MOCHI: FULL SCHEMA DEFINITION (CONSOLIDATED)
-- Generated for easy one-click execution in Supabase SQL Editor
-- ============================================================

-- >>> 01_extensions.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Ekstensi PostgreSQL
-- ============================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists unaccent;
create extension if not exists vector;


-- >>> 02_enums.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Tipe Enum
-- ============================================================

do $$ begin
  create type peran_pengguna as enum ('lembaga', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_lembaga as enum ('menunggu', 'terverifikasi', 'ditolak', 'ditangguhkan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type jenis_lembaga as enum (
    'pesantren',
    'lembaga_internal_pesantren',
    'organisasi',
    'lembaga_lain'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_konten as enum ('draf', 'terbit');
exception when duplicate_object then null; end $$;

do $$ begin
  create type topik_enum as enum ('ibadah', 'muamalah', 'munakahat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type jenis_pembahasan as enum (
    'waqiiyyah',
    'maudhuiyyah',
    'qanuniyyah',
    'lainnya'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_laporan as enum ('baru', 'diproses', 'selesai', 'ditolak');
exception when duplicate_object then null; end $$;


-- >>> 03_tables.sql <<<
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


-- >>> 04_indexes.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Indeks Performa
-- ============================================================

-- ===== LEMBAGA =====
create index if not exists idx_lembaga_nama_trgm on lembaga using gin (nama gin_trgm_ops);
create index if not exists idx_lembaga_status on lembaga (status);

-- ===== KITAB =====
create index if not exists idx_kitab_nama_latin_trgm on kitab using gin (nama_latin gin_trgm_ops);

-- ===== FORUM =====
create index if not exists idx_forum_lembaga_status on forum (lembaga_id, status);
create index if not exists idx_forum_tanggal on forum (tanggal_mulai desc);
create index if not exists idx_forum_dihapus on forum (dihapus_pada) where dihapus_pada is null;

-- ===== MASALAH =====
create index if not exists idx_masalah_topik on masalah using gin (topik);
create index if not exists idx_masalah_teks_cari on masalah using gin (teks_cari);
create index if not exists idx_masalah_judul_trgm on masalah using gin (judul gin_trgm_ops);
create index if not exists idx_masalah_forum on masalah (forum_id);

-- ===== PERTANYAAN =====
create index if not exists idx_pertanyaan_masalah on pertanyaan (masalah_id, urutan);

-- ===== RUJUKAN =====
create index if not exists idx_rujukan_pertanyaan on rujukan (pertanyaan_id);
create index if not exists idx_rujukan_kitab on rujukan (kitab_id);

-- ===== POTONGAN (RAG / VECTOR SEARCH) =====
-- HNSW index: performa terbaik untuk similarity search cosine
create index if not exists idx_potongan_embedding
  on potongan using hnsw (embedding vector_cosine_ops);
create index if not exists idx_potongan_masalah on potongan (masalah_id);

-- ===== REVISI =====
create index if not exists idx_revisi_entitas on revisi (entitas, entitas_id, pada desc);

-- ===== LOG AUDIT =====
create index if not exists idx_log_audit_pada on log_audit (pada desc);

-- ===== TAYANGAN HARIAN =====
create index if not exists idx_tayangan_target on tayangan_harian (jenis, target_id, tanggal);


-- >>> 05_views.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — View & Materialized View
-- ============================================================

-- ===== VIEW PUBLIK MASALAH =====
-- Menggabungkan masalah terbit dari lembaga terverifikasi
create or replace view v_masalah_publik as
select
  m.id,
  m.kode,
  m.slug,
  m.judul,
  m.deskripsi,
  m.topik,
  m.corak,
  m.kata_kunci,
  m.urutan,
  m.tayangan,
  m.dibuat_pada,
  m.diperbarui_pada,
  f.id          as forum_id,
  f.slug        as forum_slug,
  f.nama        as forum_nama,
  f.tanggal_mulai,
  f.tanggal_selesai,
  f.tanggal_hijriah,
  f.lokasi,
  f.kota        as forum_kota,
  f.moderator,
  f.pentashih,
  f.perumus,
  f.sumber_materi,
  l.id          as lembaga_id,
  l.slug        as lembaga_slug,
  l.nama        as lembaga_nama,
  l.logo_url    as lembaga_logo_url,
  l.jenis       as lembaga_jenis,
  l.kota        as lembaga_kota,
  l.provinsi    as lembaga_provinsi
from masalah m
join forum f on f.id = m.forum_id
  and f.status = 'terbit'
  and f.dihapus_pada is null
join lembaga l on l.id = f.lembaga_id
  and l.status = 'terverifikasi';

-- ===== MATERIALIZED VIEW STATISTIK LEMBAGA =====
-- Dipakai untuk kalkulasi skor keaktifan dan lencana pesantren
-- Refresh: cron harian → refresh materialized view mv_lembaga_stat
create materialized view if not exists mv_lembaga_stat as
select
  l.id as lembaga_id,
  count(distinct f.id) filter (
    where f.status = 'terbit'
  )                                                                      as total_forum,
  count(distinct m.id) filter (
    where f.status = 'terbit'
  )                                                                      as total_masalah,
  count(distinct f.id) filter (
    where f.status = 'terbit'
    and f.diterbitkan_pada > now() - interval '90 days'
  )                                                                      as forum_90h,
  count(distinct m.id) filter (
    where f.status = 'terbit'
    and f.diterbitkan_pada > now() - interval '90 days'
  )                                                                      as masalah_90h,
  count(distinct date_trunc('month', f.diterbitkan_pada)) filter (
    where f.status = 'terbit'
    and f.diterbitkan_pada > now() - interval '6 months'
  )                                                                      as bulan_aktif_6,
  coalesce(sum(m.tayangan), 0)                                           as tayangan_total
from lembaga l
left join forum f on f.lembaga_id = l.id and f.dihapus_pada is null
left join masalah m on m.forum_id = f.id
where l.status = 'terverifikasi'
group by l.id;

-- Index untuk materialized view
create unique index if not exists idx_mv_lembaga_stat_pk
  on mv_lembaga_stat (lembaga_id);


-- >>> 06_functions.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Fungsi Pembantu
-- ============================================================

-- ===== KODE MASALAH OTOMATIS: MCH-YYYY-NNNN =====
create or replace function buat_kode_masalah(tahun int)
returns text
language sql
as $$
  select 'MCH-' || tahun || '-' || lpad(nextval('masalah_kode_seq')::text, 4, '0');
$$;

-- ===== NORMALISASI TEKS ARAB =====
-- Membuang harakat/syakal, tatwil, dan menyamakan varian alif/ya/ta marbuthah
-- Dipakai untuk pencarian Arab yang toleran (mengabaikan perbedaan harakat)
create or replace function normalisasi_arab(t text)
returns text
language sql
immutable
as $$
  select regexp_replace(
    translate(
      coalesce(t, ''),
      'أإآٱىةـ',   -- karakter varian yang disamakan
      'اااايه'    -- karakter target normalisasi
    ),
    '[\u064B-\u065F\u0670\u06D6-\u06ED]', '', 'g'  -- buang harakat & tanda baca Arab
  );
$$;

-- ===== FUNGSI PEMBARUAN TEKS_CARI (full-text search tsvector) =====
create or replace function perbarui_teks_cari(m_id uuid)
returns void
language plpgsql
as $$
begin
  update masalah m
  set teks_cari =
    setweight(
      to_tsvector('indonesian', unaccent(coalesce(m.judul, ''))),
      'A'
    ) ||
    setweight(
      to_tsvector('simple', unaccent(coalesce(array_to_string(m.kata_kunci, ' '), ''))),
      'B'
    ) ||
    setweight(
      to_tsvector('indonesian', unaccent(coalesce(m.deskripsi, ''))),
      'C'
    ) ||
    setweight(
      to_tsvector('indonesian', unaccent(coalesce((
        select string_agg(p.teks || ' ' || p.jawaban, ' ')
        from pertanyaan p
        where p.masalah_id = m.id
      ), ''))),
      'C'
    ) ||
    setweight(
      to_tsvector('simple', normalisasi_arab(coalesce((
        select string_agg(r.teks_arab, ' ')
        from rujukan r
        join pertanyaan p on p.id = r.pertanyaan_id
        where p.masalah_id = m.id
      ), ''))),
      'D'
    )
  where m.id = m_id;
exception
  -- Fallback ke 'simple' bila konfigurasi 'indonesian' tidak tersedia
  when invalid_parameter_value then
    update masalah m
    set teks_cari =
      setweight(
        to_tsvector('simple', unaccent(coalesce(m.judul, ''))),
        'A'
      ) ||
      setweight(
        to_tsvector('simple', unaccent(coalesce(array_to_string(m.kata_kunci, ' '), ''))),
        'B'
      ) ||
      setweight(
        to_tsvector('simple', unaccent(coalesce(m.deskripsi, ''))),
        'C'
      )
    where m.id = m_id;
end;
$$;

-- ===== FUNGSI OTORISASI (security definer, dipanggil di RLS policies) =====

create or replace function adalah_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from profil
    where id = auth.uid() and peran = 'admin'
  );
$$;

create or replace function mengelola_lembaga(l_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from pengelola
    where lembaga_id = l_id and user_id = auth.uid()
  );
$$;

create or replace function lembaga_terverifikasi(l_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from lembaga
    where id = l_id and status = 'terverifikasi'
  );
$$;

-- ===== FUNGSI PENCARIAN SEMANTIK (dipakai chatbot RAG & "Pembahasan Terkait") =====
create or replace function cari_masalah_semantik(
  query_embedding vector(768),
  match_threshold float default 0.78,
  match_count     int default 8
)
returns table (
  masalah_id    uuid,
  pertanyaan_id uuid,
  isi           text,
  kemiripan     float
)
language sql
stable
security definer
as $$
  select
    p.masalah_id,
    p.id as pertanyaan_id,
    pt.isi,
    1 - (pt.embedding <=> query_embedding) as kemiripan
  from potongan pt
  join pertanyaan p on p.id = pt.pertanyaan_id
  join masalah m on m.id = pt.masalah_id
  join forum f on f.id = m.forum_id
  where
    f.status = 'terbit'
    and f.dihapus_pada is null
    and (1 - (pt.embedding <=> query_embedding)) >= match_threshold
  order by kemiripan desc
  limit match_count;
$$;


-- >>> 07_rls.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Row-Level Security (RLS)
-- ============================================================

-- Aktifkan RLS di SEMUA tabel
alter table profil          enable row level security;
alter table lembaga         enable row level security;
alter table pengelola       enable row level security;
alter table kitab           enable row level security;
alter table forum           enable row level security;
alter table dokumentasi     enable row level security;
alter table masalah         enable row level security;
alter table pertanyaan      enable row level security;
alter table rujukan         enable row level security;
alter table potongan        enable row level security;
alter table revisi          enable row level security;
alter table laporan         enable row level security;
alter table log_audit       enable row level security;
alter table log_chat        enable row level security;
alter table tayangan_harian enable row level security;

-- ============================================================
-- PROFIL
-- ============================================================
drop policy if exists profil_baca_sendiri on profil;
drop policy if exists profil_ubah_sendiri on profil;
drop policy if exists profil_admin on profil;

create policy profil_baca_sendiri on profil
  for select using (id = auth.uid() or adalah_admin());

create policy profil_ubah_sendiri on profil
  for update using (id = auth.uid())
  with check (id = auth.uid() and peran = (select peran from profil where id = auth.uid()));

create policy profil_admin on profil
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- LEMBAGA
-- ============================================================
drop policy if exists lembaga_baca_publik on lembaga;
drop policy if exists lembaga_ubah_pengelola on lembaga;
drop policy if exists lembaga_admin_semua on lembaga;

-- Anon melihat hanya lembaga terverifikasi; pengelola & admin melihat miliknya sendiri
create policy lembaga_baca_publik on lembaga
  for select using (
    status = 'terverifikasi'
    or mengelola_lembaga(id)
    or adalah_admin()
  );

-- Pengelola bisa ubah (kecuali kolom status — dijaga trigger)
create policy lembaga_ubah_pengelola on lembaga
  for update using (mengelola_lembaga(id))
  with check (mengelola_lembaga(id));

create policy lembaga_admin_semua on lembaga
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- PENGELOLA
-- ============================================================
drop policy if exists pengelola_baca on pengelola;
drop policy if exists pengelola_admin on pengelola;

create policy pengelola_baca on pengelola
  for select using (user_id = auth.uid() or adalah_admin());

create policy pengelola_admin on pengelola
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- KITAB
-- ============================================================
drop policy if exists kitab_baca on kitab;
drop policy if exists kitab_usul on kitab;
drop policy if exists kitab_admin on kitab;

create policy kitab_baca on kitab
  for select using (
    disetujui = true
    or adalah_admin()
    or diusulkan_oleh = auth.uid()
  );

create policy kitab_usul on kitab
  for insert to authenticated
  with check (
    disetujui = false
    and diusulkan_oleh = auth.uid()
  );

create policy kitab_admin on kitab
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- FORUM
-- ============================================================
drop policy if exists forum_baca_publik on forum;
drop policy if exists forum_tulis_pengelola on forum;
drop policy if exists forum_ubah_pengelola on forum;
drop policy if exists forum_hapus_pengelola on forum;
drop policy if exists forum_admin on forum;

create policy forum_baca_publik on forum
  for select using (
    (status = 'terbit' and dihapus_pada is null)
    or mengelola_lembaga(lembaga_id)
    or adalah_admin()
  );

create policy forum_tulis_pengelola on forum
  for insert to authenticated
  with check (
    mengelola_lembaga(lembaga_id)
    and lembaga_terverifikasi(lembaga_id)
  );

create policy forum_ubah_pengelola on forum
  for update using (mengelola_lembaga(lembaga_id))
  with check (mengelola_lembaga(lembaga_id));

create policy forum_hapus_pengelola on forum
  for delete using (mengelola_lembaga(lembaga_id));

create policy forum_admin on forum
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- DOKUMENTASI (mengikuti hak akses forum)
-- ============================================================
drop policy if exists dokumentasi_baca on dokumentasi;
drop policy if exists dokumentasi_tulis on dokumentasi;
drop policy if exists dokumentasi_admin on dokumentasi;

create policy dokumentasi_baca on dokumentasi
  for select using (
    exists (
      select 1 from forum f where f.id = forum_id and
      ((f.status = 'terbit' and f.dihapus_pada is null)
        or mengelola_lembaga(f.lembaga_id)
        or adalah_admin())
    )
  );

create policy dokumentasi_tulis on dokumentasi
  for all to authenticated using (
    exists (
      select 1 from forum f where f.id = forum_id
      and mengelola_lembaga(f.lembaga_id)
    )
  ) with check (
    exists (
      select 1 from forum f where f.id = forum_id
      and mengelola_lembaga(f.lembaga_id)
    )
  );

create policy dokumentasi_admin on dokumentasi
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- MASALAH (mengikuti hak akses forum)
-- ============================================================
drop policy if exists masalah_baca on masalah;
drop policy if exists masalah_tulis on masalah;
drop policy if exists masalah_admin on masalah;

create policy masalah_baca on masalah
  for select using (
    exists (
      select 1 from forum f where f.id = forum_id and
      ((f.status = 'terbit' and f.dihapus_pada is null)
        or mengelola_lembaga(f.lembaga_id)
        or adalah_admin())
    )
  );

create policy masalah_tulis on masalah
  for all to authenticated using (
    exists (
      select 1 from forum f where f.id = forum_id
      and mengelola_lembaga(f.lembaga_id)
    )
  ) with check (
    exists (
      select 1 from forum f where f.id = forum_id
      and mengelola_lembaga(f.lembaga_id)
    )
  );

create policy masalah_admin on masalah
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- PERTANYAAN (mengikuti masalah → forum)
-- ============================================================
drop policy if exists pertanyaan_baca on pertanyaan;
drop policy if exists pertanyaan_tulis on pertanyaan;
drop policy if exists pertanyaan_admin on pertanyaan;

create policy pertanyaan_baca on pertanyaan
  for select using (
    exists (
      select 1 from masalah m
      join forum f on f.id = m.forum_id
      where m.id = masalah_id and
      ((f.status = 'terbit' and f.dihapus_pada is null)
        or mengelola_lembaga(f.lembaga_id)
        or adalah_admin())
    )
  );

create policy pertanyaan_tulis on pertanyaan
  for all to authenticated using (
    exists (
      select 1 from masalah m
      join forum f on f.id = m.forum_id
      where m.id = masalah_id
      and mengelola_lembaga(f.lembaga_id)
    )
  ) with check (
    exists (
      select 1 from masalah m
      join forum f on f.id = m.forum_id
      where m.id = masalah_id
      and mengelola_lembaga(f.lembaga_id)
    )
  );

create policy pertanyaan_admin on pertanyaan
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- RUJUKAN (mengikuti pertanyaan → masalah → forum)
-- ============================================================
drop policy if exists rujukan_baca on rujukan;
drop policy if exists rujukan_tulis on rujukan;
drop policy if exists rujukan_admin on rujukan;

create policy rujukan_baca on rujukan
  for select using (
    exists (
      select 1 from pertanyaan p
      join masalah m on m.id = p.masalah_id
      join forum f on f.id = m.forum_id
      where p.id = pertanyaan_id and
      ((f.status = 'terbit' and f.dihapus_pada is null)
        or mengelola_lembaga(f.lembaga_id)
        or adalah_admin())
    )
  );

create policy rujukan_tulis on rujukan
  for all to authenticated using (
    exists (
      select 1 from pertanyaan p
      join masalah m on m.id = p.masalah_id
      join forum f on f.id = m.forum_id
      where p.id = pertanyaan_id
      and mengelola_lembaga(f.lembaga_id)
    )
  ) with check (
    exists (
      select 1 from pertanyaan p
      join masalah m on m.id = p.masalah_id
      join forum f on f.id = m.forum_id
      where p.id = pertanyaan_id
      and mengelola_lembaga(f.lembaga_id)
    )
  );

create policy rujukan_admin on rujukan
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- POTONGAN — hanya via fungsi RPC server (tidak ada akses langsung klien)
-- ============================================================
-- Tidak ada policy untuk anon/authenticated → akses ditolak default
-- Fungsi cari_masalah_semantik() menggunakan SECURITY DEFINER

-- ============================================================
-- REVISI
-- ============================================================
drop policy if exists revisi_baca_sendiri on revisi;
drop policy if exists revisi_admin on revisi;

create policy revisi_baca_sendiri on revisi
  for select using (oleh = auth.uid() or adalah_admin());

create policy revisi_admin on revisi
  for all using (adalah_admin()) with check (adalah_admin());

-- ============================================================
-- LAPORAN — siapa pun boleh buat, hanya admin yang membaca
-- ============================================================
drop policy if exists laporan_buat on laporan;
drop policy if exists laporan_admin on laporan;
drop policy if exists laporan_admin_ubah on laporan;

create policy laporan_buat on laporan
  for insert to anon, authenticated with check (true);

create policy laporan_admin on laporan
  for select using (adalah_admin());

create policy laporan_admin_ubah on laporan
  for update using (adalah_admin());

-- ============================================================
-- LOG AUDIT & LOG CHAT — hanya server / admin
-- ============================================================
drop policy if exists audit_admin on log_audit;
drop policy if exists chatlog_admin on log_chat;

create policy audit_admin on log_audit
  for select using (adalah_admin());

create policy chatlog_admin on log_chat
  for select using (adalah_admin());

-- ============================================================
-- TAYANGAN HARIAN — insert publik (anon & authenticated), baca admin
-- ============================================================
drop policy if exists tayangan_insert on tayangan_harian;
drop policy if exists tayangan_admin on tayangan_harian;

create policy tayangan_insert on tayangan_harian
  for insert to anon, authenticated with check (true);

create policy tayangan_admin on tayangan_harian
  for select using (adalah_admin());


-- >>> 08_triggers.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Triggers
-- ============================================================

-- ===== HELPER: otomatis perbarui kolom diperbarui_pada =====
create or replace function fn_touch_diperbarui_pada()
returns trigger
language plpgsql
as $$
begin
  new.diperbarui_pada = now();
  return new;
end;
$$;

-- Pasang di lembaga
drop trigger if exists trg_lembaga_diperbarui on lembaga;
create trigger trg_lembaga_diperbarui
  before update on lembaga
  for each row execute function fn_touch_diperbarui_pada();

-- Pasang di forum
drop trigger if exists trg_forum_diperbarui on forum;
create trigger trg_forum_diperbarui
  before update on forum
  for each row execute function fn_touch_diperbarui_pada();

-- Pasang di masalah
drop trigger if exists trg_masalah_diperbarui on masalah;
create trigger trg_masalah_diperbarui
  before update on masalah
  for each row execute function fn_touch_diperbarui_pada();


-- ===== PROTEKSI STATUS LEMBAGA =====
-- Pengelola tidak boleh mengubah kolom status, alasan_status, dan diverifikasi_pada
-- Hanya admin (melalui service role) yang boleh.
create or replace function fn_proteksi_status_lembaga()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Jika bukan admin, kembalikan nilai lama untuk kolom yang dilindungi
  if not adalah_admin() then
    new.status            := old.status;
    new.alasan_status     := old.alasan_status;
    new.diverifikasi_pada := old.diverifikasi_pada;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteksi_status_lembaga on lembaga;
create trigger trg_proteksi_status_lembaga
  before update on lembaga
  for each row execute function fn_proteksi_status_lembaga();


-- ===== PROTEKSI PENERBITAN FORUM =====
-- Forum tidak boleh diterbitkan jika lembaganya belum terverifikasi
create or replace function fn_proteksi_terbit_forum()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'terbit' and old.status = 'draf' then
    if not lembaga_terverifikasi(new.lembaga_id) then
      raise exception
        'Lembaga belum terverifikasi. Forum tidak dapat diterbitkan.'
        using errcode = 'P0001';
    end if;
    -- Set timestamp terbit
    if new.diterbitkan_pada is null then
      new.diterbitkan_pada := now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteksi_terbit_forum on forum;
create trigger trg_proteksi_terbit_forum
  before update on forum
  for each row execute function fn_proteksi_terbit_forum();


-- ===== TRIGGER TEKS_CARI MASALAH =====
-- Memperbarui tsvector setiap kali masalah diubah
create or replace function fn_sync_teks_cari_masalah()
returns trigger
language plpgsql
as $$
begin
  perform perbarui_teks_cari(new.id);
  return new;
end;
$$;

drop trigger if exists trg_masalah_teks_cari on masalah;
create trigger trg_masalah_teks_cari
  after insert or update of judul, deskripsi, kata_kunci on masalah
  for each row execute function fn_sync_teks_cari_masalah();


-- ===== TRIGGER AUTO-PROFIL SAAT REGISTER =====
-- Membuat baris profil secara otomatis ketika user baru terdaftar di auth.users
create or replace function fn_buat_profil_baru()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profil (id, nama, peran)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    'lembaga'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_buat_profil_baru on auth.users;
create trigger trg_buat_profil_baru
  after insert on auth.users
  for each row execute function fn_buat_profil_baru();


-- >>> 09_storage.sql <<<
-- ============================================================
-- MOCHI: Fase 2 — Storage Buckets & Policies
-- ============================================================

-- ===== BUCKET: logo (publik, gambar profil lembaga) =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logo',
  'logo',
  true,
  2097152, -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ===== BUCKET: dokumentasi (publik, foto kegiatan forum) =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dokumentasi',
  'dokumentasi',
  true,
  3145728, -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ===== BUCKET: bukti-lembaga (PRIVAT, dokumen verifikasi) =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bukti-lembaga',
  'bukti-lembaga',
  false, -- PRIVAT
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- ===== STORAGE RLS POLICIES =====

-- ---- LOGO (publik read, write hanya pengelola lembaga) ----
drop policy if exists "logo_baca_publik" on storage.objects;
drop policy if exists "logo_tulis_pengelola" on storage.objects;
drop policy if exists "logo_hapus_pengelola" on storage.objects;

create policy "logo_baca_publik"
  on storage.objects for select
  using (bucket_id = 'logo');

create policy "logo_tulis_pengelola"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'logo'
    and auth.role() = 'authenticated'
  );

create policy "logo_hapus_pengelola"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'logo'
    and owner = auth.uid()
  );

-- ---- DOKUMENTASI (publik read, write hanya pengelola) ----
drop policy if exists "dokumentasi_baca_publik" on storage.objects;
drop policy if exists "dokumentasi_tulis_pengelola" on storage.objects;
drop policy if exists "dokumentasi_hapus_pengelola" on storage.objects;

create policy "dokumentasi_baca_publik"
  on storage.objects for select
  using (bucket_id = 'dokumentasi');

create policy "dokumentasi_tulis_pengelola"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'dokumentasi'
    and auth.role() = 'authenticated'
  );

create policy "dokumentasi_hapus_pengelola"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'dokumentasi'
    and owner = auth.uid()
  );

-- ---- BUKTI-LEMBAGA (PRIVAT: hanya pemilik & admin) ----
drop policy if exists "bukti_baca_pemilik_admin" on storage.objects;
drop policy if exists "bukti_tulis_terauth" on storage.objects;
drop policy if exists "bukti_hapus_admin" on storage.objects;

create policy "bukti_baca_pemilik_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'bukti-lembaga'
    and (owner = auth.uid() or adalah_admin())
  );

create policy "bukti_tulis_terauth"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'bukti-lembaga'
    and auth.role() = 'authenticated'
  );

create policy "bukti_hapus_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'bukti-lembaga'
    and adalah_admin()
  );


