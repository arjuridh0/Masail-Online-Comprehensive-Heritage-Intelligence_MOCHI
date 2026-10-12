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
