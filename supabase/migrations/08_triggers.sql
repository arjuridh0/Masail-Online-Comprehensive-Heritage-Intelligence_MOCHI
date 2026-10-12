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
