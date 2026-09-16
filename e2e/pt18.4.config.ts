import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const PORT = 3421
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
// Der SSR-Bundle-Pfad bleibt unterhalb des Repository-node_modules-Baums,
// damit Node externe SSR-Dependencies korrekt auflösen kann. Der Cache ist
// gitignored und berührt das geschützte, teilweise root-eigene dist/ nicht.
const clientOutDir = 'node_modules/.cache/polaris-pt18-4/client'
const serverOutDir = 'node_modules/.cache/polaris-pt18-4/server'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'events-integration.spec.ts',
    'events-upcoming.spec.ts',
    'events-past.spec.ts',
    'seo-head.spec.ts',
  ],
  timeout: 90_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `cd .. && npm run check:befunde && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && PORT=${PORT} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
