/**
 * lib/metrics/aggregate.ts — qualitative Zusammenfassung + Ordinal-Median (§5.7, §1.14)
 *
 * Nutzersichtbare Status-UIs zeigen KEINEN opaken Aggregat-Score, sondern einen
 * qualitativen Ueberblick + Drilldown. `summarize` liefert genau das: die
 * Verteilung ueber die Baender, nicht eine einzelne „Erfolgs-Zahl".
 *
 * `median` ist die KORREKTE Aggregation fuer ORDINALdaten (z. B. eine 1–5-
 * Zufriedenheits-Selbstauskunft): ein Mittelwert ist auf einer Ordinalskala
 * unzulaessig (Abstaende sind nicht aequidistant), der Median dagegen
 * skaleninvariant. Siehe `scaleType: 'ordinal'` in `definitions.ts`.
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

/**
 * Median ordinaler Werte (z. B. 1–5-Bewertungen).
 *
 * Bewusst ordinal-sicher: bei gerader Anzahl wird der UNTERE der beiden
 * mittleren Werte zurueckgegeben (kein Mittelwert zweier Stufen — der laege
 * sonst „zwischen" zwei Skalenpunkten, was auf einer Ordinalskala bedeutungslos
 * ist). So bleibt das Ergebnis immer ein realer Skalenpunkt.
 *
 * @returns den Median oder `null`, wenn keine Werte vorliegen.
 */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  // floor((n-1)/2): ungerade → echte Mitte; gerade → unterer der beiden Mittelwerte.
  return sorted[Math.floor((sorted.length - 1) / 2)]
}
