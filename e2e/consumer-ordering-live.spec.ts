import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'

import { expect, test, type Page } from '@playwright/test'

import { CONSUMER_PRODUCTS, type ConsumerProductKey } from '../src/content/consumer/products'
import { LEAD_DB_PATH } from './pt21.7.config'

/**
 * AP21 PT21.7 — die Bestellstrecke gegen ein ECHTES Backend.
 *
 * Bis PT21.6 wurde `/api/consumer-order` im Browser ausschliesslich
 * abgefangen; die Persistenz war nur auf Node-Ebene bewiesen. Der
 * PT21.6-Handoff hat genau das als offen vermerkt. Hier laeuft der volle
 * Weg: Browser → SSR-Proxy → `server/server.js` → SQLite.
 *
 * `SENDGRID_API_KEY` ist leer. Gemessen wird damit der ehrliche
 * NO_PROVIDER_CONFIGURED-Pfad: die Bestellanfrage wird dauerhaft
 * gespeichert, und der Status behauptet trotzdem keinen Erfolg.
 */

// `better-sqlite3` liegt im eigenen Abhaengigkeitsbaum des Backends
// (`server/package.json`), nicht im Wurzelprojekt — deshalb wird von dort
// aufgeloest statt von `e2e/`.
const require = createRequire(new URL('../server/', import.meta.url))
const Database = require('better-sqlite3')

const PRODUCTS: ConsumerProductKey[] = ['spray', 'masks', 'duo']

/**
 * Das Backend begrenzt Bestellanfragen auf 5 pro 15 Minuten und IP — genau
 * die Bremse, die PT21.5 eingebaut hat. Aus dem Browser kommen alle Tests
 * aber von derselben Adresse. Jeder Test bekommt deshalb eine eigene
 * X-Forwarded-For-Kennung; `trust proxy 1` im Backend macht daraus die
 * Absenderadresse. Nur der Test, der das Limit ausdruecklich pruefen soll,
 * feuert mehrfach von derselben.
 */
let sender = 0
const asFreshSender = async (page: Page) => {
  sender += 1
  const ip = `198.51.100.${100 + sender}`
  await page.setExtraHTTPHeaders({ 'X-Forwarded-For': ip })
  return ip
}

/**
 * Direkter API-Aufruf mit ausdruecklichem Absender.
 *
 * `page.setExtraHTTPHeaders` wirkt nur auf Anfragen, die die SEITE stellt —
 * `page.request` erbt sie nicht. Ohne diesen Umweg teilten sich alle
 * Direktaufrufe einen Limiter-Eimer und liefen ab dem fuenften in 429.
 */
const postOrder = (
  page: Page,
  { ip, key, ...data }: { ip: string; key: string } & Record<string, unknown>,
) =>
  page.request.post('/api/consumer-order', {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
      'X-Forwarded-For': ip,
    },
    data: {
      product: 'duo',
      variant: 'set',
      quantity: 1,
      name: 'Testkundin',
      email: 'test@example.com',
      locale: 'de',
      processingConsent: true,
      // Fester Zeitstempel als Standard: ein echter Replay muss denselben
      // Rumpf senden. Mit `new Date()` je Aufruf waere jede Wiederholung ein
      // anderer Inhalt — der Server haette zu Recht 409 gemeldet, und der
      // Test haette Idempotenz geprueft, wo er Konflikterkennung mass.
      consentAcceptedAt: '2026-09-08T09:00:00.000Z',
      ...data,
    },
  })

interface LeadRow {
  id: string
  journey: string
  status: string
  last_error_class: string | null
  subject_json: string
  context_json: string
  consent_json: string
}

const leads = (): LeadRow[] => {
  // Die Datenbank wird vom Backend erst beim ERSTEN Vorgang angelegt. Vorher
  // gibt es schlicht noch keine Datei — das ist kein Fehler, sondern der
  // Ausgangszustand eines frischen Laufs.
  if (!existsSync(LEAD_DB_PATH)) return []
  const db = new Database(LEAD_DB_PATH, { readonly: true })
  const rows = db.prepare('SELECT * FROM leads ORDER BY created_at, id').all() as LeadRow[]
  db.close()
  return rows
}

const outboxFor = (leadId: string) => {
  const db = new Database(LEAD_DB_PATH, { readonly: true })
  const rows = db
    .prepare(
      'SELECT channel, status, attempts, last_error_class FROM lead_outbox WHERE lead_id = ?',
    )
    .all(leadId) as Array<{
    channel: string
    status: string
    attempts: number
    last_error_class: string | null
  }>
  db.close()
  return rows
}

