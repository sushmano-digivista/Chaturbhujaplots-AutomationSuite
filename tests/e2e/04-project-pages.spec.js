/**
 * Suite 4 — Project Pages
 */
import { test, expect } from '@playwright/test'
import { switchToTelugu, PROJECTS } from '../helpers/utils.js'

test.describe('4. Project Pages', () => {

  for (const proj of PROJECTS) {
    test(`4.${PROJECTS.indexOf(proj)+1} ${proj.name} — page loads correctly`, async ({ page }) => {
      await page.goto(`/project/${proj.id}`)
      await expect(page.locator(`text=${proj.name}`).first()).toBeVisible()
      await expect(page.locator(`text=${proj.loc}`).first()).toBeVisible()
    })
  }

  test('4.5 Project page has Home + Overview + Amenities tabs', async ({ page }) => {
    await page.goto('/project/anjana')
    await expect(page.locator('text=Home').first()).toBeVisible()
    await expect(page.locator('text=Overview').first()).toBeVisible()
    await expect(page.locator('text=Amenities').first()).toBeVisible()
  })

  test('4.6 Overview tab shows pricing card', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('text=Overview').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=PLOT PRICING').first()).toBeVisible()
    await expect(page.locator('text=East Facing').first()).toBeVisible()
  })

  test('4.7 Amenities tab shows amenity items', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('text=Amenities').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="amGrid"], [class*="amItem"]').first()).toBeVisible()
  })

  test('4.8 Location tab shows map and landmarks', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('text=Location').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('iframe, [class*="distCard"]').first()).toBeVisible()
  })

  test('4.9 Gallery tab shows images', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('text=Gallery').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('[class*="galImg"], img').first()).toBeVisible()
  })

  test('4.10 Approval chips are visible', async ({ page }) => {
    await page.goto('/project/anjana')
    await expect(page.locator('[class*="approvalChip"], [class*="approval"]').first()).toBeVisible()
  })

  test('4.11 Back to Home button navigates home', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('text=Back to Home, text=హోమ్‌కు తిరిగి').first().click()
    await expect(page).toHaveURL('/')
  })

  test('4.12 Project page in Telugu — tabs and pricing in Telugu', async ({ page }) => {
    await page.goto('/project/anjana')
    await switchToTelugu(page)
    await page.waitForTimeout(600)
    await expect(page.locator('text=హోమ్').first()).toBeVisible()
    await page.locator('text=వివరణ').first().click()
    await expect(page.locator('text=ప్లాట్ ధరలు').first()).toBeVisible()
  })

  test('4.13 Trimbak Oaks shows Coming Soon state', async ({ page }) => {
    await page.goto('/project/trimbak')
    await expect(page.locator('text=Upcoming, text=Coming Soon, text=రాబోతోంది').first()).toBeVisible()
  })

  test('4.14 Enquire Now button opens modal on project page', async ({ page }) => {
    await page.goto('/project/anjana')
    await page.locator('button:has-text("Enquire Now"), button:has-text("సంప్రదించండి")').first().click()
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

})
