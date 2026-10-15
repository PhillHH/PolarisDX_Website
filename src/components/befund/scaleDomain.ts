import type { Tone } from './tone'

export const PERCENT_DOMAIN = { min: 70, max: 130 }
export const TRAFFIC_DOMAIN = { min: 0, max: 9 }
/** Abweichung in Jahren: die Achse laeuft invertiert, +20 steht links. */
export const DEVIATION_DOMAIN = { min: -20, max: 20 }

/**
 * Zonen als Anteil der Achse — dieselbe Einteilung wie im PDF.
 * Nur fuer die beiden Skalen, deren Grenzen im Dokument ausgewiesen sind.
 * Bei Jahres- und Abweichungsskalen bleibt die Spur neutral: dort nennt kein
 * Quelldokument Schwellen, und erfundene Grenzen waeren eine Aussage.
 */
export const zonesFor = (kind: string) => {
  if (kind === 'traffic') {
    return [
      { tone: 'red' as Tone, from: 0, to: 3 },
      { tone: 'amber' as Tone, from: 3, to: 6 },
      { tone: 'green' as Tone, from: 6, to: 9 },
    ]
  }
  if (kind === 'percent') {
    return [
      { tone: 'red' as Tone, from: 70, to: 90 },
      { tone: 'amber' as Tone, from: 90, to: 100 },
      { tone: 'green' as Tone, from: 100, to: 130 },
    ]
  }
  return []
}

export const domainFor = (kind: string, value: number) => {
  if (kind === 'traffic') return TRAFFIC_DOMAIN
  if (kind === 'percent') return PERCENT_DOMAIN
  if (kind === 'deviation') return DEVIATION_DOMAIN
  // Unbekannte Skala: eine Spanne um den Wert, damit die Marke nicht am Rand klebt.
  const pad = Math.max(5, Math.abs(value) * 0.25)
  return { min: value - pad, max: value + pad }
}
