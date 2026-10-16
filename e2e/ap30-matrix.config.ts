import { defineConfig, devices } from '@playwright/test'
import base from './pt27.3.config'

/**
 * AP30 PT30.2 — Browser-/Geraete-Matrix: dieselben Kernjourneys wie PT27.3 (eigener Build,
 * Backend im erzwungenen Trockenlauf, eigene Datenbank) in Firefox, WebKit und auf den
 * Geraeteprofilen iPhone (WebKit), Android (Chromium), iPad (WebKit) und kleiner Mobilbreite.
 * Echte Geraete und Safari-Desktop ersetzt das nicht — die bleiben manuell (Owner).
 *
 *   npx playwright test --config e2e/ap30-matrix.config.ts --project firefox-desktop \
 *     --project webkit-desktop --project ipad-mini
 *   npx playwright test --config e2e/ap30-matrix.config.ts --project iphone-15 \
 *     --project android-pixel-7 --project small-mobile-320
 *
 * In zwei Laeufen: alle sechs Profile am Stueck schicken ~40 Formularanfragen von einer Adresse,
 * die letzten laufen in die Ratenbegrenzung des Backends (gemessen 2026-10-16).
 */
// Der Basis-Config fehlt nichts ausser dem festen Chromium-Kanal; jedes Projekt bringt seine
// eigene Engine mit.
// Gespeicherte Entscheidung „Nur notwendige" (src/lib/consentState.ts, CONSENT_VERSION 2).
const NECESSARY_ONLY = {
  cookies: [],
  origins: [
    {
      origin: `http://127.0.0.1:${Number(process.env.E2E_PORT ?? 3737)}`,
      localStorage: [
        {
          name: 'cookie-consent',
          value: JSON.stringify({
            version: 2,
            decidedAt: '2026-10-16T00:00:00.000Z',
            analytics: false,
            marketing: false,
          }),
        },
      ],
    },
  ],
}

const use = { ...base.use }
delete use.channel

export default defineConfig({
  ...base,
  use,
  projects: [
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    // WebKit scrollt den Absenden-Knopf des Epigenetik-Formulars (1280×720) unter den fixierten
    // Banner und klickt nach mehreren abgefangenen Versuchen ins Leere (Trace 2026-10-16: kein
    // POST). Gespeicherte Entscheidung wie bei iPad und Mobil; Banner-Verhalten pruefen PT27.4/PT24.
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], storageState: NECESSARY_ONLY } },
    // iPad (768 px) zeigt das Epigenetik-Kontaktkapitel einspaltig; seit der ndu-Clinic-Karte
    // (SC-004) landet die Einwilligungs-Checkbox beim Scrollen unter dem fixierten Banner.
    // Gleiche Begruendung wie bei den schmalen Profilen unten; die Desktop-Kopfzeile bleibt.
    { name: 'ipad-mini', use: { ...devices['iPad Mini'], storageState: NECESSARY_ONLY } },
    // Schmale Profile: wie ein wiederkehrender Besucher mit getroffener Cookie-Entscheidung
    // („Nur notwendige"). Ohne sie liegt der fixierte Banner ueber dem Absenden-Knopf am
    // Seitenende — ein echter Nutzer beantwortet ihn zuerst; das Verhalten des Banners selbst
    // pruefen PT27.4/PT24. Die Epigenetik- und Support-Journey starten ueber Links der
    // Desktop-Kopfzeile (mobil im Menue) und laufen deshalb nur auf den breiten Profilen.
    ...[
      ['iphone-15', devices['iPhone 15']],
      ['android-pixel-7', devices['Pixel 7']],
      [
        'small-mobile-320',
        {
          ...devices['Desktop Chrome'],
          viewport: { width: 320, height: 640 },
          isMobile: false,
          hasTouch: true,
        },
      ],
    ].map(([name, device]) => ({
      name: name as string,
      grepInvert: /PT27\.3 · (Epigenetik|Support) /,
      use: { ...(device as object), storageState: NECESSARY_ONLY },
    })),
  ],
})
