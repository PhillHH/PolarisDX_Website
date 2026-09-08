// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

import { SUPPORTED_LANGUAGES } from '../../i18n'
import { MASKS_PRODUCT, SPRAY_PRODUCT, productContentKeys } from './products'

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

/** Alle sichtbaren Schluessel eines Namensraums — die Locale-Datei ist flach. */
const namespaceKeys = (locale: string, prefix: string): string[] =>
  Object.keys(bundle(locale)).filter((key) => key.startsWith(prefix))

const sprayKeys = (locale: string): string[] => namespaceKeys(locale, 'spray.')

/** JPEG-Abmessungen aus der Datei lesen — keine Annahme, keine Schaetzung. */
const jpegSize = (file: string): { width: number; height: number } => {
  const data = readFileSync(file)
  let offset = 2
  while (offset < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = data[offset + 1]
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) }
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2
      continue
    }
    offset += 2 + data.readUInt16BE(offset + 2)
  }
  return { width: 0, height: 0 }
}

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
    expect(jpegSize('src/assets/landingpages-consumer/spray-hero-12pack-office.jpeg')).toEqual({
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

describe('PT21.3 Hydrating Masks — Inhalt', () => {
  const maskKeys = (locale: string) => namespaceKeys(locale, 'mask.')

  it('kennt alle Produktschluessel in allen zehn Locales, nicht leer', () => {
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const key of productContentKeys(MASKS_PRODUCT)) {
        expect(text(locale, key).trim(), `${locale}: ${key}`).not.toBe('')
      }
    }
  })

  it('hat in allen zehn Locales dieselbe Schluesselstruktur', () => {
    const reference = maskKeys('de').sort()
    expect(reference.length).toBeGreaterThan(85)
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(maskKeys(locale).sort(), locale).toEqual(reference)
    }
  })

  it('reicht keine deutsche Fassung als Fallback durch', () => {
    // Sprachneutrale Kurzwerte und ein echtes Kognat: "Reinigen" heisst auf
    // Niederlaendisch genauso wie auf Deutsch. Alle uebrigen 88 nl-Strings
    // unterscheiden sich, es ist also kein Fallback.
    const neutral = new Set([
      'mask.stats.masks_value',
      'mask.stats.serum_value',
      'mask.stats.minutes_value',
    ])
    const cognates: Record<string, Set<string>> = { nl: new Set(['mask.copy_055']) }
    for (const locale of SUPPORTED_LANGUAGES) {
      if (locale === 'de') continue
      const copied = maskKeys('de').filter(
        (key) =>
          !neutral.has(key) &&
          !cognates[locale]?.has(key) &&
          text('de', key).length > 3 &&
          text(locale, key) === text('de', key),
      )
      expect(copied, `${locale}: DE-Kopien`).toEqual([])
    }
  })

  it('schreibt die Zahlenspanne so, wie es die freigegebene Copy tut', () => {
    // Fest im JSX stand '15–30' mit Gedankenstrich — it, da und nl schreiben
    // in ihrer freigegebenen Copy einen Bindestrich.
    const dash: Record<string, string> = {
      // Aus der freigegebenen Copy gemessen (alle `mask.*`-Strings, nicht nur
      // zwei): de, en, pl, pt und cs schreiben die Spanne mit
      // Halbgeviertstrich, it, da und nl mit Bindestrich. fr und es fuehren in
      // ihrer Copy ueberhaupt keine Zahlenspanne ("de 15 à 30 minutes") —
      // dort gilt die typografische Standardform.
      de: '–',
      en: '–',
      pl: '–',
      pt: '–',
      cs: '–',
      fr: '–',
      es: '–',
      it: '-',
      da: '-',
      nl: '-',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      const value = text(locale, 'mask.stats.minutes_value')
      expect(value, `${locale}`).toBe(`15${dash[locale]}30`)
      // Die Zahlen selbst muessen in der freigegebenen Copy vorkommen.
      const approved = `${text(locale, 'mask.copy_032')} ${text(locale, 'mask.copy_036')}`
      expect(approved, `${locale}: 15 belegt`).toContain('15')
      expect(approved, `${locale}: 30 belegt`).toContain('30')
    }
  })

  it('nennt keinen Preis, kein Angebot, keine Verfuegbarkeit und keine Bewertung', () => {
    const forbidden =
      /(\d+[.,]?\d*\s*(€|eur\b|euro)|\brabatt\b|\bdiscount\b|\bin stock\b|auf lager|lieferzeit|\bdelivery time\b|\bsterne\b|\bstars?\b|\brating\b|\bgtin\b)/i
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const key of maskKeys(locale)) {
        expect(forbidden.test(text(locale, key)), `${locale}: ${key}`).toBe(false)
      }
    }
    expect(MASKS_PRODUCT.listPrice).toBeNull()
  })

  it('verstaerkt den kosmetischen Nutzen nicht zu einer medizinischen Aussage', () => {
    // Die Pflichthinweise DUERFEN medizinische Begriffe tragen — sie
    // verneinen sie ja gerade ("nicht zur Diagnose, Behandlung oder
    // Vorbeugung"). Ausserhalb dieser beiden Schluessel darf keiner
    // vorkommen.
    const disclaimers = new Set(['mask.copy_028', 'mask.copy_088'])
    // Sprachspezifisch, weil dieselbe Buchstabenfolge nicht ueberall dasselbe
    // heisst: italienisch "cure" ist der Plural von "cura" (Pflege) und steht
    // in "bisognosa di cure visibili" fuer sichtbare PFLEGE — nicht fuer das
    // englische Verb "to cure". Ein gemeinsames Muster hatte hier zwei
    // Fehlalarme erzeugt.
    const shared = 'diagnos\\w*|ekzem|eczema|psoria\\w*|dermatit\\w*'
    const perLocale: Record<string, string> = {
      de: 'heilt|heilen|kuriert|therapiert|krankheit|erkrankung',
      en: 'cures?|treats|treatment|disease|illness',
      pl: 'lecz\\w*|choroba|choroby',
      fr: 'guéri\\w*|maladie',
      it: 'guaris\\w*|guarire|malattia',
      es: 'curar|cura\\s+de\\s+la\\s+enfermedad|enfermedad',
      pt: 'curar|doença',
      da: 'helbred\\w*|sygdom',
      nl: 'genees\\w*|ziekte',
      cs: 'léčb\\w*|léčí|nemoc',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      const medical = new RegExp(`\\b(${shared}|${perLocale[locale]})`, 'i')
      for (const key of maskKeys(locale)) {
        if (disclaimers.has(key)) continue
        expect(medical.test(text(locale, key)), `${locale}: ${key}`).toBe(false)
      }
      // Und die Pflichthinweise muessen wirklich da sein.
      for (const key of disclaimers) {
        expect(text(locale, key).trim(), `${locale}: ${key}`).not.toBe('')
      }
    }
  })

  it('haelt Identitaet und Bestellkontext stabil', () => {
    expect(MASKS_PRODUCT.slug).toBe('hydrating-masks')
    const server = readFileSync('server/server.js', 'utf8')
    const start = server.indexOf('const CONSUMER_PRODUCT_LABELS')
    expect(server.slice(start, start + 300)).toContain(`${MASKS_PRODUCT.orderId}:`)
    expect(MASKS_PRODUCT.orderId).not.toContain(' ')
  })

  it('bindet Medien an gemessene Dateiabmessungen', () => {
    expect(jpegSize('src/assets/landingpages-consumer/mask-hero-botanical.jpeg')).toEqual({
      width: MASKS_PRODUCT.hero.width,
      height: MASKS_PRODUCT.hero.height,
    })
  })

  it('fuehrt keine ungedeckte Produktzahl', () => {
    // Anders als beim Spray sind alle Masken-Zahlen durch freigegebene Copy
    // gedeckt; es gibt hier nichts owner-bound zu melden.
    const unverified = [...MASKS_PRODUCT.stats, ...MASKS_PRODUCT.specs].filter(
      (fact) => fact.evidence === 'CODE_ONLY_UNVERIFIED',
    )
    expect(unverified).toEqual([])
  })
})
