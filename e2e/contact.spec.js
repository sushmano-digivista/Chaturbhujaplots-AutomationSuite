import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(500)
}

async function scrollToContact(page) {
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await page.waitForTimeout(800)
}

// ── Contact Section ───────────────────────────────────────────────────────────
test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await scrollToContact(page)
  })

  test('contact section is visible', async ({ page }) => {
    await expect(page.locator('#contact').first()).toBeVisible()
  })

  test('phone number link is present', async ({ page }) => {
    // tel: link is inside callCard
    await expect(
      page.locator('#contact a[href^="tel:"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('WhatsApp button has valid wa.me href', async ({ page }) => {
    // WhatsApp uses openWhatsApp() — button with waBtn class
    await expect(
      page.locator('#contact [class*="waBtn"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('Request Callback button is present', async ({ page }) => {
    await expect(
      page.locator('#contact button.btn-green').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('Schedule Site Visit button is present', async ({ page }) => {
    await expect(
      page.locator('#contact [class*="visitBtn"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('Send Message / WhatsApp button is present', async ({ page }) => {
    await expect(
      page.locator('#contact [class*="waBtn"]').first()
    ).toBeVisible({ timeout: 8000 })
  })
})

// ── Lead Modal ────────────────────────────────────────────────────────────────
test.describe('Lead Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('modal opens from hero CTA', async ({ page }) => {
    await page.locator('#home button.btn-gold').first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('modal has name and phone fields', async ({ page }) => {
    await page.locator('#home button.btn-gold').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('input[placeholder*="Name"], input[placeholder*="name"]').first()).toBeVisible()
    await expect(page.locator('input[type="tel"], input[placeholder*="Phone"]').first()).toBeVisible()
  })

  test('modal has project dropdown with all 4 projects', async ({ page }) => {
    await page.locator('#home button.btn-gold').first().click()
    await page.waitForTimeout(300)
    const options = await page.locator('select option').allTextContents()
    expect(options.some(o => o.includes('Anjana'))).toBe(true)
    expect(options.some(o => o.includes('Aparna'))).toBe(true)
    expect(options.some(o => o.includes('Varaha'))).toBe(true)
  })

  test('modal closes on X button', async ({ page }) => {
    await page.locator('#home button.btn-gold').first().click()
    await page.waitForTimeout(400)
    await page.locator('[class*="closeBtn"]').first().click()
    await expect(page.locator('[class*="overlay"]').first()).not.toBeVisible({ timeout: 5000 })
  })

  test('Book Site Visit modal has date field', async ({ page }) => {
    await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit")').first().click()
    await page.waitForTimeout(400)
    await expect(page.locator('input[type="date"]').first()).toBeVisible()
  })
})
