const {
  CrmAdapter,
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  PENDING_DELIVERY_STATUSES,
  openLeadDatabase,
} = require('./lead-foundation')
const { EntitlementError, EntitlementRepository } = require('./lead-foundation/entitlements')
const { AssetResolutionError, resolveProtectedAsset } = require('./protected-assets')

/**
 * `content_download` — der wiederverwendbare Lead-Magnet-Vertical-Slice.
 *
 * REIHENFOLGE, und sie ist der Punkt der ganzen Datei:
 *
 *   validieren → Asset aus der Allowlist aufloesen → Consent pruefen
 *   → PERSISTIEREN → CRM/Outbox → Entitlement → Status
 *
 * Persistenz kommt vor jedem externen Handoff. Faellt der CRM-Provider aus,
 * ist der Lead trotzdem dauerhaft da und die Ressource wird trotzdem
 * ausgeliefert — das Geschaeft haengt nicht am Provider. Umgekehrt wird kein
 * Provider-Erfolg behauptet, den es nicht gab: `providerConfigured` sagt die
 * Wahrheit.
 *
 * AP22-GRENZE: das hier ist EIN Journey-Slice auf der gemeinsamen Lead
 * Foundation, keine zweite Lead-Plattform. Persistenz, Idempotency, Outbox,
 * Retry und CRM-Routing sind unveraendert die geteilten Primitive.
 */

const JOURNEY = 'content_download'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const SOURCES = new Set(['resource-center', 'epigenetics', 'article', 'campaign'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONSENT_VERSION = 'content-download-2026-09'

class ContentDownloadValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'ContentDownloadValidationError'
    this.code = code
    this.fields = fields
  }
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function optionalEnum(value, values) {
  const normalized = text(value, 128)
  return normalized && values.has(normalized) ? normalized : ''
}

/**
 * Die Herkunftsroute darf nur eine eigene Seite sein. Ohne diese Klammer
 * koennte ein Absender eine fremde URL in den Lead schreiben.
 */
function normalizeOriginRoute(value, locale) {
  const route = text(value, 512)
  if (!route || route.startsWith('//') || !route.startsWith(`/${locale}/`)) {
    return `/${locale}/downloads`
  }
  return route
}

function normalizeRequest(body = {}) {
  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const organization = text(body.organization, 200)
  const locale = optionalEnum(body.locale, SUPPORTED_LOCALES)
  const assetId = text(body.assetId, 64)
  const source = optionalEnum(body.source, SOURCES) || 'resource-center'
  const campaign = text(body.campaign, 128)

  const invalid = []
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (organization.length < 2) invalid.push('organization')
  if (!locale) invalid.push('locale')
  if (!assetId) invalid.push('assetId')
  if (body.source && !SOURCES.has(body.source)) invalid.push('source')
  if (invalid.length) throw new ContentDownloadValidationError('VALIDATION_FAILED', invalid)

  return {
    subject: { name, email, organization },
    assetId,
    locale,
    source,
    campaign,
    originRoute: normalizeOriginRoute(body.originRoute, locale),
  }
}

/**
 * Consent wird GETRENNT gefuehrt: ohne Verarbeitungs-Einwilligung laeuft gar
 * nichts, Marketing ist davon unabhaengig und optional. Analytics-Einwilligung
 * ist an keiner Stelle Voraussetzung fuer diesen Ablauf.
 */
function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true) {
    throw new ContentDownloadValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new ContentDownloadValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
  }
  return {
    processingAccepted: true,
    acceptedAt,
    version: CONSENT_VERSION,
    marketing: body.marketingConsent === true ? 'GRANTED' : 'DENIED',
  }
}

/** Der Link, den der Leser bekommt. Asset-ID im Pfad, nie ein Dateiname. */
function downloadUrl({ assetId, entitlementId, token }) {
  const query = new URLSearchParams({ e: entitlementId, t: token })
  return `/api/content-download/asset/${encodeURIComponent(assetId)}?${query.toString()}`
}

