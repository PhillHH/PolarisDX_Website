import { defineConfig } from '@playwright/test'

/**
 * PT25.2 — Rendering, SSR und Hydration: fokussierte Regressionstests gegen den
 * PRODUKTIONSBUILD dieses Tasks (`node_modules/.cache/pt25.2`, gebaut mit
 * `vite build --manifest --outDir node_modules/.cache/pt25.2/client` und
 * `vite build --ssr src/entry-server.tsx --outDir node_modules/.cache/pt25.2/server`).
 *
 * Der Server wird bewusst FRISCH gestartet (kein Wiederverwenden): der erste
 * Test prueft den Kaltstart-Kopf der jetzt lazy geladenen Consumer-Seiten und
 * der Befundseiten mit Modul-`await` — das geht nur ohne vorgewaermten Prozess.
 * Die Bereitschaftsabfrage des Webservers trifft nur `/de/`.
 *
 * Kein Retry: ein Hydrations- oder Kopffehler, der nur manchmal auftritt, ist
 * genau das, was hier gefunden werden soll.
 */
const port = Number(process.env.E2E_PORT ?? 3961)
const buildDir = process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/pt25.2'

export default defineConfig({
  testDir: '.',
  testMatch: ['pt25.2.spec.ts'],
  timeout: 180_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
  },
  webServer: {
    command: `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${buildDir}/client POLARIS_SERVER_DIST_DIR=${buildDir}/server npm run start`,
    url: `http://127.0.0.1:${port}/de/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
