// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

/**
 * AP20 PT20.2 — die HTTP-Schicht der Contact-Journey.
 *
 * Statuscodes, Rate Limit, Honeypot und Persistenz entstehen erst in
 * `server.js` und sind mit reinen Service-Tests unbelegt. Der Server laeuft
 * als echter Prozess gegen eine temporaere Datenbank. SENDGRID_API_KEY ist
 * LEER gesetzt: der CRM-Adapter registriert sich bewusst nicht, damit der
 * ehrliche NO_PROVIDER_CONFIGURED-Pfad gemessen wird (kein Fake-SENT, kein
 * Netzwerk).
 */

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const here = path.dirname(fileURLToPath(import.meta.url))

const body = (overrides = {}) => ({
  name: 'Dr. Mila Sørensen',
  email: 'mila@praxis.example',
  company: 'Praxis Nord',
  phone: '+44 20 0000 0000',
  area: 'Dental',
  intent: 'quote',
  field: 'dental',
  locale: 'de',
  message: 'Bitte um ein Angebot fuer ein POC-Panel.',
  processingConsent: true,
  consentAcceptedAt: '2026-09-02T09:00:00.000Z',
  ...overrides,
})

describe('AP20 PT20.2 contact HTTP', () => {
  let directory
  let child
  let baseUrl
  let dbPath
  let key = 0

  const post = (payload, { headers = {}, ip = '203.0.113.1' } = {}) =>
    fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `http-${(key += 1)}`,
        'X-Forwarded-For': ip,
        ...headers,
      },
      body: JSON.stringify(payload),
    })

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt202-http-'))
    dbPath = path.join(directory, 'leads.sqlite3')
    const port = 4500 + (process.pid % 400)
    child = fork(path.join(here, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        // Wichtig: server/.env Koennte einen echten Schluessel liefern; der
        // Fork-Env-Wert gewinnt und haelt alle Tests im NO_PROVIDER-Pfad.
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
        await fetch(`${baseUrl}/api/contact`, { method: 'POST' })
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

  it('nimmt eine gueltige Anfrage mit 202 an und persistiert den Lead', async () => {
    const response = await post(body(), { ip: '203.0.113.10' })
    expect(response.status).toBe(202)
    const json = await response.json()
    expect(json.accepted).toBe(true)
    expect(json.journey).toBe('contact')
    // Kein Provider konfiguriert -> ehrlich gemeldet statt Erfolg behauptet.
    expect(json.providerConfigured).toBe(false)

    const db = new Database(dbPath, { readonly: true })
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(json.leadId)
    expect(lead.journey).toBe('contact')
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.last_error_class).toBe('NO_PROVIDER_CONFIGURED')
    const subject = JSON.parse(lead.subject_json)
    expect(subject.name).toBe('Dr. Mila Sørensen')
    const context = JSON.parse(lead.context_json)
    expect(context.locale).toBe('de')
    const consent = JSON.parse(lead.consent_json)
    expect(consent.processingAccepted).toBe(true)
    db.close()
  })

  it('lehnt fehlende Pflichtangaben mit 400 und Feldliste ab', async () => {
    const response = await post(body({ name: 'A', email: 'ungueltig', message: '' }), {
      ip: '203.0.113.11',
    })
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.accepted).toBe(false)
    expect(json.code).toBe('VALIDATION_FAILED')
    expect(json.fields).toEqual(expect.arrayContaining(['name', 'email', 'message']))
  })

  it('lehnt fehlenden Processing-Consent mit 400 ab', async () => {
    const response = await post(body({ processingConsent: false }), { ip: '203.0.113.12' })
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.code).toBe('PROCESSING_CONSENT_REQUIRED')
  })

  it('akzeptiert Marketing-Verweigerung — die Anfrage bleibt funktional', async () => {
    const response = await post(body({ marketingConsent: false }), { ip: '203.0.113.13' })
    expect(response.status).toBe(202)
  })

  it('ist idempotent: Replay mit gleichem Key liefert denselben Lead, kein Duplikat', async () => {
    const first = await post(body(), {
      ip: '203.0.113.14',
      headers: { 'Idempotency-Key': 'replay-key' },
    })
    expect(first.status).toBe(202)
    const replay = await post(body(), {
      ip: '203.0.113.15',
      headers: { 'Idempotency-Key': 'replay-key' },
    })
    expect(replay.status).toBe(202)
    const [a, b] = await Promise.all([first.json(), replay.json()])
    expect(b.leadId).toBe(a.leadId)
  })

  it('gibt 409, wenn derselbe Key einen abweichenden Payload traegt', async () => {
    const headers = { 'Idempotency-Key': 'conflict-key' }
    await post(body(), { ip: '203.0.113.16', headers })
    const response = await post(body({ message: 'Voellig anderer Inhalt' }), {
      ip: '203.0.113.17',
      headers,
    })
    expect(response.status).toBe(409)
    const json = await response.json()
    expect(json.code).toBe('IDEMPOTENCY_CONFLICT')
  })

  it('honoriert den Honeypot still mit 200 — kein Lead entsteht', async () => {
    const db = new Database(dbPath, { readonly: true })
    const before = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c
    db.close()
    const response = await post(body({ _hp: 'bot-filled' }), { ip: '203.0.113.18' })
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.accepted).toBe(true)
    const after = new Database(dbPath, { readonly: true })
    expect(after.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(before)
    after.close()
  })

  it('drosselt Missbrauch ueber den Form-Rate-Limit (429 nach dem Fenster-Budget)', async () => {
    const ip = '203.0.113.99'
    const results = []
    for (let i = 0; i < 7; i += 1) {
      const response = await post(body(), { ip })
      results.push(response.status)
    }
    expect(results.filter((status) => status === 202).length).toBe(5)
    expect(results.filter((status) => status === 429).length).toBeGreaterThanOrEqual(2)
  })

  it('persistiert keine fremde Attribution — allowlisted nur', async () => {
    const response = await post(
      body({ source: 'evil', journey: 'consumer', section: 'x', campaign: 'ok-campaign' }),
      { ip: '203.0.113.20' },
    )
    expect(response.status).toBe(202)
    const { leadId } = await response.json()
    const db = new Database(dbPath, { readonly: true })
    const context = JSON.parse(
      db.prepare('SELECT context_json FROM leads WHERE id = ?').get(leadId).context_json,
    )
    db.close()
    expect(context.source).toBe('')
    expect(context.journey).toBe('')
    expect(context.section).toBe('')
    expect(context.campaign).toBe('ok-campaign')
  })
})
