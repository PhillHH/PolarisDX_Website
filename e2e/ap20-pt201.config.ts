import { defineConfig } from '@playwright/test'

/**
 * PT20.1 About — Fast-Delta V2: bewusst KEIN Production Build.
 * Der Dev-SSR-Server (tsx server.ts + Vite-Middleware) traegt die Seite.
 * AP20-CLOSURE: Scratch-Verzeichnis per AP20_RUN_DIR ueberschreibbar
 * (Default = urspruenglicher PT20.1-Scratch).
 */
const port = Number(process.env.E2E_PORT ?? 3511)
const runDir = process.env.AP20_RUN_DIR ?? '/home/phillip/.cache/pt201-run'

export default defineConfig({
  testDir: '.',
  testMatch: 'about-pt201.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `cd ${runDir} && NODE_OPTIONS=--require=${runDir}/e2e/node18-crypto-hash.cjs PORT=${port} npm run dev`,
    url: `http://127.0.0.1:${port}/de/about`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
