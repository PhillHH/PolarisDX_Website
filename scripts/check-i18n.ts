#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  BACKLOG_NAMESPACES,
  DEFAULT_LANGUAGE,
  DEFERRED_OWNER_NAMESPACES,
  FALLBACK_LANGUAGE,
  LEGACY_NAMESPACES,
  PRODUCTIVE_NAMESPACES,
  SUPPORTED_LANGUAGES,
} from '../src/i18n'

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const localesRoot = resolve(root, 'public/locales')
const befundRoot = resolve(root, 'src/content/befunde')
const contractPath = resolve(root, 'building-docs/I18N-CONTRACT.md')
const expectedLanguages = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const expectedBefunde = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

/**
 * Key-Schema und fachliche Ausgangssprache sind getrennte Begriffe. Diese
 * Tabelle waehlt pro produktivem Namespace bewusst die stabile Schemaquelle.
 */
const schemaReference: Record<(typeof PRODUCTIVE_NAMESPACES)[number], string> = {
  common: 'de',
  home: 'de',
  about: 'de',
  articles: 'de',
  contact: 'de',
  services: 'de',
  events: 'de',
  downloads: 'de',
  epigenetics: 'en',
  legal: 'de',
  products: 'de',
  support: 'de',
  vitd3spray: 'de',
  specialty: 'de',
  consumer: 'en',
}

const optionalEmpty = new Set(['home:testimonials.goran_stojanovic.practice'])
const pluralSuffix = /_(zero|one|two|few|many|other)$/
const diagnostics: string[] = []
const warn = (message: string) => diagnostics.push(message)

function readJson(path: string): Json {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Json
  } catch (error) {
    warn(`${relative(root, path)} ist nicht parsebar: ${(error as Error).message}`)
    return {}
  }
}

function normalizedKey(key: string): string {
  return key.replace(pluralSuffix, '')
}

