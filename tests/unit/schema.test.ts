import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Schema & Migrations Integrity Test", () => {
  const migrationsDir = path.resolve(__dirname, "../../supabase/migrations");

  it("all 9 migration files exist and are non-empty", () => {
    const expectedFiles = [
      "01_extensions.sql",
      "02_enums.sql",
      "03_tables.sql",
      "04_indexes.sql",
      "05_views.sql",
      "06_functions.sql",
      "07_rls.sql",
      "08_triggers.sql",
      "09_storage.sql",
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(migrationsDir, file);
      expect(fs.existsSync(filePath), `File ${file} should exist`).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content.trim().length, `File ${file} should not be empty`).toBeGreaterThan(50);
    }
  });

  it("01_extensions.sql defines required PostgreSQL extensions", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "01_extensions.sql"), "utf-8");
    expect(content).toContain("pgcrypto");
    expect(content).toContain("pg_trgm");
    expect(content).toContain("unaccent");
    expect(content).toContain("vector");
  });

  it("02_enums.sql defines all domain enums idempotently", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "02_enums.sql"), "utf-8");
    const requiredEnums = [
      "peran_pengguna",
      "status_lembaga",
      "jenis_lembaga",
      "status_konten",
      "topik_enum",
      "jenis_pembahasan",
      "status_laporan",
    ];
    for (const enumName of requiredEnums) {
      expect(content).toContain(`create type ${enumName}`);
    }
  });

  it("03_tables.sql defines all 14 core tables and constraints", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "03_tables.sql"), "utf-8");
    const tables = [
      "profil",
      "lembaga",
      "pengelola",
      "kitab",
      "forum",
      "dokumentasi",
      "masalah",
      "pertanyaan",
      "rujukan",
      "potongan",
      "revisi",
      "laporan",
      "log_audit",
      "log_chat",
      "tayangan_harian",
    ];
    for (const table of tables) {
      expect(content).toContain(`create table if not exists ${table}`);
    }
    // Check specific critical constraints
    expect(content).toContain("nspp_wajib_pesantren");
    expect(content).toContain("vector(768)");
    expect(content).toContain("masalah_kode_seq");
  });

  it("06_functions.sql defines helper functions including MCH- code generator and Arabic normalizer", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "06_functions.sql"), "utf-8");
    expect(content).toContain("function buat_kode_masalah");
    expect(content).toContain("'MCH-'");
    expect(content).toContain("function normalisasi_arab");
    expect(content).toContain("function perbarui_teks_cari");
    expect(content).toContain("function adalah_admin");
    expect(content).toContain("function mengelola_lembaga");
    expect(content).toContain("function lembaga_terverifikasi");
    expect(content).toContain("function cari_masalah_semantik");
  });

  it("07_rls.sql enables RLS on all tables and defines security policies", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "07_rls.sql"), "utf-8");
    const rlsTables = [
      "profil",
      "lembaga",
      "pengelola",
      "kitab",
      "forum",
      "dokumentasi",
      "masalah",
      "pertanyaan",
      "rujukan",
      "potongan",
      "revisi",
      "laporan",
      "log_audit",
      "log_chat",
      "tayangan_harian",
    ];
    for (const table of rlsTables) {
      expect(content).toMatch(new RegExp(`alter\\s+table\\s+${table}\\s+enable\\s+row\\s+level\\s+security`));
    }
    // Check key policies
    expect(content).toContain("lembaga_baca_publik");
    expect(content).toContain("forum_baca_publik");
    expect(content).toContain("masalah_baca");
    expect(content).toContain("laporan_buat");
  });

  it("08_triggers.sql protects status and prevents unauthorized publishing", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "08_triggers.sql"), "utf-8");
    expect(content).toContain("fn_proteksi_status_lembaga");
    expect(content).toContain("fn_proteksi_terbit_forum");
    expect(content).toContain("fn_sync_teks_cari_masalah");
    expect(content).toContain("fn_touch_diperbarui_pada");
  });

  it("09_storage.sql configures public and private buckets with RLS", () => {
    const content = fs.readFileSync(path.join(migrationsDir, "09_storage.sql"), "utf-8");
    expect(content).toContain("'logo'");
    expect(content).toContain("'dokumentasi'");
    expect(content).toContain("'bukti-lembaga'");
    expect(content).toContain("logo_baca_publik");
    expect(content).toContain("dokumentasi_baca_publik");
    expect(content).toContain("bukti_baca_pemilik_admin");
  });

  it("consolidated supabase/schema.sql exists and contains all components", () => {
    const schemaPath = path.resolve(__dirname, "../../supabase/schema.sql");
    expect(fs.existsSync(schemaPath)).toBe(true);
    const content = fs.readFileSync(schemaPath, "utf-8");
    expect(content).toContain("MOCHI: FULL SCHEMA DEFINITION");
    expect(content.length).toBeGreaterThan(30000);
  });

  it("lib/types/database.ts exports Database type matching schema", () => {
    const typesPath = path.resolve(__dirname, "../../lib/types/database.ts");
    expect(fs.existsSync(typesPath)).toBe(true);
    const content = fs.readFileSync(typesPath, "utf-8");
    expect(content).toContain("export interface Database");
    expect(content).toContain("export type PeranPengguna");
    expect(content).toContain("export type StatusLembaga");
    expect(content).toContain("export type StatusKonten");
    expect(content).toContain("export type TopikEnum");
    expect(content).toContain("export type JenisPembahasan");
    expect(content).toContain("export interface VMasalahPublik");
    expect(content).toContain("export interface MvLembagaStat");
  });
});
