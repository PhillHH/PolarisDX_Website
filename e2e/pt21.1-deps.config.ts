import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * PT21.1 — Consumer-Shell.
 *
 * Isolierter Client-/SSR-Build in `node_modules/.cache`; `dist/` bleibt
 * unberuehrt. Kein voller Produktionsbuild (Fast-Delta V2 §7 — die
 * Build-/SSR-Infrastruktur ist nicht veraendert).
 */
const port = Number(process.env.E2E_PORT ?? 3454)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/pt21-1/client'
const serverOutDir = 'node_modules/.cache/pt21-1/server'
const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  // Direkte Abhaengigkeiten der geaenderten Shell: SEO-Head, Routing und der
  // URL-Smoke beruehren die Consumer-Routen unmittelbar.
  testMatch: [
    'consumer-shell.spec.ts',
    'seo-head.spec.ts',
    'pt08-4-routing.spec.ts',
    'url-smoke.spec.ts',
  ],
  timeout: 90_000,
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
    command: `cd .. && ${build}PORT=${port} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
