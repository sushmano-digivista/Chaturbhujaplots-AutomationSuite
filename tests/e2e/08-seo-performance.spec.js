/**
 * Suite 8 — SEO & Performance
 */
import { test, expect } from '@playwright/test'

test.describe('8. SEO & Performance', () => {

  test('8.1 Homepage has meta description', async ({ page }) => {
    await page.goto('/')
    const meta = await page.locator('meta[name="description"]').getAttribute('content')
    expect(meta?.trim().length).toBeGreaterThan(20)
  })

  test('8.2 Homepage has OG title for social sharing', async ({ page }) => {
    await page.goto('/')
    const og = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(og?.trim().length).toBeGreaterThan(5)
  })

  test('8.3 Homepage has OG image', async ({ page }) => {
    await page.goto('/')
    const ogImg = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImg).toBeTruthy()
  })

  test('8.4 Project pages have unique titles', async ({ page }) => {
    await page.goto('/project/anjana')
    const t1 = await page.title()
    await page.goto('/project/aparna')
    const t2 = await page.title()
    await page.goto('/project/varaha')
    const t3 = await page.title()
    expect(new Set([t1, t2, t3]).size).toBe(3)
  })

  test('8.5 sitemap.xml is accessible', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    expect(res?.status()).toBe(200)
  })

  test('8.6 robots.txt is accessible', async ({ page }) => {
    const res = await page.goto('/robots.txt')
    expect(res?.status()).toBe(200)
  })

  test('8.7 Images have alt attributes', async ({ page }) => {
    await page.goto('/')
    const images = await page.locator('img').all()
    for (const img of images.slice(0, 10)) {
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('8.8 No 5xx errors on main pages', async ({ page }) => {
    for (const path of ['/', '/project/anjana', '/project/aparna', '/project/varaha']) {
      const res = await page.goto(path)
      expect(res?.status()).toBeLessThan(500)
    }
  })

})
