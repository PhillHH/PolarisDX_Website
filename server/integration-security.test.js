// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP26 PT26.4 — Replay und Integrationsgrenze mit den ECHTEN SendGrid-Adaptern.
 *
 * Der Transport ist eine Fake-Funktion; es verlaesst nichts den Rechner. Gemessen wird,
 * was ein Providerfehler an Wiederholung, Datenbank und Log erzeugt.
 */

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')
const { SendGridTeamMailAdapter } = require('./contact-lead')
const { SendGridSupportMailAdapter } = require('./support-case')

const MARKER = 'pt264-provider-internal-marker'
const CONSENT = {
  processingAccepted: true,
  acceptedAt: '2026-09-15T09:00:00.000Z',
  version: 'pt264',
  marketing: 'DENIED',
}

function stack({ journey, adapters }) {
  const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
  const logs = []
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters, dryRun: false }),
    workerId: `pt264-${journey}`,
    journeys: [journey],
    retryPolicy: { maxAttempts: 3, baseDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 },
    logger: {
      info: (event, fields) => logs.push(JSON.stringify({ event, fields })),
      warn: (event, fields) => logs.push(JSON.stringify({ event, fields })),
    },
  })
  return { repository, worker, logs }
}

const contactLead = (repository, key = 'pt264-contact') =>
  repository.createLead({
    journey: 'contact',
    idempotencyKey: key,
    subject: {
      name: 'Dr. Probe',
      email: 'integration-probe@praxis.example',
      message: 'PT26.4',
    },
    context: { locale: 'de', originRoute: '/de/contact' },
    consent: CONSENT,
    channels: ['CRM'],
  })

function supportStack(send) {
  const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt264-support-'))
  const adapter = new SendGridSupportMailAdapter({
    send,
    recipient: 'team@polarisdx.example',
    sender: 'web@polarisdx.example',
    storageRoot,
    teamRecipients: [],
  })
  const built = stack({ journey: 'support', adapters: { support: adapter } })
  const lead = built.repository.createLead({
    journey: 'support',
    idempotencyKey: 'pt264-support',
    subject: {
      name: 'Dr. Probe',
      email: 'support-probe@praxis.example',
      udi: 'IGL-1',
      swVersion: '1.0',
      issueType: 'software',
      subject: 'PT26.4',
      description: '',
    },
    context: { locale: 'de', caseDir: 'case-pt264', attachments: [] },
    consent: CONSENT,
    channels: ['CRM'],
  })
  return { ...built, lead, cleanup: () => fs.rmSync(storageRoot, { recursive: true, force: true }) }
}

describe('PT26.4 — unbekanntes Ergebnis wird nicht blind wiederholt', () => {
  for (const code of ['ETIMEDOUT', 'ECONNRESET']) {
    it(`echter Adapter: ${code} → Klaerung, kein zweiter Versand`, async () => {
      let calls = 0
      const adapter = new SendGridTeamMailAdapter({
        send: async () => {
          calls += 1
          throw Object.assign(new Error('socket'), { code })
        },
        recipient: 'team@polarisdx.example',
        sender: 'web@polarisdx.example',
      })
      const { repository, worker } = stack({
        journey: 'contact',
        adapters: { 'general-sales': adapter },
      })
      const lead = contactLead(repository)
      await worker.processNext()
      await worker.processNext()
      const after = repository.getLead(lead.id)
      // Vorher: SENDGRID_TEMPORARY → RETRY_PENDING → zweiter Versand.
      expect(after.status).toBe('RECONCILIATION_REQUIRED')
      expect(after.lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
      expect(calls).toBe(1)
    })
  }

  it('eindeutiger 5xx bleibt wiederholbar', async () => {
    let calls = 0
    const adapter = new SendGridTeamMailAdapter({
      send: async () => {
        calls += 1
        if (calls === 1) {
          throw Object.assign(new Error('unavailable'), { response: { statusCode: 503 } })
        }
      },
      recipient: 'team@polarisdx.example',
      sender: 'web@polarisdx.example',
    })
    const { repository, worker } = stack({
      journey: 'contact',
      adapters: { 'general-sales': adapter },
    })
    const lead = contactLead(repository)
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
    expect(calls).toBe(2)
  })
})

describe('PT26.4 — Teilzustellung sendet die angenommene Mail nicht erneut (LDV-10)', () => {
  it('Teammail angenommen, Bestaetigung 5xx → Klaerung, keine Nachsendung', async () => {
    const sent = []
    const { repository, worker, lead, cleanup } = supportStack(async (message) => {
      if (Array.isArray(message.to)) {
        sent.push('team')
        return
      }
      sent.push('confirmation')
      throw Object.assign(new Error('unavailable'), { response: { statusCode: 503 } })
    })
    try {
      await worker.processNext()
      await worker.processNext()
      const after = repository.getLead(lead.id)
      // Vorher: Promise.all → SENDGRID_TEMPORARY → RETRY_PENDING → Teammail doppelt.
      expect(after.status).toBe('RECONCILIATION_REQUIRED')
      expect(sent.filter((entry) => entry === 'team')).toHaveLength(1)
    } finally {
      cleanup()
    }
  })

  it('beide abgelehnt mit 5xx → wiederholbar; Transportfehler dabei → Klaerung', async () => {
    const onlyServerErrors = supportStack(async () => {
      throw Object.assign(new Error('unavailable'), { response: { statusCode: 503 } })
    })
    try {
      await onlyServerErrors.worker.processNext()
      expect(onlyServerErrors.repository.getLead(onlyServerErrors.lead.id).status).toBe(
        'RETRY_PENDING',
      )
    } finally {
      onlyServerErrors.cleanup()
    }

    const mixed = supportStack(async (message) => {
      if (Array.isArray(message.to)) {
        throw Object.assign(new Error('unavailable'), { response: { statusCode: 503 } })
      }
      throw Object.assign(new Error('socket'), { code: 'ETIMEDOUT' })
    })
    try {
      await mixed.worker.processNext()
      expect(mixed.repository.getLead(mixed.lead.id).status).toBe('RECONCILIATION_REQUIRED')
    } finally {
      mixed.cleanup()
    }
  })
})

describe('PT26.4 — Providerfehler landet weder in der Datenbank noch im Log', () => {
  it('nur Fehlerklassen werden gespeichert; Text, Schluessel, Adresse nie', async () => {
    const adapter = new SendGridTeamMailAdapter({
      send: async () => {
        throw Object.assign(
          new Error(`${MARKER} Unauthorized key SG.pt264fake at /home/ops/app.js:1`),
          {
            code: 'Unauthorized',
            response: { statusCode: 401, body: { errors: [{ message: MARKER }] } },
          },
        )
      },
      recipient: 'team@polarisdx.example',
      sender: 'web@polarisdx.example',
    })
    const { repository, worker, logs } = stack({
      journey: 'contact',
      adapters: { 'general-sales': adapter },
    })
    const lead = contactLead(repository)
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('FAILED_TERMINAL')

    const tables = repository.db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((row) => row.name)
    const dump = tables
      .map((table) => JSON.stringify(repository.db.prepare(`SELECT * FROM "${table}"`).all()))
      .join('\n')
    expect(dump).not.toContain(MARKER)
    expect(dump).not.toContain('SG.pt264fake')
    expect(dump).not.toContain('/home/ops')

    const logText = logs.join('\n')
    expect(logs.length).toBeGreaterThan(0)
    for (const forbidden of [
      MARKER,
      'SG.pt264fake',
      '/home/ops',
      'integration-probe@praxis.example',
    ]) {
      expect(logText).not.toContain(forbidden)
    }
  })
})
