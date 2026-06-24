/**
 * lib/metrics/definitions.ts — Metrik-Definitionen (Foundation-Stub, §1.14)
 *
 * „Stories neben Metriken": Jede Metrik traegt ihren Skalentyp UND die
 * menschliche Geschichte dahinter. Vanity-Metriken (Pageviews, Verweildauer,
 * rohe Klicks, LoC) sind nur mit `whatItProxies` + `validityCaveat` zulaessig.
 */

/** Outcome = an ein reales Nutzerergebnis gebunden; vanity = leicht messbares Surrogat. */
export type ScaleType = 'outcome' | 'vanity'

export interface MetricDefinition {
  readonly id: string
  /** Klartext, was gemessen wird. */
  readonly label: string
  readonly scaleType: ScaleType
  /** Die menschliche Story: welche reale Nutzeraufgabe steht dahinter? */
  readonly story: string
  /** Nur bei vanity: wofuer ist die Zahl ein Surrogat? */
  readonly whatItProxies?: string
  /** Nur bei vanity: warum die Zahl in die Irre fuehren kann. */
  readonly validityCaveat?: string
}

/** Wird in Phase 5/6 mit echten Metriken befuellt. */
export const metricDefinitions: readonly MetricDefinition[] = []
