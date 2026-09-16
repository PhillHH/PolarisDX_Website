import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * PT21.7 — der breite Consumer-Integrationsgate (Fast-Delta V2 §10).
 *
 * Zwei Unterschiede zu allen bisherigen PT21-Konfigurationen:
 *
 *  1. **Voller Produktionsbuild** (Client + SSR). PT21.1–PT21.5 durften den
 *     nicht fahren; hier ist er Teil der Akzeptanz.
 *  2. **Echtes Backend.** Der PT21.6-Handoff hat ausdruecklich offengelassen,
 *     dass die Bestellstrecke bisher nur gegen abgefangene Requests gemessen
 *     wurde. Hier laeuft `server/server.js` als eigener Prozess gegen eine
 *     frische SQLite-Datenbank, und der SSR-Server proxyt `/api` dorthin.
 *     `SENDGRID_API_KEY` bleibt LEER: gemessen wird der ehrliche
 *     NO_PROVIDER_CONFIGURED-Pfad, kein Fake-Erfolg und kein Netzwerk.
 *
 * `dist/` bleibt unberuehrt — gebaut wird in `node_modules/.cache/pt21-7`.
 */
const port = Number(process.env.E2E_PORT ?? 3471)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5471)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/pt21-7/client'
const serverOutDir = 'node_modules/.cache/pt21-7/server'

/**
 * Fester Pfad, KEIN `mkdtemp`: diese Datei wird sowohl vom Playwright-Runner
 * als auch im Testprozess ausgewertet. Ein zufaelliger Pfad ergaebe dort zwei
 * verschiedene Datenbanken — der Test wuerde in eine leere Datei schauen,
 * waehrend der Server in eine andere schreibt. Frisch wird sie stattdessen
 * beim Serverstart geloescht (siehe `webServer`-Kommando).
 */
export const LEAD_DB_PATH = process.env.PT217_LEAD_DB ?? 'node_modules/.cache/pt21-7/leads.sqlite3'

const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: ['consumer-integration.spec.ts', 'consumer-ordering-live.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: [
    {
      command: `cd .. && rm -f ${LEAD_DB_PATH}* && PORT=${backendPort} NODE_ENV=test SENDGRID_API_KEY= CONTACT_RECEIVER=team@polarisdx.example SENDER_EMAIL=web@polarisdx.example LEAD_DB_PATH=${LEAD_DB_PATH} node server/server.js`,
      // Bereitschaft ueber den TCP-Port, nicht ueber HTTP: das Backend hat
      // ausser dem tokengeschuetzten Download keinen GET-Endpunkt, und eine
      // Health-Route nur fuer den Test in die Produktion zu legen waere die
      // falsche Reihenfolge.
      port: backendPort,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
})
