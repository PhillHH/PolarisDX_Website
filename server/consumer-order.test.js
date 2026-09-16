// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'

/**
 * AP21 PT21.5 — Consumer Ordering auf der geteilten Lead-Foundation.
 *
 * Geprueft wird das, was bis PT21.4 nachweislich GEFEHLT hat (§4
 * CONSUMER-CONTRACT): Persistenz, Idempotency, Retry, Mengen-Allowlist und
 * die Trennung von Verarbeitungs- und Marketing-Consent. Der Legacy-Pfad
 * hat eine Bestellanfrage bei einem SendGrid-Fehler ersatzlos verloren.
 *
 * Alle Tests laufen gegen eine echte SQLite-Datenbank im Speicher — die
 * Foundation-Primitive werden benutzt, nicht nachgebaut.
 */

const require = createRequire(import.meta.url)
const {
  CONSENT_VERSION,
  ConsumerOrderValidationError,
  JOURNEY,
  PRODUCT_ALLOWLIST,
  SendGridConsumerOrderAdapter,
  createConsumerOrderService,
  orderReference,
} = require('./consumer-order.js')
const {
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')

const order = (overrides = {}) => ({
  product: 'spray',
  variant: 'pack-12',
  quantity: 2,
  name: 'Mila Sørensen',
  email: 'Mila@Example.com',
  phone: '+45 12 34 56 78',
  locale: 'da',
  processingConsent: true,
  consentAcceptedAt: '2026-09-08T09:00:00.000Z',
  ...overrides,
})

/**
 * Ein vollstaendiger Journey-Stack. `deliver` ist der einzige Freiheitsgrad:
 * damit lassen sich Provider-Erfolg, transienter Fehler, terminaler Fehler
 * und das unbekannte Ergebnis (Timeout) einzeln messen.
 */
function harness({ deliver, maxAttempts = 3, retryDelayMs = 0 } = {}) {
  const db = openLeadDatabase({ filename: ':memory:' })
  const repository = new LeadRepository(db)
  const adapters = deliver ? { consumer: { deliver } } : {}
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: 'test-consumer-order',
    maxAttempts,
    retryDelayMs,
  })
  const service = createConsumerOrderService({ repository, worker })
  return { db, repository, worker, service }
}

const submit = (service, body, key = 'key-1') => service.submit({ body, idempotencyKey: key })

