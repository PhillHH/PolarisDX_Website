import { expect, test, type Page } from '@playwright/test'

import { GTM_TEST_CONTAINER } from './ap23-closure.config'

/**
 * AP23-CLOSURE — was nur der Browser beweisen kann, neu gemessen.
 *
 * Kein PT-PASS wird uebernommen. Der Container ist synthetisch; ein Lauf
 * gegen einen echten Container haette dessen Auswertung verschmutzt.
 */

const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices|googlesyndication|facebook\.(com|net)|linkedin\.com|hotjar|segment\.io|hihuman/i

const record = (page: Page): string[] => {
  const seen: string[] = []
  page.on('request', (r) => {
    if (PROVIDER.test(r.url())) seen.push(r.url())
  })
  return seen
}

const accept = (page: Page) => page.getByRole('button', { name: /alle akzeptieren/i }).click()
const reject = (page: Page) => page.getByRole('button', { name: /nur notwendige/i }).click()

test.describe('AP23-CLOSURE · Ladeverzicht', () => {
  test('kontaktiert vor Consent keinen Provider — 8 Seiten, 3 Sprachen', async ({ page }) => {
    const seen = record(page)
    for (const p of [
      '/de/',
      '/de/contact',
      '/de/support',
      '/de/epigenetics',
      '/de/downloads',
      '/de/consumer/inside-out-duo',
      '/en/',
      '/pl/',
    ]) {
      await page.goto(p, { waitUntil: 'networkidle' })
      await page.waitForTimeout(350)
    }
    expect(seen, seen.join(', ')).toEqual([])
  })

  test('liefert im SSR-HTML weder Loader noch noscript-iframe noch Chat-Domain', async ({
    request,
  }) => {
    for (const p of ['/de/', '/en/', '/de/contact']) {
      const html = await (await request.get(p)).text()
      expect(html, p).not.toContain('googletagmanager.com/gtm.js')
      expect(html, p).not.toContain('googletagmanager.com/ns.html')
      expect(html, p).not.toMatch(/<noscript>[\s\S]*googletagmanager/i)
      expect(html, p).not.toMatch(/hihuman/i)
    }
  })

  test('fordert ohne JavaScript keinen Provider an', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    const seen = record(page)
    await page.goto('/de/', { waitUntil: 'load' })
    await page.waitForTimeout(500)
    await ctx.close()
    expect(seen, seen.join(', ')).toEqual([])
  })

  test('puffert vor Consent nichts', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    const state = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: unknown[]; gtag?: unknown }
      return {
        dataLayer: w.dataLayer === undefined ? 'absent' : `len=${w.dataLayer.length}`,
        gtag: typeof w.gtag,
        keys: [...Object.keys(localStorage), ...Object.keys(sessionStorage)].filter((k) =>
          /event|queue|analytics|gtm|_ga|track/i.test(k),
        ),
      }
    })
    expect(state.dataLayer).toBe('absent')
    expect(state.gtag).toBe('undefined')
    expect(state.keys).toEqual([])
  })
})

test.describe('AP23-CLOSURE · Consent-Zustaende', () => {
  test('Ablehnung: kein Provider, auch nach Reload', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const seen = record(page)
    await reject(page)
    await page.waitForTimeout(400)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    expect(seen, seen.join(', ')).toEqual([])
    const stored = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(JSON.parse(stored ?? '{}')).toMatchObject({ analytics: false, marketing: false })
  })

  test('Zustimmung: genau der konfigurierte Container, genau einmal', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const seen = record(page)
    await accept(page)
    await page.waitForTimeout(1200)
    const gtm = seen.filter((u) => u.includes('gtm.js'))
    expect(gtm.length).toBeGreaterThan(0)
    expect(gtm[0]).toContain(`id=${GTM_TEST_CONTAINER}`)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    expect(
      await page.evaluate(() => document.querySelectorAll('#google-tag-manager-script').length),
    ).toBe(1)
  })

  test('Widerruf: erreichbar, stellt den Ausgangszustand her, sendet danach nichts', async ({
    page,
  }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await accept(page)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: /cookie-einstellungen/i }).click()
    await page.getByRole('button', { name: /einwilligung widerrufen/i }).click()
    await page.waitForTimeout(1200)
    expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBeNull()

    const seen = record(page)
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    expect(seen, seen.join(', ')).toEqual([])
  })
})

