import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP27 PT27.2 — SSR-/HTTP-/SEO-Integration OHNE Browser.
 *
 * Die Spec benutzt ausschliesslich den `request`-Kontext; es wird kein Browser gestartet und kein
 * JavaScript ausgefuehrt — damit kann auch kein Analytics-Request entstehen. Der Build entsteht in
 * JEDEM Lauf neu aus dem aktuellen Arbeitsbaum in einem eigenen Verzeichnis (kein `dist`, kein
 * `reuseExistingServer`); die Spec prueft das am Zeitstempel. Kein Retry.
 */
const port = Number(process.env.E2E_PORT ?? 3727)
const cacheDir = 'node_modules/.cache/pt27.2'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

// Einmal im Runner gesetzt, von den Workern geerbt.
process.env.PT272_BUILD_STARTED ??= String(Date.now())

const build = [
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
].join(' && ')

export default defineConfig({
  testDir: '.',
  testMatch: ['pt27.2-http.spec.ts'],
  timeout: 240_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  webServer: {
    // Kein Backend: die Spec ruft keine API auf. BACKEND_URL zeigt bewusst ins Leere.
    command: `cd .. && ${build} && PORT=${port} BACKEND_URL=http://127.0.0.1:9 POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
