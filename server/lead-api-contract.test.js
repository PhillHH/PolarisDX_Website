// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.1 — der gemeinsame Formular-/API-Standard.
 *
 * Geprueft wird genau das, was PT22.1 herstellt: die Journey-Registry auf
 * 7/7, die eine Antwortform, der Fehlervertrag samt Leckschutz und die
 * Consent-/Abuse-Grundlinie. NICHT geprueft wird die Migration der
 * Endpunkte — die gibt es in PT22.1 bewusst noch nicht, und ein Test, der
 * sie behauptete, waere ein False-Ready-Marker.
 */

const require = createRequire(import.meta.url)
const {
  DEFAULT_JOURNEY_ROUTES,
  ERROR_CATALOG,
  JOURNEY_FOUNDATION_STATES,
  JOURNEY_REGISTRY,
  LEAD_JOURNEYS,
  PUBLIC_STATES,
  createRequestId,
  errorEnvelope,
  logSafeError,
  messageKeyFor,
  normalizeFieldErrors,
  successEnvelope,
} = require('./lead-foundation')

/** Der AP22-Launchvertrag, woertlich aus der Aufgabenstellung. */
const CANONICAL_SEVEN = [
  'contact',
  'support',
  'consumer_order',
  'roi_report',
  'practice_order',
  'epigenetics_inquiry',
  'content_download',
]

describe('PT22.1 · Journey-Registry 7/7', () => {
  it('fuehrt exakt die sieben kanonischen Journeys — keine mehr, keine weniger', () => {
    expect(LEAD_JOURNEYS).toEqual(CANONICAL_SEVEN)
    expect(JOURNEY_REGISTRY.map((journey) => journey.id)).toEqual(CANONICAL_SEVEN)
  })

  it('kennt /api/chat nicht als Journey', () => {
    expect(LEAD_JOURNEYS).not.toContain('chat')
    for (const journey of JOURNEY_REGISTRY) {
      expect(journey.endpoint ?? '').not.toContain('/api/chat')
    }
  })

  it('leitet die CRM-Ziele aus der Registry ab, statt sie doppelt zu pflegen', () => {
    // Vorher standen Journey-Liste und CRM-Routen an zwei Stellen. Eine neue
    // Journey ohne Route haette den CrmRouter beim Start zerlegt.
    expect(Object.keys(DEFAULT_JOURNEY_ROUTES).sort()).toEqual([...CANONICAL_SEVEN].sort())
    for (const journey of JOURNEY_REGISTRY) {
      expect(DEFAULT_JOURNEY_ROUTES[journey.id], journey.id).toBe(journey.crmTarget)
      expect(journey.crmTarget, `${journey.id}: CRM-Ziel`).toMatch(/^[a-z][a-z-]+$/u)
    }
    // Und die Ziele sind je Journey verschieden — kein stilles Multiplexing.
    expect(new Set(Object.values(DEFAULT_JOURNEY_ROUTES)).size).toBe(7)
  })

  it('sagt je Journey ehrlich, wo sie wirklich steht', () => {
    const byState = (state) =>
      JOURNEY_REGISTRY.filter((journey) => journey.state === state).map((journey) => journey.id)

    // AP22 PT22.5 hat `roi_report` und `practice_order` migriert; seither
    // laufen ALLE sieben auf der Foundation — jede mit echtem Slice auf Platte.
    expect(byState(JOURNEY_FOUNDATION_STATES.ON_FOUNDATION).sort()).toEqual([
      'consumer_order',
      'contact',
      'content_download',
      'epigenetics_inquiry',
      'practice_order',
      'roi_report',
      'support',
    ])
    for (const journey of JOURNEY_REGISTRY) {
      if (journey.state !== JOURNEY_FOUNDATION_STATES.ON_FOUNDATION) continue
      const slice = readFileSync(journey.slice, 'utf8')
      expect(slice, `${journey.id}: nutzt createLead`).toContain('createLead')
      expect(slice, `${journey.id}: eigene Journey-Konstante`).toContain(`'${journey.id}'`)
    }

    // Und es gibt keine offenen Zustaende mehr.
    expect(byState(JOURNEY_FOUNDATION_STATES.LEGACY_MAIL_ONLY)).toEqual([])
    expect(byState(JOURNEY_FOUNDATION_STATES.NOT_YET_TYPED)).toEqual([])
  })

  it('belegt die Migration am Quelltext, statt sie zu behaupten', () => {
    const server = readFileSync('server/server.js', 'utf8')
    // roi_report persistiert jetzt ueber den eigenen Slice.
    const roi = readFileSync('server/roi-report.js', 'utf8')
    expect(roi).toContain('createLead')
    expect(roi).toContain('journey: JOURNEY')

    // practice_order hat einen eigenen Endpunkt — und der Magic String,
    // an dem frueher der Mailempfaenger haengen blieb, ist weg.
    expect(server).toContain('/api/practice-order')
    const contact = readFileSync('server/contact-lead.js', 'utf8')
    expect(contact, 'Magic String entfernt').not.toContain('Vitamin D3+K2 Spray BESTELLUNG')
    expect(contact, 'Sonderempfaenger entfernt').not.toContain('sprayRecipient')
    // Und `contact` waehlt genau EINEN Empfaenger.
    expect(contact.match(/this\.recipient/gu)?.length).toBeGreaterThan(0)
  })
})

