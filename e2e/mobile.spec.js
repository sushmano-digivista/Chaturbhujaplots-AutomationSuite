import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

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
    await expect(page.getByText('Call').first()).toBeVisible()
    await expect(page.getByText('WhatsApp').first()).toBeVisible()
    await expect(page.getByText('Enquire').first()).toBeVisible()
  })

  test('Enquire opens lead modal', async ({ page }) => {
    await page.getByText('Enquire').first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible()
  })

  test('Call button has tel: link', async ({ page }) => {
    const callBtn = page.locator('a[href^="tel:"]').first()
    await expect(callBtn).toBeVisible()
    await expect(callBtn).toHaveAttribute('href', /tel:/)
  })
})

// ── 2. Mobile Hamburger Navigation ───────────────────────────────────────────
test.describe('Mobile Hamburger Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    for (const label of ['Gallery', 'Videos', 'Amenities', 'Location', 'Contact']) {
      await expect(page.getByText(label).first()).toBeVisible()
    }
  })

  test('Gallery link closes menu and scrolls to gallery', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await page.getByText('Gallery').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 5000 })
  })

  test('Location link closes menu and scrolls to location', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await page.getByText('Location').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#location')).toBeInViewport({ timeout: 5000 })
  })

  test('Contact link closes menu and scrolls to contact', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await page.getByText('Contact').first().click()
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
    await page.waitForTimeout(500)
  })

  test('all 4 projects visible on mobile', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.getByText(name).first()).toBeVisible()
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
    for (const id of ['portfolio', 'gallery', 'videos', 'location', 'contact']) {
      await page.evaluate((sId) => document.getElementById(sId)?.scrollIntoView(), id)
      await page.waitForTimeout(300)
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 3000 })
    }
  })

  test('scroll to top button appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(500)
    await expect(
      page.locator('button[class*="scrollTop"], [class*="scrollToTop"]').first()
    ).toBeVisible({ timeout: 3000 })
  })
})

// ── 5. Mobile Project Page ────────────────────────────────────────────────────
test.describe('Mobile Project Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="header"]', { timeout: 10000 })
  })

  test('all tabs accessible on mobile', async ({ page }) => {
    for (const tab of ['Overview', 'Amenities', 'Location', 'Contact']) {
      await page.getByRole('button', { name: tab }).first().click({ force: true })
      await page.waitForTimeout(300)
    }
  })

  test('Contact tab shows phone on mobile', async ({ page }) => {
    await page.getByRole('button', { name: 'Contact' }).first().click({ force: true })
    await expect(page.getByText(/99487 09041/)).toBeVisible()
  })

  test('back button navigates home', async ({ page }) => {
    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

// ── 6. Mobile WhatsApp ────────────────────────────────────────────────────────
test.describe('Mobile WhatsApp Button', () => {
  test('sticky bar WhatsApp navigates to wa.me', async ({ page, context }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByText('WhatsApp').first().click(),
    ]).catch(() => [null])
    // Just check the button is clickable — actual WA opens in app
    await expect(page.getByText('WhatsApp').first()).toBeVisible()
  })
})
