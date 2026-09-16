import { defineConfig } from '@playwright/test'

/**
 * PT24.5 — Medien. Gemessen wird gegen den Dev-SSR-Server, NICHT gegen einen
 * Produktionsbuild: Fast-Delta V2 verbietet in PT24.1–PT24.5 den vollen Build,
 * und Medien haengen an Markup und CSS, nicht an der Buendelung. Dieselben
 * Komponenten, dasselbe DOM, derselbe Browser.
 *
 * Die Bewegungspruefung laeuft in einem ZWEITEN Kontext mit
 * `reducedMotion: 'reduce'` — Playwright setzt damit die echte
 * Medienabfrage, nicht eine Nachahmung.
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
const port = Number(process.env.E2E_PORT ?? 3945)
const viteCacheDir = process.env.POLARIS_VITE_CACHE_DIR ?? 'node_modules/.cache/pt24.1/vite'

export default defineConfig({
  testDir: '.',
  testMatch: ['pt24.5.spec.ts'],
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
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
