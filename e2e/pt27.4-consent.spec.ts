import fs from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { expect, test, type Page } from '@playwright/test'

import {
  PT274_CLIENT_DIR,
  PT274_LEAD_DB,
  PT274_PREVIEW_CONTAINER,
  PT274_PRODUCTION_CONTAINER,
  PT274_SERVER_ENTRY,
} from './pt27.4.config'

/**
 * AP27 PT27.4 — der AP23-Consent-Vertrag, dauerhaft am Netz bewiesen.
 *
 * Beweis ist die NETZ-Ebene: jede Anfrage an einen Analytics-/Marketing-Anbieter wird im Browser
 * beobachtet (`page.on('request')`) und auf Kontextebene abgefangen (`context.route`) — sie erreicht
 * nie das Internet, sondern bekommt einen leeren Stub. Damit ist jede Anfrage messbar und die
 * Verunreinigung einer echten Property ausgeschlossen. Der `dataLayer` dient nur als ZWEITE Ebene
 * fuer Ereignisinhalt und -zeitpunkt; der Stub verarbeitet ihn nicht, er bleibt also vollstaendig.
 *
 * Jeder Test beginnt in einem frischen Browserkontext (leerer Speicher, keine Entscheidung).
 */

const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|googleadservices\.com|googlesyndication\.com|facebook\.(com|net)|linkedin\.com|licdn\.com|hotjar\.com|clarity\.ms|segment\.io|hihuman/i
const GA4_COLLECT = /\/g\/collect|google-analytics\.com\/.*collect/i
const SHOP_EVENTS = ['purchase', 'add_to_cart', 'begin_checkout', 'view_item']

const require = createRequire(new URL('../server/', import.meta.url))
const Database = require('better-sqlite3')

type Net = { observed: string[]; stubbed: string[] }
type DataLayerEntry = unknown[] | Record<string, unknown>

/** Beobachtet und fängt jede Provider-Anfrage ab. Muss vor der ersten Navigation laufen. */
async function isolateProviders(page: Page): Promise<Net> {
  const net: Net = { observed: [], stubbed: [] }
  page.context().on('request', (request) => {
    if (PROVIDER.test(request.url())) net.observed.push(request.url())
  })
  await page.context().route(PROVIDER, (route) => {
    net.stubbed.push(route.request().url())
    return route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '/* PT27.4 provider stub */',
    })
  })
  return net
}

const readDataLayer = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[] }
    return w.dataLayer === undefined ? null : (JSON.parse(JSON.stringify(w.dataLayer)) as unknown[])
  }) as Promise<DataLayerEntry[] | null>

const pushedEvents = (layer: DataLayerEntry[] | null) =>
  (layer ?? [])
    .filter((entry): entry is Record<string, unknown> => !Array.isArray(entry) && 'event' in entry)
    .map((entry) => String(entry.event))
const gtagCalls = (layer: DataLayerEntry[] | null) =>
  (layer ?? []).filter((entry): entry is unknown[] => Array.isArray(entry))
const pageViews = (layer: DataLayerEntry[] | null) =>
  gtagCalls(layer)
    .filter((call) => call[0] === 'event' && call[1] === 'page_view')
    .map((call) => (call[2] as Record<string, unknown>)?.page_path)

const storedConsent = (page: Page) =>
  page.evaluate(() => window.localStorage.getItem('cookie-consent'))

/** Klickt die Entscheidung erst, wenn der Banner hydriert ist — idempotent. */
async function decide(page: Page, name: RegExp) {
  const button = page.getByRole('button', { name })
  await expect(async () => {
    if ((await storedConsent(page)) === null) await button.click({ timeout: 1_000 })
    expect(await storedConsent(page)).not.toBeNull()
  }).toPass({ timeout: 20_000 })
}
const acceptAll = (page: Page) => decide(page, /alle akzeptieren/i)
const rejectAll = (page: Page) => decide(page, /nur notwendige/i)

