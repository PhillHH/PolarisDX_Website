import { defineConfig } from '@playwright/test'

/**
 * PT24.1 — Bestandszusicherungen der unmittelbaren Abhaengigkeiten.
 *
 * PT24.1 fasst Header, Footer, Breadcrumbs, Input/Textarea, Consent-Banner,
 * Sprachumschalter und die Consumer-Kopfzeile an. Diese vier Suiten sind die
 * bestehenden Zusicherungen genau dieser Bausteine — sie laufen hier gegen
 * denselben Dev-SSR-Server wie `pt24.1.spec.ts`, damit eine semantische
 * Aenderung nicht still etwas anderes bricht.
 *
 * Suiten mit Backend-Abhaengigkeit (Formularabsendung) sind hier bewusst NICHT
 * enthalten; sie brauchen einen Produktionsbuild samt Datenbank und gehoeren
 * damit in die AP24-Closure.
 */
const port = Number(process.env.E2E_PORT ?? 3941)
const viteCacheDir = process.env.POLARIS_VITE_CACHE_DIR ?? 'node_modules/.cache/pt24.1/vite'

export default defineConfig({
  testDir: '.',
  testMatch: [
    'navigation.spec.ts',
    'consumer-shell.spec.ts',
    'consent-basic-remediation.spec.ts',
    'i18n-core.spec.ts',
  ],
  timeout: 60_000,
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
