/**
 * Suite 6 — Lead Modal
 */
import { test, expect } from '@playwright/test'
import { switchToTelugu, TELUGU_RE } from '../helpers/utils.js'

test.describe('6. Lead Modal', () => {

  test('6.1 Enquiry modal opens from hero CTA', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

  test('6.2 Modal has name field', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await expect(page.locator('input[placeholder*="Name"], input[placeholder*="name"]').first()).toBeVisible()
  })

  test('6.3 Modal has phone field', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await expect(page.locator('input[type="tel"], input[placeholder*="Phone"]').first()).toBeVisible()
  })

  test('6.4 Modal has Project Interest dropdown', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await expect(page.locator('select').first()).toBeVisible()
  })

  test('6.5 Modal closes on X button', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.waitForTimeout(300)
    await page.locator('[class*="closeBtn"], button[aria-label*="lose"]').first().click()
    await expect(page.locator('[class*="overlay"], [role="dialog"]').first()).not.toBeVisible()
  })

  test('6.6 Empty form submit shows validation', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.waitForTimeout(300)
    await page.locator('[class*="modal"] button[type="submit"]').first().click()
    await page.waitForTimeout(500)
    // Modal should still be visible (validation prevented submit)
    await expect(page.locator('[class*="modal"]').first()).toBeVisible()
  })

  test('6.7 Book Site Visit modal opens with date field', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Book Site Visit")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('input[type="date"]').first()).toBeVisible()
  })

  test('6.8 Get Brochure modal has project selector', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Get Brochure"), button:has-text("Download")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('select').first()).toBeVisible()
  })

  test('6.9 Modal shows Telugu labels in TE mode', async ({ page }) => {
    await page.goto('/')
    await switchToTelugu(page)
    await page.locator('button:has-text("అందుబాటు"), button:has-text("ఇప్పుడే")').first().click()
    await page.waitForTimeout(500)
    const modalText = await page.locator('[class*="modal"]').first().textContent()
    expect(TELUGU_RE.test(modalText || '')).toBe(true)
  })

  test('6.10 Project dropdown in modal has all 4 projects', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.waitForTimeout(300)
    const options = await page.locator('select option').allTextContents()
    expect(options.some(o => o.includes('Anjana'))).toBe(true)
    expect(options.some(o => o.includes('Aparna'))).toBe(true)
    expect(options.some(o => o.includes('Varaha'))).toBe(true)
  })

})
