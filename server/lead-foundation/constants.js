/**
 * AP22 PT22.1 — die sieben kanonischen Journeys.
 *
 * Bis AP21 kannte die Foundation fuenf. Zwei fehlten, und beide fehlten aus
 * einem konkreten Grund, nicht aus Versehen:
 *
 *  - `roi_report` lief als reiner Mailendpunkt (`/api/roi-report`) — im
 *    ganzen Pfad steht kein einziger `createLead`-Aufruf.
 *  - `practice_order` existierte ueberhaupt nicht als Journey. Eine
 *    Praxisbestellung wurde durch `contact` geschleust und dort an einem
 *    MAGIC STRING erkannt: `area === 'Vitamin D3+K2 Spray BESTELLUNG'`
 *    entscheidet in `contact-lead.js`, an wen die Mail geht.
 *
 * PT22.1 traegt beide hier ein und macht sie damit erst benennbar. Die
 * eigentliche Umstellung der Endpunkte gehoert zu PT22.2+ — der Zustand je
 * Journey steht deshalb ausdruecklich in `JOURNEY_REGISTRY`, damit niemand
 * einen Registry-Eintrag mit einer fertigen Journey verwechselt.
 *
 * `/api/chat` ist KEINE Journey und steht bewusst nicht in dieser Liste.
 */
const JOURNEY_FOUNDATION_STATES = Object.freeze({
  /** Laeuft vollstaendig ueber Lead + Outbox + Retry der Foundation. */
  ON_FOUNDATION: 'ON_FOUNDATION',
  /** Registriert, aber der Endpunkt persistiert noch nicht. Owner: PT22.2+. */
  LEGACY_MAIL_ONLY: 'LEGACY_MAIL_ONLY',
  /** Registriert, aber es gibt noch keinen eigenen Endpunkt. Owner: PT22.2+. */
  NOT_YET_TYPED: 'NOT_YET_TYPED',
})

const JOURNEY_REGISTRY = Object.freeze([
  Object.freeze({
    id: 'contact',
    endpoint: '/api/contact',
    crmTarget: 'general-sales',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/contact-lead.js',
  }),
  Object.freeze({
    id: 'support',
    endpoint: '/api/support',
    crmTarget: 'support',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/support-case.js',
  }),
  Object.freeze({
    id: 'consumer_order',
    endpoint: '/api/consumer-order',
    crmTarget: 'consumer',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/consumer-order.js',
  }),
  Object.freeze({
    id: 'roi_report',
    endpoint: '/api/roi-report',
    crmTarget: 'reports',
    // AP22 PT22.5 migriert: eigener Slice, Persistenz vor Handoff, PDF als
    // Side Effect des Zustellversuchs statt im Request-Pfad.
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/roi-report.js',
  }),
  Object.freeze({
    id: 'practice_order',
    // AP22 PT22.5 typisiert: eigener Endpunkt und eigenes CRM-Ziel. Der
    // Magic String `SPRAY_ORDER_MARKER` in `contact-lead.js` ist entfernt —
    // der Empfaenger haengt an der Journey, nicht am Formularfeld `area`.
    endpoint: '/api/practice-order',
    crmTarget: 'practice-sales',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/practice-order.js',
  }),
  Object.freeze({
    id: 'epigenetics_inquiry',
    endpoint: '/api/epigenetics-inquiry',
    crmTarget: 'epigenetics',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/epigenetics-inquiry.js',
  }),
  Object.freeze({
    id: 'content_download',
    endpoint: '/api/content-download',
    crmTarget: 'resources',
    state: JOURNEY_FOUNDATION_STATES.ON_FOUNDATION,
    slice: 'server/content-download.js',
  }),
])

/** Abgeleitet, nicht zweitgepflegt: EINE Quelle fuer die Journey-Liste. */
const LEAD_JOURNEYS = Object.freeze(JOURNEY_REGISTRY.map((journey) => journey.id))

