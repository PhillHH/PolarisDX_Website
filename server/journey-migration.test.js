// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.5 — die fünf Journeys auf dem gemeinsamen Vertrag.
 *
 * Zwei davon waren vorher gar nicht auf der Foundation: `roi_report` war ein
 * reiner Mailendpunkt ohne Persistenz, und `practice_order` existierte nicht
 * als Journey — eine Praxisbestellung lief durch `/api/contact` und wurde
 * dort an einem Magic String erkannt, der ueber den Mailempfaenger entschied.
 */

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  JOURNEY_FOUNDATION_STATES,
  JOURNEY_REGISTRY,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')
const {
  PRACTICE_PRODUCTS,
  PracticeOrderValidationError,
  createPracticeOrderService,
  orderReference,
} = require('./practice-order')
const {
  REPORT_AREAS,
  RoiReportValidationError,
  createRoiReportService,
  reportReference,
} = require('./roi-report')

const MIGRATED = ['contact', 'support', 'consumer_order', 'roi_report', 'practice_order']

const consent = {
  processingConsent: true,
  consentAcceptedAt: '2026-09-09T08:00:00.000Z',
}

const stack = (createService, { deliver, target, journey } = {}) => {
  const db = openLeadDatabase({ filename: ':memory:' })
  const repository = new LeadRepository(db)
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters: deliver ? { [target]: { deliver } } : {} }),
    workerId: 'pt225',
    journeys: [journey],
    retryDelayMs: 0,
  })
  return { db, repository, worker, service: createService({ repository, worker }) }
}

const practiceBody = (overrides = {}) => ({
  product: 'vitamin-d3-k2-spray',
  quantity: 24,
  organization: 'Zahnarztpraxis Nord',
  name: 'Dr. Ada Beispiel',
  email: 'Ada@Praxis.example',
  phone: '+49 30 1234',
  street: 'Musterweg 1',
  postcode: '10115',
  city: 'Berlin',
  message: 'Bitte um Rueckruf.',
  locale: 'de',
  ...consent,
  ...overrides,
})

const roiBody = (overrides = {}) => ({
  email: 'Ada@Praxis.example',
  practice: 'Zahnarztpraxis Nord',
  area: 'implantology',
  locale: 'de',
  inputs: { testsPerMonth: '40', pricePerTest: '89', investment: 4990 },
  outputs: { dbPerMonth: 2400, revenuePerMonth: 3560, dbPerYear: 28800, dbPerTest: 60 },
  ...consent,
  ...overrides,
})

