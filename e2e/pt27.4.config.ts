import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP27 PT27.4 — Consent-/Tracking-Vertrag im Browser, am Netz gemessen.
 *
 * Build wie das Preview-Deployment: `VITE_APP_ENV=preview`, eigener Preview-Container. Zusaetzlich
 * ist ein (synthetischer) PRODUKTIONS-Container deklariert — er darf weder im Bundle noch im Netz
 * erscheinen. Die GA4-Kennung ist ausdruecklich leer (so baut auch der echte Preview-Stand, §16.1).
 * Alle Kennungen sind synthetisch; jede Provider-Anfrage wird in der Spec abgefangen und mit einem
 * leeren Stub beantwortet — kein Byte erreicht Google oder einen Marketing-Anbieter.
 *
 * Backend wie PT27.3: `APP_ENV=preview`, temporaere Datenbank, Provider-Variablen leer.
 */
const port = Number(process.env.E2E_PORT ?? 3747)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5747)
const cacheDir = 'node_modules/.cache/pt27.4'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

export const PT274_PREVIEW_CONTAINER = 'GTM-PT274PRV'
export const PT274_PRODUCTION_CONTAINER = 'GTM-PT274PRD'
export const PT274_CLIENT_DIR = fileURLToPath(new URL(`../${cacheDir}/client`, import.meta.url))
export const PT274_SERVER_ENTRY = fileURLToPath(
  new URL(`../${cacheDir}/server/entry-server.js`, import.meta.url),
)
export const PT274_LEAD_DB = fileURLToPath(new URL(`../${cacheDir}/leads.sqlite3`, import.meta.url))

// Einmal im Runner gesetzt, von den Workern geerbt.
process.env.PT274_BUILD_STARTED ??= String(Date.now())

const analyticsEnv = [
  'VITE_APP_ENV=preview',
  `VITE_GTM_CONTAINER_ID=${PT274_PRODUCTION_CONTAINER}`,
  `VITE_GTM_CONTAINER_ID_PREVIEW=${PT274_PREVIEW_CONTAINER}`,
  'VITE_GA4_MEASUREMENT_ID=',
].join(' ')

const build = [
  `${analyticsEnv} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `${analyticsEnv} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
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
  testMatch: ['pt27.4-consent.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  webServer: [
    {
      command: `cd .. && mkdir -p ${cacheDir}/uploads && rm -rf ${cacheDir}/leads.sqlite3* && env -u NODE_ENV ${backendEnv} node server/server.js`,
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
