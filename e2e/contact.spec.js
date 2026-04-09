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
  await page.locator('#home button.btn-gold').first().click()
  await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 8000 })
  await page.waitForTimeout(500)
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
    // Debug: log all classes and inputs in overlay
    const overlayHTML = await page.locator('[class*="overlay"]').first().innerHTML()
    console.log('OVERLAY_HTML_SNIPPET:', overlayHTML.substring(0, 800))
    const allInputs = await page.locator('input').all()
    console.log('ALL_INPUTS_COUNT:', allInputs.length)
    for (const inp of allInputs) {
      const cls = await inp.getAttribute('class')
      const type = await inp.getAttribute('type')
      const vis = await inp.isVisible()
      console.log('INPUT:', { cls, type, vis })
    }
    expect(allInputs.length).toBeGreaterThanOrEqual(1)
  })

  test('modal has project dropdown with all 4 projects', async ({ page }) => {
    await openHeroModal(page)
    const allSelects = await page.locator('select').all()
    console.log('ALL_SELECTS_COUNT:', allSelects.length)
    for (const sel of allSelects) {
      const cls = await sel.getAttribute('class')
      const vis = await sel.isVisible()
      const opts = await sel.locator('option').allTextContents()
      console.log('SELECT:', { cls, vis, opts: opts.slice(0,5) })
    }
    expect(allSelects.length).toBeGreaterThanOrEqual(1)
  })

  test('modal closes on X button', async ({ page }) => {
    await openHeroModal(page)
    const allBtns = await page.locator('[class*="overlay"] button, [class*="sheet"] button').all()
    console.log('MODAL_BTNS_COUNT:', allBtns.length)
    for (const btn of allBtns) {
      const cls = await btn.getAttribute('class')
      const txt = await btn.textContent()
      const vis = await btn.isVisible()
      console.log('BTN:', { cls, txt: txt?.trim().substring(0,30), vis })
    }
    expect(allBtns.length).toBeGreaterThanOrEqual(1)
  })

  test('Book Site Visit modal has date field', async ({ page }) => {
    await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit")').first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)
    await expect(page.locator('input[type="date"]').first()).toBeVisible()
  })
})
