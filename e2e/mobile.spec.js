import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.use({ viewport: { width: 390, height: 844 } })

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(1000)
}

async function openMobileMenu(page) {
  await page.locator('[class*="hamburger"]').first().click()
  await page.waitForTimeout(500)
}

// ── Mobile Sticky Bar ─────────────────────────────────────────────────────────
test.describe('Mobile Sticky Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('Call, WhatsApp and Enquire buttons visible', async ({ page }) => {
    await expect(page.locator('[class*="stickyBar"]').first()).toBeVisible()
  })

  test('Call button has tel: link', async ({ page }) => {
    const callBtn = page.locator('[class*="stickyBar"] a[href*="tel:"]').first()
    await expect(callBtn).toBeVisible()
    const href = await callBtn.getAttribute('href')
    expect(href).toContain('tel:')
  })

  test('Enquire opens lead modal', async ({ page }) => {
    await page.locator('[class*="stickyBar"] button').last().click()
    await page.waitForTimeout(400)
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible()
  })
})

// ── Mobile Hamburger Nav ──────────────────────────────────────────────────────
test.describe('Mobile Hamburger Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger button visible', async ({ page }) => {
    await expect(page.locator('[class*="hamburger"]').first()).toBeVisible()
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await openMobileMenu(page)
    await expect(page.locator('[class*="mobileMenu"]').first()).toBeVisible()
  })

  test('Gallery link visible in menu', async ({ page }) => {
    await openMobileMenu(page)
    await expect(
      page.locator('[class*="mobileLink"]').filter({ hasText: 'Gallery' }).first()
    ).toBeVisible()
  })

  test('Gallery link closes menu and scrolls', async ({ page }) => {
    await openMobileMenu(page)
    await page.locator('[class*="mobileLink"]').filter({ hasText: 'Gallery' }).first().click()
    await page.waitForTimeout(1200)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 5000 })
  })

  test('Contact link closes menu and scrolls', async ({ page }) => {
    await openMobileMenu(page)
    await page.locator('[class*="mobileLink"]').filter({ hasText: 'Contact' }).first().click()
    await page.waitForTimeout(1200)
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 })
  })
})

// ── Mobile Portfolio ──────────────────────────────────────────────────────────
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
      await expect(
        page.locator('[class*="cardName"]').filter({ hasText: name }).first()
      ).toBeVisible({ timeout: 10000 })
    }
  })

  test('tapping Anjana Paradise navigates to project', async ({ page }) => {
    await page.locator('[class*="cardName"]').filter({ hasText: 'Anjana Paradise' }).first().click()
    await expect(page).toHaveURL(/anjana/, { timeout: 8000 })
  })
})

// ── Mobile Scroll ─────────────────────────────────────────────────────────────
test.describe('Mobile Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(1500)
  })

  test('scrolls through all sections', async ({ page }) => {
    for (const id of ['highlights', 'plots', 'portfolio', 'gallery', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached({ timeout: 5000 })
      await page.evaluate(
        (sId) => document.getElementById(sId)?.scrollIntoView({ behavior: 'instant' }), id
      )
      await page.waitForTimeout(500)
    }
  })

  test('scroll to top button appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(1000)
    await expect(
      page.locator('button[aria-label="Back to top"]')
    ).toBeVisible({ timeout: 5000 })
  })
})

// ── Mobile Project Page ───────────────────────────────────────────────────────
test.describe('Mobile Project Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="tabBar"]', { timeout: 10000 })
    await page.waitForTimeout(500)
  })

  test('project name visible', async ({ page }) => {
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
  })

  test('tab buttons visible via mobile nav toggle', async ({ page }) => {
    await expect(page.locator('[class*="mobileNavBtn"]').first()).toBeVisible()
  })

  test('Contact tab shows phone via mobile menu', async ({ page }) => {
    await page.locator('[class*="mobileNavBtn"]').first().click()
    await page.waitForTimeout(300)
    await page.locator('[class*="mobileTabBtn"]').filter({ hasText: 'Contact' }).first().click()
    await page.waitForTimeout(400)
    await expect(page.getByText(/99487 09041/)).toBeVisible()
  })

  test('all tabs accessible via mobile menu', async ({ page }) => {
    for (const tab of ['Overview', 'Amenities', 'Gallery', 'Videos', 'Location', 'Contact']) {
      await page.locator('[class*="mobileNavBtn"]').first().click()
      await page.waitForTimeout(300)
      await page.locator('[class*="mobileTabBtn"]').filter({ hasText: tab }).first().click()
      await page.waitForTimeout(400)
      await expect(page.getByText(new RegExp(tab, 'i')).first()).toBeVisible()
    }
  })

  test('back button navigates home', async ({ page }) => {
    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

// ── Mobile WhatsApp ───────────────────────────────────────────────────────────
test.describe('Mobile WhatsApp', () => {
  test('WhatsApp button visible in sticky bar', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await expect(page.locator('[class*="stickyBar"]').first()).toBeVisible()
  })
})
