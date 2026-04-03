# Chaturbhuja Plots — Automation Test Suite

E2E automation suite for [chaturbhujaplots.in](https://chaturbhujaplots.in) using Playwright.

## Setup

```bash
# Install dependencies
npm install

# Install browsers (one time only)
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Run interactive UI mode
npm run test:ui

# Run only mobile tests
npm run test:mobile

# View HTML report
npm run test:report
```

## Test Coverage

| File | Coverage |
|------|----------|
| `homepage.spec.js` | Page load, Navbar, Portfolio, Scrolling, Lead Modal, Footer |
| `projects.spec.js` | All 4 project pages, Tabs, Contact values, WhatsApp links |
| `mobile.spec.js` | Sticky bar, Mobile nav, Scroll behaviour, Project tabs |

## Pre-requisites

- FE-Customer dev server must be running on `localhost:3000`
- Run `npm run dev` in `Chaturbhujaplots-SalesTool-FE-Customer` first
