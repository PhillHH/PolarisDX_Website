import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'befunde-blocks-charts.spec.ts',
    'befunde-navigation.spec.ts',
    'befunde-integration.spec.ts',
    'epigenetics-golden-path.spec.ts',
  ],
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: process.env.PT165_BASE_URL || 'http://127.0.0.1:3425',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
})
