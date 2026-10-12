import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Design Tokens & Typography Smoke Test", () => {
  it("tokens.css exists and defines core light mode colors and .arab class", () => {
    const tokensPath = path.resolve(__dirname, "../../styles/tokens.css");
    expect(fs.existsSync(tokensPath)).toBe(true);

    const content = fs.readFileSync(tokensPath, "utf-8");
    // Verifikasi warna warm stone canvas
    expect(content).toContain("--color-canvas: #F4F3EE");
    // Verifikasi forest green primary
    expect(content).toContain("--color-primary: #1E3F30");
    // Verifikasi amber/gold turats
    expect(content).toContain("--color-accent: #C9A96E");
    // Verifikasi topik bahtsul masail
    expect(content).toContain("--color-topik-ibadah-bg");
    expect(content).toContain("--color-topik-muamalah-bg");
    expect(content).toContain("--color-topik-munakahat-bg");
  });

  it("globals.css defines .arab utility with RTL and Amiri font family", () => {
    const globalsPath = path.resolve(__dirname, "../../styles/globals.css");
    expect(fs.existsSync(globalsPath)).toBe(true);

    const content = fs.readFileSync(globalsPath, "utf-8");
    expect(content).toContain(".arab");
    expect(content).toContain("direction: rtl;");
    expect(content).toContain("var(--font-arabic)");
  });

  it("admin Supabase client throws error if called in client environment", () => {
    const adminPath = path.resolve(__dirname, "../../lib/supabase/admin.ts");
    expect(fs.existsSync(adminPath)).toBe(true);
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain('typeof window !== "undefined"');
  });
});
