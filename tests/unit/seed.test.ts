import { describe, it, expect } from "vitest";
import { SEED_KITAB, SEED_LEMBAGA, SEED_FORUM } from "../../supabase/seed/seed-data";

describe("Seed Data Quality & Integrity Test", () => {
  it("defines at least 15 master kitab turats with complete fields", () => {
    expect(SEED_KITAB.length).toBeGreaterThanOrEqual(15);
    for (const k of SEED_KITAB) {
      expect(k.slug).toBeTruthy();
      expect(k.nama_latin).toBeTruthy();
      expect(k.nama_arab).toBeTruthy();
      expect(k.pengarang).toBeTruthy();
      expect(k.bidang).toBeTruthy();
      expect(Array.isArray(k.alias)).toBe(true);
    }
  });

  it("defines at least 3 institutions including verified ones and waiting for verification", () => {
    expect(SEED_LEMBAGA.length).toBeGreaterThanOrEqual(3);
    const verified = SEED_LEMBAGA.filter((l) => l.status === "terverifikasi");
    const waiting = SEED_LEMBAGA.filter((l) => l.status === "menunggu");
    expect(verified.length).toBeGreaterThanOrEqual(2);
    expect(waiting.length).toBeGreaterThanOrEqual(1);

    // Pesantren must have NSPP
    const pesantren = SEED_LEMBAGA.filter((l) => l.jenis === "pesantren");
    for (const p of pesantren) {
      expect(p.nspp).toBeTruthy();
    }
  });

  it("defines at least 5 forums with dates, locations, and personnel", () => {
    expect(SEED_FORUM.length).toBeGreaterThanOrEqual(5);
    for (const f of SEED_FORUM) {
      expect(f.slug).toBeTruthy();
      expect(f.nama).toBeTruthy();
      expect(f.tanggal_mulai).toBeTruthy();
      expect(f.lokasi).toBeTruthy();
      expect(f.moderator.length).toBeGreaterThan(0);
      expect(f.pentashih.length).toBeGreaterThan(0);
      expect(f.perumus.length).toBeGreaterThan(0);
    }
  });

  it("defines at least 20 problems with valid topics, questions, and references", () => {
    let totalMasalah = 0;
    let totalPertanyaan = 0;
    let totalRujukan = 0;

    for (const f of SEED_FORUM) {
      totalMasalah += f.masalah.length;
      for (const m of f.masalah) {
        expect(m.kode).toMatch(/^MCH-\d{4}-\d{4}$/);
        expect(m.topik.length).toBeGreaterThan(0);
        expect(m.pertanyaan.length).toBeGreaterThan(0);

        totalPertanyaan += m.pertanyaan.length;
        for (const p of m.pertanyaan) {
          expect(p.jawaban.length).toBeGreaterThan(30);
          totalRujukan += p.rujukan.length;
          for (const r of p.rujukan) {
            expect(r.kitab_slug).toBeTruthy();
            expect(r.teks_arab).toBeTruthy();
            expect(r.terjemah).toBeTruthy();
          }
        }
      }
    }

    expect(totalMasalah).toBeGreaterThanOrEqual(20);
    expect(totalPertanyaan).toBeGreaterThanOrEqual(20);
    expect(totalRujukan).toBeGreaterThanOrEqual(20);
  });

  it("contains at least 4 comparative themes discussed across multiple forums", () => {
    // Check keywords or themes present in more than 1 forum
    const allMasalah = SEED_FORUM.flatMap((f) =>
      f.masalah.map((m) => ({ ...m, forum_slug: f.slug }))
    );

    const dnaTheme = allMasalah.filter((m: { kata_kunci?: string[] }) => m.kata_kunci?.some((k: string) => k.includes("dna")));
    const kriptoTheme = allMasalah.filter((m: { kata_kunci?: string[] }) => m.kata_kunci?.some((k: string) => k.includes("kripto")));
    const dropshipTheme = allMasalah.filter((m: { kata_kunci?: string[] }) => m.kata_kunci?.some((k: string) => k.includes("dropship")));
    const organTheme = allMasalah.filter((m: { kata_kunci?: string[] }) => m.kata_kunci?.some((k: string) => k.includes("organ")));

    expect(new Set(dnaTheme.map((m: { forum_slug?: string }) => m.forum_slug)).size).toBeGreaterThanOrEqual(2);
    expect(new Set(kriptoTheme.map((m: { forum_slug?: string }) => m.forum_slug)).size).toBeGreaterThanOrEqual(2);
    expect(new Set(dropshipTheme.map((m: { forum_slug?: string }) => m.forum_slug)).size).toBeGreaterThanOrEqual(2);
    expect(new Set(organTheme.map((m: { forum_slug?: string }) => m.forum_slug)).size).toBeGreaterThanOrEqual(2);
  });
});
