import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: 'ap20-closure-smoke.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PROD_BASE_URL ?? 'http://127.0.0.1:3600',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
