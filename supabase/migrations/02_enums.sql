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
