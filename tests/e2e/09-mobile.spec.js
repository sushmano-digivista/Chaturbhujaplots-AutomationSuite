/**
 * Suite 9 — Mobile Responsive (iPhone 14)
 */
import { test, expect, devices } from '@playwright/test'
import { switchToTelugu } from '../helpers/utils.js'

test.use({ ...devices['iPhone 14'] })

test.describe('9. Mobile Responsive — iPhone 14', () => {

  test('9.1 Homepage loads on mobile', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.status()).toBe(200)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('9.2 Hamburger menu button is visible on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('[class*="menuBtn"], button[aria-label*="menu"]').first()
    ).toBeVisible()
  })

  test('9.3 Mobile menu opens and shows project links', async ({ page }) => {
    await page.goto('/')
    await page.locator('[class*="menuBtn"]').first().click()
    await page.waitForTimeout(400)
    await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  })

  test('9.4 CTA button visible on mobile without scrolling', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('button:has-text("View Available Plots"), button:has-text("Enquire")').first()
    ).toBeVisible()
  })

  test('9.5 Language toggle works on mobile', async ({ page }) => {
    await page.goto('/')
    await switchToTelugu(page)
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  })

  test('9.6 Project page loads correctly on mobile', async ({ page }) => {
    await page.goto('/project/anjana')
    await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  })

  test('9.7 Modal opens and is usable on mobile', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.waitForTimeout(400)
    await expect(page.locator('[class*="modal"]').first()).toBeVisible()
    // Close it
    await page.locator('[class*="closeBtn"]').first().click()
  })

})
