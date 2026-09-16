// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.3 — die zentrale CRM-Zustellgrenze.
 *
 * Geprueft wird, dass es genau EINEN Weg zum Provider gibt und dass jedes
 * Ergebnis wahrheitsgemaess abgelegt wird. Die beiden Faelle, die vorher
 * falsch liefen, stehen im Mittelpunkt: der Trockenlauf, der als Zustellung
 * gezaehlt wurde, und der fehlende Timeout.
 */

const require = createRequire(import.meta.url)
const {
  CRM_DELIVERY_TIMEOUT_MS,
  CrmRouter,
  DELIVERY_RESULTS,
  LEAD_JOURNEYS,
  LeadHandoffWorker,
  LeadRepository,
  NON_DELIVERY_RESULTS,
  classifyProviderError,
  crmLogFields,
  deliveryKeyFor,
  normalizeResult,
  openLeadDatabase,
  withDeliveryGuards,
} = require('./lead-foundation')

const consent = {
  processingAccepted: true,
  acceptedAt: '2026-09-09T08:00:00.000Z',
  version: 'v',
  marketing: 'DENIED',
}

const stack = ({ adapters = {}, dryRun = false, timeoutMs, logger } = {}) => {
  const db = openLeadDatabase({ filename: ':memory:' })
  const repository = new LeadRepository(db)
  const router = new CrmRouter({ adapters, dryRun, ...(timeoutMs ? { timeoutMs } : {}) })
  const worker = new LeadHandoffWorker({
    repository,
    router,
    workerId: 'pt223',
    retryDelayMs: 0,
    ...(logger ? { logger } : {}),
  })
  return { db, repository, router, worker }
}

const seed = (repository, journey = 'contact', key = 'k') =>
  repository.createLead({
    journey,
    idempotencyKey: key,
    subject: { name: 'Dr. Ada Beispiel', email: 'ada@praxis.example', message: 'Angebot?' },
    context: { locale: 'de' },
    consent,
    channels: ['CRM'],
  })

describe('PT22.3 · 7/7 Routing ohne freie Zielwahl', () => {
  it('loest jede der sieben Journeys auf ein eigenes Ziel auf', () => {
    const router = new CrmRouter()
    const targets = LEAD_JOURNEYS.map((journey) => router.resolve({ journey }).target)
    expect(targets).toHaveLength(7)
    // Jede Journey hat ihr eigenes Ziel — kein stilles Multiplexing.
    expect(new Set(targets).size).toBe(7)
    expect(router.describeTargets().map((row) => row.journey)).toEqual(LEAD_JOURNEYS)
  })

  it('nimmt das Ziel NUR aus der Journey des Leads, nie aus dem Request', () => {
    const router = new CrmRouter()
    // Alles, was ein Absender mitschicken koennte, wird ignoriert.
    const resolved = router.resolve({
      journey: 'support',
      target: 'general-sales',
      crmTarget: 'general-sales',
      to: 'angreifer@example.com',
      context: { target: 'consumer' },
    })
    expect(resolved.target).toBe('support')
    // Eine unbekannte Journey wird abgelehnt, nicht geraten.
    expect(() => router.resolve({ journey: 'chat' })).toThrow(/not configured/u)
  })

  it('weist einen Adapter fuer ein Ziel zurueck, das keine Journey ansteuert', () => {
    // Ein solcher Adapter waere ein stiller Nebenweg neben dem Router.
    expect(
      () => new CrmRouter({ adapters: { 'schatten-ziel': { deliver: async () => ({}) } } }),
    ).toThrow(/unknown target/u)
  })
})

