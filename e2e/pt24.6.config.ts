import { defineConfig } from '@playwright/test'

/**
 * PT24.6 — Automatisierte Checks. Gemessen wird gegen den Dev-SSR-Server, NICHT gegen einen
 * Produktionsbuild: Fast-Delta V2 verbietet in PT24.1–PT24.5 den vollen Build,
 * und Accessibility haengt an Markup und CSS, nicht an der Buendelung.
 * Dieselben Komponenten, dasselbe DOM, derselbe Browser.
 *
 * `timeout` ist hoch: ein einzelner Test faehrt bis zu 44 Routen ab und laesst
 * auf jeder `axe` laufen.
 *
 * Bewegung wird hier nicht geprueft (das ist PT24.5). Die
 * Konfigurationsoption fuer Bewegungsreduktion ist bewusst entfernt: sie kam
 * nachweislich nie in der Seite an, siehe `A11Y-21` im Vertrag.
 *
 * Zwei Umgebungsvariablen sind hier noetig und beide sind Messwerkzeug, nicht
 * Anwendungskonfiguration:
 *
 * `POLARIS_VITE_CACHE_DIR` — auf dieser Maschine laufen Preview-Container als
 * root gegen denselben Repositoriumspfad und besitzen `node_modules/.vite/deps`.
 * Ein Dev-Start als normale Nutzerin scheitert dort an `EACCES`. Der Lauf legt
 * seinen eigenen Optimizer-Cache an, statt fremde, moeglicherweise gerade
 * benutzte Container-Artefakte anzufassen.
 *
 * `NODE_ENV=development` — sonst liefert `server.ts` aus `dist/`, und `dist/`
 * ist aelter als der Quellstand. Gemessen wuerde dann ein Build von vorgestern.
 */
const port = Number(process.env.E2E_PORT ?? 3946)
const viteCacheDir = process.env.POLARIS_VITE_CACHE_DIR ?? 'node_modules/.cache/pt24.1/vite'

export default defineConfig({
  testDir: '.',
  testMatch: ['pt24.6.spec.ts'],
  timeout: 180_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    // AP26 PT26.5: axe wird per addScriptTag inline eingefuegt; die durchgesetzte CSP blockt das.
    // Diese Suite misst nicht die CSP (das tun e2e/pt26.2 und e2e/pt26.3, ohne Bypass).
    bypassCSP: true,
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    // AP24 PT24.6 (`A11Y-21`): Hier stand `reducedMotion: 'reduce'`.
    // Gemessen kam die Einstellung NIE in der Seite an —
    // `matchMedia('(prefers-reduced-motion: reduce)').matches` blieb `false`,
    // waehrend derselbe Wert ueber `browser.newContext()` sofort greift
    // (Playwright 1.57, mit und ohne `channel`, im `use`- wie im
    // `projects`-Block reproduziert). Eine Zeile, die nichts tut, ist
    // schlimmer als keine: sie erzeugt den Eindruck einer Absicherung.
    //
    // Wer Bewegung pruefen will, ruft `page.emulateMedia({ reducedMotion })`
    // im Test auf UND prueft die Wirkung nach — so macht es
    // `e2e/pt24.5.spec.ts`.
  },
  webServer: {
    command: `cd .. && NODE_ENV=development POLARIS_VITE_CACHE_DIR=${viteCacheDir} PORT=${port} npm run dev`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !!process.env.POLARIS_REUSE_SERVER,
    timeout: 180_000,
  },
})
