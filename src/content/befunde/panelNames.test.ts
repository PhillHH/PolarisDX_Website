// @vitest-environment node
// Reine Logik ohne DOM — die jsdom-Umgebung waere hier nur Ballast.
import { describe, it, expect } from 'vitest'
import { PANELS, resolvePanelNames } from './panelNames'
import { BEFUNDE, BEFUND_ORDER } from './index'

/**
 * Die Bindung an die Quelle. PANELS ist ausgeschrieben, damit das
 * Kontaktformular nicht die vollstaendigen Befundinhalte in seinen Chunk
 * zieht — dieser Test sorgt dafuer, dass die Abschrift nicht auseinanderlaeuft.
 */
describe('PANELS deckt die Musterbefunde ab', () => {
  it('fuehrt dieselben Slugs in derselben Reihenfolge wie BEFUND_ORDER', () => {
    expect(PANELS.map((p) => p.slug)).toEqual([...BEFUND_ORDER])
  })

  it('fuehrt je Panel den deutschen und den englischen Namen', () => {
    for (const panel of PANELS) {
      const quelle = BEFUNDE[panel.slug]
      const erwartet = [...new Set([quelle.de.panel, quelle.en.panel])]
      expect(panel.names).toEqual(erwartet)
    }
  })
})

describe('resolvePanelNames', () => {
  it('nimmt bekannte Namen an und gibt die kanonische Schreibweise zurueck', () => {
    expect(resolvePanelNames('Metabolic Health')).toEqual(['Metabolic Health'])
    expect(resolvePanelNames('  telomer-analyse ')).toEqual(['Telomer-Analyse'])
    expect(resolvePanelNames('BIOLOGICAL   AGE   CLOCK')).toEqual(['Biological Age Clock'])
  })

  it('prueft jeden Eintrag der Merkliste einzeln', () => {
    expect(resolvePanelNames('Metabolic Health, Stress Monitor')).toEqual([
      'Metabolic Health',
      'Stress Monitor',
    ])
    expect(resolvePanelNames('Metabolic Health, kostenlos ab 99 EUR')).toEqual(['Metabolic Health'])
  })

  it('verwirft Fremdtext vollstaendig', () => {
    expect(resolvePanelNames('senkt Ihr Herzinfarktrisiko um 40 %')).toEqual([])
    expect(resolvePanelNames('Basispaket 149 EUR, Befund in 5 Werktagen')).toEqual([])
    expect(resolvePanelNames('durchgefuehrt bei Eurofins Genomics')).toEqual([])
    expect(resolvePanelNames('Metabolic Health <script>alert(1)</script>')).toEqual([])
    expect(resolvePanelNames('')).toEqual([])
    expect(resolvePanelNames(null)).toEqual([])
  })

  it('nennt dasselbe Panel nur einmal, egal in welcher Sprache', () => {
    expect(resolvePanelNames('Telomer-Analyse, Telomere Analysis')).toEqual(['Telomer-Analyse'])
  })

  it('prueft nur die ersten 200 Zeichen', () => {
    const lang = `${'x'.repeat(200)}, Metabolic Health`
    expect(resolvePanelNames(lang)).toEqual([])
  })
})