/**
 * AP22 PT22.2 — der konsolidierte Lebenszyklus.
 *
 * Drei Zustaende sind neu, und `RECONCILIATION_REQUIRED` ist der wichtigste:
 * ein Provider-Timeout landete bisher in `FAILED_TERMINAL`. Das behauptet
 * Wissen, das es nicht gibt — bei einem Timeout ist schlicht unbekannt, ob
 * die Mail rausging. Der Vorgang wird deshalb nicht als gescheitert gefuehrt,
 * sondern als klaerungsbeduerftig: sichtbar, wiederauffindbar und
 * ausdruecklich NICHT automatisch wiederholt, weil ein zweiter Versuch eine
 * doppelte Zustellung erzeugen koennte.
 */
const LEAD_STATUSES = Object.freeze({
  /** Angenommen, noch nicht geprueft. */
  RECEIVED: 'RECEIVED',
  /** Serverseitig validiert, noch nicht geschrieben. */
  VALIDATED: 'VALIDATED',
  /** Dauerhaft gespeichert. Ab hier geht nichts mehr verloren. */
  PERSISTED: 'PERSISTED',
  /** In der Outbox, wartet auf Zustellung. Kanonischer Name. */
  QUEUED: 'QUEUED',
  /**
   * Altwert aus Migration 001, identisch mit `QUEUED`. Wird nicht mehr
   * geschrieben und bleibt nur lesbar, damit aeltere Zeilen gueltig sind.
   * @deprecated
   */
  PENDING_HANDOFF: 'PENDING_HANDOFF',
  PROCESSING: 'PROCESSING',
  DELIVERED: 'DELIVERED',
  RETRY_PENDING: 'RETRY_PENDING',
  /** Providerergebnis unbekannt — braucht Klaerung, kein blinder Replay. */
  RECONCILIATION_REQUIRED: 'RECONCILIATION_REQUIRED',
  FAILED_TERMINAL: 'FAILED_TERMINAL',
})

/** Zustaende, in denen die Zustellung noch aussteht. */
const PENDING_DELIVERY_STATUSES = Object.freeze([
  LEAD_STATUSES.QUEUED,
  LEAD_STATUSES.PENDING_HANDOFF,
  LEAD_STATUSES.PROCESSING,
  LEAD_STATUSES.RETRY_PENDING,
])

/**
 * Fachliches Dedup — je Journey, ausdruecklich NICHT global.
 *
 * Ein globales E-Mail-Dedup waere falsch: dieselbe Person darf am selben Tag
 * eine Supportanfrage stellen UND ein Whitepaper laden UND eine Bestellung
 * aufgeben. Der Schluessel enthaelt deshalb immer die Journey plus die
 * Felder, die eine Anfrage fachlich ausmachen.
 *
 * Das ist eine ERKENNUNG, keine Sperre: der Repository-Aufruf meldet die
 * Dublette, die Journey entscheidet, was sie damit tut. Ein hartes UNIQUE
 * waere falsch, weil eine Wiederholung nach dem Fenster legitim ist.
 */
const DEDUP_POLICIES = Object.freeze({
  contact: Object.freeze({ windowMs: 10 * 60_000, fields: Object.freeze(['email', 'message']) }),
  support: Object.freeze({
    windowMs: 10 * 60_000,
    fields: Object.freeze(['email', 'udi', 'subject']),
  }),
  consumer_order: Object.freeze({
    windowMs: 30 * 60_000,
    fields: Object.freeze(['email', 'productId', 'variant', 'quantity']),
  }),
  roi_report: Object.freeze({ windowMs: 60 * 60_000, fields: Object.freeze(['email', 'area']) }),
  practice_order: Object.freeze({
    windowMs: 30 * 60_000,
    fields: Object.freeze(['email', 'organization', 'productId']),
  }),
  epigenetics_inquiry: Object.freeze({
    windowMs: 10 * 60_000,
    fields: Object.freeze(['email', 'panel']),
  }),
  content_download: Object.freeze({
    windowMs: 24 * 60 * 60_000,
    fields: Object.freeze(['email', 'assetId']),
  }),
})

