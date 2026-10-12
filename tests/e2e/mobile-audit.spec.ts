import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/audit_screenshots');

test.describe('Audit Tampilan Mobile (Viewport 360x780)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    // Baseline mobile 360px sesuai standar AGENTS.md
    await page.setViewportSize({ width: 360, height: 780 });
  });

  test('M1. Halaman Publik & Menu Mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_01_beranda.png'), fullPage: false });

    // Cek menu hamburger jika ada tombol toggle mobile
    const btnMenu = page.locator('button[aria-label*="menu" i], button[aria-label*="navigasi" i]').first();
    if (await btnMenu.isVisible()) {
      await btnMenu.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_02_menu_terbuka.png') });
      await btnMenu.click();
    }

    // Halaman Perpustakaan di mobile
    await page.goto('/perpustakaan');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_03_perpustakaan.png'), fullPage: false });
  });

  test('M2. Halaman Autentikasi di Mobile (Masuk, Lupa Sandi, Reset Sandi, Daftar)', async ({ page }) => {
    // Masuk
    await page.goto('/masuk');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_04_masuk.png') });

    // Lupa Sandi
    await page.goto('/lupa-sandi');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_05_lupa_sandi.png') });

    // Reset Sandi
    await page.goto('/reset-sandi');
    await expect(page.locator('#sandi_baru_reset')).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_06_reset_sandi.png') });

    // Daftar
    await page.goto('/daftar');
    await expect(page.getByLabel(/Nama Resmi Lembaga/i)).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_07_daftar.png') });
  });

  test('M3. Dasbor Lembaga di Mobile (PP Lirboyo)', async ({ page }) => {
    await page.goto('/masuk');
    await page.fill('#email', 'lirboyo@mochi.pesantren.id');
    await page.fill('#password', 'Lirboyo1910!');
    await page.click('button[data-testid="masuk-kirim"]');

    await expect(page).toHaveURL(/\/dasbor/, { timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_08_dasbor_lembaga.png') });

    // Uji buka drawer navigasi mobile Dasbor
    const btnDrawerDasbor = page.locator('button[aria-label="Buka Menu Navigasi Dasbor"]');
    await expect(btnDrawerDasbor).toBeVisible();
    await btnDrawerDasbor.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_08b_dasbor_drawer_terbuka.png') });

    // Navigasi ke Profil Lembaga lewat menu drawer mobile
    const linkProfil = page.locator('nav[aria-label="Navigasi Mobile Dasbor"] a[href="/dasbor/profil"]');
    await expect(linkProfil).toBeVisible();
    await linkProfil.click();

    await expect(page).toHaveURL(/\/dasbor\/profil/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /Kelola Profil Lembaga/i })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_09_profil_lembaga.png') });

    // Wizard Forum Baru
    await page.goto('/dasbor/forum/baru');
    await expect(page.getByRole('heading', { name: /Input Keputusan Bahtsul Masail Baru/i })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_10_wizard_forum.png') });
  });

  test('M4. Admin Pusat di Mobile', async ({ page }) => {
    await page.goto('/masuk');
    await page.fill('#email', 'admin@mochi.pesantren.id');
    await page.fill('#password', 'MochiAdmin2026!');
    await page.click('button[data-testid="masuk-kirim"]');

    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_11_admin_verifikasi.png') });

    // Uji buka drawer navigasi mobile Admin
    const btnDrawerAdmin = page.locator('button[aria-label="Buka Menu Navigasi Admin"]');
    await expect(btnDrawerAdmin).toBeVisible();
    await btnDrawerAdmin.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_11b_admin_drawer_terbuka.png') });

    // Navigasi ke Daftar Lembaga lewat drawer mobile
    const linkLembaga = page.locator('nav[aria-label="Navigasi Mobile Admin"] a[href="/admin/lembaga"]');
    await expect(linkLembaga).toBeVisible();
    await linkLembaga.click();

    await expect(page).toHaveURL(/\/admin\/lembaga/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Daftar Seluruh Lembaga' })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_12_admin_kelola_lembaga.png') });

    // Profil Admin
    await page.goto('/admin/profil');
    await expect(page.getByRole('heading', { name: /Pengaturan Akun Administrator/i })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_13_admin_profil.png') });

    // Ditjen Pesantren
    await page.goto('/admin/ditjen');
    await expect(page.getByRole('heading', { name: /Dashboard Integrasi Nasional Ditjen Pesantren/i })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_14_admin_ditjen.png') });
  });
});
