import { defineConfig } from '@playwright/test'

/**
 * PT15.6 fast-delta config: the caller supplies an already-running dev server,
 * so this focused browser gate neither rebuilds the site nor starts AP15.7's
 * broad production gate.
 */
export default defineConfig({
  testDir: '.',
  testMatch: [
    'epigenetics-inquiry.spec.ts',
    'epigenetics-panels-context.spec.ts',
    'epigenetics-deep-pages.spec.ts',
    'epigenetics-hub-ia.spec.ts',
  ],
  timeout: 30_000,
  use: {
    baseURL: process.env.PT156_BASE_URL || 'http://127.0.0.1:3326',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
