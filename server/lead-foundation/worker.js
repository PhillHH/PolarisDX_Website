const { DELIVERY_CHANNELS, DELIVERY_RESULTS } = require('./constants')
const { classifyProviderError, crmLogFields, safeErrorClass } = require('./crm-delivery')
const { DEFAULT_RETRY_POLICY, nextAttemptDelayMs, normalizePolicy } = require('./retry-policy')

/**
 * AP22 PT22.3 — die Klassifikation liegt jetzt an der CRM-Grenze
 * (`crm-delivery.js`), nicht mehr hier. Der Worker uebersetzt nur noch ein
 * bereits klassifiziertes Ergebnis in einen Datenbankzustand.
 *
 * @deprecated Nutze `classifyProviderError` aus `crm-delivery.js`.
 */
const classifyThrownProviderError = classifyProviderError

/**
 * Wie ein Zustellergebnis auf den Datensatz wirkt.
 *
 * Nur `DELIVERED` ist Erfolg. Alles andere wird als Nicht-Zustellung
 * festgehalten — mit dem Unterschied, der zaehlt: `retryable` sagt, ob
 * automatisch erneut versucht werden darf. Bei `UNKNOWN_RESULT` und `DRY_RUN`
 * darf das ausdruecklich NICHT passieren, aus verschiedenen Gruenden: beim
 * unbekannten Ergebnis, weil sonst eine zweite Mail beim Empfaenger landen
 * koennte; beim Trockenlauf, weil in dieser Umgebung gar nicht zugestellt
 * werden soll.
 */
const RESULT_HANDLING = Object.freeze({
  [DELIVERY_RESULTS.RETRYABLE_ERROR]: { retryable: true, errorClass: null },
  [DELIVERY_RESULTS.TERMINAL_ERROR]: { retryable: false, errorClass: null },
  [DELIVERY_RESULTS.NO_PROVIDER_CONFIGURED]: {
    retryable: false,
    errorClass: 'NO_PROVIDER_CONFIGURED',
  },
  [DELIVERY_RESULTS.UNKNOWN_RESULT]: { retryable: false, errorClass: 'PROVIDER_RESULT_UNKNOWN' },
  [DELIVERY_RESULTS.DRY_RUN]: { retryable: false, errorClass: 'DRY_RUN' },
})

class LeadHandoffWorker {
  constructor({
    repository,
    router,
    workerId,
    channel = DELIVERY_CHANNELS.CRM,
    /**
     * AP22 PT22.4 — die Wiederholungspolitik ersetzt den festen Abstand.
     * `maxAttempts`/`retryDelayMs` bleiben als Kurzform akzeptiert, damit
     * bestehende Aufrufer unveraendert funktionieren.
     */
    retryPolicy = null,
    maxAttempts = DEFAULT_RETRY_POLICY.maxAttempts,
    retryDelayMs = DEFAULT_RETRY_POLICY.baseDelayMs,
    /** Einspeisbar, damit ein Test die Streuung ohne Zufall pruefen kann. */
    random = Math.random,
    /**
     * AP22 PT22.4 — fuer welche Journeys dieser Worker zustaendig ist.
     * `null` heisst "alle" und ist nur fuer einen Worker richtig, dessen
     * Router auch alle Ziele bedienen kann. Ein Slice-Worker gibt hier
     * seine eigene Journey an, sonst greift er fremde Arbeit ab, die er
     * nicht zustellen kann.
     */
    journeys = null,
    logger = { info() {}, warn() {} },
  }) {
    this.repository = repository
    this.router = router
    this.workerId = workerId
    this.channel = channel
    this.policy = normalizePolicy(retryPolicy ?? { maxAttempts, baseDelayMs: retryDelayMs })
    this.maxAttempts = this.policy.maxAttempts
    this.retryDelayMs = this.policy.baseDelayMs
    this.random = random
    this.journeys = journeys === null ? null : [...journeys]
    this.logger = logger
  }

  async processNext() {
    const claim = this.repository.claimNext({
      workerId: this.workerId,
      channel: this.channel,
      journeys: this.journeys,
    })
    if (!claim) return null
    const { target, adapter } = this.router.resolve(claim.lead)
    this.logger.info(
      'lead_handoff_attempt',
      crmLogFields({
        leadId: claim.lead.id,
        journey: claim.lead.journey,
        target,
        attempt: claim.attempt,
        status: claim.lead.status,
        deliveryKey: claim.deliveryKey,
      }),
    )

    // Der Adapter kommt aus dem Router und traegt die Zustellgrenze bereits
    // in sich (Timeout, DRY_RUN, Klassifikation). Ein `throw` hier waere ein
    // Defekt der Grenze, kein Providerfehler — deshalb wird er trotzdem
    // klassifiziert, statt den Worker zu beenden.
    let result
    try {
      result = await adapter.deliver({
        lead: claim.lead,
        target,
        deliveryKey: claim.deliveryKey,
      })
    } catch (error) {
      result = classifyProviderError(error)
    }

    if (result.status === DELIVERY_RESULTS.DELIVERED) {
      const lead = this.repository.markDelivered(claim)
      this.logger.info(
        'lead_handoff_delivered',
        crmLogFields({
          leadId: lead.id,
          journey: lead.journey,
          target,
          attempt: claim.attempt,
          status: lead.status,
          deliveryKey: claim.deliveryKey,
        }),
      )
      return lead
    }

    const handling = RESULT_HANDLING[result.status] ?? {
      retryable: false,
      errorClass: 'UNCLASSIFIED_PROVIDER_RESULT',
    }
    const errorClass = handling.errorClass ?? safeErrorClass({ code: result.errorClass })
    // Exponentiell mit Streuung: bei einem laenger anhaltenden Ausfall
    // waechst der Abstand, und die wartenden Auftraege laufen nicht im
    // Gleichtakt auf den sich gerade erholenden Provider zu.
    const lead = this.repository.markFailed(claim, {
      retryable: handling.retryable,
      errorClass,
      maxAttempts: this.policy.maxAttempts,
      retryDelayMs: nextAttemptDelayMs({
        attempt: claim.attempt,
        policy: this.policy,
        random: this.random,
      }),
    })
    this.logger.warn(
      'lead_handoff_not_delivered',
      crmLogFields({
        leadId: lead.id,
        journey: lead.journey,
        target,
        attempt: claim.attempt,
        status: lead.status,
        errorClass,
        deliveryKey: claim.deliveryKey,
      }),
    )
    return lead
  }
}

module.exports = { classifyThrownProviderError, LeadHandoffWorker, RESULT_HANDLING, safeErrorClass }
