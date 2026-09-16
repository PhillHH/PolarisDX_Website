// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import {
  BACKLOG_NAMESPACES,
  DEFERRED_OWNER_NAMESPACES,
  LEGACY_NAMESPACES,
  PRODUCTIVE_NAMESPACES,
  SUPPORTED_LANGUAGES,
} from '../i18n'
import {
  findLocaleSchemaDrift,
  findNamespaceFileDrift,
  flattenLocaleSchema,
  type LocaleJson,
} from './i18nSchema'

/**
 * AP27 PT27.1 — der G4-i18n-Guard erkennt Drift wirklich.
 *
 * Der Guard selbst liest Dateien und endet mit einem Exit-Code; hier steht die Erkennungslogik,
 * die er benutzt, unter Test — einschliesslich einer Mutation echter Locale-Daten.
 */

const ROOT = path.resolve(__dirname, '..', '..')
const readLocale = (locale: string, namespace: string) =>
  JSON.parse(
    fs.readFileSync(path.join(ROOT, 'public', 'locales', locale, `${namespace}.json`), 'utf8'),
  ) as LocaleJson

describe('PT27.1 · Schema-Drift je Namespace', () => {
  const reference: LocaleJson = {
    hero: { title: 'Titel', cta: 'Angebot anfragen' },
    items: ['a', 'b'],
    count_one: '{{count}} Befund',
    count_other: '{{count}} Befunde',
  }

  it('meldet bei identischem Schema nichts', () => {
    expect(findLocaleSchemaDrift(reference, structuredClone(reference))).toEqual([])
  })

  it('erkennt einen fehlenden Pflicht-Key mit vollem Pfad', () => {
    const candidate = structuredClone(reference) as { hero: Record<string, string> }
    delete candidate.hero.cta
    expect(findLocaleSchemaDrift(reference, candidate as LocaleJson)).toEqual([
      { kind: 'missing', path: 'hero.cta' },
    ])
  })

  it('erkennt einen unerwarteten Key, statt ihn still zu dulden', () => {
    const candidate = { ...(structuredClone(reference) as object), legacy: 'alt' } as LocaleJson
    expect(findLocaleSchemaDrift(reference, candidate)).toEqual([
      { kind: 'unexpected', path: 'legacy' },
    ])
  })

  it('erkennt eine Typabweichung (Text statt Objekt)', () => {
    const candidate = { ...(structuredClone(reference) as object), hero: 'flach' } as LocaleJson
    const issues = findLocaleSchemaDrift(reference, candidate)
    expect(issues).toContainEqual({ kind: 'missing', path: 'hero.title' })
    expect(issues).toContainEqual({ kind: 'unexpected', path: 'hero' })
  })

  it('erkennt eine Typabweichung am selben Pfad', () => {
    const candidate = { ...(structuredClone(reference) as object), items: ['a', 2] } as LocaleJson
    expect(findLocaleSchemaDrift(reference, candidate)).toEqual([
      { kind: 'type', path: 'items[1]', expected: 'string', actual: 'number' },
    ])
  })

  it('erkennt ein fehlendes Array-Element', () => {
    const candidate = { ...(structuredClone(reference) as object), items: ['a'] } as LocaleJson
    expect(findLocaleSchemaDrift(reference, candidate)).toEqual([
      { kind: 'missing', path: 'items[1]' },
    ])
  })

  it('akzeptiert sprachabhaengige Pluralformen (pl/cs) ohne Drift', () => {
    const polish = {
      ...(structuredClone(reference) as object),
      count_one: '{{count}} wynik',
      count_few: '{{count}} wyniki',
      count_many: '{{count}} wyników',
      count_other: '{{count}} wyniku',
    } as LocaleJson
    expect(findLocaleSchemaDrift(reference, polish)).toEqual([])
  })

  it('zaehlt den Uebersetzungsmarker nicht als Inhalt', () => {
    expect(flattenLocaleSchema({ _translationStatus: 'fallback', a: 'x' })).toEqual(
      new Map([['a', 'string']]),
    )
  })

  it('erkennt einen entfernten Abschnitt in ECHTEN Locale-Daten (Mutation)', () => {
    const source = readLocale('de', 'home')
    const broken = structuredClone(source) as Record<string, LocaleJson>
    const [firstSection] = Object.keys(broken).filter((key) => key !== '_translationStatus')
    delete broken[firstSection]
    const issues = findLocaleSchemaDrift(source, broken)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.every((issue) => issue.kind === 'missing')).toBe(true)
    expect(issues.every((issue) => issue.path.startsWith(firstSection))).toBe(true)
  })
})

describe('PT27.1 · Namespace-Dateien je Locale', () => {
  const classified = new Set<string>([
    ...PRODUCTIVE_NAMESPACES,
    ...LEGACY_NAMESPACES,
    ...BACKLOG_NAMESPACES,
    ...DEFERRED_OWNER_NAMESPACES,
  ])

  it('erkennt eine fehlende produktive Namespace-Datei', () => {
    const files = [...classified].filter((namespace) => namespace !== 'consumer')
    expect(findNamespaceFileDrift(files, classified)).toEqual({
      unclassified: [],
      missing: ['consumer'],
    })
  })

  it('erkennt eine Datei, die keiner Namespace-Klasse zugeordnet ist', () => {
    const files = [...classified, 'chat']
    expect(findNamespaceFileDrift(files, classified)).toEqual({
      unclassified: ['chat'],
      missing: [],
    })
  })

  it('findet im Repository fuer alle zehn Locales keine Namespace-Drift', () => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const files = fs
        .readdirSync(path.join(ROOT, 'public', 'locales', locale))
        .filter((name) => name.endsWith('.json'))
        .map((name) => name.slice(0, -'.json'.length))
      expect(findNamespaceFileDrift(files, classified), locale).toEqual({
        unclassified: [],
        missing: [],
      })
    }
  })
})
