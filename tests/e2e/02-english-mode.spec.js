/**
 * Suite 2 — English Mode Content
 */
import { test, expect } from '@playwright/test'
import { switchToEnglish } from '../helpers/utils.js'

test.describe('2. English Mode — Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await switchToEnglish(page)
  })

  test('2.1 Hero headline is visible and non-empty', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    const text = await h1.textContent()
    expect(text?.trim().length).toBeGreaterThan(5)
  })

  test('2.2 "View Available Plots" CTA is visible', async ({ page }) => {
    await expect(
      page.locator('button:has-text("View Available Plots")').first()
    ).toBeVisible()
  })

  test('2.3 "Book Site Visit" CTA is visible', async ({ page }) => {
    await expect(
      page.locator('button:has-text("Book Site Visit")').first()
    ).toBeVisible()
  })

  test('2.4 "Get Brochure" CTA is visible', async ({ page }) => {
    await expect(
      page.locator('button:has-text("Get Brochure"), button:has-text("Download")').first()
    ).toBeVisible()
  })

  test('2.5 Navbar shows Portfolio, Gallery, Videos links', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav.locator('text=Portfolio').first()).toBeVisible()
    await expect(nav.locator('text=Gallery').first()).toBeVisible()
    await expect(nav.locator('text=Videos').first()).toBeVisible()
  })

  test('2.6 Why Chaturbhuja section visible', async ({ page }) => {
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  })

  test('2.7 World-Class Amenities section visible', async ({ page }) => {
    await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=What We Offer').first()).toBeVisible()
  })

  test('2.8 Location section shows all 4 projects', async ({ page }) => {
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    for (const name of ['Anjana Paradise','Aparna Legacy','Varaha Virtue','Trimbak Oaks']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible()
    }
  })

  test('2.9 Plot Grid shows East-Facing and West-Facing categories', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=East-Facing').first()).toBeVisible()
    await expect(page.locator('text=West-Facing').first()).toBeVisible()
  })

  test('2.10 Investment Opportunity section visible', async ({ page }) => {
    await expect(page.locator('text=Investment Opportunity').first()).toBeVisible()
  })

  test('2.11 Footer is visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await expect(page.locator('footer').first()).toBeVisible()
  })

})