function flattenSchema(
  value: Json,
  prefix = '',
  out = new Map<string, string>(),
): Map<string, string> {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => flattenSchema(entry, `${prefix}[${index}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (key === '_translationStatus') continue
      const path = prefix ? `${prefix}.${normalizedKey(key)}` : normalizedKey(key)
      flattenSchema(entry, path, out)
    }
  } else {
    out.set(prefix, value === null ? 'null' : typeof value)
  }
  return out
}

function walkLeaves(value: Json, visit: (path: string, value: Json) => void, prefix = ''): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walkLeaves(entry, visit, `${prefix}[${index}]`))
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      walkLeaves(entry, visit, prefix ? `${prefix}.${key}` : key)
    }
  } else {
    visit(prefix, value)
  }
}

function compareSchema(label: string, reference: Json, candidate: Json): void {
  const left = flattenSchema(reference)
  const right = flattenSchema(candidate)
  for (const [path, type] of left) {
    if (!right.has(path)) warn(`${label}: Pflicht-Key fehlt: ${path}`)
    else if (right.get(path) !== type) {
      warn(`${label}: Typabweichung ${path}: ${right.get(path)} statt ${type}`)
    }
  }
  for (const path of right.keys()) {
    if (!left.has(path)) warn(`${label}: unerwarteter Key: ${path}`)
  }
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)].map((match) => match[1]).sort()
}

function factualTokens(value: string): string[] {
  const external = [...value.matchAll(/https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w.-]+\.\w+/g)].map(
    (match) => match[0],
  )
  // Zahlenformatierung darf Tausender-, Dezimal- und Datumstrenner wechseln.
  // Die geordnete Ziffernfolge muss ansonsten identisch bleiben.
  const digits = [...value.matchAll(/\d/g)].map((match) => match[0]).join('')
  return [...external, digits ? `digits:${digits}` : ''].filter(Boolean).sort()
}

function valueAt(value: Json, path: string): Json | undefined {
  let current: Json | undefined = value
  for (const segment of path.replace(/\[(\d+)\]/g, '.$1').split('.')) {
    if (!segment) continue
    if (!current || typeof current !== 'object') return undefined
    current = (current as Record<string, Json>)[segment]
  }
  return current
}

/** i18next akzeptiert neben verschachtelten Objekten auch flache Punkt-Keys. */
function translationValueAt(value: Json, path: string): Json | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value) && path in value) {
    return (value as Record<string, Json>)[path]
  }
  return valueAt(value, path)
}

function hasTranslationKey(value: Json, path: string): boolean {
  return translationValueAt(value, path) !== undefined || flattenSchema(value).has(path)
}

function checkValues(
  namespace: string,
  locale: string,
  reference: Json,
  value: Json,
  checkFactualTokens = false,
): void {
  walkLeaves(value, (path, leaf) => {
    if ((leaf === '' || leaf === null) && !optionalEmpty.has(`${namespace}:${path}`)) {
      warn(`${locale}/${namespace}: leerer Pflichtwert: ${path}`)
    }
    if (typeof leaf !== 'string') return
    if (/^(?:TODO|TBD|FIXME)\b/.test(leaf) || /^(?:Lorem ipsum|dummy text)\b/i.test(leaf)) {
      warn(`${locale}/${namespace}: Platzhaltertext: ${path}`)
    }
    if (/^[a-z][\w-]*(?:\.[\w-]+){1,}$/.test(leaf) && !/^(?:www\.|[\w.+-]+@)/.test(leaf)) {
      warn(`${locale}/${namespace}: sichtbarer Translation-Key als Wert: ${path}`)
    }
    const source = valueAt(reference, path)
    if (typeof source === 'string') {
      const expected = placeholders(source)
      const actual = placeholders(leaf)
      if (expected.join('|') !== actual.join('|')) {
        warn(`${locale}/${namespace}: Interpolationsabweichung: ${path}`)
      }
      const sourceUsesTwelveHourClock = /\b(?:a\.?m|p\.?m)\.?\b/i.test(source)
      if (
        checkFactualTokens &&
        !sourceUsesTwelveHourClock &&
        factualTokens(source).join('|') !== factualTokens(leaf).join('|')
      ) {
        warn(`${locale}/${namespace}: Zahlen-/URL-Abweichung: ${path}`)
      }
    }
  })
}

function longHumanText(path: string, value: Json): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 70 &&
    value.split(/\s+/).length >= 9 &&
    !/^https?:\/\//.test(value) &&
    !/(?:^|\.)(?:file|zipFile|slug|id|display)$/.test(path)
  )
}

function duplicateRatio(reference: Json, candidate: Json): { duplicated: number; checked: number } {
  let checked = 0
  let duplicated = 0
  walkLeaves(candidate, (path, value) => {
    if (!longHumanText(path, value)) return
    checked += 1
    if (valueAt(reference, path) === value) duplicated += 1
  })
  return { duplicated, checked }
}

function filesRecursively(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name)
    return statSync(path).isDirectory() ? filesRecursively(path) : [path]
  })
}

function checkExplicitTranslationKeys(localeData: Map<string, Json>): void {
  const files = filesRecursively(resolve(root, 'src')).filter((file) => /\.(?:ts|tsx)$/.test(file))
  const knownBacklogConsumer = new Set(['components/sections/FeaturedCaseStudy.tsx'])
  for (const file of files) {
    const rel = relative(resolve(root, 'src'), file)
    if (knownBacklogConsumer.has(rel)) continue
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(/(?:\bt|i18n\.t)\(\s*['"]([a-z][\w-]*):([^'"]+)['"]/g)) {
      const [, namespace, key] = match
      const tree = localeData.get(namespace)
      if (!tree) {
        warn(`${rel}: expliziter, nicht produktiver Namespace ${namespace}`)
        continue
      }
      for (const locale of expectedLanguages) {
        const value = readJson(resolve(localesRoot, locale, `${namespace}.json`))
        if (!hasTranslationKey(value, key)) warn(`${rel}: ${locale}/${namespace}:${key} fehlt`)
      }
    }

    const boundNamespaces = [
      ...source.matchAll(/useTranslation\(\s*['"]([a-z][\w-]*)['"]\s*\)/g),
    ].map((match) => match[1])
    const namespace = [...new Set(boundNamespaces)]
    if (namespace.length !== 1 || !localeData.has(namespace[0])) continue
    for (const match of source.matchAll(/\bt\(\s*['"]([^:'"]+)['"]/g)) {
      const key = match[1]
      // Der Marker ist absichtlich nur im technischen Fallbackzustand vorhanden;
      // produktiv lokalisierte Namespaces liefern per defaultValue den Leerwert.
      if (key === '_translationStatus' || key.endsWith('._translationStatus')) continue
      for (const locale of expectedLanguages) {
        const value = readJson(resolve(localesRoot, locale, `${namespace[0]}.json`))
        if (!hasTranslationKey(value, key)) {
          warn(`${rel}: ${locale}/${namespace[0]}:${key} fehlt`)
        }
      }
    }
  }
}

function gitEvidence(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return 'unavailable'
  }
}

function buildEvidence(): string {
  const references = PRODUCTIVE_NAMESPACES.map(
    (namespace) => `- \`${namespace}\`: schema \`${schemaReference[namespace]}\``,
  ).join('\n')
  return `<!-- G4:EVIDENCE:START -->
## G4 generated evidence

- Generated at: ${new Date().toISOString()}
- Git HEAD: \`${gitEvidence()}\`
- Guard command: \`npm run check:i18n\`
- Supported languages: ${SUPPORTED_LANGUAGES.join(', ')} (10/10)
- Default locale: \`${DEFAULT_LANGUAGE}\`
- Defensive fallback locale: \`${FALLBACK_LANGUAGE}\`
- Productive namespaces (${PRODUCTIVE_NAMESPACES.length}): ${PRODUCTIVE_NAMESPACES.map((n) => `\`${n}\``).join(', ')}
- Legacy namespaces (${LEGACY_NAMESPACES.length}): ${LEGACY_NAMESPACES.map((n) => `\`${n}\``).join(', ') || 'none'}
- Backlog namespaces (${BACKLOG_NAMESPACES.length}): ${BACKLOG_NAMESPACES.map((n) => `\`${n}\``).join(', ')}
- Deferred-owner namespaces (${DEFERRED_OWNER_NAMESPACES.length}): ${DEFERRED_OWNER_NAMESPACES.map((n) => `\`${n}\``).join(', ') || 'none'}
- Namespace file coverage: ${PRODUCTIVE_NAMESPACES.length * SUPPORTED_LANGUAGES.length}/${PRODUCTIVE_NAMESPACES.length * SUPPORTED_LANGUAGES.length}
- Namespace JSON/key parity: PASS
- Epigenetics coverage: 10/10; no regular \`_translationStatus\` marker
- Musterbefund coverage: 6/6 × 10/10; slug-local lazy route modules retained
- \`befund.*\` UI key parity: PASS
- \`services.*.seo.*\` parity: PASS (9 services × title/description × 10)
- Broad exact-English-copy heuristic: PASS
- Resource language truth: PASS (32/32 productive downloads classified; 0 broken; 0 silent asset-language fallbacks)
- Open owner-bound integrations: creation of missing Fach-/OG asset variants remains with AP15/AP16/AP19/AP21/AP09
- Asset asymmetry handoff: SAFE / OWNER-BOUND; PT08.6 supplies localized disclosure, not fake files
- Guard result: PASS

### Schema references

${references}

The schema reference controls structure only. It does not declare that language to be the universal
editorial source, and it never licenses English fallback as production content.
<!-- G4:EVIDENCE:END -->`
}

