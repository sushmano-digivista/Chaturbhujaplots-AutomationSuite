/**
 * Suite 1 — Page Load & Core Structure
 */
import { test, expect } from '@playwright/test'

test.describe('1. Page Load & Core Structure', () => {

  test('1.1 Homepage returns HTTP 200', async ({ page }) => {
    const res = await page.goto('/')
    expect(res.status()).toBe(200)
  })

  test('1.2 Page title contains Chaturbhuja', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Chaturbhuja/i)
  })

  test('1.3 Navbar is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
  })

  test('1.4 Language toggle (EN|తె) is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[class*="langToggle"]').first()).toBeVisible()
  })

  test('1.5 Hero section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#hero, [class*="heroSec"]').first()).toBeVisible()
  })

  test('1.6 No critical JS errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto('/')
    await page.waitForTimeout(2000)
    const critical = errors.filter(e =>
      !e.includes('favicon') && !e.includes('DevTools') && !e.includes('404')
    )
    expect(critical).toHaveLength(0)
  })

  test('1.7 All 4 project routes exist', async ({ page }) => {
    for (const id of ['anjana', 'aparna', 'varaha', 'trimbak']) {
      const res = await page.goto(`/project/${id}`)
      expect(res.status()).not.toBe(500)
    }
  })

  test('1.8 404 page shows for unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.locator('text=404').first()).toBeVisible()
  })

})
