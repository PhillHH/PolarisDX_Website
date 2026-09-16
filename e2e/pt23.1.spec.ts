import { expect, test, type Page } from '@playwright/test'

import { GTM_TEST_CONTAINER } from './pt23.1.config'

/**
 * AP23 PT23.1 — Basic Consent Mode v2, gemessen am Netz.
 *
 * Der Unterschied zwischen Basic und Advanced Mode ist an der Quelle nicht
 * ablesbar: beide Varianten setzen `consent default denied`. Nur der Browser
 * zeigt, ob der Container trotzdem geladen wurde. Deshalb steht hier die
 * Beweislast — nicht in einem Unit-Test.
 */

/** Alle nicht-essenziellen Fremd-Origins, die vor Consent verboten sind. */
const PROVIDER_ORIGINS =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices|googlesyndication|facebook\.(com|net)|linkedin\.com|hotjar|segment\.io|hihuman/i

/** Seiten, hinter denen eine Lead-Journey oder ein Consumer-Pfad haengt. */
const PAGES = [
  '/de/',
  '/de/contact',
  '/de/support',
  '/de/epigenetics',
  '/de/downloads',
  '/de/consumer/inside-out-duo',
  '/en/',
  '/pl/',
]

/** Alle Provider-Requests eines Laufs mitschreiben. */
function recordProviderRequests(page: Page): string[] {
  const seen: string[] = []
  page.on('request', (request) => {
    if (PROVIDER_ORIGINS.test(request.url())) seen.push(request.url())
  })
  return seen
}

const acceptAll = (page: Page) => page.getByRole('button', { name: /alle akzeptieren/i }).click()
const rejectAll = (page: Page) => page.getByRole('button', { name: /nur notwendige/i }).click()

// =============================================================================

test.describe('PT23.1 · vor der Einwilligung', () => {
  test('kontaktiert auf keiner Seite einen Provider — GTM, GA4, Marketing = 0', async ({
    page,
  }) => {
    const seen = recordProviderRequests(page)
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)
    }
    expect(seen, `Pre-Consent-Requests: ${seen.join(', ')}`).toEqual([])
  })

  test('liefert kein GTM-noscript-iframe aus — auch nicht im SSR-HTML', async ({ request }) => {
    // Gemessen am ROHEN Serverdokument, nicht am hydrierten DOM: ein
    // noscript-iframe wuerde genau dort stehen und ohne JavaScript laden.
    for (const path of ['/de/', '/en/', '/de/contact']) {
      const html = await (await request.get(path)).text()
      expect(html, `${path}: noscript-iframe`).not.toMatch(/<noscript>[\s\S]*googletagmanager/i)
      expect(html, `${path}: gtm.js`).not.toContain('googletagmanager.com/gtm.js')
      expect(html, `${path}: ns.html`).not.toContain('googletagmanager.com/ns.html')
      expect(html, `${path}: gtag.js`).not.toContain('googletagmanager.com/gtag/js')
      // Auch kein vorbereitender Verbindungsaufbau.
      expect(html, `${path}: preconnect`).not.toMatch(
        /rel=["'](preconnect|dns-prefetch|preload)["'][^>]*google/i,
      )
    }
  })

  test('fordert ohne JavaScript keinen Provider an', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    const seen = recordProviderRequests(page)
    await page.goto('/de/', { waitUntil: 'load' })
    await page.waitForTimeout(600)
    await context.close()
    expect(seen, `no-JS-Requests: ${seen.join(', ')}`).toEqual([])
  })

  test('puffert nichts — kein dataLayer, kein Speicher, keine Warteschlange', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Auf mehreren Seiten navigieren und dabei Ereignisse provozieren.
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await page.goto('/de/consumer/inside-out-duo', { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)

    const state = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: unknown[]; gtag?: unknown }
      const storageKeys = [
        ...Object.keys(window.localStorage),
        ...Object.keys(window.sessionStorage),
      ]
      return {
        dataLayer: w.dataLayer === undefined ? 'absent' : `len=${w.dataLayer.length}`,
        gtag: typeof w.gtag,
        storageKeys,
        indexedDbAvailable: typeof indexedDB !== 'undefined',
      }
    })

    // Kein dataLayer heisst: es gibt nicht einmal ein Gefaess zum Puffern.
    expect(state.dataLayer).toBe('absent')
    expect(state.gtag).toBe('undefined')
    // Keine Analytics-/Ereignisspur im Speicher.
    expect(
      state.storageKeys.filter((key) => /event|queue|analytics|gtm|ga_|_ga|track/i.test(key)),
    ).toEqual([])
  })
})

