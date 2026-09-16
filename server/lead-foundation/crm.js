const {
  CRM_DELIVERY_TIMEOUT_MS,
  DELIVERY_RESULTS,
  JOURNEY_REGISTRY,
  LEAD_JOURNEYS,
} = require('./constants')
const { withDeliveryGuards } = require('./crm-delivery')
const { resolveDeliveryMode } = require('./environment')

/**
 * AP22 PT22.1 — aus der Journey-Registry ABGELEITET, nicht daneben gepflegt.
 * Vorher standen Journeys und CRM-Ziele an zwei Stellen; eine neue Journey
 * ohne Route haette den `CrmRouter`-Konstruktor beim Start zerlegt.
 */
const DEFAULT_JOURNEY_ROUTES = Object.freeze(
  Object.fromEntries(JOURNEY_REGISTRY.map((journey) => [journey.id, journey.crmTarget])),
)

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

/**
 * AP22 PT22.3 — der Router ist die EINZIGE Stelle, an der ein Zielsystem
 * gewaehlt wird.
 *
 * Das Ziel kommt ausschliesslich aus der Journey des gespeicherten Leads,
 * niemals aus einem Request. Ein Absender kann sich damit kein Zielsystem
 * aussuchen — genau die Schwachstelle, die der Praxisbestellpfad heute noch
 * hat, wo ein deutscher Freitext im Formularfeld `area` ueber den
 * Mailempfaenger entscheidet (`LDC-06`, PT22.4).
 *
 * Jeder aufgeloeste Adapter wird durch die Zustellgrenze gereicht: Timeout,
 * DRY_RUN und Ergebnisklassifikation gelten damit fuer ALLE sieben Journeys,
 * ohne dass ein Slice daran denken muss.
 */
class CrmRouter {
  constructor({
    routes = DEFAULT_JOURNEY_ROUTES,
    adapters = {},
    timeoutMs = CRM_DELIVERY_TIMEOUT_MS,
    /**
     * Default aus der Umgebung: der Trockenlauf darf nicht davon abhaengen,
     * dass ein Aufrufer daran denkt, ihn durchzureichen.
     *
     * AP22 PT22.8 — nicht mehr nur das Flag. Eine Umgebung, die sich als
     * `preview`/`staging` ausweist, ist ZWINGEND im Trockenlauf; das Flag
     * kann das nur zusaetzlich einschalten, nie aufheben.
     */
    dryRun = resolveDeliveryMode(process.env).dryRun,
  } = {}) {
    this.routes = { ...routes }
    this.adapters = { ...adapters }
    this.timeoutMs = timeoutMs
    this.dryRun = dryRun === true
    for (const journey of LEAD_JOURNEYS) {
      if (!this.routes[journey]) throw new TypeError(`CRM route missing for journey: ${journey}`)
    }
    // Ein Adapter fuer ein Ziel, das keine Journey ansteuert, waere ein
    // stiller Nebenweg. Er wird abgelehnt, nicht ignoriert.
    const known = new Set(Object.values(this.routes))
    for (const target of Object.keys(this.adapters)) {
      if (!known.has(target)) throw new TypeError(`CRM adapter for unknown target: ${target}`)
    }
    this.guarded = new Map()
  }

  resolve(lead) {
    const target = this.routes[lead.journey]
    if (!target) throw new TypeError('CRM route is not configured for journey')
    if (!this.guarded.has(target)) {
      const adapter = this.adapters[target] || createNoProviderConfiguredAdapter(target)
      this.guarded.set(
        target,
        withDeliveryGuards(adapter, { timeoutMs: this.timeoutMs, dryRun: this.dryRun }),
      )
    }
    return { target, adapter: this.guarded.get(target) }
  }

  /** Welche Ziele wirklich einen Adapter haben — fuer ehrliche Berichte. */
  describeTargets() {
    return Object.entries(this.routes).map(([journey, target]) => ({
      journey,
      target,
      adapterConfigured: Boolean(this.adapters[target]),
      dryRun: this.dryRun,
    }))
  }
}

module.exports = {
  CrmAdapter,
  CrmRouter,
  DEFAULT_JOURNEY_ROUTES,
  NoProviderConfiguredCrmAdapter,
  createNoProviderConfiguredAdapter,
}
