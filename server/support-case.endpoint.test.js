// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

/**
 * AP20 PT20.3 — die HTTP-Schicht der Support-Journey.
 *
 * Der Server laeuft als echter Prozess gegen temporaere DB + temporaeren
 * Upload-Storage. SENDGRID_API_KEY ist LEER gesetzt: der CRM-Adapter
 * registriert sich bewusst nicht, damit der ehrliche
 * NO_PROVIDER_CONFIGURED-Pfad gemessen wird (kein Fake-SENT, kein Netzwerk).
 */

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const here = path.dirname(fileURLToPath(import.meta.url))

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4])
const PDF_BYTES = Buffer.from('%PDF-1.4\nfake\n%%EOF')

const body = (overrides = {}) => ({
  name: 'Dr. Mila Sørensen',
  email: 'mila@praxis.example',
  udi: 'S0DA25000HTTP1',
  swVersion: '1.8.42',
  issueType: 'software',
  issueTypeLabel: 'Software-Problem',
  subject: 'Verbindung bricht ab',
  description: 'Nach 30 Sekunden dropped die Bluetooth-Verbindung.',
  locale: 'de',
  processingConsent: true,
  consentAcceptedAt: '2026-09-07T09:00:00.000Z',
  ...overrides,
})

describe('AP20 PT20.3 support HTTP', () => {
  let directory
  let storageDir
  let child
  let baseUrl
  let dbPath
  let key = 0

  const post = (payload, { headers = {}, ip = '203.0.113.1' } = {}) =>
    fetch(`${baseUrl}/api/support`, {
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
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt203-http-'))
    storageDir = path.join(directory, 'uploads')
    dbPath = path.join(directory, 'leads.sqlite3')
    // Freien Port atomar besorgen statt pid-Formel (Kollisionen mit
    // fremden Diensten auf dem Shared Server erzeugen sonst 404-Chaos).
    const net = await import('node:net')
    const probe = await new Promise((resolve) => {
      const server = net.createServer().listen(0, '127.0.0.1', () => {
        const { port } = server.address()
        server.close(() => resolve(port))
      })
    })
    const port = probe
    child = fork(path.join(here, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        // Wichtig: server/.env koennte einen echten Schluessel liefern; der
        // Fork-Env-Wert gewinnt und haelt alle Tests im NO_PROVIDER-Pfad.
        SENDGRID_API_KEY: '',
        CONTACT_RECEIVER: 'team@polarisdx.example',
        SENDER_EMAIL: 'web@polarisdx.example',
        LEAD_DB_PATH: dbPath,
        SUPPORT_UPLOAD_DIR: storageDir,
      },
      stdio: 'pipe',
    })
    baseUrl = `http://127.0.0.1:${port}`

    const deadline = Date.now() + 20_000
    for (;;) {
      try {
        await fetch(`${baseUrl}/api/support`, { method: 'POST' })
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

  it('nimmt eine gueltige Anfrage mit 202 an und persistiert den Case', async () => {
    const response = await post(body(), { ip: '203.0.113.10' })
    expect(response.status).toBe(202)
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.journey).toBe('support')
    // Kein Provider konfiguriert -> ehrlich gemeldet statt Erfolg behauptet.
    expect(json.providerConfigured).toBe(false)

    const db = new Database(dbPath, { readonly: true })
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(json.leadId)
    expect(lead.journey).toBe('support')
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.last_error_class).toBe('NO_PROVIDER_CONFIGURED')
    const subject = JSON.parse(lead.subject_json)
    expect(subject.name).toBe('Dr. Mila Sørensen')
    expect(subject.udi).toBe('S0DA25000HTTP1')
    const context = JSON.parse(lead.context_json)
    expect(context.locale).toBe('de')
    expect(context.source).toBe('support_center')
    expect(context.retention.deleteAfter).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const consent = JSON.parse(lead.consent_json)
    expect(consent.processingAccepted).toBe(true)
    expect(consent.version).toBe('support-2026-09')
    db.close()
  })

  it('lehnt fehlende Pflichtangaben mit 400 und Feldliste ab', async () => {
    const response = await post(
      body({ name: 'A', email: 'ungueltig', udi: '', swVersion: '', issueType: '', subject: '' }),
      { ip: '203.0.113.11' },
    )
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.success).toBe(false)
    expect(json.code).toBe('VALIDATION_FAILED')
    expect(json.fieldErrors.map((entry) => entry.field)).toEqual(
      expect.arrayContaining(['name', 'email', 'udi', 'swVersion', 'issueType', 'subject']),
    )
  })

  it('lehnt ohne Processing-Consent mit 400 ab (No-Consent Business Flow)', async () => {
    const response = await post(body({ processingConsent: false }), { ip: '203.0.113.12' })
    expect(response.status).toBe(400)
    expect((await response.json()).code).toBe('PROCESSING_CONSENT_REQUIRED')
  })

  it('schluckt Honeypot-Einreichungen mit 200, ohne einen Case anzulegen', async () => {
    const db = new Database(dbPath, { readonly: true })
    const before = db.prepare('SELECT COUNT(*) AS n FROM leads').get().n
    db.close()
    const response = await post(body({ _hp: 'filled' }), { ip: '203.0.113.13' })
    expect(response.status).toBe(200)
    const dbAfter = new Database(dbPath, { readonly: true })
    expect(dbAfter.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(before)
    dbAfter.close()
  })

  it('ist idempotent: Replay mit gleichem Key liefert denselben Case', async () => {
    const idem = 'http-replay-pt203'
    const dbBefore = new Database(dbPath, { readonly: true })
    const beforeCount = dbBefore.prepare('SELECT COUNT(*) AS n FROM leads').get().n
    dbBefore.close()
    const first = await post(body(), { headers: { 'Idempotency-Key': idem }, ip: '203.0.113.14' })
    expect(first.status).toBe(202)
    const firstJson = await first.json()
    const replay = await post(body(), { headers: { 'Idempotency-Key': idem }, ip: '203.0.113.14' })
    expect(replay.status).toBe(202)
    expect((await replay.json()).leadId).toBe(firstJson.leadId)

    const db = new Database(dbPath, { readonly: true })
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(beforeCount + 1)
    db.close()
  })

  it('antwortet 409, wenn derselbe Key mit anderem Inhalt kommt', async () => {
    const idem = 'http-conflict-pt203'
    await post(body(), { headers: { 'Idempotency-Key': idem }, ip: '203.0.113.15' })
    const conflict = await post(body({ subject: 'Anderer Betreff' }), {
      headers: { 'Idempotency-Key': idem },
      ip: '203.0.113.15',
    })
    expect(conflict.status).toBe(409)
  })

  it('ratet limitiert: 5x202, danach 429 (Abuse-Schutz aktiv)', async () => {
    const ip = '203.0.113.99'
    for (let i = 0; i < 5; i += 1) {
      const response = await post(body(), { ip })
      expect(response.status).toBe(202)
    }
    const limited = await post(body(), { ip })
    expect(limited.status).toBe(429)
  })

  it('speichert ein erlaubtes Attachment opak und liefert es NICHT oeffentlich aus', async () => {
    const response = await post(
      body({
        attachments: [
          { filename: 'screenshot.png', type: 'image/png', content: PNG_BYTES.toString('base64') },
        ],
      }),
      { ip: '203.0.113.20' },
    )
    expect(response.status).toBe(202)
    const json = await response.json()

    const db = new Database(dbPath, { readonly: true })
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(json.leadId)
    const context = JSON.parse(lead.context_json)
    db.close()
    const [meta] = context.attachments
    expect(meta.originalName).toBe('screenshot.png')
    expect(meta.storageId).not.toContain('screenshot')

    // Datei physisch unter generiertem Namen im Case-Dir vorhanden.
    const storedPath = path.join(storageDir, context.caseDir, meta.storageId)
    expect(fs.existsSync(storedPath)).toBe(true)
    expect(
      fs.readFileSync(storedPath).equals(PNG_BYTES) ||
        fs.readFileSync(storedPath).equals(PNG_BYTES),
    ).toBe(true)

    // Kein Route-Zugriff: weder ueber den Dateinamen noch ueber den Storage-Pfad
    // ist das Attachment vom Webserver erreichbar (nicht oeffentlich ausfuehrbar).
    for (const attempt of [
      `${baseUrl}/api/support/${context.caseDir}/${meta.storageId}`,
      `${baseUrl}/uploads/${context.caseDir}/${meta.storageId}`,
      `${baseUrl}/${meta.storageId}`,
    ]) {
      const leak = await fetch(attempt)
      expect(leak.status).toBe(404)
    }
  })

  it('lehnt spoofed MIME und Traversal-Filenames ueber HTTP mit 400 ab', async () => {
    const spoofed = await post(
      body({
        attachments: [
          { filename: 'foto.png', type: 'image/png', content: PDF_BYTES.toString('base64') },
        ],
      }),
      { ip: '203.0.113.21' },
    )
    expect(spoofed.status).toBe(400)
    expect((await spoofed.json()).code).toBe('ATTACHMENT_SPOOFED')

    const traversal = await post(
      body({
        attachments: [
          { filename: '../../etc.png', type: 'image/png', content: PNG_BYTES.toString('base64') },
        ],
      }),
      { ip: '203.0.113.22' },
    )
    expect(traversal.status).toBe(400)
    expect((await traversal.json()).code).toBe('ATTACHMENT_TRAVERSAL')
  })
})
