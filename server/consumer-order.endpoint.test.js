// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

/**
 * AP21 PT21.5 — die HTTP-Schicht der Consumer-Order-Journey.
 *
 * Der Server laeuft als echter Prozess gegen eine temporaere Datenbank.
 * SENDGRID_API_KEY ist LEER: der CRM-Adapter registriert sich bewusst nicht,
 * damit der ehrliche NO_PROVIDER_CONFIGURED-Pfad gemessen wird — kein
 * Fake-SENT, kein Netzwerk.
 *
 * Der Endpunkt lief bis PT21.4 OHNE Rate Limit; genau das wird hier gemessen.
 */

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const here = path.dirname(fileURLToPath(import.meta.url))

const body = (overrides = {}) => ({
  product: 'duo',
  variant: 'set',
  quantity: 1,
  name: 'Mila Sørensen',
  email: 'mila@example.com',
  locale: 'de',
  processingConsent: true,
  consentAcceptedAt: '2026-09-08T09:00:00.000Z',
  ...overrides,
})

describe('AP21 PT21.5 consumer-order HTTP', () => {
  let directory
  let child
  let baseUrl
  let dbPath
  let key = 0

  const post = (payload, { headers = {}, ip = '198.51.100.1', idempotencyKey } = {}) =>
    fetch(`${baseUrl}/api/consumer-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey ?? `http-${(key += 1)}`,
        'X-Forwarded-For': ip,
        ...headers,
      },
      body: JSON.stringify(payload),
    })

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt215-http-'))
    dbPath = path.join(directory, 'leads.sqlite3')
    const net = await import('node:net')
    const port = await new Promise((resolve) => {
      const server = net.createServer().listen(0, '127.0.0.1', () => {
        const { port: free } = server.address()
        server.close(() => resolve(free))
      })
    })
    child = fork(path.join(here, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        SENDGRID_API_KEY: '',
        CONTACT_RECEIVER: 'team@polarisdx.example',
        SENDER_EMAIL: 'web@polarisdx.example',
        LEAD_DB_PATH: dbPath,
      },
      stdio: 'pipe',
    })
    baseUrl = `http://127.0.0.1:${port}`

    const deadline = Date.now() + 20_000
    for (;;) {
      try {
        await fetch(`${baseUrl}/api/consumer-order`, { method: 'POST' })
        break
      } catch {
        if (Date.now() > deadline) throw new Error('server did not start')
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    }
  }, 40_000)

  afterAll(() => {
    child?.kill()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('nimmt eine gueltige Bestellanfrage mit 202 an und persistiert sie', async () => {
    const response = await post(body(), { ip: '198.51.100.10' })
    expect(response.status).toBe(202)
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.journey).toBe('consumer_order')
    // AP22 PT22.5: die Vorgangsnummer heisst im gemeinsamen Envelope `reference`.
    expect(json.reference).toMatch(/^PDX-[0-9A-F]{8}$/)
    // Ohne Provider ehrlich gemeldet statt Erfolg behauptet.
    expect(json.providerConfigured).toBe(false)

    const db = new Database(dbPath, { readonly: true })
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(json.leadId)
    expect(lead.journey).toBe('consumer_order')
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.last_error_class).toBe('NO_PROVIDER_CONFIGURED')
    const context = JSON.parse(lead.context_json)
    expect(context.productId).toBe('inside-out-duo')
    expect(context.variant).toBe('set')
    expect(context.quantity).toBe(1)
    expect(context.originRoute).toBe('/de/consumer/inside-out-duo')
    const consent = JSON.parse(lead.consent_json)
    expect(consent.processingAccepted).toBe(true)
    expect(consent.marketing).toBe('DENIED')
    db.close()
  })

  it('lehnt unbekanntes Produkt, fremde Variante und ungueltige Menge mit 400 ab', async () => {
    const cases = [
      [body({ product: 'igloo-pro' }), 'UNKNOWN_PRODUCT'],
      [body({ variant: 'pack-12' }), 'UNKNOWN_VARIANT'],
      [body({ quantity: '1 Duo set' }), 'INVALID_QUANTITY'],
      [body({ processingConsent: false }), 'PROCESSING_CONSENT_REQUIRED'],
    ]
    let ip = 20
    for (const [payload, code] of cases) {
      const response = await post(payload, { ip: `198.51.100.${(ip += 1)}` })
      expect(response.status, code).toBe(400)
      expect((await response.json()).code).toBe(code)
    }
  })

  it('meldet einen Idempotency-Konflikt mit 409', async () => {
    const shared = 'http-conflict'
    const first = await post(body(), { ip: '198.51.100.30', idempotencyKey: shared })
    expect(first.status).toBe(202)
    const replay = await post(body(), { ip: '198.51.100.30', idempotencyKey: shared })
    expect(replay.status).toBe(202)
    expect((await replay.json()).leadId).toBe((await first.json()).leadId)

    const conflict = await post(body({ quantity: 3 }), {
      ip: '198.51.100.30',
      idempotencyKey: shared,
    })
    expect(conflict.status).toBe(409)
    expect((await conflict.json()).code).toBe('IDEMPOTENCY_CONFLICT')
  })

  it('verwirft den Honeypot still, ohne etwas zu persistieren', async () => {
    const db = new Database(dbPath, { readonly: true })
    const before = db.prepare('SELECT COUNT(*) AS n FROM leads').get().n
    const response = await post(body({ _hp: 'bot' }), { ip: '198.51.100.40' })
    expect(response.status).toBe(200)
    expect((await response.json()).success).toBe(true)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(before)
    db.close()
  })

  it('ist rate-limitet — vorher lief dieser Endpunkt ohne jedes Limit', async () => {
    const ip = '198.51.100.99'
    const codes = []
    for (let i = 0; i < 8; i += 1) {
      codes.push((await post(body(), { ip })).status)
    }
    expect(codes.filter((code) => code === 429).length).toBeGreaterThan(0)
    // Eine andere IP bleibt davon unberuehrt.
    expect((await post(body(), { ip: '198.51.100.77' })).status).toBe(202)
  })
})