describe('PT22.3 · Providerzustaende sind wahrheitsgemaess', () => {
  it('meldet Erfolg nur bei echtem, bestaetigtem Erfolg', async () => {
    const { repository, worker } = stack({
      adapters: { 'general-sales': { deliver: async () => ({ status: 'DELIVERED' }) } },
    })
    const lead = seed(repository)
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('DELIVERED')
    expect(after.deliveredAt).toBeTruthy()
  })

  it('DRY_RUN ruft den Provider NICHT auf und gilt niemals als Zustellung', async () => {
    // Genau der Fall, der vorher als DELIVERED mit Zeitstempel endete.
    let called = false
    const { repository, worker } = stack({
      dryRun: true,
      adapters: {
        'general-sales': {
          deliver: async () => {
            called = true
            return { status: 'DELIVERED' }
          },
        },
      },
    })
    const lead = seed(repository)
    await worker.processNext()
    const after = repository.getLead(lead.id)

    expect(called, 'der Provider wurde nicht kontaktiert').toBe(false)
    expect(after.status).not.toBe('DELIVERED')
    expect(after.deliveredAt).toBeNull()
    expect(after.lastErrorClass).toBe('DRY_RUN')
    // Und es wird nichts automatisch nachgeholt.
    expect(await worker.processNext()).toBeNull()
  })

  it('liest den Trockenlauf aus der Umgebung, wenn niemand ihn durchreicht', () => {
    const previous = process.env.DRY_RUN
    process.env.DRY_RUN = '1'
    try {
      // Der Schutz darf nicht davon abhaengen, dass ein Aufrufer daran denkt.
      expect(new CrmRouter().dryRun).toBe(true)
    } finally {
      if (previous === undefined) delete process.env.DRY_RUN
      else process.env.DRY_RUN = previous
    }
    expect(new CrmRouter().dryRun).toBe(false)
  })

  it('meldet ohne konfigurierten Adapter ehrlich NO_PROVIDER_CONFIGURED', async () => {
    const { repository, worker } = stack()
    const lead = seed(repository)
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).not.toBe('DELIVERED')
    expect(after.lastErrorClass).toBe('NO_PROVIDER_CONFIGURED')
    expect(after.deliveredAt).toBeNull()
  })

  it('haelt fest, dass KEIN Nicht-Zustellergebnis als Erfolg zaehlt', () => {
    expect(NON_DELIVERY_RESULTS).not.toContain(DELIVERY_RESULTS.DELIVERED)
    expect(NON_DELIVERY_RESULTS).toContain(DELIVERY_RESULTS.DRY_RUN)
    expect(NON_DELIVERY_RESULTS).toContain(DELIVERY_RESULTS.NO_PROVIDER_CONFIGURED)
    expect(NON_DELIVERY_RESULTS).toContain(DELIVERY_RESULTS.UNKNOWN_RESULT)
    // Alle Ergebnisse ausser DELIVERED sind erfasst.
    expect(NON_DELIVERY_RESULTS.length).toBe(Object.keys(DELIVERY_RESULTS).length - 1)
  })

  it('behandelt ein unbekanntes Adapterergebnis als terminal, nicht als Erfolg', async () => {
    const { repository, worker } = stack({
      adapters: { 'general-sales': { deliver: async () => ({ status: 'VIELLEICHT' }) } },
    })
    const lead = seed(repository)
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).not.toBe('DELIVERED')
    expect(after.lastErrorClass).toBe('UNCLASSIFIED_PROVIDER_RESULT')
    expect(normalizeResult({ status: 'VIELLEICHT' }).status).toBe(DELIVERY_RESULTS.TERMINAL_ERROR)
  })
})

describe('PT22.3 · Timeout und Fehlerklassifikation', () => {
  it('bricht einen haengenden Provider nach dem Timeout ab', async () => {
    const guarded = withDeliveryGuards({ deliver: () => new Promise(() => {}) }, { timeoutMs: 40 })
    const started = Date.now()
    const result = await guarded.deliver({})
    expect(Date.now() - started).toBeLessThan(2_000)
    // Ein Timeout ist kein Fehlschlag: offen, ob die Nachricht ankam.
    expect(result.status).toBe(DELIVERY_RESULTS.UNKNOWN_RESULT)
    expect(result.errorClass).toBe('PROVIDER_RESULT_UNKNOWN')
  })

  it('legt einen Timeout als klaerungsbeduerftig ab und wiederholt ihn NICHT', async () => {
    let calls = 0
    const { repository, worker } = stack({
      timeoutMs: 30,
      adapters: {
        'general-sales': {
          deliver: () => {
            calls += 1
            return new Promise(() => {})
          },
        },
      },
    })
    const lead = seed(repository)
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('RECONCILIATION_REQUIRED')
    expect(after.reconciliationReason).toBe('PROVIDER_RESULT_UNKNOWN')
    expect(await worker.processNext()).toBeNull()
    expect(calls, 'kein zweiter Versuch bei unbekanntem Ergebnis').toBe(1)
    // Und der Vorgang ist auffindbar.
    expect(repository.findReconciliationRequired().map((row) => row.id)).toEqual([lead.id])
  })

  it('unterscheidet wiederholbar, terminal und unbekannt', () => {
    expect(
      classifyProviderError(
        Object.assign(new Error('x'), { code: 'SENDGRID_5XX', retryable: true }),
      ).status,
    ).toBe(DELIVERY_RESULTS.RETRYABLE_ERROR)
    expect(
      classifyProviderError(Object.assign(new Error('x'), { code: 'BAD_REQUEST' })).status,
    ).toBe(DELIVERY_RESULTS.TERMINAL_ERROR)
    for (const code of ['ETIMEDOUT', 'ECONNRESET', 'EPIPE', 'ECONNABORTED']) {
      const result = classifyProviderError(Object.assign(new Error('x'), { code }))
      expect(result.status, code).toBe(DELIVERY_RESULTS.UNKNOWN_RESULT)
      expect(result.errorClass, code).toBe('PROVIDER_RESULT_UNKNOWN')
    }
    // Ein Providertext wird nie zur Fehlerklasse.
    expect(classifyProviderError(new Error('Unauthorized: key sg.abc123')).errorClass).toBe(
      'UNCLASSIFIED_PROVIDER_ERROR',
    )
  })

  it('wiederholt einen echten wiederholbaren Fehler und stellt danach zu', async () => {
    let attempts = 0
    const { repository, worker } = stack({
      adapters: {
        'general-sales': {
          deliver: async () => {
            attempts += 1
            if (attempts === 1) {
              throw Object.assign(new Error('temporary'), { code: 'SENDGRID_5XX', retryable: true })
            }
            return { status: 'DELIVERED' }
          },
        },
      },
    })
    const lead = seed(repository)
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
    expect(attempts).toBe(2)
  })

  it('hat einen ausdruecklichen Standard-Timeout', () => {
    expect(CRM_DELIVERY_TIMEOUT_MS).toBeGreaterThan(0)
    expect(CRM_DELIVERY_TIMEOUT_MS).toBeLessThanOrEqual(30_000)
    expect(new CrmRouter().timeoutMs).toBe(CRM_DELIVERY_TIMEOUT_MS)
  })
})

