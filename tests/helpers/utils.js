/**
 * Shared test helpers for Chaturbhuja automation suite
 */

export async function switchToTelugu(page) {
  const toggle = page.locator('[class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent().catch(() => '')
  if (text.includes('EN')) await toggle.click()
  await page.waitForTimeout(600)
}

export async function switchToEnglish(page) {
  const toggle = page.locator('[class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent().catch(() => '')
  if (text.includes('తె')) await toggle.click()
  await page.waitForTimeout(600)
}

export async function openModal(page, type = 'enquiry') {
  const selectors = {
    enquiry:   'button:has-text("View Available Plots"), button:has-text("Enquire Now"), button:has-text("అందుబాటు")',
    siteVisit: 'button:has-text("Book Site Visit"), button:has-text("సైట్ విజిట్")',
    brochure:  'button:has-text("Get Brochure"), button:has-text("పాంఫ్లెట్")',
  }
  await page.locator(selectors[type] || selectors.enquiry).first().click()
  await page.waitForTimeout(400)
}

export const TELUGU_RE = /[\u0C00-\u0C7F]/

export const PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise', loc: 'Paritala',     teLoc: 'పారిటాల' },
  { id: 'aparna',  name: 'Aparna Legacy',   loc: 'Chevitikallu', teLoc: 'చెవిటికల్లు' },
  { id: 'varaha',  name: 'Varaha Virtue',   loc: 'Pamarru',      teLoc: 'పామర్రు' },
  { id: 'trimbak', name: 'Trimbak Oaks',    loc: 'Penamaluru',   teLoc: 'పేనమలూరు' },
]
