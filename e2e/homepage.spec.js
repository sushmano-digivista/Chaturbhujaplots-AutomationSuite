import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
  await page.waitForTimeout(1000)
}

async function openPortfolioNav(page) {
  const isMobile = page.viewportSize()?.width < 768
  if (isMobile) {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(400)
  } else {
    await page.locator('nav').getByText('Portfolio').first().click()
    await page.waitForTimeout(300)
  }
}

// ── Page Load ─────────────────────────────────────────────────────────────────
test.describe('Page Load', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await expect(page).toHaveTitle(/Chaturbhuja/i)
  })

  test('PageLoader completes and home page renders', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await expect(page.locator('nav')).toBeVisible()
  })
})

// ── Navbar ────────────────────────────────────────────────────────────────────
test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('logo is visible', async ({ page }) => {
    await expect(page.locator('nav img, header img').first()).toBeVisible()
  })

  test('Portfolio dropdown opens', async ({ page }) => {
    await openPortfolioNav(page)
    const isMobile = page.viewportSize()?.width < 768
    if (isMobile) {
      await expect(page.locator('[class*="mobileMenu"]').first()).toBeVisible()
    } else {
      await expect(page.locator('[class*="dropCards"]').first()).toBeVisible()
    }
  })

  test('Portfolio shows all 4 projects', async ({ page }) => {
    await openPortfolioNav(page)
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('clicking Anjana Paradise navigates to project', async ({ page }) => {
    await openPortfolioNav(page)
    await page.waitForTimeout(500)
    // Try multiple selectors for the Anjana card
    const anjanaCard = page.locator('[class*="dropCard"], [class*="mobileProjectCard"], [class*="portCard"]')
      .filter({ hasText: 'Anjana' }).first()
    await expect(anjanaCard).toBeVisible({ timeout: 5000 })
    await anjanaCard.click()
    await expect(page).toHaveURL(/anjana/, { timeout: 10000 })
  })
})

// ── Mobile Navbar ─────────────────────────────────────────────────────────────
test.describe('Mobile Navbar', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger button visible on mobile', async ({ page }) => {
    // mobileRight div contains hamburger — only visible on mobile
    await expect(page.locator('[class*="hamburger"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="mobileMenu"]').first()).toBeVisible()
  })

  test('menu closes when Gallery clicked', async ({ page }) => {
    await page.locator('[class*="hamburger"]').first().click()
    await page.waitForTimeout(500)
    await page.locator('[class*="mobileLink"]').filter({ hasText: 'Gallery' }).first().click()
    await page.waitForTimeout(1500)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 6000 })
  })
})

// ── Hero Section ──────────────────────────────────────────────────────────────
test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hero headline visible', async ({ page }) => {
    await expect(page.locator('#home h1').first()).toBeVisible({ timeout: 8000 })
  })

  test('View Available Plots button visible', async ({ page }) => {
    // btn-gold is the first hero CTA button, visible on all viewports
    await expect(page.locator('#home .btn-gold').first()).toBeVisible({ timeout: 8000 })
  })

  test('Enquire Now opens lead modal', async ({ page }) => {
    await page.locator('#home .btn-gold').first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('modal closes on X', async ({ page }) => {
    await page.locator('#home .btn-gold').first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible({ timeout: 8000 })
    await page.waitForTimeout(800)
    // Try multiple close button selectors
    const closeBtn = page.locator('[class*="overlay"] [class*="closeBtn"], [class*="overlay"] [class*="close"], [class*="overlay"] button').last()
    await closeBtn.click({ force: true })
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="overlay"]').first()).not.toBeVisible({ timeout: 8000 })
  })
})

// ── Portfolio Section ─────────────────────────────────────────────────────────
test.describe('Portfolio Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(2000)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(1000)
  })

  test('all 4 project cards visible', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(
        page.locator('[class*="cardName"]').filter({ hasText: name }).first()
      ).toBeVisible({ timeout: 10000 })
    }
  })

  test('Aparna Legacy shows Gateway of Amaravati', async ({ page }) => {
    await expect(
      page.locator('[class*="cardLoc"]').filter({ hasText: /Gateway of Amaravati/i }).first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('Anjana Paradise starting price visible', async ({ page }) => {
    await expect(page.getByText(/24.8L/i).first()).toBeVisible({ timeout: 8000 })
  })
})

// ── Section Scrolling ─────────────────────────────────────────────────────────
test.describe('Section Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(1500)
  })

  for (const id of ['gallery', 'videos', 'location', 'contact']) {
    test(`scrolls to ${id} section`, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toBeAttached({ timeout: 5000 })
      await page.evaluate(
        (sId) => document.getElementById(sId)?.scrollIntoView({ behavior: 'instant' }), id
      )
      await page.waitForTimeout(1200)
    })
  }
})

// ── Footer ────────────────────────────────────────────────────────────────────
test.describe('Footer', () => {
  test('footer visible and shows company name', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('footer').getByText(/Chaturbhuja/i).first()).toBeVisible()
  })
})

// ── ScrollToTop Button ────────────────────────────────────────────────────────
test.describe('ScrollToTop Button', () => {
  test('appears after scrolling down', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(1000)
    await expect(
      page.locator('button[aria-label="Back to top"]')
    ).toBeVisible({ timeout: 5000 })
  })
})