function publicState({ lead, entitlement, token, asset }) {
  return {
    accepted: Boolean(lead?.id),
    leadId: lead?.id,
    status: lead?.status,
    deliveryPending: PENDING_DELIVERY_STATUSES.includes(lead?.status),
    providerConfigured:
      lead?.lastErrorClass === 'NO_PROVIDER_CONFIGURED'
        ? false
        : lead?.status === 'DELIVERED'
          ? true
          : undefined,
    assetId: asset.assetId,
    // Angefragte und gelieferte Sprache stehen getrennt in der Antwort, damit
    // die Oberflaeche eine Abweichung benennen kann statt sie zu verschweigen.
    deliveredLanguage: asset.language,
    entitlementId: entitlement.id,
    expiresAt: entitlement.expiresAt,
    downloadUrl: downloadUrl({ assetId: asset.assetId, entitlementId: entitlement.id, token }),
  }
}

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * CRM-Adapter der `resources`-Route (AP22 PT22.6).
 *
 * VORHER: dieser Slice baute `new CrmRouter()` OHNE Adapter. Jeder gegatete
 * Download wurde persistiert und danach terminal mit
 * `NO_PROVIDER_CONFIGURED` abgelegt — der Lead-Magnet erzeugte Leads, die
 * niemand las.
 *
 * SICHERHEITSGRENZE: diese Mail enthaelt NIEMALS das Download-Token oder die
 * Download-URL. Sie kann es strukturell nicht: das Token wird nie
 * gespeichert, nur sein SHA-256, und der Adapter sieht ausschliesslich den
 * Lead aus der Datenbank. Die Nutzerin bekommt den Link in der
 * HTTP-Antwort — der Team-Hinweis nennt nur, WER WELCHES Asset angefordert
 * hat. Ein Link in einer Team-Mail waere ein zweiter, unkontrollierter Weg
 * an der Entitlement-Pruefung vorbei.
 */
class SendGridResourceLeadAdapter extends CrmAdapter {
  constructor({ send, recipient, sender }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!recipient || !sender) throw new TypeError('recipient and sender are required')
    this.send = send
    this.recipient = recipient
    this.sender = sender
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const rows = [
      ['Name', subject.name],
      ['E-Mail', subject.email],
      ['Organisation', subject.organization],
      ['Asset-ID', context.assetId],
      ['Angefragte Sprache', context.requestedLanguage],
      ['Gelieferte Sprache', context.deliveredLanguage],
      ['Quelle', context.source],
      ['Kampagne', context.campaign],
      ['Herkunftsroute', context.originRoute],
    ]