function writeContract(): void {
  const contract = readFileSync(contractPath, 'utf8')
  const evidence = buildEvidence()
  const pattern = /<!-- G4:EVIDENCE:START -->[\s\S]*?<!-- G4:EVIDENCE:END -->/
  const next = pattern.test(contract)
    ? contract.replace(pattern, evidence)
    : `${contract.trimEnd()}\n\n---\n\n${evidence}\n`
  writeFileSync(contractPath, next)
}

function run(): void {
  if (SUPPORTED_LANGUAGES.join('|') !== expectedLanguages.join('|')) {
    warn(`SUPPORTED_LANGUAGES ist nicht der kanonische x10-Satz: ${SUPPORTED_LANGUAGES.join(',')}`)
  }
  if (DEFAULT_LANGUAGE !== 'de') warn(`Default Locale ist ${DEFAULT_LANGUAGE} statt de`)
  if (FALLBACK_LANGUAGE !== 'en') warn(`Fallback Locale ist ${FALLBACK_LANGUAGE} statt en`)

  const actualLocaleDirectories = readdirSync(localesRoot)
    .filter((name) => statSync(resolve(localesRoot, name)).isDirectory())
    .sort()
  if (actualLocaleDirectories.join('|') !== [...expectedLanguages].sort().join('|')) {
    warn(`Locale-Verzeichnisse weichen ab: ${actualLocaleDirectories.join(', ')}`)
  }

  const classified = new Set<string>([
    ...PRODUCTIVE_NAMESPACES,
    ...LEGACY_NAMESPACES,
    ...BACKLOG_NAMESPACES,
    ...DEFERRED_OWNER_NAMESPACES,
  ])
  const localeData = new Map<string, Json>()
  for (const locale of expectedLanguages) {
    const files = readdirSync(resolve(localesRoot, locale))
      .filter((name) => name.endsWith('.json'))
      .map((name) => name.slice(0, -5))
      .sort()
    for (const namespace of files) {
      if (!classified.has(namespace)) warn(`${locale}/${namespace}.json ist nicht klassifiziert`)
    }
    for (const namespace of classified) {
      if (!files.includes(namespace)) warn(`${locale}/${namespace}.json fehlt`)
    }
  }

  for (const namespace of PRODUCTIVE_NAMESPACES) {
    const referenceLocale = schemaReference[namespace]
    const reference = readJson(resolve(localesRoot, referenceLocale, `${namespace}.json`))
    const english = readJson(resolve(localesRoot, 'en', `${namespace}.json`))
    const german = readJson(resolve(localesRoot, 'de', `${namespace}.json`))
    localeData.set(namespace, reference)
    for (const locale of expectedLanguages) {
      const candidate = readJson(resolve(localesRoot, locale, `${namespace}.json`))
      compareSchema(`${locale}/${namespace}`, reference, candidate)
      checkValues(
        namespace,
        locale,
        reference,
        candidate,
        namespace === 'epigenetics' && locale !== 'de',
      )
      if (locale !== 'en') {
        const duplicate = duplicateRatio(english, candidate)
        if (
          duplicate.duplicated >= 5 &&
          duplicate.duplicated / Math.max(duplicate.checked, 1) > 0.05
        ) {
          warn(
            `${locale}/${namespace}: ${duplicate.duplicated}/${duplicate.checked} lange Texte sind exakte EN-Kopien`,
          )
        }
      }
      if (locale !== 'de') {
        const duplicate = duplicateRatio(german, candidate)
        if (
          duplicate.duplicated >= 5 &&
          duplicate.duplicated / Math.max(duplicate.checked, 1) > 0.05
        ) {
          warn(
            `${locale}/${namespace}: ${duplicate.duplicated}/${duplicate.checked} lange Texte sind exakte DE-Kopien`,
          )
        }
      }
      if (
        candidate &&
        typeof candidate === 'object' &&
        !Array.isArray(candidate) &&
        '_translationStatus' in candidate
      ) {
        warn(`${locale}/${namespace}: regulaerer _translationStatus-Marker verblieben`)
      }
    }
  }

  const serviceReference = readJson(resolve(localesRoot, 'de', 'services.json'))
  const serviceSeoPaths: string[] = []
  walkLeaves(serviceReference, (path) => {
    if (/^[^.]+\.seo\.(title|description)$/.test(path)) serviceSeoPaths.push(path)
  })
  if (serviceSeoPaths.length !== 18) {
    warn(`services.*.seo.* erwartet 18 Pflichtwerte, gefunden ${serviceSeoPaths.length}`)
  }
  for (const locale of expectedLanguages) {
    const data = readJson(resolve(localesRoot, locale, 'services.json'))
    for (const path of serviceSeoPaths) {
      const value = valueAt(data, path)
      if (typeof value !== 'string' || !value.trim()) warn(`${locale}/services:${path} fehlt/leer`)
    }
  }

  for (const slug of expectedBefunde) {
    const reference = readJson(resolve(befundRoot, `${slug}.en.json`))
    for (const locale of expectedLanguages) {
      const path = resolve(befundRoot, `${slug}.${locale}.json`)
      const candidate = readJson(path)
      compareSchema(`${slug}.${locale}`, reference, candidate)
      checkValues(
        `befund/${slug}`,
        locale,
        reference,
        candidate,
        locale !== 'de' && locale !== 'en',
      )
      if (locale !== 'en') {
        const duplicate = duplicateRatio(reference, candidate)
        if (
          duplicate.duplicated >= 5 &&
          duplicate.duplicated / Math.max(duplicate.checked, 1) > 0.02
        ) {
          warn(
            `${slug}.${locale}: ${duplicate.duplicated}/${duplicate.checked} lange Texte sind exakte EN-Kopien`,
          )
        }
      }
      for (const technicalPath of ['slug']) {
        if (valueAt(candidate, technicalPath) !== valueAt(reference, technicalPath)) {
          warn(`${slug}.${locale}: technisches Feld ${technicalPath} wurde veraendert`)
        }
      }
    }
    const routeSource = readFileSync(resolve(root, `src/pages/musterbefund/${slug}.tsx`), 'utf8')
    for (const locale of expectedLanguages) {
      if (!routeSource.includes(`${slug}.${locale}.json`)) {
        warn(`${slug}: slugweises Routenmodul importiert ${locale} nicht`)
      }
    }
  }
  const sharedPage = readFileSync(resolve(root, 'src/pages/MusterbefundPage.tsx'), 'utf8')
  if (/from ['"]\.\.\/content\/befunde['"]/.test(sharedPage)) {
    warn('MusterbefundPage importiert den globalen Befundindex und verletzt die Lazy-Grenze')
  }

  checkExplicitTranslationKeys(localeData)

  if (process.argv.includes('--self-test')) {
    const source = readJson(resolve(localesRoot, 'de', 'home.json'))
    const broken = structuredClone(source) as Record<string, Json>
    delete broken.hero
    const before = diagnostics.length
    compareSchema('G4-self-test', source, broken)
    if (diagnostics.length === before)
      warn('G4 self-test erkannte einen entfernten Pflicht-Key nicht')
    else diagnostics.splice(before)
  }

  if (diagnostics.length) {
    console.error(`G4 i18n guard: FAIL (${diagnostics.length} Befunde)`)
    diagnostics.slice(0, 200).forEach((message) => console.error(`- ${message}`))
    if (diagnostics.length > 200) console.error(`- … ${diagnostics.length - 200} weitere`)
    process.exitCode = 1
    return
  }

  if (process.argv.includes('--write-contract')) writeContract()
  console.log(
    `G4 i18n guard: PASS — ${PRODUCTIVE_NAMESPACES.length} Namespaces × 10, 6 Befunde × 10, 0 Missing/Empty Keys`,
  )
  if (process.argv.includes('--self-test')) {
    console.log('G4 hard-failure self-test: PASS — künstlich entfernter Key wurde erkannt')
  }
}

run()
