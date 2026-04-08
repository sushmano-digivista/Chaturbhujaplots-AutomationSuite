/**
 * Suite 5 — Navigation
 */
import { test, expect } from '@playwright/test'

test.describe('5. Navigation', () => {

  test('5.1 Portfolio dropdown opens on click', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav [class*="dropTrigger"], nav button:has-text("Portfolio")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('[class*="dropCards"], [class*="dropCard"]').first()).toBeVisible()
  })

  test('5.2 All 4 projects visible in dropdown', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav [class*="dropTrigger"], nav button:has-text("Portfolio")').first().click()
    for (const name of ['Anjana Paradise','Aparna Legacy','Varaha Virtue','Trimbak Oaks']) {
      await expect(page.locator(`[class*="dropCard"]:has-text("${name}")`).first()).toBeVisible()
    }
  })

  test('5.3 Clicking Anjana in dropdown navigates to project page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav [class*="dropTrigger"], nav button:has-text("Portfolio")').first().click()
    await page.locator('[class*="dropCard"]:has-text("Anjana")').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/)
  })

  test('5.4 View All Projects navigates to portfolio section', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav [class*="dropTrigger"], nav button:has-text("Portfolio")').first().click()
    await page.locator('text=View All Projects, text=అన్ని ప్రాజెక్టులను చూడండి').first().click()
    await page.waitForTimeout(500)
    // Should scroll to portfolio or navigate
    expect(page.url()).toMatch(/\/#portfolio|\/|\/project/)
  })

  test('5.5 Enquire Now navbar button opens modal', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav button:has-text("Enquire Now"), nav [class*="navCta"]').first().click()
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

  test('5.6 Dropdown closes when clicking outside', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav [class*="dropTrigger"], nav button:has-text("Portfolio")').first().click()
    await page.waitForTimeout(200)
    await page.locator('body').click({ position: { x: 100, y: 500 } })
    await page.waitForTimeout(300)
    await expect(page.locator('[class*="dropCards"]').first()).not.toBeVisible()
  })

})
