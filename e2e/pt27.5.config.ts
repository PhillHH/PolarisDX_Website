import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP27 PT27.5 — breite Route-/SEO-Regression gegen den aktuellen Stand.
 *
 * Fuehrt die bestehenden Matrix-Specs (`url-smoke`, `seo-head`, `sitemap`) und die PT27.5-Matrix
 * gemeinsam aus — aber gegen einen in JEDEM Lauf frisch gebauten Produktionsbuild in einem eigenen
 * Verzeichnis, ohne `dist`, ohne `reuseExistingServer`, ohne Retries und mit durchgesetzter CSP.
 * Kein Backend: gemessen werden SSR, HTTP-Status und SEO-Artefakte.
 */
const port = Number(process.env.E2E_PORT ?? 3757)
const cacheDir = 'node_modules/.cache/pt27.5'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

export const PT275_SERVER_ENTRY = fileURLToPath(
  new URL(`../${cacheDir}/server/entry-server.js`, import.meta.url),
)

// Einmal im Runner gesetzt, von den Workern geerbt.
process.env.PT275_BUILD_STARTED ??= String(Date.now())

const build = [
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
].join(' && ')

export default defineConfig({
  testDir: '.',
  testMatch: [
    'url-smoke.spec.ts',
    'seo-head.spec.ts',
    'sitemap.spec.ts',
    'pt27.5-seo-matrix.spec.ts',
  ],
  timeout: 240_000,
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
  webServer: {
    // Kein Backend: keine Seite dieser Matrix ruft eine API auf. BACKEND_URL zeigt bewusst ins Leere.
    command: `cd .. && ${build} && PORT=${port} BACKEND_URL=http://127.0.0.1:9 POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
