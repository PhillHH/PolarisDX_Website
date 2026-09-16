import { defineConfig } from '@playwright/test'

/**
 * PT25.5 — breiter Integrationsgate: bestehende, rein lesende Regressionssuiten gegen den
 * PRODUKTIONSBUILD dieses Tasks (`PERF_BUILD_DIR`, Standard `node_modules/.cache/pt25.5`,
 * gebaut mit `vite build --manifest` + `vite build --ssr`) statt gegen `dist/`.
 *
 * Bewusst NICHT hier: Suiten, die echte Leads absenden (Kontakt, Support, Lead-Magnet,
 * Epigenetik-Anfrage), Consent ERTEILEN und damit den echten GTM-Loader laden
 * (`consent-basic-remediation` Test 3) oder den Live-Shopify-Pfad nutzen. Formulare, Gate,
 * Consent-Ablehnung und Consumer-Kerninteraktionen prueft `e2e/pt25.5.spec.ts` ohne Absenden.
 *
 * Kein Retry: ein nur manchmal auftretender Fehler soll hier sichtbar werden.
 */
const port = Number(process.env.E2E_PORT ?? 3963)
const buildDir = process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/pt25.5'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'url-smoke.spec.ts',
    'search-modal.spec.ts',
    'navigation.spec.ts',
    'i18n-core.spec.ts',
    'resource-center.spec.ts',
  ],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${buildDir}/client POLARIS_SERVER_DIST_DIR=${buildDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
