import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'epigenetics-hub-ia.spec.ts',
    'epigenetics-deep-pages.spec.ts',
    'epigenetics-panels-context.spec.ts',
    'epigenetics-claims-regulatory.spec.ts',
    'epigenetics-resources.spec.ts',
    'epigenetics-inquiry.spec.ts',
    'epigenetics-golden-path.spec.ts',
    'consent-basic-remediation.spec.ts',
    'findability.spec.ts',
  ],
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: process.env.PT157_BASE_URL || 'http://127.0.0.1:3337',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
})
