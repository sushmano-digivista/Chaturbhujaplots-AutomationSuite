import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// Force mobile viewport for all tests in this file
test.use({ viewport: { width: 390, height: 844 } })

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
}

// ── 1. Sticky Bar ─────────────────────────────────────────────────────────────
test.describe('Mobile Sticky Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('Call, WhatsApp and Enquire buttons visible', async ({ page }) => {
    const stickyBar = page.locator('[class*="stickyBar"], [class*="sticky"]').first()
    await expect(stickyBar).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[class*="stickyBar"] span, [class*="sbBtn"] span').filter({ hasText: 'Call' }).first()).toBeVisible()
    await expect(page.locator('[class*="stickyBar"] span, [class*="sbBtn"] span').filter({ hasText: 'WhatsApp' }).first()).toBeVisible()
    await expect(page.locator('[class*="stickyBar"] span, [class*="sbBtn"] span').filter({ hasText: 'Enquire' }).first()).toBeVisible()
  })

  test('Call button has tel: link', async ({ page }) => {
    const callBtn = page.locator('a[href^="tel:"]').first()
    await expect(callBtn).toBeVisible()
    await expect(callBtn).toHaveAttribute('href', /tel:/)
  })

  test('Enquire opens lead modal', async ({ page }) => {
    await page.locator('[class*="sbMain"], [class*="sbBtn"]').last().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible({ timeout: 5000 })
  })
})

// ── 2. Mobile Hamburger Navigation ───────────────────────────────────────────
test.describe('Mobile Hamburger Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger button is visible', async ({ page }) => {
    const hamburger = page.locator('[class*="hamburger"], button[class*="mobile"]').first()
    await expect(hamburger).toBeVisible()
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.locator('[class*="hamburger"], button[class*="mobile"]').first().click()
    await page.waitForTimeout(500)
    const mobileMenu = page.locator('[class*="mobileMenu"], [class*="mobile-menu"]').first()
    await expect(mobileMenu).toBeVisible()
  })

  test('Gallery link in menu visible', async ({ page }) => {
    await page.locator('[class*="hamburger"], button[class*="mobile"]').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="mobileMenu"] button, [class*="mobileLink"]').filter({ hasText: 'Gallery' }).first()).toBeVisible()
  })

  test('Gallery link closes menu and scrolls', async ({ page }) => {
    await page.locator('[class*="hamburger"], button[class*="mobile"]').first().click()
    await page.waitForTimeout(500)
    await page.locator('[class*="mobileMenu"] button, [class*="mobileLink"]').filter({ hasText: 'Gallery' }).first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 5000 })
  })

  test('Contact link closes menu and scrolls', async ({ page }) => {
    await page.locator('[class*="hamburger"], button[class*="mobile"]').first().click()
    await page.waitForTimeout(500)
    await page.locator('[class*="mobileMenu"] button, [class*="mobileLink"]').filter({ hasText: 'Contact' }).first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 })
  })
})

// ── 3. Mobile Portfolio ───────────────────────────────────────────────────────
test.describe('Mobile Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(800)
  })

  test('all 4 projects visible on mobile', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.getByText(name).first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('tapping Anjana Paradise navigates to project', async ({ page }) => {
    await page.getByText('Anjana Paradise').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/, { timeout: 5000 })
  })
})

// ── 4. Mobile Scroll ──────────────────────────────────────────────────────────
test.describe('Mobile Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('scrolls through all sections', async ({ page }) => {
    for (const id of ['portfolio', 'gallery', 'location', 'contact']) {
      await page.evaluate((sId) => document.getElementById(sId)?.scrollIntoView(), id)
      await page.waitForTimeout(400)
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5000 })
    }
  })

  test('scroll to top button appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 2000))
    await page.waitForTimeout(800)
    await expect(
      page.locator('[class*="scrollTop"], [class*="ScrollTop"], [class*="toTop"]').first()
    ).toBeVisible({ timeout: 5000 })
  })
})

// ── 5. Mobile Project Page ────────────────────────────────────────────────────
test.describe('Mobile Project Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
    await page.waitForTimeout(500)
  })

  test('project name visible', async ({ page }) => {
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
  })

  test('tab buttons visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Overview' }).first()).toBeVisible()
  })

  test('Contact tab shows phone', async ({ page }) => {
    await page.getByRole('button', { name: 'Contact' }).first().click({ force: true })
    await page.waitForTimeout(500)
    await expect(page.getByText(/99487 09041/)).toBeVisible({ timeout: 5000 })
  })

  test('back button navigates home', async ({ page }) => {
    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page).toHaveURL(BASE + '/')
  })

  test('all tabs accessible', async ({ page }) => {
    for (const tab of ['Overview', 'Amenities', 'Location', 'Contact']) {
      await page.getByRole('button', { name: tab }).first().click({ force: true })
      await page.waitForTimeout(400)
    }
  })
})

// ── 6. Mobile WhatsApp ────────────────────────────────────────────────────────
test.describe('Mobile WhatsApp', () => {
  test('WhatsApp button visible in sticky bar', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await expect(
      page.locator('[class*="sbWa"], [class*="stickyBar"]').getByText('WhatsApp').first()
    ).toBeVisible()
  })
})
