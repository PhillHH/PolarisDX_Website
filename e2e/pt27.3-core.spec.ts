import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

import { expect, test, type Page, type Request } from '@playwright/test'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../src/i18n'
import { SAMPLE_BUNDLE_ASSET_ID } from '../src/content/resources/leadMagnetCandidates'
import { findResource } from '../src/content/resources/resourceInventory'
import { getSearchEligibleRouteEntries } from '../src/routing/routeRegistry'
import { PT273_LEAD_DB, PT273_SERVER_ENTRY, PT273_UPLOAD_DIR } from './pt27.3.config'

/**
 * AP27 PT27.3 — Kernjourneys im Browser, production-like.
 *
 * Jede Journey laeuft durch die echte Oberflaeche gegen den echten Backend-Prozess. Bewiesen wird
 * nicht nur die sichtbare Meldung, sondern dass sie dem gespeicherten Geschaeftszustand entspricht:
 * die Antwort wird im Browser angehalten, bis die Datenbank den Vorgang zeigt — und bis dahin darf
 * die Oberflaeche keinen Erfolg behaupten. Das Backend laeuft im erzwungenen Trockenlauf
 * (`APP_ENV=preview`); kein Provider wird kontaktiert.
 *
 * Tests sind voneinander unabhaengig: eigene Absender-IP, eigene synthetische Adresse, Pruefung
 * ueber die Vorgangs-ID aus der Antwort statt ueber Gesamtzahlen.
 */

const require = createRequire(new URL('../server/', import.meta.url))
const Database = require('better-sqlite3')

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
let senderCounter = 0
const freshSender = (page: Page) =>
  page.setExtraHTTPHeaders({ 'X-Forwarded-For': `198.51.100.${(senderCounter += 1) + 20}` })

const locale = (lang: SupportedLanguage, namespace: string) =>
  JSON.parse(
    fs.readFileSync(resolve(process.cwd(), `public/locales/${lang}/${namespace}.json`), 'utf8'),
  ) as Record<string, unknown>
const at = (source: unknown, pointer: string): string => {
  // Manche Namespaces (z. B. `consumer`) fuehren flache Schluessel mit Punkt im Namen.
  const flat = (source as Record<string, unknown>)[pointer]
  if (typeof flat === 'string') return flat
  const value = pointer
    .split('.')
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[key]
          : undefined,
      source,
    )
  if (typeof value !== 'string') throw new Error(`Locale-Key fehlt: ${pointer}`)
  return value
}

type Row = Record<string, unknown>
type Statement = {
  get: (...params: unknown[]) => Row | undefined
  all: (...params: unknown[]) => Row[]
}
type Db = { prepare: (sql: string) => Statement; close: () => void }
type LeadRow = {
  id: string
  journey: string
  status: string
  lastErrorClass: string | null
  subject: Record<string, unknown>
  context: Record<string, unknown>
  consent: Record<string, unknown>
}
type Envelope = Record<string, unknown> & { leadId?: string; journey?: string }
type Held = { json: Envelope; request: Request; failures: unknown[] }

function readDb<T>(read: (db: Db) => T): T {
  const db = new Database(PT273_LEAD_DB, { readonly: true, fileMustExist: true }) as Db
  try {
    return read(db)
  } finally {
    db.close()
  }
}

const leadById = (id: unknown): LeadRow | undefined =>
  readDb((db) => {
    const row = db
      .prepare(
        `SELECT id, journey, status, last_error_class AS lastErrorClass, subject_json AS subject,
          context_json AS context, consent_json AS consent FROM leads WHERE id = ?`,
      )
      .get(String(id))
    if (!row) return undefined
    return {
      id: String(row.id),
      journey: String(row.journey),
      status: String(row.status),
      lastErrorClass: (row.lastErrorClass as string | null) ?? null,
      subject: JSON.parse(String(row.subject)) as Record<string, unknown>,
      context: JSON.parse(String(row.context)) as Record<string, unknown>,
      consent: JSON.parse(String(row.consent)) as Record<string, unknown>,
    }
  })
const eventsFor = (id: string): string[] =>
  readDb((db) =>
    db
      .prepare('SELECT event_type AS eventType FROM lead_events WHERE lead_id = ? ORDER BY id')
      .all(id)
      .map((row) => String(row.eventType)),
  )
