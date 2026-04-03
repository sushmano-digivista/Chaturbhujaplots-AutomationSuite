import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise', loc: 'Paritala'    },
  { id: 'aparna',  name: 'Aparna Legacy',   loc: 'Chevitikallu'},
  { id: 'varaha',  name: 'Varaha Virtue',   loc: 'Pamarru'     },
  { id: 'trimbak', name: 'Trimbak Oaks',    loc: 'Penamaluru'  },
]

async function goTo(page, id) {
  await page.goto(`${BASE}/project/${id}`)
  await page.waitForSelector('[class*="tabBar"], [class*="header"]', { timeout: 10000 })
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

  for (const tab of ['Overview', 'Amenities', 'Gallery', 'Videos', 'Location', 'Contact']) {
    test(`${tab} tab opens`, async ({ page }) => {
      await page.getByRole('button', { name: tab }).click()
      await page.waitForTimeout(300)
      await expect(page.getByText(new RegExp(tab, 'i')).first()).toBeVisible()
    })
  }
})

// ── 3. Contact Tab Values from MongoDB ────────────────────────────────────────
test.describe('Contact Tab — MongoDB Values', () => {
  test('Anjana Paradise has correct phone', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: 'Contact' }).click()
    await expect(page.getByText(/99487 09041/)).toBeVisible()
  })

  test('Aparna Legacy address has Gateway of Amaravati', async ({ page }) => {
    await goTo(page, 'aparna')
    await page.getByRole('button', { name: 'Contact' }).click()
    // Poll every second until address appears (MongoDB settings can take up to 5s)
    await expect(async () => {
      await expect(page.getByText(/Gateway of Amaravati/i)).toBeVisible()
    }).toPass({ timeout: 15000, intervals: [1000, 2000, 3000] })
  })

  test('all projects show WhatsApp Chat button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await page.getByRole('button', { name: 'Contact' }).click()
      await expect(page.getByText(/WhatsApp Chat/i)).toBeVisible()
    }
  })

  test('all projects show Request Callback button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await page.getByRole('button', { name: 'Contact' }).click()
      await expect(page.getByRole('button', { name: /Request Callback/i })).toBeVisible()
    }
  })

  test('all projects show Schedule Site Visit button', async ({ page }) => {
    for (const p of PROJECTS) {
      await goTo(page, p.id)
      await page.getByRole('button', { name: 'Contact' }).click()
      await expect(page.getByRole('button', { name: /Schedule Site Visit/i })).toBeVisible()
    }
  })
})

// ── 4. Trimbak Oaks — Upcoming ────────────────────────────────────────────────
test.describe('Trimbak Oaks — Upcoming Project', () => {
  test('shows Coming Soon in Overview', async ({ page }) => {
    await goTo(page, 'trimbak')
    await page.getByRole('button', { name: 'Overview' }).click()
    await expect(page.getByText(/Coming Soon/i).first()).toBeVisible()
  })

  test('Notify Me button visible', async ({ page }) => {
    await goTo(page, 'trimbak')
    await page.getByRole('button', { name: 'Overview' }).click()
    await expect(page.getByRole('button', { name: /Notify Me/i })).toBeVisible()
  })
})

// ── 5. Enquire Now Modal ──────────────────────────────────────────────────────
test.describe('Enquire Now Modal', () => {
  test('opens on project page', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible()
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
    await page.getByRole('button', { name: 'Location' }).click()
    await expect(page.locator('iframe').first()).toBeVisible()
  })

  test('Open in Google Maps button visible', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: 'Location' }).click()
    await expect(page.getByRole('button', { name: /Open in Google Maps/i })).toBeVisible()
  })
})

// ── 8. Amenities Tab ──────────────────────────────────────────────────────────
test.describe('Amenities Tab', () => {
  test('Infrastructure tab shows amenities', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: 'Amenities' }).click()
    await expect(page.getByText(/Infrastructure/i)).toBeVisible()
  })

  test('Lifestyle tab works', async ({ page }) => {
    await goTo(page, 'anjana')
    await page.getByRole('button', { name: 'Amenities' }).click()
    await page.getByRole('button', { name: /Lifestyle/i }).click()
    await expect(page.getByText(/Vaastu/i).first()).toBeVisible()
  })
})
