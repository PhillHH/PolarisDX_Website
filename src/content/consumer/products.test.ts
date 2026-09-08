// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

import { SUPPORTED_LANGUAGES } from '../../i18n'
import { SPRAY_PRODUCT, productContentKeys } from './products'

/**
 * AP21 PT21.2 — Produktwahrheit des Vitamin-D3-Sprays.
 *
 * Geprueft wird der Inhalt, nicht die Darstellung: dass jeder Schluessel in
 * allen zehn Locales real existiert, dass nichts als DE-Kopie durchgereicht
 * wird und dass keine Zahl mit fester englischer Einheit ausgeliefert wird.
 */

const bundle = (locale: string): Record<string, unknown> =>
  JSON.parse(readFileSync(`public/locales/${locale}/consumer.json`, 'utf8')) as Record<
    string,
    unknown
  >

const text = (locale: string, key: string): string => {
  const value = bundle(locale)[key]
  return typeof value === 'string' ? value : ''
}

/** Alle sichtbaren Spray-Schluessel — die Locale-Datei ist flach gehalten. */
const sprayKeys = (locale: string): string[] =>
  Object.keys(bundle(locale)).filter((key) => key.startsWith('spray.'))

describe('PT21.2 Vitamin-D3-Spray — Inhalt', () => {
  it('kennt alle Produktschluessel in allen zehn Locales, nicht leer', () => {
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const key of productContentKeys(SPRAY_PRODUCT)) {
        expect(text(locale, key).trim(), `${locale}: ${key}`).not.toBe('')
      }
    }
  })

  it('hat in allen zehn Locales dieselbe Schluesselstruktur', () => {
    const reference = sprayKeys('de').sort()
    expect(reference.length).toBeGreaterThan(100)
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(sprayKeys(locale).sort(), locale).toEqual(reference)
    }
  })

  it('reicht keine deutsche Fassung als Fallback durch', () => {
    // Kurzstrings wie "12", "25 µg" oder die Einheitenkuerzel sind
    // sprachneutral bzw. von mehreren Sprachen geteilt (IE gilt in de, da und
    // nl) und bleiben absichtlich gleich; alles Erzaehlende darf es nicht
    // sein. Dass die Einheit trotzdem je Locale stimmt, prueft der Test
    // darunter gezielt.
    const neutral = new Set([
      'spray.stats.bottles_value',
      'spray.stats.applications_value',
      'spray.stats.k2_value',
      'spray.stats.d3_value',
    ])
    for (const locale of SUPPORTED_LANGUAGES) {
      if (locale === 'de') continue
      const copied = sprayKeys('de').filter(
        (key) =>
          !neutral.has(key) && text('de', key).length > 3 && text(locale, key) === text('de', key),
      )
      expect(copied, `${locale}: DE-Kopien`).toEqual([])
    }
  })

  it('liefert die Dosierungseinheit lokalisiert, nicht fest englisch', () => {
    // Vorher stand `'1000 IU Vitamin D3 + 25 µg Vitamin K2'` im JSX und ging
    // so in alle zehn Locales. Die freigegebene Copy nutzt IE/UI/j.m./IU.
    const expected: Record<string, string> = {
      de: 'IE',
      en: 'IU',
      // Die freigegebene Copy schreibt "j.m" ohne Schlusspunkt; die
      // Terminologie wird gespiegelt, nicht stillschweigend korrigiert.
      pl: 'j.m',
      fr: 'UI',
      it: 'UI',
      es: 'UI',
      pt: 'UI',
      da: 'IE',
      nl: 'IE',
      cs: 'IU',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      const unit = expected[locale]
      const stat = text(locale, 'spray.stats.d3_value')
      const spec = text(locale, 'spray.facts.dosage_value')
      expect(stat, `${locale}: Stat-Einheit`).toContain(unit)
      expect(spec, `${locale}: Spezifikationszeile`).toContain(unit)
      // Die Einheit muss zu der in der freigegebenen Copy passen.
      expect(text(locale, 'spray.copy_061'), `${locale}: Copy-Beleg`).toContain(unit)
      // Und keine fremde Einheit mitschleppen.
      for (const other of new Set(Object.values(expected))) {
        if (other === unit || unit.includes(other) || other.includes(unit)) continue
        expect(stat, `${locale}: fremde Einheit ${other}`).not.toContain(other)
      }
    }
  })

  it('nennt keinen Preis, kein Angebot, keine Verfuegbarkeit und keine Bewertung', () => {
    const forbidden =
      /(\d+[.,]?\d*\s*(€|eur\b|euro)|\brabatt\b|\bdiscount\b|\bin stock\b|auf lager|lieferzeit|\bdelivery time\b|\bsterne\b|\bstars?\b|\brating\b|\bgtin\b|\bsku\b)/i
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const key of sprayKeys(locale)) {
        expect(forbidden.test(text(locale, key)), `${locale}: ${key}`).toBe(false)
      }
    }
    // Und im Modell selbst gibt es keinen Listenpreis.
    expect(SPRAY_PRODUCT.listPrice).toBeNull()
  })

  it('haelt Identitaet und Bestellkontext stabil', () => {
    expect(SPRAY_PRODUCT.slug).toBe('vitamin-d3-spray')
    // Die Bestell-ID muss serverseitig allowlistet sein — kein freier Name.
    const server = readFileSync('server/server.js', 'utf8')
    const allowlist = server.slice(
      server.indexOf('const CONSUMER_PRODUCT_LABELS'),
      server.indexOf('const CONSUMER_PRODUCT_LABELS') + 300,
    )
    expect(allowlist).toContain(`${SPRAY_PRODUCT.orderId}:`)
    expect(SPRAY_PRODUCT.orderId).not.toContain(' ')
  })

  it('bindet Medien an gemessene Dateiabmessungen', () => {
    const file = readFileSync('src/assets/landingpages-consumer/spray-hero-12pack-office.jpeg')
    let offset = 2
    let width = 0
    let height = 0
    while (offset < file.length) {
      if (file[offset] !== 0xff) {
        offset += 1
        continue
      }
      const marker = file[offset + 1]
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        height = file.readUInt16BE(offset + 5)
        width = file.readUInt16BE(offset + 7)
        break
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2
        continue
      }
      offset += 2 + file.readUInt16BE(offset + 2)
    }
    expect({ width, height }).toEqual({
      width: SPRAY_PRODUCT.hero.width,
      height: SPRAY_PRODUCT.hero.height,
    })
  })

  it('weist ungedeckte Produktzahlen als solche aus', () => {
    // Ehrlichkeit statt Schoenfaerberei: 25 µg K2 und die Dosierungszeile
    // stammen aus dem Quelltext, nicht aus freigegebener Copy.
    const unverified = [...SPRAY_PRODUCT.stats, ...SPRAY_PRODUCT.specs]
      .filter((fact) => fact.evidence === 'CODE_ONLY_UNVERIFIED')
      .map((fact) => fact.valueKey)
    expect(unverified).toEqual(['spray.stats.k2_value', 'spray.facts.dosage_value'])
  })
})
