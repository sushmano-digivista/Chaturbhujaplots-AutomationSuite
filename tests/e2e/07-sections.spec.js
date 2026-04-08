/**
 * Suite 7 — Sections Interaction
 */
import { test, expect } from '@playwright/test'

test.describe('7. Sections Interaction', () => {

  test('7.1 Amenities INFRA tab is active by default', async ({ page }) => {
    await page.goto('/')
    await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('[class*="amTabActive"]').first()).toBeVisible()
  })

  test('7.2 Amenities LIFESTYLE tab switches content', async ({ page }) => {
    await page.goto('/')
    await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('button:has-text("Lifestyle"), button:has-text("జీవన")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('[class*="amTabActive"]:has-text("Lifestyle"), [class*="amTabActive"]:has-text("జీవన")').first()).toBeVisible()
  })

  test('7.3 Location Aparna tab shows Chevitikallu', async ({ page }) => {
    await page.goto('/')
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('[class*="ventureTab"]:has-text("Aparna")').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Chevitikallu, text=చెవిటికల్లు').first()).toBeVisible()
  })

  test('7.4 Location Varaha tab shows Pamarru', async ({ page }) => {
    await page.goto('/')
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('[class*="ventureTab"]:has-text("Varaha")').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Pamarru, text=పామర్రు').first()).toBeVisible()
  })

  test('7.5 Plot venture switcher — Aparna shows 273 plots', async ({ page }) => {
    await page.goto('/')
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('[class*="ventureBtn"]:has-text("Aparna")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=273').first()).toBeVisible()
  })

  test('7.6 Pricing toggle opens East/West Facing details', async ({ page }) => {
    await page.goto('/')
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    const banner = page.locator('[class*="priceBanner"]').first()
    if (await banner.isVisible()) {
      await banner.click()
      await page.waitForTimeout(300)
      await expect(page.locator('text=East Facing, text=తూర్పు').first()).toBeVisible()
    }
  })

  test('7.7 Urgency bar is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[class*="urgency"], [class*="stickyBar"]').first()).toBeVisible()
  })

  test('7.8 Portfolio section shows all 4 project cards', async ({ page }) => {
    await page.goto('/')
    await page.locator('#portfolio').scrollIntoViewIfNeeded().catch(() => {})
    for (const name of ['Anjana Paradise','Aparna Legacy','Varaha Virtue','Trimbak Oaks']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible()
    }
  })

})
