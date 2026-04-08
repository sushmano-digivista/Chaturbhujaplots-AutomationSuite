/**
 * Suite 10 — Contact & WhatsApp
 */
import { test, expect } from '@playwright/test'

test.describe('10. Contact & WhatsApp', () => {

  test('10.1 Contact section is visible', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('#contact').first()).toBeVisible()
  })

  test('10.2 WhatsApp button has valid wa.me href', async ({ page }) => {
    await page.goto('/')
    const waBtn = page.locator('a[href*="wa.me"]').first()
    if (await waBtn.isVisible()) {
      const href = await waBtn.getAttribute('href')
      expect(href).toMatch(/wa\.me\/91\d{10}/)
    }
  })

  test('10.3 Phone number tel: link is present', async ({ page }) => {
    await page.goto('/')
    const telLink = page.locator('a[href*="tel:"]').first()
    await expect(telLink).toBeVisible()
    const href = await telLink.getAttribute('href')
    expect(href).toContain('tel:')
  })

  test('10.4 Contact section has name input', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded().catch(() => {})
    await expect(
      page.locator('#contact input[type="text"], #contact input[placeholder*="name"]').first()
    ).toBeVisible()
  })

  test('10.5 Contact section has phone input', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded().catch(() => {})
    await expect(
      page.locator('#contact input[type="tel"], #contact input[placeholder*="phone"]').first()
    ).toBeVisible()
  })

  test('10.6 Send Message button is present', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded().catch(() => {})
    await expect(
      page.locator('#contact button:has-text("Send"), #contact button:has-text("Message"), #contact button[type="submit"]').first()
    ).toBeVisible()
  })

})