describe('PT22.3 · Zustellschluessel', () => {
  it('ist ueber alle Wiederholungen desselben Vorgangs stabil', async () => {
    const keys = []
    const { repository, worker } = stack({
      adapters: {
        'general-sales': {
          deliver: async ({ deliveryKey }) => {
            keys.push(deliveryKey)
            throw Object.assign(new Error('t'), { code: 'SENDGRID_5XX', retryable: true })
          },
        },
      },
    })
    const lead = seed(repository)
    await worker.processNext()
    await worker.processNext()
    expect(keys).toHaveLength(2)
    expect(keys[0]).toBe(keys[1])
    expect(keys[0]).toBe(deliveryKeyFor({ leadId: lead.id, channel: 'CRM' }))
  })

  it('unterscheidet Kanaele und verlangt beide Bestandteile', () => {
    expect(deliveryKeyFor({ leadId: 'L1', channel: 'CRM' })).toBe('L1:crm')
    expect(deliveryKeyFor({ leadId: 'L1', channel: 'MAIL' })).not.toBe(
      deliveryKeyFor({ leadId: 'L1', channel: 'CRM' }),
    )
    expect(() => deliveryKeyFor({ leadId: 'L1' })).toThrow(/requires/u)
  })
})

describe('PT22.3 · Logging und Geheimnisse', () => {
  it('schreibt nur allowlistete Felder — kein Empfaenger, kein Betreff, kein Body', () => {
    const fields = crmLogFields({
      leadId: 'L1',
      journey: 'support',
      target: 'support',
      attempt: 2,
      errorClass: 'DRY_RUN',
      deliveryKey: 'L1:crm',
      // Alles Folgende ist nicht in der Allowlist und darf nicht erscheinen.
      to: 'kundin@example.com',
      subject: 'Support-Anfrage von Dr. Ada Beispiel',
      apiKey: 'SG.geheim',
      body: 'voller Formularinhalt',
    })
    expect(Object.keys(fields).sort()).toEqual([
      'attempt',
      'deliveryChannel',
      'errorClass',
      'journey',
      'leadId',
      'target',
    ])
    const serialized = JSON.stringify(fields)
    for (const forbidden of ['kundin@example.com', 'Ada Beispiel', 'SG.geheim', 'Formularinhalt']) {
      expect(serialized, forbidden).not.toContain(forbidden)
    }
  })

  it('spiegelt eine unbekannte Journey oder ein fremdes Ziel nicht ins Log', () => {
    const fields = crmLogFields({
      leadId: 'L1',
      journey: '<script>alert(1)</script>',
      target: '../../etc/passwd',
      errorClass: 'Unauthorized: SG.abc',
    })
    expect(fields.journey).toBe('unknown')
    expect(fields.target).toBe('unknown')
    expect(fields.errorClass).toBeUndefined()
  })

  it('protokolliert einen echten Zustellversuch ohne PII', async () => {
    const entries = []
    const logger = {
      info: (event, fields) => entries.push({ event, fields }),
      warn: (event, fields) => entries.push({ event, fields }),
    }
    const { repository, worker } = stack({ logger })
    seed(repository)
    await worker.processNext()
    expect(entries.length).toBeGreaterThan(0)
    const serialized = JSON.stringify(entries)
    for (const forbidden of ['ada@praxis.example', 'Ada Beispiel', 'Angebot?']) {
      expect(serialized, forbidden).not.toContain(forbidden)
    }
  })

  it('haelt keine Geheimnisse im Quelltext der CRM-Grenze', () => {
    for (const file of [
      'lead-foundation/crm.js',
      'lead-foundation/crm-delivery.js',
      'lead-foundation/worker.js',
    ]) {
      const source = readFileSync(`server/${file}`, 'utf8')
      // Weder ein SendGrid-Schluessel noch ein hartkodierter Empfaenger.
      expect(source, `${file}: SendGrid-Schluessel`).not.toMatch(/SG\.[A-Za-z0-9_-]{10,}/u)
      expect(source, `${file}: Mailadresse`).not.toMatch(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}/iu)
    }
  })

  it('haelt die PII-freie Trockenlauf-Meldung im Server', () => {
    const server = readFileSync('server/server.js', 'utf8')
    // Die alte Zeile schrieb Empfaenger und Betreff ins Log.
    expect(server).not.toContain('email suppressed → to=')
    expect(server).toContain('[DRY_RUN] outbound email suppressed')
  })
})
