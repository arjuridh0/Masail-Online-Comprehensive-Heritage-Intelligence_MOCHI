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
