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
