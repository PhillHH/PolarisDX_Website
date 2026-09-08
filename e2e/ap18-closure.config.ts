import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.E2E_PORT ?? 3422)
const fixedNow = process.env.POLARIS_FIXED_NOW ?? '2026-09-01T12:00:00+02:00'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const fixedClock = fileURLToPath(new URL('./ap18-fixed-clock.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/polaris-ap18-closure/client'
const serverOutDir = 'node_modules/.cache/polaris-ap18-closure/server'
const buildCommand =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: 'ap18-closure-boundary.spec.ts',
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
    command: `cd .. && ${buildCommand}POLARIS_FIXED_NOW=${fixedNow} PORT=${port} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} NODE_OPTIONS="--require=${fixedClock}" npm run start`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
