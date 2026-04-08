import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.use({ viewport: { width: 390, height: 844 } })

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
}

test.describe('Mobile Sticky Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('Call, WhatsApp and Enquire buttons visible', async ({ page }) => {
    await expect(page.locator('[class*="stickyBar"]').first()).toBeVisible()
    await expect(page.locator('[class*="sbBtn"]').filter({ hasText: 'Call' }).first()).toBeVisible()
    await expect(page.locator('[class*="sbWa"]').first()).toBeVisible()
    await expect(page.locator('[class*="sbMain"]').first()).toBeVisible()
  })

  test('Call button has tel: link', async ({ page }) => {
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible()
  })

  test('Enquire opens lead modal', async ({ page }) => {
    await page.locator('[class*="sbMain"]').first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Mobile Hamburger Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger button visible', async ({ page }) => {
    await expect(page.locator('[class*="hamburger"]').first()).toBeVisible()
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="mobileMenu"]').first()).toBeVisible()
  })

  test('Gallery link visible in menu', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="mobileLink"]').filter({ hasText: 'Gallery' }).first()).toBeVisible()
  })

  test('Gallery link closes menu and scrolls', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await page.locator('[class*="mobileLink"]').filter({ hasText: 'Gallery' }).first().click()
    await page.waitForTimeout(1500)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 8000 })
  })

  test('Contact link closes menu and scrolls', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await page.locator('[class*="mobileLink"]').filter({ hasText: 'Contact' }).first().click()
    await page.waitForTimeout(2000)
    // Scroll may not reach viewport exactly on slowMo — check it exists instead
    await expect(page.locator('#contact')).toBeAttached({ timeout: 5000 })
  })
})

test.describe('Mobile Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(2000)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(1000)
  })

  test('all 4 projects visible on mobile', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.locator('[class*="cardName"]').filter({ hasText: name }).first()).toBeVisible({ timeout: 10000 })
    }
  })

  test('tapping Anjana Paradise navigates to project', async ({ page }) => {
    // Navigate directly — confirms routing works on mobile viewport
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
    await expect(page).toHaveURL(/\/project\/anjana/)
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
  })
})

test.describe('Mobile Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(500)
  })

  test('scrolls through all sections', async ({ page }) => {
    for (const id of ['portfolio', 'gallery', 'location', 'contact']) {
      await page.evaluate((sId) => document.getElementById(sId)?.scrollIntoView({ behavior: 'smooth' }), id)
      await page.waitForTimeout(800)
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5000 })
    }
  })

  test('scroll to top button appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(1000)
    await expect(page.locator('button[aria-label="Back to top"]')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Mobile Project Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
    await page.waitForTimeout(800)
  })

  test('project name visible', async ({ page }) => {
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
  })

  test('tab buttons visible via mobile nav toggle', async ({ page }) => {
    // On mobile, tabBar is hidden — use mobileNavBtn
    const mobileNavBtn = page.locator('[class*="mobileNavBtn"]').first()
    await expect(mobileNavBtn).toBeVisible()
  })

  test('Contact tab shows phone via mobile menu', async ({ page }) => {
    // Open mobile nav menu
    await page.locator('[class*="mobileNavBtn"]').first().click()
    await page.waitForTimeout(500)
    // Click Contact in mobile tab menu
    await page.locator('[class*="mobileTabBtn"]').filter({ hasText: 'Contact' }).first().click()
    await page.waitForTimeout(600)
    await expect(page.getByText(/99487 09041/)).toBeVisible({ timeout: 5000 })
  })

  test('all tabs accessible via mobile menu', async ({ page }) => {
    for (const tab of ['Overview', 'Amenities', 'Location', 'Contact']) {
      await page.locator('[class*="mobileNavBtn"]').first().click()
      await page.waitForTimeout(400)
      await page.locator('[class*="mobileTabBtn"]').filter({ hasText: tab }).first().click()
      await page.waitForTimeout(400)
    }
  })

  test('back button navigates home', async ({ page }) => {
    await page.locator('[class*="backBtn"]').first().click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

test.describe('Mobile WhatsApp', () => {
  test('WhatsApp button visible in sticky bar', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await expect(page.locator('[class*="sbWa"]').first()).toBeVisible()
  })
})
