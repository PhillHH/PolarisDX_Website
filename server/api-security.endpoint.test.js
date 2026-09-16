// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP26 PT26.3 — API- und Formular-Security, negativ gemessen.
 *
 * Der Server laeuft in diesem Prozess (eigene Datenbank, eigener Upload-Ordner). Der
 * Mail-Provider ist durch eine Funktion ersetzt, die mit einem Fehler voller Interna
 * wirft: Markertext, Pfad, ein Schluessel-aehnlicher Wert. Kein Aufruf verlaesst den
 * Rechner. Jeder Fall nutzt eine eigene Absender-IP (`trust proxy` = 1 Hop), damit der
 * Limiter nur dort greift, wo er gemessen wird.
 */

const require = createRequire(import.meta.url)
const PROVIDER_MARKER = 'pt263-provider-internal-marker'
const FAKE_KEY = 'SG.pt263-fake-key-never-in-output'
const CONSENT = { processingConsent: true, consentAcceptedAt: '2026-09-15T09:00:00.000Z' }
const LEAK =
  /at .*\.js:\d+|node_modules|\/home\/|\/tmp\/|SQLITE|stack|pt263-provider-internal-marker|SG\.pt263/i

const ROUTES = [
  '/api/contact',
  '/api/support',
  '/api/consumer-order',
  '/api/epigenetics-inquiry',
  '/api/content-download',
  '/api/roi-report',
  '/api/practice-order',
]

const contactBody = (overrides = {}) => ({
  name: 'Dr. Probe Kontakt',
  email: 'kontakt@praxis.example',
  message: 'PT26.3 Sicherheitsprobe',
  locale: 'de',
  ...CONSENT,
  ...overrides,
})

const supportBody = (attachments, overrides = {}) => ({
  name: 'Dr. Probe Support',
  email: 'support@praxis.example',
  udi: 'IGL-PT263',
  swVersion: '1.2.3',
  issueType: 'software',
  subject: 'PT26.3 Anhangsprobe',
  description: 'Synthetische Probe',
  locale: 'de',
  ...CONSENT,
  attachments,
  ...overrides,
})

const textFile = (filename, content) => ({
  filename,
  type: 'text/plain',
  content: Buffer.from(content).toString('base64'),
})

let tmp
let server
let baseUrl
let db
let supportModule
const logs = []
const responses = []
let ipCounter = 1
let keyCounter = 0
const nextIp = () => `198.51.100.${ipCounter++}`
const nextKey = () => `pt263-key-${(keyCounter += 1)}`

async function send(
  route,
  { body, raw, key = nextKey(), ip = nextIp(), headers = {}, method = 'POST' } = {},
) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      ...(raw === undefined && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(key === null ? {} : { 'Idempotency-Key': key }),
      'X-Forwarded-For': ip,
      ...headers,
    },
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  })
  const text = await response.text()
  responses.push(text)
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    // Nicht-JSON bleibt `null` — die Tests pruefen das ausdruecklich.
  }
  return { status: response.status, headers: response.headers, json, text }
}

const leadCount = () => db.prepare('SELECT COUNT(*) AS n FROM leads').get().n
const leadByKey = (key) => db.prepare('SELECT * FROM leads WHERE idempotency_key = ?').get(key)

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt263-api-'))
  Object.assign(process.env, {
    NODE_ENV: 'test',
    LEAD_DB_PATH: path.join(tmp, 'leads.sqlite3'),
    SUPPORT_UPLOAD_DIR: path.join(tmp, 'uploads'),
    SENDGRID_API_KEY: FAKE_KEY,
    CONTACT_RECEIVER: 'team@polarisdx.example',
    SENDER_EMAIL: 'web@polarisdx.example',
  })
  for (const name of ['APP_ENV', 'DEPLOY_ENV', 'DRY_RUN', 'FRONTEND_URL']) delete process.env[name]

  for (const level of ['log', 'info', 'warn', 'error']) {
    console[level] = (...args) =>
      logs.push(args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' '))
  }

  const { app } = require('./server.js')
  supportModule = require('./support-case.js')
  // Der Provider scheitert mit Interna im Fehler — sie duerfen nirgends nach aussen.
  require('@sendgrid/mail').send = async () => {
    throw Object.assign(
      new Error(`${PROVIDER_MARKER} rejected ${FAKE_KEY} at /home/ops/secret.js:1`),
      {
        code: 'EPROVIDER',
        response: { statusCode: 401, body: { errors: [{ message: PROVIDER_MARKER }] } },
      },
    )
  }
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve)
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
  // Erste Anfrage legt die Datenbank an.
  await send('/api/contact', { body: contactBody({ name: '' }) })
  const Database = require('better-sqlite3')
  db = new Database(process.env.LEAD_DB_PATH, { readonly: true, fileMustExist: true })
}, 30_000)