const gtmLoads = (net: Net) =>
  net.stubbed.filter((url) => url.includes('googletagmanager.com/gtm.js'))

/** Router-Navigation ueber einen echten Link. Die Startseite rendert der Router als `/de`. */
const samePath = (a: string, b: string) => a.replace(/\/$/, '') === b.replace(/\/$/, '')
async function spaNavigate(page: Page, href: string) {
  const link = page.locator(`a[href="${href}"]:visible`).first()
  const target = href.split(/[?#]/)[0]
  await expect(async () => {
    if (!samePath(new URL(page.url()).pathname, target)) await link.click({ timeout: 1_000 })
    expect(samePath(new URL(page.url()).pathname, target)).toBe(true)
  }).toPass({ timeout: 20_000 })
  await page.waitForLoadState('networkidle')
}

let senderCounter = 0
const SYNTHETIC = {
  name: 'Dr. PT Consent',
  company: 'Praxis Synthetik Consent',
  message: 'PT27.4 synthetische Anfrage zum Consent-Nachweis.',
}
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

/** Fuellt das Kontaktformular und sendet ab. Liefert die verwendete Adresse. */
async function submitContact(page: Page) {
  await page.setExtraHTTPHeaders({ 'X-Forwarded-For': `198.51.100.${(senderCounter += 1) + 60}` })
  const email = `pt274-${uid()}@praxis.example`
  await page.waitForLoadState('networkidle')
  await page.locator('#name').fill(SYNTHETIC.name)
  await page.locator('#company').fill(SYNTHETIC.company)
  await page.locator('#email').fill(email)
  await page.getByRole('button', { name: 'Dental', exact: true }).first().click()
  await page.locator('#requirements').fill(SYNTHETIC.message)
  await page.locator('#consent').check()
  await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
  return email
}

const leadExists = (id: unknown) => {
  const db = new Database(PT274_LEAD_DB, { readonly: true, fileMustExist: true })
  try {
    return Boolean(db.prepare('SELECT id FROM leads WHERE id = ?').get(String(id)))
  } finally {
    db.close()
  }
}

function expectNoPii(layer: DataLayerEntry[] | null, ...values: string[]) {
  const text = JSON.stringify(layer ?? [])
  for (const value of [...values, SYNTHETIC.name, SYNTHETIC.company, SYNTHETIC.message]) {
    expect(text, `PII im dataLayer: ${value}`).not.toContain(value)
  }
  expect(text).not.toMatch(/@|PDX-[0-9A-F]{8}|leadId|idempotency/i)
}

// =============================================================================

// Befund PT274-F1: ein im Build DEKLARIERTER Produktions-Container wird von Vite ins Preview-Bundle
// eingebettet und erst zur Laufzeit unterdrueckt. Dass er nie geladen wird, beweist der Netz-Test
// „Zustimmung"; dass er im echten Preview-Artefakt fehlt (§16.1), haengt an der Build-Umgebung.
test('PT27.4 · Build dieses Laufs traegt den Preview-Container', () => {
  expect(fs.statSync(PT274_SERVER_ENTRY).mtimeMs).toBeGreaterThanOrEqual(
    Number(process.env.PT274_BUILD_STARTED),
  )
  const files = fs.readdirSync(PT274_CLIENT_DIR, { recursive: true }) as string[]
  const bundle = files
    .map((file) => join(PT274_CLIENT_DIR, String(file)))
    .filter((file) => /\.(js|html)$/.test(file))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n')
  expect(bundle).toContain(PT274_PREVIEW_CONTAINER)
})

test.describe('PT27.4 · vor jeder Entscheidung', () => {
  test('Seitenladen, SPA-Navigation und Interaktion erzeugen 0 Provider-Anfragen', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    for (const path of [
      '/de/',
      '/de/contact',
      '/de/downloads',
      '/de/consumer/inside-out-duo',
      '/en/epigenetics',
      '/pl/diagnostics/dental',
    ]) {
      await page.goto(path, { waitUntil: 'networkidle' })
    }
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await spaNavigate(page, '/de/epigenetics')
    await spaNavigate(page, '/de/contact')
    await page.getByRole('button', { name: 'Dental', exact: true }).first().click()

    expect(net.observed, net.observed.join(', ')).toEqual([])
    expect(net.stubbed).toEqual([])
    expect(await readDataLayer(page)).toBeNull()
    expect(
      await page.evaluate(() => ({
        gtag: typeof (window as unknown as { gtag?: unknown }).gtag,
        script: document.querySelectorAll('#google-tag-manager-script').length,
        storage: [...Object.keys(localStorage), ...Object.keys(sessionStorage)],
      })),
    ).toEqual({ gtag: 'undefined', script: 0, storage: [] })
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toBeVisible()
  })
})

test.describe('PT27.4 · Ablehnung', () => {
  test('0 Provider-Anfragen trotz Navigation und Anfrage — der Geschaeftsvorgang laeuft', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await rejectAll(page)
    expect(JSON.parse((await storedConsent(page)) ?? '{}')).toMatchObject({
      version: 2,
      analytics: false,
      marketing: false,
    })

    await spaNavigate(page, '/de/contact')
    const submission = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/contact') && response.request().method() === 'POST',
    )
    await submitContact(page)
    expect((await submission).status()).toBe(202)
    await expect(page.getByText(/Anfrage erhalten und registriert/)).toBeVisible()

    await page.reload({ waitUntil: 'networkidle' })
    await spaNavigate(page, '/de')
    expect(net.observed, net.observed.join(', ')).toEqual([])
    expect(await readDataLayer(page)).toBeNull()
    expect(
      await page.evaluate(() => [...Object.keys(localStorage), ...Object.keys(sessionStorage)]),
    ).toEqual(['cookie-consent'])
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toHaveCount(0)
  })
})

