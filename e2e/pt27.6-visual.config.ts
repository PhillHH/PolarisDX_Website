import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP27 PT27.6 — selektive Visual Regression gegen den aktuellen Stand.
 *
 * Laeuft lokal UND in CI im offiziellen Playwright-Image `mcr.microsoft.com/playwright:v1.57.0-noble`
 * (`npm run test:visual:docker` bzw. CI-Job `ap27-visual`), damit Schriftrendering und Browser
 * bitgleich sind — ein Screenshot vom Entwicklerrechner waere in CI sonst ein Zufallstreffer.
 * Build in jedem Lauf frisch, kein Backend, keine Retries, keine Toleranz im Pixelvergleich.
 */
const port = Number(process.env.E2E_PORT ?? 3767)
const cacheDir = 'node_modules/.cache/pt27.6-visual'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

const build = [
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
].join(' && ')

export default defineConfig({
  testDir: '.',
  testMatch: ['pt27.6-visual.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      maxDiffPixels: 0,
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  webServer: {
    command: `cd .. && ${build} && PORT=${port} BACKEND_URL=http://127.0.0.1:9 POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
