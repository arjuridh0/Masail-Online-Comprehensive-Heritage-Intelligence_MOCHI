import { test, expect } from "@playwright/test";

test.describe("Smoke Test Alur Inti MOCHI", () => {
  test("halaman beranda dapat diakses dan menampilkan elemen utama", async ({ page }) => {
    await page.goto("/");

    // Title halaman
    await expect(page).toHaveTitle(/MOCHI/);

    // Skip to content link ada (aksesibilitas)
    const skipLink = page.getByText("Lewati ke konten utama");
    await expect(skipLink).toBeAttached();

    // Judul utama repositori
    await expect(
      page.getByRole("heading", { name: /Repositori Keputusan Bahtsul Masail/i })
    ).toBeVisible();
  });

  test("Search capsule tampil di hero beranda", async ({ page }) => {
    await page.goto("/");

    // Input pencarian utama
    const searchInput = page.getByPlaceholder(/Cari/i);
    await expect(searchInput).toBeVisible();
  });

  test("halaman perpustakaan memuat katalog dan filter", async ({ page }) => {
    await page.goto("/perpustakaan");

    // Header perpustakaan
    await expect(
      page.getByRole("heading", { name: /Perpustakaan Hasil Bahtsul Masail/i })
    ).toBeVisible();

    // Filter panel terlihat
    await expect(page.getByText(/Filter Penelusuran/i)).toBeVisible();

    // Menampilkan artikel hasil keputusan
    const articles = page.locator("article");
    await expect(articles.first()).toBeVisible();
  });

  test("halaman detail masalah memuat ibarat Arab, kartu sanad, dan modal kutip", async ({ page }) => {
    await page.goto("/masalah/hukum-test-deoxyribo-nucleic-acid-dna");

    // Judul masalah
    await expect(
      page.getByRole("heading", { name: /Hukum Test Deoxyribo Nucleic Acid/i })
    ).toBeVisible();

    // Kode masalah MCH-
    await expect(page.getByText("MCH-2004-0001").first()).toBeVisible();

    // Kartu Sanad terlihat
    await expect(page.getByText("Sanad Masalah")).toBeVisible();
    await expect(page.getByText("LBM PWNU Jawa Timur").first()).toBeVisible();

    // Ibarat kitab turats Takmilah al-Majmu'
    await expect(page.getByText(/Takmilah al-Majmu/i)).toBeVisible();

    // Buka Modal Kutip
    const tombolKutip = page.getByRole("button", { name: /Kutip Keputusan/i });
    await expect(tombolKutip).toBeVisible();
    await tombolKutip.click();

    // Verifikasi Modal Kutip format MOCHI
    await expect(page.getByText(/Kutip Format MOCHI/i)).toBeVisible();
    await expect(page.getByText(/Diakses melalui MOCHI/i)).toBeVisible();
  });

  test("halaman direktori lembaga dan profil pesantren memuat data", async ({ page }) => {
    await page.goto("/lembaga");

    await expect(
      page.getByRole("heading", { name: /Direktori Lembaga/i })
    ).toBeVisible();

    // Periksa salah satu pesantren mitra
    await expect(page.getByText(/Pondok Pesantren Lirboyo/i)).toBeVisible();

    // Buka profil detail lembaga Lirboyo
    await page.goto("/lembaga/pesantren-lirboyo-kediri");
    await expect(
      page.getByRole("heading", { name: /Pondok Pesantren Lirboyo/i })
    ).toBeVisible();
    await expect(page.getByText(/NSPP/i)).toBeVisible();
  });

  test("halaman katalog kitab turats memuat daftar kitab", async ({ page }) => {
    await page.goto("/kitab");

    await expect(
      page.getByRole("heading", { name: /Indeks Kitab Turats Rujukan/i })
    ).toBeVisible();

    // Kitab Fath al-Qarib atau Al-Asybah
    await expect(page.getByText(/Fath al-Qarib/i)).toBeVisible();
  });

  test("navigasi ke halaman non-eksisten menampilkan 404 ramah maskot", async ({ page }) => {
    const response = await page.goto("/halaman-tidak-ada-xyz");
    expect(response?.status()).toBe(404);

    // Halaman 404 ramah santri
    await expect(page.getByText(/Afwan, Halaman Tidak Ditemukan/i)).toBeVisible();
  });

  test("halaman masuk dan pendaftaran lembaga memuat form resmi", async ({ page }) => {
    await page.goto("/masuk");
    await expect(page.getByRole("heading", { name: /Selamat datang/i })).toBeVisible();

    await page.goto("/daftar");
    await expect(page.getByRole("heading", { name: /Pendaftaran Lembaga/i })).toBeVisible();
    await expect(page.getByLabel(/NSPP/i)).toBeVisible();
  });

  test("rute terproteksi /admin dan /dasbor mengalihkan pengunjung tanpa sesi ke /masuk", async ({ page }) => {
    await page.goto("/admin/verifikasi");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/dasbor");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/dasbor/forum");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/dasbor/forum/baru");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/dasbor/statistik");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/admin/laporan");
    await expect(page).toHaveURL(/\/masuk/);

    await page.goto("/admin/ditjen");
    await expect(page).toHaveURL(/\/masuk/);
  });

  test("halaman Tanya MOCHI memuat chat container dan tombol melayang publik", async ({ page }) => {
    // 1. Cek tombol melayang di beranda
    await page.goto("/");
    const floatingBtn = page.getByRole("button", { name: /Buka Tanya MOCHI/i });
    await expect(floatingBtn).toBeVisible();

    // 2. Klik tombol melayang untuk membuka modal
    await floatingBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#modal-chat-title")).toBeVisible();

    // 3. Kunjungi halaman penuh /tanya
    await page.goto("/tanya");
    await expect(page.locator("h1").filter({ hasText: "Tanya MOCHI" })).toBeVisible();
    await expect(page.getByText(/Jawaban hanya dari arsip bahtsul masail/i)).toBeVisible();
    await expect(page.getByPlaceholder(/pertanyaan/i)).toBeVisible();
  });

  test("keamanan HTTP: security headers terpasang dengan benar", async ({ request }) => {
    const res = await request.get("/");
    expect(res.ok()).toBeTruthy();

    const headers = res.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-xss-protection"]).toBe("1; mode=block");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("keamanan API: endpoint /api/report menolak payload tanpa data atau invalid", async ({ request }) => {
    const res = await request.post("/api/report", {
      data: { masalah_id: "invalid-uuid", alasan: "ab" },
    });
    expect(res.status()).toBe(400);
  });

  test("responsif mobile 360px: detail masalah dan teks Arab tampil utuh tanpa overflow", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 360, height: 740 },
    });
    const page = await context.newPage();
    await page.goto("/masalah/hukum-test-deoxyribo-nucleic-acid-dna");

    // Pastikan judul dan teks Arab terlihat
    await expect(page.getByRole("heading", { name: /Hukum Test Deoxyribo Nucleic Acid/i })).toBeVisible();
    await expect(page.locator("p[dir='rtl']").first()).toBeVisible();

    // Pastikan tombol ganti ukuran teks Arab ada dan dapat diklik
    const btnA = page.getByLabel("Ukuran huruf Arab sedang").first();
    await expect(btnA).toBeVisible();
    await btnA.click();

    await context.close();
  });

  test("endpoint /api/health mengembalikan status ok dan koneksi database", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.sistem).toContain("MOCHI");
    expect(json.database.status).toBe("terhubung");
  });
});