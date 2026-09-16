// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.4 — Warteschlange, Wiederholung und Endzustand.
 *
 * Die Leitfrage ist eine einzige: kann ein normaler Provider- oder
 * Mailfehler einen bereits gespeicherten Vorgang verlieren? Geprueft wird
 * deshalb nicht nur der Gutfall, sondern das Verhalten bei Absturz,
 * Neustart, Parallelbetrieb, abgelaufener Lease und unbekanntem Ergebnis.
 */

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  DEFAULT_RETRY_POLICY,
  LEAD_JOURNEYS,
  LeadDispatcher,
  LeadHandoffWorker,
  LeadRepository,
  nextAttemptDelayMs,
  normalizePolicy,
  openLeadDatabase,
  shouldRetry,
} = require('./lead-foundation')

const temps = []
const tempFile = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt224-'))
  temps.push(dir)
  return path.join(dir, 'leads.sqlite3')
}
afterEach(() => {
  while (temps.length) fs.rmSync(temps.pop(), { recursive: true, force: true })
})

const consent = {
  processingAccepted: true,
  acceptedAt: '2026-09-09T08:00:00.000Z',
  version: 'v',
  marketing: 'DENIED',
}

const seed = (repository, journey = 'contact', key = journey) =>
  repository.createLead({
    journey,
    idempotencyKey: key,
    subject: { name: 'Dr. Ada Beispiel', email: 'ada@praxis.example', message: 'Angebot?' },
    context: { locale: 'de' },
    consent,
    channels: ['CRM'],
  })

const workerFor = (
  repository,
  { deliver, journeys = ['contact'], target = 'general-sales', ...rest } = {},
) =>
  new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters: deliver ? { [target]: { deliver } } : {} }),
    workerId: rest.workerId ?? 'pt224',
    journeys,
    random: () => 0,
    ...rest,
  })

describe('PT22.4 · Worker-Zustaendigkeit', () => {
  it('uebernimmt keine Journey, die er nicht zustellen kann', async () => {
    // Der gemessene Defekt: ein Contact-Submit legte einen wartenden
    // Support-Vorgang terminal ab, weil sein Worker die fremde Journey griff
    // und dort keinen Adapter fand.
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const support = seed(repository, 'support')
    const contactWorker = workerFor(repository, {
      deliver: async () => ({ status: 'DELIVERED' }),
      journeys: ['contact'],
    })
    expect(await contactWorker.processNext()).toBeNull()
    expect(repository.getLead(support.id).status).toBe('QUEUED')
    expect(repository.getLead(support.id).lastErrorClass).toBeNull()
  })

  it('lehnt eine unbekannte Journey in der Zustaendigkeit ab', () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    expect(() => repository.claimNext({ workerId: 'w', journeys: ['chat'] })).toThrow(
      /unsupported/u,
    )
    // Leere Zustaendigkeit heisst "nichts uebernehmen", nicht "alles".
    expect(repository.claimNext({ workerId: 'w', journeys: [] })).toBeNull()
  })

  it('laesst einen zustaendigen Worker die Arbeit erledigen', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository, 'support')
    const worker = workerFor(repository, {
      deliver: async () => ({ status: 'DELIVERED' }),
      journeys: ['support'],
      target: 'support',
    })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
  })
})

