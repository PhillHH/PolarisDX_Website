// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP27 PT27.2 — Lead-Pipeline ueber alle Schichten.
 *
 *   HTTP-Request → Servervalidierung → Persistenz → Outbox → echter Worker → echter
 *   SendGrid-Adapter → geskripteter Transport → persistierter End-/Retry-Zustand
 *
 * Der Server laeuft im Testprozess (Harness `lead-foundation/testing/integration-harness.js`).
 * Kein Provider wird erreicht: der Transport ist ein Skript, Client und HTTPS sind gesperrt.
 * Journey `contact`, weil sie die Handoff-Kette ohne Nebenpfade zeigt.
 */

const require = createRequire(import.meta.url)
const harness = require('./lead-foundation/testing/integration-harness')

const SYNTHETIC_KEY = 'pt27-2-synthetic-transport-key'

let emailCounter = 0
const body = (overrides = {}) => ({
  name: 'Dr. Ada Integration',
  company: 'Praxis Synthetik',
  phone: '+49 30 0000000',
  email: `lead${(emailCounter += 1)}@praxis.example`,
  locale: 'en',
  intent: 'quote',
  field: 'dental',
  campaign: 'pt27-2',
  originRoute: '/en/contact',
  message: 'Bitte um ein Angebot fuer ein POC-Panel.',
  processingConsent: true,
  consentAcceptedAt: '2026-09-15T09:00:00.000Z',
  ...overrides,
})

let tmp
let env
let transport
let logs
let server
let store
let contactService

const post = (payload, key) => harness.postJson(server.baseUrl, '/api/contact', payload, { key })
const countLeads = (key) =>
  key
    ? store.db.prepare('SELECT COUNT(*) AS n FROM leads WHERE idempotency_key = ?').get(key).n
    : store.db.prepare('SELECT COUNT(*) AS n FROM leads').get().n
const sendsSince = (mark) => transport.sends.slice(mark)

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt272-lead-'))
  env = harness.isolateProviderEnv({
    NODE_ENV: 'test',
    LEAD_DB_PATH: path.join(tmp, 'leads.sqlite3'),
    SUPPORT_UPLOAD_DIR: path.join(tmp, 'uploads'),
    LEAD_DISPATCHER_DISABLED: '1',
    SENDGRID_API_KEY: SYNTHETIC_KEY,
    CONTACT_RECEIVER: 'team@polarisdx.example',
    SENDER_EMAIL: 'web@polarisdx.example',
  })
  transport = harness.instrumentMailTransport()
  logs = harness.captureConsole()
  const { app } = require('./server.js')
  const sgMail = require('@sendgrid/mail')
  contactService = () => require('./contact-lead').getRuntimeContactLeadService({ mailer: sgMail })
  server = await harness.listen(app)
  store = harness.openStore(process.env.LEAD_DB_PATH)
}, 30_000)

afterAll(async () => {
  await server?.close()
  store?.close()
  logs?.restore()
  transport?.restore()
  env?.restore()
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true })
})

describe('PT27.2 · Request → Persistenz → Handoff', () => {
  it('lehnt eine ungueltige Anfrage vor jeder Persistenz und jedem Handoff ab', async () => {
    const leadsBefore = countLeads()
    const mark = transport.sends.length
    const response = await post(body({ email: 'keine-adresse' }), 'pt272-invalid')

    expect(response.status).toBe(400)
    expect(JSON.stringify(response.json)).toContain('email')
    expect(countLeads()).toBe(leadsBefore)
    expect(store.leads.getLeadByIdempotencyKey('pt272-invalid')).toBeNull()
    expect(sendsSince(mark)).toHaveLength(0)
  })

  it('persistiert Lead und Outbox VOR dem Providerkontakt und stellt genau einmal zu', async () => {
    const key = 'pt272-delivered'
    const payload = body()
    const seenAtSend = []
    transport.script('delivered')
    transport.setOnSend(() => {
      // Gelesen ueber eine ZWEITE Verbindung: der Zustand ist committet, nicht nur im Speicher.
      const lead = store.leads.getLeadByIdempotencyKey(key)
      seenAtSend.push({
        persisted: Boolean(lead),
        delivered: lead?.status === 'DELIVERED',
        outbox: lead ? store.leads.getOutboxForLead(lead.id).map((row) => row.status) : [],
      })
    })
    const mark = transport.sends.length
    const response = await post(payload, key)
    transport.setOnSend(null)

    expect(response.status).toBe(202)
    expect(seenAtSend).toEqual([{ persisted: true, delivered: false, outbox: ['PROCESSING'] }])

    const lead = store.leads.getLead(response.json.leadId)
    expect(lead).toMatchObject({ journey: 'contact', status: 'DELIVERED', attemptCount: 1 })
    expect(lead.deliveredAt).toBeTruthy()
    expect(lead.subject.email).toBe(payload.email)
    expect(lead.context).toMatchObject({
      locale: 'en',
      campaign: 'pt27-2',
      originRoute: '/en/contact',
    })
    expect(lead.consent.processingAccepted).toBe(true)
    expect(store.leads.getOutboxForLead(lead.id)).toEqual([
      expect.objectContaining({ channel: 'CRM', status: 'DELIVERED', attempts: 1 }),
    ])
    expect(sendsSince(mark).map((send) => send.outcome)).toEqual(['delivered'])
    expect(transport.pending()).toBe(0)
  })

  it('ist idempotent: gleicher Key ergibt denselben Lead und keine zweite Zustellung', async () => {
    const key = 'pt272-idempotent'
    const payload = body()
    transport.script('delivered')
    const mark = transport.sends.length

    const first = await post(payload, key)
    const replay = await post(payload, key)
    expect(first.status).toBe(202)
    expect(replay.status).toBe(202)
    expect(replay.json.leadId).toBe(first.json.leadId)
    expect(countLeads(key)).toBe(1)
    expect(store.leads.getOutboxForLead(first.json.leadId)).toHaveLength(1)

    const conflict = await post({ ...payload, message: 'Ein anderer Inhalt.' }, key)
    expect(conflict.status).toBe(409)
    expect(countLeads(key)).toBe(1)
    expect(sendsSince(mark)).toHaveLength(1)
    expect(transport.pending()).toBe(0)
  })
})

