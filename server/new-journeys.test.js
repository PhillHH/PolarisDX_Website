// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.6 — `epigenetics_inquiry` und `content_download` formal abnehmen.
 *
 * Beide waren bereits persistent, idempotent und consent-getrennt. Was
 * fehlte, war der Zustellweg: beide Slices bauten `new CrmRouter()` OHNE
 * Adapter, jede Anfrage endete also nach sauberer Speicherung terminal mit
 * `NO_PROVIDER_CONFIGURED`. Ehrlich gemeldet — aber niemand hat je eine
 * Epigenetik-Anfrage oder einen Lead-Magnet-Download gesehen.
 *
 * Die AP19-Sicherheitsgrenze darf dabei nicht schwaecher werden: das
 * Download-Token gehoert in die HTTP-Antwort der Anforderin und NIRGENDWO
 * sonst hin.
 */

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  JOURNEY_FOUNDATION_STATES,
  JOURNEY_REGISTRY,
  LEAD_JOURNEYS,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')
const {
  SendGridEpigeneticsInquiryAdapter,
  createEpigeneticsInquiryService,
} = require('./epigenetics-inquiry')
const { SendGridResourceLeadAdapter, createContentDownloadService } = require('./content-download')

/** Quelltext ohne Kommentare — sonst schlagen Erklaerungen als Verstoss an. */
const codeOf = (path) =>
  readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//gu, ' ')
    .replace(/(^|[^:])\/\/.*$/gmu, '$1')

const stack = (createService, { journey, target, deliver, extra = {} } = {}) => {
  const db = openLeadDatabase({ filename: ':memory:' })
  const repository = new LeadRepository(db)
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters: deliver ? { [target]: { deliver } } : {} }),
    workerId: 'pt226',
    journeys: [journey],
    retryDelayMs: 0,
  })
  return { db, repository, worker, service: createService({ repository, worker, ...extra }) }
}

const epiBody = (overrides = {}) => ({
  name: 'Dr. Ada Beispiel',
  email: 'Ada@Praxis.example',
  organization: 'Zentrum Nord',
  facilityType: 'practice',
  casesPerMonth: '11-25',
  message: 'Bitte um Beratung.',
  panel: 'healthy-aging',
  focus: 'longevity',
  locale: 'de',
  source: 'epigenetics',
  campaign: 'launch',
  processingConsent: true,
  consentAcceptedAt: '2026-09-09T08:00:00.000Z',
  ...overrides,
})

