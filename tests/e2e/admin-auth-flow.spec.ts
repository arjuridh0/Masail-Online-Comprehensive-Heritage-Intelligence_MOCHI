import { test, expect } from "@playwright/test";

test.describe("Alur Autentikasi Admin & Pengelola Lembaga MOCHI", () => {
  test("1. Login Admin Pusat, kelola profil, dan sinkronisasi sesi ke portal publik", async ({ page }) => {
    // Masuk ke halaman login
    await page.goto("/masuk");
    await page.fill("#email", "admin@mochi.pesantren.id");
    await page.fill("#password", "MochiAdmin2026!");
    await page.click("button[type='submit']");

    // Harus diarahkan ke /admin atau /admin/verifikasi (beri waktu untuk respon Supabase auth)
    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
    await expect(page.getByText("ADMIN MOCHI", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Antrean Verifikasi NSPP/i })).toBeVisible();

    // Verifikasi menu Profil Admin
    await page.goto("/admin/profil");
    await expect(page.getByRole("heading", { name: /Pengaturan Akun Administrator/i })).toBeVisible();
    await expect(page.getByLabel("Nama Tampilan Admin *")).toBeVisible();
    await expect(page.getByLabel("Kata Sandi Baru *", { exact: true })).toBeVisible();

    // Verifikasi halaman moderasi lembaga
    await page.goto("/admin/lembaga");
    await expect(page.getByRole("heading", { name: "Daftar Seluruh Lembaga" })).toBeVisible();
    await expect(page.getByText("Pondok Pesantren Lirboyo")).toBeVisible();
    // Tombol aksi moderasi (Edit atau Blokir)
    await expect(page.getByRole("button", { name: /Edit Data/i }).first()).toBeVisible();

    // Buka Portal Publik: sesi tetap aktif dan navbar publik menampilkan info sesi
    await page.goto("/");
    const badgeAdmin = page.getByRole("button", { name: "Admin Pusat" });
    await expect(badgeAdmin).toBeVisible();
    // Tombol "Masuk" tidak boleh tampil saat sesi aktif
    await expect(page.getByRole("link", { name: "Masuk" })).not.toBeVisible();
  });

  test("2. Login Lembaga Terverifikasi (Lirboyo) dan form profil lengkap", async ({ page }) => {
    await page.goto("/masuk");
    await page.fill("#email", "lirboyo@mochi.pesantren.id");
    await page.fill("#password", "Lirboyo1910!");
    await page.click("button[type='submit']");

    // Diarahkan ke /dasbor
    await expect(page).toHaveURL(/\/dasbor/, { timeout: 20000 });
    await expect(page.getByText("Lembaga Terverifikasi", { exact: true })).toBeVisible();
    await expect(page.getByText("Lembaga Terverifikasi Resmi di MOCHI")).toBeVisible();
    await expect(page.getByRole("link", { name: /\+ Buat Forum Baru/i })).toBeVisible();

    // Halaman profil lembaga
    await page.goto("/dasbor/profil");
    await expect(page.getByRole("heading", { name: /Kelola Profil Lembaga/i })).toBeVisible();
    // Input unggah logo berkas
    await expect(page.locator("input[type='file']")).toBeAttached();
    // Input nama penanggung jawab
    await expect(page.getByLabel(/Nama Lengkap Penanggung Jawab/i)).toBeVisible();

    // Buka tab kata sandi
    await page.click("button:has-text('Keamanan & Kata Sandi')");
    await expect(page.getByLabel("Kata Sandi Baru *", { exact: true })).toBeVisible();

    // Buka beranda publik: navbar menampilkan badge Lirboyo
    await page.goto("/");
    const badgeLembaga = page.getByRole("button", { name: "Pondok Pesantren Lirboyo" });
    await expect(badgeLembaga).toBeVisible();
    await expect(page.getByRole("link", { name: "Masuk" })).not.toBeVisible();
  });

  test("3. Lembaga Menunggu Verifikasi menampilkan notifikasi transparan 1x24 jam", async ({ page }) => {
    await page.goto("/masuk");
    await page.fill("#email", "sidogiri@mochi.pesantren.id");
    await page.fill("#password", "Sidogiri1745!");
    await page.click("button[type='submit']");

    await expect(page).toHaveURL(/\/dasbor/, { timeout: 20000 });
    await expect(page.getByText("Menunggu Verifikasi", { exact: true })).toBeVisible();
    await expect(page.getByText("Pengajuan Akun Sedang Ditinjau Admin Pusat")).toBeVisible();
  });

  test("4. Form Pendaftaran Lembaga: penyesuaian non-pesantren (SK Kepengurusan tanpa NSPP)", async ({ page }) => {
    await page.goto("/daftar");
    await expect(page.getByRole("heading", { name: /Pendaftaran Lembaga/i })).toBeVisible();

    // Default adalah pesantren dengan field NSPP
    await expect(page.getByLabel(/NSPP/i)).toBeVisible();

    // Ganti pilihan jenis ke LBM PCNU
    await page.selectOption("#jenis", "lbm_pcnu");

    // Field NSPP harus disembunyikan dan muncul info verifikasi SK Kepengurusan
    await expect(page.getByText("Lembaga Non-Pesantren (Tanpa NSPP)")).toBeVisible();
    await expect(page.getByText("SK Kepengurusan resmi")).toBeVisible();
  });
});