describe('PT22.4 · Atomarer Claim und Lease', () => {
  it('gibt denselben Auftrag nicht zweimal aus', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    seed(repository)
    const first = repository.claimNext({ workerId: 'w1', journeys: ['contact'] })
    const second = repository.claimNext({ workerId: 'w2', journeys: ['contact'] })
    expect(first).toBeTruthy()
    expect(second, 'kein zweiter Zugriff auf denselben Auftrag').toBeNull()
    expect(first.claimedBy).toBe('w1')
  })

  it('arbeitet bei zwei parallelen Workern jeden Auftrag genau einmal ab', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    for (let i = 0; i < 6; i += 1) seed(repository, 'contact', `race-${i}`)
    const delivered = []
    const make = (id) =>
      workerFor(repository, {
        workerId: id,
        deliver: async ({ lead }) => {
          delivered.push(lead.id)
          return { status: 'DELIVERED' }
        },
      })
    const a = make('w-a')
    const b = make('w-b')
    // Abwechselnd und ueberlappend.
    await Promise.all([
      (async () => {
        for (let i = 0; i < 6; i += 1) await a.processNext()
      })(),
      (async () => {
        for (let i = 0; i < 6; i += 1) await b.processNext()
      })(),
    ])
    expect(delivered).toHaveLength(6)
    expect(new Set(delivered).size, 'kein Auftrag doppelt').toBe(6)
  })

  it('verliert einen Auftrag mit abgelaufener Lease nicht — und sendet ihn nicht blind nach', () => {
    // Der Absturzfall: ein Worker hat uebernommen und ist gestorben. Ob er die Mail
    // schon abgeschickt hatte, ist unbekannt. AP26 PT26.4: statt erneuter Zustellung
    // (vorher: nach 31 s mit Versuch 2 wieder uebernommen) geht der Vorgang in die
    // Klaerung und bleibt bewusst wiederholbar.
    let clock = Date.parse('2026-09-09T09:00:00.000Z')
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }), {
      clock: () => new Date(clock),
    })
    const lead = seed(repository)
    const claimed = repository.claimNext({ workerId: 'gestorben', journeys: ['contact'] })
    expect(claimed).toBeTruthy()
    // Solange die Lease laeuft, fasst niemand den Auftrag an.
    expect(repository.claimNext({ workerId: 'w2', journeys: ['contact'] })).toBeNull()
    clock += 31_000
    expect(repository.claimNext({ workerId: 'w2', journeys: ['contact'] })).toBeNull()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('RECONCILIATION_REQUIRED')
    expect(after.reconciliationReason).toBe('HANDOFF_LEASE_EXPIRED')
    expect(repository.findReconciliationRequired().map((row) => row.id)).toEqual([lead.id])
    // Der verschwundene Worker kann das Ergebnis nicht mehr ueberschreiben.
    repository.markDelivered(claimed)
    expect(repository.getLead(lead.id).status).toBe('RECONCILIATION_REQUIRED')
    // Bewusste Wiedervorlage bleibt moeglich; die Versuchszaehlung laeuft weiter.
    expect(
      repository.requeueForDelivery({ leadId: lead.id, actor: 'ops', reason: 'geprueft' }).requeued,
    ).toBe(true)
    const again = repository.claimNext({ workerId: 'w2', journeys: ['contact'] })
    expect(again.attempt).toBe(2)
  })
})

describe('PT22.4 · Wiederholung, Backoff und Endzustand', () => {
  it('waechst exponentiell und streut nur nach unten', () => {
    const plain = [1, 2, 3, 4, 5].map((attempt) =>
      nextAttemptDelayMs({ attempt, policy: { jitterRatio: 0 } }),
    )
    expect(plain).toEqual([1_000, 2_000, 4_000, 8_000, 16_000])
    // Deckel greift.
    expect(nextAttemptDelayMs({ attempt: 20, policy: { jitterRatio: 0 } })).toBe(
      DEFAULT_RETRY_POLICY.maxDelayMs,
    )
    // Streuung zieht ab, nie hinzu — die Obergrenze bleibt eine Obergrenze.
    for (const random of [0, 0.5, 0.999]) {
      const value = nextAttemptDelayMs({ attempt: 3, random: () => random })
      expect(value).toBeLessThanOrEqual(4_000)
      expect(value).toBeGreaterThanOrEqual(4_000 * (1 - DEFAULT_RETRY_POLICY.jitterRatio))
    }
  })

  it('weist eine unsinnige Politik zurueck, statt sie zu benutzen', () => {
    expect(() => normalizePolicy({ maxAttempts: 0 })).toThrow(/maxAttempts/u)
    expect(() => normalizePolicy({ baseDelayMs: -1 })).toThrow(/baseDelayMs/u)
    expect(() => normalizePolicy({ maxDelayMs: 10, baseDelayMs: 100 })).toThrow(/maxDelayMs/u)
    expect(() => normalizePolicy({ jitterRatio: 1 })).toThrow(/jitterRatio/u)
  })

  it('haelt an, sobald das Versuchsbudget erschoepft ist', () => {
    expect(shouldRetry({ retryable: true, attempt: 1 })).toBe(true)
    expect(shouldRetry({ retryable: true, attempt: 3 })).toBe(false)
    expect(shouldRetry({ retryable: false, attempt: 1 })).toBe(false)
  })

  it('voruebergehender Fehler → Wiederholung → Zustellung', async () => {
    let attempts = 0
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, {
      retryPolicy: { maxAttempts: 3, baseDelayMs: 0, jitterRatio: 0 },
      deliver: async () => {
        attempts += 1
        if (attempts < 3) {
          throw Object.assign(new Error('t'), { code: 'SENDGRID_5XX', retryable: true })
        }
        return { status: 'DELIVERED' }
      },
    })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
    expect(attempts).toBe(3)
  })

  it('endet nach dem letzten Versuch terminal — und der Vorgang bleibt erhalten', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, {
      retryPolicy: { maxAttempts: 2, baseDelayMs: 0, jitterRatio: 0 },
      deliver: async () => {
        throw Object.assign(new Error('t'), { code: 'SENDGRID_5XX', retryable: true })
      },
    })
    await worker.processNext()
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('FAILED_TERMINAL')
    expect(after.terminalAt).toBeTruthy()
    expect(after.attemptCount).toBe(2)
    // Nichts geht verloren: die Anfrage steht vollstaendig da.
    expect(after.subject.email).toBe('ada@praxis.example')
    // Und sie wird nicht weiter versucht.
    expect(await worker.processNext()).toBeNull()
  })

  it('ein nicht wiederholbarer Fehler wird sofort terminal', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, {
      deliver: async () => {
        throw Object.assign(new Error('bad'), { code: 'BAD_REQUEST' })
      },
    })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('FAILED_TERMINAL')
    expect(repository.getLead(lead.id).attemptCount).toBe(1)
  })

  it('ein unbekanntes Ergebnis wird zur Klaerung, nicht zum Fehlschlag', async () => {
    let calls = 0
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, {
      deliver: async () => {
        calls += 1
        throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })
      },
    })
    await worker.processNext()
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('RECONCILIATION_REQUIRED')
    expect(after.reconciliationReason).toBe('PROVIDER_RESULT_UNKNOWN')
    expect(await worker.processNext()).toBeNull()
    expect(calls, 'kein blinder zweiter Versuch').toBe(1)
  })
})