describe('PT27.2 · Providerfehler, Retry und Recovery', () => {
  it('wiederholbarer Fehler → persistierter Retry → Recovery-Lauf → derselbe Lead, eine Zustellung', async () => {
    const key = 'pt272-retry'
    transport.script('retryable', 'delivered')
    const mark = transport.sends.length
    const response = await post(body(), key)
    expect(response.status).toBe(202)
    const leadId = response.json.leadId

    expect(store.leads.getLead(leadId)).toMatchObject({
      status: 'RETRY_PENDING',
      attemptCount: 1,
      lastErrorClass: 'SENDGRID_TEMPORARY',
    })
    expect(store.leads.getOutboxForLead(leadId)).toEqual([
      expect.objectContaining({ channel: 'CRM', status: 'RETRY_PENDING', attempts: 1 }),
    ])

    // Neustart-sicher: eine frische Verbindung sieht denselben dauerhaften Zustand.
    const reopened = harness.openStore(process.env.LEAD_DB_PATH)
    expect(reopened.leads.getLead(leadId).status).toBe('RETRY_PENDING')
    reopened.close()

    // Vor Faelligkeit wird nichts vorgezogen.
    expect(await contactService().processNext()).toBeNull()
    expect(sendsSince(mark)).toHaveLength(1)

    await harness.waitUntilDue(store.leads, leadId)
    const recovered = await contactService().processNext()
    expect(recovered).toMatchObject({ id: leadId, status: 'DELIVERED', attemptCount: 2 })
    expect(await contactService().processNext()).toBeNull()

    expect(sendsSince(mark).map((send) => send.outcome)).toEqual(['retryable', 'delivered'])
    expect(countLeads(key)).toBe(1)
    expect(store.leads.getEvents(leadId).map((event) => event.eventType)).toContain(
      'HANDOFF_RETRY_SCHEDULED',
    )
    expect(transport.pending()).toBe(0)
  })

  it('unbekanntes Providerergebnis → Klaerung, kein automatischer Replay', async () => {
    transport.script('unknown')
    const mark = transport.sends.length
    const response = await post(body(), 'pt272-unknown')
    const leadId = response.json.leadId

    expect(store.leads.getLead(leadId)).toMatchObject({
      status: 'RECONCILIATION_REQUIRED',
      reconciliationReason: 'PROVIDER_RESULT_UNKNOWN',
    })
    expect(store.leads.getOutboxForLead(leadId)).toEqual([
      expect.objectContaining({ status: 'FAILED_TERMINAL', attempts: 1 }),
    ])
    expect(
      store.leads.findReconciliationRequired().map((entry) => entry.id ?? entry.leadId),
    ).toContain(leadId)
    expect(await contactService().processNext()).toBeNull()
    expect(sendsSince(mark)).toHaveLength(1)
  })

  it('terminaler Providerfehler → Endzustand, der Lead bleibt vollstaendig erhalten', async () => {
    const payload = body()
    transport.script('terminal')
    const mark = transport.sends.length
    const response = await post(payload, 'pt272-terminal')
    expect(response.status).toBe(202)

    const lead = store.leads.getLead(response.json.leadId)
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.lastErrorClass).toMatch(/^[A-Z][A-Z0-9_]+$/)
    expect(lead.subject.email).toBe(payload.email)
    expect(await contactService().processNext()).toBeNull()
    expect(sendsSince(mark)).toHaveLength(1)
  })
})

describe('PT27.2 · Provider-Isolation dieses Laufs', () => {
  it('kein Netzwerkaufruf zum Provider, kein Schluessel und keine Kontaktadresse im Log', () => {
    expect(transport.network).toEqual({ client: 0, https: 0 })
    const text = logs.text()
    expect(text).not.toContain(SYNTHETIC_KEY)
    expect(text).not.toMatch(/lead\d+@praxis\.example/)
  })
})
