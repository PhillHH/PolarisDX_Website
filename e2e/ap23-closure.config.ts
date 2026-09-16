import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP23-CLOSURE — unabhaengige, netzbasierte Reverifikation.
 *
 * Die Closure uebernimmt KEINEN PT-PASS blind. Gemessen wird gegen einen
 * frisch gebauten Produktionsbuild und ein echtes Backend.
 *
 * Der Container ist ein SYNTHETISCHER Wert nur fuer diesen Lauf. Weder der
 * Produktions- noch der echte Preview-Container darf hier auftauchen: ein
 * Testlauf gegen einen realen Container wuerde die zugehoerige Auswertung
 * verschmutzen, und genau das verbietet AP23.
 */
const port = Number(process.env.E2E_PORT ?? 3484)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5484)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/ap23-closure/client'
const serverOutDir = 'node_modules/.cache/ap23-closure/server'

export const LEAD_DB_PATH =
  process.env.AP23C_LEAD_DB ?? 'node_modules/.cache/ap23-closure/leads.sqlite3'

/** Synthetisch. Nicht GTM-TW6JFX7K, nicht GTM-PL26PFFH. */
export const GTM_TEST_CONTAINER = 'GTM-AP23CLOS'

const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `VITE_GTM_CONTAINER_ID=${GTM_TEST_CONTAINER} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && VITE_GTM_CONTAINER_ID=${GTM_TEST_CONTAINER} NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: ['ap23-closure.spec.ts'],
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
      command: `cd .. && rm -f ${LEAD_DB_PATH}* && PORT=${backendPort} NODE_ENV=test SENDGRID_API_KEY= CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=${LEAD_DB_PATH} node server/server.js`,
      port: backendPort,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
})