describe('PT22.1 · gemeinsames Antwort-Envelope', () => {
  it('traegt Erfolg, Anfrage-ID, Journey und den ECHTEN Zustand', () => {
    const body = successEnvelope({
      journey: 'contact',
      state: PUBLIC_STATES.PENDING_HANDOFF,
      leadId: 'lead-1',
      deliveryPending: true,
    })
    expect(body.success).toBe(true)
    expect(body.journey).toBe('contact')
    expect(body.state).toBe('PENDING_HANDOFF')
    expect(body.requestId).toMatch(/^req_[0-9a-f-]{36}$/u)
    expect(body.deliveryPending).toBe(true)
  })

  it('behauptet keinen Provider-Erfolg, wenn er unbekannt ist', () => {
    const unknown = successEnvelope({ journey: 'support', state: PUBLIC_STATES.PENDING_HANDOFF })
    // Kein `providerConfigured`-Feld statt eines geratenen `true`.
    expect(Object.keys(unknown)).not.toContain('providerConfigured')

    const honest = successEnvelope({
      journey: 'support',
      state: PUBLIC_STATES.FAILED_TERMINAL,
      providerConfigured: false,
    })
    expect(honest.providerConfigured).toBe(false)
  })

  it('laesst weder eine unbekannte Journey noch einen unbekannten Zustand durch', () => {
    expect(() => successEnvelope({ journey: 'chat', state: 'RECEIVED' })).toThrow(/not registered/u)
    expect(() => successEnvelope({ journey: 'contact', state: 'TOTALLY_FINE' })).toThrow(
      /not public/u,
    )
  })

  it('vergibt je Anfrage eine eigene ID', () => {
    const ids = new Set(Array.from({ length: 50 }, () => createRequestId()))
    expect(ids.size).toBe(50)
  })
})