describe('AP21 PT21.5 — Validierung und Allowlists', () => {
  it('akzeptiert alle drei Produktfamilien unter Route-Slug UND Bestell-ID', async () => {
    const cases = [
      ['vitamin-d3-spray', 'pack-12'],
      ['spray', 'pack-12'],
      ['hydrating-masks', 'box-5'],
      ['masks', 'box-5'],
      ['inside-out-duo', 'set'],
      ['duo', 'set'],
    ]
    const { service, repository } = harness()
    for (const [product, variant] of cases) {
      const result = await submit(service, order({ product, variant }), `ok-${product}`)
      expect(result.accepted, `${product} angenommen`).toBe(true)
      const lead = repository.getLead(result.leadId)
      // Intern wird immer auf den kanonischen Route-Slug normalisiert.
      expect(lead.context.productId, `${product} kanonisch`).toBe(
        PRODUCT_ALLOWLIST[product]
          ? product
          : { spray: 'vitamin-d3-spray', masks: 'hydrating-masks', duo: 'inside-out-duo' }[product],
      )
      expect(lead.journey).toBe(JOURNEY)
    }
  })

  it('lehnt ein unbekanntes Produkt ab, statt es durchzureichen', async () => {
    const { service } = harness()
    for (const product of ['igloo-pro', 'SPRAY', '', null, 'vitamin-d3-spray/../admin']) {
      await expect(submit(service, order({ product }))).rejects.toMatchObject({
        code: 'UNKNOWN_PRODUCT',
      })
    }
  })

  it('lehnt eine fremde Variante ab, statt still auf die Standardvariante zu fallen', async () => {
    const { service } = harness()
    // 'box-5' gehoert zu den Masken, nicht zum Spray.
    await expect(
      submit(service, order({ product: 'spray', variant: 'box-5' })),
    ).rejects.toMatchObject({
      code: 'UNKNOWN_VARIANT',
    })
    await expect(submit(service, order({ variant: 'pack-999' }))).rejects.toMatchObject({
      code: 'UNKNOWN_VARIANT',
    })
  })

  it('allowlistet die Menge serverseitig — Freitext und Ausreisser fliegen raus', async () => {
    const { service } = harness()
    const rejected = [0, -1, 4, 99, 1.5, '1 pack (12 bottles)', '2; DROP TABLE leads', '', null, {}]
    for (const quantity of rejected) {
      await expect(
        submit(service, order({ quantity })),
        `Menge ${JSON.stringify(quantity)} abgelehnt`,
      ).rejects.toMatchObject({ code: 'INVALID_QUANTITY' })
    }
  })

  it('nimmt 1..3 und den ausdruecklichen Beratungsfall an', async () => {
    const { service, repository } = harness()
    for (const quantity of [1, 2, 3, '3']) {
      const result = await submit(service, order({ quantity }), `qty-${quantity}`)
      expect(repository.getLead(result.leadId).context.quantity).toBe(Number(quantity))
    }
    const advisory = await submit(service, order({ quantity: 'MORE' }), 'qty-more')
    const lead = repository.getLead(advisory.leadId)
    // Der Beratungsfall behauptet KEINE Menge — 0 heisst "nicht angegeben".
    expect(lead.context.quantity).toBe(0)
    expect(lead.subject.quantityMode).toBe('ADVISE')
  })

  it('verlangt Name, gueltige E-Mail und eine unterstuetzte Locale', async () => {
    const { service } = harness()
    await expect(
      submit(service, order({ name: 'A', email: 'keine-mail', locale: 'ru' })),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED', fields: ['name', 'email', 'locale'] })
  })

  it('speichert nur die Bestellfelder — Unbekanntes aus dem Request faellt weg', async () => {
    const { service, repository } = harness()
    const result = await submit(
      service,
      order({ role: 'admin', to: 'angreifer@example.com', price: 1, __proto__x: 'x' }),
      'minimal',
    )
    const lead = repository.getLead(result.leadId)
    expect(Object.keys(lead.subject).sort()).toEqual([
      'city',
      'company',
      'country',
      'email',
      'message',
      'name',
      'phone',
      'postcode',
      'productId',
      'productLabel',
      'quantity',
      'quantityMode',
      'street',
      'variant',
    ])
    // Der Empfaenger ist serverseitig fest — das Formular ist kein Relay.
    expect(JSON.stringify(lead)).not.toContain('angreifer@example.com')
  })
})

describe('AP21 PT21.5 — Consent', () => {
  it('verlangt Verarbeitungs-Consent und einen Zeitstempel als Nachweis', async () => {
    const { service } = harness()
    await expect(
      submit(service, order({ processingConsent: false, consent: false })),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })
    await expect(submit(service, order({ consentAcceptedAt: 'irgendwann' }))).rejects.toMatchObject(
      { code: 'INVALID_CONSENT_EVIDENCE' },
    )
  })

  it('haelt Marketing-Consent getrennt und optional', async () => {
    const { service, repository } = harness()
    const withoutMarketing = await submit(service, order(), 'consent-a')
    expect(repository.getLead(withoutMarketing.leadId).consent).toMatchObject({
      processingAccepted: true,
      marketing: 'DENIED',
      version: CONSENT_VERSION,
    })
    // Ohne Marketing-Einwilligung laeuft die Bestellung vollstaendig durch.
    expect(withoutMarketing.accepted).toBe(true)

    const withMarketing = await submit(service, order({ marketingConsent: true }), 'consent-b')
    expect(repository.getLead(withMarketing.leadId).consent.marketing).toBe('GRANTED')
  })

  it('fragt an keiner Stelle nach einer Analytics-Einwilligung', async () => {
    const { service } = harness()
    // Eine Bestellung ohne jedes Analytics-Feld ist vollstaendig gueltig.
    const result = await submit(service, order(), 'no-analytics')
    expect(result.accepted).toBe(true)
    const source = require('node:fs').readFileSync(
      new URL('./consumer-order.js', import.meta.url),
      'utf8',
    )
    for (const forbidden of ['analytics_storage', 'hasAnalyticsConsent', 'dataLayer', 'gtag']) {
      expect(source, `kein ${forbidden} im Bestellpfad`).not.toContain(forbidden)
    }
  })
})