const leadsWithEmail = (email: string): number =>
  fs.existsSync(PT273_LEAD_DB)
    ? readDb((db) =>
        Number(
          db.prepare('SELECT COUNT(*) AS n FROM leads WHERE subject_json LIKE ?').get(`%${email}%`)
            ?.n ?? 0,
        ),
      )
    : 0

/**
 * Haelt die Antwort eines Journey-POST an, fuehrt `verify` aus (Datenbank lesen, pruefen, dass die
 * Oberflaeche noch keinen Erfolg zeigt) und reicht die Antwort erst danach unveraendert weiter.
 */
async function holdResponse(
  page: Page,
  apiPath: string,
  verify: (held: Held) => Promise<void>,
): Promise<Held[]> {
  const seen: Held[] = []
  await page.route(`**${apiPath}`, async (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    const response = await route.fetch()
    const json = (await response.json()) as Envelope
    const held: Held = { json, request: route.request(), failures: [] }
    seen.push(held)
    try {
      await verify(held)
    } catch (error) {
      held.failures.push(error)
    }
    await route.fulfill({ response, json })
  })
  return seen
}

const countPosts = (page: Page, apiPath: string) => {
  const posts: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === apiPath) {
      posts.push(request.url())
    }
  })
  return posts
}

test('PT27.3 · der Browser trifft den in diesem Lauf gebauten Stand', async ({ page }) => {
  expect(fs.statSync(PT273_SERVER_ENTRY).mtimeMs).toBeGreaterThanOrEqual(
    Number(process.env.PT273_BUILD_STARTED),
  )
  expect((await page.goto('/de/'))?.status()).toBe(200)
})

test.describe('PT27.3 · B2B-Anfrage', () => {
  const contact = locale('de', 'contact')

  test('Diagnostik → Service → CTA → Validierung → Submit → gespeicherter Lead → Erfolg', async ({
    page,
  }) => {
    await freshSender(page)
    const email = `pt273-b2b-${uid()}@praxis.example`
    const posts = countPosts(page, '/api/contact')

    await page.goto('/de/diagnostics')
    await page.locator('main a[href="/de/diagnostics/dental"]').first().click()
    await expect(page).toHaveURL(/\/de\/diagnostics\/dental$/)
    await page.locator('main a[href="/de/contact?intent=quote#kontaktformular"]').first().click()
    await expect(page).toHaveURL(/\/de\/contact\?intent=quote#kontaktformular$/)

    const form = page.locator('form').filter({ has: page.locator('#requirements') })
    const submit = page.getByRole('button', { name: 'Angebot anfragen' }).last()
    const successText = at(contact, 'contact.form.success')
    await page.waitForLoadState('networkidle')

    // Validierung: ohne Pflichtangaben kein Request, sichtbarer Fehler.
    await submit.click()
    await expect(form.locator('[role="alert"]').first()).toBeVisible()
    await expect(form.getByText(successText)).toHaveCount(0)
    expect(posts).toHaveLength(0)

    await page.locator('#name').fill('Dr. PT Kernjourney')
    await page.locator('#email').fill(email)
    await page.getByRole('button', { name: 'Dental' }).first().click()
    await page.locator('#requirements').fill('PT27.3: Angebot fuer ein POC-Panel erbeten.')
    await page.locator('#consent').check()

    const held = await holdResponse(page, '/api/contact', async ({ json, request }) => {
      await expect(form.getByText(successText)).toHaveCount(0)
      expect(request.headers()['idempotency-key']).toBeTruthy()
      expect(request.postDataJSON()).toMatchObject({ intent: 'quote', locale: 'de', email })
      expect(leadById(json.leadId)).toBeTruthy()
    })
    await submit.click()
    await expect(form.getByText(successText)).toBeVisible()

    expect(held).toHaveLength(1)
    expect(held[0].failures).toEqual([])
    expect(held[0].json).toMatchObject({ success: true, journey: 'contact' })
    const lead = leadById(held[0].json.leadId)!
    expect(lead).toMatchObject({ journey: 'contact' })
    expect(lead.subject).toMatchObject({ email, intent: 'quote', field: 'dental' })
    expect(lead.context).toMatchObject({ locale: 'de' })
    expect(String(lead.context.originRoute)).toMatch(/^\/de\/contact/)
    expect(lead.consent).toMatchObject({ processingAccepted: true })
    // Trockenlauf: gespeichert, aber nicht zugestellt — und das behauptet die Oberflaeche auch nicht.
    expect(lead.status).not.toBe('DELIVERED')
    expect(lead.lastErrorClass).toBe('DRY_RUN')
    const events = eventsFor(lead.id)
    expect(events.slice(0, 4)).toEqual([
      'LEAD_RECEIVED',
      'LEAD_VALIDATED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
    ])
    expect(events.indexOf('LEAD_PERSISTED')).toBeLessThan(events.indexOf('HANDOFF_ATTEMPT'))
    expect(posts).toHaveLength(1)
  })

  test('Ausfall des Journey-Dienstes → sichtbarer Fehler, kein Erfolg, Eingaben bleiben, kein Lead', async ({
    page,
  }) => {
    await freshSender(page)
    const email = `pt273-b2b-fail-${uid()}@praxis.example`
    await page.route('**/api/contact', (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              requestId: 'pt273-failure',
              journey: 'contact',
              code: 'JOURNEY_UNAVAILABLE',
              retryable: true,
            }),
          })
        : route.continue(),
    )
    await page.goto('/de/contact?intent=quote')
    await page.waitForLoadState('networkidle')
    await page.locator('#name').fill('Dr. PT Ausfall')
    await page.locator('#email').fill(email)
    await page.getByRole('button', { name: 'Dental' }).first().click()
    await page.locator('#requirements').fill('PT27.3: Ausfallpfad.')
    await page.locator('#consent').check()
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()

    await expect(page.getByText(at(contact, 'contact.form.error_retryable'))).toBeVisible()
    await expect(page.getByText(at(contact, 'contact.form.success'))).toHaveCount(0)
    await expect(page.locator('#email')).toHaveValue(email)
    expect(leadsWithEmail(email)).toBe(0)
  })
})

