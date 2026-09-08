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
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')
const {
  CONSENT_VERSION,
  InquiryValidationError,
  createEpigeneticsInquiryService,
} = require('./epigenetics-inquiry')

const BASE_BODY = Object.freeze({
  name: 'Ada Example',
  email: 'ada@example.test',
  organization: 'Example Practice',
  facilityType: 'practice',
  casesPerMonth: '11-25',
  message: 'Please contact me about the programme.',
  locale: 'de',
  source: 'epigenetics',
  campaign: 'professional-launch',
  panel: 'healthy-aging',
  focus: 'longevity',
  originRoute: '/de/epigenetics?panel=healthy-aging&focus=longevity',
  processingConsent: true,
  marketingConsent: false,
  consentAcceptedAt: '2026-09-01T10:00:00.000Z',
  _hp: '',
})

describe('epigenetics_inquiry vertical slice', () => {
  let directory
  let db
  let repository
  let clockMs
  let sequence

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-epi-inquiry-'))
    db = openLeadDatabase({ filename: path.join(directory, 'leads.sqlite3') })
    clockMs = Date.parse('2026-09-01T10:00:00.000Z')
    sequence = 0
    repository = new LeadRepository(db, {
      clock: () => new Date(clockMs),
      idFactory: () => `epi-lead-${++sequence}`,
    })
  })

  afterEach(() => {
    if (db?.open) db.close()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  function serviceWith(adapter, options = {}) {
    const router = adapter ? new CrmRouter({ adapters: { epigenetics: adapter } }) : new CrmRouter()
    return createEpigeneticsInquiryService({
      repository,
      worker: new LeadHandoffWorker({
        repository,
        router,
        workerId: 'epigenetics-inquiry-test',
        retryDelayMs: 0,
        ...options,
      }),
    })
  }

  it('validates the server payload and requires durable processing consent', async () => {
    const service = serviceWith({
      async deliver() {
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    })
    await expect(
      service.submit({ body: { ...BASE_BODY, processingConsent: false }, idempotencyKey: 'bad-1' }),
    ).rejects.toMatchObject({
      name: 'InquiryValidationError',
      code: 'PROCESSING_CONSENT_REQUIRED',
    })
    await expect(
      service.submit({ body: { ...BASE_BODY, panel: 'unknown' }, idempotencyKey: 'bad-2' }),
    ).rejects.toBeInstanceOf(InquiryValidationError)
    await expect(
      service.submit({ body: { ...BASE_BODY, source: 'untrusted' }, idempotencyKey: 'bad-3' }),
    ).rejects.toMatchObject({ fields: ['source'] })
    expect(db.prepare('SELECT COUNT(*) AS count FROM leads').get().count).toBe(0)
  })

  it('persists report provenance through the existing shared journey and CRM route', async () => {
    let delivery
    const service = serviceWith({
      async deliver(value) {
        delivery = value
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    })
    const result = await service.submit({
      body: {
        ...BASE_BODY,
        source: 'musterbefund',
        panel: 'healthy-aging',
        originRoute:
          '/de/epigenetics/musterbefund/healthy-aging?panel=healthy-aging&campaign=report-entry',
      },
      idempotencyKey: 'report-context-1',
    })
    expect(result.status).toBe('DELIVERED')
    expect(delivery).toMatchObject({
      target: 'epigenetics',
      lead: {
        journey: 'epigenetics_inquiry',
        context: {
          locale: 'de',
          source: 'musterbefund',
          campaign: 'professional-launch',
          panel: 'healthy-aging',
          originRoute:
            '/de/epigenetics/musterbefund/healthy-aging?panel=healthy-aging&campaign=report-entry',
        },
      },
    })
  })

  it('persists identity, x10-ready context and consent before centralized CRM routing', async () => {
    let delivery
    const service = serviceWith({
      async deliver(value) {
        delivery = value
        const persisted = repository.getLead(value.lead.id)
        expect(persisted.status).toBe('PROCESSING')
        expect(repository.getEvents(value.lead.id).map((event) => event.eventType)).toContain(
          'LEAD_PERSISTED',
        )
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    })

    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'valid-1' })
    expect(result).toMatchObject({ accepted: true, status: 'DELIVERED' })
    expect(delivery).toMatchObject({
      target: 'epigenetics',
      lead: {
        journey: 'epigenetics_inquiry',
        subject: {
          name: 'Ada Example',
          email: 'ada@example.test',
          organization: 'Example Practice',
          facilityType: 'practice',
          casesPerMonth: '11-25',
        },
        context: {
          locale: 'de',
          source: 'epigenetics',
          campaign: 'professional-launch',
          panel: 'healthy-aging',
          focus: 'longevity',
        },
        consent: {
          processingAccepted: true,
          version: CONSENT_VERSION,
          marketing: 'DENIED',
        },
      },
    })
  })

  it('reports NO_PROVIDER_CONFIGURED truthfully without losing the persistent request', async () => {
    const result = await serviceWith(null).submit({ body: BASE_BODY, idempotencyKey: 'no-crm' })
    expect(result).toMatchObject({
      accepted: true,
      status: 'FAILED_TERMINAL',
      providerConfigured: false,
    })
    expect(repository.getLead(result.leadId)).toMatchObject({
      journey: 'epigenetics_inquiry',
      lastErrorClass: 'NO_PROVIDER_CONFIGURED',
    })
  })

  it('retains a transient failure and retries the same logical lead to delivery', async () => {
    let calls = 0
    const deliveryKeys = []
    const service = serviceWith({
      async deliver({ deliveryKey }) {
        calls += 1
        deliveryKeys.push(deliveryKey)
        return calls === 1
          ? { status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'CRM_TEMPORARY_FAILURE' }
          : { status: DELIVERY_RESULTS.DELIVERED }
      },
    })
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'retry-1' })
    expect(first.status).toBe('RETRY_PENDING')
    clockMs += 1
    const delivered = await service.processNext()
    expect(delivered).toMatchObject({ id: first.leadId, status: 'DELIVERED' })
    expect(deliveryKeys).toEqual([`${first.leadId}:crm`, `${first.leadId}:crm`])
  })

  it('does not replay an unknown provider result', async () => {
    let calls = 0
    const service = serviceWith({
      async deliver() {
        calls += 1
        throw Object.assign(new Error('unknown external result'), { code: 'ETIMEDOUT' })
      },
    })
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'unknown-1' })
    expect(result.status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(result.leadId).lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
    expect(await service.processNext()).toBeNull()
    expect(calls).toBe(1)
  })

  it('deduplicates double click, browser/API retry and worker replay', async () => {
    let calls = 0
    const service = serviceWith({
      async deliver() {
        calls += 1
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    })
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'same-logical-request' })
    const replay = await service.submit({ body: BASE_BODY, idempotencyKey: 'same-logical-request' })
    expect(replay.leadId).toBe(first.leadId)
    expect(db.prepare('SELECT COUNT(*) AS count FROM leads').get().count).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS count FROM lead_outbox').get().count).toBe(1)
    expect(await service.processNext()).toBeNull()
    expect(calls).toBe(1)
  })

  it('accepts all ten locales without analytics or marketing consent', async () => {
    const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
    const service = serviceWith({
      async deliver() {
        return { status: DELIVERY_RESULTS.DELIVERED }
      },
    })
    for (const locale of locales) {
      const result = await service.submit({
        body: { ...BASE_BODY, locale, marketingConsent: false },
        idempotencyKey: `locale-${locale}`,
      })
      expect(result.status).toBe('DELIVERED')
      expect(repository.getLead(result.leadId).consent.marketing).toBe('DENIED')
    }
    expect(db.prepare('SELECT COUNT(*) AS count FROM leads').get().count).toBe(10)
  })
})
