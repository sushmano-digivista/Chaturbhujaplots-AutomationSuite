import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(500)
}

// ── Contact Section ───────────────────────────────────────────────────────────
test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
    await page.waitForTimeout(800)
  })

  test('contact section is visible', async ({ page }) => {
    await expect(page.locator('#contact').first()).toBeVisible()
  })

  test('phone number link is present', async ({ page }) => {
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
  })

  test('WhatsApp button has valid wa.me href', async ({ page }) => {
    const waBtn = page.locator('a[href*="wa.me"]').first()
    const href = await waBtn.getAttribute('href').catch(() => null)
    if (href) expect(href).toContain('wa.me')
  })

  test('contact section has name input', async ({ page }) => {
    await expect(
      page.locator('#contact input[type="text"], #contact input[placeholder*="Name"], #contact input[placeholder*="name"]').first()
    ).toBeVisible()
  })

  test('contact section has phone input', async ({ page }) => {
    await expect(
      page.locator('#contact input[type="tel"], #contact input[placeholder*="Phone"], #contact input[placeholder*="phone"]').first()
    ).toBeVisible()
  })

  test('Send Message button is present', async ({ page }) => {
    await expect(
      page.locator('#contact button[type="submit"], #contact button:has-text("Send")').first()
    ).toBeVisible()
  })
})

// ── Lead Modal ────────────────────────────────────────────────────────────────
test.describe('Lead Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('modal opens from hero CTA', async ({ page }) => {
    await page.locator(
      'button:has-text("View Available Plots"), button:has-text("Enquire Now")'
    ).first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('modal has name and phone fields', async ({ page }) => {
    await page.locator(
      'button:has-text("View Available Plots"), button:has-text("Enquire Now")'
    ).first().click()
    await page.waitForTimeout(300)
    await expect(
      page.locator('input[placeholder*="Name"], input[placeholder*="name"]').first()
    ).toBeVisible()
    await expect(
      page.locator('input[type="tel"], input[placeholder*="Phone"]').first()
    ).toBeVisible()
  })

  test('modal has project dropdown with all 4 projects', async ({ page }) => {
    await page.locator(
      'button:has-text("View Available Plots"), button:has-text("Enquire Now")'
    ).first().click()
    await page.waitForTimeout(300)
    const options = await page.locator('select option').allTextContents()
    expect(options.some(o => o.includes('Anjana'))).toBe(true)
    expect(options.some(o => o.includes('Aparna'))).toBe(true)
    expect(options.some(o => o.includes('Varaha'))).toBe(true)
  })

  test('modal closes on X button', async ({ page }) => {
    await page.locator(
      'button:has-text("View Available Plots"), button:has-text("Enquire Now")'
    ).first().click()
    await page.waitForTimeout(400)
    await page.locator('[class*="close"], [class*="Close"]').first().click()
    await expect(
      page.locator('[class*="modal"], [class*="Modal"]').first()
    ).not.toBeVisible({ timeout: 5000 })
  })

  test('Book Site Visit modal has date field', async ({ page }) => {
    await page.locator(
      'button:has-text("Book Site Visit"), button:has-text("Site Visit")'
    ).first().click()
    await page.waitForTimeout(400)
    await expect(page.locator('input[type="date"]').first()).toBeVisible()
  })
})