describe('AP21 PT21.5 — Persistenz, Idempotenz, Vorgangsnummer', () => {
  it('persistiert VOR jedem externen Handoff', async () => {
    // Gemessen wird der Zustand der Datenbank in dem Moment, in dem der
    // Provider aufgerufen wird — nicht die Reihenfolge im Quelltext.
    let stateAtProviderCall = null
    let db
    const harnessed = harness({
      deliver: async () => {
        // Nur der ERSTE Providerkontakt zaehlt — ein spaeterer, korrekt
        // committeter Lauf darf einen frueheren Verstoss nicht ueberschreiben.
        stateAtProviderCall ??= {
          leads: db.prepare('SELECT id, status FROM leads').all(),
          outbox: db.prepare('SELECT lead_id, channel, status FROM lead_outbox').all(),
        }
        return { status: 'DELIVERED' }
      },
    })
    db = harnessed.db
    const { service, repository } = harnessed

    const result = await submit(service, order(), 'order-first')

    // Als der Provider lief, lagen Lead UND Outbox bereits committet vor.
    expect(stateAtProviderCall, 'Provider wurde aufgerufen').not.toBeNull()
    expect(stateAtProviderCall.leads).toHaveLength(1)
    expect(stateAtProviderCall.leads[0].id).toBe(result.leadId)
    expect(stateAtProviderCall.outbox).toHaveLength(1)
    expect(stateAtProviderCall.outbox[0].channel).toBe('CRM')

    const events = repository.getEvents(result.leadId).map((event) => event.eventType)
    // PT22.2: `LEAD_VALIDATED` macht den Pruefschritt im Protokoll sichtbar,
    // statt ihn zwischen Empfang und Speicherung verschwinden zu lassen.
    expect(events.slice(0, 4)).toEqual([
      'LEAD_RECEIVED',
      'LEAD_VALIDATED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
    ])
    expect(events.indexOf('HANDOFF_ATTEMPT')).toBeGreaterThan(events.indexOf('LEAD_PERSISTED'))
  })

  it('dedupliziert Double-Click, Browser-Retry und API-Replay auf denselben Vorgang', async () => {
    let delivered = 0
    const { service, repository, db } = harness({
      deliver: async () => {
        delivered += 1
        return { status: 'DELIVERED' }
      },
    })
    const first = await submit(service, order(), 'replay-key')
    const second = await submit(service, order(), 'replay-key')
    const third = await submit(service, order(), 'replay-key')
    expect(second.leadId).toBe(first.leadId)
    expect(third.leadId).toBe(first.leadId)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(1)
    // Und keine zweite Zustellung: die Outbox war nach dem ersten Lauf leer.
    expect(delivered).toBe(1)
    expect(repository.getLead(first.leadId).status).toBe('DELIVERED')
  })

  it('meldet 409 statt still zu ueberschreiben, wenn derselbe Key eine andere Bestellung traegt', async () => {
    const { service } = harness()
    await submit(service, order(), 'conflict-key')
    await expect(submit(service, order({ quantity: 3 }), 'conflict-key')).rejects.toBeInstanceOf(
      IdempotencyConflictError,
    )
  })

  it('leitet die Vorgangsnummer deterministisch aus dem Idempotency-Key ab', async () => {
    const { service, repository } = harness()
    const result = await submit(service, order(), 'reference-key')
    const reference = repository.getLead(result.leadId).context.reference
    expect(reference).toMatch(/^PDX-[0-9A-F]{8}$/)
    expect(result.orderReference).toBe(reference)
    // Ein Replay nennt dieselbe Nummer.
    expect(orderReference('reference-key')).toBe(reference)
    expect(orderReference('anderer-key')).not.toBe(reference)
  })

  it('verlangt einen Idempotency-Key und verwirft den Honeypot still', async () => {
    const { service, db } = harness()
    await expect(service.submit({ body: order(), idempotencyKey: '' })).rejects.toMatchObject({
      code: 'IDEMPOTENCY_KEY_REQUIRED',
    })
    expect(await submit(service, order({ _hp: 'bot' }), 'hp')).toEqual({ ignored: true })
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(0)
  })

  it('haelt einen Worker-Replay von einem zweiten Versand fern', async () => {
    let delivered = 0
    const { service, worker, repository } = harness({
      deliver: async () => {
        delivered += 1
        return { status: 'DELIVERED' }
      },
    })
    const result = await submit(service, order(), 'worker-replay')
    // Weitere Worker-Laeufe finden nichts mehr zu tun.
    expect(await worker.processNext()).toBeNull()
    expect(await worker.processNext()).toBeNull()
    expect(delivered).toBe(1)
    expect(repository.getLead(result.leadId).status).toBe('DELIVERED')
  })
})

