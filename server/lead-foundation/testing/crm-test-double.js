const { CrmAdapter } = require('../crm')
const { DELIVERY_RESULTS } = require('../constants')

/**
 * AP27 PT27.1 — deterministischer CRM-Test-Double.
 *
 * Ein Adapter mit festem Skript: jeder Aufruf verbraucht den naechsten Ausgang. Kein Netzwerk,
 * kein Zufall, keine Zugangsdaten. Die Fehler haben die Form, die die echte Zustellgrenze
 * (`crm-delivery.js`) klassifiziert — der Double entscheidet also NICHT selbst, ob etwas
 * wiederholbar ist, sondern liefert nur den Provider-Ausgang:
 *
 *  - `delivered`  → angenommen
 *  - `retryable`  → sicher nicht angekommen (z. B. 5xx), `retryable: true`
 *  - `terminal`   → abgelehnt, Wiederholung sinnlos
 *  - `unknown`    → Transportabbruch, Ausgang offen (`ETIMEDOUT`)
 *
 * Aufgezeichnet werden nur Kennungen (Lead, Journey, Ziel, Zustellschluessel), nie Inhalte des
 * Vorgangs — ein Testlog kann so keine Personendaten tragen.
 */

const CRM_DOUBLE_OUTCOMES = Object.freeze(['delivered', 'retryable', 'terminal', 'unknown'])

const providerError = (code, extra = {}) => Object.assign(new Error(code), { code }, extra)

class ScriptedCrmAdapter extends CrmAdapter {
  constructor(script) {
    super()
    if (!Array.isArray(script) || script.length === 0) {
      throw new TypeError('crm test double: script must be a non-empty array')
    }
    for (const outcome of script) {
      if (!CRM_DOUBLE_OUTCOMES.includes(outcome)) {
        throw new TypeError(`crm test double: unknown outcome ${String(outcome)}`)
      }
    }
    this.script = Object.freeze([...script])
    this.calls = []
    this.exhaustedCalls = 0
  }

  get callCount() {
    return this.calls.length
  }

  async deliver(delivery) {
    const outcome = this.script[this.calls.length]
    if (!outcome) {
      // Ein Aufruf mehr als erwartet ist ein Testbefund, kein Erfolg: sichtbar terminal.
      this.exhaustedCalls += 1
      throw providerError('CRM_DOUBLE_SCRIPT_EXHAUSTED')
    }
    this.calls.push(
      Object.freeze({
        seq: this.calls.length + 1,
        outcome,
        leadId: delivery?.lead?.id,
        journey: delivery?.lead?.journey,
        target: delivery?.target,
        deliveryKey: delivery?.deliveryKey,
      }),
    )
    if (outcome === 'delivered') return { status: DELIVERY_RESULTS.DELIVERED }
    if (outcome === 'retryable') throw providerError('PROVIDER_UNAVAILABLE', { retryable: true })
    if (outcome === 'terminal') throw providerError('PROVIDER_REJECTED')
    throw providerError('ETIMEDOUT')
  }
}

function createScriptedCrmAdapter(script) {
  return new ScriptedCrmAdapter(script)
}

module.exports = { CRM_DOUBLE_OUTCOMES, ScriptedCrmAdapter, createScriptedCrmAdapter }
