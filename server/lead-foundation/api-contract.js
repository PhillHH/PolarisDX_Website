const { randomUUID } = require('node:crypto')

const { LEAD_JOURNEYS, LEAD_STATUSES } = require('./constants')

/**
 * AP22 PT22.1 — der gemeinsame Formular-/API-Vertrag.
 *
 * Gemessener Ausgangszustand: sechs Endpunkte, zwei Antwortformen.
 * `contact`, `support`, `consumer_order`, `epigenetics_inquiry` und
 * `content_download` antworten `{ accepted, code, fields }`; `roi_report`
 * antwortet `{ success }` mit einem voellig anderen Fehlercode-Satz. Vier
 * Angaben fehlten ueberall:
 *
 *   - `requestId`  — ein Fehler war im Log nicht auffindbar
 *   - `state`      — nur die 202-Antwort trug ihn, keine Fehlerantwort
 *   - `retryable`  — jeder Client leitete ihn selbst aus dem Statuscode ab
 *   - `messageKey` — die Zuordnung Code → Text lag in FUENF Clients doppelt
 *
 * Dieses Modul definiert die eine Form. Es MIGRIERT NICHTS: die Endpunkte
 * bleiben in PT22.1 unveraendert, die Umstellung ist der Write Set von
 * PT22.2. `JOURNEY_REGISTRY` sagt je Journey, wo sie wirklich steht.
 *
 * Sicherheitsgrenze: aus einem Fehler darf nie ein Provider-Text, ein
 * Stacktrace, ein Header, ein Token oder ein Formularinhalt nach aussen
 * gelangen. Deshalb wird nicht gefiltert, sondern NUR AUFGEBAUT — was nicht
 * ausdruecklich gesetzt wird, steht auch nicht in der Antwort.
 */

/** Zustaende, die ein Client sehen darf. Deckungsgleich mit LEAD_STATUSES. */
const PUBLIC_STATES = Object.freeze({
  ...LEAD_STATUSES,
  /** Stiller Verwurf (Honeypot): angenommen, aber nichts gespeichert. */
  IGNORED: 'IGNORED',
  /** Validierung fehlgeschlagen — nichts wurde gespeichert. */
  REJECTED: 'REJECTED',
})

/**
 * Der kanonische Fehlercode-Satz.
 *
 * `retryable` sagt, ob DIESELBE Anfrage mit DEMSELBEN Idempotency-Key erneut
 * gesendet werden darf. Das ist eine Aussage ueber Sicherheit, nicht ueber
 * Hoeflichkeit: bei `IDEMPOTENCY_CONFLICT` waere ein erneuter Versuch mit
 * demselben Schluessel dauerhaft sinnlos, bei `RATE_LIMITED` ist er richtig.
 */
const ERROR_CATALOG = Object.freeze({
  VALIDATION_FAILED: { status: 400, retryable: false },
  PROCESSING_CONSENT_REQUIRED: { status: 400, retryable: false },
  INVALID_CONSENT_EVIDENCE: { status: 400, retryable: false },
  IDEMPOTENCY_KEY_REQUIRED: { status: 400, retryable: false },
  // AP26 PT26.3 — Schluessel ausserhalb von druckbarem ASCII oder ueber 200 Zeichen.
  IDEMPOTENCY_KEY_INVALID: { status: 400, retryable: false },
  UNKNOWN_PRODUCT: { status: 400, retryable: false },
  UNKNOWN_VARIANT: { status: 400, retryable: false },
  INVALID_QUANTITY: { status: 400, retryable: false },
  UNKNOWN_ASSET: { status: 400, retryable: false },
  ATTACHMENT_INVALID: { status: 400, retryable: false },
  // AP22 PT22.5 — die uebrigen Anhangsgruende der Support-Journey. Sie
  // fehlten hier, und ein nicht katalogisierter Code faellt auf
  // JOURNEY_UNAVAILABLE zurueck: eine abgelehnte Datei haette damit 500
  // statt 400 gemeldet. Der Leckschutz ist richtig, der Katalog war luecken-
  // haft — geprueft wird das jetzt gegen die Codes, die die Slices wirklich
  // werfen.
  ATTACHMENT_COUNT: { status: 400, retryable: false },
  ATTACHMENT_FILENAME: { status: 400, retryable: false },
  ATTACHMENT_SIZE: { status: 400, retryable: false },
  ATTACHMENT_SPOOFED: { status: 400, retryable: false },
  ATTACHMENT_TOTAL_SIZE: { status: 400, retryable: false },
  ATTACHMENT_TRAVERSAL: { status: 400, retryable: false },
  ATTACHMENT_TYPE: { status: 400, retryable: false },
  IDEMPOTENCY_CONFLICT: { status: 409, retryable: false },
  RATE_LIMITED: { status: 429, retryable: true },
  JOURNEY_UNAVAILABLE: { status: 500, retryable: true },
})

const MESSAGE_KEY_PREFIX = 'lead.error'

/** `VALIDATION_FAILED` → `lead.error.validation_failed`. */
function messageKeyFor(code) {
  return `${MESSAGE_KEY_PREFIX}.${String(code).toLowerCase()}`
}

function createRequestId() {
  return `req_${randomUUID()}`
}

