import { test, expect } from '@playwright/test';

test.describe('Alur Lupa Kata Sandi', () => {
  test('Menolak email yang tidak terdaftar di database', async ({ page }) => {
    await page.goto('/lupa-sandi');
    await page.fill('input[name="email"]', 'arjuridho77@gmail.com');
    await page.click('button[type="submit"]');

    // Menunggu alert penolakan
    const alert = page.locator('div.bg-rose-50');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText('tidak terdaftar di sistem MOCHI');

    await page.screenshot({ path: 'C:/Users/ACER/.gemini/antigravity/brain/685add94-69e2-4615-aaa3-a9ab7fbc44ae/lupa-sandi-ditolak.png' });
  });

  test('Menerima email terdaftar dan menampilkan tautan pemulihan', async ({ page }) => {
    await page.goto('/lupa-sandi');
    await page.fill('input[name="email"]', 'lirboyo@mochi.pesantren.id');
    await page.click('button[type="submit"]');

    // Menunggu tampilan sukses
    const successBox = page.locator('div.bg-emerald-50');
    await expect(successBox).toBeVisible({ timeout: 5000 });
    await expect(successBox).toContainText('Tautan Terkirim');
    await expect(successBox).toContainText('lirboyo@mochi.pesantren.id');

    await page.screenshot({ path: 'C:/Users/ACER/.gemini/antigravity/brain/685add94-69e2-4615-aaa3-a9ab7fbc44ae/lupa-sandi-sukses.png' });
  });
});
