import { defineConfig } from '@playwright/test'

/**
 * PT20.3 Support — Fast-Delta V2: bewusst KEIN Production Build.
 * Backend (DRY_RUN=1, temp DB + Upload-Storage, gefakter Provider-Key)
 * + Dev-SSR parallel. Readiness-URL: /api/content-download/asset/health
 * liefert bewusst 403 (INVALID_TOKEN) — Playwright akzeptiert 200..403.
 */
const port = Number(process.env.E2E_PORT ?? 3513)
const backendPort = 5503
const copy = '/home/phillip/.cache/pt203-run'

export default defineConfig({
  testDir: '.',
  testMatch: 'support-pt203.spec.ts',
  timeout: 60_000,
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
      command: `cd ${copy}/server && PORT=${backendPort} DRY_RUN=1 SENDGRID_API_KEY=SG.e2e-fake-key-pt203 CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=/tmp/pt203-e2e-leads.sqlite3 SUPPORT_UPLOAD_DIR=/tmp/pt203-e2e-uploads NODE_ENV=production node server.js`,
      url: `http://127.0.0.1:${backendPort}/api/content-download/asset/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `cd ${copy} && NODE_OPTIONS=--require=${copy}/e2e/node18-crypto-hash.cjs PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} npm run dev`,
      url: `http://127.0.0.1:${port}/de/support`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
