import { defineConfig, devices } from '@playwright/test'
import base from './pt27.3.config'

/**
 * AP30 PT30.2 — Browser-/Geraete-Matrix: dieselben Kernjourneys wie PT27.3 (eigener Build,
 * Backend im erzwungenen Trockenlauf, eigene Datenbank) in Firefox, WebKit und auf den
 * Geraeteprofilen iPhone (WebKit), Android (Chromium), iPad (WebKit) und kleiner Mobilbreite.
 * Echte Geraete und Safari-Desktop ersetzt das nicht — die bleiben manuell (Owner).
 *
 *   npx playwright test --config e2e/ap30-matrix.config.ts
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
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'ipad-mini', use: { ...devices['iPad Mini'] } },
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