const eventsFor = (leadId: string) => {
  const db = new Database(LEAD_DB_PATH, { readonly: true })
  const rows = db
    .prepare('SELECT event_type FROM lead_events WHERE lead_id = ? ORDER BY id')
    .all(leadId) as Array<{ event_type: string }>
  db.close()
  return rows.map((row) => row.event_type)
}

async function submitOrder(
  page: Page,
  product: ConsumerProductKey,
  locale = 'de',
  fill: (form: ReturnType<Page['locator']>) => Promise<void> = async () => {},
) {
  await page.goto(`/${locale}/consumer/${CONSUMER_PRODUCTS[product].slug}`)
  const trigger = page.locator(`main [data-gtm-page="${product}"]`).first()
  await expect(async () => {
    if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
    await expect(page.locator('form input[type="email"]')).toHaveCount(1)
  }).toPass({ timeout: 20_000 })

  const form = page.locator('form').filter({ has: page.locator('input[type="email"]') })
  await form.locator('#order-name').fill(`Testkundin ${product}`)
  await form.locator('#order-email').fill(`${product}@example.com`)
  await fill(form)
  await form.locator('input[type="checkbox"]').first().check()
  await form.locator('button[type="submit"]').click()
  return form
}

test.describe('PT21.7 — Ordering gegen echtes Backend', () => {
  test('alle drei Produkte: Bestellanfrage wird wirklich persistiert', async ({ page }) => {
    await asFreshSender(page)
    const before = leads().length
    for (const product of PRODUCTS) {
      await submitOrder(page, product)
      // Die Erfolgsansicht erscheint erst nach bestaetigter Persistenz (202).
      await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    }

    const rows = leads()
    expect(rows.length - before, 'drei neue Vorgaenge').toBe(3)
    const created = rows.slice(before)

    for (const [index, product] of PRODUCTS.entries()) {
      const lead = created[index]
      const subject = JSON.parse(lead.subject_json) as Record<string, unknown>
      const context = JSON.parse(lead.context_json) as Record<string, unknown>
      const consent = JSON.parse(lead.consent_json) as Record<string, unknown>

      expect(lead.journey, `${product}: eigene Journey`).toBe('consumer_order')
      // Kanonischer Slug, nicht der freie Produktname.
      expect(context.productId).toBe(CONSUMER_PRODUCTS[product].slug)
      expect(context.variant).toBe(CONSUMER_PRODUCTS[product].orderVariant)
      expect(context.quantity).toBe(1)
      expect(String(context.reference)).toMatch(/^PDX-[0-9A-F]{8}$/u)
      expect(subject.email).toBe(`${product}@example.com`)
      // Verarbeitung erteilt, Marketing getrennt und ungefragt nicht erteilt.
      expect(consent.processingAccepted).toBe(true)
      expect(consent.marketing).toBe('DENIED')

      // Persistenz VOR dem Handoff — die Ereignisfolge belegt es.
      const events = eventsFor(lead.id)
      expect(events.slice(0, 3)).toEqual(['LEAD_RECEIVED', 'LEAD_PERSISTED', 'HANDOFF_PENDING'])

      // Outbox existiert; ohne Provider ehrlich terminal statt Fake-Erfolg.
      const outbox = outboxFor(lead.id)
      expect(outbox.map((entry) => entry.channel)).toEqual(['CRM'])
      expect(lead.status).toBe('FAILED_TERMINAL')
      expect(lead.last_error_class).toBe('NO_PROVIDER_CONFIGURED')
    }
  })

  test('die Oberflaeche behauptet keinen Kauf, obwohl kein Provider erreichbar war', async ({
    page,
  }) => {
    await asFreshSender(page)
    await submitOrder(page, 'duo')
    await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    // Die Erfolgsansicht steht im Dialog — der ist ein Geschwister von
    // <main>, nicht sein Kind. Gemessen wird deshalb das ganze Dokument.
    const text = ((await page.locator('body').textContent()) ?? '').toLowerCase()
    for (const forbidden of ['gekauft', 'bezahlt', 'kaufvertrag geschlossen', 'zahlung erhalten']) {
      expect(text, `Kaufbehauptung "${forbidden}"`).not.toContain(forbidden)
    }
    // Und der Hinweis, dass es eine Anfrage ist, steht wirklich da.
    expect(text).toContain('bestellanfrage')
  })

  test('ein zweiter Absendeversuch erzeugt keinen zweiten Vorgang', async ({ page }) => {
    await asFreshSender(page)
    const before = leads().length
    const form = await submitOrder(page, 'spray', 'pl')
    await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })
    // Zuruecknavigieren und exakt dieselbe Anfrage erneut senden: der Client
    // haelt seinen Idempotency-Key pro Formular-Instanz, deshalb pruefen wir
    // hier den Serverpfad direkt mit demselben Key.
    void form
    const first = leads().at(-1)!
    const key = `pt217-replay-${Date.now()}`
    const replayIp = '198.51.100.210'
    const payload = {
      ip: replayIp,
      key,
      product: 'spray',
      variant: 'pack-12',
      name: 'Replay Kundin',
      email: 'replay@example.com',
    }
    const a = await postOrder(page, payload)
    const b = await postOrder(page, payload)
    expect(a.status()).toBe(202)
    expect(b.status()).toBe(202)
    expect((await b.json()).leadId).toBe((await a.json()).leadId)
    expect(leads().length - before, 'ein Formularvorgang + ein API-Vorgang').toBe(2)
    expect(first.journey).toBe('consumer_order')

    // Derselbe Key mit anderem Inhalt ist ein Konflikt, kein stilles Ueberschreiben.
    const conflict = await postOrder(page, { ...payload, quantity: 3 })
    expect(conflict.status()).toBe(409)
  })

  test('Missbrauchsschutz greift: Honeypot still, Rate Limit real, Allowlist serverseitig', async ({
    page,
  }) => {
    await asFreshSender(page)
    const before = leads().length

    // Honeypot: angenommen, aber nichts gespeichert.
    const honeypot = await postOrder(page, {
      ip: '198.51.100.220',
      key: `hp-${Date.now()}`,
      name: 'Bot',
      email: 'bot@example.com',
      _hp: 'gefuellt',
    })
    expect(honeypot.status()).toBe(200)
    expect(leads().length, 'Honeypot persistiert nichts').toBe(before)

    // Serverseitige Allowlist: Produkt, Variante und Menge. Je Fall ein
    // eigener Absender, damit die Ablehnungen nicht selbst ins Limit laufen.
    const rejected = [
      [{ product: 'igloo-pro' }, 'UNKNOWN_PRODUCT'],
      [{ variant: 'pack-12' }, 'UNKNOWN_VARIANT'],
      [{ quantity: '1 Duo set' }, 'INVALID_QUANTITY'],
      [{ processingConsent: false }, 'PROCESSING_CONSENT_REQUIRED'],
    ] as const
    for (const [index, [data, code]] of rejected.entries()) {
      const response = await postOrder(page, {
        ip: `198.51.100.${230 + index}`,
        key: `bad-${code}-${Date.now()}`,
        ...data,
      })
      expect(response.status(), code).toBe(400)
      expect((await response.json()).code).toBe(code)
    }

    // Rate Limit: derselbe Absender laeuft in die Bremse.
    const codes: number[] = []
    for (let i = 0; i < 8; i += 1) {
      const response = await postOrder(page, {
        ip: '198.51.100.250',
        key: `rl-${i}-${Date.now()}`,
        email: 'flood@example.com',
      })
      codes.push(response.status())
    }
    expect(codes.filter((code) => code === 429).length, 'Rate Limit greift').toBeGreaterThan(0)
  })

  test('Bestellen ohne jede Consent-Entscheidung funktioniert — und ohne Provider-Request', async ({
    page,
  }) => {
    const external: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (!url.startsWith('http://127.0.0.1') && !url.startsWith('data:')) external.push(url)
    })

    await asFreshSender(page)
    const before = leads().length
    await page.goto('/cs/consumer/inside-out-duo')
    const stored = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(stored, 'keine Cookie-Entscheidung getroffen').toBeNull()

    await submitOrder(page, 'duo', 'cs')
    await expect(page.getByText(/PDX-[0-9A-F]{8}/u)).toBeVisible({ timeout: 30_000 })

    expect(leads().length - before, 'Bestellung ohne Consent persistiert').toBe(1)
    expect(external, 'Provider-Requests vor der Einwilligung').toEqual([])
    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? []).map(
        (entry) => String(entry.event ?? ''),
      ),
    )
    expect(
      events.filter((name) => name.startsWith('consumer_')),
      'Analytics-Events',
    ).toEqual([])
  })
})
