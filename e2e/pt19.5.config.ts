import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

/**
 * PT19.5 — das breite AP19-Integrationsgate.
 *
 * Anders als PT19.2–PT19.4 laeuft hier der VOLLE Produktionsbuild
 * (`npm run build`, inklusive `check:befunde`) nach `dist/`, davor der echte
 * Express-Backend mit der ausgelieferten Registry und der geschuetzten Ablage.
 * Geprueft wird das System, nicht ein Ausschnitt davon.
 */
const port = Number(process.env.E2E_PORT ?? 3428)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5428)
const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const leadDb = resolve(repoRoot, 'node_modules/.cache/polaris-pt19-5/leads.sqlite3')
const protectedDir = resolve(repoRoot, 'storage/protected')
const clientOutDir = 'node_modules/.cache/polaris-pt19-5/client'
const serverOutDir = 'node_modules/.cache/polaris-pt19-5/server'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

/**
 * Derselbe Produktionsbuild wie `npm run build` — `check:befunde`, Client- und
 * SSR-Build mit derselben Vite-Konfiguration — nur in ein SCHREIBBARES
 * Verzeichnis.
 *
 * Grund: `dist/client/assets` gehoert auf dieser Maschine `root` (Rest eines
 * frueheren Laufs als anderer Benutzer). Vite kann das Verzeichnis nicht
 * leeren und bricht ab. Fremde Artefakte werden nicht angefasst; `server.ts`
 * unterstuetzt beide Verzeichnisse ohnehin ueber `POLARIS_*_DIST_DIR`.
 */
const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `npm run check:befunde && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: 'ap19-integration.spec.ts',
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
  webServer: [
    {
      command: `cd .. && mkdir -p $(dirname ${leadDb}) && rm -f ${leadDb} && PORT=${backendPort} LEAD_DB_PATH=${leadDb} POLARIS_PROTECTED_ASSET_DIR=${protectedDir} node server/server.js`,
      url: `http://127.0.0.1:${backendPort}/api/content-download/asset/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 600_000,
    },
  ],
})
