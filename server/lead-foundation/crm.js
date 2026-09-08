const { DELIVERY_RESULTS, LEAD_JOURNEYS } = require('./constants')

const DEFAULT_JOURNEY_ROUTES = Object.freeze({
  contact: 'general-sales',
  support: 'support',
  consumer_order: 'consumer',
  content_download: 'resources',
  epigenetics_inquiry: 'epigenetics',
})

class CrmAdapter {
  async deliver(_delivery) {
    throw new Error('CRM adapter must implement deliver()')
  }
}

class NoProviderConfiguredCrmAdapter extends CrmAdapter {
  constructor(target) {
    super()
    this.target = target
  }

  async deliver() {
    return {
      status: DELIVERY_RESULTS.NO_PROVIDER_CONFIGURED,
      errorClass: 'NO_PROVIDER_CONFIGURED',
    }
  }
}

function createNoProviderConfiguredAdapter(target) {
  return Object.freeze(new NoProviderConfiguredCrmAdapter(target))
}

class CrmRouter {
  constructor({ routes = DEFAULT_JOURNEY_ROUTES, adapters = {} } = {}) {
    this.routes = { ...routes }
    this.adapters = { ...adapters }
    for (const journey of LEAD_JOURNEYS) {
      if (!this.routes[journey]) throw new TypeError(`CRM route missing for journey: ${journey}`)
    }
  }

  resolve(lead) {
    const target = this.routes[lead.journey]
    if (!target) throw new TypeError('CRM route is not configured for journey')
    return {
      target,
      adapter: this.adapters[target] || createNoProviderConfiguredAdapter(target),
    }
  }
}

module.exports = {
  CrmAdapter,
  CrmRouter,
  DEFAULT_JOURNEY_ROUTES,
  NoProviderConfiguredCrmAdapter,
  createNoProviderConfiguredAdapter,
}
