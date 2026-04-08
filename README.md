# Chaturbhuja Properties & Infra — Automation Test Suite

E2E and unit tests for [chaturbhujaplots.in](https://www.chaturbhujaplots.in)  
Built with [Playwright](https://playwright.dev)

---

## Setup

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

### Against localhost (default)
```bash
# Terminal 1 — Start the app
cd ../Chaturbhujaplots-SalesTool-FE-Customer
npm run dev

# Terminal 2 — Run all E2E tests
npm test

# Run specific suite
npm run test:en       # Suite 2 — English Mode
npm run test:te       # Suite 3 — Telugu Mode
npm run test:project  # Suite 4 — Project Pages
npm run test:modal    # Suite 6 — Lead Modal
npm run test:mobile   # Suite 9 — Mobile (iPhone 14)
```

### Against Production
```bash
TARGET_URL=https://www.chaturbhujaplots.in npm test
```

### Headed mode (see the browser)
```bash
npm run test:headed
```

### HTML Report
```bash
npm run test:report
```

---

## i18n Unit Test (Telugu completeness)
```bash
FE_PATH=../Chaturbhujaplots-SalesTool-FE-Customer npm run i18n
```

---

## Test Suites

| Suite | File | Tests | Coverage |
|-------|------|-------|----------|
| 1 | 01-page-load.spec.js | 8 | HTTP status, title, navbar, 404 |
| 2 | 02-english-mode.spec.js | 11 | All sections in EN |
| 3 | 03-telugu-mode.spec.js | 10 | i18n, Telugu text, no raw keys |
| 4 | 04-project-pages.spec.js | 14 | All 4 projects, tabs, pricing |
| 5 | 05-navigation.spec.js | 6 | Dropdown, routing, close |
| 6 | 06-lead-modal.spec.js | 10 | Open, validate, Telugu mode |
| 7 | 07-sections.spec.js | 8 | Amenities, Location, Plots |
| 8 | 08-seo-performance.spec.js | 8 | Meta, OG, sitemap, robots |
| 9 | 09-mobile.spec.js | 7 | iPhone 14 responsive |
| 10 | 10-contact.spec.js | 6 | Contact form, WhatsApp |
| Unit | i18n.telugu.test.cjs | 921 | All translation keys EN+TE |

**Total: 88 E2E tests + 921 i18n assertions**

---

## Project Structure

```
├── playwright.config.js
├── package.json
├── tests/
│   ├── e2e/
│   │   ├── 01-page-load.spec.js
│   │   ├── 02-english-mode.spec.js
│   │   ├── 03-telugu-mode.spec.js
│   │   ├── 04-project-pages.spec.js
│   │   ├── 05-navigation.spec.js
│   │   ├── 06-lead-modal.spec.js
│   │   ├── 07-sections.spec.js
│   │   ├── 08-seo-performance.spec.js
│   │   ├── 09-mobile.spec.js
│   │   └── 10-contact.spec.js
│   ├── helpers/
│   │   └── utils.js
│   └── unit/
│       └── i18n.telugu.test.cjs
└── README.md
```
