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
