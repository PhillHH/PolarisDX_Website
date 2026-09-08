import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * PT19.2 laeuft gegen einen ISOLIERTEN Client-/SSR-Build in
 * `node_modules/.cache`, nicht gegen `dist/`. Fast-Delta V2 verbietet den
 * vollen Produktionsbuild; geprueft wird ausschliesslich die geaenderte
 * Oberflaeche, und `dist/` bleibt unangetastet.
 */
const port = Number(process.env.E2E_PORT ?? 3419)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/polaris-pt19-2/client'
const serverOutDir = 'node_modules/.cache/polaris-pt19-2/server'
const buildCommand =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: 'resource-center.spec.ts',
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
    command: `cd .. && ${buildCommand}PORT=${port} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
})