function assertJourney(journey) {
  if (!LEAD_JOURNEYS.includes(journey)) {
    throw new TypeError(`journey is not registered: ${String(journey).slice(0, 40)}`)
  }
  return journey
}

const FIELD_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_.[\]]{0,63}$/

/**
 * Feldfehler nach `BACKEND-API-CONTRACT.md` API-09: je Feld ein `field`, ein
 * stabiler `code` und ein `messageKey`. Ausdruecklich KEINE fertige Prosa
 * (API-10) — die Anzeige lokalisiert der Client.
 *
 * Ein Feldfehler darf sagen, WELCHES Feld falsch ist, niemals WAS darin
 * stand: sonst spiegelt die Fehlerantwort die Eingabe zurueck. Deshalb wird
 * der Feldname gegen ein enges Muster geprueft und der Code auf den Katalog
 * begrenzt; alles andere faellt heraus statt durchzurutschen.
 */
function normalizeFieldErrors(fieldErrors) {
  if (!fieldErrors) return undefined
  const list = Array.isArray(fieldErrors) ? fieldErrors : Object.keys(fieldErrors)
  const seen = new Set()
  const clean = []
  for (const item of list) {
    const field = typeof item === 'string' ? item.trim() : String(item?.field ?? '').trim()
    if (!FIELD_NAME_PATTERN.test(field) || seen.has(field)) continue
    seen.add(field)
    const candidate = typeof item === 'string' ? undefined : item?.code
    const code = Object.prototype.hasOwnProperty.call(ERROR_CATALOG, candidate)
      ? candidate
      : 'VALIDATION_FAILED'
    clean.push({ field, code, messageKey: messageKeyFor(code) })
  }
  return clean.length ? clean : undefined
}

/**
 * Erfolgsantwort. `state` ist der ECHTE Lead-Zustand, nicht "ok".
 *
 * `accepted: true` heisst ausschliesslich "dauerhaft gespeichert". Ob ein
 * Provider erreicht wurde, sagt `providerConfigured` — und wenn das unbekannt
 * ist, steht es nicht drin, statt Erfolg zu suggerieren.
 */
function successEnvelope({
  journey,
  state,
  requestId = createRequestId(),
  leadId,
  reference,
  deliveryPending,
  providerConfigured,
  /**
   * AP22 PT22.5 — journeyspezifische oeffentliche Nutzlast.
   *
   * Sie wird vom Aufrufer AUSDRUECKLICH uebergeben, nicht aus dem
   * Service-Ergebnis durchgereicht. Der Unterschied ist der Punkt: eine
   * Journey wie `content_download` muss `assetId` und `downloadUrl`
   * ausliefern, aber es darf nie passieren, dass ein spaeter ergaenztes
   * internes Feld unbemerkt mit nach draussen faellt.
   */
  data,
}) {
  assertJourney(journey)
  if (!Object.values(PUBLIC_STATES).includes(state)) {
    throw new TypeError(`state is not public: ${String(state).slice(0, 40)}`)
  }
  return {
    success: true,
    requestId,
    journey,
    state,
    ...(leadId ? { leadId } : {}),
    ...(reference ? { reference } : {}),
    ...(typeof deliveryPending === 'boolean' ? { deliveryPending } : {}),
    ...(typeof providerConfigured === 'boolean' ? { providerConfigured } : {}),
    ...(data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length
      ? { data }
      : {}),
  }
}

/**
 * Fehlerantwort. Baut ausschliesslich aus bekannten Bausteinen auf — ein
 * unbekannter Code wird zu `JOURNEY_UNAVAILABLE`, statt ihn durchzureichen.
 */
function errorEnvelope({ journey, code, requestId = createRequestId(), fieldErrors, state }) {
  assertJourney(journey)
  const known = Object.prototype.hasOwnProperty.call(ERROR_CATALOG, code)
  const resolved = known ? code : 'JOURNEY_UNAVAILABLE'
  const entry = ERROR_CATALOG[resolved]
  const fields = normalizeFieldErrors(fieldErrors)
  return {
    body: {
      success: false,
      requestId,
      journey,
      state: state ?? (entry.status === 500 ? PUBLIC_STATES.RECEIVED : PUBLIC_STATES.REJECTED),
      code: resolved,
      retryable: entry.retryable,
      messageKey: messageKeyFor(resolved),
      ...(fields ? { fieldErrors: fields } : {}),
    },
    status: entry.status,
  }
}

/**
 * Was ueber einen Fehler ins LOG darf: Klasse, Journey, Anfrage-ID. Kein
 * Body, keine Header, keine Mailadresse, kein Token, kein Stacktrace.
 */
function logSafeError({ journey, code, requestId }) {
  return {
    journey: LEAD_JOURNEYS.includes(journey) ? journey : 'unknown',
    errorClass: Object.prototype.hasOwnProperty.call(ERROR_CATALOG, code)
      ? code
      : 'UNCLASSIFIED_ERROR',
    requestId: typeof requestId === 'string' ? requestId.slice(0, 64) : undefined,
  }
}

module.exports = {
  ERROR_CATALOG,
  FIELD_NAME_PATTERN,
  MESSAGE_KEY_PREFIX,
  PUBLIC_STATES,
  assertJourney,
  createRequestId,
  errorEnvelope,
  logSafeError,
  messageKeyFor,
  normalizeFieldErrors,
  successEnvelope,
}
