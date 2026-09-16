const {
  CRM_DELIVERY_TIMEOUT_MS,
  DELIVERY_RESULTS,
  LEAD_JOURNEYS,
  NON_DELIVERY_RESULTS,
} = require('./constants')

/**
 * AP22 PT22.3 — die eine CRM-Zustellgrenze.
 *
 * Vorher lag dasselbe an drei Stellen: die Fehlerklassifikation im Worker,
 * die Adapter verstreut in drei Journey-Slices, und der Preview-Schalter als
 * globaler Monkey-Patch auf `sgMail.send` in `server.js`. Das hatte zwei
 * konkrete Folgen, beide nachgemessen:
 *
 *  1. **DRY_RUN galt als Erfolg.** Der Stub gab `202` zurueck, der Adapter
 *     meldete `DELIVERED`, und der Lead bekam einen `delivered_at`-Zeitstempel
 *     — ein Datensatz, der behauptet, die Mail sei raus, obwohl nichts das
 *     Haus verlassen hat.
 *  2. **Kein ausdruecklicher Timeout.** Ein nicht antwortender Provider haelt
 *     den Worker so lange, wie sein Client es zulaesst.
 *
 * Dieses Modul ist der einzige Weg, auf dem ein Adapter aufgerufen wird.
 * Es entscheidet VOR dem Adapter ueber DRY_RUN, begrenzt die Laufzeit und
 * uebersetzt jedes Ergebnis in genau eine der sechs Zustellklassen.
 */

/**
 * Fehlerklassen, bei denen offen ist, ob die Nachricht ankam.
 *
 * AP26 PT26.4: `PROVIDER_PARTIAL_DELIVERY` — von mehreren Mails eines Versuchs ist
 * mindestens eine angenommen worden. Eine Wiederholung saendete sie erneut (LDV-10).
 */
const UNKNOWN_RESULT_CODES = Object.freeze([
  'ETIMEDOUT',
  'ECONNRESET',
  'EPIPE',
  'ECONNABORTED',
  'PROVIDER_PARTIAL_DELIVERY',
])

/**
 * AP26 PT26.4 — mehrere Mails eines Zustellversuchs senden, ohne bei einer
 * Wiederholung eine bereits angenommene Mail doppelt zu verschicken.
 *
 * Vorher `Promise.all`: scheiterte die Bestaetigungsmail mit 5xx, galt der ganze
 * Versuch als wiederholbar — und die Teammail ging beim naechsten Lauf ein
 * zweites Mal raus. Jetzt:
 *  - alle angenommen → Erfolg
 *  - mindestens eine angenommen, eine nicht → `PROVIDER_PARTIAL_DELIVERY` (Klaerung)
 *  - keine angenommen → der Fehler mit dem unsichersten Ausgang gewinnt: ein
 *    Transportfehler (vielleicht doch angekommen) vor einem eindeutigen 5xx
 */
async function sendEach(send, messages) {
  const settled = await Promise.allSettled(messages.map((message) => send(message)))
  const rejected = settled.filter((entry) => entry.status === 'rejected').map((e) => e.reason)
  if (rejected.length === 0) return
  if (rejected.length < settled.length) {
    throw Object.assign(new Error('PROVIDER_PARTIAL_DELIVERY'), {
      code: 'PROVIDER_PARTIAL_DELIVERY',
    })
  }
  throw rejected.find((error) => UNKNOWN_RESULT_CODES.includes(error?.code)) ?? rejected[0]
}

const ERROR_CLASS_PATTERN = /^[A-Z][A-Z0-9_]{0,63}$/

function safeErrorClass(error) {
  const candidate = error && (error.code || error.name)
  return ERROR_CLASS_PATTERN.test(String(candidate || ''))
    ? String(candidate)
    : 'UNCLASSIFIED_PROVIDER_ERROR'
}

/**
 * Ein geworfener Providerfehler wird in eine Klasse uebersetzt.
 *
 * Die Unterscheidung ist keine Feinheit: `RETRYABLE_ERROR` bedeutet "sicher
 * nicht angekommen, darf wiederholt werden". `UNKNOWN_RESULT` bedeutet
 * "vielleicht angekommen" — und darf deshalb NICHT automatisch wiederholt
 * werden, weil sonst eine zweite Mail beim Empfaenger landet.
 */
function classifyProviderError(error) {
  const code = safeErrorClass(error)
  const explicitlyRetryable = error?.retryable === true
  if (explicitlyRetryable) {
    return { status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: code }
  }
  if (UNKNOWN_RESULT_CODES.includes(code)) {
    return { status: DELIVERY_RESULTS.UNKNOWN_RESULT, errorClass: 'PROVIDER_RESULT_UNKNOWN' }
  }
  return { status: DELIVERY_RESULTS.TERMINAL_ERROR, errorClass: code }
}

