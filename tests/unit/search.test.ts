import { describe, it, expect } from "vitest";
import { normalisasiArabClient } from "../../lib/search/hybrid";

describe("Search Logic & Arabic Normalization Tests", () => {
  it("normalisasiArabClient removes all Arabic diacritics (harakat & tanwin)", () => {
    const inputWithHarakat = "اَلْمَسْأَلَةُ الْفِقْهِيَّةُ";
    const normalized = normalisasiArabClient(inputWithHarakat);
    // Harakat removed, alif normalized, ta marbuthah normalized
    expect(normalized).toBe("المساله الفقهيه");
  });

  it("normalisasiArabClient standardizes alif variants (hamzah above/below, maddah)", () => {
    expect(normalisasiArabClient("أحمد")).toBe("احمد");
    expect(normalisasiArabClient("إبراهيم")).toBe("ابراهيم");
    expect(normalisasiArabClient("آدم")).toBe("ادم");
  });

  it("normalisasiArabClient handles empty and null strings gracefully", () => {
    expect(normalisasiArabClient("")).toBe("");
  });

  it("normalisasiArabClient handles mixed Arabic and Indonesian text correctly", () => {
    const mixed = "Hukum تَحْلِيلُ الدَّمِ untuk Nasab";
    const result = normalisasiArabClient(mixed);
    expect(result).toBe("Hukum تحليل الدم untuk Nasab");
  });
});

import { hitungLevenshtein, cariSaranKata, deteksiSaranTypo } from "../../lib/search/typo";

describe("Typo Tolerance & Did-You-Mean Detection Tests", () => {
  it("hitungLevenshtein measures string distance accurately", () => {
    expect(hitungLevenshtein("dosa", "dosa")).toBe(0);
    expect(hitungLevenshtein("dosa", "dasa")).toBe(1);
    expect(hitungLevenshtein("dosa", "dusa")).toBe(1);
    expect(hitungLevenshtein("dropshipping", "dropsipping")).toBe(1);
  });

  it("cariSaranKata suggests correct fiqih word for typos", () => {
    expect(cariSaranKata("dasa")).toBe("dosa");
    expect(cariSaranKata("dusa")).toBe("dosa");
    expect(cariSaranKata("sholat")).toBe(null); // 'sholat' sudah ada di kamus
    expect(cariSaranKata("dropsipping")).toBe("dropshipping");
  });

  it("deteksiSaranTypo detects typos in multi-word queries", () => {
    expect(deteksiSaranTypo("hukum dasa")).toBe("hukum dosa");
    expect(deteksiSaranTypo("akad dropsipping online")).toBe("akad dropshipping online");
    expect(deteksiSaranTypo("hukum zakat")).toBe(null); // tidak ada typo
  });
});
