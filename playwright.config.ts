import { defineConfig } from '@playwright/test'

/**
 * Eigener Port statt 3000. Auf gemeinsam genutzten Maschinen laeuft dort
 * regelmaessig ein anderes Projekt; mit `reuseExistingServer` haetten die Tests
 * dann stillschweigend eine FREMDE Anwendung geprueft und Screenshots von ihr
 * abgelegt (in PT05.5 genau so passiert und deshalb hier festgeschrieben).
 * `E2E_PORT` erlaubt bei Bedarf ein Ausweichen.
 */
const PORT = Number(process.env.E2E_PORT || 3311)

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chromium',
    trace: 'on-first-retry',
    // Deterministische Aufnahmen: keine Animation, keine Zwischenbilder.
    reducedMotion: 'reduce',
  },
  webServer: {
    // Die Visual-Galerie wird nach dem Build erzeugt und liegt in
    // dist/client/ — sie ist eine Testflaeche, keine Route der Anwendung.
    command: `npm run build && npm run visual:gallery && PORT=${PORT} npm run start`,
    url: `http://127.0.0.1:${PORT}`,
    // Bewusst NIE wiederverwenden: siehe Kommentar zu PORT.
    reuseExistingServer: false,
    timeout: 120000,
  },
})
