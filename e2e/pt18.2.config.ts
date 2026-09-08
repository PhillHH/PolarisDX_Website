import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const PORT = 3418
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = '/tmp/polaris-pt18-2-client'

export default defineConfig({
  testDir: '.',
  testMatch: 'events-upcoming.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `cd .. && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} && NODE_OPTIONS=--require=${cryptoCompat} npx vite preview --outDir ${clientOutDir} --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