describe('AP21 PT21.5 — Provider-Wahrheit', () => {
  it('verliert die Bestellung bei transientem Providerfehler nicht und stellt beim Retry zu', async () => {
    let attempts = 0
    const { service, worker, repository } = harness({
      deliver: async () => {
        attempts += 1
        if (attempts === 1) {
          throw Object.assign(new Error('temporary'), {
            code: 'SENDGRID_TEMPORARY',
            retryable: true,
          })
        }
        return { status: 'DELIVERED' }
      },
    })
    const result = await submit(service, order(), 'transient')
    // Nach dem ersten Fehlschlag ist die Bestellanfrage weiterhin persistiert.
    let lead = repository.getLead(result.leadId)
    expect(lead.status).toBe('RETRY_PENDING')
    expect(result.deliveryPending).toBe(true)

    await worker.processNext()
    lead = repository.getLead(result.leadId)
    expect(lead.status).toBe('DELIVERED')
    expect(attempts).toBe(2)
  })

  it('spielt ein UNBEKANNTES Providerergebnis nicht blind nach', async () => {
    const { service, repository } = harness({
      deliver: async () => {
        throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })
      },
    })
    const result = await submit(service, order(), 'unknown-result')
    const lead = repository.getLead(result.leadId)
    // Ein Timeout heisst NICHT "nicht zugestellt": das Ergebnis ist unbekannt
    // und wird als solches markiert, statt eine zweite Mail zu riskieren.
    expect(lead.lastErrorClass).toBe('PROVIDER_RESULT_UNKNOWN')
    // PT22.2: unbekanntes Providerergebnis ist kein Fehlschlag — der Vorgang
    // braucht Klaerung und wird weiterhin NICHT automatisch nachgesendet.
    expect(lead.status).toBe('RECONCILIATION_REQUIRED')
  })

  it('behauptet ohne konfigurierten Provider keinen Erfolg', async () => {
    const { service, repository } = harness()
    const result = await submit(service, order(), 'no-provider')
    expect(result.accepted).toBe(true)
    expect(result.providerConfigured).toBe(false)
    const lead = repository.getLead(result.leadId)
    expect(lead.lastErrorClass).toBe('NO_PROVIDER_CONFIGURED')
    // Die Bestellanfrage selbst ist trotzdem dauerhaft gespeichert.
    expect(lead.subject.email).toBe('mila@example.com')
  })

  it('sagt im Status nie "gekauft"', async () => {
    const { service } = harness({ deliver: async () => ({ status: 'DELIVERED' }) })
    const result = await submit(service, order(), 'truth')
    expect(Object.keys(result)).not.toContain('purchased')
    expect(JSON.stringify(result)).not.toMatch(/purchase|paid|confirmed_order/i)
  })
})

describe('AP21 PT21.5 — Zustellung', () => {
  it('schickt Team- und Bestaetigungsmail mit fest verdrahteten Empfaengern und x10-Copy', async () => {
    const sent = []
    const adapter = new SendGridConsumerOrderAdapter({
      send: async (msg) => {
        sent.push(msg)
      },
      sender: 'web@polarisdx.example',
    })
    const { service } = harness({ deliver: (delivery) => adapter.deliver(delivery) })
    await submit(service, order({ locale: 'cs', product: 'duo', variant: 'set' }), 'mail')

    expect(sent).toHaveLength(2)
    const [team, confirmation] = sent
    expect(team.to).toContain('contact@polarisdx.net')
    expect(team.to).not.toContain('mila@example.com')
    expect(confirmation.to).toBe('mila@example.com')
    // Die Bestaetigung ist in der Sprache der Bestellung, nicht auf Englisch.
    expect(confirmation.subject).toContain('objednávkovou poptávku')
    expect(confirmation.html).toContain('lang="cs"')
    // Und sie behauptet keinen Kauf.
    expect(confirmation.text).toContain('nikoli kupní smlouva ani platba')
    // Die Vorgangsnummer steht in beiden Mails.
    expect(confirmation.subject).toMatch(/PDX-[0-9A-F]{8}/)
    expect(team.subject).toMatch(/PDX-[0-9A-F]{8}/)
  })

  it('klassifiziert 5xx als retryfaehig und 4xx als terminal', async () => {
    const fail = (statusCode) =>
      new SendGridConsumerOrderAdapter({
        send: async () => {
          throw Object.assign(new Error('sendgrid'), { response: { statusCode } })
        },
        sender: 'web@polarisdx.example',
      }).deliver({ lead: { subject: { email: 'ada@example.com' }, context: { locale: 'de' } } })

    await expect(fail(503)).rejects.toMatchObject({ retryable: true })
    await expect(fail(400)).rejects.not.toMatchObject({ retryable: true })
  })
})

describe('AP21 PT21.5 — Fehlerklasse', () => {
  it('ist eine eigene Validierungsklasse mit Feldliste', async () => {
    const { service } = harness()
    await submit(service, order({ product: 'unbekannt' })).catch((error) => {
      expect(error).toBeInstanceOf(ConsumerOrderValidationError)
      expect(error.fields).toEqual(['product'])
    })
  })
})