    try {
      await this.send({
        to: this.recipient,
        from: this.sender,
        replyTo: subject.email,
        subject: `[${String(context.locale || 'de').toUpperCase()}] Download angefordert: ${context.assetId || 'unbekannt'}`,
        text: [
          'Neue Anforderung eines gegateten Dokuments.',
          '',
          ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
          '',
          'Hinweis: Der Downloadlink wird ausschliesslich der Anforderin in der',
          'Antwort ausgeliefert und steht bewusst NICHT in dieser Mail.',
        ].join('\n'),
        html: `<h3>Neue Anforderung eines gegateten Dokuments</h3>
<table style="border-collapse:collapse;width:100%;max-width:600px;">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${escHtml(label)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(value || '-')}</td></tr>`,
  )
  .join('')}
</table>
<p style="color:#64748b;font-size:12px;">Der Downloadlink wird ausschliesslich der Anforderin in der Antwort ausgeliefert und steht bewusst nicht in dieser Mail.</p>`,
      })
      return { status: 'DELIVERED' }
    } catch (error) {
      const statusCode = Number(error?.response?.statusCode ?? 0)
      const errorCode = String(error?.code || '')
      // AP26 PT26.4: nur ein eindeutiger 5xx ist wiederholbar. ETIMEDOUT/ECONNRESET bleiben
      // unveraendert und werden an der Zustellgrenze als UNBEKANNT eingestuft — vorher
      // machte dieser Zweig daraus SENDGRID_TEMPORARY und sendete blind nach.
      if (statusCode >= 500) {
        throw Object.assign(new Error('SENDGRID_TEMPORARY'), {
          code: 'SENDGRID_TEMPORARY',
          retryable: true,
        })
      }
      throw error
    }
  }
}

function createContentDownloadService({
  repository,
  entitlements,
  worker,
  resolveAsset = resolveProtectedAsset,
}) {
  if (!repository || !entitlements || !worker) {
    throw new TypeError('repository, entitlements and worker are required')
  }

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) {
        throw new ContentDownloadValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      }
      // Honeypot: still annehmen, nichts persistieren, nichts ausliefern.
      if (body?._hp) return { ignored: true }

      const request = normalizeRequest(body)

      // Asset VOR dem Consent und vor der Persistenz aufloesen: ein Lead fuer
      // ein Asset, das es nicht gibt oder das gar nicht gegatet ist, soll
      // erst gar nicht entstehen.
      let asset
      try {
        asset = resolveAsset(request.assetId, request.locale)
      } catch (error) {
        if (error instanceof AssetResolutionError) {
          throw new ContentDownloadValidationError(error.code, ['assetId'])
        }
        throw error
      }

      const consent = normalizeConsentEvidence(body)

      const lead = repository.createLead({
        journey: JOURNEY,
        idempotencyKey: key,
        subject: request.subject,
        context: {
          locale: request.locale,
          source: request.source,
          campaign: request.campaign,
          originRoute: request.originRoute,
          assetId: asset.assetId,
          requestedLanguage: request.locale,
          deliveredLanguage: asset.language,
        },
        consent,
        channels: ['CRM'],
      })

      // Erst jetzt darf ein externer Handoff laufen. Der Lead ist committet.
      await worker.processNext()

      const { entitlement, token, rotated } = entitlements.issue({
        leadId: lead.id,
        journey: JOURNEY,
        assetId: asset.assetId,
        assetLanguage: asset.language,
      })
      repository.addEvent(
        lead.id,
        null,
        rotated ? 'ENTITLEMENT_ROTATED' : 'ENTITLEMENT_ISSUED',
        lead.status,
        null,
        null,
      )

      return publicState({ lead: repository.getLead(lead.id), entitlement, token, asset })
    },

    /**
     * Einloesen. Der Client liefert Asset-ID und Token — nie einen Pfad.
     * Reihenfolge: Anspruch pruefen, DANN aufloesen. Ein ungueltiges Token
     * erfaehrt nichts ueber die Existenz der Datei.
     */
    redeem({ assetId, entitlementId, token, env }) {
      const id = text(assetId, 64)
      const entitlement = entitlements.redeem({
        entitlementId: text(entitlementId, 64),
        token: typeof token === 'string' ? token : '',
        assetId: id,
      })
      const asset = resolveAsset(id, entitlement.assetLanguage, env)
      return { entitlement, asset }
    },

    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimeContentDownloadService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  const recipient = env.RESOURCE_LEAD_RECEIVER || env.CONTACT_RECEIVER
  if (mailer && env.SENDGRID_API_KEY && recipient && env.SENDER_EMAIL) {
    adapters.resources = new SendGridResourceLeadAdapter({
      send: (msg) => mailer.send(msg),
      recipient,
      sender: env.SENDER_EMAIL,
    })
  }
  runtime = createContentDownloadService({
    repository,
    entitlements: new EntitlementRepository(db),
    worker: new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters }),
      workerId: `content-download-${process.pid}`,
      // Nur die eigene Journey: sonst uebernimmt dieser Worker fremde
      // Auftraege, fuer die sein Router keinen Adapter hat.
      journeys: [JOURNEY],
    }),
  })
  return runtime
}

module.exports = {
  SendGridResourceLeadAdapter,
  CONSENT_VERSION,
  ContentDownloadValidationError,
  EntitlementError,
  IdempotencyConflictError,
  JOURNEY,
  createContentDownloadService,
  downloadUrl,
  getRuntimeContentDownloadService,
  normalizeRequest,
}