describe('PT22.4 · Absturz und Neustart', () => {
  it('ueberlebt den Prozessneustart mit Zustand, Versuchen und Protokoll', async () => {
    const filename = tempFile()
    let db = openLeadDatabase({ filename })
    let repository = new LeadRepository(db)
    const lead = seed(repository)
    let worker = workerFor(repository, {
      retryPolicy: { maxAttempts: 3, baseDelayMs: 0, jitterRatio: 0 },
      deliver: async () => {
        throw Object.assign(new Error('t'), { code: 'SENDGRID_5XX', retryable: true })
      },
    })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('RETRY_PENDING')
    db.close() // "Absturz"

    db = openLeadDatabase({ filename })
    repository = new LeadRepository(db)
    const reopened = repository.getLead(lead.id)
    expect(reopened.status).toBe('RETRY_PENDING')
    expect(reopened.attemptCount).toBe(1)
    expect(repository.getEvents(lead.id).map((e) => e.eventType)).toContain(
      'HANDOFF_RETRY_SCHEDULED',
    )

    // Nach dem Neustart wird weitergearbeitet, nicht neu begonnen.
    worker = workerFor(repository, {
      retryPolicy: { maxAttempts: 3, baseDelayMs: 0, jitterRatio: 0 },
      deliver: async () => ({ status: 'DELIVERED' }),
    })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
    expect(repository.getLead(lead.id).attemptCount).toBe(2)
    db.close()
  })
})