afterAll(async () => {
  db?.close()
  await new Promise((resolve) => server?.close(resolve))
  fs.rmSync(tmp, { recursive: true, force: true })
})

describe('PT26.3 — Eingangsform', () => {
  it('verlangt JSON: text/plain, Formular-Encoding und fehlender Body → 415, nichts gespeichert', async () => {
    const before = leadCount()
    for (const route of ROUTES) {
      const plain = await send(route, {
        raw: JSON.stringify(contactBody()),
        headers: { 'Content-Type': 'text/plain' },
      })
      const form = await send(route, {
        raw: 'name=x&email=x%40y.example',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      const empty = await send(route, {})
      for (const result of [plain, form, empty]) {
        expect(result.status, route).toBe(415)
        expect(result.json).toEqual({ accepted: false, code: 'UNSUPPORTED_MEDIA_TYPE' })
      }
    }
    expect(leadCount()).toBe(before)
  })

  it('akzeptiert nur ein JSON-Objekt: Array, Zeichenkette und kaputtes JSON → 400 ohne Interna', async () => {
    for (const raw of ['[{"name":"x"}]', '"nur text"', '{"name":']) {
      const result = await send('/api/contact', {
        raw,
        headers: { 'Content-Type': 'application/json' },
      })
      expect(result.status, raw).toBe(400)
      expect(result.json.code).toBe('INVALID_JSON')
      expect(result.text).not.toMatch(LEAK)
    }
  })

  it('prueft das Idempotency-Key-Format statt still zu kuerzen', async () => {
    for (const key of ['k'.repeat(201), 'mit leerzeichen']) {
      const result = await send('/api/contact', { body: contactBody(), key })
      expect(result.status).toBe(400)
      expect(result.json.code).toBe('IDEMPOTENCY_KEY_INVALID')
      expect(leadByKey(key)).toBeUndefined()
    }
    const missing = await send('/api/contact', { body: contactBody(), key: null })
    expect(missing.status).toBe(400)
    expect(missing.json.code).toBe('IDEMPOTENCY_KEY_REQUIRED')
  })

  it('nimmt unbekannte Felder an, speichert und spiegelt sie aber nicht', async () => {
    const key = nextKey()
    const result = await send('/api/contact', {
      key,
      body: contactBody({
        isAdmin: true,
        status: 'DELIVERED',
        leadId: 'forged-lead-id',
        recipient: 'relay@attacker.example',
        to: 'relay@attacker.example',
        constructor: { prototype: { polluted: true } },
      }),
    })
    expect(result.status).toBe(202)
    expect(result.json.leadId).not.toBe('forged-lead-id')
    expect(result.text).not.toMatch(/attacker|isAdmin|forged/)
    const stored = JSON.stringify(leadByKey(key))
    expect(stored).not.toMatch(/attacker|isAdmin|forged|polluted/)
    expect({}.polluted).toBeUndefined()
  })
})

describe('PT26.3 — Grenzen vor der Verarbeitung', () => {
  it('lehnt uebergrosse JSON-Bodies mit 413 ab, bevor sie gelesen werden', async () => {
    const before = leadCount()
    const big = contactBody({ message: 'x'.repeat(70 * 1024) })
    for (const route of ROUTES.filter((route) => route !== '/api/support')) {
      const result = await send(route, { body: big })
      expect(result.status, route).toBe(413)
      expect(result.json).toEqual({ accepted: false, code: 'PAYLOAD_TOO_LARGE' })
    }
    expect(leadCount()).toBe(before)
  })

  it('Support: ueber der Anhangsgrenze 413, eine Datei ueber 5 MB 400 — beides ohne Datei auf der Platte', async () => {
    const tooLargeBody = supportBody([
      textFile('gross.txt', 'a'.repeat(Math.ceil(supportModule.MAX_TOTAL_BYTES * 1.1))),
    ])
    const overLimit = await send('/api/support', { body: tooLargeBody })
    expect(overLimit.status).toBe(413)
    expect(overLimit.json.code).toBe('PAYLOAD_TOO_LARGE')

    const oneFileTooLarge = await send('/api/support', {
      body: supportBody([textFile('datei.txt', 'b'.repeat(supportModule.MAX_FILE_BYTES + 1))]),
    })
    expect(oneFileTooLarge.status).toBe(400)
    expect(oneFileTooLarge.json.code).toBe('ATTACHMENT_SIZE')
    expect(fs.existsSync(path.join(tmp, 'uploads'))).toBe(false)
  })

  it('der Limiter greift vor dem Parser: gedrosselt heisst 429, auch fuer kaputte und uebergrosse Bodies', async () => {
    const ip = nextIp()
    for (let i = 0; i < 5; i++) {
      const result = await send('/api/contact', { body: contactBody({ name: '' }), ip })
      expect(result.status).toBe(400)
    }
    const broken = await send('/api/contact', {
      raw: '{"kaputt":',
      headers: { 'Content-Type': 'application/json' },
      ip,
    })
    expect(broken.status).toBe(429)
    const oversized = await send('/api/contact', {
      body: contactBody({ message: 'x'.repeat(200 * 1024) }),
      ip,
    })
    expect(oversized.status).toBe(429)
    // Der Eimer gilt je IP und fuer alle Formulare gemeinsam.
    expect((await send('/api/support', { body: supportBody([]), ip })).status).toBe(429)
  })
})

describe('PT26.3 — Allowlists, Consent, Honeypot, Idempotenz', () => {
  it('unbekanntes Asset, Produkt und ungueltige Locale → 400, kein Lead', async () => {
    const before = leadCount()
    const asset = await send('/api/content-download', {
      body: {
        name: 'Dr. Probe',
        email: 'dl@praxis.example',
        organization: 'Praxis',
        locale: 'de',
        assetId: '../../etc/passwd',
        ...CONSENT,
      },
    })
    expect(asset.status).toBe(400)
    expect(asset.json.code).toBe('UNKNOWN_ASSET')
    expect(asset.text).not.toMatch(/passwd|\/etc\//)

    const locale = await send('/api/content-download', {
      body: {
        name: 'Dr. Probe',
        email: 'dl@praxis.example',
        organization: 'Praxis',
        locale: 'xx',
        assetId: 'rsc-epi-019',
        ...CONSENT,
      },
    })
    expect(locale.status).toBe(400)
    expect(locale.json.fieldErrors.map((error) => error.field)).toContain('locale')

    for (const route of ['/api/consumer-order', '/api/practice-order']) {
      const product = await send(route, {
        body: {
          ...contactBody(),
          product: 'free-iphone',
          variant: 'gold',
          quantity: 1,
          street: 'Weg 1',
          postcode: '20095',
          city: 'Hamburg',
          country: 'DE',
          organization: 'Praxis',
          orgType: 'practice',
        },
      })
      expect(product.status, route).toBe(400)
      expect(product.text).not.toMatch(/free-iphone|gold/)
    }
    expect(leadCount()).toBe(before)
  })

  it('ohne Processing-Consent kein Vorgang; Honeypot still 200 ohne Vorgang', async () => {
    const before = leadCount()
    const { processingConsent: _p, ...withoutConsent } = contactBody()
    const noConsent = await send('/api/contact', { body: withoutConsent })
    expect(noConsent.status).toBe(400)
    expect(noConsent.json.code).toBe('PROCESSING_CONSENT_REQUIRED')

    const bot = await send('/api/contact', { body: contactBody({ _hp: 'https://spam.example' }) })
    expect(bot.status).toBe(200)
    expect(bot.json.state).toBe('IGNORED')
    expect(leadCount()).toBe(before)
  })

  it('gleicher Key + gleicher Body = derselbe Vorgang; anderer Body = 409', async () => {
    const key = nextKey()
    const first = await send('/api/contact', { body: contactBody(), key })
    const replay = await send('/api/contact', { body: contactBody(), key })
    expect(first.status).toBe(202)
    expect(replay.status).toBe(202)
    expect(replay.json.leadId).toBe(first.json.leadId)

    const conflict = await send('/api/contact', {
      body: contactBody({ message: 'Anderer Inhalt' }),
      key,
    })
    expect(conflict.status).toBe(409)
    expect(conflict.json.code).toBe('IDEMPOTENCY_CONFLICT')
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads WHERE idempotency_key = ?').get(key).n).toBe(
      1,
    )
  })
})

describe('PT26.3 — Support-Anhaenge', () => {
  it('Traversal-Dateiname → 400, nichts ausserhalb des Upload-Ordners', async () => {
    for (const filename of ['../../escape.txt', '..\\..\\escape.txt', 'sub/escape.txt']) {
      const result = await send('/api/support', { body: supportBody([textFile(filename, 'x')]) })
      expect(result.status, filename).toBe(400)
      expect(result.json.code).toBe('ATTACHMENT_TRAVERSAL')
    }
    expect(fs.existsSync(path.join(tmp, 'escape.txt'))).toBe(false)
    expect(fs.existsSync(path.join(os.tmpdir(), 'escape.txt'))).toBe(false)
  })

  it('gleicher Key mit gleich benannter, gleich grosser, aber anderer Datei → 409; Original bleibt unveraendert', async () => {
    const key = nextKey()
    const original = await send('/api/support', {
      body: supportBody([textFile('befund.txt', 'AAAA-original')]),
      key,
    })
    expect(original.status).toBe(202)
    const lead = leadByKey(key)
    const context = JSON.parse(lead.context_json ?? lead.context)
    const [meta] = context.attachments
    const stored = path.join(tmp, 'uploads', context.caseDir, meta.storageId)
    expect(fs.readFileSync(stored, 'utf8')).toBe('AAAA-original')

    const tampered = await send('/api/support', {
      body: supportBody([textFile('befund.txt', 'BBBB-tampered')]),
      key,
    })
    expect(tampered.status).toBe(409)
    expect(tampered.json.code).toBe('IDEMPOTENCY_CONFLICT')
    expect(fs.readFileSync(stored, 'utf8')).toBe('AAAA-original')
    // Die abgelehnte Datei bleibt nicht als Waise liegen.
    expect(fs.readdirSync(path.join(tmp, 'uploads', context.caseDir))).toEqual([meta.storageId])

    const replay = await send('/api/support', {
      body: supportBody([textFile('befund.txt', 'AAAA-original')]),
      key,
    })
    expect(replay.status).toBe(202)
    expect(replay.json.leadId).toBe(original.json.leadId)
    expect(fs.readFileSync(stored, 'utf8')).toBe('AAAA-original')
  })
})

describe('PT26.3 — Origin, CORS, CSRF', () => {
  it('schreibende Aufrufe von fremden Seiten werden vor jeder Verarbeitung abgelehnt', async () => {
    const before = leadCount()
    for (const site of ['cross-site', 'same-site']) {
      const result = await send('/api/contact', {
        body: contactBody(),
        headers: { 'Sec-Fetch-Site': site, Origin: 'https://attacker.example' },
      })
      expect(result.status, site).toBe(403)
      expect(result.json).toEqual({ accepted: false, code: 'CROSS_SITE_REQUEST' })
    }
    expect(leadCount()).toBe(before)

    for (const site of ['same-origin', 'none', undefined]) {
      const result = await send('/api/contact', {
        body: contactBody({ name: '' }),
        headers: site ? { 'Sec-Fetch-Site': site } : {},
      })
      expect(result.status, String(site)).toBe(400)
    }
  })

  it('ohne konfigurierte Origin keine CORS-Freigabe — auch nicht fuer localhost', async () => {
    for (const origin of [
      'https://attacker.example',
      'http://localhost:3000',
      'http://localhost:2026',
    ]) {
      const preflight = await fetch(`${baseUrl}/api/contact`, {
        method: 'OPTIONS',
        headers: {
          Origin: origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,idempotency-key',
        },
      })
      expect(preflight.headers.get('access-control-allow-origin'), origin).toBeNull()
      expect(preflight.headers.get('access-control-allow-credentials')).toBeNull()
    }
  })
})

describe('PT26.3 — Fehler- und Log-Redaktion', () => {
  it('ein scheiternder Provider verraet weder Text noch Schluessel noch Pfad — in Antwort und Log', async () => {
    const key = nextKey()
    const result = await send('/api/contact', {
      body: contactBody({ email: 'provider-probe@praxis.example' }),
      key,
    })
    // Der Vorgang ist gespeichert; der Provider-Fehler aendert daran nichts.
    expect(result.status).toBe(202)
    expect(result.json.success).toBe(true)
    expect(leadByKey(key)).toBeDefined()
    expect(result.text).not.toMatch(LEAK)

    const joinedLogs = logs.join('\n')
    expect(joinedLogs).not.toContain(PROVIDER_MARKER)
    expect(joinedLogs).not.toContain(FAKE_KEY)
    expect(joinedLogs).not.toContain('provider-probe@praxis.example')
  })

  it('keine Antwort dieser Suite enthaelt Stacktrace, Pfad, SQL oder Provider-Interna', () => {
    expect(responses.length).toBeGreaterThan(40)
    for (const text of responses) expect(text).not.toMatch(LEAK)
  })
})
