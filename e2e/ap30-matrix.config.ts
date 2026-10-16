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
const use = { ...base.use }
delete use.channel

export default defineConfig({
  ...base,
  use,
  projects: [
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'iphone-15', use: { ...devices['iPhone 15'] } },
    { name: 'android-pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'ipad-mini', use: { ...devices['iPad Mini'] } },
    {
      name: 'small-mobile-320',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 320, height: 640 },
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
})
