// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import net from 'node:net'
import { createHash } from 'node:crypto'
import { fork } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

/**
 * AP22-CLOSURE — unabhaengige Nachmessung der Lead-Plattform.
 *
 * Diese Datei uebernimmt KEINEN PT-PASS. Gemessen wird gegen einen echten
 * Serverprozess mit echter Datenbank: alle sieben Journeys ueber HTTP, und
 * danach wird in der Datenbank nachgesehen, was wirklich dort steht.
 *
 * Der Providerschluessel ist LEER. Das ist Absicht und selbst eine Messung:
 * ohne Adapter muss der Vorgang gespeichert und ehrlich als
 * NO_PROVIDER_CONFIGURED abgelegt werden — niemals als DELIVERED.
 *
 * Alle Identitaeten sind synthetisch (RFC 2606).
 */

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')

const GATED_ID = 'closure-fixture-001'
const RELATIVE_PATH = 'closure/fixture.pdf'
const FILE_BODY = Buffer.from('%PDF-1.4 closure fixture')

const CONSENT = { processingConsent: true, consentAcceptedAt: '2026-09-09T08:00:00.000Z' }

/**
 * Die sieben Journeys als EINE Matrix.
 *
 * `body` ist der fachlich gueltige Request, `required` ein Feld, dessen
 * Fehlen die Validierung ausloesen muss. Wer eine Journey hinzufuegt, ohne
 * hier eine Zeile zu ergaenzen, faellt beim Vollstaendigkeitstest unten auf.
 */
const JOURNEYS = [
  {
    id: 'contact',
    endpoint: '/api/contact',
    ip: '198.51.100.1',
    body: {
      name: 'Dr. Ada Beispiel',
      email: 'ada@praxis.example',
      company: 'Praxis Nord',
      phone: '+49 151 000000',
      area: 'Dental',
      intent: 'quote',
      field: 'dental',
      message: 'Bitte um Angebot fuer ein POC-Panel.',
      locale: 'de',
      source: 'homepage',
      campaign: 'relaunch-2026',
      originRoute: '/de/contact',
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'support',
    endpoint: '/api/support',
    ip: '198.51.100.2',
    body: {
      name: 'Dr. Mila Sorensen',
      email: 'mila@praxis.example',
      udi: 'S0DA25000CLOS1',
      swVersion: '1.8.42',
      issueType: 'software',
      issueTypeLabel: 'Software-Problem',
      subject: 'Verbindung bricht ab',
      description: 'Nach 30 Sekunden dropped die Bluetooth-Verbindung.',
      locale: 'de',
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'consumer_order',
    endpoint: '/api/consumer-order',
    ip: '198.51.100.3',
    body: {
      product: 'duo',
      variant: 'set',
      quantity: 1,
      name: 'Mila Sorensen',
      email: 'mila@example.com',
      locale: 'de',
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'roi_report',
    endpoint: '/api/roi-report',
    ip: '198.51.100.4',
    body: {
      email: 'ada@praxis.example',
      practice: 'Zahnarztpraxis Nord',
      area: 'implantology',
      locale: 'de',
      inputs: { testsPerMonth: '40', pricePerTest: '89', investment: 4990 },
      outputs: { dbPerMonth: 2400, revenuePerMonth: 3560, dbPerYear: 28800, dbPerTest: 60 },
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'practice_order',
    endpoint: '/api/practice-order',
    ip: '198.51.100.5',
    body: {
      product: 'vitamin-d3-k2-spray',
      quantity: 24,
      organization: 'Zahnarztpraxis Nord',
      name: 'Dr. Ada Beispiel',
      email: 'ada@praxis.example',
      phone: '+49 30 1234',
      street: 'Musterweg 1',
      postcode: '10115',
      city: 'Berlin',
      message: 'Bitte um Rueckruf.',
      locale: 'de',
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'epigenetics_inquiry',
    endpoint: '/api/epigenetics-inquiry',
    ip: '198.51.100.6',
    body: {
      name: 'Dr. Ada Beispiel',
      email: 'ada@praxis.example',
      organization: 'Zentrum Nord',
      facilityType: 'practice',
      casesPerMonth: '11-25',
      message: 'Bitte um Beratung.',
      panel: 'healthy-aging',
      focus: 'longevity',
      locale: 'de',
      source: 'epigenetics',
      campaign: 'launch',
      originRoute: '/de/epigenetics',
      ...CONSENT,
    },
    drop: 'email',
  },
  {
    id: 'content_download',
    endpoint: '/api/content-download',
    ip: '198.51.100.7',
    body: {
      name: 'Dr. Ada Beispiel',
      email: 'ada@praxis.example',
      organization: 'Praxis Nord',
      locale: 'de',
      assetId: GATED_ID,
      source: 'resource-center',
      campaign: 'launch',
      originRoute: '/de/downloads',
      ...CONSENT,
    },
    drop: 'email',
  },
]

let directory
let child
let baseUrl
let dbPath
let uploadDir
let counter = 0

const post = (endpoint, payload, { ip, idempotencyKey, headers = {} } = {}) =>
  fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey ?? `closure-${(counter += 1)}`,
      'X-Forwarded-For': ip ?? '198.51.100.250',
      ...headers,
    },
    body: JSON.stringify(payload),
  })

const openDb = () => new Database(dbPath, { readonly: true })

const leadOf = (leadId) => {
  const db = openDb()
  try {
    return db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId)
  } finally {
    db.close()
  }
}

beforeAll(async () => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-ap22-closure-'))
  dbPath = path.join(directory, 'leads.sqlite3')
  uploadDir = path.join(directory, 'uploads')

  const protectedDir = path.join(directory, 'protected')
  fs.mkdirSync(path.dirname(path.join(protectedDir, RELATIVE_PATH)), { recursive: true })
  fs.writeFileSync(path.join(protectedDir, RELATIVE_PATH), FILE_BODY)
  const registryPath = path.join(directory, 'registry.json')
  fs.writeFileSync(
    registryPath,
    JSON.stringify({
      assets: [
        {
          id: GATED_ID,
          deliveryClass: 'GATED',
          lifecycle: 'ACTIVE_VISIBLE',
          variants: [
            {
              language: 'de',
              storage: 'PROTECTED',
              path: RELATIVE_PATH,
              mime: 'application/pdf',
              bytes: FILE_BODY.length,
              sha256: createHash('sha256').update(FILE_BODY).digest('hex'),
            },
          ],
        },
      ],
    }),
  )

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
      // Bewusst LEER: der ehrliche NO_PROVIDER_CONFIGURED-Pfad wird gemessen.
      SENDGRID_API_KEY: '',
      CONTACT_RECEIVER: 'team@polarisdx.example',
      SENDER_EMAIL: 'web@polarisdx.example',
      LEAD_DB_PATH: dbPath,
      SUPPORT_UPLOAD_DIR: uploadDir,
      POLARIS_PROTECTED_ASSET_DIR: protectedDir,
      POLARIS_RESOURCE_REGISTRY_PATH: registryPath,
      LEAD_DISPATCHER_DISABLED: '1',
    },
    stdio: 'pipe',
  })
  baseUrl = `http://127.0.0.1:${port}`

  const deadline = Date.now() + 25_000
  for (;;) {
    try {
      // AP26 PT26.3: ohne JSON-Content-Type antwortet die API 415, bevor ein Service (und damit
      // die Datenbank) entsteht. Die Probe ist deshalb eine gueltige, aber unvollstaendige Anfrage.
      await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'ap22-closure-ready' },
        body: '{}',
      })
      break
    } catch {
      if (Date.now() > deadline) throw new Error('server did not start')
      await new Promise((resolve) => setTimeout(resolve, 150))
    }
  }
}, 60_000)

