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
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: process.env.PT156_BASE_URL || 'http://127.0.0.1:3326',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
