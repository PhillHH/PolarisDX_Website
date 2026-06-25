/**
 * lib/metrics/definitions.ts — Metrik-Definitionen (Phase 5 §5.7, §1.14)
 *
 * „Stories neben Metriken": Jede Metrik traegt ihren Skalentyp UND die
 * menschliche Geschichte dahinter. Vanity-Metriken (Pageviews, Verweildauer,
 * rohe Klicks, LoC) sind nur mit `whatItProxies` + `validityCaveat` zulaessig.
 *
 * Pflichtfelder je Eintrag (§5.7): name · hypothesis · whatItProxies ·
 * validityCaveat · scaleType · story. Zusaetzlich `kind` (outcome/vanity) und
 * `subjective` (mind. EINE subjektive Qualitaetsmetrik ist Pflicht).
 *
 * WICHTIG: Diese Datei DEFINIERT nur, was eine ehrliche Metrik ist — sie
 * sammelt keine personenbezogenen Daten. Die Erhebung passiert anonym/serverseitig.
 */

/** outcome = an ein reales Nutzerergebnis gebunden; vanity = leicht messbares Surrogat. */
export type MetricKind = 'outcome' | 'vanity'

/**
 * Statistischer Skalentyp — bestimmt die ZULAESSIGE Aggregation:
 *  - nominal/ordinal → KEIN Mittelwert; ordinal → Median (`aggregate.ts`).
 *  - interval/ratio → Mittelwert/Median zulaessig.
 */
export type ScaleType = 'nominal' | 'ordinal' | 'interval' | 'ratio'

export interface MetricDefinition {
  /** Stabiler Event-Name (snake_case), z. B. 'consultation_requested'. */
  readonly name: string
  /** Klartext-Label fuer Dashboards. */
  readonly label: string
  readonly kind: MetricKind
  readonly scaleType: ScaleType
  /** Ist es eine subjektive Qualitaetsmetrik (Selbstauskunft)? */
  readonly subjective: boolean
  /** Die getestete Annahme: „Wenn X gut ist, dann Y." */
  readonly hypothesis: string
  /** Wofuer ist die Zahl ein Surrogat? */
  readonly whatItProxies: string
  /** Warum die Zahl in die Irre fuehren kann. */
  readonly validityCaveat: string
  /** Die menschliche Story: welche reale Nutzeraufgabe steht dahinter? */
  readonly story: string
}

/**
 * Outcome-Events der PolarisDX-Site. Bewusst an reale Nutzerergebnisse gebunden
 * (Beratung angefragt, Bestellung abgeschlossen) statt an Vanity (Pageviews).
 * Genau eine subjektive Qualitaetsmetrik (`page_answered_my_question`).
 */
export const metricDefinitions: readonly MetricDefinition[] = [
  {
    name: 'consultation_requested',
    label: 'Beratung angefragt',
    kind: 'outcome',
    scaleType: 'nominal',
    subjective: false,
    hypothesis:
      'Wenn die Diagnostik-Seiten den Nutzen klar machen, fragen mehr Praxen eine Beratung an.',
    whatItProxies: 'Echtes Kaufinteresse einer Praxis am IglooPro-System.',
    validityCaveat:
      'Eine Anfrage ist noch kein Abschluss; Kampagnen-Spitzen koennen unqualifizierte Anfragen erzeugen.',
    story:
      'Eine Praxisleiterin hat verstanden, was der POC-Reader ihr bringt, und nimmt aktiv Kontakt auf.',
  },
  {
    name: 'consumer_order_completed',
    label: 'Bestellung abgeschlossen',
    kind: 'outcome',
    scaleType: 'nominal',
    subjective: false,
    hypothesis:
      'Wenn die Consumer-Landingpage Produkt und Preis klar zeigt, schliessen mehr Besucher die Bestellung ab.',
    whatItProxies: 'Tatsaechlicher Kauf eines Consumer-Produkts (Spray/Maske/Duo).',
    validityCaveat:
      'Stornos/Retouren sind hier nicht abgezogen; Median-Warenkorb sagt mehr als die reine Anzahl.',
    story:
      'Jemand mit konkretem Bedarf findet das passende Produkt und schliesst den Kauf ohne Reibung ab.',
  },
  {
    name: 'resource_downloaded',
    label: 'Fachunterlage heruntergeladen',
    kind: 'outcome',
    scaleType: 'nominal',
    subjective: false,
    hypothesis:
      'Wenn Fachinhalte (Leitlinie, Whitepaper) leicht auffindbar sind, laden Interessierte sie herunter.',
    whatItProxies: 'Ernsthafte fachliche Auseinandersetzung mit dem Angebot.',
    validityCaveat: 'Ein Download bedeutet nicht, dass die Unterlage gelesen oder genutzt wurde.',
    story: 'Ein Zahnarzt nimmt die S3-Leitlinie mit, um sie in Ruhe im Team zu besprechen.',
  },
  {
    name: 'page_answered_my_question',
    label: 'Seite hat meine Frage beantwortet (Selbstauskunft)',
    kind: 'outcome',
    scaleType: 'ordinal',
    subjective: true,
    hypothesis:
      'Wenn Inhalt und Struktur stimmen, bewerten Nutzer hoeher, dass die Seite ihre Frage beantwortet hat.',
    whatItProxies: 'Wahrgenommene Nuetzlichkeit/Klarheit aus Nutzersicht.',
    validityCaveat:
      'Ordinalskala (1–5): NICHT mittelwertbar — nur Median/Verteilung; Selbstauskunft hat Stichproben-Bias.',
    story:
      'Ein Besucher verlaesst die Seite mit dem Gefuehl „Frage geklaert" statt „immer noch unsicher".',
  },
  {
    name: 'session_pageviews',
    label: 'Seitenaufrufe je Sitzung',
    kind: 'vanity',
    scaleType: 'ratio',
    subjective: false,
    hypothesis: 'Mehr Seitenaufrufe koennten auf groesseres Interesse hindeuten.',
    whatItProxies: 'Grob: Engagement-Tiefe innerhalb einer Sitzung.',
    validityCaveat:
      'Klassische Vanity-Metrik: viele Aufrufe koennen auch Verirrung/schlechte Navigation bedeuten. Nie als Erfolg allein lesen.',
    story: 'Nur im Kontext eines Outcomes sinnvoll — als Begleitsignal, nicht als Ziel.',
  },
]

/** Genau-eine-subjektive-Metrik-Invariante (§5.7) — fuer Test/Guard nutzbar. */
export const hasSubjectiveQualityMetric = (): boolean => metricDefinitions.some((m) => m.subjective)
