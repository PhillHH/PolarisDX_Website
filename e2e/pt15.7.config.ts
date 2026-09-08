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
    baseURL: process.env.PT157_BASE_URL || 'http://127.0.0.1:3337',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
})