describe('PT22.4 · Dead Letter und manuelle Wiedervorlage', () => {
  const terminalStack = async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, {
      deliver: async () => {
        throw Object.assign(new Error('bad'), { code: 'BAD_REQUEST' })
      },
    })
    await worker.processNext()
    return { repository, lead }
  }

  it('macht liegengebliebene Vorgaenge sichtbar — ohne Kontaktdaten', async () => {
    const { repository, lead } = await terminalStack()
    const rows = repository.findDeadLetters()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      leadId: lead.id,
      journey: 'contact',
      status: 'FAILED_TERMINAL',
      attempts: 1,
      errorClass: 'BAD_REQUEST',
    })
    expect(rows[0].deliveryKey).toBe(`${lead.id}:crm`)
    // Eine Betriebsliste braucht keine Kontaktdaten.
    const serialized = JSON.stringify(rows)
    expect(serialized).not.toContain('ada@praxis.example')
    expect(serialized).not.toContain('Ada Beispiel')
  })

  it('filtert nach Journey und weist eine unbekannte ab', async () => {
    const { repository } = await terminalStack()
    expect(repository.findDeadLetters({ journey: 'contact' })).toHaveLength(1)
    expect(repository.findDeadLetters({ journey: 'support' })).toHaveLength(0)
    expect(() => repository.findDeadLetters({ journey: 'chat' })).toThrow(/unsupported/u)
  })

  it('stellt nach manueller Freigabe erneut zu — mit Person und Grund im Protokoll', async () => {
    const { repository, lead } = await terminalStack()
    const result = repository.requeueForDelivery({
      leadId: lead.id,
      actor: 'ops@polarisdx',
      reason: 'Provider wieder erreichbar',
    })
    expect(result.requeued).toBe(true)
    const after = repository.getLead(lead.id)
    expect(after.status).toBe('QUEUED')
    expect(after.terminalAt).toBeNull()
    // Die Versuchszahl bleibt stehen — die Historie wird nicht gefaelscht.
    expect(after.attemptCount).toBe(1)
    const events = repository.getEvents(lead.id)
    const manual = events.find((event) => event.eventType === 'MANUAL_REQUEUE')
    expect(manual).toBeTruthy()
    expect(manual.errorClass).toBe('BY:ops@polarisdx')

    // Und der Auftrag wird wirklich wieder abgearbeitet.
    const worker = workerFor(repository, { deliver: async () => ({ status: 'DELIVERED' }) })
    await worker.processNext()
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
  })

  it('verlangt Person und Grund und wirkt nur aus einem Endzustand', async () => {
    const { repository, lead } = await terminalStack()
    expect(() => repository.requeueForDelivery({ leadId: lead.id, reason: 'x' })).toThrow(/actor/u)
    expect(() => repository.requeueForDelivery({ leadId: lead.id, actor: 'ops' })).toThrow(
      /reason/u,
    )
    const fresh = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const waiting = seed(fresh)
    // Einen wartenden Auftrag anzustossen wuerde eine zweite gleichzeitige
    // Zustellung riskieren.
    expect(
      fresh.requeueForDelivery({ leadId: waiting.id, actor: 'ops', reason: 'ungeduldig' }),
    ).toMatchObject({ requeued: false, reason: 'NOT_IN_TERMINAL_STATE' })
    expect(
      fresh.requeueForDelivery({ leadId: 'gibt-es-nicht', actor: 'ops', reason: 'x' }),
    ).toMatchObject({ requeued: false, reason: 'LEAD_NOT_FOUND' })
  })

  it('ist wiederholungssicher: die zweite Freigabe tut nichts', async () => {
    const { repository, lead } = await terminalStack()
    expect(
      repository.requeueForDelivery({ leadId: lead.id, actor: 'ops', reason: 'erste' }).requeued,
    ).toBe(true)
    const second = repository.requeueForDelivery({
      leadId: lead.id,
      actor: 'ops',
      reason: 'zweite',
    })
    expect(second.requeued).toBe(false)
    expect(second.reason).toBe('NOT_IN_TERMINAL_STATE')
    // Genau ein Eintrag im Protokoll.
    expect(
      repository.getEvents(lead.id).filter((event) => event.eventType === 'MANUAL_REQUEUE'),
    ).toHaveLength(1)
  })
})

describe('PT22.4 · Kennzahlen', () => {
  it('zaehlt Zustaende, Warteschlangentiefe und Alter — ohne Inhalte', async () => {
    let clock = Date.parse('2026-09-09T09:00:00.000Z')
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }), {
      clock: () => new Date(clock),
    })
    seed(repository, 'contact', 'm1')
    seed(repository, 'support', 'm2')
    const failing = seed(repository, 'contact', 'm3')
    const worker = workerFor(repository, {
      deliver: async () => {
        throw Object.assign(new Error('bad'), { code: 'BAD_REQUEST' })
      },
    })
    await worker.processNext()

    clock += 60_000
    const metrics = repository.collectQueueMetrics()
    expect(metrics.leads.QUEUED).toBeGreaterThanOrEqual(2)
    expect(metrics.leads.FAILED_TERMINAL).toBe(1)
    expect(metrics.queue.depth).toBeGreaterThanOrEqual(2)
    expect(metrics.queue.oldestAgeMs).toBeGreaterThanOrEqual(60_000)
    expect(metrics.providerFailures.map((row) => row.errorClass)).toContain('BAD_REQUEST')
    expect(metrics.byJourney.map((row) => row.journey)).toContain('support')
    void failing

    const serialized = JSON.stringify(metrics)
    expect(serialized).not.toContain('ada@praxis.example')
    expect(serialized).not.toContain('Ada Beispiel')
  })
})

