import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

/**
 * PT19.4 faehrt BEIDE Prozesse: den Express-Backend mit der echten Registry
 * und der echten geschuetzten Ablage, und davor den SSR-Server, der `/api`
 * dorthin proxyt. Nur so laeuft der gegatete Pfad wirklich durch die
 * Oberflaeche und nicht an ihr vorbei.
 *
 * `dist/` bleibt unberuehrt — gebaut wird isoliert nach node_modules/.cache.
 */
const port = Number(process.env.E2E_PORT ?? 3427)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5427)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const clientOutDir = 'node_modules/.cache/polaris-pt19-4/client'
const serverOutDir = 'node_modules/.cache/polaris-pt19-4/server'
const leadDb = resolve(repoRoot, 'node_modules/.cache/polaris-pt19-4/leads.sqlite3')
const protectedDir = resolve(repoRoot, 'storage/protected')

const buildCommand =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: 'lead-magnet.spec.ts',
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
  webServer: [
    {
      command: `cd .. && rm -f ${leadDb} && PORT=${backendPort} LEAD_DB_PATH=${leadDb} POLARIS_PROTECTED_ASSET_DIR=${protectedDir} node server/server.js`,
      // POST-only Route: der GET liefert 403 — das genuegt als Lebenszeichen.
      url: `http://127.0.0.1:${backendPort}/api/content-download/asset/health`,
      ignoreHTTPSErrors: true,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${buildCommand}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 240_000,
    },
  ],
})
