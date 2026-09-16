import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP27 PT27.3 — Kernjourneys im Browser gegen einen production-like Build.
 *
 *   SSR `server.ts` (NODE_ENV=production, in JEDEM Lauf frisch gebaut) → Backend `server/server.js`
 *   mit `APP_ENV=preview` (erzwungener Trockenlauf), eigener temporaerer Datenbank und Upload-Ablage,
 *   Dispatcher aus. Provider-Variablen sind ausdruecklich LEER gesetzt, damit keine lokale `.env`
 *   einen Schluessel nachlaedt. Keine Retries; Traces, Screenshots und Videos aus, damit keine
 *   (auch synthetischen) Formularinhalte in Artefakten landen.
 */
const port = Number(process.env.E2E_PORT ?? 3737)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5737)
const cacheDir = 'node_modules/.cache/pt27.3'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

export const PT273_LEAD_DB = fileURLToPath(new URL(`../${cacheDir}/leads.sqlite3`, import.meta.url))
export const PT273_UPLOAD_DIR = fileURLToPath(new URL(`../${cacheDir}/uploads`, import.meta.url))
export const PT273_SERVER_ENTRY = fileURLToPath(
  new URL(`../${cacheDir}/server/entry-server.js`, import.meta.url),
)

// Einmal im Runner gesetzt, von den Workern geerbt.
process.env.PT273_BUILD_STARTED ??= String(Date.now())

const build = [
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
].join(' && ')

const backendEnv = [
  `PORT=${backendPort}`,
  'LISTEN_HOST=127.0.0.1',
  'APP_ENV=preview',
  'SENDGRID_API_KEY=',
  'DRY_RUN=',
  'DEPLOY_ENV=',
  'FRONTEND_URL=',
  'RESOURCE_LEAD_RECEIVER=',
  'CONTACT_RECEIVER=team@polarisdx.example',
  'SENDER_EMAIL=web@polarisdx.example',
  `LEAD_DB_PATH=${cacheDir}/leads.sqlite3`,
  `SUPPORT_UPLOAD_DIR=${cacheDir}/uploads`,
  'LEAD_DISPATCHER_DISABLED=1',
].join(' ')

export default defineConfig({
  testDir: '.',
  testMatch: ['pt27.3-core.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  webServer: [
    {
      command: `cd .. && mkdir -p ${cacheDir}/uploads && rm -rf ${cacheDir}/uploads/* ${cacheDir}/leads.sqlite3* && env -u NODE_ENV ${backendEnv} node server/server.js`,
      port: backendPort,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build} && PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
      url: `http://127.0.0.1:${port}/de/`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
})