test.describe('PT23.1 · nach der Entscheidung', () => {
  test('laedt nach ABLEHNUNG keinen Provider — auch nach Reload nicht', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const seen = recordProviderRequests(page)
    await rejectAll(page)
    await page.waitForTimeout(500)
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    expect(seen, `Requests nach Ablehnung: ${seen.join(', ')}`).toEqual([])
    // Die Entscheidung ist versioniert gespeichert und ueberlebt den Reload.
    const stored = await page.evaluate(() => window.localStorage.getItem('cookie-consent'))
    expect(JSON.parse(stored ?? '{}')).toMatchObject({ analytics: false, marketing: false })
    // Der Banner fragt nicht erneut.
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toHaveCount(0)
  })

  test('laedt nach ZUSTIMMUNG genau den konfigurierten Container', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const seen = recordProviderRequests(page)
    await acceptAll(page)
    await page.waitForTimeout(1200)

    const gtm = seen.filter((url) => url.includes('googletagmanager.com/gtm.js'))
    expect(gtm.length, `GTM-Requests: ${seen.join(', ')}`).toBeGreaterThan(0)
    expect(gtm[0]).toContain(`id=${GTM_TEST_CONTAINER}`)

    // Die Zustimmung ueberlebt den Reload und laedt genau EINMAL nach.
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    const scripts = await page.evaluate(
      () => document.querySelectorAll('#google-tag-manager-script').length,
    )
    expect(scripts).toBe(1)
  })
})

test.describe('PT23.1 · Widerruf', () => {
  test('ist ueber die Fusszeile erreichbar und stellt den Ausgangszustand her', async ({
    page,
  }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await page.waitForTimeout(800)
    expect(await page.evaluate(() => window.localStorage.getItem('cookie-consent'))).not.toBeNull()

    // Der Einstiegspunkt, den es vor PT23.1 nirgends gab.
    await page.getByRole('button', { name: /cookie-einstellungen/i }).click()
    await expect(page.getByRole('button', { name: /einwilligung widerrufen/i })).toBeVisible()
    await page.getByRole('button', { name: /einwilligung widerrufen/i }).click()
    await page.waitForTimeout(1200)

    // Nichts bleibt zurueck: der Zustand ist wieder "nicht entschieden".
    expect(await page.evaluate(() => window.localStorage.getItem('cookie-consent'))).toBeNull()
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toBeVisible()
  })

  test('sendet nach dem Widerruf nichts mehr', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await page.waitForTimeout(800)

    await page.getByRole('button', { name: /cookie-einstellungen/i }).click()
    await page.getByRole('button', { name: /einwilligung widerrufen/i }).click()
    await page.waitForTimeout(1200)

    // Ab hier zaehlen: nach dem Widerruf darf keine Anfrage mehr entstehen.
    const seen = recordProviderRequests(page)
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await page.goto('/de/support', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    expect(seen, `Requests nach Widerruf: ${seen.join(', ')}`).toEqual([])
  })
})

test.describe('PT23.1 · Robustheit und Unabhaengigkeit', () => {
  test('ueberlebt einen kaputten gespeicherten Zustand, statt die Seite zu zerlegen', async ({
    page,
  }) => {
    // Vor PT23.1 setzte der Banner den rohen Speicherwert in seinen State und
    // rendert daraus eine Liste — alles, was kein Array war, warf beim
    // Rendern, und zwar auf JEDER Seite.
    await page.goto('/de/', { waitUntil: 'domcontentloaded' })
    for (const corrupt of ['{kaputt', '5', 'null', '"granted"', '{"version":0}']) {
      await page.evaluate((value) => window.localStorage.setItem('cookie-consent', value), corrupt)
      await page.goto('/de/contact', { waitUntil: 'networkidle' })
      // Die Seite steht, und der Dialog fragt erneut.
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
      await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toBeVisible()
    }
  })

  test('haelt den Geschaeftsvorgang von der Analytics-Einwilligung unabhaengig', async ({
    page,
  }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await rejectAll(page)

    const submission = page.waitForResponse(
      (response) =>
        response.url().includes('/api/contact') && response.request().method() === 'POST',
    )
    await page.locator('#name').fill('Dr. Ada Beispiel')
    await page.locator('#company').fill('Praxis Nord')
    await page.locator('#email').fill('ada@praxis.example')
    await page.getByRole('button', { name: 'Dental', exact: true }).click()
    await page.locator('#requirements').fill('Bitte um ein Angebot fuer ein POC-Panel.')
    await page.locator('#consent').check()
    await page.locator('button[type="submit"]').click()

    const response = await submission
    expect(response.status()).toBe(202)
    expect((await response.json()).success).toBe(true)
  })

  test('ist mit der Tastatur bedienbar und benannt', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Der Banner ist eine benannte Region, kein anonymes <div>.
    const banner = page.getByRole('region', { name: /privatsphäre|privacy/i })
    await expect(banner).toBeVisible()

    // Ueber `aria-controls` und nicht ueber den Namen: die Beschriftung
    // wechselt beim Aufklappen von "Einstellungen" auf "Ausblenden".
    const settings = page.locator('button[aria-controls="cookie-settings-panel"]')
    await expect(settings).toHaveAttribute('aria-expanded', 'false')
    await settings.focus()
    await expect(settings).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(settings).toHaveAttribute('aria-expanded', 'true')

    // Die Schalter sind echte Checkboxen mit Namen.
    const analytics = page.getByRole('checkbox', { name: /analyse|analytics|statistik/i }).first()
    await expect(analytics).toBeVisible()
  })
})
