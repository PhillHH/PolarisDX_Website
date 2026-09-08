import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'articles-index.spec.ts',
    'articles-template.spec.ts',
    'articles-routing.spec.ts',
    'articles-integration.spec.ts',
  ],
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PT174_BASE_URL || 'http://127.0.0.1:3420',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