test.describe('PT27.4 · Zustimmung', () => {
  test('alle akzeptieren: genau der Preview-Container, einmal, nie die Produktionskennung', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    expect(net.observed).toEqual([])
    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)
    expect(gtmLoads(net)[0]).toContain(`id=${PT274_PREVIEW_CONTAINER}`)

    const layer = await readDataLayer(page)
    const consentCalls = gtagCalls(layer).filter((call) => call[0] === 'consent')
    expect(consentCalls.map((call) => call[1])).toEqual(['default', 'update'])
    expect(consentCalls[1][2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'granted',
    })

    await page.reload({ waitUntil: 'networkidle' })
    await expect.poll(() => gtmLoads(net).length).toBe(2)
    expect(
      await page.evaluate(() => document.querySelectorAll('#google-tag-manager-script').length),
    ).toBe(1)

    expect(net.observed.join(' ')).not.toContain(PT274_PRODUCTION_CONTAINER)
    expect(net.observed.filter((url) => GA4_COLLECT.test(url))).toEqual([])
    expect(net.observed.filter((url) => !url.includes('googletagmanager.com/gtm.js'))).toEqual([])
    // Keine GA4-Kennung konfiguriert → kein `send_to` an irgendein Ziel.
    expect(JSON.stringify(await readDataLayer(page))).not.toContain('send_to')
  })

  test('nur Analyse: Container laedt, Werbesignale bleiben verweigert', async ({ page }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    const settings = page.getByRole('button', { name: /^Einstellungen$/ })
    await expect(async () => {
      if ((await page.getByRole('checkbox', { name: /Analyse/ }).count()) === 0)
        await settings.click({ timeout: 1_000 })
      await expect(page.getByRole('checkbox', { name: /Analyse/ })).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    // Die Checkbox ist visuell versteckt (`sr-only`); bedient wird der sichtbare Schalter im Label.
    const analytics = page.getByRole('checkbox', { name: /Analyse/ })
    await page.locator('label').filter({ has: analytics }).click()
    await expect(analytics).toBeChecked()
    await page.getByRole('button', { name: /^Speichern$/ }).click()

    await expect.poll(() => gtmLoads(net).length).toBe(1)
    expect(JSON.parse((await storedConsent(page)) ?? '{}')).toMatchObject({
      analytics: true,
      marketing: false,
    })
    const update = gtagCalls(await readDataLayer(page)).find(
      (call) => call[0] === 'consent' && call[1] === 'update',
    )
    expect(update?.[2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  })
})

test.describe('PT27.4 · Widerruf', () => {
  test('nach Widerruf: Zustand geloescht, Seite neu, keine Anfrage und kein Ereignis mehr', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)

    await page.getByRole('button', { name: /cookie-einstellungen/i }).click()
    const reload = page.waitForEvent('load')
    await page.getByRole('button', { name: /einwilligung widerrufen/i }).click()
    await reload
    await page.waitForLoadState('networkidle')

    expect(await storedConsent(page)).toBeNull()
    await expect(page.getByRole('button', { name: /alle akzeptieren/i })).toBeVisible()
    const afterWithdraw = net.observed.length

    await spaNavigate(page, '/de/contact')
    const submission = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/contact') && response.request().method() === 'POST',
    )
    await submitContact(page)
    expect((await submission).status()).toBe(202)
    await expect(page.getByText(/Anfrage erhalten und registriert/)).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(net.observed.slice(afterWithdraw)).toEqual([])
    expect(await readDataLayer(page)).toBeNull()
    expect(
      await page.evaluate(() => document.querySelectorAll('#google-tag-manager-script').length),
    ).toBe(0)
  })
})