describe('PT22.4 · Hintergrundlauf', () => {
  it('arbeitet wartende Auftraege ohne einen neuen Submit ab', async () => {
    // Der gemessene Defekt: die Outbox drehte sich nur beim Absenden eines
    // Formulars. Ein RETRY_PENDING blieb nachts liegen.
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = workerFor(repository, { deliver: async () => ({ status: 'DELIVERED' }) })
    const dispatcher = new LeadDispatcher({
      handles: [{ name: 'contact', processNext: () => worker.processNext() }],
      intervalMs: 10_000,
    })
    const run = await dispatcher.runOnce()
    expect(run.processed).toBe(1)
    expect(repository.getLead(lead.id).status).toBe('DELIVERED')
  })

  it('laesst zwei Durchlaeufe nicht ueberlappen', async () => {
    let inFlight = 0
    let maxInFlight = 0
    const dispatcher = new LeadDispatcher({
      handles: [
        {
          name: 'slow',
          processNext: async () => {
            inFlight += 1
            maxInFlight = Math.max(maxInFlight, inFlight)
            await new Promise((resolve) => setTimeout(resolve, 30))
            inFlight -= 1
            return null
          },
        },
      ],
    })
    const [a, b] = await Promise.all([dispatcher.runOnce(), dispatcher.runOnce()])
    expect(maxInFlight).toBe(1)
    expect([a.skipped, b.skipped].filter(Boolean)).toHaveLength(1)
  })

  it('laesst ein fehlerhaftes Handle die uebrigen Journeys nicht mitreissen', async () => {
    const seen = []
    const dispatcher = new LeadDispatcher({
      handles: [
        {
          name: 'kaputt',
          processNext: async () => {
            throw new Error('handle explodiert')
          },
        },
        {
          name: 'gesund',
          processNext: async () => {
            seen.push('gesund')
            return null
          },
        },
      ],
    })
    const run = await dispatcher.runOnce()
    expect(run.failures).toEqual(['kaputt'])
    expect(seen, 'die gesunde Journey lief trotzdem').toEqual(['gesund'])
  })

  it('startet und stoppt ohne den Prozess offenzuhalten', () => {
    const timers = []
    const dispatcher = new LeadDispatcher({
      handles: [{ name: 'x', processNext: async () => null }],
      setTimer: (fn, ms) => {
        const handle = { fn, ms, unref: () => handle }
        timers.push(handle)
        return handle
      },
      clearTimer: () => {},
    })
    dispatcher.start()
    expect(timers).toHaveLength(1)
    dispatcher.stop()
    expect(dispatcher.stopped).toBe(true)
  })

  it('verlangt mindestens ein brauchbares Handle', () => {
    expect(() => new LeadDispatcher({ handles: [] })).toThrow(/at least one/u)
    expect(() => new LeadDispatcher({ handles: [{ name: 'x' }] })).toThrow(/processNext/u)
  })
})

describe('PT22.4 · DRY_RUN im Hintergrundlauf', () => {
  it('kontaktiert auch im Dauerbetrieb keinen Provider und meldet keinen Erfolg', async () => {
    let called = false
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    const lead = seed(repository)
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({
        dryRun: true,
        adapters: {
          'general-sales': {
            deliver: async () => {
              called = true
              return { status: 'DELIVERED' }
            },
          },
        },
      }),
      workerId: 'dry',
      journeys: ['contact'],
    })
    const dispatcher = new LeadDispatcher({
      handles: [{ name: 'contact', processNext: () => worker.processNext() }],
    })
    await dispatcher.runOnce()
    expect(called).toBe(false)
    const after = repository.getLead(lead.id)
    expect(after.status).not.toBe('DELIVERED')
    expect(after.deliveredAt).toBeNull()
    expect(after.lastErrorClass).toBe('DRY_RUN')
  })
})

describe('PT22.4 · alle sieben Journeys', () => {
  it('kann jede Journey einzeln zustellen, ohne die anderen anzufassen', async () => {
    const repository = new LeadRepository(openLeadDatabase({ filename: ':memory:' }))
    for (const journey of LEAD_JOURNEYS) seed(repository, journey, journey)
    const { DEFAULT_JOURNEY_ROUTES } = require('./lead-foundation')

    for (const journey of LEAD_JOURNEYS) {
      const target = DEFAULT_JOURNEY_ROUTES[journey]
      const worker = new LeadHandoffWorker({
        repository,
        router: new CrmRouter({
          adapters: { [target]: { deliver: async () => ({ status: 'DELIVERED' }) } },
        }),
        workerId: `w-${journey}`,
        journeys: [journey],
      })
      const lead = await worker.processNext()
      expect(lead, journey).toBeTruthy()
      expect(lead.journey, journey).toBe(journey)
      expect(lead.status, journey).toBe('DELIVERED')
      // Und der Worker findet danach nichts mehr — er greift nichts Fremdes.
      expect(await worker.processNext(), `${journey}: nichts Fremdes`).toBeNull()
    }
    expect(repository.collectQueueMetrics().leads.DELIVERED).toBe(7)
  })
})