/**
 * Aufbewahrungsfristen in Tagen.
 *
 * Hier steht NUR, was wirklich entschieden ist. Fuer `support` hat AP20
 * 90 Tage festgelegt; fuer die uebrigen sechs Journeys gibt es keine
 * freigegebene Frist. `null` heisst genau das — nicht "unbegrenzt" und nicht
 * "noch nicht implementiert", sondern: die Entscheidung fehlt. Eine Frist zu
 * erfinden waere eine datenschutzrechtliche Aussage, die dieser Task nicht
 * treffen darf. Gefuehrt als `LDC-11`, Owner Datenschutz.
 */
const RETENTION_POLICY_DAYS = Object.freeze({
  contact: null,
  support: 90,
  consumer_order: null,
  roi_report: null,
  practice_order: null,
  epigenetics_inquiry: null,
  content_download: null,
})

const OUTBOX_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  RETRY_PENDING: 'RETRY_PENDING',
  DELIVERED: 'DELIVERED',
  FAILED_TERMINAL: 'FAILED_TERMINAL',
})

/**
 * AP22 PT22.3 — die Ergebnisse, die ein Zustellversuch haben kann.
 *
 * Zwei sind neu, und beide beschreiben Faelle, die vorher faelschlich als
 * Erfolg oder als Fehlschlag durchgingen:
 *
 *  - `DRY_RUN`: es wurde bewusst NICHT zugestellt. Bis PT22.3 ersetzte die
 *    Preview-Instanz `sgMail.send` durch einen Stub, der 202 zurueckgab — der
 *    Adapter sah Erfolg, und der Lead wurde mit Zeitstempel als `DELIVERED`
 *    abgelegt. Ein Datensatz, der behauptet, die Mail sei raus, obwohl nichts
 *    das Haus verlassen hat.
 *  - `UNKNOWN_RESULT`: der Provider hat nicht rechtzeitig geantwortet. Ob die
 *    Nachricht ankam, ist offen — deshalb weder Erfolg noch Fehlschlag.
 */
const DELIVERY_RESULTS = Object.freeze({
  DELIVERED: 'DELIVERED',
  RETRYABLE_ERROR: 'RETRYABLE_ERROR',
  TERMINAL_ERROR: 'TERMINAL_ERROR',
  NO_PROVIDER_CONFIGURED: 'NO_PROVIDER_CONFIGURED',
  DRY_RUN: 'DRY_RUN',
  UNKNOWN_RESULT: 'UNKNOWN_RESULT',
})

/**
 * Ergebnisse, die NIEMALS als Zustellerfolg gelten duerfen.
 * Als eigene Liste, damit die Regel an einer Stelle steht und pruefbar ist.
 */
const NON_DELIVERY_RESULTS = Object.freeze([
  DELIVERY_RESULTS.RETRYABLE_ERROR,
  DELIVERY_RESULTS.TERMINAL_ERROR,
  DELIVERY_RESULTS.NO_PROVIDER_CONFIGURED,
  DELIVERY_RESULTS.DRY_RUN,
  DELIVERY_RESULTS.UNKNOWN_RESULT,
])

/**
 * Harte Obergrenze fuer einen Zustellversuch. Ohne sie haengt der Worker an
 * einem nicht antwortenden Provider, bis dessen Client irgendwann aufgibt —
 * heute gibt es an keiner Stelle einen ausdruecklichen Wert.
 */
const CRM_DELIVERY_TIMEOUT_MS = 10_000

const DELIVERY_CHANNELS = Object.freeze({
  CRM: 'CRM',
  MAIL: 'MAIL',
})

module.exports = {
  CRM_DELIVERY_TIMEOUT_MS,
  DEDUP_POLICIES,
  JOURNEY_FOUNDATION_STATES,
  PENDING_DELIVERY_STATUSES,
  RETENTION_POLICY_DAYS,
  JOURNEY_REGISTRY,
  LEAD_JOURNEYS,
  LEAD_STATUSES,
  NON_DELIVERY_RESULTS,
  OUTBOX_STATUSES,
  DELIVERY_RESULTS,
  DELIVERY_CHANNELS,
}
