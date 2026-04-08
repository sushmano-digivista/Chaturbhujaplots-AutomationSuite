// Run: FE_PATH=../Chaturbhujaplots-SalesTool-FE-Customer node tests/unit/i18n.telugu.test.cjs
#!/usr/bin/env node
/**
 * Chaturbhuja Properties — Telugu i18n Completeness Test Suite
 * Tests all 130+ translation keys used across every component.
 *
 * Usage: node src/tests/i18n.telugu.test.cjs
 */
const fs   = require('fs')
const path = require('path')

// ── Parse LanguageContext fallback data ───────────────────────────────────────
const raw = fs.readFileSync(
  process.env.FE_PATH ? path.join(process.env.FE_PATH, 'src/context/LanguageContext.jsx') : path.join(__dirname, '../../node_modules/.cache/langctx.jsx'), 'utf8'
)
// Decode \uXXXX sequences
const decoded = raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
  String.fromCharCode(parseInt(h, 16))
)

function flatten(text, prefix, out = {}) {
  let i = 0
  while (i < text.length) {
    i += text.slice(i).match(/^[\s,]*/)[0].length
    if (i >= text.length || text[i] === '}') break
    const km = text.slice(i).match(/^['"]?([a-zA-Z0-9_]+)['"]?\s*:/)
    if (!km) { i++; continue }
    const key = km[1]; i += km[0].length
    i += text.slice(i).match(/^\s*/)[0].length
    const full = prefix ? `${prefix}.${key}` : key
    if (text[i] === '{') {
      let d = 1, j = i + 1
      while (j < text.length && d) {
        if (text[j] === '{') d++; else if (text[j] === '}') d--; j++
      }
      flatten(text.slice(i + 1, j - 1), full, out); i = j
    } else if (text[i] === "'" || text[i] === '"') {
      const dl = text[i]; let j = i + 1; const chars = []
      while (j < text.length) {
        if (text[j] === '\\' && j + 1 < text.length) { chars.push(text[j+1]); j += 2 }
        else if (text[j] === dl) break
        else { chars.push(text[j]); j++ }
      }
      out[full] = chars.join(''); i = j + 1
    } else if (text[i] === '[') {
      let d = 1, j = i + 1
      while (j < text.length && d) {
        if (text[j] === '[') d++; else if (text[j] === ']') d--; j++
      }
      out[full] = '[array]'; i = j
    } else i++
  }
  return out
}

const enStart = decoded.indexOf('  en: {')
const teStart = decoded.indexOf('  te: {', enStart + 100)
const fbEnd   = decoded.indexOf('\nexport function LanguageProvider')

const rawEn = flatten(decoded.slice(enStart, teStart))
const rawTe = flatten(decoded.slice(teStart, fbEnd))

// Strip lang prefix (en.en.x → en.x)
const EN = Object.fromEntries(Object.entries(rawEn).map(([k, v]) => [k.replace(/^en\./, ''), v]))
const TE = Object.fromEntries(Object.entries(rawTe).map(([k, v]) => [k.replace(/^te\./, ''), v]))

const resolve = (obj, key) => obj[key]

// ── All keys used in the app ──────────────────────────────────────────────────
const ALL_KEYS = [
  // Navigation
  'nav.portfolio','nav.gallery','nav.videos','nav.amenities','nav.location',
  'nav.contact','nav.enquireNow','nav.openForBooking','nav.completedSoldOut',
  'nav.viewAllProjects','nav.ourPortfolio','nav.projectsSettled',
  // Hero
  'hero.enquireCta','hero.brochureCta','hero.siteVisitCta','hero.directorTitle',
  'hero.scrollDown','hero.watchVideo','hero.trustedBy',
  // Sections
  'sections.highlights','sections.highlightsSub','sections.whyChaturbhuja',
  'sections.amenities','sections.amenitiesSub','sections.whatWeOffer',
  'sections.findUs','sections.locationTitle','sections.locationEm',
  'sections.locationSub','sections.openInMaps','sections.investmentOpportunity',
  'sections.plotCategories','sections.explorePlots','sections.availablePlots',
  'sections.byPlotSize','sections.eastFacing','sections.westFacing',
  'sections.cornerPlots','sections.eastFacingDesc','sections.westFacingDesc',
  'sections.cornerPlotsDesc','sections.hidePricing','sections.viewPricing',
  'sections.contactForPricing','sections.contactUs',
  'sections.plotsComingSoon','sections.plotsAcross',
  // Quote
  'quote.ctaBook','quote.expectedReturn','quote.yearsHorizon','quote.crdaRera',
  // Project page
  'project.tabs.home','project.tabs.overview','project.plotPricing',
  'project.perSqYard','project.dev','project.cornerCharges','project.corpusFund',
  'project.featured','project.cornerNE','project.cornerOther','project.priceRange',
  'project.eastShort','project.westShort','project.sqYdFull','project.extra',
  // Projects locShort
  'projects.anjana.loc','projects.anjana.locShort',
  'projects.aparna.loc','projects.aparna.locShort',
  'projects.varaha.loc','projects.varaha.locShort',
  'projects.trimbak.loc','projects.trimbak.locShort',
  // Facings, tags, approvals
  'facings.east','facings.west','facings.north','facings.south','facings.corner',
  'tags.featured','tags.upcoming','tags.limited','tags.hot',
  'approvals.crdaProposed','approvals.apReraRegistered','approvals.clearTitle',
  'approvals.vastuCompliant','approvals.crdaApproved','approvals.reraRegistered',
  // Amenities
  'amenities.infra','amenities.lifestyle','amenities.utilities',
  'amenityLabels.grandEntrance','amenityLabels.btRoads','amenityLabels.ccRoads',
  'amenityLabels.drainageSystem','amenityLabels.modernPark','amenityLabels.walkingTrack',
  'amenityLabels.pureWater','amenityLabels.childrensPlayArea','amenityLabels.visitorParking',
  'amenityLabels.compoundWall','amenityLabels.designedLED','amenityLabels.roads60ft40ft',
  'amenityLabels.undergroundElec','amenityLabels.avenuePlain','amenityLabels.gatedSecurity',
  // Location labels
  'locationLabels.amaravatiCapital','locationLabels.amaravatiCapitalSub',
  'locationLabels.nh16Highway','locationLabels.nh16Sub',
  'locationLabels.engineeringColleges','locationLabels.vijayawadaAirport',
  'locationLabels.airConnectivity','locationLabels.belCompany',
  'locationLabels.bandarPort','locationLabels.healthcareHub',
  'locationLabels.vijayawadaCentre','locationLabels.nh65Highway',
  // Highlights
  'highlights.nearnationalhighway','highlights.nearnationalhighwayDesc',
  'highlights.8kmfromamaravati','highlights.8kmfromamaravatiDesc',
  'highlights.roadrailconnectivity','highlights.roadrailconnectivityDesc',
  'highlights.logistichubparitala','highlights.logistichubparitalaDesc',
  'highlights.educationalmedical','highlights.educationalmedicalDesc',
  'highlights.mulapadustadium','highlights.mulapadustadiumDesc',
  // Modal
  'modal.projectInterest','modal.requiredForDownload','modal.selectProject',
  'modal.selectProjectOptional','modal.plotInterest','modal.selectPreference',
  'modal.anyNotSure','modal.siteVisitTitle','modal.callbackTitle',
  'modal.enquiryTitle','modal.brochureTitle','modal.submit','modal.close',
  'modal.successMessage','modal.scheduleVisit','modal.sendBrochure',
  'modal.requestCallback','modal.other',
  // Contact
  'contact.callUs','contact.writeUs','contact.sendMessage','contact.sendWhatsApp',
  'contact.getDirections','contact.namePlaceholder','contact.phonePlaceholder',
  // Portfolio
  'portfolio.backHome','portfolio.comingSoon','portfolio.notifyMe',
  'portfolio.viewProject','portfolio.getDetails','portfolio.openForBooking',
  'portfolio.projectStatus','portfolio.keyHighlights',
  // Urgency
  'urgency.barOpenLabel','urgency.projectsOpen','urgency.plotsClosing',
  'urgency.families','urgency.lockInRates','urgency.exploreCta',
  // Common + footer
  'common.loading','common.yearsOfTrust',
  'footer.tagline','footer.rights','footer.quickLinks',
]

const TELUGU_RE    = /[\u0C00-\u0C7F]/
const ENGLISH_OK   = new Set(['quote.crdaRera','amenityLabels.btRoads',
  'amenityLabels.ccRoads','amenityLabels.cctvSurveillance'])
const SKIP_DIFF    = new Set(['quote.crdaRera'])

let passed = 0, failed = 0, failures = []
const pass = () => { passed++ }
const fail = (msg) => { failed++; failures.push('  ✗ ' + msg) }
const check = (ok, msg) => ok ? pass() : fail(msg)

// ── Suite 1: EN — all keys defined ──────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════')
console.log(' Chaturbhuja i18n Test Suite — Telugu Translation Review')
console.log('══════════════════════════════════════════════════════════\n')
console.log('Suite 1: EN — all keys defined and non-empty')
ALL_KEYS.forEach(k => {
  const v = resolve(EN, k)
  check(v !== undefined && String(v).trim().length > 0, `EN["${k}"] missing (got: ${v})`)
})

// ── Suite 2: TE — all keys defined ──────────────────────────────────────────
console.log('Suite 2: TE — all keys defined and non-empty')
ALL_KEYS.forEach(k => {
  const v = resolve(TE, k)
  check(v !== undefined && String(v).trim().length > 0, `TE["${k}"] missing (got: ${v})`)
})

// ── Suite 3: TE key does not equal itself ────────────────────────────────────
console.log('Suite 3: TE — value is not the raw key string')
ALL_KEYS.forEach(k => {
  const v = resolve(TE, k)
  check(v !== undefined && String(v) !== k, `TE["${k}"] returns key string itself`)
})

// ── Suite 4: TE values contain Telugu characters ─────────────────────────────
console.log('Suite 4: TE — values contain Telugu script')
ALL_KEYS.filter(k => !ENGLISH_OK.has(k)).forEach(k => {
  const v = resolve(TE, k)
  if (!v || v === '[array]') { pass(); return }
  // Allow codes: all-caps, numbers, symbols, emojis
  const isCode = /^[A-Z0-9\-+.\s&/—–%]+$/.test(String(v).replace(/[₹×✓◣▲▼☀🌙️✅🔜\uFE0F]/g,''))
  if (isCode) { pass(); return }
  check(TELUGU_RE.test(String(v)), `TE["${k}"] has no Telugu chars: "${v}"`)
})

// ── Suite 5: EN ≠ TE ─────────────────────────────────────────────────────────
console.log('Suite 5: EN ≠ TE (translation actually different)')
ALL_KEYS.filter(k => !SKIP_DIFF.has(k)).forEach(k => {
  const en = resolve(EN, k); const te = resolve(TE, k)
  if (en && te && en !== '[array]' && te !== '[array]')
    check(en !== te, `EN["${k}"] == TE (not translated): "${en}"`)
  else pass()
})

// ── Suite 6: 4 projects × locShort in TE ─────────────────────────────────────
console.log('Suite 6: All 4 projects have locShort in Telugu')
;['anjana','aparna','varaha','trimbak'].forEach(id => {
  const v = resolve(TE, `projects.${id}.locShort`)
  check(v && TELUGU_RE.test(String(v)),
    `projects.${id}.locShort missing or not Telugu: "${v}"`)
})

// ── Suite 7: Highlight cards ─────────────────────────────────────────────────
console.log('Suite 7: All 6 highlight cards have title+desc in TE')
;['nearnationalhighway','8kmfromamaravati','roadrailconnectivity',
  'logistichubparitala','educationalmedical','mulapadustadium'].forEach(slug => {
  const t = resolve(TE, `highlights.${slug}`)
  const d = resolve(TE, `highlights.${slug}Desc`)
  check(t && TELUGU_RE.test(t), `highlights.${slug} title missing/not Telugu`)
  check(d && TELUGU_RE.test(d), `highlights.${slug}Desc missing/not Telugu`)
})

// ── Suite 8: Pricing keys ────────────────────────────────────────────────────
console.log('Suite 8: All pricing keys exist in EN+TE')
;['project.plotPricing','project.perSqYard','project.dev','project.cornerCharges',
  'project.corpusFund','project.cornerNE','project.cornerOther',
  'project.priceRange','project.eastShort','project.westShort','project.sqYdFull'
].forEach(k => {
  check(!!resolve(EN, k), `EN["${k}"] missing`)
  check(!!resolve(TE, k), `TE["${k}"] missing`)
})

// ── Suite 9: Modal fields ────────────────────────────────────────────────────
console.log('Suite 9: All modal fields exist in TE')
;['modal.projectInterest','modal.plotInterest','modal.selectProject',
  'modal.selectPreference','modal.submit','modal.close',
  'modal.siteVisitTitle','modal.enquiryTitle'].forEach(k => {
  const v = resolve(TE, k)
  check(v && TELUGU_RE.test(String(v)), `TE["${k}"] missing or not Telugu: "${v}"`)
})

// ── Suite 10: Location switcher shorts ───────────────────────────────────────
console.log('Suite 10: Location section short names in Telugu')
;['anjana','aparna','varaha','trimbak'].forEach(id => {
  const v = resolve(TE, `projects.${id}.locShort`)
  check(v && TELUGU_RE.test(String(v)),
    `projects.${id}.locShort not Telugu: "${v}"`)
})

// ── Results ───────────────────────────────────────────────────────────────────
const total = passed + failed
console.log('\n══════════════════════════════════════════════════════════')
console.log(` RESULTS: ${passed}/${total} passed   |   ${failed} failed`)
console.log('══════════════════════════════════════════════════════════')
if (failures.length) {
  console.log('\n❌ Failed tests:')
  failures.slice(0, 40).forEach(f => console.log(f))
  if (failures.length > 40) console.log(`  ... and ${failures.length - 40} more`)
  console.log('\n👉 Run the master Compass DB script to fix missing DB keys.')
  process.exit(1)
} else {
  console.log('\n✅ All i18n tests passed! Telugu translation is complete.')
}
