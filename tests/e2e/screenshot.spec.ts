import { test, expect } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const TANGKAPAN_DIR = path.resolve(process.cwd(), 'docs', 'tangkapan')

test.beforeAll(() => {
  if (!fs.existsSync(TANGKAPAN_DIR)) {
    fs.mkdirSync(TANGKAPAN_DIR, { recursive: true })
  }
})

test.describe('Tangkapan Layar Portofolio Santrivision 2026', () => {
  test('tangkapan beranda desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'beranda-desktop.png'),
      fullPage: false,
    })
  })

  test('tangkapan beranda mobile 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'beranda-mobile.png'),
      fullPage: false,
    })
  })

  test('tangkapan detail masalah dan teks Arab', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/masalah/hukum-test-deoxyribo-nucleic-acid-dna')
    await page.waitForLoadState('domcontentloaded')
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'detail-masalah.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi AI chatbot aktif dengan maskot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')

    const input = page.locator('input[placeholder*="pertanyaan fiqih"]')
    await input.fill('Hukum dropshipping online shop')
    await input.press('Enter')
    
    // Tunggu streaming jawaban selesai
    await page.waitForTimeout(4500)

    // Scroll sedikit ke atas agar maskot perched dan bubble user terlihat harmonis
    await page.evaluate(() => {
      const scrollable = document.querySelector('.overflow-y-auto')
      if (scrollable) scrollable.scrollTop = 0
    })
    await page.waitForTimeout(600)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi respon ramah deteksi typo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')

    const input = page.locator('input[placeholder*="pertanyaan fiqih"]')
    await input.fill('kahfvajf')
    await input.press('Enter')
    await page.waitForTimeout(2500)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi-gibberish.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi respon ramah sapaan test kenalan', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')

    const input = page.locator('input[placeholder*="pertanyaan fiqih"]')
    await input.fill('test')
    await input.press('Enter')
    await page.waitForTimeout(2500)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi-sapaan.png'),
      fullPage: false,
    })
  })

  test('tangkapan keaktifan repositori', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const keaktifanSection = page.locator('text=Peringkat Keaktifan Pesantren Mitra').locator('xpath=ancestor::section')
    await keaktifanSection.scrollIntoViewIfNeeded()
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'keaktifan-repositori.png'),
      fullPage: false,
    })
  })

  test('tangkapan modal chat terbuka', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const floatingBtn = page.getByRole('button', { name: /Buka Tanya MOCHI/i })
    await floatingBtn.click()
    await page.waitForSelector('role=dialog')
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'modal-chat-terbuka.png'),
      fullPage: false,
    })
  })

  test('tangkapan dropdown kapsul pencarian', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const dropdownBtn = page.getByRole('button', { name: /Pilih filter tahun/i })
    await dropdownBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'dropdown-tahun-kapsul.png'),
      fullPage: false,
    })
  })

  test('tangkapan dropdown kapsul pencarian mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const dropdownBtn = page.getByRole('button', { name: /Pilih filter tahun/i })
    await dropdownBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'dropdown-tahun-kapsul-mobile.png'),
      fullPage: false,
    })
  })

  test('tangkapan action search bar saat fokus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const searchInput = page.getByTestId('input-pencarian')
    await searchInput.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'action-search-bar-fokus.png'),
      fullPage: false,
    })
  })

  test('tangkapan perpustakaan filter bersih', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/perpustakaan')
    await page.waitForLoadState('domcontentloaded')
    const perpustakaanInput = page.locator('input[name="q"]')
    await perpustakaanInput.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-search-fokus.png'),
      fullPage: false,
    })
  })

  test('tangkapan lembaga search bar saat fokus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/lembaga')
    await page.waitForLoadState('domcontentloaded')
    const lembagaInput = page.locator('input[name="q"]')
    await lembagaInput.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'lembaga-search-fokus.png'),
      fullPage: false,
    })
  })

  test('tangkapan kitab search bar saat fokus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/kitab')
    await page.waitForLoadState('domcontentloaded')
    const kitabInput = page.locator('input[name="q"]')
    await kitabInput.click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'kitab-search-fokus.png'),
      fullPage: false,
    })
  })

  test('tangkapan perpustakaan filter kompak utuh', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/perpustakaan')
    await page.waitForLoadState('domcontentloaded')
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-filter-kompak.png'),
      fullPage: false,
    })
  })

  test('tangkapan modal chat dengan maskot dan tes klik luar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Buka modal
    const floatingBtn = page.getByRole('button', { name: /Buka Tanya MOCHI/i })
    await floatingBtn.click()
    await page.waitForSelector('role=dialog')
    await page.waitForTimeout(500)

    // Tangkap gambar modal terbuka dengan maskot Mochi
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'modal-chat-maskot.png'),
      fullPage: false,
    })

    // Klik di luar modal (misalnya pojok kiri atas viewport)
    await page.mouse.click(100, 100)
    await page.waitForTimeout(500)

    // Tangkap gambar setelah ditutup lewat klik luar
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'modal-chat-setelah-klik-luar.png'),
      fullPage: false,
    })
  })

  test('tangkapan menu hamburger mobile 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Klik tombol hamburger
    const tombolMenu = page.getByTestId('tombol-hamburger')
    await tombolMenu.click()
    await page.waitForTimeout(400)

    // Tangkap gambar menu mobile terbuka
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'menu-mobile-terbuka.png'),
      fullPage: false,
    })

    // Uji klik di luar menu (misalnya di area bawah layar) untuk menutup menu
    await page.mouse.click(180, 680)
    await page.waitForTimeout(400)
    await expect(page.getByText('Masuk ke Akun Lembaga')).not.toBeVisible()
  })

  test('tangkapan halaman masuk dengan tombol kembali ke beranda', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/masuk')
    await page.waitForLoadState('domcontentloaded')

    const tombolKembali = page.getByTestId('tombol-kembali-beranda')
    await expect(tombolKembali).toBeVisible()
    await page.waitForTimeout(600)

    // Tangkap gambar formulir login mobile dengan tombol kembali
    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'masuk-mobile-tombol-kembali.png'),
      fullPage: false,
    })

    // Uji klik tombol kembali navigasi ke /
    await tombolKembali.click()
    await page.waitForURL('**/')
  })

  test('tangkapan perpustakaan mobile 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/perpustakaan')
    await page.waitForLoadState('domcontentloaded')

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-mobile.png'),
      fullPage: false,
    })
  })

  test('audit elemen overflow horizontal mobile 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    const audit = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth
      const bodyScrollWidth = document.body.scrollWidth
      const docScrollWidth = document.documentElement.scrollWidth

      const elements = Array.from(document.querySelectorAll('*'))
      const overflowing = elements
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return {
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 60),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          }
        })
        .filter((item) => item.right > docWidth + 2 || item.left < -2)

      return { docWidth, bodyScrollWidth, docScrollWidth, overflowing: overflowing.slice(0, 10) }
    })

    console.log('HASIL AUDIT OVERFLOW:', JSON.stringify(audit, null, 2))
    expect(audit.bodyScrollWidth).toBeLessThanOrEqual(audit.docWidth)
    expect(audit.docScrollWidth).toBeLessThanOrEqual(audit.docWidth)
  })

  test('tangkapan detail masalah dengan tombol kembali', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/masalah/hukum-test-deoxyribo-nucleic-acid-dna')
    await page.waitForLoadState('domcontentloaded')

    const tombolKembali = page.getByTestId('tombol-kembali-detail')
    await expect(tombolKembali).toBeVisible()

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'detail-masalah-tombol-kembali.png'),
      fullPage: false,
    })
  })

  test('tangkapan perpustakaan mode rak kitab', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/perpustakaan')
    await page.waitForLoadState('domcontentloaded')

    // Klik tombol switch ke Rak Kitab
    const tombolRak = page.getByRole('button', { name: /Rak Kitab/i })
    await tombolRak.click()
    await page.waitForTimeout(600)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-mode-rak.png'),
      fullPage: false,
    })
  })

  test('tangkapan perpustakaan toleransi typo did-you-mean', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/perpustakaan?q=dusa')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-typo-did-you-mean.png'),
      fullPage: false,
    })
  })

  test('tangkapan perpustakaan auto koreksi dropsipping', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/perpustakaan?q=dropsipping')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'perpustakaan-typo-dropsipping.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi sitasi kemiripan', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')

    const input = page.locator('input[placeholder*="pertanyaan fiqih"]')
    await input.fill('Hukum dropshipping online shop')
    await input.press('Enter')
    
    await page.waitForTimeout(5500)

    await page.evaluate(() => {
      const scrollable = document.querySelector('.overflow-y-auto')
      if (scrollable) scrollable.scrollTop = scrollable.scrollHeight
    })
    await page.waitForTimeout(500)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi-sitasi-persentase.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi hero seamless tanpa kotak putih', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi-hero-seamless.png'),
      fullPage: false,
    })
  })

  test('tangkapan navbar scrolled translucent desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(600)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'navbar-scrolled-translucent-desktop.png'),
      fullPage: false,
    })
  })

  test('tangkapan navbar scrolled translucent mobile 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.mouse.wheel(0, 450)
    await page.waitForTimeout(600)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'navbar-scrolled-translucent-mobile.png'),
      fullPage: false,
    })
  })

  test('tangkapan tanya mochi active companion topbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 850 })
    await page.goto('/tanya')
    await page.waitForLoadState('domcontentloaded')

    const input = page.locator('input[placeholder*="pertanyaan fiqih"]')
    await input.fill('Hukum dropshipping online shop')
    await input.press('Enter')
    await page.waitForTimeout(5000)

    await page.screenshot({
      path: path.join(TANGKAPAN_DIR, 'tanya-mochi-active-companion.png'),
      fullPage: false,
    })
  })
})