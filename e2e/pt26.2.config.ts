import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.2 — CSP unter der durchgesetzten Zielpolicy, gegen den PRODUKTIONSBUILD.
 *
 *   SSR `server.ts` (NODE_ENV=production → `Content-Security-Policy`, kein Report-Only)
 *     → Backend `server/server.js` (NODE_ENV=test, ohne SendGrid-Key, Dispatcher aus)
 *
 * Gebaut wird mit einem Test-Container (`GTM-PT262TEST`). Fuer den Zustimmungsfall liefert die
 * Suite den veroeffentlichten Produktions-Container und dessen Google-Tag lokal aus
 * (`node_modules/.cache/pt26.2/provider`, einmal lesend abgerufen); jede andere externe Anfrage
 * wird protokolliert und abgebrochen — kein Collect erreicht Google. Kein Retry.
 */
const port = Number(process.env.E2E_PORT ?? 3626)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5626)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const cacheDir = 'node_modules/.cache/pt26.2'
const clientOutDir = `${cacheDir}/client`
const serverOutDir = `${cacheDir}/server`
const leadDb = `${cacheDir}/leads.sqlite3`

export const GTM_TEST_CONTAINER = 'GTM-PT262TEST'
export const PROVIDER_CACHE_DIR = `../${cacheDir}/provider`

const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `VITE_GTM_CONTAINER_ID=${GTM_TEST_CONTAINER} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && VITE_GTM_CONTAINER_ID=${GTM_TEST_CONTAINER} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: ['pt26.2.spec.ts'],
  timeout: 180_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: [
    {
      // Wie der Compose-Dienst ohne NODE_ENV; `APP_ENV=preview` erzwingt den Trockenlauf (AP22),
      // sonst endet ein Lead ohne Provider in FAILED_TERMINAL und das Gate liefert keinen Download.
      command: `cd .. && mkdir -p ${cacheDir}/uploads && rm -f ${leadDb}* && env -u NODE_ENV -u SENDGRID_API_KEY PORT=${backendPort} LISTEN_HOST=127.0.0.1 APP_ENV=preview CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=${leadDb} SUPPORT_UPLOAD_DIR=${cacheDir}/uploads LEAD_DISPATCHER_DISABLED=1 node server/server.js`,
      port: backendPort,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}/de/`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
})
