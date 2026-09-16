import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * AP21-CLOSURE — unabhaengige, breite Reverifikation.
 *
 * Die Closure vertraut KEINEM PT-PASS blind. Dieser Lauf misst alles neu:
 * gegen einen frisch gebauten Produktionsbuild (Client + SSR) und gegen ein
 * echtes Backend mit frischer Datenbank. `SENDGRID_API_KEY` bleibt leer —
 * gemessen wird der ehrliche NO_PROVIDER_CONFIGURED-Pfad.
 *
 * Die 30 Routen werden im Test aus der Route-Registry und der Sprachliste
 * ABGELEITET, nicht als Liste hingeschrieben: eine Regression in der
 * Registry faellt damit auf, statt am Test vorbeizulaufen.
 *
 * `dist/` bleibt unberuehrt — gebaut wird in `node_modules/.cache/pt21-7`.
 */
const port = Number(process.env.E2E_PORT ?? 3481)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5481)
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))
const clientOutDir = 'node_modules/.cache/ap21-closure/client'
const serverOutDir = 'node_modules/.cache/ap21-closure/server'

/**
 * Fester Pfad, KEIN `mkdtemp`: diese Datei wird sowohl vom Playwright-Runner
 * als auch im Testprozess ausgewertet. Ein zufaelliger Pfad ergaebe dort zwei
 * verschiedene Datenbanken — der Test wuerde in eine leere Datei schauen,
 * waehrend der Server in eine andere schreibt. Frisch wird sie stattdessen
 * beim Serverstart geloescht (siehe `webServer`-Kommando).
 */
export const LEAD_DB_PATH =
  process.env.AP21C_LEAD_DB ?? 'node_modules/.cache/ap21-closure/leads.sqlite3'

const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

export default defineConfig({
  testDir: '.',
  testMatch: ['ap21-closure.spec.ts'],
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
