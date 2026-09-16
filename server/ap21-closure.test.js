// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'

/**
 * AP21-CLOSURE — die Pfade, die im Browser nicht messbar sind.
 *
 * Provider-Ausfaelle, Wiederholungen und unbekannte Zustellergebnisse
 * entstehen nicht durch Klicken. Sie werden hier gegen eine echte
 * SQLite-Datenbank erzeugt — unabhaengig neu geschrieben, nicht aus
 * `consumer-order.test.js` uebernommen.
 */

const require = createRequire(import.meta.url)
const { createConsumerOrderService, JOURNEY } = require('./consumer-order.js')
const {
  CrmRouter,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')

const body = (overrides = {}) => ({
  product: 'inside-out-duo',
  variant: 'set',
  quantity: 2,
  name: 'Closure Kundin',
  email: 'closure@example.com',
  locale: 'nl',
  processingConsent: true,
  consentAcceptedAt: '2026-09-08T09:00:00.000Z',
  ...overrides,
})

function stack({ deliver, maxAttempts = 3, retryDelayMs = 0 } = {}) {
  const db = openLeadDatabase({ filename: ':memory:' })
  const repository = new LeadRepository(db)
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters: deliver ? { consumer: { deliver } } : {} }),
    workerId: 'ap21-closure',
    maxAttempts,
    retryDelayMs,
  })
  return { db, repository, worker, service: createConsumerOrderService({ repository, worker }) }
}

describe('AP21-CLOSURE · CON-27/C21-33 · Provider-Ausfall ohne Bestellverlust', () => {
  it('haelt die Bestellung fest, wenn der Provider voruebergehend ausfaellt, und stellt danach zu', async () => {
    let attempts = 0
    const { service, worker, repository } = stack({
      deliver: async () => {
        attempts += 1
        if (attempts < 3) {
          throw Object.assign(new Error('temporary'), {
            code: 'SENDGRID_TEMPORARY',
            retryable: true,
          })
        }
        return { status: 'DELIVERED' }
      },
    })

    const result = await service.submit({ body: body(), idempotencyKey: 'retry' })
    // Nach dem ersten Fehlschlag ist die Anfrage weiterhin gespeichert.
    expect(repository.getLead(result.leadId).status).toBe('RETRY_PENDING')
    expect(result.deliveryPending).toBe(true)

    await worker.processNext()
    expect(repository.getLead(result.leadId).status).toBe('RETRY_PENDING')
    await worker.processNext()

    const lead = repository.getLead(result.leadId)
    expect(lead.status).toBe('DELIVERED')
    expect(attempts).toBe(3)
    // Die Bestelldaten haben den Umweg unveraendert ueberstanden.
    expect(lead.subject.email).toBe('closure@example.com')
    expect(lead.context.quantity).toBe(2)
  })

  it('gibt nach der letzten Wiederholung ehrlich auf, statt Erfolg zu behaupten', async () => {
    const { service, worker, repository } = stack({
      deliver: async () => {
        throw Object.assign(new Error('temporary'), { code: 'SENDGRID_TEMPORARY', retryable: true })
      },
      maxAttempts: 2,
    })
    const result = await service.submit({ body: body(), idempotencyKey: 'giveup' })
    await worker.processNext()
    const lead = repository.getLead(result.leadId)
    expect(lead.status).toBe('FAILED_TERMINAL')
    expect(lead.lastErrorClass).toBe('SENDGRID_TEMPORARY')
    // Die Bestellanfrage selbst ist trotzdem noch da — nichts geht verloren.
    expect(lead.subject.name).toBe('Closure Kundin')
  })

  it('markiert ein UNBEKANNTES Providerergebnis und spielt es nicht blind nach', async () => {
    let calls = 0
    const { service, worker, repository } = stack({
      deliver: async () => {
        calls += 1
        throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })
      },
    })
    const result = await service.submit({ body: body(), idempotencyKey: 'unknown' })
    const lead = repository.getLead(result.leadId)
    // Ein Timeout heisst nicht "nicht zugestellt" — es heisst "unbekannt".
    expect(lead.lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
    // PT22.2: unbekanntes Providerergebnis ist kein Fehlschlag — der Vorgang
    // braucht Klaerung und wird weiterhin NICHT automatisch nachgesendet.
    expect(lead.status).toBe('RECONCILIATION_REQUIRED')
    // Und es wird nicht automatisch nachgesendet.
    await worker.processNext()
    expect(calls).toBe(1)
  })

  it('verhindert doppelte Zustellung bei Worker-Replay', async () => {
    let delivered = 0
    const { service, worker } = stack({
      deliver: async () => {
        delivered += 1
        return { status: 'DELIVERED' }
      },
    })
    await service.submit({ body: body(), idempotencyKey: 'worker-replay' })
    expect(await worker.processNext()).toBeNull()
    expect(await worker.processNext()).toBeNull()
    expect(delivered).toBe(1)
  })
})

