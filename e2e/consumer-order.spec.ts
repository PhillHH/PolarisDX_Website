import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page, type Request, type Route } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { CONSUMER_PRODUCTS, type ConsumerProductKey } from '../src/content/consumer/products'

/**
 * AP21 PT21.5 — die Bestellstrecke im Browser.
 *
 * Die Endpunktwahrheit (Persistenz, Idempotenz, Retry, Rate Limit,
 * Provider-Ehrlichkeit) liegt in `server/consumer-order.test.js` und
 * `server/consumer-order.endpoint.test.js`. Hier wird gemessen, was der
 * Client wirklich tut: welche Nutzlast rausgeht, dass eine Bestellung OHNE
 * Analytics-Einwilligung vollstaendig durchlaeuft, dass vor der
 * Einwilligung KEIN Providerrequest entsteht, dass ein Doppelklick nur
 * eine Anfrage erzeugt und dass die Systemcopy in allen zehn Sprachen
 * existiert statt auf Englisch zu kippen.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const PRODUCTS: ConsumerProductKey[] = ['spray', 'masks', 'duo']

/** Provider-Hosts, die vor einer Einwilligung nicht kontaktiert werden duerfen. */
const PROVIDER_HOSTS =
  /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|facebook\.(com|net)|connect\.facebook|linkedin\.com|licdn\.com|hotjar|clarity\.ms/i

const bundle = (locale: string): Record<string, string> =>
  JSON.parse(readFileSync(`public/locales/${locale}/consumer.json`, 'utf8')) as Record<
    string,
    string
  >

async function settle(page: Page) {
  const settled = () =>
    page.waitForFunction(() =>
      [...document.querySelectorAll('body *')].every((node) => {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity)
        return opacity === 1 || opacity === 0
      }),
    )
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await settled()
  await page.evaluate(() => window.scrollTo(0, 0))
  await settled()
  await settled()
}

