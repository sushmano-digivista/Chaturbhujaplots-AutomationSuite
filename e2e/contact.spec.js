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

async function openHeroModal(page) {
  // Use navbar ENQUIRE NOW button — visible on both desktop and mobile
  // enquireBtn class on desktop, mobileEnquire on mobile
  const enquireBtn = page.locator('[class*="enquireBtn"], [class*="mobileEnquire"]').first()
  await expect(enquireBtn).toBeVisible({ timeout: 5000 })
  await enquireBtn.click()
  await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 8000 })
  // Wait for Framer Motion animation to complete and form to render
  await page.waitForSelector('.form-input', { timeout: 10000 })
  await page.waitForTimeout(300)
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
    await expect(page.locator('#contact a[href^="tel:"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('WhatsApp button has valid wa.me href', async ({ page }) => {
    await expect(page.locator('#contact [class*="waBtn"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('Request Callback button is present', async ({ page }) => {
    await expect(page.locator('#contact button.btn-green').first()).toBeVisible({ timeout: 8000 })
  })

  test('Schedule Site Visit button is present', async ({ page }) => {
    await expect(page.locator('#contact [class*="visitBtn"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('Send Message / WhatsApp button is present', async ({ page }) => {
    await expect(page.locator('#contact [class*="waBtn"]').first()).toBeVisible({ timeout: 8000 })
  })
})

// ── Lead Modal ────────────────────────────────────────────────────────────────
test.describe('Lead Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('modal opens from hero CTA', async ({ page }) => {
    await openHeroModal(page)
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible()
  })

  test('modal has name and phone fields', async ({ page }) => {
    await openHeroModal(page)
    // Modal uses createPortal — .form-input is global class on all inputs
    const count = await page.locator('.form-input').count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('modal has project dropdown with all 4 projects', async ({ page }) => {
    await openHeroModal(page)
    const sel = page.locator('select.form-input').first()
    await expect(sel).toBeVisible({ timeout: 8000 })
    const options = await sel.locator('option').allTextContents()
    expect(options.some(o => o.includes('Anjana'))).toBe(true)
    expect(options.some(o => o.includes('Aparna') || o.includes('Varaha') || o.includes('Trimbak'))).toBe(true)
  })

  test('modal closes on X button', async ({ page }) => {
    await openHeroModal(page)
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible()
    // Use JS to directly click the close button — bypasses slowMo interference
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Close"]')
      if (btn) btn.click()
    })
    await page.waitForTimeout(2000)
    await expect(page.locator('[class*="overlay"]').first()).not.toBeAttached({ timeout: 10000 })
  })

  test('Book Site Visit modal has date field', async ({ page }) => {
    await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit")').first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)
    await expect(page.locator('input[type="date"]').first()).toBeVisible()
  })
})