describe('AP21-CLOSURE · CON-21/22 · Journey- und Foundation-Grenze', () => {
  it('nutzt die geteilte Journey und legt keine eigene an', () => {
    const { LEAD_JOURNEYS } = require('./lead-foundation')
    expect(JOURNEY).toBe('consumer_order')
    expect(LEAD_JOURNEYS).toContain('consumer_order')
    // AP21 hat keine eigene Journey erfunden: die Liste enthaelt ausschliesslich
    // kanonische Eintraege. Die Zahl stand hier zum AP21-Abschluss auf fuenf;
    // AP22 PT22.1 hat `roi_report` und `practice_order` ergaenzt — das ist der
    // AP22-Launchvertrag, keine AP21-Erfindung. Geprueft wird deshalb die
    // Zugehoerigkeit zum kanonischen Satz, nicht mehr die blosse Anzahl.
    const CANONICAL = [
      'contact',
      'support',
      'consumer_order',
      'roi_report',
      'practice_order',
      'epigenetics_inquiry',
      'content_download',
    ]
    for (const journey of LEAD_JOURNEYS) expect(CANONICAL).toContain(journey)
  })

  it('routet ueber den geteilten CrmRouter auf das Ziel `consumer`', () => {
    const { DEFAULT_JOURNEY_ROUTES } = require('./lead-foundation')
    expect(DEFAULT_JOURNEY_ROUTES.consumer_order).toBe('consumer')
    const router = new CrmRouter({ adapters: {} })
    const resolved = router.resolve({ journey: 'consumer_order' })
    expect(resolved.target).toBe('consumer')
    // Ohne konfigurierten Adapter gibt es KEINE Zustellung, die Erfolg meldet.
    // Geprueft wird das VERHALTEN, nicht der Klassenname: seit AP22 PT22.3
    // reicht der Router jeden Adapter durch die Zustellgrenze (Timeout,
    // DRY_RUN, Klassifikation), der Name der Huelle ist also belanglos.
    return resolved.adapter.deliver({ lead: { journey: 'consumer_order' } }).then((result) => {
      expect(result.status).toBe('NO_PROVIDER_CONFIGURED')
      expect(result.status).not.toBe('DELIVERED')
    })
  })

  it('schreibt in dieselben Tabellen wie die anderen Journeys', async () => {
    const { service, db } = stack({ deliver: async () => ({ status: 'DELIVERED' }) })
    await service.submit({ body: body(), idempotencyKey: 'tables' })
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all()
      .map((row) => row.name)
    expect(tables).toContain('leads')
    expect(tables).toContain('lead_outbox')
    expect(tables).toContain('lead_events')
    // Keine consumer-eigene Tabelle — keine zweite Plattform.
    expect(tables.filter((name) => /consumer|order/iu.test(name))).toEqual([])
  })
})

describe('AP21-CLOSURE · CON-28 · Statuswahrheit', () => {
  it('meldet an keiner Stelle einen Kauf', async () => {
    const { service } = stack({ deliver: async () => ({ status: 'DELIVERED' }) })
    const result = await service.submit({ body: body(), idempotencyKey: 'truth' })
    const serialized = JSON.stringify(result)
    for (const forbidden of ['purchase', 'paid', 'payment', 'invoice', 'shipped']) {
      expect(serialized.toLowerCase(), forbidden).not.toContain(forbidden)
    }
    // `accepted` heisst "dauerhaft gespeichert", nicht "gekauft".
    expect(result.accepted).toBe(true)
    expect(result.status).toBe('DELIVERED')
  })

  it('sagt ohne konfigurierten Provider ehrlich, dass keiner da war', async () => {
    const { service } = stack()
    const result = await service.submit({ body: body(), idempotencyKey: 'no-provider' })
    expect(result.accepted).toBe(true)
    expect(result.providerConfigured).toBe(false)
  })
})