describe('PT22.1 · Fehlervertrag', () => {
  it('liefert Status, Wiederholbarkeit und Textschluessel aus EINEM Katalog', () => {
    const { body, status } = errorEnvelope({
      journey: 'consumer_order',
      code: 'VALIDATION_FAILED',
      fieldErrors: ['email'],
    })
    expect(status).toBe(400)
    expect(body).toMatchObject({
      success: false,
      journey: 'consumer_order',
      state: 'REJECTED',
      code: 'VALIDATION_FAILED',
      retryable: false,
      messageKey: 'lead.error.validation_failed',
      // API-09: je Feld ein Code und ein Uebersetzungsschluessel, keine Prosa.
      fieldErrors: [
        { field: 'email', code: 'VALIDATION_FAILED', messageKey: 'lead.error.validation_failed' },
      ],
    })
  })

  it('trennt wiederholbar von terminal — als Sicherheitsaussage, nicht als Hoeflichkeit', () => {
    // Rate Limit: derselbe Schluessel darf erneut gesendet werden.
    expect(errorEnvelope({ journey: 'contact', code: 'RATE_LIMITED' }).body.retryable).toBe(true)
    expect(errorEnvelope({ journey: 'contact', code: 'RATE_LIMITED' }).status).toBe(429)
    // Idempotenz-Konflikt: derselbe Schluessel steht dauerhaft fuer etwas anderes.
    const conflict = errorEnvelope({ journey: 'contact', code: 'IDEMPOTENCY_CONFLICT' })
    expect(conflict.status).toBe(409)
    expect(conflict.body.retryable).toBe(false)
    // Serverseitig unklar: wiederholbar.
    expect(errorEnvelope({ journey: 'contact', code: 'JOURNEY_UNAVAILABLE' }).body.retryable).toBe(
      true,
    )
  })

  it('reicht einen unbekannten Code NICHT durch — kein Provider- oder Stacktrace-Leck', () => {
    const leaky = [
      'SENDGRID_401_Unauthorized',
      'Error: connect ECONNREFUSED 10.0.0.5:587',
      'SQLITE_CONSTRAINT: UNIQUE failed',
      '<script>alert(1)</script>',
    ]
    for (const code of leaky) {
      const { body, status } = errorEnvelope({ journey: 'support', code })
      expect(status).toBe(500)
      expect(body.code).toBe('JOURNEY_UNAVAILABLE')
      expect(JSON.stringify(body)).not.toContain('SENDGRID')
      expect(JSON.stringify(body)).not.toContain('ECONNREFUSED')
      expect(JSON.stringify(body)).not.toContain('SQLITE')
      expect(JSON.stringify(body)).not.toContain('script')
    }
  })

  it('nennt im Feldfehler nur das FELD, nie seinen Inhalt — mit Code und Schluessel', () => {
    // BACKEND-API-CONTRACT API-09: `field`, `code`, `messageKey` je Eintrag.
    expect(normalizeFieldErrors(['email', 'name'])).toEqual([
      { field: 'email', code: 'VALIDATION_FAILED', messageKey: 'lead.error.validation_failed' },
      { field: 'name', code: 'VALIDATION_FAILED', messageKey: 'lead.error.validation_failed' },
    ])
    // Ein eigener Code je Feld ist erlaubt — aber nur aus dem Katalog.
    expect(
      normalizeFieldErrors([{ field: 'processingConsent', code: 'PROCESSING_CONSENT_REQUIRED' }]),
    ).toEqual([
      {
        field: 'processingConsent',
        code: 'PROCESSING_CONSENT_REQUIRED',
        messageKey: 'lead.error.processing_consent_required',
      },
    ])
    // Ein erfundener Code faellt auf den Standard zurueck statt durchzurutschen.
    expect(normalizeFieldErrors([{ field: 'email', code: 'SENDGRID_401' }])[0].code).toBe(
      'VALIDATION_FAILED',
    )
    // Werte, Nachrichten und Injection-Versuche fallen raus.
    expect(
      normalizeFieldErrors(['kundin@example.com', 'ist ungueltig', '../../etc/passwd', '']),
    ).toBe(undefined)
    expect(normalizeFieldErrors(['email', 'email'])).toHaveLength(1)
    expect(normalizeFieldErrors(undefined)).toBe(undefined)
  })

  it('haelt das Log frei von Body, Headern und Geheimnissen', () => {
    const safe = logSafeError({
      journey: 'contact',
      code: 'RATE_LIMITED',
      requestId: 'req_abc',
    })
    expect(Object.keys(safe).sort()).toEqual(['errorClass', 'journey', 'requestId'])
    // Eine unbekannte Journey wird nicht ins Log gespiegelt.
    expect(logSafeError({ journey: '<script>', code: 'X' })).toMatchObject({
      journey: 'unknown',
      errorClass: 'UNCLASSIFIED_ERROR',
    })
  })

  it('kennt JEDEN Code, den ein Journey-Slice wirklich wirft', () => {
    // Ein nicht katalogisierter Code faellt auf JOURNEY_UNAVAILABLE zurueck.
    // Das ist als Leckschutz richtig — aber eine abgelehnte Datei haette
    // damit 500 statt 400 gemeldet. Genau das ist in PT22.5 passiert.
    const slices = [
      'contact-lead',
      'support-case',
      'consumer-order',
      'epigenetics-inquiry',
      'content-download',
      'roi-report',
      'practice-order',
    ]
    const thrown = new Set()
    for (const slice of slices) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      for (const match of source.matchAll(/ValidationError\('([A-Z_]+)'/gu)) thrown.add(match[1])
    }
    expect(thrown.size).toBeGreaterThan(10)
    const missing = [...thrown].filter((code) => !(code in ERROR_CATALOG)).sort()
    expect(missing, 'Codes ohne Katalogeintrag').toEqual([])
  })

  it('hat fuer jeden Katalogcode einen Textschluessel und keinen freien Text', () => {
    for (const [code, entry] of Object.entries(ERROR_CATALOG)) {
      expect(code).toMatch(/^[A-Z][A-Z0-9_]+$/u)
      expect(entry.status).toBeGreaterThanOrEqual(400)
      expect(typeof entry.retryable).toBe('boolean')
      expect(messageKeyFor(code)).toBe(`lead.error.${code.toLowerCase()}`)
    }
  })
})

