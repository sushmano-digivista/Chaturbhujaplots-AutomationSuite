import { defineConfig, devices } from '@playwright/test'

/**
 * Chaturbhuja Properties & Infra — Playwright Config
 * Set TARGET_URL env var to test against production:
 *   TARGET_URL=https://www.chaturbhujaplots.in npx playwright test
 */
export default defineConfig({
  testDir:  './tests/e2e',
  timeout:  30000,
  retries:  1,
  workers:  1,

  use: {
    baseURL:    process.env.TARGET_URL || 'http://localhost:3000',
    headless:   true,
    screenshot: 'only-on-failure',
    video:      'off',
    trace:      'on-first-retry',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use:  { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone 14',
      use:  { ...devices['iPhone 14'] },
      testMatch: '**/mobile*.spec.js',
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
})