/** Faengt den Bestellrequest ab und antwortet wie der echte Endpunkt (202). */
async function stubOrderApi(
  page: Page,
  {
    status = 202,
    body = { accepted: true, orderReference: 'PDX-1234ABCD', journey: 'consumer_order' },
  } = {},
): Promise<{ requests: Request[] }> {
  const requests: Request[] = []
  await page.route('**/api/consumer-order', async (route: Route) => {
    requests.push(route.request())
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
  return { requests }
}

/** Oeffnet das Bestellformular und fuellt die Pflichtfelder aus. */
async function openAndFillForm(page: Page, product: ConsumerProductKey) {
  const trigger = page.locator(`main [data-gtm-page="${product}"]`).first()
  await expect(trigger).toBeVisible()
  await expect(async () => {
    if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
    await expect(page.locator('form input[type="email"]')).toHaveCount(1)
  }).toPass({ timeout: 20_000 })

  const form = page.locator('form').filter({ has: page.locator('input[type="email"]') })
  // Gezielt ueber die IDs: das erste `input[type="text"]` im Formular ist der
  // Honeypot, nicht das Namensfeld.
  await form.locator('#order-name').fill('Testkundin')
  await form.locator('#order-email').fill('kundin@example.com')
  await expect(form.locator('#consumer-hp')).toHaveValue('')
  return form
}

test.describe('PT21.5 Consumer Ordering', () => {
  test('sendet allowlistete IDs statt freier Labels — Produkt, Variante, Menge', async ({
    page,
  }) => {
    for (const product of PRODUCTS) {
      const { requests } = await stubOrderApi(page)
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`)
      const form = await openAndFillForm(page, product)
      await form.locator('input[type="checkbox"]').first().check()
      await form.locator('button[type="submit"]').click()

      await expect.poll(() => requests.length, { timeout: 20_000 }).toBe(1)
      const payload = requests[0].postDataJSON() as Record<string, unknown>

      expect(payload.product, `${product}: stabile Bestell-ID`).toBe(
        CONSUMER_PRODUCTS[product].orderId,
      )
      expect(payload.variant, `${product}: allowlistete Variante`).toBe(
        CONSUMER_PRODUCTS[product].orderVariant,
      )
      // Die Menge ist eine Zahl oder der Beratungsfall — nie ein Satz.
      expect([1, 2, 3, 'MORE'], `${product}: Menge allowlistet`).toContain(payload.quantity)
      expect(String(payload.quantity), `${product}: kein Freitext`).not.toContain(' ')
      // Und der alte Freitextkanal existiert nicht mehr.
      expect(Object.keys(payload)).not.toContain('quantityLabel')
      // Verarbeitungs-Consent getrennt vom Marketing-Consent.
      expect(payload.processingConsent).toBe(true)
      expect(payload.marketingConsent).toBe(false)
      expect(String(payload.consentAcceptedAt)).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      await page.unrouteAll()
    }
  })

  test('schickt einen stabilen Idempotency-Key als Header', async ({ page }) => {
    const { requests } = await stubOrderApi(page)
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openAndFillForm(page, 'duo')
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    await expect.poll(() => requests.length, { timeout: 20_000 }).toBe(1)
    const key = requests[0].headers()['idempotency-key']
    expect(key, 'Idempotency-Key gesetzt').toBeTruthy()
    expect(key.length).toBeGreaterThan(8)
  })

  test('erzeugt beim Doppelklick genau EINE Bestellanfrage', async ({ page }) => {
    const requests: Request[] = []
    await page.route('**/api/consumer-order', async (route: Route) => {
      requests.push(route.request())
      // Langsame Antwort: genau das Zeitfenster, in dem ein State-Guard
      // in die Stale Closure laufen wuerde.
      await new Promise((resolve) => setTimeout(resolve, 1_200))
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({ accepted: true, orderReference: 'PDX-DEADBEEF' }),
      })
    })

    await page.goto('/de/consumer/hydrating-masks')
    const form = await openAndFillForm(page, 'masks')
    await form.locator('input[type="checkbox"]').first().check()
    const submit = form.locator('button[type="submit"]')
    await submit.click({ noWaitAfter: true })
    await submit.click({ noWaitAfter: true, force: true }).catch(() => {})
    await submit.click({ noWaitAfter: true, force: true }).catch(() => {})

    await page.waitForTimeout(3_000)
    expect(requests).toHaveLength(1)
  })

  test('Bestellung OHNE Consent-Entscheidung laeuft vollstaendig durch', async ({ page }) => {
    const { requests } = await stubOrderApi(page)
    const providerRequests: string[] = []
    page.on('request', (request) => {
      if (PROVIDER_HOSTS.test(request.url())) providerRequests.push(request.url())
    })

    await page.goto('/de/consumer/vitamin-d3-spray')
    // Der Cookie-Banner steht unbeantwortet — keine Analytics-Einwilligung.
    const consentStored = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(consentStored, 'keine Consent-Entscheidung getroffen').toBeNull()

    const form = await openAndFillForm(page, 'spray')
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    // Die Bestellung geht raus und wird als angenommen angezeigt.
    await expect.poll(() => requests.length, { timeout: 20_000 }).toBe(1)
    const copy = bundle('de')
    await expect(page.getByText(copy['order_form.copy_011'])).toBeVisible({ timeout: 20_000 })

    // Und dabei entsteht KEIN Providerrequest — weder beim Laden noch beim
    // Oeffnen des Formulars noch beim Absenden.
    expect(providerRequests).toEqual([])
    // Auch kein Analytics-Event im dataLayer.
    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? [])
        .map((entry) => String(entry.event ?? ''))
        .filter((name) => name.startsWith('consumer_')),
    )
    expect(events, 'kein Consumer-Event vor der Einwilligung').toEqual([])
  })

  test('meldet Erfolg wahrheitsgemaess: Anfrage eingegangen, kein Kauf', async ({ page }) => {
    await stubOrderApi(page)
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openAndFillForm(page, 'duo')
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    const copy = bundle('de')
    await expect(page.getByText(copy['order_form.copy_011'])).toBeVisible({ timeout: 20_000 })
    // Die Vorgangsnummer aus der Serverantwort wird genannt.
    await expect(page.getByText('PDX-1234ABCD')).toBeVisible()
    // Und ausdruecklich kein Kaufvertrag behauptet.
    await expect(page.getByText(copy['order_form.success_not_purchase'])).toBeVisible()
  })

  test('zeigt bei einem retryfaehigen Serverfehler die Wiederholungsmeldung, nicht Erfolg', async ({
    page,
  }) => {
    await stubOrderApi(page, { status: 503, body: { accepted: false, code: 'UNAVAILABLE' } })
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openAndFillForm(page, 'duo')
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    const copy = bundle('de')
    const alert = page.locator('[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 20_000 })
    await expect(alert).toHaveText(copy['order_form.error_retryable'])
    await expect(page.getByText(copy['order_form.copy_011'])).toHaveCount(0)
  })

  test('zeigt bei einem Idempotency-Konflikt die terminale Meldung', async ({ page }) => {
    await stubOrderApi(page, {
      status: 409,
      body: { accepted: false, code: 'IDEMPOTENCY_CONFLICT' },
    })
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openAndFillForm(page, 'duo')
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    const copy = bundle('de')
    await expect(page.locator('[role="alert"]')).toHaveText(copy['order_form.error_terminal'], {
      timeout: 20_000,
    })
  })

  test('blockiert das Absenden ohne Verarbeitungs-Consent — clientseitig und ohne Request', async ({
    page,
  }) => {
    const { requests } = await stubOrderApi(page)
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openAndFillForm(page, 'duo')
    // Consent-Haken bewusst NICHT setzen.
    await form.locator('button[type="submit"]').click()

    const copy = bundle('de')
    await expect(page.locator('[role="alert"]')).toHaveText(copy['order_form.consent_required'], {
      timeout: 20_000,
    })
    await page.waitForTimeout(500)
    expect(requests, 'kein Request ohne Consent').toHaveLength(0)
  })

  test('haelt die Bestell-Systemcopy in allen zehn Sprachen echt vor', async () => {
    const keys = [
      'order_form.consent_required',
      'order_form.email_invalid',
      'order_form.required_fields',
      'order_form.sending',
      'order_form.submit',
      'order_form.copy_011',
      'order_form.copy_012',
      'order_form.error_retryable',
      'order_form.error_terminal',
      'order_form.marketing_consent',
      'order_form.reference_label',
      'order_form.success_not_purchase',
    ]
    const de = bundle('de')
    for (const locale of SUPPORTED_LANGUAGES) {
      const copy = bundle(locale)
      for (const key of keys) {
        expect(copy[key], `${locale}: ${key} vorhanden`).toBeTruthy()
        if (locale !== 'de') {
          // Kein Dauerfallback auf die deutsche Fassung.
          expect(copy[key], `${locale}: ${key} nicht DE-Kopie`).not.toBe(de[key])
        }
      }
      // Und keine Kauf-/Zahlungsbehauptung in der Erfolgsmeldung.
      expect(copy['order_form.success_not_purchase'].length).toBeGreaterThan(40)
    }
  })

  test('rendert das Bestellformular lokalisiert und ohne Kaufversprechen', async ({ page }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}/consumer/inside-out-duo`)
      const form = await openAndFillForm(page, 'duo')
      const copy = bundle(locale)
      const formText = (await form.evaluate((node) => node.textContent)) ?? ''
      expect(formText, `${locale}: Marketing-Consent sichtbar`).toContain(
        copy['order_form.marketing_consent'],
      )
      expect(formText, `${locale}: Verarbeitungs-Consent sichtbar`).toContain(
        copy['order_form.copy_030'],
      )
      expect(formText, `${locale}: Hinweis auf spaetere Preisbestaetigung`).toContain(
        copy['order_form.copy_033'],
      )
    }
  })

  test('A11y: Axe serious/critical 0 im geoeffneten Bestellformular', async ({ page }) => {
    await page.goto('/de/consumer/inside-out-duo')
    await openAndFillForm(page, 'duo')
    await settle(page)
    await page.addScriptTag({ path: axePath })
    const findings = await page.evaluate(async () => {
      const results = await (
        window as unknown as { axe: { run: (o: unknown) => Promise<{ violations: unknown[] }> } }
      ).axe.run({ resultTypes: ['violations'] })
      return (
        results.violations as Array<{
          id: string
          impact: string
          nodes: Array<{ target: string[]; failureSummary?: string }>
        }>
      )
        .filter((violation) => ['serious', 'critical'].includes(violation.impact))
        .map((v) => `${v.id} :: ${v.nodes[0]?.target.join(' ')} :: ${v.nodes[0]?.failureSummary}`)
    })
    expect(findings).toEqual([])
  })
})