describe('PT22.1 · Consent- und Abuse-Grundlinie', () => {
  const slices = [
    'contact-lead',
    'support-case',
    'consumer-order',
    'epigenetics-inquiry',
    'content-download',
  ]

  it('verlangt in jedem Foundation-Slice Verarbeitungs-Consent MIT Nachweis', () => {
    for (const slice of slices) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      expect(source, `${slice}: Processing-Consent`).toContain('PROCESSING_CONSENT_REQUIRED')
      expect(source, `${slice}: Zeitstempel als Nachweis`).toContain('INVALID_CONSENT_EVIDENCE')
      expect(source, `${slice}: eigene Consent-Version`).toMatch(
        /CONSENT_VERSION = '[a-z-]+-\d{4}-\d{2}'/u,
      )
    }
  })

  it('macht Analytics-Consent an keiner Stelle zur Voraussetzung', () => {
    for (const slice of slices) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      for (const forbidden of ['analytics_storage', 'dataLayer', 'gtag(', 'hasAnalyticsConsent']) {
        expect(source, `${slice}: ${forbidden}`).not.toContain(forbidden)
      }
    }
  })

  it('haelt Marketing-Consent getrennt — und wo er fehlt, ist das benannt', () => {
    const withMarketing = slices.filter((slice) =>
      readFileSync(`server/${slice}.js`, 'utf8').includes('marketingConsent'),
    )
    // Support ist die eine Ausnahme: eine Supportanfrage fragt bewusst keine
    // Marketing-Einwilligung ab. Das ist Bestand, kein Versehen — und es steht
    // als Luecke im LEAD-DATA-CONTRACT, statt hier stillschweigend zu gelten.
    expect(withMarketing.sort()).toEqual([
      'consumer-order',
      'contact-lead',
      'content-download',
      'epigenetics-inquiry',
    ])
  })

  it('verlangt in jedem Foundation-Slice Idempotency-Key und Honeypot', () => {
    for (const slice of slices) {
      const source = readFileSync(`server/${slice}.js`, 'utf8')
      expect(source, `${slice}: Idempotency-Key`).toContain('IDEMPOTENCY_KEY_REQUIRED')
      expect(source, `${slice}: Honeypot`).toContain('_hp')
    }
  })

  it('montiert jeden Journey-Endpunkt hinter dem Rate Limiter', () => {
    const server = readFileSync('server/server.js', 'utf8')
    const limited = [...server.matchAll(/app\.post\('(\/api\/[a-z-]+)'(?:, (\w+))?/gu)].map(
      (match) => ({ path: match[1], guard: match[2] }),
    )
    const journeyPaths = JOURNEY_REGISTRY.map((journey) => journey.endpoint).filter(Boolean)
    for (const path of journeyPaths) {
      const entry = limited.find((item) => item.path === path)
      expect(entry, `${path} montiert`).toBeTruthy()
      expect(entry.guard, `${path} hinter formLimiter`).toBe('formLimiter')
    }
    // Gegenprobe: /api/chat ist keine Journey und wird hier auch nicht gezaehlt.
    expect(journeyPaths).not.toContain('/api/chat')
  })
})