/**
 * Der stabile Zustellschluessel.
 *
 * Er haengt an Lead und Kanal, nicht am Versuch: alle Wiederholungen desselben
 * Vorgangs tragen denselben Schluessel. Ein Provider mit eigener Idempotenz
 * kann ihn als Idempotency-Key verwenden; ohne einen solchen Provider ist er
 * die Handhabe fuer die manuelle Klaerung eines `UNKNOWN_RESULT`.
 */
function deliveryKeyFor({ leadId, channel }) {
  if (!leadId || !channel) throw new TypeError('deliveryKey requires leadId and channel')
  return `${leadId}:${String(channel).toLowerCase()}`
}

/**
 * Was ueber eine Zustellung ins Log darf.
 *
 * Aufbauend, nicht filternd: nur diese Felder existieren in der Ausgabe.
 * Kein Empfaenger, kein Betreff, kein Body, kein Schluessel — die alte
 * Preview-Zeile schrieb `to=…` und einen Betreff, der den vollen Namen der
 * Absenderin enthielt.
 */
function crmLogFields({ leadId, journey, target, attempt, status, errorClass, deliveryKey }) {
  const fields = {
    leadId: typeof leadId === 'string' ? leadId.slice(0, 64) : undefined,
    journey: LEAD_JOURNEYS.includes(journey) ? journey : 'unknown',
    target: typeof target === 'string' && /^[a-z][a-z-]{0,63}$/.test(target) ? target : 'unknown',
    attempt: Number.isInteger(attempt) ? attempt : undefined,
    status: typeof status === 'string' && ERROR_CLASS_PATTERN.test(status) ? status : undefined,
    errorClass:
      typeof errorClass === 'string' && ERROR_CLASS_PATTERN.test(errorClass)
        ? errorClass
        : undefined,
    // Nur die Lead-Haelfte des Schluessels, damit ein Log-Eintrag zuordenbar
    // bleibt, ohne den vollstaendigen Schluessel zu streuen.
    deliveryChannel:
      typeof deliveryKey === 'string' && deliveryKey.includes(':')
        ? deliveryKey.split(':').pop().slice(0, 16)
        : undefined,
  }
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined))
}

/** Ein Ergebnis in die vereinbarte Form bringen; Unbekanntes wird terminal. */
function normalizeResult(result) {
  const status = result?.status
  if (status === DELIVERY_RESULTS.DELIVERED) return { status, errorClass: null }
  if (NON_DELIVERY_RESULTS.includes(status)) {
    return { status, errorClass: safeErrorClass({ code: result?.errorClass }) }
  }
  // Ein Adapter, der etwas Unbekanntes meldet, gilt NICHT als erfolgreich.
  return { status: DELIVERY_RESULTS.TERMINAL_ERROR, errorClass: 'UNCLASSIFIED_PROVIDER_RESULT' }
}

class DeliveryTimeoutError extends Error {
  constructor(timeoutMs) {
    super(`CRM delivery exceeded ${timeoutMs} ms`)
    this.name = 'DeliveryTimeoutError'
    this.code = 'ETIMEDOUT'
  }
}

/**
 * Legt DRY_RUN, Timeout und Klassifikation um einen Adapter.
 *
 * Reihenfolge ist Absicht: DRY_RUN wird geprueft, BEVOR der Adapter
 * ueberhaupt aufgerufen wird. In einer Preview-Umgebung darf kein Provider
 * kontaktiert werden — auch nicht versehentlich durch einen Adapter, der
 * seinen eigenen Transport mitbringt.
 */
function withDeliveryGuards(adapter, { timeoutMs = CRM_DELIVERY_TIMEOUT_MS, dryRun = false } = {}) {
  if (!adapter || typeof adapter.deliver !== 'function') {
    throw new TypeError('adapter must implement deliver()')
  }
  return {
    async deliver(delivery) {
      if (dryRun) {
        // Kein Aufruf, kein Netzwerk, kein Erfolg.
        return { status: DELIVERY_RESULTS.DRY_RUN, errorClass: 'DRY_RUN' }
      }
      let timer
      try {
        const result = await Promise.race([
          adapter.deliver(delivery),
          new Promise((_resolve, reject) => {
            timer = setTimeout(() => reject(new DeliveryTimeoutError(timeoutMs)), timeoutMs)
            if (typeof timer.unref === 'function') timer.unref()
          }),
        ])
        return normalizeResult(result)
      } catch (error) {
        return classifyProviderError(error)
      } finally {
        clearTimeout(timer)
      }
    },
  }
}

module.exports = {
  DeliveryTimeoutError,
  UNKNOWN_RESULT_CODES,
  classifyProviderError,
  crmLogFields,
  deliveryKeyFor,
  normalizeResult,
  safeErrorClass,
  sendEach,
  withDeliveryGuards,
}
