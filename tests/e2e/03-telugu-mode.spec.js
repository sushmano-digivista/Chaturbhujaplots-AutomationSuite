/**
 * Suite 3 — Telugu Mode (i18n)
 */
import { test, expect } from '@playwright/test'
import { switchToTelugu, switchToEnglish, TELUGU_RE } from '../helpers/utils.js'

test.describe('3. Telugu Mode — i18n', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await switchToTelugu(page)
  })

  test('3.1 Language toggle switches to Telugu', async ({ page }) => {
    const toggle = page.locator('[class*="langToggle"]').first()
    const text = await toggle.textContent()
    expect(text).toMatch(/తె|EN/)
  })

  test('3.2 Hero CTA shows Telugu text', async ({ page }) => {
    const cta = page.locator('button:has-text("అందుబాటు"), button:has-text("ఇప్పుడే")').first()
    await expect(cta).toBeVisible()
  })

  test('3.3 Navbar contains Telugu characters', async ({ page }) => {
    const navText = await page.locator('nav').textContent()
    expect(TELUGU_RE.test(navText || '')).toBe(true)
  })

  test('3.4 "మాతో ఎందుకు" (Why Chaturbhuja) heading visible', async ({ page }) => {
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  })

  test('3.5 "అత్యాధునిక సౌకర్యాలు" (Amenities) heading visible', async ({ page }) => {
    await expect(page.locator('text=అత్యాధునిక సౌకర్యాలు').first()).toBeVisible()
  })

  test('3.6 "ప్లాట్ విభాగాలు" (Plot Categories) visible', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=ప్లాట్ విభాగాలు').first()).toBeVisible()
  })

  test('3.7 "మమ్మల్ని కనుగొనండి" (Find Us) visible', async ({ page }) => {
    await expect(page.locator('text=మమ్మల్ని కనుగొనండి').first()).toBeVisible()
  })

  test('3.8 Location tabs show Telugu short names', async ({ page }) => {
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    for (const name of ['పారిటాల','చెవిటికల్లు','పామర్రు','పేనమలూరు']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible()
    }
  })

  test('3.9 No raw key strings visible on page (e.g. sections.highlights)', async ({ page }) => {
    await page.waitForTimeout(1500)
    const bodyText = await page.locator('body').textContent()
    const rawKeys = (bodyText || '').match(
      /\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer|amenityLabels|locationLabels)\.[a-zA-Z]+/g
    ) || []
    expect(rawKeys).toHaveLength(0)
  })

  test('3.10 Switching back to EN restores English content', async ({ page }) => {
    await switchToEnglish(page)
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
    await expect(page.locator('button:has-text("View Available Plots")').first()).toBeVisible()
  })

})
