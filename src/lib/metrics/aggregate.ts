/**
 * lib/metrics/aggregate.ts — qualitative Zusammenfassung (Foundation-Stub, §1.14)
 *
 * Nutzersichtbare Status-UIs zeigen KEINEN opaken Aggregat-Score, sondern einen
 * qualitativen Ueberblick + Drilldown. Diese Funktion liefert genau das: die
 * Verteilung ueber die Baender, nicht eine einzelne „Erfolgs-Zahl".
 */

import type { ThresholdBand } from './thresholds'

export interface MetricResult {
  readonly metricId: string
  readonly band: ThresholdBand
}

export interface QualitativeOverview {
  readonly good: number
  readonly watch: number
  readonly poor: number
  /** Metriken, die Aufmerksamkeit brauchen (Drilldown-Einstieg). */
  readonly needsAttention: readonly string[]
}

export function summarize(results: readonly MetricResult[]): QualitativeOverview {
  const count = (band: ThresholdBand) => results.filter((r) => r.band === band).length
  return {
    good: count('good'),
    watch: count('watch'),
    poor: count('poor'),
    needsAttention: results.filter((r) => r.band !== 'good').map((r) => r.metricId),
  }
}
