import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
}

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

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('logo is visible', async ({ page }) => {
    await expect(page.locator('nav img, header img').first()).toBeVisible()
  })

  test('Portfolio dropdown opens', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
  })

  test('Portfolio shows all 4 projects', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.getByText(name).first()).toBeVisible()
    }
  })

  test('clicking Anjana Paradise navigates to project', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    await page.getByText('Anjana Paradise').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/)
  })
})

test.describe('Mobile Navbar', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger button visible on mobile', async ({ page }) => {
    await expect(page.locator('[class*="hamburger"]').first()).toBeVisible()
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
    await page.waitForTimeout(1200)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 5000 })
  })
})

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hero headline visible', async ({ page }) => {
    await expect(page.getByText(/Premium Plots/i).first()).toBeVisible()
  })

  test('View Available Plots button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /View Available Plots/i }).first()).toBeVisible()
  })

  test('Enquire Now opens lead modal', async ({ page }) => {
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible()
  })

  test('modal closes on X', async ({ page }) => {
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await page.locator('[class*="close"], [class*="Close"]').first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).not.toBeVisible({ timeout: 3000 })
  })
})

test.describe('Portfolio Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    // Wait for MongoDB data to load then scroll
    await page.waitForTimeout(2000)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(1000)
  })

  test('all 4 project cards visible', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.locator('[class*="cardName"]').filter({ hasText: name }).first()).toBeVisible({ timeout: 10000 })
    }
  })

  test('Aparna Legacy shows Gateway of Amaravati', async ({ page }) => {
    await expect(page.locator('[class*="cardLoc"]').filter({ hasText: /Gateway of Amaravati/i }).first()).toBeVisible({ timeout: 10000 })
  })

  test('Anjana Paradise starting price visible', async ({ page }) => {
    await expect(page.getByText(/24.8L/i).first()).toBeVisible({ timeout: 8000 })
  })
})

test.describe('Section Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(1500)
  })

  for (const id of ['gallery', 'videos', 'location', 'contact']) {
    test(`scrolls to ${id} section`, async ({ page }) => {
      await page.evaluate((sId) => document.getElementById(sId)?.scrollIntoView({ behavior: 'smooth' }), id)
      await page.waitForTimeout(1500)
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 8000 })
    })
  }
})

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

test.describe('ScrollToTop Button', () => {
  test('appears after scrolling down', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(1000)
    await expect(page.locator('button[aria-label="Back to top"]')).toBeVisible({ timeout: 5000 })
  })
})
