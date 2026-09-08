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
    baseURL: process.env.PT165_BASE_URL || 'http://127.0.0.1:3425',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
})
