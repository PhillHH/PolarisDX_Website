// @vitest-environment node
import { describe, expect, it } from 'vitest'
import healthyAgingDe from './healthy-aging.de.json'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n'
import { BEFUND_ORDER } from './meta'
import {
  BefundValidationError,
  defineBefundFamily,
  validateBefund,
  validateBefundInventory,
} from './model'

const copy = <T>(value: T): T => structuredClone(value)

describe('Befund launch-data validation', () => {
  it('normalisiert validierte Dokumentmetadaten aus dem realen Content', () => {
    const result = validateBefund(healthyAgingDe, 'healthy-aging', 'de')
    expect(result.slug).toBe('healthy-aging')
    expect(result.title).toBe('Healthy Aging')
    expect(result.introduction.length).toBeGreaterThan(0)
    expect(result.blocks.length).toBeGreaterThan(0)
  })

  it('weist unbekannte Blocktypen hart zurueck', () => {
    const invalid = copy(healthyAgingDe) as unknown as Record<string, unknown>
    const blocks = invalid.blocks as Record<string, unknown>[]
    blocks[0] = { ...blocks[0], type: 'unknown-launch-block' }
    expect(() => validateBefund(invalid, 'healthy-aging', 'de')).toThrow(
      /unknown block type unknown-launch-block/u,
    )
  })

  it('weist fehlende Pflichtfelder hart zurueck', () => {
    const invalid = copy(healthyAgingDe) as unknown as Record<string, unknown>
    const blocks = invalid.blocks as Record<string, unknown>[]
    delete blocks[0].claim
    expect(() => validateBefund(invalid, 'healthy-aging', 'de')).toThrow(/blocks\[0\]\.claim/u)
  })

  it('weist eine falsche Radar-Dimension hart zurueck', () => {
    const invalid = copy(healthyAgingDe) as unknown as Record<string, unknown>
    const radar = (invalid.blocks as Record<string, unknown>[]).find(
      (block) => block.type === 'radar',
    )
    radar!.axes = (radar!.axes as unknown[]).slice(1)
    expect(() => validateBefund(invalid, 'healthy-aging', 'de')).toThrow(
      /expected 11 labels, got 10/u,
    )
  })

  it('weist NaN und Infinity rekursiv hart zurueck', () => {
    const invalid = copy(healthyAgingDe) as unknown as Record<string, unknown>
    const ageDots = (invalid.blocks as Record<string, unknown>[]).find(
      (block) => block.type === 'ageDots',
    )
    ageDots!.chronological = Number.NaN
    expect(() => validateBefund(invalid, 'healthy-aging', 'de')).toThrow(/must be finite/u)
  })

  it('weist fehlende oder fremde Locale-Keys hart zurueck', () => {
    const locales = Object.fromEntries(
      SUPPORTED_LANGUAGES.filter((locale) => locale !== 'cs').map((locale) => [
        locale,
        healthyAgingDe,
      ]),
    ) as Record<SupportedLanguage, unknown>
    expect(() => defineBefundFamily('healthy-aging', locales)).toThrow(
      /locale set must be exactly/u,
    )
  })

  it('weist doppelte oder ungeordnete Family-Slugs hart zurueck', () => {
    expect(() =>
      validateBefundInventory([{ slug: BEFUND_ORDER[0] }, { slug: BEFUND_ORDER[0] }]),
    ).toThrow(BefundValidationError)
  })
})
