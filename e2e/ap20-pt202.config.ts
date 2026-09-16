import { defineConfig } from '@playwright/test'

/**
 * PT20.2 Contact — Fast-Delta V2: bewusst KEIN Production Build.
 * Backend (DRY_RUN=1, temp DB, gefakter Provider-Key) + Dev-SSR parallel.
 */
const port = Number(process.env.E2E_PORT ?? 3512)
const backendPort = 5502
const copy = '/home/phillip/.cache/pt202-run'

export default defineConfig({
  testDir: '.',
  testMatch: 'contact-pt202.spec.ts',
  timeout: 60_000,
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
      command: `cd ${copy}/server && PORT=${backendPort} DRY_RUN=1 SENDGRID_API_KEY=SG.e2e-fake-key-pt202 CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=/tmp/pt202-e2e-leads.sqlite3 NODE_ENV=production node server.js`,
      url: `http://127.0.0.1:${backendPort}/api/content-download/asset/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `cd ${copy} && NODE_OPTIONS=--require=${copy}/e2e/node18-crypto-hash.cjs PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} npm run dev`,
      url: `http://127.0.0.1:${port}/de/contact`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
