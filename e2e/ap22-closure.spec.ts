import { expect, test } from '@playwright/test'

/**
 * AP22-CLOSURE — was nur ein echter Browser beweisen kann.
 *
 * Die Node-Suiten messen Persistenz, Idempotenz, Outbox und Datenschutz.
 * Zwei Zusicherungen entziehen sich ihnen vollstaendig:
 *
 *  1. **Welche Fremd-Origins der Browser VOR einer Einwilligung kontaktiert.**
 *     Das ist keine Codefrage, sondern eine Netzfrage — ein Tag-Manager kann
 *     im Quelltext consent-gated aussehen und trotzdem laden.
 *  2. **Ob eine ABGELEHNTE Analytics-Einwilligung den Geschaeftsvorgang
 *     blockiert.** Ein Formular, das nach „Nur notwendige" nicht mehr
 *     absendet, waere ein Datenschutz-Feature, das Leads kostet.
 *
 * Gemessen gegen den Produktionsbuild und ein echtes Backend mit leerem
 * Providerschluessel.
 */

/** Nicht-essenzielle Drittanbieter, die vor Consent nicht auftauchen duerfen. */
const FORBIDDEN_ORIGINS =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|hihuman|facebook\.|hotjar|segment\.io/i

/** Seiten, hinter denen eine Lead-Journey haengt. */
const JOURNEY_PAGES = [
  '/de/',
  '/de/contact',
  '/de/support',
  '/de/epigenetics',
  '/de/downloads',
  '/de/consumer/inside-out-duo',
]

test.describe('AP22-CLOSURE · Netz vor Consent', () => {
  test('kontaktiert auf keiner Journey-Seite einen Analytics-/Marketing-Anbieter', async ({
    page,
  }) => {
    const external: string[] = []
    page.on('request', (request) => {
      if (FORBIDDEN_ORIGINS.test(request.url())) external.push(request.url())
    })

    for (const path of JOURNEY_PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      // Der Banner steht — es gibt also noch keine Entscheidung.
      await page.waitForTimeout(600)
    }

    expect(external, `Pre-Consent-Requests: ${external.join(', ')}`).toEqual([])
  })

  test('laedt auch nach ABLEHNUNG keinen Anbieter nach', async ({ page }) => {
    const external: string[] = []
    page.on('request', (request) => {
      if (FORBIDDEN_ORIGINS.test(request.url())) external.push(request.url())
    })

    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    const reject = page.getByRole('button', { name: /nur notwendige/i })
    await reject.click()
    await page.waitForTimeout(800)
    await page.goto('/de/support', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    expect(external, `Requests nach Ablehnung: ${external.join(', ')}`).toEqual([])
  })
})

test.describe('AP22-CLOSURE · Geschaeftsvorgang ohne Analytics-Einwilligung', () => {
  test('nimmt eine Kontaktanfrage nach "Nur notwendige" unveraendert an', async ({ page }) => {
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /nur notwendige/i }).click()

    // Der Server bleibt die Wahrheit: gemessen wird die echte Antwort.
    const submission = page.waitForResponse(
      (response) =>
        response.url().includes('/api/contact') && response.request().method() === 'POST',
    )

    // Feste IDs statt Label-Heuristik: `getByLabel` traf sonst die
    // aria-label-Sektion statt des Eingabefeldes.
    await page.locator('#name').fill('Dr. Ada Beispiel')
    await page.locator('#company').fill('Praxis Nord')
    await page.locator('#email').fill('ada@praxis.example')
    // Fachbereich ist eine Pflichtauswahl aus Pill-Buttons, kein <select>.
    await page.getByRole('button', { name: 'Dental', exact: true }).click()
    await page.locator('#requirements').fill('Bitte um ein Angebot fuer ein POC-Panel.')

    // Die Verarbeitungs-Einwilligung ist eine ANDERE Zustimmung als die
    // abgelehnte Analytics-Einwilligung — genau das wird hier gemessen.
    await page.locator('#consent').check()
    // Marketing bleibt bewusst UNgesetzt.
    await expect(page.locator('#marketing-consent')).not.toBeChecked()

    // `type=submit` statt Namensregex: die Absende-Beschriftung ("Angebot
    // anfragen") ist identisch mit der Intent-Pille "Angebot" darueber, und
    // eine Namenssuche traf zuerst die Pille — geklickt wurde dann nichts,
    // was absendet.
    await page.locator('button[type="submit"]').click()

    const response = await submission
    expect(response.status(), 'Der Vorgang wird angenommen, obwohl Analytics abgelehnt ist').toBe(
      202,
    )
    const json = (await response.json()) as Record<string, unknown>
    expect(json.success).toBe(true)
    expect(json.journey).toBe('contact')
    // Kein Provider konfiguriert — die Antwort behauptet keine Zustellung.
    expect(json.providerConfigured).toBe(false)
  })
})

test.describe('AP22-CLOSURE · Chat im ausgelieferten Produktionsbuild', () => {
  test('rendert kein Chat-Element und fordert kein Chat-Bundle an', async ({ page }) => {
    const chatRequests: string[] = []
    page.on('request', (request) => {
      if (/hihuman|\/api\/chat/i.test(request.url())) chatRequests.push(request.url())
    })
    for (const path of ['/de/', '/de/contact', '/en/']) {
      await page.goto(path, { waitUntil: 'networkidle' })
    }
    expect(chatRequests).toEqual([])
    expect(
      await page.evaluate(
        () => document.querySelectorAll('[id*="chat" i], [class*="chat" i]').length,
      ),
    ).toBe(0)
  })

  test('beantwortet POST /api/chat auch durch den Produktions-Proxy mit 404', async ({
    request,
  }) => {
    const response = await request.post('/api/chat', { data: { message: 'hallo' } })
    expect(response.status()).toBe(404)
  })
})
