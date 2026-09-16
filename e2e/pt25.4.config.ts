import { defineConfig } from '@playwright/test'

/**
 * PT25.4 — Fonts und CSS: fokussierte Tests gegen ZWEI Produktionsbuilds.
 *
 * - vorher: PT25.3 (`node_modules/.cache/pt25.3`) auf Port 3992
 * - nachher: PT25.4 (`node_modules/.cache/pt25.4`) auf Port 3993
 *
 * Beide gleichzeitig, damit Font-Requests, Swap-CLS, visuelle Gleichheit und CSS-Auslieferung
 * direkt gegeneinander gemessen werden. Kein Retry.
 */
const before = process.env.PT254_BEFORE_DIR ?? 'node_modules/.cache/pt25.3'
const after = process.env.PT254_AFTER_DIR ?? 'node_modules/.cache/pt25.4'
/**
 * `server.ts` ist Laufzeitcode und gilt fuer beide Builds. Damit „vorher" wirklich den PT25.3-Stand
 * zeigt (Stylesheet als <link>), startet der Vorher-Server eine Messkopie ohne das CSS-Inlining:
 * `node_modules/.cache/pt25.4/server-vorher.ts` (erzeugt aus server.ts, siehe PERFORMANCE-CONTRACT §28).
 */
const beforeServerScript =
  process.env.PT254_BEFORE_SERVER ?? 'node_modules/.cache/pt25.4/server-vorher.ts'
const server = (dir: string, port: number, script?: string) => ({
  command: script
    ? `cd .. && TSX_TSCONFIG_PATH=tsconfig.app.json NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${dir}/client POLARIS_SERVER_DIST_DIR=${dir}/server npx tsx ${script}`
    : `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${dir}/client POLARIS_SERVER_DIST_DIR=${dir}/server npm run start`,
  url: `http://127.0.0.1:${port}/de/`,
  reuseExistingServer: false,
  timeout: 120_000,
})

export default defineConfig({
  testDir: '.',
  testMatch: ['pt25.4.spec.ts'],
  // Test 5 misst 7 Routen × 2 Viewports × 2 Staende × 3 Laeufe mit je ~6 s.
  timeout: 900_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das. Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
  use: { baseURL: 'http://127.0.0.1:3993', channel: 'chromium', bypassCSP: true },
  webServer: [server(before, 3992, beforeServerScript), server(after, 3993)],
})