test.describe('PT27.3 · Epigenetik', () => {
  test('Hub → Musterbefund → Anfrage mit Panel-/Quellkontext → gespeichert, ehrlicher Status', async ({
    page,
  }) => {
    await freshSender(page)
    const email = `pt273-epi-${uid()}@praxis.example`
    await page.goto('/de/')
    await page.locator('header a[href="/de/epigenetics"]:visible').first().click()
    await expect(page).toHaveURL(/\/de\/epigenetics$/)

    const panel = page.locator('[data-panel-slug="healthy-aging"]')
    await panel.locator('a[href*="/musterbefund/healthy-aging"]').click()
    await expect(page).toHaveURL(
      /\/de\/epigenetics\/musterbefund\/healthy-aging\?panel=healthy-aging$/,
    )
    await page
      .locator('a[href="/de/epigenetics?source=musterbefund&panel=healthy-aging#inquiry"]')
      .first()
      .click()
    await expect(page.getByLabel('Panel-Interesse (optional)')).toHaveValue('healthy-aging')

    const form = page.locator('#inquiry')
    const submit = page.getByRole('button', { name: 'Angebot anfragen' }).last()
    await submit.click()
    await expect(form.locator('[role="alert"]').first()).toBeVisible()

    await page.getByLabel('Name').fill('Dr. PT Epigenetik')
    await page.getByLabel('E-Mail').fill(email)
    await page.getByLabel('Einrichtung / Unternehmen').fill('Praxis PT27.3')
    await page.getByLabel('Einrichtungstyp').selectOption('practice')
    await form.locator('input[name="processingConsent"]').check()

    const epigenetics = locale('de', 'epigenetics')
    const savedTitle = at(epigenetics, 'inquiry.status.providerUnavailable.title')
    const held = await holdResponse(page, '/api/epigenetics-inquiry', async ({ json }) => {
      await expect(form.getByText(savedTitle)).toHaveCount(0)
      expect(leadById(json.leadId)).toBeTruthy()
    })
    await submit.click()

    const status = form.locator('[role="status"]').last()
    await expect(status).toContainText(savedTitle)
    await expect(status).not.toContainText(at(epigenetics, 'inquiry.status.delivered.title'))
    expect(held[0].failures).toEqual([])

    const lead = leadById(held[0].json.leadId)!
    expect(lead.journey).toBe('epigenetics_inquiry')
    expect(lead.context).toMatchObject({
      locale: 'de',
      source: 'musterbefund',
      panel: 'healthy-aging',
    })
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.lastErrorClass).toBe('DRY_RUN')
  })
})

