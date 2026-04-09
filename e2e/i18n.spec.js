import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const TELUGU_RE = /[\u0C00-\u0C7F]/

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(800)
}

async function getVisibleToggle(page, ariaLabel) {
  const toggles = page.locator(`button[aria-label="${ariaLabel}"]`)
  const count = await toggles.count()
  for (let i = 0; i < count; i++) {
    if (await toggles.nth(i).isVisible()) return toggles.nth(i)
  }
  return toggles.first()
}

async function switchToTelugu(page) {
  const toggle = await getVisibleToggle(page, 'Switch to Telugu')
  if (await toggle.isVisible()) {
    await toggle.click()
    await page.waitForTimeout(800)
  }
}

async function switchToEnglish(page) {
  const toggle = await getVisibleToggle(page, 'Switch to English')
  if (await toggle.isVisible()) {
    await toggle.click()
    await page.waitForTimeout(800)
  }
}

// ── Language Toggle ───────────────────────────────────────────────────────────
test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('EN/తె toggle is visible in navbar', async ({ page }) => {
    const enToggle = page.locator('button[aria-label="Switch to Telugu"]')
    const teToggle = page.locator('button[aria-label="Switch to English"]')
    let anyVisible = false
    for (let i = 0; i < await enToggle.count(); i++) {
      if (await enToggle.nth(i).isVisible()) { anyVisible = true; break }
    }
    for (let i = 0; i < await teToggle.count(); i++) {
      if (await teToggle.nth(i).isVisible()) { anyVisible = true; break }
    }
    expect(anyVisible).toBe(true)
  })

  test('toggles to Telugu on click', async ({ page }) => {
    await switchToTelugu(page)
    const toggle = await getVisibleToggle(page, 'Switch to English')
    await expect(toggle).toBeVisible()
  })

  test('toggles back to English', async ({ page }) => {
    await switchToTelugu(page)
    await switchToEnglish(page)
    const toggle = await getVisibleToggle(page, 'Switch to Telugu')
    await expect(toggle).toBeVisible()
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
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible({ timeout: 8000 })
  })

  test('location tabs show Telugu project short names', async ({ page }) => {
    // Scroll to location section and wait for data to load from DB
    await page.evaluate(() => document.getElementById('location')?.scrollIntoView())
    await page.waitForTimeout(2000)
    // Telugu short names are in ventureTabShort spans
    for (const name of ['పారిటాల', 'చెవిటికల్లు', 'పామర్రు', 'పేనమలూరు']) {
      await expect(
        page.locator(`[class*="ventureTabShort"]:has-text("${name}"), [class*="ventureTab"]:has-text("${name}")`).first()
      ).toBeVisible({ timeout: 12000 })
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