describe('PT22.5 · 5/5 auf dem gemeinsamen Vertrag', () => {
  it('fuehrt alle fuenf als ON_FOUNDATION mit echtem Slice auf Platte', () => {
    for (const id of MIGRATED) {
      const entry = JOURNEY_REGISTRY.find((journey) => journey.id === id)
      expect(entry, id).toBeTruthy()
      expect(entry.state, id).toBe(JOURNEY_FOUNDATION_STATES.ON_FOUNDATION)
      expect(entry.endpoint, id).toMatch(/^\/api\//u)
      const slice = readFileSync(entry.slice, 'utf8')
      expect(slice, `${id}: persistiert`).toContain('createLead')
      expect(slice, `${id}: Consent-Nachweis`).toContain('INVALID_CONSENT_EVIDENCE')
      expect(slice, `${id}: Idempotency-Key`).toContain('IDEMPOTENCY_KEY_REQUIRED')
      expect(slice, `${id}: Honeypot`).toContain('_hp')
      expect(slice, `${id}: eigene Journey-Zustaendigkeit`).toContain('journeys: [JOURNEY]')
    }
  })

  it('montiert jeden der fuenf Endpunkte hinter dem Rate Limiter', () => {
    const server = readFileSync('server/server.js', 'utf8')
    for (const id of MIGRATED) {
      const entry = JOURNEY_REGISTRY.find((journey) => journey.id === id)
      expect(server, `${id}: formLimiter`).toContain(`app.post('${entry.endpoint}', formLimiter,`)
    }
  })

  it('antwortet fuer alle ueber denselben Handler und dasselbe Envelope', () => {
    const server = readFileSync('server/server.js', 'utf8')
    // Genau ein Antwortweg — vorher hatte jeder Endpunkt seinen eigenen
    // try/catch, und `roi_report` antwortete sogar `{ success }` statt
    // `{ accepted, code }`.
    for (const id of MIGRATED) {
      const entry = JOURNEY_REGISTRY.find((journey) => journey.id === id)
      const start = server.indexOf(`app.post('${entry.endpoint}'`)
      const block = server.slice(start, start + 600)
      expect(block, `${id}: handleJourney`).toContain('await handleJourney({')
      expect(block, `${id}: getypte Journey`).toContain(`journey: '${id}'`)
    }
    expect(server).toContain('successEnvelope(')
    expect(server).toContain('errorEnvelope(')
  })
})

describe('PT22.5 · practice_order — die getypte Praxisbestellung', () => {
  const build = (options) =>
    stack(createPracticeOrderService, {
      journey: 'practice_order',
      target: 'practice-sales',
      ...options,
    })

  it('persistiert vor dem Handoff, mit Bestellnummer und Kontext', async () => {
    const seen = []
    const { service, repository } = build({
      deliver: async ({ lead }) => {
        seen.push(lead.context.reference)
        return { status: 'DELIVERED' }
      },
    })
    const state = await service.submit({ body: practiceBody(), idempotencyKey: 'p1' })
    const lead = repository.getLead(state.leadId)

    expect(lead.journey).toBe('practice_order')
    expect(lead.reference).toBe(orderReference('p1'))
    expect(lead.context.productId).toBe('vitamin-d3-k2-spray')
    expect(lead.context.quantity).toBe(24)
    expect(lead.context.orgType).toBe('praxis')
    expect(lead.subject.organization).toBe('Zahnarztpraxis Nord')
    expect(lead.subject.email).toBe('ada@praxis.example')
    expect(lead.consent.processingAccepted).toBe(true)
    expect(lead.consent.marketing).toBe('DENIED')
    expect(
      repository
        .getEvents(lead.id)
        .map((event) => event.eventType)
        .slice(0, 4),
    ).toEqual(['LEAD_RECEIVED', 'LEAD_VALIDATED', 'LEAD_PERSISTED', 'HANDOFF_PENDING'])
    expect(seen).toEqual([lead.reference])
  })

  it('allowlistet Produkt und Menge serverseitig', async () => {
    const { service } = build()
    for (const [body, code] of [
      [practiceBody({ product: 'igloo-pro' }), 'UNKNOWN_PRODUCT'],
      [practiceBody({ product: { evil: true } }), 'UNKNOWN_PRODUCT'],
      [practiceBody({ quantity: 13 }), 'INVALID_QUANTITY'],
      [practiceBody({ quantity: '24 Sprays' }), 'INVALID_QUANTITY'],
      [practiceBody({ quantity: 999999 }), 'INVALID_QUANTITY'],
      [practiceBody({ organization: '', name: 'A', email: 'kaputt' }), 'VALIDATION_FAILED'],
      [practiceBody({ locale: 'ru' }), 'VALIDATION_FAILED'],
      [practiceBody({ processingConsent: false }), 'PROCESSING_CONSENT_REQUIRED'],
      [practiceBody({ consentAcceptedAt: 'irgendwann' }), 'INVALID_CONSENT_EVIDENCE'],
    ]) {
      await expect(
        service.submit({ body, idempotencyKey: `bad-${code}-${Math.random()}` }),
        code,
      ).rejects.toMatchObject({ code })
    }
    // Die erlaubten Mengen stammen aus der freigegebenen Auswahl.
    expect(PRACTICE_PRODUCTS['vitamin-d3-k2-spray'].quantities).toEqual([12, 24, 36, 48, 100])
  })

  it('nimmt den Empfaenger NIE aus dem Formular', async () => {
    const sent = []
    const { service } = build({
      deliver: async ({ lead }) => {
        sent.push(lead)
        return { status: 'DELIVERED' }
      },
    })
    const state = await service.submit({
      body: practiceBody({ area: 'Vitamin D3+K2 Spray BESTELLUNG', to: 'angreifer@example.com' }),
      idempotencyKey: 'p-target',
    })
    expect(state.accepted).toBe(true)
    // Weder `area` noch `to` landen im Vorgang.
    expect(JSON.stringify(sent[0])).not.toContain('angreifer@example.com')
    expect(Object.keys(sent[0].subject)).not.toContain('area')
  })

  it('ist idempotent und meldet einen Konflikt', async () => {
    const { service, db } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const first = await service.submit({ body: practiceBody(), idempotencyKey: 'p-same' })
    const replay = await service.submit({ body: practiceBody(), idempotencyKey: 'p-same' })
    expect(replay.leadId).toBe(first.leadId)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(1)
    await expect(
      service.submit({ body: practiceBody({ quantity: 36 }), idempotencyKey: 'p-same' }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' })
  })

  it('verwirft den Honeypot still und behauptet ohne Provider keinen Erfolg', async () => {
    const { service, db } = build()
    expect(
      await service.submit({ body: practiceBody({ _hp: 'bot' }), idempotencyKey: 'p-hp' }),
    ).toEqual({
      ignored: true,
    })
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(0)

    const state = await service.submit({ body: practiceBody(), idempotencyKey: 'p-np' })
    expect(state.accepted).toBe(true)
    expect(state.providerConfigured).toBe(false)
  })

  it('wiederholt einen transienten Fehler und gibt danach ehrlich auf', async () => {
    let attempts = 0
    const { service, worker, repository } = build({
      deliver: async () => {
        attempts += 1
        if (attempts === 1) {
          throw Object.assign(new Error('t'), { code: 'SENDGRID_TEMPORARY', retryable: true })
        }
        return { status: 'DELIVERED' }
      },
    })
    const state = await service.submit({ body: practiceBody(), idempotencyKey: 'p-retry' })
    expect(repository.getLead(state.leadId).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(state.leadId).status).toBe('DELIVERED')
    expect(attempts).toBe(2)
  })

  it('funktioniert ohne Marketing-Einwilligung — und merkt sie sich, wenn erteilt', async () => {
    const { service, repository } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const denied = await service.submit({ body: practiceBody(), idempotencyKey: 'p-m0' })
    expect(repository.getLead(denied.leadId).consent.marketing).toBe('DENIED')
    const granted = await service.submit({
      body: practiceBody({ marketingConsent: true }),
      idempotencyKey: 'p-m1',
    })
    expect(repository.getLead(granted.leadId).consent.marketing).toBe('GRANTED')
  })
})

describe('PT22.5 · roi_report — Persistenz statt Mail-only', () => {
  const build = (options) =>
    stack(createRoiReportService, { journey: 'roi_report', target: 'reports', ...options })

  it('persistiert die Anfrage samt Rechenwerten vor dem Handoff', async () => {
    const { service, repository } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const state = await service.submit({ body: roiBody(), idempotencyKey: 'r1' })
    const lead = repository.getLead(state.leadId)

    expect(lead.journey).toBe('roi_report')
    expect(lead.reference).toBe(reportReference('r1'))
    expect(lead.context.reportArea).toBe('implantology')
    // Zeichenketten aus dem Formular werden zu Zahlen normalisiert.
    expect(lead.subject.inputs.testsPerMonth).toBe(40)
    expect(lead.subject.outputs.dbPerMonth).toBe(2400)
    expect(lead.subject.email).toBe('ada@praxis.example')
    expect(repository.getEvents(lead.id).map((event) => event.eventType)).toContain(
      'LEAD_PERSISTED',
    )
  })

  it('verwirft Werte, die keine brauchbaren Zahlen sind', async () => {
    const { service, repository } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const state = await service.submit({
      body: roiBody({
        inputs: { testsPerMonth: 'viele', pricePerTest: Infinity, investment: 1e12 },
        outputs: { dbPerMonth: null, revenuePerMonth: '3560', schadcode: '<script>' },
      }),
      idempotencyKey: 'r-clean',
    })
    const lead = repository.getLead(state.leadId)
    expect(lead.subject.inputs).toEqual({})
    expect(lead.subject.outputs).toEqual({ revenuePerMonth: 3560 })
    expect(JSON.stringify(lead.subject)).not.toContain('script')
  })

  it('allowlistet den Fachbereich und verlangt Consent', async () => {
    const { service } = build()
    await expect(
      service.submit({ body: roiBody({ area: 'esoterik' }), idempotencyKey: 'r-a' }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' })
    await expect(
      service.submit({ body: roiBody({ email: 'kaputt' }), idempotencyKey: 'r-b' }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' })
    await expect(
      service.submit({ body: roiBody({ processingConsent: false }), idempotencyKey: 'r-c' }),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })
    expect(REPORT_AREAS).toContain('implantology')
  })

  it('verliert die Anfrage NICHT, wenn die PDF-Erzeugung scheitert', async () => {
    // Der Kern der Migration: das PDF entsteht im Zustellversuch, nicht im
    // Request. Vorher beantwortete ein Fehler hier die Anfrage mit 500 und
    // der Vorgang war weg.
    let pdfCalls = 0
    const { service, worker, repository } = build({
      deliver: async () => {
        pdfCalls += 1
        if (pdfCalls === 1) {
          throw Object.assign(new Error('pdf'), { code: 'SENDGRID_TEMPORARY', retryable: true })
        }
        return { status: 'DELIVERED' }
      },
    })
    const state = await service.submit({ body: roiBody(), idempotencyKey: 'r-pdf' })
    // Die Anfrage steht, obwohl der erste Versuch scheiterte.
    expect(repository.getLead(state.leadId).status).toBe('RETRY_PENDING')
    expect(repository.getLead(state.leadId).subject.email).toBe('ada@praxis.example')
    await worker.processNext()
    expect(repository.getLead(state.leadId).status).toBe('DELIVERED')
  })

  it('behauptet ohne Provider keine Zustellung', async () => {
    const { service } = build()
    const state = await service.submit({ body: roiBody(), idempotencyKey: 'r-np' })
    expect(state.accepted).toBe(true)
    expect(state.providerConfigured).toBe(false)
    expect(state.status).not.toBe('DELIVERED')
  })

  it('ist idempotent', async () => {
    const { service, db } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const a = await service.submit({ body: roiBody(), idempotencyKey: 'r-same' })
    const b = await service.submit({ body: roiBody(), idempotencyKey: 'r-same' })
    expect(b.leadId).toBe(a.leadId)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(1)
  })
})

describe('PT22.5 · x10-Systemcopy und Fehlerklassen', () => {
  it('hat fuer beide neuen Journeys nutzerseitige Copy in allen zehn Sprachen', () => {
    const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
    const de = {
      roi: JSON.parse(readFileSync('public/locales/de/home.json', 'utf8')).roi.form,
      order: JSON.parse(readFileSync('public/locales/de/vitd3spray.json', 'utf8')).order,
    }
    for (const locale of locales) {
      const roi = JSON.parse(readFileSync(`public/locales/${locale}/home.json`, 'utf8')).roi.form
      const order = JSON.parse(
        readFileSync(`public/locales/${locale}/vitd3spray.json`, 'utf8'),
      ).order
      for (const key of ['submit', 'sending', 'success', 'error', 'error_retryable']) {
        expect(roi[key], `${locale}: roi.form.${key}`).toBeTruthy()
        if (locale !== 'de')
          expect(roi[key], `${locale}: roi.form.${key} DE-Kopie`).not.toBe(de.roi[key])
      }
      for (const key of ['success_title', 'success_text', 'error_text', 'error_retryable']) {
        expect(order[key], `${locale}: order.${key}`).toBeTruthy()
        if (locale !== 'de') {
          expect(order[key], `${locale}: order.${key} DE-Kopie`).not.toBe(de.order[key])
        }
      }
    }
  })

  it('wirft nur Codes, die der gemeinsame Fehlerkatalog kennt', () => {
    const { ERROR_CATALOG } = require('./lead-foundation')
    for (const slice of ['roi-report', 'practice-order']) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      for (const match of source.matchAll(/ValidationError\('([A-Z_]+)'/gu)) {
        expect(ERROR_CATALOG, `${slice}: ${match[1]}`).toHaveProperty(match[1])
      }
    }
    expect(new PracticeOrderValidationError('UNKNOWN_PRODUCT', ['product']).fields).toEqual([
      'product',
    ])
    expect(new RoiReportValidationError('VALIDATION_FAILED', ['email']).code).toBe(
      'VALIDATION_FAILED',
    )
  })
})

describe('PT22.5 · der Magic String ist weg', () => {
  it('routet contact nicht mehr ueber ein Formularfeld', () => {
    const contact = readFileSync('server/contact-lead.js', 'utf8')
    expect(contact).not.toContain('SPRAY_ORDER_MARKER')
    expect(contact).not.toContain('sprayRecipient')
    expect(contact).not.toContain('Vitamin D3+K2 Spray BESTELLUNG')
  })

  it('schickt die Praxisbestellung vom Client als typisierte Journey', () => {
    const form = readFileSync('src/components/sections/PraxisOrderForm.tsx', 'utf8')
    expect(form).toContain('sendPracticeOrder')
    expect(form).not.toContain('sendContactEmail')
    for (const page of ['VitaminD3SprayPage', 'VitaminD3ImplantologyPage']) {
      const source = readFileSync(`src/pages/${page}.tsx`, 'utf8')
      expect(source, `${page}: Produkt-ID`).toContain('product="vitamin-d3-k2-spray"')
      expect(source, `${page}: kein Freitext-Routing`).not.toContain(
        'area="Vitamin D3+K2 Spray BESTELLUNG"',
      )
    }
  })
})