test.describe('PT27.3 · Consumer (Shopify-only)', () => {
  test('Landingpage → Bestellanfrage als Inquiry gespeichert, kein Kauf, kein erfundener Shop-Link', async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'OWNER_BOUND',
      description:
        'Shopify-Outbound: keine Shopify-Domain im Repository (CONSENT-TRACKING-CONTRACT CTC-14, Owner Content/Marketing) — nicht erfunden, nicht getestet',
    })
    await freshSender(page)
    const email = `pt273-consumer-${uid()}@example.com`
    const response = await page.goto('/de/consumer/vitamin-d3-spray')
    expect(response?.status()).toBe(200)

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))
    expect(
      hrefs.filter((href) => /shopify|checkout|warenkorb|\/cart|kasse|purchase/i.test(href)),
    ).toEqual([])

    const trigger = page.locator('main [data-gtm-page="spray"]').first()
    await expect(async () => {
      if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
      await expect(page.locator('form input[type="email"]')).toHaveCount(1, { timeout: 500 })
    }).toPass({ timeout: 20_000 })

    const form = page.locator('form').filter({ has: page.locator('#order-email') })
    await form.locator('#order-name').fill('PT Kernjourney Kundin')
    await form.locator('#order-email').fill(email)
    await form.locator('input[type="checkbox"]').first().check()

    const consumer = locale('de', 'consumer')
    const notPurchase = at(consumer, 'order_form.success_not_purchase')
    const held = await holdResponse(page, '/api/consumer-order', async ({ json }) => {
      await expect(page.getByText(notPurchase)).toHaveCount(0)
      expect(leadById(json.leadId)).toBeTruthy()
    })
    await form.locator('button[type="submit"]').click()

    await expect(page.getByText(notPurchase)).toBeVisible({ timeout: 30_000 })
    expect(held[0].failures).toEqual([])

    const lead = leadById(held[0].json.leadId)!
    expect(lead.journey).toBe('consumer_order')
    expect(lead.context).toMatchObject({ productId: 'vitamin-d3-spray' })
    const reference = String(lead.context.reference)
    expect(reference).toMatch(/^PDX-[0-9A-F]{8}$/u)
    expect(held[0].json.reference).toBe(reference)
    // Die Vorgangsnummer, die der Kunde sieht, ist die gespeicherte (PT273-F1).
    await expect(page.getByText(reference)).toBeVisible()
    expect(lead.status).not.toBe('DELIVERED')

    const text = ((await page.locator('body').textContent()) ?? '').toLowerCase()
    for (const claim of [
      'gekauft',
      'bezahlt',
      'zahlung erhalten',
      'kaufvertrag geschlossen',
      'bestellung bestätigt',
    ]) {
      expect(text, claim).not.toContain(claim)
    }
  })
})

