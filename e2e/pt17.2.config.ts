import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: 'articles-template.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PT172_BASE_URL || 'http://127.0.0.1:3418',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
