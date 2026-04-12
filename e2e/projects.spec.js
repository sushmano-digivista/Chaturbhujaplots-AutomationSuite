import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise', loc: 'Paritala'    },
  { id: 'aparna',  name: 'Aparna Legacy',   loc: 'Chevitikallu'},
  { id: 'varaha',  name: 'Varaha Virtue',   loc: 'Pamarru'     },
  { id: 'trimbak', name: 'Trimbak Oaks',    loc: 'Penamaluru'  },
]

// Skip overlay & loader for all tests
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__chaturbhuja_loaded = true
    sessionStorage.setItem('launch_overlay_shown', '1')
    sessionStorage.setItem('home_loader_shown', '1')
  })
})

async function goTo(page, id) {
  await page.goto(`${BASE}/project/${id}`)
  // On mobile tabBar is display:none — wait for mobileNavBtn
  // On desktop wait for tabBar
  const isMobile = page.viewportSize()?.width < 768
  const selector  = isMobile ? '[class*="mobileNavBtn"]' : '[class*="tabBar"]'
  await page.waitForSelector(selector, { timeout: 20000 })
  await page.waitForTimeout(500)
}

async function clickTab(page, tabLabel) {
  const isMobile = page.viewportSize()?.width < 768
  if (isMobile) {
    // Open mobile nav dropdown
    await page.locator('[class*="mobileNavBtn"]').first().click()
    await page.waitForTimeout(400)
    // Scroll tab into view (dropdown might be long)
    const tabBtn = page.locator('[class*="mobileTabBtn"]').filter({ hasText: tabLabel }).first()
    await tabBtn.scrollIntoViewIfNeeded()
    await tabBtn.click()
  } else {
    const btn = page.locator('[class*="tabBtn"]').filter({ hasText: tabLabel }).first()
    await btn.scrollIntoViewIfNeeded()
    await btn.click()
  }
  await page.waitForTimeout(500)
}

// ── 1. All Project Pages Load ─────────────────────────────────────────────────
test.describe('Project Pages Load', () => {
  for (const p of PROJECTS) {
    test(`${p.name} loads and shows name`, async ({ page }) => {
      await goTo(page, p.id)
      await expect(page.getByText(p.name).first()).toBeVisible()
    })

    test(`${p.name} shows location`, async ({ page }) => {
      await goTo(page, p.id)
      await expect(page.getByText(new RegExp(p.loc, 'i')).first()).toBeVisible()
    })
  }
})

// ── 2. Tab Navigation ─────────────────────────────────────────────────────────
test.describe('Project Tab Navigation', () => {
  test.beforeEach(async ({ page }) => { await goTo(page, 'anjana') })

  const TAB_VERIFY = {
    'Overview':  '[class*="tabContent"]:visible, [class*="facingCard"]:visible, [class*="PricingCard"]:visible',
    'Amenities': '[class*="tabContent"]:visible',
    'Gallery':   '[class*="tabContent"]:visible',
    'Videos':    '[class*="tabContent"]:visible',
    'Location':  '[class*="mapWrap"], [class*="iframe"], iframe',
    'Contact':   '[class*="contactGrid"], [class*="contactInfo"], button[aria-label*="WhatsApp"]',
  }
  for (const tab of ['Overview', 'Amenities', 'Gallery', 'Videos', 'Location', 'Contact']) {
    test(`${tab} tab opens`, async ({ page }) => {
      await clickTab(page, tab)
      await page.waitForTimeout(1500)
      // Use tab-specific visible content check
      const selector = TAB_VERIFY[tab]
      const el = page.locator(selector).first()
      await expect(el).toBeVisible({ timeout: 12000 })
    })
  }
})

// ── 3. Contact Tab Values from MongoDB ────────────────────────────────────────
test.describe('Contact Tab — MongoDB Values', () => {
  test('Anjana Paradise has correct phone', async ({ page }) => {
    await goTo(page, 'anjana')
    await clickTab(page, 'Contact')
    await expect(page.getByText(/99487 09041/)).toBeVisible()
  })

  test('Aparna Legacy address has Gateway of Amaravati', async ({ page }) => {
    await goTo(page, 'aparna')
    await clickTab(page, 'Contact')
    await page.waitForTimeout(3000)
    const addressRow = page.locator('[class*="contactRow"]').filter({ hasText: /Gateway of Amaravati/i }).first()
    await expect(addressRow).toBeVisible({ timeout: 8000 })
  })

  test('all projects show WhatsApp Chat button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await clickTab(page, 'Contact')
      await expect(
        page.locator('button[aria-label*="WhatsApp"], button[title*="WhatsApp"]').first()
      ).toBeVisible({ timeout: 8000 })
    }
  })

  test('all projects show Request Callback button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await clickTab(page, 'Contact')
      await expect(page.getByRole('button', { name: /Request Callback/i })).toBeVisible()
    }
  })

  test('all projects show Schedule Site Visit button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await clickTab(page, 'Contact')
      await expect(page.getByRole('button', { name: /Schedule Site Visit/i })).toBeVisible()
    }
  })
})

// ── 4. Trimbak Oaks — New Launch (Phase I + II) ──────────────────────────────
test.describe('Trimbak Oaks — New Launch', () => {
  test('shows pricing in Overview', async ({ page }) => {
    await goTo(page, 'trimbak')
    await clickTab(page, 'Overview')
    await expect(page.getByText(/28,999|28,499|Phase/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('Get Plot Details button visible', async ({ page }) => {
    await goTo(page, 'trimbak')
    await clickTab(page, 'Overview')
    const btn = page.getByRole('button', { name: /Get Detailed|Interested|ప్లాట్|Plot Information/i })
    await btn.scrollIntoViewIfNeeded()
    await expect(btn).toBeVisible({ timeout: 10000 })
  })
})

// ── 5. Enquire Now Modal ──────────────────────────────────────────────────────
test.describe('Enquire Now Modal', () => {
  test('opens on project page', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await expect(page.locator('[class*="overlay"]').first()).toBeVisible()
  })
})

// ── 6. Back Navigation ────────────────────────────────────────────────────────
test.describe('Back Navigation', () => {
  test('Back button returns to homepage', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

// ── 7. Location Tab ───────────────────────────────────────────────────────────
test.describe('Location Tab', () => {
  test('map iframe loads for Anjana Paradise', async ({ page }) => {
    await goTo(page, 'anjana')
    await clickTab(page, 'Location')
    await expect(page.locator('iframe').first()).toBeVisible({ timeout: 8000 })
  })

  test('Open in Google Maps button visible', async ({ page }) => {
    await goTo(page, 'anjana')
    await clickTab(page, 'Location')
    await expect(
      page.locator('button:has-text("Open in Maps"), button:has-text("Get Directions"), button:has-text("దారి వివరాలు"), button:has-text("మాప్స్లో")').first()
    ).toBeVisible({ timeout: 8000 })
  })
})

// ── 8. Amenities Tab ──────────────────────────────────────────────────────────
test.describe('Amenities Tab', () => {
  test('Infrastructure tab shows amenities', async ({ page }) => {
    await goTo(page, 'anjana')
    await clickTab(page, 'Amenities')
    await expect(page.locator('[class*="amGrid"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('Lifestyle tab works', async ({ page }) => {
    await goTo(page, 'anjana')
    await clickTab(page, 'Amenities')
    await page.locator('[class*="amTab"]').filter({ hasText: /Lifestyle/i }).first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('[class*="amGrid"]').first()).toBeVisible()
  })
})
