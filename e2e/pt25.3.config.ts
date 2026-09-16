import { defineConfig } from '@playwright/test'

/**
 * PT25.3 — Bilder und LCP-Medien: fokussierte Tests gegen ZWEI Produktionsbuilds.
 *
 * - vorher: PT25.2-Endstand (`node_modules/.cache/pt25.2`) auf Port 3992
 * - nachher: PT25.3 (`node_modules/.cache/pt25.3`) auf Port 3993
 *
 * Beide laufen gleichzeitig, damit OG-/Structured-Data-Gleichheit, `alt`-Gleichheit,
 * Bildbytes und der visuelle Vergleich direkt gegeneinander gemessen werden.
 * Kein Retry: ein Bild, das nur manchmal doppelt laedt oder springt, soll auffallen.
 */
const before = process.env.PT253_BEFORE_DIR ?? 'node_modules/.cache/pt25.2'
const after = process.env.PT253_AFTER_DIR ?? 'node_modules/.cache/pt25.3'
const server = (dir: string, port: number) => ({
  command: `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${dir}/client POLARIS_SERVER_DIST_DIR=${dir}/server npm run start`,
  url: `http://127.0.0.1:${port}/de/`,
  reuseExistingServer: false,
  timeout: 120_000,
})

export default defineConfig({
  testDir: '.',
  testMatch: ['pt25.3.spec.ts'],
  timeout: 300_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das. Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
  use: { baseURL: 'http://127.0.0.1:3993', channel: 'chromium', bypassCSP: true },
  webServer: [server(before, 3992), server(after, 3993)],
})
