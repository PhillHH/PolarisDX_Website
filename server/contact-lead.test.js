// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
  IdempotencyConflictError,
} = require('./lead-foundation')
const {
  ContactValidationError,
  SendGridTeamMailAdapter,
  createContactLeadService,
} = require('./contact-lead')

/**
 * AP20 PT20.2 — die allgemeine Anfrage als eigene, persistente,
 * CRM-gebundene, retryfaehige und idempotente Lead-Journey.
 */

const BASE_BODY = Object.freeze({
  name: 'Dr. Ada Beispiel',
  email: 'ada@praxis.example',
  company: 'Praxis Nord',
  phone: '+49 151 000000',
  area: 'Dental',
  intent: 'quote',
  field: 'dental',
  locale: 'de',
  message: 'Bitte um Angebot fuer ein POC-Panel.',
  source: 'homepage',
  journey: 'general_sales',
  section: 'hero',
  campaign: 'relaunch-2026',
  originRoute: '/de/contact',
  processingConsent: true,
  consentAcceptedAt: '2026-09-02T10:00:00.000Z',
})

describe('AP20 PT20.2 contact journey', () => {
  let db
  let repository
  let sent
  let send

  const mailerFor = (impl) => (msg) => {
    sent.push(msg)
    return impl ? impl(msg) : Promise.resolve([{ statusCode: 202, headers: {} }, {}])
  }

  const setup = ({ mailer, retryDelayMs = 0 } = {}) => {
    db = openLeadDatabase({ filename: ':memory:' })
    repository = new LeadRepository(db)
    send = mailerFor(mailer)
    const router = new CrmRouter({
      adapters: {
        'general-sales': new SendGridTeamMailAdapter({
          send,
          recipient: 'team@polarisdx.example',
          sender: 'web@polarisdx.example',
          sprayRecipient: 'spray@example.test',
        }),
      },
    })
    const worker = new LeadHandoffWorker({
      repository,
      router,
      workerId: 'contact-test',
      retryDelayMs,
    })
    const service = createContactLeadService({ repository, worker })
    return service
  }

  const eventsFor = (leadId) =>
    db
      .prepare('SELECT event_type FROM lead_events WHERE lead_id = ? ORDER BY rowid')
      .all(leadId)
      .map((row) => row.event_type)

  beforeEach(() => {
    sent = []
  })

  it('persistiert einen gueltigen Lead bevor der Handoff laeuft (202-State)', async () => {
    const service = setup()
    const state = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-1' })

    expect(state.accepted).toBe(true)
    expect(state.journey).toBe('contact')
    expect(state.status).toBe('DELIVERED')
    expect(state.providerConfigured).toBe(true)

    const lead = repository.getLead(state.leadId)
    expect(lead.journey).toBe('contact')
    expect(lead.subject.name).toBe('Dr. Ada Beispiel')
    expect(lead.subject.email).toBe('ada@praxis.example')
    // Persist-before-Handoff: die Ereigniskette zeigt Commit vor Versuch.
    expect(eventsFor(lead.id)).toEqual([
      'LEAD_RECEIVED',
      'LEAD_VALIDATED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
      'HANDOFF_ATTEMPT',
      'HANDOFF_DELIVERED',
    ])
    expect(sent).toHaveLength(1)
    expect(sent[0].to).toBe('team@polarisdx.example')
    expect(String(sent[0].subject)).toContain('Dr. Ada Beispiel')
  })

  it('verlangt Processing-Consent; Marketing ist optional und getrennt', async () => {
    const service = setup()
    await expect(
      service.submit({
        body: { ...BASE_BODY, processingConsent: false },
        idempotencyKey: 'k-2',
      }),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })

    const denied = await service.submit({
      body: { ...BASE_BODY, marketingConsent: false },
      idempotencyKey: 'k-3',
    })
    expect(repository.getLead(denied.leadId).consent.marketing).toBe('DENIED')

    const granted = await service.submit({
      body: { ...BASE_BODY, marketingConsent: true },
      idempotencyKey: 'k-4',
    })
    expect(repository.getLead(granted.leadId).consent.marketing).toBe('GRANTED')
    expect(repository.getLead(granted.leadId).consent.processingAccepted).toBe(true)
  })

  it('validiert serverseitig autoritativ und minimiert die Antwort auf Felder', async () => {
    const service = setup()
    const attempt = (overrides) =>
      service.submit({ body: { ...BASE_BODY, ...overrides }, idempotencyKey: 'k-5' })

    await expect(attempt({ name: 'A' })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fields: ['name'],
    })
    await expect(attempt({ email: 'keine-mail' })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fields: ['email'],
    })
    await expect(attempt({ message: '' })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fields: ['message'],
    })
    await expect(attempt({ locale: 'xx' })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fields: ['locale'],
    })
    await expect(attempt({ intent: 'hacked' })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fields: ['intent'],
    })
    await expect(service.submit({ body: BASE_BODY, idempotencyKey: '' })).rejects.toMatchObject({
      code: 'IDEMPOTENCY_KEY_REQUIRED',
    })
  })

  it('dedupliziert denselben Idempotency-Key und wirft bei abweichendem Payload 409', async () => {
    const service = setup()
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-6' })
    const replay = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-6' })
    expect(replay.leadId).toBe(first.leadId)
    expect(replay.status).toBe('DELIVERED')
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(1)
    expect(sent).toHaveLength(1)

    await expect(
      service.submit({ body: { ...BASE_BODY, message: 'Anderer Text' }, idempotencyKey: 'k-6' }),
    ).rejects.toBeInstanceOf(IdempotencyConflictError)
  })

  it('honoriert den Honeypot still — kein Lead, keine Mail, 200-Fassade', async () => {
    const service = setup()
    const result = await service.submit({
      body: { ...BASE_BODY, _hp: 'bot' },
      idempotencyKey: 'k-7',
    })
    expect(result.ignored).toBe(true)
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(0)
    expect(sent).toHaveLength(0)
  })

  it('persistiert Sprache und Attribution allowlisted (fremde Herkunft faellt auf leer)', async () => {
    const service = setup()
    const state = await service.submit({
      body: {
        ...BASE_BODY,
        source: 'evil',
        journey: 'consumer',
        section: '<script>',
      },
      idempotencyKey: 'k-8',
    })
    const context = repository.getLead(state.leadId).context
    expect(context.locale).toBe('de')
    expect(context.source).toBe('')
    expect(context.journey).toBe('')
    expect(context.campaign).toBe('relaunch-2026')
    expect(context.originRoute).toBe('/de/contact')

    const clean = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-9' })
    const cleanContext = repository.getLead(clean.leadId).context
    expect(cleanContext.source).toBe('homepage')
    expect(cleanContext.journey).toBe('general_sales')
    expect(cleanContext.section).toBe('hero')
  })

  it('haelt temporaere Providerfehler retryfaehig fest — kein Leadverlust', async () => {
    let calls = 0
    const service = setup({
      mailer: () => {
        calls += 1
        if (calls === 1) {
          const error = new Error('sendgrid down')
          error.code = 'SENDGRID_TEMPORARY'
          error.retryable = true
          return Promise.reject(error)
        }
        return Promise.resolve([{ statusCode: 202, headers: {} }, {}])
      },
    })
    const state = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-10' })
    expect(state.status).toBe('RETRY_PENDING')
    expect(state.deliveryPending).toBe(true)

    const leadBefore = repository.getLead(state.leadId)
    expect(leadBefore.lastErrorClass).toBe('SENDGRID_TEMPORARY')

    await service.processNext()
    const leadAfter = repository.getLead(state.leadId)
    expect(leadAfter.status).toBe('DELIVERED')
    expect(sent).toHaveLength(2)
  })

  it('sagt ohne konfigurierten Provider ehrlich NO_PROVIDER_CONFIGURED — kein Fake-SENT', async () => {
    db = openLeadDatabase({ filename: ':memory:' })
    repository = new LeadRepository(db)
    const service = createContactLeadService({
      repository,
      worker: new LeadHandoffWorker({
        repository,
        router: new CrmRouter(),
        workerId: 'contact-noprov',
        retryDelayMs: 0,
      }),
    })
    const state = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-11' })
    expect(state.providerConfigured).toBe(false)
    expect(state.status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(state.leadId).lastErrorClass).toBe('NO_PROVIDER_CONFIGURED')
  })

  it('waehlt den Empfaenger NIE aus einem Formularfeld', async () => {
    // Bis PT22.4 schaltete der Adapter auf eine andere Zieladresse um, sobald
    // `area` einen bestimmten deutschen Bestelltext enthielt. Der Empfaenger
    // einer echten Bestellung hing damit an einem Freitext aus dem Client:
    // wer ihn uebersetzte, schickte die Bestellung an den allgemeinen
    // Vertrieb; wer ihn kannte, konnte ihn fuer jede Anfrage setzen.
    //
    // Praxisbestellungen haben seit PT22.5 die eigene Journey
    // `practice_order` mit eigenem CRM-Ziel. `contact` hat genau EINEN
    // Empfaenger — was immer im Formular steht.
    const service = setup()
    for (const [index, area] of [
      'Vitamin D3+K2 Spray BESTELLUNG',
      'BESTELLUNG',
      'ulrike@polarisdx.example',
      'beliebiger Freitext',
    ].entries()) {
      await service.submit({ body: { ...BASE_BODY, area }, idempotencyKey: `k-12-${index}` })
    }
    expect(sent).toHaveLength(4)
    expect(new Set(sent.map((message) => message.to))).toEqual(new Set(['team@polarisdx.example']))
  })

  it('multiplexed keinen Sonderjourney-Typ — freie Parameter werden ignoriert, Journey bleibt contact', async () => {
    const service = setup()
    const state = await service.submit({
      body: { ...BASE_BODY, type: 'consumer', journeyType: 'epigenetics' },
      idempotencyKey: 'k-13',
    })
    const lead = repository.getLead(state.leadId)
    expect(lead.journey).toBe('contact')
    expect(JSON.stringify(lead.context)).not.toContain('consumer')
    expect(JSON.stringify(lead.subject)).not.toContain('epigenetics')
  })
})
