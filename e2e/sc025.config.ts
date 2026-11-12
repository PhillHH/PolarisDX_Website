import { defineConfig } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 3825)
const cacheDir = 'node_modules/.cache/sc025'
const build = [
  `npx vite build --outDir ${cacheDir}/client --emptyOutDir`,
  `npx vite build --ssr src/entry-server.tsx --outDir ${cacheDir}/server --emptyOutDir`,
].join(' && ')

export default defineConfig({
  testDir: '.',
  testMatch: ['home-*.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    bypassCSP: true,
    reducedMotion: 'reduce',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: {
    command: `cd .. && ${build} && PORT=${port} BACKEND_URL=http://127.0.0.1:9 POLARIS_CLIENT_DIST_DIR=${cacheDir}/client POLARIS_SERVER_DIST_DIR=${cacheDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
