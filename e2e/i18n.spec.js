import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const TELUGU_RE = /[\u0C00-\u0C7F]/

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(800)
}

async function switchToTelugu(page) {
  const toggle = page.locator('[class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent().catch(() => '')
  if (text.includes('EN')) {
    await toggle.click()
    await page.waitForTimeout(600)
  }
}

async function switchToEnglish(page) {
  const toggle = page.locator('[class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent().catch(() => '')
  if (text.includes('తె')) {
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

  test('EN|తె toggle is visible', async ({ page }) => {
    await expect(
      page.locator('[class*="langToggle"], [class*="LanguageToggle"]').first()
    ).toBeVisible()
  })

  test('switching to Telugu changes navbar text', async ({ page }) => {
    await switchToTelugu(page)
    const navText = await page.locator('nav').textContent()
    expect(TELUGU_RE.test(navText || '')).toBe(true)
  })

  test('switching back to English restores English text', async ({ page }) => {
    await switchToTelugu(page)
    await switchToEnglish(page)
    await expect(page.locator('button:has-text("View Available Plots")').first()).toBeVisible()
  })

  test('language persists on page reload', async ({ page }) => {
    await switchToTelugu(page)
    await page.reload()
    await waitForLoad(page)
    const navText = await page.locator('nav').textContent()
    expect(TELUGU_RE.test(navText || '')).toBe(true)
  })
})

// ── Telugu Mode Content ───────────────────────────────────────────────────────
test.describe('Telugu Mode — Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await switchToTelugu(page)
  })

  test('"మాతో ఎందుకు" section visible', async ({ page }) => {
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  })

  test('"అత్యాధునిక సౌకర్యాలు" amenities heading visible', async ({ page }) => {
    await expect(page.locator('text=అత్యాధునిక సౌకర్యాలు').first()).toBeVisible()
  })

  test('"ప్లాట్ విభాగాలు" plot categories visible', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=ప్లాట్ విభాగాలు').first()).toBeVisible()
  })

  test('"మమ్మల్ని కనుగొనండి" location heading visible', async ({ page }) => {
    await expect(page.locator('text=మమ్మల్ని కనుగొనండి').first()).toBeVisible()
  })

  test('location tabs show Telugu short names', async ({ page }) => {
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    for (const name of ['పారిటాల', 'చెవిటికల్లు', 'పామర్రు', 'పేనమలూరు']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible()
    }
  })

  test('no raw key strings visible on page', async ({ page }) => {
    await page.waitForTimeout(1500)
    const bodyText = await page.locator('body').textContent()
    const rawKeys = (bodyText || '').match(
      /\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer|amenityLabels|locationLabels)\.[a-zA-Z]+\b/g
    ) || []
    expect(rawKeys).toHaveLength(0)
  })
})

// ── Telugu Mode — Project Page ────────────────────────────────────────────────
test.describe('Telugu Mode — Project Page', () => {
  test('project page tabs show in Telugu', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
    const toggle = page.locator('[class*="langToggle"]').first()
    const text = await toggle.textContent().catch(() => '')
    if (text.includes('EN')) {
      await toggle.click()
      await page.waitForTimeout(600)
    }
    await expect(page.locator('text=హోమ్').first()).toBeVisible()
  })

  test('pricing card shows Telugu labels', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
    const toggle = page.locator('[class*="langToggle"]').first()
    const text = await toggle.textContent().catch(() => '')
    if (text.includes('EN')) { await toggle.click(); await page.waitForTimeout(600) }
    await page.getByRole('button', { name: /వివరణ|Overview/i }).first().scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /వివరణ|Overview/i }).first().click()
    await expect(page.locator('text=ప్లాట్ ధరలు').first()).toBeVisible()
  })
})
