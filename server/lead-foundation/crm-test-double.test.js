// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * AP27 PT27.1 — der CRM-Test-Double ist selbst bewiesen, bevor PT27.2 ihn benutzt.
 *
 * Bewusst ohne `./index` und ohne Datenbank: Router, Zustellgrenze, Wiederholungspolitik und die
 * Ergebnisbehandlung des Workers sind reine Module. Persistenz vor Handoff, Idempotenz und Replay
 * brauchen das Repository und gehoeren in die Integrationsstufe (PT27.2).
 */

const require = createRequire(import.meta.url)
const { CrmRouter, DEFAULT_JOURNEY_ROUTES } = require('./crm')
const { DELIVERY_RESULTS, LEAD_JOURNEYS } = require('./constants')
const { shouldRetry } = require('./retry-policy')
const { RESULT_HANDLING } = require('./worker')
const { CRM_DOUBLE_OUTCOMES, createScriptedCrmAdapter } = require('./testing/crm-test-double')

const SYNTHETIC_SUBJECT = Object.freeze({ name: 'Dr. Test Beispiel', email: 'test@praxis.example' })

const lead = (id, journey = 'contact') => ({ id, journey, subject: SYNTHETIC_SUBJECT })

/** Ein Router, dessen saemtliche Ziele denselben Double benutzen. */
const routerWith = (double, { dryRun = false } = {}) => {
  const targets = [...new Set(Object.values(DEFAULT_JOURNEY_ROUTES))]
  return new CrmRouter({
    adapters: Object.fromEntries(targets.map((target) => [target, double])),
    dryRun,
    timeoutMs: 1_000,
  })
}

const deliver = async (router, record) => {
  const { target, adapter } = router.resolve(record)
  return adapter.deliver({ lead: record, target, deliveryKey: `${record.id}:crm` })
}

describe('PT27.1 · CRM-Double ueber die echte Zustellgrenze', () => {
  it('bildet Erfolg, wiederholbar, terminal und unbekannt als die vier Zustellklassen ab', async () => {
    const double = createScriptedCrmAdapter(['delivered', 'retryable', 'terminal', 'unknown'])
    const router = routerWith(double)
    const results = []
    for (const id of ['L-1', 'L-2', 'L-3', 'L-4']) results.push(await deliver(router, lead(id)))

    expect(results.map((result) => result.status)).toEqual([
      DELIVERY_RESULTS.DELIVERED,
      DELIVERY_RESULTS.RETRYABLE_ERROR,
      DELIVERY_RESULTS.TERMINAL_ERROR,
      DELIVERY_RESULTS.UNKNOWN_RESULT,
    ])
    expect(results[3].errorClass).toBe('PROVIDER_RESULT_UNKNOWN')
  })

  it('nur der sicher nicht angekommene Fehler wird wiederholt — unbekannt nie', async () => {
    const double = createScriptedCrmAdapter(['retryable', 'terminal', 'unknown'])
    const router = routerWith(double)
    const decisions = []
    for (const id of ['L-1', 'L-2', 'L-3']) {
      const result = await deliver(router, lead(id))
      const handling = RESULT_HANDLING[result.status]
      decisions.push([result.status, shouldRetry({ retryable: handling.retryable, attempt: 1 })])
    }
    expect(decisions).toEqual([
      [DELIVERY_RESULTS.RETRYABLE_ERROR, true],
      [DELIVERY_RESULTS.TERMINAL_ERROR, false],
      [DELIVERY_RESULTS.UNKNOWN_RESULT, false],
    ])
    // Auch ein wiederholbarer Fehler endet am Versuchsbudget.
    expect(shouldRetry({ retryable: true, attempt: 3 })).toBe(false)
  })

  it('zaehlt Aufrufe und haelt die Reihenfolge ueber Journeys hinweg fest', async () => {
    const double = createScriptedCrmAdapter(['delivered', 'delivered', 'delivered'])
    const router = routerWith(double)
    const journeys = [LEAD_JOURNEYS[0], LEAD_JOURNEYS[1], LEAD_JOURNEYS[0]]
    for (const [index, journey] of journeys.entries()) {
      await deliver(router, lead(`L-${index + 1}`, journey))
    }
    expect(double.callCount).toBe(3)
    expect(double.calls.map((call) => [call.seq, call.leadId, call.journey])).toEqual([
      [1, 'L-1', journeys[0]],
      [2, 'L-2', journeys[1]],
      [3, 'L-3', journeys[2]],
    ])
    expect(double.calls.map((call) => call.target)).toEqual(
      journeys.map((journey) => DEFAULT_JOURNEY_ROUTES[journey]),
    )
    expect(double.calls[1].deliveryKey).toBe('L-2:crm')
  })

  it('im Trockenlauf wird der Double kein einziges Mal aufgerufen', async () => {
    const double = createScriptedCrmAdapter(['delivered'])
    const result = await deliver(routerWith(double, { dryRun: true }), lead('L-1'))
    expect(result.status).toBe(DELIVERY_RESULTS.DRY_RUN)
    expect(RESULT_HANDLING[result.status].retryable).toBe(false)
    expect(double.callCount).toBe(0)
  })

  it('ein Aufruf ueber das Skript hinaus wird sichtbar terminal, nie als Erfolg', async () => {
    const double = createScriptedCrmAdapter(['delivered'])
    const router = routerWith(double)
    await deliver(router, lead('L-1'))
    const extra = await deliver(router, lead('L-2'))
    expect(extra).toEqual({
      status: DELIVERY_RESULTS.TERMINAL_ERROR,
      errorClass: 'CRM_DOUBLE_SCRIPT_EXHAUSTED',
    })
    expect(double.callCount).toBe(1)
    expect(double.exhaustedCalls).toBe(1)
  })
})

describe('PT27.1 · Double-Eigenschaften', () => {
  it('ist deterministisch: gleiches Skript ergibt dieselbe Folge', async () => {
    const run = async () => {
      const router = routerWith(createScriptedCrmAdapter([...CRM_DOUBLE_OUTCOMES]))
      const statuses = []
      for (const id of ['A', 'B', 'C', 'D']) statuses.push((await deliver(router, lead(id))).status)
      return statuses
    }
    expect(await run()).toEqual(await run())
  })

  it('lehnt ein leeres Skript und unbekannte Ausgaenge beim Anlegen ab', () => {
    expect(() => createScriptedCrmAdapter([])).toThrow(TypeError)
    expect(() => createScriptedCrmAdapter(['delivered', 'maybe'])).toThrow(/unknown outcome/)
  })

  it('zeichnet keine Personendaten auf', async () => {
    const double = createScriptedCrmAdapter(['delivered'])
    await deliver(routerWith(double), lead('L-1'))
    const recorded = JSON.stringify(double.calls)
    expect(recorded).not.toContain(SYNTHETIC_SUBJECT.email)
    expect(recorded).not.toContain(SYNTHETIC_SUBJECT.name)
  })

  it('bringt weder Netzwerk-Client noch Provider-SDK noch Zugangsdaten mit', () => {
    const source = readFileSync(new URL('./testing/crm-test-double.js', import.meta.url), 'utf8')
    expect(source).not.toMatch(
      /require\(['"](node:)?(http|https|net|tls|dgram)['"]\)|@sendgrid|axios|fetch\(|process\.env/,
    )
  })
})
