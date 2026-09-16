import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

/**
 * PT19.5 — der breite Regressionslauf ueber alle beruehrten Suiten.
 *
 * Anders als PT19.2–PT19.4 laeuft hier der VOLLE Produktionsbuild
 * (`npm run build`, inklusive `check:befunde`) nach `dist/`, davor der echte
 * Express-Backend mit der ausgelieferten Registry und der geschuetzten Ablage.
 * Geprueft wird das System, nicht ein Ausschnitt davon.
 */
const port = Number(process.env.E2E_PORT ?? 3429)
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 5429)
const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const leadDb = resolve(repoRoot, 'node_modules/.cache/polaris-pt19-5-broad/leads.sqlite3')
const protectedDir = resolve(repoRoot, 'storage/protected')
// Der AP15-Golden-Path liest die Lead-Datenbank und eine CRM-Beweisdatei
// direkt; ohne beides bricht er beim Start ab statt zu laufen.
const crmEvidence = resolve(repoRoot, 'node_modules/.cache/polaris-pt19-5-broad/crm-evidence.log')
const clientOutDir = 'node_modules/.cache/polaris-pt19-5/client'
const serverOutDir = 'node_modules/.cache/polaris-pt19-5/server'
const cryptoCompat = fileURLToPath(new URL('./node18-crypto-hash.cjs', import.meta.url))

/**
 * Derselbe Produktionsbuild wie `npm run build` — `check:befunde`, Client- und
 * SSR-Build mit derselben Vite-Konfiguration — nur in ein SCHREIBBARES
 * Verzeichnis.
 *
 * Grund: `dist/client/assets` gehoert auf dieser Maschine `root` (Rest eines
 * frueheren Laufs als anderer Benutzer). Vite kann das Verzeichnis nicht
 * leeren und bricht ab. Fremde Artefakte werden nicht angefasst; `server.ts`
 * unterstuetzt beide Verzeichnisse ohnehin ueber `POLARIS_*_DIST_DIR`.
 */
const build =
  process.env.POLARIS_SKIP_BUILD === '1'
    ? ''
    : `npm run check:befunde && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --outDir ${clientOutDir} --emptyOutDir && NODE_OPTIONS=--require=${cryptoCompat} npx vite build --ssr src/entry-server.tsx --outDir ${serverOutDir} --emptyOutDir && `

// Der AP15-Golden-Path liest diese Pfade IM TESTPROZESS, nicht nur im Server.
// Ohne sie bricht er beim Start ab, statt zu laufen.
process.env.LEAD_DB_PATH = leadDb
process.env.PT157_CRM_EVIDENCE_PATH = crmEvidence

export default defineConfig({
  testDir: '.',
  // Breiter Lauf: das AP19-eigene Gate plus jede Suite, die von den in AP19
  // geaenderten Seiten, Locale-Schluesseln oder Assets beruehrt wird.
  testMatch: [
    'ap19-integration.spec.ts',
    'resource-center.spec.ts',
    'lead-magnet.spec.ts',
    'epigenetics-hub-ia.spec.ts',
    'epigenetics-deep-pages.spec.ts',
    'epigenetics-panels-context.spec.ts',
    'epigenetics-claims-regulatory.spec.ts',
    'epigenetics-resources.spec.ts',
    'epigenetics-inquiry.spec.ts',
    // `epigenetics-golden-path.spec.ts` fehlt hier bewusst: er braucht den
    // AP15-eigenen Harness (`server/pt15.7-e2e-server.js` samt CRM-Empfaenger
    // und Beweisdatei). Gegen den normalen Backend zu laufen wuerde nichts
    // beweisen. Er wird separat mit seinem eigenen Harness ausgefuehrt.
    'befunde-navigation.spec.ts',
    'befunde-integration.spec.ts',
    'igloo-positioning.spec.ts',
    'igloo-product-journey.spec.ts',
    'url-smoke.spec.ts',
    'sitemap.spec.ts',
    'findability.spec.ts',
    'navigation.spec.ts',
    'seo-head.spec.ts',
    'i18n-core.spec.ts',
    'consent-basic-remediation.spec.ts',
  ],
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
      command: `cd .. && mkdir -p $(dirname ${leadDb}) && rm -f ${leadDb} ${crmEvidence} && touch ${crmEvidence} && PORT=${backendPort} LEAD_DB_PATH=${leadDb} PT157_CRM_EVIDENCE_PATH=${crmEvidence} POLARIS_PROTECTED_ASSET_DIR=${protectedDir} node server/server.js`,
      url: `http://127.0.0.1:${backendPort}/api/content-download/asset/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `cd .. && ${build}PORT=${port} BACKEND_URL=http://127.0.0.1:${backendPort} POLARIS_CLIENT_DIST_DIR=${clientOutDir} POLARIS_SERVER_DIST_DIR=${serverOutDir} npm run start`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: false,
      timeout: 600_000,
    },
  ],
})
