import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const TELUGU_RE = /[\u0C00-\u0C7F]/

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(800)
}

// Language toggle is a <button aria-label="Switch to Telugu/English">
async function switchToTelugu(page) {
  const toggle = page.locator('button[aria-label="Switch to Telugu"]').first()
  if (await toggle.isVisible()) {
    await toggle.click()
    await page.waitForTimeout(600)
  }
}

async function switchToEnglish(page) {
  const toggle = page.locator('button[aria-label="Switch to English"]').first()
  if (await toggle.isVisible()) {
    await toggle.click()
    await page.waitForTimeout(600)
  }
}

// ── Language Toggle ───────────────────────────────────────────────────────────
test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('EN/తె toggle is visible in navbar', async ({ page }) => {
    await expect(
      page.locator('button[aria-label="Switch to Telugu"], button[aria-label="Switch to English"]').first()
    ).toBeVisible()
  })

  test('toggles to Telugu on click', async ({ page }) => {
    await switchToTelugu(page)
    // After switching, toggle should now say "Switch to English"
    await expect(
      page.locator('button[aria-label="Switch to English"]').first()
    ).toBeVisible()
  })

  test('toggles back to English', async ({ page }) => {
    await switchToTelugu(page)
    await switchToEnglish(page)
    await expect(
      page.locator('button[aria-label="Switch to Telugu"]').first()
    ).toBeVisible()
  })
})

// ── English Content ───────────────────────────────────────────────────────────
test.describe('English Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await switchToEnglish(page)
  })

  test('Why Chaturbhuja heading visible', async ({ page }) => {
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  })

  test('East-Facing plots label visible', async ({ page }) => {
    await page.evaluate(() => document.getElementById('plots')?.scrollIntoView())
    await page.waitForTimeout(500)
    await expect(page.locator('text=East-Facing').first()).toBeVisible()
  })

  test('no raw key strings visible (e.g. sections.highlights)', async ({ page }) => {
    await page.waitForTimeout(1500)
    const body = await page.locator('body').textContent()
    const rawKeys = (body || '').match(
      /\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer)\.[a-zA-Z]+/g
    ) || []
    expect(rawKeys).toHaveLength(0)
  })
})

// ── Telugu Content ────────────────────────────────────────────────────────────
test.describe('Telugu Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await switchToTelugu(page)
  })

  test('navbar contains Telugu characters', async ({ page }) => {
    const navText = await page.locator('nav').textContent()
    expect(TELUGU_RE.test(navText || '')).toBe(true)
  })

  test('"మాతో ఎందుకు" heading visible', async ({ page }) => {
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  })

  test('location tabs show Telugu project short names', async ({ page }) => {
    await page.evaluate(() => document.getElementById('location')?.scrollIntoView())
    await page.waitForTimeout(500)
    for (const name of ['పారిటాల', 'చెవిటికల్లు', 'పామర్రు', 'పేనమలూరు']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 8000 })
    }
  })

  test('no raw key strings in Telugu mode', async ({ page }) => {
    await page.waitForTimeout(1500)
    const body = await page.locator('body').textContent()
    const rawKeys = (body || '').match(
      /\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer)\.[a-zA-Z]+/g
    ) || []
    expect(rawKeys).toHaveLength(0)
  })

  test('switching back to EN restores English content', async ({ page }) => {
    await switchToEnglish(page)
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  })
})
