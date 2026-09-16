import { defineConfig } from '@playwright/test'

/**
 * PT25.5 — Performance-Budgets und CI-Gate: breite Integrationspruefung gegen den
 * PRODUKTIONSBUILD dieses Tasks (`PERF_BUILD_DIR`, Standard `node_modules/.cache/pt25.5`,
 * gebaut mit `vite build --manifest` + `vite build --ssr src/entry-server.tsx`).
 *
 * Der Browser loest keine fremden Hosts auf (`--host-resolver-rules`): selbst eine Regression,
 * die vor Consent einen Anbieter anfragt, erreicht nichts ausserhalb der Maschine — die Tests
 * zaehlen jeden Versuch und schlagen dann fehl. Es wird nichts abgesendet und kein Consent erteilt.
 *
 * Kein Retry: ein nur manchmal auftretender Fehler soll hier sichtbar werden.
 */
const port = Number(process.env.E2E_PORT ?? 3964)
const buildDir = process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/pt25.5'

export default defineConfig({
  testDir: '.',
  testMatch: ['pt25.5.spec.ts'],
  timeout: 600_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    launchOptions: { args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] },
  },
  webServer: {
    command: `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${buildDir}/client POLARIS_SERVER_DIST_DIR=${buildDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
