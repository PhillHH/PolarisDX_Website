const { DELIVERY_CHANNELS, DELIVERY_RESULTS } = require('./constants')

function safeErrorClass(error) {
  const candidate = error && (error.code || error.name)
  return /^[A-Z][A-Z0-9_]{0,63}$/.test(String(candidate || ''))
    ? String(candidate)
    : 'UNCLASSIFIED_PROVIDER_ERROR'
}

function classifyThrownProviderError(error) {
  const code = safeErrorClass(error)
  const resultUnknown = code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'EPIPE'
  return {
    status:
      error && error.retryable === true
        ? DELIVERY_RESULTS.RETRYABLE_ERROR
        : DELIVERY_RESULTS.TERMINAL_ERROR,
    errorClass: resultUnknown && error?.retryable !== true ? 'PROVIDER_RESULT_UNKNOWN' : code,
  }
}

class LeadHandoffWorker {
  constructor({
    repository,
    router,
    workerId,
    channel = DELIVERY_CHANNELS.CRM,
    maxAttempts = 3,
    retryDelayMs = 1_000,
    logger = { info() {}, warn() {} },
  }) {
    this.repository = repository
    this.router = router
    this.workerId = workerId
    this.channel = channel
    this.maxAttempts = maxAttempts
    this.retryDelayMs = retryDelayMs
    this.logger = logger
  }

  async processNext() {
    const claim = this.repository.claimNext({ workerId: this.workerId, channel: this.channel })
    if (!claim) return null
    const { target, adapter } = this.router.resolve(claim.lead)
    this.logger.info('lead_handoff_attempt', {
      leadId: claim.lead.id,
      journey: claim.lead.journey,
      status: claim.lead.status,
      attempt: claim.attempt,
      target,
    })

    let result
    try {
      result = await adapter.deliver({
        lead: claim.lead,
        target,
        deliveryKey: claim.deliveryKey,
      })
    } catch (error) {
      result = classifyThrownProviderError(error)
    }

    if (result.status === DELIVERY_RESULTS.DELIVERED) {
      const lead = this.repository.markDelivered(claim)
      this.logger.info('lead_handoff_delivered', {
        leadId: lead.id,
        journey: lead.journey,
        status: lead.status,
        attempt: claim.attempt,
        target,
      })
      return lead
    }

    const retryable = result.status === DELIVERY_RESULTS.RETRYABLE_ERROR
    const errorClass =
      result.status === DELIVERY_RESULTS.NO_PROVIDER_CONFIGURED
        ? 'NO_PROVIDER_CONFIGURED'
        : safeErrorClass({ code: result.errorClass })
    const lead = this.repository.markFailed(claim, {
      retryable,
      errorClass,
      maxAttempts: this.maxAttempts,
      retryDelayMs: this.retryDelayMs,
    })
    this.logger.warn('lead_handoff_not_delivered', {
      leadId: lead.id,
      journey: lead.journey,
      status: lead.status,
      attempt: claim.attempt,
      errorClass,
      target,
    })
    return lead
  }
}

module.exports = { classifyThrownProviderError, LeadHandoffWorker, safeErrorClass }
