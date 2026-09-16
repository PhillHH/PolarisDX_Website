import { defineConfig } from '@playwright/test'

/**
 * PT20.4 breites AP20-Integrationsgate — PRODUCTION Build/SSR/E2E.
 * Server (Prod-SSR + DRY_RUN-Backend) werden manuell gestartet; diese
 * Config laeuft die drei AP20-Specs (Legal/Contact/Support) dagegen.
 * PROD_BASE_URL + BACKEND_URL via Env.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['legal-pt204.spec.ts', 'contact-pt202.spec.ts', 'support-pt203.spec.ts'],
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: process.env.PROD_BASE_URL ?? 'http://127.0.0.1:3600',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