test.describe('AP23-CLOSURE · Ereignisse nach Zustimmung', () => {
  test('meldet je SPA-Navigation genau EINEN Seitenaufruf und keinen bei reinem Parameterwechsel', async ({
    page,
  }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await accept(page)
    await page.waitForTimeout(1200)

    // Der Container ist synthetisch und antwortet nicht mit echtem gtag —
    // gemessen wird deshalb der dataLayer, den der Loader angelegt hat.
    await page.evaluate(() => {
      const w = window as unknown as { __ev: unknown[]; gtag?: (...a: unknown[]) => void }
      w.__ev = []
      w.gtag = (...args: unknown[]) => w.__ev.push(args)
    })

    await page
      .getByRole('link', { name: /kontakt/i })
      .first()
      .click()
    await page.waitForURL('**/contact')
    await page.waitForTimeout(600)
    const nachNavigation = await page.evaluate(
      () =>
        ((window as unknown as { __ev: unknown[][] }).__ev ?? []).filter(
          (a) => a[0] === 'event' && a[1] === 'page_view',
        ).length,
    )
    expect(nachNavigation).toBe(1)

    // Reiner Parameterwechsel auf demselben Pfad: KEIN zweiter Seitenaufruf.
    await page.evaluate(() => window.history.pushState({}, '', '?intent=quote'))
    await page.waitForTimeout(600)
    const nachParameter = await page.evaluate(
      () =>
        ((window as unknown as { __ev: unknown[][] }).__ev ?? []).filter(
          (a) => a[0] === 'event' && a[1] === 'page_view',
        ).length,
    )
    expect(nachParameter).toBe(1)
  })

  test('meldet contact_submit GENAU EINMAL und erst nach der Serverannahme', async ({ page }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await accept(page)
    await page.waitForTimeout(1000)
    await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: unknown[] }
      w.dataLayer = w.dataLayer ?? []
      w.dataLayer.length = 0
    })

    const submission = page.waitForResponse(
      (r) => r.url().includes('/api/contact') && r.request().method() === 'POST',
    )
    await page.locator('#name').fill('Dr. Ada Beispiel')
    await page.locator('#company').fill('Praxis Nord')
    await page.locator('#email').fill('ada@praxis.example')
    await page.getByRole('button', { name: 'Dental', exact: true }).click()
    await page.locator('#requirements').fill('Bitte um ein Angebot fuer ein POC-Panel.')
    await page.locator('#consent').check()
    await page.locator('button[type="submit"]').click()

    expect((await submission).status()).toBe(202)
    await page.waitForTimeout(800)

    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? [])
        .filter((e) => e && typeof e === 'object' && 'event' in e)
        .map((e) => e.event),
    )
    expect(events.filter((e) => e === 'contact_submit')).toHaveLength(1)

    // Keine PII in der Nutzlast.
    const payload = JSON.stringify(
      await page.evaluate(() => (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []),
    )
    expect(payload).not.toContain('ada@praxis.example')
    expect(payload).not.toContain('Praxis Nord')
    expect(payload).not.toContain('POC-Panel')
  })

  test('haelt den Geschaeftsvorgang von der Analytics-Einwilligung unabhaengig', async ({
    page,
  }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await reject(page)
    const submission = page.waitForResponse(
      (r) => r.url().includes('/api/contact') && r.request().method() === 'POST',
    )
    await page.locator('#name').fill('Dr. Ada Beispiel')
    await page.locator('#company').fill('Praxis Nord')
    await page.locator('#email').fill('ada@praxis.example')
    await page.getByRole('button', { name: 'Dental', exact: true }).click()
    await page.locator('#requirements').fill('Bitte um ein Angebot.')
    await page.locator('#consent').check()
    await page.locator('button[type="submit"]').click()
    expect((await submission).status()).toBe(202)
  })
})

test.describe('AP23-CLOSURE · x10 und A11y des Einwilligungsdialogs', () => {
  const LOCALES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']

  test('zeigt den Dialog in allen zehn Sprachen mit Namen und drei Knoepfen', async ({ page }) => {
    for (const locale of LOCALES) {
      await page.context().clearCookies()
      await page.goto(`/${locale}/`, { waitUntil: 'networkidle' })
      await page.evaluate(() => localStorage.clear())
      await page.reload({ waitUntil: 'networkidle' })

      const banner = page.locator('section[aria-labelledby="cookie-banner-title"]')
      await expect(banner, locale).toBeVisible()
      // Drei Entscheidungen: ablehnen, annehmen, einstellen.
      const buttons = banner.locator('button')
      expect(await buttons.count(), locale).toBeGreaterThanOrEqual(3)
      // Kein unuebersetzter Schluessel.
      expect(await banner.textContent(), locale).not.toMatch(/cookie\.[a-z_]+/)
    }
  })

  test('ist mit der Tastatur bedienbar', async ({ page }) => {
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const settings = page.locator('button[aria-controls="cookie-settings-panel"]')
    await expect(settings).toHaveAttribute('aria-expanded', 'false')
    await settings.focus()
    await page.keyboard.press('Enter')
    await expect(settings).toHaveAttribute('aria-expanded', 'true')
    await expect(
      page.getByRole('checkbox', { name: /analyse|analytics|statistik/i }).first(),
    ).toBeVisible()
  })
})