describe('PT22.6 · epigenetics_inquiry', () => {
  const build = (options) =>
    stack(createEpigeneticsInquiryService, {
      journey: 'epigenetics_inquiry',
      target: 'epigenetics',
      ...options,
    })

  it('persistiert Panel, Fokus, Quelle und Kampagne im Kontext', async () => {
    const { service, repository } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const state = await service.submit({ body: epiBody(), idempotencyKey: 'e1' })
    const lead = repository.getLead(state.leadId)

    expect(lead.journey).toBe('epigenetics_inquiry')
    expect(lead.context).toMatchObject({
      locale: 'de',
      panel: 'healthy-aging',
      focus: 'longevity',
      source: 'epigenetics',
      campaign: 'launch',
    })
    expect(lead.context.originRoute).toMatch(/^\/de\//u)
    expect(lead.subject.email).toBe('ada@praxis.example')
    expect(lead.consent.processingAccepted).toBe(true)
    expect(lead.consent.marketing).toBe('DENIED')
    // Persistenz vor Handoff.
    expect(
      repository
        .getEvents(lead.id)
        .map((event) => event.eventType)
        .slice(0, 4),
    ).toEqual(['LEAD_RECEIVED', 'LEAD_VALIDATED', 'LEAD_PERSISTED', 'HANDOFF_PENDING'])
  })

  it('haelt Marketing-Consent getrennt und optional', async () => {
    const { service, repository } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const granted = await service.submit({
      body: epiBody({ marketingConsent: true }),
      idempotencyKey: 'e-m1',
    })
    expect(repository.getLead(granted.leadId).consent.marketing).toBe('GRANTED')
    // Und ohne Marketing-Einwilligung laeuft die Anfrage vollstaendig durch.
    const denied = await service.submit({ body: epiBody(), idempotencyKey: 'e-m0' })
    expect(denied.accepted).toBe(true)
  })

  it('verlangt Verarbeitungs-Consent mit Nachweis', async () => {
    const { service } = build()
    await expect(
      service.submit({ body: epiBody({ processingConsent: false }), idempotencyKey: 'e-c1' }),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })
    await expect(
      service.submit({
        body: epiBody({ consentAcceptedAt: 'irgendwann' }),
        idempotencyKey: 'e-c2',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_CONSENT_EVIDENCE' })
  })

  it('ist idempotent und meldet einen Konflikt', async () => {
    const { service, db } = build({ deliver: async () => ({ status: 'DELIVERED' }) })
    const first = await service.submit({ body: epiBody(), idempotencyKey: 'e-same' })
    const replay = await service.submit({ body: epiBody(), idempotencyKey: 'e-same' })
    expect(replay.leadId).toBe(first.leadId)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(1)
    await expect(
      service.submit({ body: epiBody({ message: 'anders' }), idempotencyKey: 'e-same' }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' })
  })

  it('wiederholt einen transienten Fehler und stellt danach zu', async () => {
    let attempts = 0
    const { service, worker, repository } = build({
      deliver: async () => {
        attempts += 1
        if (attempts === 1) {
          throw Object.assign(new Error('t'), { code: 'SENDGRID_TEMPORARY', retryable: true })
        }
        return { status: 'DELIVERED' }
      },
    })
    const state = await service.submit({ body: epiBody(), idempotencyKey: 'e-retry' })
    expect(repository.getLead(state.leadId).status).toBe('RETRY_PENDING')
    await worker.processNext()
    expect(repository.getLead(state.leadId).status).toBe('DELIVERED')
    expect(attempts).toBe(2)
  })

  it('spielt ein unbekanntes Providerergebnis nicht nach', async () => {
    let calls = 0
    const { service, worker, repository } = build({
      deliver: async () => {
        calls += 1
        throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })
      },
    })
    const state = await service.submit({ body: epiBody(), idempotencyKey: 'e-unknown' })
    const lead = repository.getLead(state.leadId)
    expect(lead.status).toBe('RECONCILIATION_REQUIRED')
    expect(lead.reconciliationReason).toBe('PROVIDER_RESULT_UNKNOWN')
    expect(await worker.processNext()).toBeNull()
    expect(calls).toBe(1)
  })

  it('stellt jetzt wirklich zu — an einen fest verdrahteten Empfaenger', async () => {
    // Vorher gab es hier gar keinen Adapter: jede Anfrage endete terminal.
    const sent = []
    const adapter = new SendGridEpigeneticsInquiryAdapter({
      send: async (message) => {
        sent.push(message)
      },
      recipient: 'epi@polarisdx.example',
      sender: 'web@polarisdx.example',
    })
    const { service } = build({ deliver: (delivery) => adapter.deliver(delivery) })
    await service.submit({
      body: epiBody({ to: 'angreifer@example.com', recipient: 'angreifer@example.com' }),
      idempotencyKey: 'e-mail',
    })
    expect(sent).toHaveLength(1)
    expect(sent[0].to).toBe('epi@polarisdx.example')
    // Kein Empfaenger aus dem Formular.
    expect(JSON.stringify(sent[0])).not.toContain('angreifer@example.com')
    // Panel und Fokus stehen drin, damit der Vertrieb den Kontext hat.
    expect(sent[0].text).toContain('healthy-aging')
    expect(sent[0].text).toContain('longevity')

    // Und selbst wenn ein Empfaengerfeld IM LEAD stuende — etwa weil die
    // Validierung eines Tages ein Feld durchliesse —, waehlt der Adapter
    // ausschliesslich seinen eigenen Empfaenger.
    sent.length = 0
    await adapter.deliver({
      lead: {
        subject: {
          name: 'X',
          email: 'x@example.com',
          to: 'angreifer@example.com',
          recipient: 'angreifer@example.com',
          bcc: 'angreifer@example.com',
        },
        context: { locale: 'de' },
      },
    })
    expect(sent[0].to).toBe('epi@polarisdx.example')
    expect(sent[0].bcc).toBeUndefined()
    expect(JSON.stringify(sent[0])).not.toContain('angreifer@example.com')
  })

  it('behauptet ohne konfigurierten Provider keine Zustellung', async () => {
    const { service } = build()
    const state = await service.submit({ body: epiBody(), idempotencyKey: 'e-np' })
    expect(state.accepted).toBe(true)
    expect(state.providerConfigured).toBe(false)
    expect(state.status).not.toBe('DELIVERED')
  })
})

describe('PT22.6 · content_download', () => {
  it('stellt den Ressourcen-Lead zu — OHNE Token und OHNE Downloadlink', () => {
    // Die AP19-Grenze: das Token steht in der Antwort an die Anforderin und
    // nirgendwo sonst. Es wird nie gespeichert (nur sein SHA-256), der
    // Adapter sieht also ausschliesslich den Lead aus der Datenbank.
    const sent = []
    const adapter = new SendGridResourceLeadAdapter({
      send: async (message) => {
        sent.push(message)
      },
      recipient: 'resources@polarisdx.example',
      sender: 'web@polarisdx.example',
    })
    return adapter
      .deliver({
        lead: {
          subject: { name: 'Dr. Ada Beispiel', email: 'ada@praxis.example', organization: 'Nord' },
          context: {
            locale: 'de',
            assetId: 'whitepaper-01',
            requestedLanguage: 'de',
            deliveredLanguage: 'en',
            source: 'resource_center',
            campaign: 'launch',
          },
        },
      })
      .then((result) => {
        expect(result.status).toBe('DELIVERED')
        expect(sent[0].to).toBe('resources@polarisdx.example')
        const serialized = JSON.stringify(sent[0])
        // Asset und Sprachabweichung stehen drin.
        expect(serialized).toContain('whitepaper-01')
        expect(sent[0].text).toContain('Angefragte Sprache: de')
        expect(sent[0].text).toContain('Gelieferte Sprache: en')
        // Aber niemals ein Link oder ein Token.
        expect(serialized).not.toMatch(/\/api\/content-download\/asset\//u)
        expect(serialized).not.toContain('token')
        expect(serialized).not.toMatch(/[A-Za-z0-9_-]{40,}/u)
      })
  })

  it('kann das Token strukturell gar nicht sehen', () => {
    // Der Adapter bekommt nur `lead`. Das Token existiert dort nicht, weil
    // die Entitlement-Tabelle ausschliesslich seinen Hash speichert.
    const entitlements = readFileSync('server/lead-foundation/entitlements.js', 'utf8')
    expect(entitlements).toContain('hashToken')
    expect(entitlements).toMatch(/token_hash/u)
    // Kein Klartext-Token in einer Spalte.
    const migration = readFileSync(
      'server/lead-foundation/migrations/002_resource_entitlements.sql',
      'utf8',
    )
    expect(migration).toContain('token_hash TEXT NOT NULL UNIQUE')
    expect(migration).not.toMatch(/^\s*token TEXT/mu)

    const adapter = readFileSync('server/content-download.js', 'utf8')
    const start = adapter.indexOf('class SendGridResourceLeadAdapter')
    const body = adapter.slice(start, adapter.indexOf('function createContentDownloadService'))
    // Der Adapter ruft die Link-Erzeugung nicht auf.
    expect(body).not.toContain('downloadUrl(')
    expect(body).not.toContain('token')
  })

  it('behaelt die AP19-Schutzmerkmale des Auslieferungspfads', () => {
    const source = readFileSync('server/content-download.js', 'utf8')
    const assets = readFileSync('server/protected-assets.js', 'utf8')
    // Asset-Aufloesung ueber die Registry, nie ueber einen Request-Pfad.
    expect(assets).toMatch(/registry|resolveProtectedAsset/iu)
    expect(source).toContain('resolveProtectedAsset')
    // Entitlement-Pruefung beim Einloesen.
    expect(source).toContain('redeem')
    // Und der Downloadlink entsteht nur aus Asset-ID, Entitlement und Token.
    expect(source).toContain('function downloadUrl({ assetId, entitlementId, token })')
  })
})

describe('PT22.6 · Registry 7/7 und gemeinsamer Vertrag', () => {
  it('fuehrt alle sieben Journeys als ON_FOUNDATION mit Endpunkt und Slice', () => {
    expect(LEAD_JOURNEYS).toHaveLength(7)
    for (const journey of JOURNEY_REGISTRY) {
      expect(journey.state, journey.id).toBe(JOURNEY_FOUNDATION_STATES.ON_FOUNDATION)
      expect(journey.endpoint, journey.id).toMatch(/^\/api\//u)
      const slice = readFileSync(journey.slice, 'utf8')
      expect(slice, `${journey.id}: persistiert`).toContain('createLead')
      expect(slice, `${journey.id}: eigene Zustaendigkeit`).toContain('journeys: [JOURNEY]')
    }
  })

  it('hat fuer alle sieben Ziele einen Adapter, sobald die Umgebung ihn hergibt', () => {
    // Vorher hatten `epigenetics` und `resources` in KEINER Konfiguration
    // einen Adapter — sie bauten `new CrmRouter()` ohne alles.
    for (const [slice, target] of [
      ['contact-lead', 'general-sales'],
      ['support-case', 'support'],
      ['consumer-order', 'CRM_TARGET'],
      ['roi-report', 'CRM_TARGET'],
      ['practice-order', 'CRM_TARGET'],
      ['epigenetics-inquiry', 'epigenetics'],
      ['content-download', 'resources'],
    ]) {
      const source = codeOf(`server/${slice}.js`)
      expect(source, `${slice}: registriert einen Adapter`).toMatch(/adapters(\[|\.)/u)
      expect(source, `${slice}: Ziel ${target}`).toContain(
        target.replace('CRM_TARGET', 'CRM_TARGET'),
      )
      // Ohne Umgebungsvariablen KEIN halber Adapter.
      expect(source, `${slice}: Provider-Bedingung`).toContain('SENDGRID_API_KEY')
      // Und der Adapter wird auch WIRKLICH in den Router gereicht. Ein
      // `adapters`-Objekt zu bauen und dann `new CrmRouter()` ohne Argument
      // aufzurufen sieht im Quelltext fast gleich aus und liefert nichts aus.
      expect(source, `${slice}: Adapter im Router`).toMatch(/new CrmRouter\(\{[^}]*adapters/u)
      expect(source, `${slice}: kein leerer Router`).not.toMatch(/new CrmRouter\(\)/u)
    }
  })

  it('stellt zur Laufzeit wirklich zu, sobald Umgebung und Mailer da sind', async () => {
    // Die Quelltextpruefung allein reicht nicht: sie schlug beim
    // Mutationstest nicht an, als der Adapter zwar gebaut, aber nicht mehr an
    // den Router uebergeben wurde. Deshalb hier der echte Weg durch die
    // Runtime-Fabrik.
    const os = require('node:os')
    const path = require('node:path')
    const fs = require('node:fs')
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pt226-rt-'))
    const databasePath = path.join(directory, 'leads.sqlite3')
    const sent = []
    // `openLeadDatabase()` liest den Pfad aus `process.env`, nicht aus dem
    // injizierten `env` — dieses steuert nur die Adapterkonfiguration.
    const previous = process.env.LEAD_DB_PATH
    process.env.LEAD_DB_PATH = databasePath
    try {
      const { getRuntimeEpigeneticsInquiryService } = require('./epigenetics-inquiry')
      const service = getRuntimeEpigeneticsInquiryService({
        mailer: {
          send: async (message) => {
            sent.push(message)
          },
        },
        env: {
          LEAD_DB_PATH: databasePath,
          SENDGRID_API_KEY: 'sg-test',
          EPIGENETICS_RECEIVER: 'epi@polarisdx.example',
          SENDER_EMAIL: 'web@polarisdx.example',
        },
      })
      const state = await service.submit({ body: epiBody(), idempotencyKey: 'rt-1' })
      expect(state.status, 'wirklich zugestellt').toBe('DELIVERED')
      expect(state.providerConfigured).toBe(true)
      expect(sent).toHaveLength(1)
      expect(sent[0].to).toBe('epi@polarisdx.example')
    } finally {
      if (previous === undefined) delete process.env.LEAD_DB_PATH
      else process.env.LEAD_DB_PATH = previous
      fs.rmSync(directory, { recursive: true, force: true })
    }
  })

  it('antwortet fuer beide neuen Journeys ueber den gemeinsamen Handler', () => {
    const server = readFileSync('server/server.js', 'utf8')
    for (const [path, journey] of [
      ['/api/epigenetics-inquiry', 'epigenetics_inquiry'],
      ['/api/content-download', 'content_download'],
    ]) {
      const start = server.indexOf(`app.post('${path}'`)
      const block = server.slice(start, start + 700)
      expect(block, `${journey}: formLimiter`).toContain('formLimiter')
      expect(block, `${journey}: handleJourney`).toContain('await handleJourney({')
      expect(block, `${journey}: getypt`).toContain(`journey: '${journey}'`)
    }
  })

  it('meldet fuer keine der beiden einen Erfolg, den es nicht gab', async () => {
    for (const [createService, journey] of [
      [createEpigeneticsInquiryService, 'epigenetics_inquiry'],
      [createContentDownloadService, 'content_download'],
    ]) {
      void createService
      const entry = JOURNEY_REGISTRY.find((item) => item.id === journey)
      const source = readFileSync(entry.slice, 'utf8')
      // Der Zustand kommt aus dem Lead, nicht aus einer Annahme.
      expect(source, `${journey}: ehrlicher Providerstatus`).toContain('NO_PROVIDER_CONFIGURED')
      expect(source, `${journey}: Zustand aus dem Lead`).toContain('lead?.status')
    }
  })
})

describe('PT22.6 · Analytics erst nach Einwilligung', () => {
  it('haelt die Ereignisschnittstelle ohne Anbieter und ohne Einwilligung still', () => {
    const tracking = readFileSync('src/lib/tracking.ts', 'utf8')
    // Zwei Sperren, beide standardmaessig zu.
    expect(tracking).toContain('setTrackingProvider')
    expect(tracking).toContain('setTrackingConsent')

    // Geprueft wird der CODE, nicht die Dokumentation: der Kopfkommentar
    // dieses Moduls nennt `window.dataLayer` ausdruecklich als das, was es
    // NICHT tut. Eine Suche ueber die ganze Datei wuerde genau diese
    // ehrliche Zusicherung als Verstoss melden.
    const code = tracking.replace(/\/\*[\s\S]*?\*\//gu, ' ').replace(/(^|[^:])\/\/.*$/gmu, '$1')
    expect(code).not.toContain('window.dataLayer')
    expect(code).not.toMatch(/gtag\(/u)
  })

  it('sendet den Seitenaufruf erst mit erteilter Einwilligung', () => {
    /**
     * AP23 PT23.2 — diese Zusicherung ist ANGEPASST, nicht abgeschwaecht.
     *
     * Vorher stand hier, dass `GtmPageview.tsx` das Wort `hasAnalyticsConsent`
     * enthaelt und der `gtag`-Aufruf dahinter steht. Beides war richtig,
     * solange die Komponente den Provider selbst kannte. Sie kennt ihn nicht
     * mehr: sie meldet an die Fassade, und die Einwilligungssperre liegt dort
     * — an EINER Stelle statt an jeder Aufrufstelle.
     *
     * Die gepruefte Eigenschaft ist damit staerker geworden: die Komponente
     * kann Google gar nicht mehr erreichen, auch nicht versehentlich.
     */
    const pageview = readFileSync('src/components/analytics/GtmPageview.tsx', 'utf8')
    const code = pageview.replace(/\/\*[\s\S]*?\*\//gu, ' ').replace(/(^|[^:])\/\/.*$/gmu, '$1')

    // Kein Providerwissen mehr in der Komponente. Bewusst auf den BEZEICHNER
    // und nicht auf `gtag(`: die erste Fassung dieser Zusicherung liess
    // `gtag?.('event', …)` durch — Optional Chaining passt nicht auf `gtag(`,
    // und die Mutationsprobe ging deshalb gruen durch.
    expect(code).not.toMatch(/\bgtag\b/u)
    expect(code).not.toMatch(/\bdataLayer\b/u)
    // Der Weg nach draussen fuehrt ausschliesslich ueber die Fassade.
    expect(code).toContain("from '../../lib/tracking'")
    expect(code).toMatch(/track\(\{/u)

    // Und die Fassade sendet ohne Einwilligung nicht — dort steht die Sperre.
    const facade = readFileSync('src/lib/tracking.ts', 'utf8')
    expect(facade).toContain('if (!provider || !einwilligung) return')
  })

  it('haengt keine der beiden Journeys an einer Analytics-Einwilligung', () => {
    for (const slice of ['epigenetics-inquiry', 'content-download']) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      for (const forbidden of ['analytics_storage', 'dataLayer', 'gtag(', 'hasAnalyticsConsent']) {
        expect(source, `${slice}: ${forbidden}`).not.toContain(forbidden)
      }
    }
    for (const client of ['epigeneticsInquiry', 'contentDownload']) {
      const source = readFileSync(`src/api/${client}.ts`, 'utf8')
      expect(source, `${client}: kein Analytics-Gate`).not.toContain('hasAnalyticsConsent')
    }
  })
})
