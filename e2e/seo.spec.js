import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// ── SEO & Meta Tags ───────────────────────────────────────────────────────────
test.describe('SEO & Meta Tags', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto(BASE)
    const meta = await page.locator('meta[name="description"]').getAttribute('content')
    expect(meta?.trim().length).toBeGreaterThan(20)
  })

  test('homepage has OG title', async ({ page }) => {
    await page.goto(BASE)
    const og = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(og?.trim().length).toBeGreaterThan(5)
  })

  test('homepage has OG image', async ({ page }) => {
    await page.goto(BASE)
    const ogImg = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImg).toBeTruthy()
  })

  test('project pages have unique titles', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    const t1 = await page.title()
    await page.goto(`${BASE}/project/aparna`)
    const t2 = await page.title()
    await page.goto(`${BASE}/project/varaha`)
    const t3 = await page.title()
    expect(new Set([t1, t2, t3]).size).toBe(3)
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const res = await page.goto(`${BASE}/sitemap.xml`)
    expect(res?.status()).toBe(200)
  })

  test('robots.txt is accessible', async ({ page }) => {
    const res = await page.goto(`${BASE}/robots.txt`)
    expect(res?.status()).toBe(200)
  })

  test('images have alt attributes', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('nav', { timeout: 10000 })
    const images = await page.locator('img').all()
    for (const img of images.slice(0, 10)) {
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('no 5xx errors on main pages', async ({ page }) => {
    for (const path of ['/', '/project/anjana', '/project/aparna', '/project/varaha', '/project/trimbak']) {
      const res = await page.goto(`${BASE}${path}`)
      expect(res?.status()).toBeLessThan(500)
    }
  })
})