test.describe('PT27.3 · Lead-Magnet', () => {
  const resource = findResource(SAMPLE_BUNDLE_ASSET_ID)
  if (!resource) throw new Error(`Lead-Magnet ${SAMPLE_BUNDLE_ASSET_ID} fehlt im Inventar`)
  const variant = resource.variants[0]

  test('Resource Center → Gate → gespeicherter Anspruch → geschuetzte, echte Datei; kein Bypass', async ({
    page,
    request,
  }) => {
    await freshSender(page)
    const email = `pt273-gate-${uid()}@praxis.example`
    const posts = countPosts(page, '/api/content-download')
    await page.goto('/de/downloads')
    const card = page.locator(`[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"]`)
    await expect(card).toHaveAttribute('data-resource-access', 'GATED')
    await expect(card.locator('a[href*=".zip"]')).toHaveCount(0)

    const trigger = card.locator('button[data-gate-asset]')
    await expect(async () => {
      if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
      await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    const gate = page.locator('[data-gate-state="form"]')
    await gate.locator('input[type="text"]').first().fill('Dr. PT Gate')
    await gate.locator('input[type="email"]').fill(email)
    await gate.locator('input[type="text"]').nth(1).fill('Praxis PT27.3')

    // Ohne Verarbeitungs-Consent: kein Request, kein Download.
    await gate.locator('button[type="submit"]').click()
    await expect(page.locator('[data-gate-state="success"]')).toHaveCount(0)
    expect(posts).toHaveLength(0)

    await gate.locator('input[type="checkbox"]').first().check()
    const held = await holdResponse(page, '/api/content-download', async ({ json }) => {
      await expect(page.locator('[data-gate-state="success"]')).toHaveCount(0)
      expect(leadById(json.leadId)?.journey).toBe('content_download')
      const entitlement = readDb((db) =>
        db
          .prepare(
            'SELECT asset_id AS assetId, lead_id AS leadId FROM resource_entitlements WHERE lead_id = ?',
          )
          .get(json.leadId),
      )
      expect(entitlement).toMatchObject({ assetId: SAMPLE_BUNDLE_ASSET_ID, leadId: json.leadId })
    })
    await gate.locator('button[type="submit"]').click()
    const success = page.locator('[data-gate-state="success"]')
    await expect(success).toBeVisible({ timeout: 20_000 })
    expect(held[0].failures).toEqual([])

    const link = success.locator('a[data-gate-download]')
    const href = (await link.getAttribute('href')) as string
    expect(href).toContain(`/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}`)
    const downloadPromise = page.waitForEvent('download')
    await link.click()
    const download = await downloadPromise
    const file = fs.readFileSync((await download.path()) as string)
    expect(file.length).toBe(variant.bytes)
    expect(createHash('sha256').update(file).digest('hex')).toBe(variant.sha256)

    // Manipulierter Link und oeffentliche Pfade liefern die Datei nicht.
    const url = new URL(href, 'http://pt27.3.invalid')
    const token = url.searchParams.get('t') as string
    url.searchParams.set('t', `${token.slice(0, -1)}${token.endsWith('A') ? 'B' : 'A'}`)
    const tampered = await request.get(`${url.pathname}${url.search}`, { maxRedirects: 0 })
    expect(tampered.status()).toBe(403)
    for (const candidate of [
      `/downloads/${variant.path}`,
      `/${variant.path}`,
      `/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}`,
    ]) {
      const response = await request.get(candidate, { maxRedirects: 0 })
      expect(response.status(), candidate).not.toBe(200)
    }
  })
})

test.describe('PT27.3 · Support', () => {
  const PDF = Buffer.from('%PDF-1.4\nPT27.3 support attachment\n%%EOF\n')

  test('Einstieg → Validierung → Submit mit Anhang → gespeicherter Vorgang → Erfolg', async ({
    page,
  }) => {
    await freshSender(page)
    const email = `pt273-support-${uid()}@praxis.example`
    const posts = countPosts(page, '/api/support')
    await page.goto('/de/')
    await page.locator('a[href="/de/support"]').first().click()
    await expect(page).toHaveURL(/\/de\/support$/)
    await page.waitForLoadState('networkidle')

    await page.locator('#name').fill('Dr. PT Support')
    await page.locator('#email').fill(email)
    await page.locator('#udi').fill('S0DA25000PT273')
    await page.locator('#swVersion').fill('1.8.42')
    await page.locator('#issueType').selectOption('hardware')
    await page.locator('#subject').fill('PT27.3: Reader startet nicht')
    await page.locator('#description').fill('PT27.3 Beschreibung des Problems.')
    await page.locator('#attachment').setInputFiles({
      name: 'pt273-log.pdf',
      mimeType: 'application/pdf',
      buffer: PDF,
    })

    const form = page.locator('form').filter({ has: page.locator('#udi') })
    const submit = page.getByRole('button', { name: 'Absenden' })
    const support = locale('de', 'support')
    const successText = at(support, 'support.form.success')
    // `#attachment-filename` ist selbst ein `role="status"` (Dateiname) — geprueft wird deshalb die
    // Erfolgsmeldung, nicht jede Statusregion.
    await submit.click()
    await expect(form.locator('[role="alert"]').first()).toBeVisible()
    await expect(form.getByText(successText)).toHaveCount(0)
    expect(posts).toHaveLength(0)

    await page.locator('#consent').check()
    const held = await holdResponse(page, '/api/support', async ({ json }) => {
      await expect(form.getByText(successText)).toHaveCount(0)
      expect(leadById(json.leadId)).toBeTruthy()
    })
    await submit.click()
    await expect(form.getByText(successText)).toBeVisible()
    expect(held[0].failures).toEqual([])

    const lead = leadById(held[0].json.leadId)!
    expect(lead.journey).toBe(held[0].json.journey)
    expect(lead.subject).toMatchObject({ email })
    expect(lead.status).not.toBe('DELIVERED')
    // Der Anhang ist mit Metadaten am Vorgang gespeichert und liegt byte-gleich unter einer
    // servereigenen, opaken Ablage-ID — nicht unter dem Client-Dateinamen.
    const attachments = lead.context.attachments as Array<Record<string, unknown>>
    expect(attachments).toEqual([
      expect.objectContaining({
        originalName: 'pt273-log.pdf',
        mime: 'application/pdf',
        size: PDF.length,
        storageId: expect.stringMatching(/^[0-9a-f]{32}\.pdf$/),
      }),
    ])
    const storedFile = resolve(
      PT273_UPLOAD_DIR,
      String(lead.context.caseDir),
      String(attachments[0].storageId),
    )
    expect(fs.readFileSync(storedFile)).toEqual(PDF)
  })
})

test.describe('PT27.3 · Sprachwechsel', () => {
  const languageNames: Record<SupportedLanguage, string> = {
    de: 'Deutsch',
    en: 'English',
    pl: 'Polski',
    fr: 'Français',
    it: 'Italiano',
    es: 'Español',
    pt: 'Português',
    da: 'Dansk',
    nl: 'Nederlands',
    cs: 'Čeština',
  }

  for (const [source, path, target, family] of [
    ['de', '/diagnostics/dental', 'en', 'B2B'],
    ['de', '/epigenetics/grundlagen', 'pl', 'Epigenetik'],
    ['pl', '/consumer/vitamin-d3-spray', 'cs', 'Consumer'],
    ['fr', '/articles/die-gruene-praxis', 'de', 'Content'],
    ['it', '/downloads', 'nl', 'Ressourcen'],
    ['de', '/privacy', 'es', 'Legal'],
  ] as const) {
    test(`${family}: ${source}${path} → ${target} bleibt auf derselben Seite`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${source}${path}`)
      const trigger = page
        .getByRole('button', { name: at(locale(source, 'common'), 'a11y.select_language') })
        .first()
      const option = page.getByRole('button', { name: languageNames[target], exact: true })
      await expect(async () => {
        if ((await option.count()) === 0) await trigger.click()
        await expect(option).toHaveCount(1, { timeout: 500 })
      }).toPass({ timeout: 20_000 })
      await option.click()

      await page.waitForURL(`**/${target}${path}`)
      expect(new URL(page.url()).pathname).toBe(`/${target}${path}`)
      await expect(page.locator('html')).toHaveAttribute('lang', target)
      const direct = await request.get(`/${target}${path}`, { maxRedirects: 0 })
      expect(direct.status()).toBe(200)
    })
  }

  test('jede Locale bleibt beim Direktaufruf, kein Zwangsredirect auf EN', async ({ request }) => {
    for (const lang of SUPPORTED_LANGUAGES) {
      for (const path of ['/diagnostics/dental', '/privacy']) {
        const response = await request.get(`/${lang}${path}`, { maxRedirects: 0 })
        expect(response.status(), `/${lang}${path}`).toBe(200)
        expect(response.headers().location, `/${lang}${path}`).toBeUndefined()
      }
    }
  })
})

test.describe('PT27.3 · Suche', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('Tastatur → reale Treffer ohne tote Ziele und ohne Registry-Drift → Navigation', async ({
    page,
    request,
  }) => {
    const searchable = new Set(
      getSearchEligibleRouteEntries().map((route) => `/de${route.path === '/' ? '/' : route.path}`),
    )
    await page.goto('/de/')
    const trigger = page.getByRole('button', { name: 'Suche öffnen' }).first()
    await expect(async () => {
      if (!(await page.getByRole('dialog').isVisible())) {
        await trigger.focus()
        await page.keyboard.press('Enter')
      }
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    const searchbox = page.getByRole('searchbox', { name: 'Suchbegriff' })
    await expect(searchbox).toBeFocused()

    for (const query of ['Epigenetik', 'Dental', 'Vitamin']) {
      await searchbox.fill(query)
      const links = page.getByRole('dialog').locator('a[href^="/de"]')
      await expect(links.first()).toBeVisible()
      const hrefs = await links.evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href') as string),
      )
      expect(hrefs.length, query).toBeGreaterThan(0)
      for (const href of hrefs) {
        const path = href.split(/[?#]/)[0]
        // Der Router rendert die Startseite als `/de` (Basename ohne Slash); der Registry-Pfad ist `/`.
        const logical = path === '/de' ? '/de/' : path
        expect(searchable.has(logical), `${query}: ${href} ist kein Registry-Suchziel`).toBe(true)
        expect((await request.get(path, { maxRedirects: 0 })).status(), href).toBe(200)
      }
    }

    await searchbox.fill('Epigenetik')
    const target = page.getByRole('dialog').locator('a[href="/de/epigenetics"]')
    await expect(target).toHaveCount(1)
    await target.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL('**/de/epigenetics')
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
