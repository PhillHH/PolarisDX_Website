// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  DELIVERY_RESULTS,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./index')

const CONSENT = Object.freeze({
  processingAccepted: true,
  acceptedAt: '2026-09-01T10:00:00.000Z',
  version: 'privacy-2026-09',
  marketing: 'DENIED',
})

function leadInput(overrides = {}) {
  return {
    journey: 'epigenetics_inquiry',
    idempotencyKey: 'request-1',
    subject: { name: 'Ada', email: 'ada@example.test', organization: 'Example Practice' },
    context: {
      locale: 'de',
      source: 'epigenetics',
      campaign: 'professional-launch',
      panel: 'healthy-aging',
      focus: 'longevity',
      originRoute: '/de/epigenetics?panel=healthy-aging&focus=longevity',
    },
    consent: CONSENT,
    ...overrides,
  }
}

describe('shared lead foundation', () => {
  let directory
  let filename
  let db
  let repository
  let clockMs
  let idSequence

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-leads-'))
    filename = path.join(directory, 'leads.sqlite3')
    clockMs = Date.parse('2026-09-01T10:00:00.000Z')
    idSequence = 0
    db = openLeadDatabase({ filename })
    repository = new LeadRepository(db, {
      clock: () => new Date(clockMs),
      idFactory: () => `lead-${++idSequence}`,
    })
  })

  afterEach(() => {
    if (db?.open) db.close()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('persists stable identity, journey, context, consent and audit events across reopen', () => {
    const lead = repository.createLead(leadInput())
    expect(lead).toMatchObject({
      id: 'lead-1',
      journey: 'epigenetics_inquiry',
      status: 'PENDING_HANDOFF',
      context: {
        locale: 'de',
        source: 'epigenetics',
        campaign: 'professional-launch',
        panel: 'healthy-aging',
        focus: 'longevity',
      },
      consent: {
        processingAccepted: true,
        acceptedAt: '2026-09-01T10:00:00.000Z',
        version: 'privacy-2026-09',
        marketing: 'DENIED',
      },
    })
    expect(repository.getEvents(lead.id).map(({ eventType }) => eventType)).toEqual([
      'LEAD_RECEIVED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
    ])

    db.close()
    db = openLeadDatabase({ filename })
    repository = new LeadRepository(db)
    expect(repository.getLead('lead-1')).toMatchObject({
      id: 'lead-1',
      journey: 'epigenetics_inquiry',
      status: 'PENDING_HANDOFF',
    })
    // Die Aussage ist "jede Migration genau einmal angewandt", nicht "es gibt
    // genau eine". PT19.3 hat eine zweite hinzugefuegt; gezaehlt wird deshalb
    // gegen das Verzeichnis statt gegen eine feste Zahl.
    const migrationFiles = fs
      .readdirSync(path.join(__dirname, 'migrations'))
      .filter((name) => name.endsWith('.sql'))
    expect(db.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get().count).toBe(
      migrationFiles.length,
    )
  })

  it('uses a durable unique idempotency key and rejects conflicting replay', () => {
    const first = repository.createLead(leadInput())
    const replay = repository.createLead(leadInput())
    expect(replay.id).toBe(first.id)
    expect(db.prepare('SELECT COUNT(*) AS count FROM leads').get().count).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS count FROM lead_outbox').get().count).toBe(1)

    expect(() =>
      repository.createLead(leadInput({ subject: { email: 'different@example.test' } })),
    ).toThrow(IdempotencyConflictError)
  })

  it('persists before invoking the CRM adapter and routes normalized journey context', async () => {
    const lead = repository.createLead(leadInput())
    let delivery
    const adapter = {
      async deliver(value) {
        delivery = value
        expect(repository.getLead(lead.id).status).toBe('PROCESSING')
        expect(
          repository.getEvents(lead.id).some(({ eventType }) => eventType === 'LEAD_PERSISTED'),
        ).toBe(true)
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    }
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters: { epigenetics: adapter } }),
      workerId: 'crm-worker-1',
    })

    const delivered = await worker.processNext()
    expect(delivered.status).toBe('DELIVERED')
    expect(delivery).toMatchObject({
      target: 'epigenetics',
      deliveryKey: `${lead.id}:crm`,
      lead: {
        id: lead.id,
        journey: 'epigenetics_inquiry',
        context: {
          locale: 'de',
          source: 'epigenetics',
          campaign: 'professional-launch',
          panel: 'healthy-aging',
          focus: 'longevity',
        },
      },
    })
  })

  it('retains a lead after a transient failure and later delivers with the same provider key', async () => {
    const lead = repository.createLead(leadInput())
    const deliveryKeys = []
    const adapter = {
      async deliver({ deliveryKey }) {
        deliveryKeys.push(deliveryKey)
        return deliveryKeys.length === 1
          ? { status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'CRM_TEMPORARY_FAILURE' }
          : { status: DELIVERY_RESULTS.DELIVERED }
      },
    }
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters: { epigenetics: adapter } }),
      workerId: 'crm-worker-1',
      retryDelayMs: 0,
    })

    expect((await worker.processNext()).status).toBe('RETRY_PENDING')
    expect(repository.getOutboxForLead(lead.id)[0]).toMatchObject({
      status: 'RETRY_PENDING',
      attempts: 1,
      lastErrorClass: 'CRM_TEMPORARY_FAILURE',
    })
    expect((await worker.processNext()).status).toBe('DELIVERED')
    expect(deliveryKeys).toEqual([`${lead.id}:crm`, `${lead.id}:crm`])
    expect(repository.getOutboxForLead(lead.id)[0].attempts).toBe(2)
  })

  it('retains terminal state, reason, attempts and timestamp after attempts are exhausted', async () => {
    const lead = repository.createLead(leadInput())
    const adapter = {
      async deliver() {
        return { status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'CRM_UNAVAILABLE' }
      },
    }
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters: { epigenetics: adapter } }),
      workerId: 'crm-worker-1',
      maxAttempts: 2,
      retryDelayMs: 0,
    })

    expect((await worker.processNext()).status).toBe('RETRY_PENDING')
    clockMs += 1
    expect((await worker.processNext()).status).toBe('FAILED_TERMINAL')
    expect(repository.getOutboxForLead(lead.id)[0]).toMatchObject({
      status: 'FAILED_TERMINAL',
      attempts: 2,
      lastErrorClass: 'CRM_UNAVAILABLE',
      terminalAt: new Date(clockMs).toISOString(),
    })
  })

  it('marks non-retryable provider errors terminal without losing the persisted lead', async () => {
    const lead = repository.createLead(leadInput())
    const error = Object.assign(new Error('rejected'), {
      code: 'CRM_PAYLOAD_REJECTED',
      retryable: false,
    })
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({
        adapters: {
          epigenetics: {
            async deliver() {
              throw error
            },
          },
        },
      }),
      workerId: 'crm-worker-1',
    })

    expect((await worker.processNext()).status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(lead.id)).toMatchObject({
      id: lead.id,
      lastErrorClass: 'CRM_PAYLOAD_REJECTED',
    })
  })

  it('does not automatically replay a provider timeout with unknown external result', async () => {
    const lead = repository.createLead(leadInput())
    let calls = 0
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({
        adapters: {
          epigenetics: {
            async deliver() {
              calls += 1
              throw Object.assign(new Error('provider result unknown'), { code: 'ETIMEDOUT' })
            },
          },
        },
      }),
      workerId: 'crm-worker-1',
    })

    expect((await worker.processNext()).status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(lead.id).lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
    expect(await worker.processNext()).toBeNull()
    expect(calls).toBe(1)
  })

  it('reports NO_PROVIDER_CONFIGURED as terminal truth and never as CRM success', async () => {
    const lead = repository.createLead(leadInput())
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter(),
      workerId: 'crm-worker-1',
    })

    expect((await worker.processNext()).status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(lead.id)).toMatchObject({
      status: 'FAILED_TERMINAL',
      lastErrorClass: 'NO_PROVIDER_CONFIGURED',
    })
    expect(
      repository.getEvents(lead.id).some(({ eventType }) => eventType === 'HANDOFF_DELIVERED'),
    ).toBe(false)
  })

  it('atomically claims once across database connections and protects against stale worker updates', () => {
    const lead = repository.createLead(leadInput())
    const secondDb = openLeadDatabase({ filename })
    const secondRepository = new LeadRepository(secondDb, { clock: () => new Date(clockMs) })
    try {
      const firstClaim = repository.claimNext({ workerId: 'worker-a', leaseMs: 10 })
      expect(secondRepository.claimNext({ workerId: 'worker-b', leaseMs: 10 })).toBeNull()

      clockMs += 11
      const reclaimed = secondRepository.claimNext({ workerId: 'worker-b', leaseMs: 10 })
      expect(reclaimed.deliveryKey).toBe(firstClaim.deliveryKey)
      expect(reclaimed.attempt).toBe(2)
      secondRepository.markDelivered(reclaimed)

      repository.markFailed(firstClaim, {
        retryable: true,
        errorClass: 'STALE_WORKER_TIMEOUT',
        retryDelayMs: 0,
      })
      expect(repository.getLead(lead.id).status).toBe('DELIVERED')
      expect(repository.getOutboxForLead(lead.id)[0]).toMatchObject({
        status: 'DELIVERED',
        attempts: 2,
      })
    } finally {
      secondDb.close()
    }
  })

  it('does not replay a delivered outbox item', async () => {
    repository.createLead(leadInput())
    let calls = 0
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({
        adapters: {
          epigenetics: {
            async deliver() {
              calls += 1
              return { status: DELIVERY_RESULTS.DELIVERED }
            },
          },
        },
      }),
      workerId: 'crm-worker-1',
    })

    await worker.processNext()
    expect(await worker.processNext()).toBeNull()
    expect(calls).toBe(1)
  })

  it('supports mail as a separate post-persistence outbox side effect', async () => {
    const lead = repository.createLead(leadInput({ channels: ['CRM', 'MAIL'] }))
    const adapter = {
      async deliver() {
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    }
    const router = {
      resolve() {
        return { target: 'test-provider', adapter }
      },
    }
    const crmWorker = new LeadHandoffWorker({
      repository,
      router,
      workerId: 'crm-worker',
      channel: 'CRM',
    })
    const mailWorker = new LeadHandoffWorker({
      repository,
      router,
      workerId: 'mail-worker',
      channel: 'MAIL',
    })

    expect((await crmWorker.processNext()).status).toBe('PENDING_HANDOFF')
    expect((await mailWorker.processNext()).status).toBe('DELIVERED')
    expect(repository.getOutboxForLead(lead.id).map(({ status }) => status)).toEqual([
      'DELIVERED',
      'DELIVERED',
    ])
  })

  it('logs identifiers and error classes without contact payload or consent text', async () => {
    const lead = repository.createLead(leadInput())
    const entries = []
    const logger = {
      info(event, fields) {
        entries.push({ event, fields })
      },
      warn(event, fields) {
        entries.push({ event, fields })
      },
    }
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter(),
      workerId: 'crm-worker-1',
      logger,
    })
    await worker.processNext()

    const serialized = JSON.stringify(entries)
    expect(serialized).toContain(lead.id)
    expect(serialized).toContain('NO_PROVIDER_CONFIGURED')
    expect(serialized).not.toContain('ada@example.test')
    expect(serialized).not.toContain('Ada')
    expect(serialized).not.toContain('privacy-2026-09')
  })

  it('rejects missing processing consent and unsupported locale before persistence', () => {
    expect(() =>
      repository.createLead(leadInput({ consent: { ...CONSENT, processingAccepted: false } })),
    ).toThrow('processing consent is required')
    expect(() =>
      repository.createLead(
        leadInput({
          idempotencyKey: 'request-2',
          context: { ...leadInput().context, locale: 'xx' },
        }),
      ),
    ).toThrow('context.locale is unsupported')
    expect(db.prepare('SELECT COUNT(*) AS count FROM leads').get().count).toBe(0)
  })
})