test.describe('PT27.4 · Konversion', () => {
  test('contact_submit erst nach dem gespeicherten Vorgang, genau einmal, ohne PII', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/contact?intent=quote', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)

    const duringHold: Array<{ conversions: number; persisted: boolean }> = []
    await page.route('**/api/contact', async (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      const response = await route.fetch()
      const json = (await response.json()) as { leadId?: string }
      duringHold.push({
        conversions: pushedEvents(await readDataLayer(page)).filter((e) => e === 'contact_submit')
          .length,
        persisted: leadExists(json.leadId),
      })
      await route.fulfill({ response, json })
    })

    const email = await submitContact(page)
    await expect(page.getByText(/Anfrage erhalten und registriert/)).toBeVisible()
    expect(duringHold).toEqual([{ conversions: 0, persisted: true }])

    await expect
      .poll(async () =>
        pushedEvents(await readDataLayer(page)).filter((e) => e === 'contact_submit'),
      )
      .toEqual(['contact_submit'])
    await page.waitForLoadState('networkidle')
    const layer = await readDataLayer(page)
    expect(pushedEvents(layer).filter((e) => e === 'contact_submit')).toHaveLength(1)
    const conversion = (layer ?? []).find(
      (entry) => !Array.isArray(entry) && entry.event === 'contact_submit',
    )
    expect(conversion).toEqual({ event: 'contact_submit' })
    expectNoPii(layer, email)
    for (const name of SHOP_EVENTS) expect(pushedEvents(layer)).not.toContain(name)
  })

  test('ein abgelehnter Vorgang loest keine Konversion aus', async ({ page }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)
    await page.route('**/api/contact', (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              journey: 'contact',
              code: 'JOURNEY_UNAVAILABLE',
              retryable: true,
            }),
          })
        : route.continue(),
    )
    await submitContact(page)
    await expect(page.getByText(/Das hat gerade nicht geklappt/)).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(pushedEvents(await readDataLayer(page))).not.toContain('contact_submit')
  })
})

