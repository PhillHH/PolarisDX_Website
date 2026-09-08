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
    baseURL: process.env.PROD_BASE_URL ?? 'http://127.0.0.1:3600',
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
})
