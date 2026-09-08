import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * PT21.4 — Inside-Out Duo x10.
 *
 * Isolierter Client-/SSR-Build in `node_modules/.cache`; `dist/` bleibt
 * unberuehrt. Kein voller Produktionsbuild (Fast-Delta V2 §7 — die
 * Build-/SSR-Infrastruktur ist nicht veraendert).
 */
const port = Number(process.env.E2E_PORT ?? 3463)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/pt21-4/client'
const serverOutDir = 'node_modules/.cache/pt21-4/server'
const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: 'consumer-duo.spec.ts',
  timeout: 90_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `cd .. && ${build}PORT=${port} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
