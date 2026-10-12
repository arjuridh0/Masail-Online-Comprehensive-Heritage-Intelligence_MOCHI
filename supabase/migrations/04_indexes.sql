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
