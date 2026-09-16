import { expect, test, type Page } from '@playwright/test'

/**
 * AP27 PT27.6 — repraesentative visuelle Zustaende, keine Route×Locale-Vollabdeckung.
 *
 * Determinismus: festes Viewport und Device-Scale (Config), reduzierte Bewegung und abgeschaltete
 * Animationen, feste Uhrzeit, entschiedene Einwilligung (kein Banner, ausser im Banner-Zustand),
 * vollstaendig geladene Schriften und sichtbare Bilder, kein Netzwerk ausser dem eigenen Server.
 *
 * Baseline-Aenderungen nur nach dem Protokoll in TESTING-CONTRACT §22 und mit Eintrag im
 * DESIGN-SYSTEM-CHANGELOG (Gate `check:visual-changelog`). `--update-snapshots` ist keine
 * Fehlerbehebung.
 */

const FIXED_TIME = new Date('2026-09-15T08:00:00.000Z')
const DECIDED_CONSENT = JSON.stringify({
  version: 2,
  decidedAt: '2026-09-15T08:00:00.000Z',
  analytics: false,
  marketing: false,
})

async function prepare(page: Page, { consentDecided = true } = {}) {
  await page.clock.setFixedTime(FIXED_TIME)
  if (consentDecided) {
    await page.addInitScript(
      (value) => window.localStorage.setItem('cookie-consent', value),
      DECIDED_CONSENT,
    )
  }
  // Fremde Hosts sind fuer diese Zustaende nie noetig; ein Treffer waere ein Befund, kein Bild.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort())
}

/** Wartet auf Netzruhe, Schriften und alle im Viewport sichtbaren Bilder. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(async () => {
    const visible = [...document.images].filter((image) => {
      const box = image.getBoundingClientRect()
      return box.bottom > 0 && box.top < window.innerHeight && box.width > 0
    })
    await Promise.all(
      visible.map((image) =>
        image.complete
          ? image.decode().catch(() => undefined)
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }),
      ),
    )
  })
}

/** Klick nach Hydration: wiederholt nur, solange der Zielzustand noch nicht da ist. */
async function openUntil(page: Page, click: () => Promise<void>, visible: () => Promise<boolean>) {
  await expect(async () => {
    if (!(await visible())) await click()
    expect(await visible()).toBe(true)
  }).toPass({ timeout: 20_000 })
}

const PAGES = [
  { name: 'home', path: '/de/' },
  { name: 'diagnostics-hub', path: '/de/diagnostics' },
  { name: 'service-detail', path: '/de/diagnostics/dental' },
  { name: 'igloo-pro', path: '/de/igloo-pro' },
  { name: 'epigenetics-hub', path: '/de/epigenetics' },
  { name: 'musterbefund', path: '/de/epigenetics/musterbefund/metabolic-health' },
  { name: 'article', path: '/de/articles/die-gruene-praxis' },
  { name: 'resource-center', path: '/de/downloads' },
  { name: 'contact', path: '/de/contact' },
  { name: 'support', path: '/de/support' },
  { name: 'legal-privacy', path: '/de/privacy' },
  { name: 'consumer-spray', path: '/de/consumer/vitamin-d3-spray' },
] as const

test.describe('PT27.6 · Seiten (Desktop 1280×800)', () => {
  for (const state of PAGES) {
    test(state.name, async ({ page }) => {
      await prepare(page)
      const response = await page.goto(state.path)
      expect(response?.status()).toBe(200)
      await settle(page)
      await expect(page).toHaveScreenshot(`${state.name}-desktop.png`)
    })
  }

  test('not-found', async ({ page }) => {
    await prepare(page)
    const response = await page.goto('/de/__pt276-visual-404__')
    expect(response?.status()).toBe(404)
    await settle(page)
    await expect(page).toHaveScreenshot('not-found-desktop.png')
  })
})

test.describe('PT27.6 · Zustaende (Desktop 1280×800)', () => {
  test('epigenetics-panel', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/epigenetics')
    await settle(page)
    await page.locator('[data-panel-slug="healthy-aging"]').scrollIntoViewIfNeeded()
    await settle(page)
    await expect(page).toHaveScreenshot('epigenetics-panel-desktop.png')
  })

  test('resource-gate-open', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/downloads')
    await settle(page)
    const trigger = page.locator('button[data-gate-asset]').first()
    await openUntil(
      page,
      () => trigger.click(),
      () => page.locator('[data-gate-state="form"]').isVisible(),
    )
    await page.locator('[data-gate-state="form"]').scrollIntoViewIfNeeded()
    await settle(page)
    await expect(page).toHaveScreenshot('resource-gate-open-desktop.png')
  })

  test('diagnostics-megamenu-open', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/')
    await settle(page)
    const trigger = page.locator('header button[data-submenu-trigger]').first()
    await openUntil(
      page,
      () => trigger.click(),
      async () => (await trigger.getAttribute('aria-expanded')) === 'true',
    )
    await settle(page)
    await expect(page).toHaveScreenshot('diagnostics-megamenu-open-desktop.png')
  })

  test('search-dialog-open', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/')
    await settle(page)
    await openUntil(
      page,
      () => page.getByRole('button', { name: 'Suche öffnen' }).first().click(),
      () => page.getByRole('dialog', { name: 'Website durchsuchen' }).isVisible(),
    )
    await page.getByRole('searchbox', { name: 'Suchbegriff' }).fill('Epigenetik')
    await expect(page.getByRole('dialog').locator('a[href="/de/epigenetics"]')).toBeVisible()
    await settle(page)
    await expect(page).toHaveScreenshot('search-dialog-open-desktop.png')
  })

  test('cookie-banner', async ({ page }) => {
    await prepare(page, { consentDecided: false })
    await page.goto('/de/')
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toBeVisible()
    await settle(page)
    await expect(page).toHaveScreenshot('cookie-banner-desktop.png')
  })
})

test.describe('PT27.6 · Mobil (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('home-mobile', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/')
    await settle(page)
    await expect(page).toHaveScreenshot('home-mobile.png')
  })

  test('navigation-open-mobile', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/')
    await settle(page)
    const toggle = page.getByRole('button', { name: 'Navigation umschalten' })
    await openUntil(
      page,
      () => toggle.click(),
      async () => (await toggle.getAttribute('aria-expanded')) === 'true',
    )
    await settle(page)
    await expect(page).toHaveScreenshot('navigation-open-mobile.png')
  })

  test('consumer-spray-mobile', async ({ page }) => {
    await prepare(page)
    await page.goto('/de/consumer/vitamin-d3-spray')
    await settle(page)
    await expect(page).toHaveScreenshot('consumer-spray-mobile.png')
  })
})