test.describe('PT27.4 · kein Puffer', () => {
  test('Ereignisse vor der Zustimmung werden nach der Zustimmung NICHT nachgesendet', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    // Vor jeder Entscheidung: Seitenwechsel und eine erfolgreich gespeicherte Anfrage.
    await spaNavigate(page, '/de/epigenetics')
    await spaNavigate(page, '/de/contact')
    const submission = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/contact') && response.request().method() === 'POST',
    )
    const email = await submitContact(page)
    expect((await submission).status()).toBe(202)
    await expect(page.getByText(/Anfrage erhalten und registriert/)).toBeVisible()
    expect(net.observed).toEqual([])

    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)
    await page.waitForLoadState('networkidle')

    const layer = await readDataLayer(page)
    expect(pushedEvents(layer)).toEqual(['gtm.js'])
    expect(pageViews(layer)).toEqual([])
    expect(gtagCalls(layer).map((call) => call[0])).toEqual(['consent', 'consent'])
    expectNoPii(layer, email)

    // Ab jetzt wird live gemessen — genau das neue Ereignis, nichts Altes.
    await spaNavigate(page, '/de')
    await expect
      .poll(async () => pageViews(await readDataLayer(page)))
      .toEqual([expect.stringMatching(/^\/de\/?$/)])
  })
})

test.describe('PT27.4 · Seitenaufruf', () => {
  test('Erstladen zaehlt der Container, jede SPA-Navigation genau einmal, Query-Wechsel nie', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/contact?intent=quote', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await page.reload({ waitUntil: 'networkidle' })
    await expect.poll(() => gtmLoads(net).length).toBe(2)

    // Erstladen mit gespeicherter Zustimmung: die App meldet NICHTS (der Container zaehlt ihn).
    expect(pageViews(await readDataLayer(page))).toEqual([])

    // Reiner Query-Wechsel ueber den Router (Header-CTA → /de/contact ohne Query).
    await page.locator('header a[href="/de/contact"]:visible').first().click()
    await expect(page).toHaveURL(/\/de\/contact$/)
    await page.waitForLoadState('networkidle')
    expect(pageViews(await readDataLayer(page))).toEqual([])

    await spaNavigate(page, '/de/diagnostics')
    await expect.poll(async () => pageViews(await readDataLayer(page))).toEqual(['/de/diagnostics'])
    await spaNavigate(page, '/de/diagnostics/dental')
    await expect
      .poll(async () => pageViews(await readDataLayer(page)))
      .toEqual(['/de/diagnostics', '/de/diagnostics/dental'])

    const layer = await readDataLayer(page)
    expect(pushedEvents(layer)).not.toContain('virtual_pageview')
    expect(pushedEvents(layer)).not.toContain('page_view')
    expect(gtmLoads(net)).toHaveLength(2)
  })
})

test.describe('PT27.4 · Outbound / Shopify-only', () => {
  test('outbound_click nur nach Zustimmung, nur mit Domain, kein Kauf-Ereignis', async ({
    page,
  }) => {
    const net = await isolateProviders(page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await acceptAll(page)
    await expect.poll(() => gtmLoads(net).length).toBe(1)

    const popup = page.waitForEvent('popup')
    await page.locator('footer a[href^="https://www.linkedin.com/"]').first().click()
    await (await popup).close()

    await expect
      .poll(async () =>
        (await readDataLayer(page))?.filter(
          (entry) => !Array.isArray(entry) && entry.event === 'outbound_click',
        ),
      )
      .toEqual([{ event: 'outbound_click', outbound_domain: 'linkedin.com' }])
    // Die Ziel-Navigation wurde abgefangen, nie ins Netz gelassen.
    expect(net.observed.filter((url) => url.includes('linkedin.com'))).toEqual(
      net.stubbed.filter((url) => url.includes('linkedin.com')),
    )
    const events = pushedEvents(await readDataLayer(page))
    for (const name of SHOP_EVENTS) expect(events).not.toContain(name)
  })
})
