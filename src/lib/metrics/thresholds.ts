/**
 * lib/metrics/thresholds.ts — Schwellenwerte je Metrik (Foundation-Stub, §1.14)
 *
 * Qualitative Bewertung statt opakem Aggregat-Score: ein Wert faellt in eine
 * benannte Bandbreite (good/watch/poor), nicht auf eine nackte Zahl.
 */

export type ThresholdBand = 'good' | 'watch' | 'poor'

export interface MetricThreshold {
  readonly metricId: string
  /** Wert ab dem es „good" ist (Richtung via `higherIsBetter`). */
  readonly good: number
  /** Wert ab dem es „watch" ist. */
  readonly watch: number
  readonly higherIsBetter: boolean
}

/** Wird in Phase 5/6 mit echten Schwellen befuellt. */
export const metricThresholds: readonly MetricThreshold[] = []

export function classify(value: number, t: MetricThreshold): ThresholdBand {
  const meets = (limit: number) => (t.higherIsBetter ? value >= limit : value <= limit)
  if (meets(t.good)) return 'good'
  if (meets(t.watch)) return 'watch'
  return 'poor'
}
