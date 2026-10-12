import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/audit_screenshots');

test.describe('Audit Produksi Menyeluruh MOCHI (QA & Keamanan Siber)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('1. Alur Admin Lembaga: Login Bersih, Dasbor, Profil, Wizard, dan Sesi Publik', async ({ page }) => {
    // 1.1 Halaman Masuk Tanpa Demo
    await page.goto('/masuk');
    await expect(page.locator('text=1-Klik Akun Demo')).not.toBeVisible();
    await expect(page.locator('button[data-testid="masuk-kirim"]')).toBeVisible();

    // 1.2 Uji Toggle Visibilitas Kata Sandi
    await page.fill('#email', 'lirboyo@mochi.pesantren.id');
    const inputSandi = page.locator('#password');
    await inputSandi.fill('Lirboyo1910!');
    await expect(inputSandi).toHaveAttribute('type', 'password');

    // Buka kata sandi
    await page.click('button[aria-label="Tampilkan kata sandi"]');
    await expect(inputSandi).toHaveAttribute('type', 'text');

    // Tutup kembali kata sandi
    await page.click('button[aria-label="Sembunyikan kata sandi"]');
    await expect(inputSandi).toHaveAttribute('type', 'password');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_login_clean_lembaga.png') });

    // 1.3 Submit Login Manual
    await page.click('button[data-testid="masuk-kirim"]');
    await expect(page).toHaveURL(/\/dasbor/, { timeout: 20000 });
    await expect(page.getByText('Lembaga Terverifikasi', { exact: true })).toBeVisible();
    await expect(page.getByText('Lembaga Terverifikasi Resmi di MOCHI')).toBeVisible();
    await expect(page.getByRole('link', { name: /\+ Buat Forum Baru/i })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_dasbor_lembaga_lirboyo.png') });

    // 1.4 Halaman Profil Lembaga
    await page.goto('/dasbor/profil');
    await expect(page.getByRole('heading', { name: /Kelola Profil Lembaga/i })).toBeVisible();
    await expect(page.locator("input[type='file']")).toBeAttached();
    await expect(page.getByLabel(/Nama Lengkap Penanggung Jawab/i)).toBeVisible();

    // Buka tab keamanan dan kata sandi
    await page.click("button:has-text('Keamanan & Kata Sandi')");
    await expect(page.getByLabel('Kata Sandi Baru *', { exact: true })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_profil_lembaga_lirboyo.png') });

    // 1.5 Buka Wizard Buat Forum Baru
    await page.goto('/dasbor/forum/baru');
    await expect(page.getByRole('heading', { name: /Input Keputusan Bahtsul Masail Baru/i })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_wizard_forum_lembaga.png') });

    // 1.6 Sinkronisasi Portal Publik
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const badgeLembaga = page.getByRole('button', { name: /Pondok Pesantren Lirboyo/i });
    await expect(badgeLembaga).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Masuk' })).not.toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_portal_publik_sesi_lembaga.png') });
  });

  test('2. Alur Admin Pusat: Login, Verifikasi, Kelola Lembaga, Profil, dan Ditjen', async ({ page }) => {
    // 2.1 Login Admin Pusat
    await page.goto('/masuk');
    await page.fill('#email', 'admin@mochi.pesantren.id');
    await page.fill('#password', 'MochiAdmin2026!');
    await page.click('button[data-testid="masuk-kirim"]');

    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
    await expect(page.getByText('ADMIN MOCHI', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Antrean Verifikasi NSPP/i })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_admin_verifikasi_antrean.png') });

    // 2.2 Kelola Lembaga (Tabel Interaktif Moderasi)
    await page.goto('/admin/lembaga');
    await expect(page.getByRole('heading', { name: 'Daftar Seluruh Lembaga' })).toBeVisible();
    await expect(page.getByText('Pondok Pesantren Lirboyo')).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_admin_kelola_lembaga.png') });

    // 2.3 Modal Edit Data Lembaga
    const btnEdit = page.getByRole('button', { name: /Edit Data/i }).first();
    if (await btnEdit.isVisible()) {
      await btnEdit.click();
      await expect(page.locator('text=Edit Identitas Lembaga (Admin Pusat)')).toBeVisible();
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_admin_modal_edit.png') });
      await page.click('button:has-text("Batal")');
    }

    // 2.4 Halaman Profil Administrator Pusat
    await page.goto('/admin/profil');
    await expect(page.getByRole('heading', { name: /Pengaturan Akun Administrator/i })).toBeVisible();
    await expect(page.getByLabel('Nama Tampilan Admin *')).toBeVisible();
    await expect(page.getByLabel('Kata Sandi Baru *', { exact: true })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_admin_profil_sandi.png') });

    // 2.5 Panel Analitik Ditjen Pesantren
    await page.goto('/admin/ditjen');
    await expect(page.getByRole('heading', { name: /Dashboard Integrasi Nasional Ditjen Pesantren/i })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_admin_ditjen_statistik.png') });
  });

  test('3. Alur Pendaftaran Lembaga: Pesantren NSPP & Non-Pesantren SK Kepengurusan', async ({ page }) => {
    // 3.1 Pendaftaran Pesantren
    await page.goto('/daftar');
    await expect(page.getByRole('heading', { name: /Pendaftaran Lembaga/i })).toBeVisible();
    await expect(page.getByLabel(/NSPP/i)).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_pendaftaran_pesantren_nspp.png') });

    // 3.2 Penyesuaian Lembaga Non-Pesantren (LBM PCNU)
    await page.selectOption('#jenis', 'lbm_pcnu');
    await expect(page.getByText('Lembaga Non-Pesantren (Tanpa NSPP)')).toBeVisible();
    await expect(page.getByText('SK Kepengurusan resmi')).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_pendaftaran_non_pesantren_sk.png') });
  });

  test('4. Alur Keamanan Lupa Sandi: Penolakan Email Fiktif & Pengiriman Terdaftar', async ({ page }) => {
    // 4.1 Penolakan Tegas Email Fiktif
    await page.goto('/lupa-sandi');
    await page.fill('input[name="email"]', 'arjuridho77@gmail.com');
    await page.click('button[type="submit"]');

    const alertPenolakan = page.locator('div.bg-rose-50');
    await expect(alertPenolakan).toBeVisible({ timeout: 10000 });
    await expect(alertPenolakan).toContainText('tidak terdaftar di sistem MOCHI');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_lupa_sandi_tolak_fiktif.png') });

    // 4.2 Pemrosesan Email Terdaftar (Tanpa Mode Demo)
    await page.fill('input[name="email"]', 'lirboyo@mochi.pesantren.id');
    await page.click('button[type="submit"]');

    const boxSukses = page.locator('div.bg-emerald-50');
    await expect(boxSukses).toBeVisible({ timeout: 10000 });
    await expect(boxSukses).toContainText('Tautan Terkirim');
    await expect(boxSukses).toContainText('lirboyo@mochi.pesantren.id');
    await expect(page.locator('text=Mode Pengujian & Demo Santrivision')).not.toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_lupa_sandi_sukses_terkirim.png') });

    // 4.3 Formulir Reset Sandi Mandiri (/reset-sandi)
    await page.goto('/reset-sandi');
    await expect(page.getByRole('heading', { name: /Buat Kata Sandi Baru/i })).toBeVisible();
    await expect(page.locator('#sandi_baru_reset')).toBeVisible();
    await expect(page.locator('#konfirmasi_sandi_reset')).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_reset_sandi_form.png') });
  });
});