afterAll(() => {
  child?.kill()
  fs.rmSync(directory, { recursive: true, force: true })
})

// =============================================================================
// 1 — Registry, Foundation-Singleton
// =============================================================================

describe('AP22-CLOSURE · Foundation und Registry', () => {
  it('kennt exakt sieben Journeys, alle ON_FOUNDATION mit Slice auf Platte', () => {
    const { JOURNEY_REGISTRY, LEAD_JOURNEYS } = require('./lead-foundation')
    expect(LEAD_JOURNEYS).toHaveLength(7)
    expect([...LEAD_JOURNEYS].sort()).toEqual(
      [
        'consumer_order',
        'contact',
        'content_download',
        'epigenetics_inquiry',
        'practice_order',
        'roi_report',
        'support',
      ].sort(),
    )
    for (const entry of JOURNEY_REGISTRY) {
      expect(entry.state, entry.id).toBe('ON_FOUNDATION')
      expect(fs.existsSync(path.join(ROOT, entry.slice)), entry.slice).toBe(true)
    }
    // Die Matrix dieser Datei deckt die Registry vollstaendig ab.
    expect(JOURNEYS.map((j) => j.id).sort()).toEqual([...LEAD_JOURNEYS].sort())
  })

  it('hat genau EINE Persistenzschicht — keine zweite Plattform daneben', () => {
    // Jeder Slice bezieht Repository/Datenbank aus der Foundation. Ein Slice,
    // der `better-sqlite3` selbst oeffnet, waere eine Schattenpersistenz.
    const { JOURNEY_REGISTRY } = require('./lead-foundation')
    for (const entry of JOURNEY_REGISTRY) {
      const source = fs.readFileSync(path.join(ROOT, entry.slice), 'utf8')
      expect(source, `${entry.id}: eigene DB`).not.toMatch(/require\(['"]better-sqlite3['"]\)/)
      expect(source, `${entry.id}: Foundation`).toMatch(/require\(['"]\.\/lead-foundation['"]\)/)
      expect(source, `${entry.id}: createLead`).toContain('createLead')
    }
    const tables = (() => {
      const db = openDb()
      try {
        return db
          .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
          .all()
          .map((row) => row.name)
          .sort()
      } finally {
        db.close()
      }
    })()
    expect(tables).toEqual([
      'lead_events',
      'lead_outbox',
      'leads',
      'resource_entitlements',
      'schema_migrations',
    ])
  })

  it('betreibt alle sieben Endpunkte hinter dem serverseitigen Rate Limiter', () => {
    const server = fs.readFileSync(path.join(ROOT, 'server/server.js'), 'utf8')
    const routes = [...server.matchAll(/app\.post\('([^']+)',\s*([A-Za-z]+)/g)]
    expect(routes).toHaveLength(7)
    for (const [, route, guard] of routes) {
      expect(guard, route).toBe('formLimiter')
    }
  })
})

// =============================================================================
// 2 — 7/7 Golden Path, Persistenz, Consent Evidence, Kontext
// =============================================================================

describe('AP22-CLOSURE · 7/7 Golden Path gegen den laufenden Server', () => {
  const accepted = new Map()

  it.each(JOURNEYS.map((journey) => [journey.id, journey]))(
    '%s: nimmt an, persistiert vor dem Handoff und antwortet im gemeinsamen Envelope',
    async (id, journey) => {
      const response = await post(journey.endpoint, journey.body, {
        ip: journey.ip,
        idempotencyKey: `golden-${id}`,
      })
      expect(response.status, id).toBe(202)
      const json = await response.json()
      accepted.set(id, json)

      // Gemeinsames Antwortformat, 7/7 identisch.
      expect(json.success, id).toBe(true)
      expect(json.journey, id).toBe(id)
      expect(typeof json.requestId, id).toBe('string')
      expect(json.leadId, id).toMatch(/^[0-9a-f-]{36}$/)
      // Kein Provider konfiguriert — und das wird ehrlich gemeldet.
      expect(json.providerConfigured, id).toBe(false)

      const row = leadOf(json.leadId)
      expect(row, id).toBeTruthy()
      expect(row.journey, id).toBe(id)
      // Persist-before-handoff: die Zeile existiert, die Zustellung nicht.
      expect(row.status, id).not.toBe('DELIVERED')
      expect(row.delivered_at, id).toBeNull()

      const context = JSON.parse(row.context_json)
      expect(context.locale, id).toBe('de')

      const consent = JSON.parse(row.consent_json)
      expect(consent.processingAccepted, id).toBe(true)
      expect(consent.acceptedAt, id).toBe('2026-09-09T08:00:00.000Z')
      expect(typeof consent.version, id).toBe('string')
      // Marketing ist NICHT mitgesetzt worden.
      expect(consent.marketing, id).toBe('DENIED')

      // Audit: der Lebenslauf steht im Protokoll.
      const db = openDb()
      const events = db
        .prepare('SELECT event_type FROM lead_events WHERE lead_id = ? ORDER BY id')
        .all(json.leadId)
        .map((row2) => row2.event_type)
      db.close()
      expect(events, id).toContain('LEAD_RECEIVED')
      expect(events, id).toContain('LEAD_VALIDATED')
      expect(events, id).toContain('LEAD_PERSISTED')
    },
  )

  it('legt fuer 7/7 einen Outbox-Auftrag an — Side Effects laufen durch die Queue', () => {
    const db = openDb()
    const rows = db
      .prepare(
        `SELECT l.journey, COUNT(o.id) AS jobs FROM leads l
         JOIN lead_outbox o ON o.lead_id = l.id GROUP BY l.journey`,
      )
      .all()
    db.close()
    expect(rows.map((row) => row.journey).sort()).toEqual(JOURNEYS.map((j) => j.id).sort())
    for (const row of rows) expect(row.jobs, row.journey).toBeGreaterThan(0)
  })

  it('meldet 7/7 ehrlich NO_PROVIDER_CONFIGURED statt Erfolg zu behaupten', () => {
    const db = openDb()
    const rows = db.prepare('SELECT journey, status, last_error_class FROM leads').all()
    db.close()
    for (const row of rows) {
      expect(row.status, row.journey).not.toBe('DELIVERED')
      if (row.last_error_class) {
        expect(['NO_PROVIDER_CONFIGURED', 'DRY_RUN'], row.journey).toContain(row.last_error_class)
      }
    }
    // Kein einziger Vorgang traegt einen Zustellzeitstempel.
    const delivered = (() => {
      const d = openDb()
      const n = d.prepare('SELECT COUNT(*) AS c FROM leads WHERE delivered_at IS NOT NULL').get().c
      d.close()
      return n
    })()
    expect(delivered).toBe(0)
  })

  it('liefert fuer content_download die Nutzlast unter data, nicht im Envelope-Rumpf', () => {
    const payload = accepted.get('content_download')
    expect(payload.data).toBeTruthy()
    expect(typeof payload.data.downloadUrl).toBe('string')
    expect(payload.data.assetId).toBe(GATED_ID)
    // Kein internes Feld faellt mit nach draussen.
    expect(Object.keys(payload.data).sort()).toEqual(
      ['assetId', 'deliveredLanguage', 'downloadUrl', 'entitlementId', 'expiresAt'].sort(),
    )
  })

  it('vergibt fuer die Bestellstrecken eine stabile fachliche Vorgangsnummer', () => {
    expect(accepted.get('consumer_order').reference).toMatch(/^PDX-[0-9A-F]{8}$/)
    expect(accepted.get('practice_order').reference).toMatch(/^PRX-[0-9A-F]{8}$/)
  })
})

// =============================================================================
// 3 — Idempotenz, Dedup, Validierung, Fehlerformat, Abuse
// =============================================================================

describe('AP22-CLOSURE · Idempotenz und Validierung 7/7', () => {
  it.each(JOURNEYS.map((journey) => [journey.id, journey]))(
    '%s: derselbe Idempotency-Key erzeugt keinen zweiten Vorgang',
    async (id, journey) => {
      const key = `replay-${id}`
      const first = await post(journey.endpoint, journey.body, {
        ip: journey.ip,
        idempotencyKey: key,
      })
      const second = await post(journey.endpoint, journey.body, {
        ip: journey.ip,
        idempotencyKey: key,
      })
      expect(first.status, id).toBe(202)
      expect(second.status, id).toBe(202)
      const a = await first.json()
      const b = await second.json()
      expect(b.leadId, id).toBe(a.leadId)

      const db = openDb()
      const count = db
        .prepare('SELECT COUNT(*) AS c FROM leads WHERE idempotency_key = ?')
        .get(key).c
      db.close()
      expect(count, id).toBe(1)
    },
  )

  it.each(JOURNEYS.map((journey) => [journey.id, journey]))(
    '%s: lehnt fehlende Pflichtangabe und fehlende Einwilligung serverseitig ab',
    async (id, journey) => {
      const incomplete = { ...journey.body }
      delete incomplete[journey.drop]
      const invalid = await post(journey.endpoint, incomplete, {
        ip: `203.0.113.${JOURNEYS.findIndex((j) => j.id === id) + 10}`,
      })
      expect(invalid.status, id).toBe(400)
      const body = await invalid.json()
      expect(body.success, id).toBe(false)
      expect(typeof body.code, id).toBe('string')
      expect(typeof body.messageKey, id).toBe('string')
      expect(Array.isArray(body.fieldErrors), id).toBe(true)
      // Kein Providerdetail, kein Stacktrace, keine interne Adresse.
      const text = JSON.stringify(body)
      expect(text, id).not.toMatch(/at Object\.|node_modules|sendgrid|SG\.|\.sqlite3/i)

      const noConsent = await post(
        journey.endpoint,
        { ...journey.body, processingConsent: false },
        { ip: `203.0.113.${JOURNEYS.findIndex((j) => j.id === id) + 30}` },
      )
      expect(noConsent.status, id).toBe(400)
      expect((await noConsent.json()).code, id).toBe('PROCESSING_CONSENT_REQUIRED')
    },
  )

  it('verwirft einen wiederverwendeten Schluessel mit anderem Inhalt statt zu ueberschreiben', async () => {
    const key = 'conflict-closure'
    const journey = JOURNEYS[0]
    await post(journey.endpoint, journey.body, { ip: '203.0.113.60', idempotencyKey: key })
    const conflict = await post(
      journey.endpoint,
      { ...journey.body, message: 'Ein voellig anderer Text.' },
      { ip: '203.0.113.60', idempotencyKey: key },
    )
    expect(conflict.status).toBe(409)
  })

  it('greift der Rate Limiter serverseitig, nicht nur im Client', async () => {
    const journey = JOURNEYS[0]
    const codes = []
    for (let i = 0; i < 8; i += 1) {
      const response = await post(journey.endpoint, journey.body, { ip: '203.0.113.99' })
      codes.push(response.status)
    }
    expect(codes).toContain(429)
    // Die Grenze ist serverseitig konfiguriert, nicht im Formular.
    expect(codes.filter((code) => code === 429).length).toBeGreaterThan(0)
  })

  it('ignoriert eine Einreichung mit gefuelltem Honeypot, ohne einen Vorgang anzulegen', async () => {
    const before = (() => {
      const db = openDb()
      const n = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c
      db.close()
      return n
    })()
    const response = await post(
      JOURNEYS[0].endpoint,
      { ...JOURNEYS[0].body, _hp: 'bot' },
      { ip: '203.0.113.120', idempotencyKey: 'honeypot-closure' },
    )
    expect([200, 202]).toContain(response.status)
    const after = (() => {
      const db = openDb()
      const n = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c
      db.close()
      return n
    })()
    expect(after).toBe(before)
  })
})

// =============================================================================
// 4 — Datenminimierung, PII-arme Logs, Chat
// =============================================================================

describe('AP22-CLOSURE · Datenminimierung, Logs, Chat', () => {
  it('speichert im Kontext keine Kontaktdaten — PII liegt ausschliesslich im Subject', () => {
    const db = openDb()
    const rows = db.prepare('SELECT journey, context_json FROM leads').all()
    db.close()
    for (const row of rows) {
      const text = row.context_json.toLowerCase()
      expect(text, row.journey).not.toContain('@praxis.example')
      expect(text, row.journey).not.toContain('@example.com')
      expect(text, row.journey).not.toContain('beispiel')
      expect(text, row.journey).not.toContain('musterweg')
    }
  })

  it('haelt keine Secrets, Tokens oder vollen Form-Bodies in der Serverausgabe', async () => {
    const chunks = []
    child.stdout.on('data', (chunk) => chunks.push(String(chunk)))
    child.stderr.on('data', (chunk) => chunks.push(String(chunk)))
    await post(JOURNEYS[0].endpoint, JOURNEYS[0].body, {
      ip: '203.0.113.140',
      idempotencyKey: 'log-closure',
    })
    await new Promise((resolve) => setTimeout(resolve, 300))
    const output = chunks.join('')
    expect(output).not.toMatch(/SG\.[A-Za-z0-9]/)
    expect(output).not.toMatch(/authorization/i)
    expect(output).not.toContain('ada@praxis.example')
    expect(output).not.toContain('Bitte um Angebot')
  })

  it('speichert das Download-Token nie im Klartext', () => {
    const db = openDb()
    const rows = db.prepare('SELECT token_hash FROM resource_entitlements').all()
    db.close()
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) expect(row.token_hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('beantwortet POST /api/chat mit 404 — der Endpunkt ist weg', async () => {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hallo' }),
    })
    expect(response.status).toBe(404)
    expect(await response.text()).not.toMatch(/reply/i)
  })

  it('fuehrt weder im Backend noch in der CSP eine Chat-Referenz', () => {
    const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(fs.readFileSync(path.join(ROOT, 'server/server.js'), 'utf8')).not.toMatch(/chat/i)
    expect(strip(fs.readFileSync(path.join(ROOT, 'server.ts'), 'utf8'))).not.toMatch(/hihuman/i)
    expect(fs.existsSync(path.join(ROOT, 'src/components/ui/ChatWidget.tsx'))).toBe(false)
    expect(fs.existsSync(path.join(ROOT, 'CHAT_INTEGRATION.md'))).toBe(false)
  })
})

// =============================================================================
// 5 — Outbox, Retry, Unknown Result, Dead Letter, Recovery
// =============================================================================

describe('AP22-CLOSURE · Zustellung, Wiederholung, Endzustand', () => {
  const {
    DELIVERY_RESULTS,
    CrmRouter,
    LeadHandoffWorker,
    LeadRepository,
    openLeadDatabase,
    nextAttemptDelayMs,
    withDeliveryGuards,
  } = require('./lead-foundation')

  let workDir
  let workDb
  let repository

  const makeLead = (journey = 'contact', key = `w-${Math.random()}`) =>
    repository.createLead({
      journey,
      idempotencyKey: key,
      subject: { name: 'Ada Beispiel', email: 'ada@praxis.example' },
      context: { locale: 'de' },
      consent: { processingAccepted: true, acceptedAt: '2026-09-09T08:00:00.000Z', version: 'v1' },
    })

  const workerWith = (deliver, journeys) =>
    new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters: { 'general-sales': { deliver } }, dryRun: false }),
      workerId: 'closure-worker',
      journeys,
      maxAttempts: 2,
    })

  beforeAll(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-closure-worker-'))
    workDb = openLeadDatabase({ filename: path.join(workDir, 'w.sqlite3') })
    repository = new LeadRepository(workDb)
  })

  afterAll(() => {
    workDb?.close()
    fs.rmSync(workDir, { recursive: true, force: true })
  })

  it('wiederholt einen klassifiziert vorübergehenden Fehler mit wachsendem Abstand', async () => {
    const lead = makeLead('contact', 'retry-1')
    const worker = workerWith(async () => {
      const error = new Error('provider busy')
      error.retryable = true
      error.code = 'ETRANSIENT'
      throw error
    }, ['contact'])
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('RETRY_PENDING')
    expect(after.attemptCount).toBe(1)
    // Backoff ist eine Politik, kein fester Abstand.
    expect(nextAttemptDelayMs({ attempt: 2, policy: { jitterRatio: 0 } })).toBeGreaterThan(
      nextAttemptDelayMs({ attempt: 1, policy: { jitterRatio: 0 } }),
    )
  })

  it('legt ein UNBEKANNTES Providerergebnis zur Klaerung ab statt es blind zu wiederholen', async () => {
    const lead = makeLead('contact', 'unknown-1')
    let attempts = 0
    const worker = workerWith(async () => {
      attempts += 1
      const error = new Error('timeout')
      error.code = 'ETIMEDOUT'
      throw error
    }, ['contact'])
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('RECONCILIATION_REQUIRED')
    expect(after.lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
    // Ein zweiter Durchlauf fasst ihn NICHT an — kein doppelter Side Effect.
    await worker.processNext()
    expect(attempts).toBe(1)
    expect(repository.findReconciliationRequired().map((row) => row.id)).toContain(lead.id)
  })

  it('haelt einen erschoepften Vorgang sichtbar und wiedervorlagefaehig', async () => {
    const lead = makeLead('contact', 'terminal-1')
    const worker = workerWith(
      async () => ({
        status: DELIVERY_RESULTS.TERMINAL_ERROR,
        errorClass: 'PROVIDER_REJECTED',
      }),
      ['contact'],
    )
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('FAILED_TERMINAL')
    expect(after.lastErrorClass).toBe('PROVIDER_REJECTED')
    expect(after.terminalAt).toBeTruthy()

    const listed = repository.findDeadLetters({ journey: 'contact' })
    expect(listed.map((row) => row.leadId)).toContain(lead.id)
    // Eine Betriebsliste zeigt keine Kontaktdaten.
    expect(JSON.stringify(listed)).not.toContain('@praxis.example')

    // Manuelle Wiedervorlage: Person und Grund Pflicht, protokolliert, idempotent.
    expect(() => repository.requeueForDelivery({ leadId: lead.id, actor: 'ops' })).toThrow()
    const first = repository.requeueForDelivery({
      leadId: lead.id,
      actor: 'ops',
      reason: 'Provider wieder erreichbar',
    })
    expect(first.requeued).toBe(true)
    expect(repository.getEvents(lead.id).map((e) => e.eventType)).toContain('MANUAL_REQUEUE')
    expect(
      repository.requeueForDelivery({ leadId: lead.id, actor: 'ops', reason: 'nochmal' }).requeued,
    ).toBe(false)
  })

  it('uebernimmt einen Auftrag atomar und laesst einen fremden Worker leer ausgehen', () => {
    // Eigene Datenbank: die Zusicherung lautet "derselbe Auftrag nicht
    // zweimal", nicht "die Warteschlange ist leer".
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-closure-claim-'))
    const fresh = openLeadDatabase({ filename: path.join(dir, 'c.sqlite3') })
    try {
      const repo = new LeadRepository(fresh)
      repo.createLead({
        journey: 'contact',
        idempotencyKey: 'claim-1',
        subject: { name: 'Ada Beispiel', email: 'ada@praxis.example' },
        context: { locale: 'de' },
        consent: {
          processingAccepted: true,
          acceptedAt: '2026-09-09T08:00:00.000Z',
          version: 'v1',
        },
      })
      const a = repo.claimNext({ workerId: 'a', journeys: ['contact'] })
      const b = repo.claimNext({ workerId: 'b', journeys: ['contact'] })
      expect(a).toBeTruthy()
      expect(b).toBeNull()
      // Ein Worker greift keine fremde Journey ab (der Befund aus PT22.4).
      expect(repo.claimNext({ workerId: 'c', journeys: ['support'] })).toBeNull()
    } finally {
      fresh.close()
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('gibt bei DRY_RUN weder Erfolg noch einen Providerkontakt', async () => {
    let called = 0
    const guarded = withDeliveryGuards(
      {
        async deliver() {
          called += 1
          return { status: DELIVERY_RESULTS.DELIVERED }
        },
      },
      { dryRun: true },
    )
    const result = await guarded.deliver({ lead: { id: 'x' } })
    expect(result.status).toBe(DELIVERY_RESULTS.DRY_RUN)
    expect(called).toBe(0)
  })
})

// =============================================================================
// 6 — Datenschutz, Betrieb, Isolation
// =============================================================================

describe('AP22-CLOSURE · Datenschutz und Betrieb', () => {
  const {
    LeadPrivacyService,
    LeadRepository,
    createLeadBackup,
    describeBackupScope,
    describeRuntimeIsolation,
    evaluateAlerts,
    openLeadDatabase,
    resolveDeliveryMode,
    resolveRetentionPolicy,
    runRetention,
    verifyBackup,
  } = require('./lead-foundation')

  /** Konsistenter Schnappschuss der laufenden Datenbank. */
  const snapshot = (destination) => {
    const live = openLeadDatabase({ filename: dbPath })
    try {
      createLeadBackup({ db: live, destination })
    } finally {
      live.close()
    }
  }

  it('kann Auskunft geben und loeschen — an der echten Datenbank dieses Laufs', () => {
    // KEINE Dateikopie: die Datenbank laeuft im WAL-Modus, `cp` waere ein
    // unvollstaendiger Stand. Genau dafuer gibt es `createLeadBackup`.
    const copy = path.join(directory, 'dsar-copy.sqlite3')
    snapshot(copy)
    const db = openLeadDatabase({ filename: copy })
    const repository = new LeadRepository(db)
    const service = new LeadPrivacyService({ repository, storageRoot: uploadDir })
    try {
      const found = service.lookup('ada@praxis.example')
      expect(found.length).toBeGreaterThan(0)
      // Es gibt daneben Vorgaenge anderer Adressen.
      const others = db
        .prepare('SELECT COUNT(*) AS c FROM leads WHERE subject_email_hash IS NOT NULL')
        .get().c
      expect(others).toBeGreaterThan(found.length)

      const dump = service.export('ada@praxis.example')
      expect(dump.records[0].subject.email).toBe('ada@praxis.example')
      expect(dump.records[0].consent.processingAccepted).toBe(true)

      // Die Vorgaenge dieses Laufs sind bereits terminal (kein Adapter
      // konfiguriert), also loeschbar. Die Loeschung greift sofort.
      const foreignBefore = service.lookup('mila@praxis.example').length
      expect(foreignBefore).toBeGreaterThan(0)

      const erased = service.erase({ email: 'ada@praxis.example', actor: 'dsb', reason: 'Art. 17' })
      expect(erased.matchedRecords).toBe(found.length)
      expect(erased.anonymized).toHaveLength(found.length)
      expect(erased.deferred).toEqual([])
      expect(service.lookup('ada@praxis.example')).toEqual([])

      // Fremde Vorgaenge sind unberuehrt — die entscheidende Zusicherung.
      expect(service.lookup('mila@praxis.example')).toHaveLength(foreignBefore)

      // Ein noch laufender Vorgang wird ehrlich aufgeschoben statt still
      // uebersprungen — hier bewusst neu erzeugt, weil dieser Lauf keinen mehr hat.
      const pending = repository.createLead({
        journey: 'contact',
        idempotencyKey: 'dsar-pending-closure',
        subject: { name: 'Ada Beispiel', email: 'ada@praxis.example' },
        context: { locale: 'de' },
        consent: {
          processingAccepted: true,
          acceptedAt: '2026-09-09T08:00:00.000Z',
          version: 'v1',
        },
      })
      expect(pending.status).toBe('QUEUED')
      const deferred = service.erase({
        email: 'ada@praxis.example',
        actor: 'dsb',
        reason: 'Art. 17',
      })
      expect(deferred.anonymized).toEqual([])
      expect(deferred.deferred.map((row) => row.reason)).toEqual(['DELIVERY_PENDING'])
    } finally {
      db.close()
    }
  })

  it('hat eine ausfuehrbare Aufbewahrungspolitik, die keine Rechtsfrist erfindet', () => {
    const policy = resolveRetentionPolicy({})
    expect(policy.support).toEqual({ days: 90, source: 'APPROVED_POLICY' })
    expect(Object.values(policy).filter((e) => e.source === 'UNDECIDED')).toHaveLength(6)

    const copy = path.join(directory, 'retention-copy.sqlite3')
    snapshot(copy)
    const db = openLeadDatabase({ filename: copy })
    try {
      const repository = new LeadRepository(db)
      db.prepare("UPDATE leads SET status='DELIVERED', retention_delete_after='2020-01-01'").run()
      const report = runRetention({ repository, now: '2026-09-09T10:00:00.000Z' })
      expect(report.applied).toBe(false)
      expect(report.due).toBeGreaterThan(0)
      const applied = runRetention({
        repository,
        storageRoot: uploadDir,
        apply: true,
        now: '2026-09-09T10:00:00.000Z',
      })
      expect(applied.anonymized.length).toBe(report.due)
      expect(repository.findDueForDeletion('2026-09-09T10:00:00.000Z')).toEqual([])
    } finally {
      db.close()
    }
  })

  it('kann Preview keine echte Zustellung erlauben', () => {
    expect(
      resolveDeliveryMode({ APP_ENV: 'preview', NODE_ENV: 'production', DRY_RUN: '0' }),
    ).toMatchObject({
      dryRun: true,
      forced: true,
    })
    expect(
      describeRuntimeIsolation({ NODE_ENV: 'production', DRY_RUN: '1' }).findings.map(
        (f) => f.code,
      ),
    ).toContain('PRODUCTION_IN_DRY_RUN')
  })

  it('sichert den Lead-/Queue-Zustand und stellt ihn im begrenzten Smoke wieder her', () => {
    const source = openLeadDatabase({ filename: dbPath, readonly: true })
    const target = path.join(directory, 'closure-backup.sqlite3')
    try {
      const scope = describeBackupScope()
      expect(scope.database.restoreOrder).toContain('lead_outbox')
      expect(scope.filesystem.map((e) => e.what)).toContain('SUPPORT_UPLOAD_DIR')

      // Eine readonly-Verbindung kann kein VACUUM INTO — die Sicherung laeuft
      // ueber eine schreibfaehige Verbindung, so wie im Betrieb.
      const writable = openLeadDatabase({ filename: dbPath })
      try {
        const liveLeads = writable.prepare('SELECT COUNT(*) AS c FROM leads').get().c
        const liveJobs = writable.prepare('SELECT COUNT(*) AS c FROM lead_outbox').get().c
        expect(liveLeads).toBeGreaterThan(0)
        expect(liveJobs).toBeGreaterThan(0)

        expect(createLeadBackup({ db: writable, destination: target }).sizeBytes).toBeGreaterThan(0)
        const verified = verifyBackup({
          openDatabase: openLeadDatabase,
          sourceDb: writable,
          backupPath: target,
        })
        expect(verified.ok).toBe(true)
        expect(verified.differences).toEqual([])
        expect(verified.migrationsMatch).toBe(true)
        expect(verified.scope).toBe('AP22_BOUNDED_SMOKE')

        // Der wiederhergestellte Stand traegt Vorgaenge UND Auftraege.
        const restored = openLeadDatabase({ filename: target, readonly: true })
        try {
          expect(restored.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(liveLeads)
          expect(restored.prepare('SELECT COUNT(*) AS c FROM lead_outbox').get().c).toBe(liveJobs)
        } finally {
          restored.close()
        }
      } finally {
        writable.close()
      }
    } finally {
      source.close()
    }
  })

  it('legt Support-Anhaenge auf dasselbe persistente Volume wie die Datenbank', () => {
    /**
     * AP22-CLOSURE-Befund, hier behoben.
     *
     * Die Datenbank lag auf einem benannten Volume, die Support-Anhaenge
     * nicht: ohne `SUPPORT_UPLOAD_DIR` faellt der Slice auf
     * `server/storage/support-uploads` zurueck — im Container also auf die
     * VERAENDERLICHE Schicht. Ein Redeploy haette jede Datei geloescht,
     * waehrend die Lead-Zeile weiter `attachments` behauptet und der
     * Zustelladapter sie von der Platte lesen will. Genau die Datei, um
     * derentwillen jemand den Support kontaktiert, waere weg gewesen.
     *
     * Der Sicherungsumfang aus §26.8 fordert das Verzeichnis ausdruecklich —
     * ohne persistenten Mount gaebe es nichts zu sichern.
     */
    const compose = fs.readFileSync(path.join(ROOT, 'docker-compose.yml'), 'utf8')
    const backend = compose.slice(compose.indexOf('  backend:'))
    const dbPathMatch = backend.match(/LEAD_DB_PATH=([^\s]+)/)
    const uploadMatch = backend.match(/SUPPORT_UPLOAD_DIR=([^\s]+)/)
    expect(dbPathMatch, 'LEAD_DB_PATH deklariert').toBeTruthy()
    expect(uploadMatch, 'SUPPORT_UPLOAD_DIR deklariert').toBeTruthy()

    const mounts = [...backend.matchAll(/-\s+[a-z-]+:(\/[^\s]+)/g)].map((m) => m[1])
    expect(mounts.length).toBeGreaterThan(0)
    const onVolume = (target) => mounts.some((mount) => target.startsWith(mount + '/'))
    expect(onVolume(dbPathMatch[1]), 'Datenbank auf Volume').toBe(true)
    expect(onVolume(uploadMatch[1]), 'Anhaenge auf Volume').toBe(true)
    // Beide auf DEMSELBEN Mount: Sicherung und Wiederherstellung treffen einen Ort.
    expect(uploadMatch[1].split('/').slice(0, 4).join('/')).toBe(
      dbPathMatch[1].split('/').slice(0, 4).join('/'),
    )
  })

  it('macht die lead-kritischen Zustaende messbar und alarmierbar', () => {
    const db = openLeadDatabase({ filename: dbPath, readonly: true })
    try {
      const repository = new LeadRepository(db)
      const metrics = repository.collectQueueMetrics()
      // Die geforderten Kennzahlen existieren wirklich.
      expect(metrics.queue).toHaveProperty('depth')
      expect(metrics.queue).toHaveProperty('oldestAgeMs')
      expect(Array.isArray(metrics.byJourney)).toBe(true)
      expect(Array.isArray(metrics.providerFailures)).toBe(true)
      expect(metrics.leads).toBeTruthy()

      const alerts = evaluateAlerts({
        queueMetrics: metrics,
        privacyMetrics: repository.collectPrivacyMetrics(),
        isolation: describeRuntimeIsolation({ NODE_ENV: 'production' }),
      })
      // In diesem Lauf ist kein Adapter konfiguriert — genau das muss alarmieren.
      expect(alerts.map((a) => a.code)).toContain('NO_PROVIDER_CONFIGURED')
      expect(JSON.stringify(alerts)).not.toContain('@praxis.example')
    } finally {
      db.close()
    }
  })
})
