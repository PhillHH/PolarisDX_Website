import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.3 — API-/Formular-Security im Browser gegen den PRODUKTIONSBUILD.
 *
 *   SSR `server.ts` (NODE_ENV=production) → Backend `server/server.js` wie im Compose-Dienst:
 *   ohne NODE_ENV, `APP_ENV=preview` (erzwungener Trockenlauf, kein Provider-Aufruf),
 *   Dispatcher aus, eigene temporaere Datenbank.
 *
 * Die Negativmatrix der API steht in `server/api-security.endpoint.test.js`; hier wird nur
 * gemessen, was erst der Browser zeigt: Formular-Erfolg ueber das Envelope und die
 * Origin-Grenze fuer echte Cross-Site-Aufrufe. Kein Retry.
 */
const port = Number(process.env.E2E_PORT ?? 3636)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5636)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const cacheDir = 'node_modules/.cache/pt26.3'

export const PT263_PORT = port
export const PT263_LEAD_DB = `../${cacheDir}/leads.sqlite3`

const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: ['pt26.3.spec.ts'],
  timeout: 120_000,
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
      command: `cd .. && mkdir -p ${cacheDir}/uploads && rm -f ${cacheDir}/leads.sqlite3* && env -u NODE_ENV -u SENDGRID_API_KEY -u FRONTEND_URL PORT=${backendPort} LISTEN_HOST=127.0.0.1 APP_ENV=preview CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=${cacheDir}/leads.sqlite3 SUPPORT_UPLOAD_DIR=${cacheDir}/uploads LEAD_DISPATCHER_DISABLED=1 node server/server.js`,
      port: backendPort,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
      url: `http://127.0.0.1:${port}/de/`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
})
