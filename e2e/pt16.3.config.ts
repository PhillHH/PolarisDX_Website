import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: 'befunde-navigation.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PT163_BASE_URL || 'http://127.0.0.1:3417',
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
})
