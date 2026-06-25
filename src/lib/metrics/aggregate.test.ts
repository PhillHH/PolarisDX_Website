import { describe, it, expect } from 'vitest'
import { median, summarize, type MetricResult } from './aggregate'
import { metricDefinitions, hasSubjectiveQualityMetric } from './definitions'

describe('median (ordinal-sicher, §5.7)', () => {
  it('liefert null bei leerer Eingabe', () => {
    expect(median([])).toBeNull()
  })

  it('gibt bei ungerader Anzahl die echte Mitte zurueck', () => {
    expect(median([5, 1, 3])).toBe(3)
    expect(median([1, 2, 3, 4, 5])).toBe(3)
  })

  it('gibt bei gerader Anzahl den UNTEREN Mittelwert zurueck (kein Mittelwert zwischen Stufen)', () => {
    // [1,2,3,4] → untere Mitte = 2 (nicht 2.5 — auf Ordinalskala bedeutungslos).
    expect(median([1, 2, 3, 4])).toBe(2)
    expect(median([2, 4])).toBe(2)
  })

  it('ist robust gegen unsortierte Eingabe und Wiederholungen', () => {
    expect(median([4, 4, 1, 2, 4])).toBe(4)
    expect(median([3, 1, 1])).toBe(1)
  })

  it('bleibt immer ein realer Skalenpunkt (1–5-Bewertung)', () => {
    const scale = [1, 1, 2, 5, 5]
    const m = median(scale)
    expect(scale).toContain(m)
  })
})

describe('summarize (qualitativer Ueberblick statt Aggregat-Score)', () => {
  const results: readonly MetricResult[] = [
    { metricId: 'a', band: 'good' },
    { metricId: 'b', band: 'watch' },
    { metricId: 'c', band: 'poor' },
    { metricId: 'd', band: 'good' },
  ]

  it('zaehlt je Band und listet Aufmerksamkeits-Kandidaten', () => {
    const o = summarize(results)
    expect(o).toMatchObject({ good: 2, watch: 1, poor: 1 })
    expect(o.needsAttention).toEqual(['b', 'c'])
  })

  it('liefert keinen einzelnen Score-Wert (kein Aggregat-Score)', () => {
    const o = summarize(results)
    expect(o).not.toHaveProperty('score')
  })
})

describe('Metrik-Definitionen (§5.7 Invarianten)', () => {
  it('enthaelt mindestens eine subjektive Qualitaetsmetrik', () => {
    expect(hasSubjectiveQualityMetric()).toBe(true)
  })

  it('jede Vanity-Metrik traegt whatItProxies + validityCaveat', () => {
    for (const m of metricDefinitions.filter((d) => d.kind === 'vanity')) {
      expect(m.whatItProxies.length).toBeGreaterThan(0)
      expect(m.validityCaveat.length).toBeGreaterThan(0)
    }
  })

  it('jede Metrik traegt die Pflichtfelder name/hypothesis/scaleType/story', () => {
    for (const m of metricDefinitions) {
      expect(m.name).toMatch(/^[a-z0-9_]+$/)
      expect(m.hypothesis.length).toBeGreaterThan(0)
      expect(m.story.length).toBeGreaterThan(0)
      expect(['nominal', 'ordinal', 'interval', 'ratio']).toContain(m.scaleType)
    }
  })

  it('ordinale Metriken werden nicht gemittelt — Median ist definiert und gueltig', () => {
    const ordinal = metricDefinitions.filter((d) => d.scaleType === 'ordinal')
    expect(ordinal.length).toBeGreaterThan(0)
    // Median einer Beispiel-Verteilung bleibt ein Skalenpunkt.
    expect(median([1, 2, 3, 4, 5])).toBe(3)
  })
})
