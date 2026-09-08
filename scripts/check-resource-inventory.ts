#!/usr/bin/env node
/**
 * AP19 PT19.1 — Resource-Inventar-Guard.
 *
 * Beweist gegen das Dateisystem und gegen alle zehn Locale-Dateien, dass
 * `src/content/resources/resourceInventory.ts` die kanonische Wahrheit ist:
 *
 *  1. Asset-IDs sind eindeutig, formstabil und pfad-/sprach-/titelunabhaengig.
 *  2. Jede deklarierte Datei existiert; Groesse, SHA-256, MIME und Seitenzahl
 *     sind gemessen und nicht behauptet.
 *  3. Jede Datei unter `public/downloads` ist genau einmal klassifiziert —
 *     kein unklassifizierter Rest, kein doppelt zugeordnetes Asset.
 *  4. Die Sprachmatrix ist real: kein stiller Fallback in die falsche Sprache,
 *     Nur-DE-Ressourcen sind als offenlegungspflichtig markiert.
 *  5. Jede sichtbare Ressource traegt genau eine Auslieferungsklasse.
 *  6. Sichtbare kaputte Links = 0.
 *  7. Sichtbare Groessen-/Seitenangaben decken sich mit der Datei.
 *  8. Das Inventar ist keine fuenfte Parallelliste: die Menge der produktiv
 *     verlinkten Dateien deckt sich exakt mit den ACTIVE_VISIBLE-Varianten.
 *
 * Die Sprache der Epigenetik-PDFs wurde in PT19.1 einmalig am extrahierten
 * Textinhalt gemessen. Die SHA-256-Pins halten dieses Ergebnis gueltig: aendert
 * sich eine Datei, schlaegt dieser Guard fehl und die Messung ist zu wiederholen.
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import {
  RESOURCE_INVENTORY,
  requiresLanguageDisclosure,
  type ResourceAssetLanguage,
  type ResourceRecord,
} from '../src/content/resources/resourceInventory'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const downloadsRoot = resolve(root, 'public/downloads')
// AP19 PT19.4: gegatete Assets liegen ausserhalb von public/. Der Wurzelpfad
// haengt deshalb an der Speicherklasse, nicht an einer festen Annahme.
const protectedRoot = resolve(root, 'storage/protected')
const variantRoot = (variant: { storage: string }) =>
  variant.storage === 'PROTECTED' ? protectedRoot : downloadsRoot
const errors: string[] = []
const fail = (message: string) => errors.push(message)
const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T

// ---------------------------------------------------------------- 1. Identitaet
const ID_SHAPE = /^rsc-(epi|prd)-\d{3}$/u
const seenIds = new Set<string>()
for (const resource of RESOURCE_INVENTORY) {
  if (!ID_SHAPE.test(resource.id)) fail(`Asset-ID ohne stabile Form: ${resource.id}`)
  if (seenIds.has(resource.id)) fail(`Doppelte Asset-ID: ${resource.id}`)
  seenIds.add(resource.id)
  if (resource.variants.length === 0) fail(`${resource.id}: keine Variante`)

  // Pfad-/Sprach-/Titelunabhaengigkeit: die ID darf sich aus keiner Datei und
  // aus keinem Label ableiten lassen, sonst waere sie beim Umbenennen instabil.
  for (const variant of resource.variants) {
    const stem = variant.path.replace(/\.[^.]+$/u, '').toLowerCase()
    if (stem.includes(resource.id) || resource.id.includes(variant.path.toLowerCase())) {
      fail(`${resource.id}: ID ist aus dem Dateipfad abgeleitet (${variant.path})`)
    }
  }
  for (const key of [...resource.labelKeys, ...resource.descriptionKeys]) {
    if (key.toLowerCase().includes(resource.id)) fail(`${resource.id}: ID ist titelabgeleitet`)
  }
  const languages = resource.variants.map((variant) => variant.language)
  if (new Set(languages).size !== languages.length) {
    fail(`${resource.id}: doppelte Sprachvariante`)
  }
}

// ------------------------------------------------- 2./3. Datei- und Metadatenwahrheit
const declaredPaths = new Map<string, string>()
for (const resource of RESOURCE_INVENTORY) {
  for (const variant of resource.variants) {
    const owner = declaredPaths.get(variant.path)
    if (owner) fail(`${variant.path}: doppelt zugeordnet (${owner} und ${resource.id})`)
    declaredPaths.set(variant.path, resource.id)

    const absolute = resolve(variantRoot(variant), variant.path)
    if (!existsSync(absolute)) {
      fail(`${resource.id}: Datei fehlt (${variant.path})`)
      continue
    }
    const bytes = readFileSync(absolute)
    if (bytes.length !== variant.bytes) {
      fail(`${resource.id}/${variant.path}: Groesse ${variant.bytes} != ${bytes.length}`)
    }
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    if (sha256 !== variant.sha256) fail(`${resource.id}/${variant.path}: SHA-256 abweichend`)

    const isPdf = bytes.subarray(0, 5).toString('latin1') === '%PDF-'
    const isZip = bytes.subarray(0, 2).toString('latin1') === 'PK'
    const measuredMime = isPdf ? 'application/pdf' : isZip ? 'application/zip' : 'unknown'
    if (measuredMime !== variant.mime) {
      fail(`${resource.id}/${variant.path}: MIME ${variant.mime} != ${measuredMime}`)
    }
    // Seitenzahl: ein /MediaBox je Seitenobjekt. Verschachtelte /Pages-Knoten
    // fuehren bei /Count in die Irre, MediaBox nicht.
    const measuredPages = isPdf
      ? (bytes.toString('latin1').match(/\/MediaBox/gu)?.length ?? 0)
      : null
    if (measuredPages !== variant.pages) {
      fail(`${resource.id}/${variant.path}: Seiten ${variant.pages} != ${measuredPages}`)
    }
    if (variant.version !== null) fail(`${resource.id}: erfundene Version deklariert`)
    if (variant.date !== null && variant.dateEvidence === 'NONE') {
      fail(`${resource.id}/${variant.path}: Datum ohne Beleg`)
    }
    if (variant.date === null && variant.dateEvidence !== 'NONE') {
      fail(`${resource.id}/${variant.path}: Datumsbeleg ohne Datum`)
    }
    // Speicherklasse und Auslieferungsklasse muessen zusammenpassen — sonst
    // liegt entweder ein gegatetes Asset oeffentlich oder ein freies
    // unerreichbar.
    const expectedStorage = resource.deliveryClass === 'GATED' ? 'PROTECTED' : 'PUBLIC_STATIC'
    if (variant.storage !== expectedStorage) {
      fail(`${resource.id}: ${resource.deliveryClass} mit storage ${variant.storage}`)
    }
    if (variant.storage === 'PROTECTED' && existsSync(resolve(downloadsRoot, variant.path))) {
      fail(`${resource.id}: geschuetztes Asset liegt zusaetzlich oeffentlich (${variant.path})`)
    }
  }
}

const filesBelow = (base: string) =>
  readdirSync(base, { recursive: true, withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && ['.pdf', '.zip'].includes(extname(entry.name).toLowerCase()),
    )
    .map((entry) => resolve(entry.parentPath, entry.name).slice(base.length + 1))

// Beide Ablagen werden gesweept: eine unklassifizierte Datei in der
// geschuetzten Ablage waere genauso ein Loch wie eine unter public/.
const publicPaths = filesBelow(downloadsRoot)
const protectedPaths = filesBelow(protectedRoot)
const physicalPaths = [...publicPaths, ...protectedPaths]
for (const path of physicalPaths) {
  if (!declaredPaths.has(path)) fail(`Unklassifizierte Download-Datei: ${path}`)
}

// -------------------------------------------------- 4./5. Klassifikation und Sichtbarkeit
const DELIVERY_CLASSES = new Set(['FREE_PUBLIC', 'GATED', 'NOT_LAUNCH_VISIBLE'])
for (const resource of RESOURCE_INVENTORY) {
  if (!DELIVERY_CLASSES.has(resource.deliveryClass)) {
    fail(`${resource.id}: unbekannte Auslieferungsklasse`)
  }
  const visible = resource.lifecycle === 'ACTIVE_VISIBLE'
  if (visible && resource.deliveryClass === 'NOT_LAUNCH_VISIBLE') {
    fail(`${resource.id}: sichtbar, aber NOT_LAUNCH_VISIBLE`)
  }
  // Ein freies Asset ist ueber einen Dateilink sichtbar, ein gegatetes ueber
  // das Gate. Ein gegatetes Asset MIT Dateilink waere der Bypass selbst.
  if (
    visible &&
    resource.deliveryClass === 'FREE_PUBLIC' &&
    resource.renderedReferenceKeys.length === 0
  ) {
    fail(`${resource.id}: ACTIVE_VISIBLE ohne produktiven Link`)
  }
  if (visible && resource.deliveryClass === 'GATED' && resource.renderedReferenceKeys.length > 0) {
    fail(`${resource.id}: GATED mit produktivem Dateilink`)
  }
  if (visible && resource.visibleFrom.length === 0) {
    fail(`${resource.id}: ACTIVE_VISIBLE ohne Anzeigeort`)
  }
  if (!visible && resource.renderedReferenceKeys.length > 0) {
    fail(`${resource.id}: ${resource.lifecycle} trotz produktivem Link`)
  }
  if (resource.lifecycle === 'LEGACY_ORPHAN' && resource.deliveryClass !== 'NOT_LAUNCH_VISIBLE') {
    fail(`${resource.id}: verwaist, aber launchsichtbar klassifiziert`)
  }
  if (
    resource.deliveryClass === 'GATED' &&
    resource.variants.some((v) => v.storage !== 'PROTECTED')
  ) {
    fail(`${resource.id}: GATED bei oeffentlich erratbarer URL`)
  }
}

// ------------------------------------------- 6. Sprachmatrix und sichtbare Links x10
const byPath = new Map(
  RESOURCE_INVENTORY.flatMap((resource) =>
    resource.variants.map((variant) => [variant.path, { resource, variant }] as const),
  ),
)
const renderedKeys = new Set(RESOURCE_INVENTORY.flatMap((r) => r.renderedReferenceKeys))
const linkedPaths = new Set<string>()

const collect = (value: unknown, path: string, out: Array<{ key: string; file: string }>) => {
  if (Array.isArray(value)) value.forEach((entry, i) => collect(entry, `${path}[${i}]`, out))
  else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) =>
      collect(entry, path ? `${path}.${key}` : key, out),
    )
  } else if (typeof value === 'string' && /\.(?:pdf|zip)$/iu.test(value)) {
    out.push({ key: path, file: value })
  }
  return out
}

for (const locale of SUPPORTED_LANGUAGES) {
  const epigenetics = readJson<Record<string, unknown>>(
    resolve(root, `public/locales/${locale}/epigenetics.json`),
  )
  for (const { key, file } of collect(epigenetics, '', [])) {
    const entry = byPath.get(`epigenetics/${file}`)
    if (!entry) {
      fail(`${locale}/epigenetics:${key}: sichtbarer Link ohne Asset (${file})`)
      continue
    }
    const namespaced = `epigenetics:${key}`
    if (!renderedKeys.has(namespaced)) continue
    linkedPaths.add(entry.variant.path)

    // Reale Sprachmatrix: DE bekommt DE, alle anderen EN — und nur dann DE,
    // wenn es keine EN-Datei gibt. Ein stiller Fallback ist damit ausgeschlossen.
    const expected: ResourceAssetLanguage =
      locale === 'de'
        ? 'de'
        : entry.resource.variants.some((v) => v.language === 'en')
          ? 'en'
          : 'de'
    if (entry.variant.language !== expected) {
      fail(`${locale}/epigenetics:${key}: Sprache ${entry.variant.language}, erwartet ${expected}`)
    }
    if (
      locale !== 'de' &&
      entry.variant.language === 'de' &&
      !requiresLanguageDisclosure(entry.resource)
    ) {
      fail(`${locale}/epigenetics:${key}: DE-Auslieferung ohne Offenlegungspflicht`)
    }
  }
}

// ---------------------------------------------------- 7. Sichtbare Groessen-/Seitenangaben
const sizeClaim = /(\d+(?:[.,]\d+)?)\s*(KB|KiB|Ko|kB|MB|MiB|Mo)\b/iu
const declaredMetaOwner = new Map<string, ResourceRecord>()
for (const resource of RESOURCE_INVENTORY) {
  for (const key of resource.declaredMetaKeys) declaredMetaOwner.set(key, resource)
}

const readKey = (source: unknown, pointer: string): unknown =>
  pointer
    .replace(/\[(\d+)\]/gu, '.$1')
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[part]
          : undefined,
      source,
    )

for (const locale of SUPPORTED_LANGUAGES) {
  const epigenetics = readJson<Record<string, unknown>>(
    resolve(root, `public/locales/${locale}/epigenetics.json`),
  )
  for (const [key, resource] of declaredMetaOwner) {
    const value = readKey(epigenetics, key.replace(/^epigenetics:/u, ''))
    if (typeof value !== 'string' || !value.trim()) {
      fail(`${locale}: sichtbare Metaangabe fehlt (${key})`)
      continue
    }
    const language: ResourceAssetLanguage =
      locale === 'de' ? 'de' : resource.variants.some((v) => v.language === 'en') ? 'en' : 'de'
    const variant = resource.variants.find((v) => v.language === language)
    if (!variant) continue

    const match = sizeClaim.exec(value)
    if (match) {
      const claimed = Number(match[1].replace(',', '.'))
      const decimals = (match[1].split(/[.,]/u)[1] ?? '').length
      const tolerance = 0.5 * 10 ** -decimals
      const unit = match[2].toLowerCase()
      const scale = unit.startsWith('m') ? 2 : 1
      const decimal = variant.bytes / 1000 ** scale
      const binary = variant.bytes / 1024 ** scale
      const low = Math.min(decimal, binary) - tolerance
      const high = Math.max(decimal, binary) + tolerance
      if (claimed < low || claimed > high) {
        fail(`${locale}:${key}: Groessenangabe ${match[0]} deckt sich nicht mit ${variant.bytes} B`)
      }
    }
    const pageClaim = /^(?:PDF\s*·\s*)?(\d+)\b/u.exec(value.trim())
    if (pageClaim && variant.pages !== null && Number(pageClaim[1]) !== variant.pages) {
      fail(`${locale}:${key}: Seitenangabe ${pageClaim[1]} != ${variant.pages}`)
    }
  }
}

// -------------------------------------------------- 8. Keine fuenfte Parallelliste
// AP19 PT19.5: der Legacy-Katalog ist entfallen. Geprueft wird stattdessen,
// dass er nicht zurueckkehrt — eine zweite Liste waere sofort wieder Drift.
if (existsSync(resolve(root, 'src/content/downloads.json'))) {
  fail('Der Legacy-Katalog src/content/downloads.json ist zurueck')
}

const sprayPage = readFileSync(resolve(root, 'src/pages/VitaminD3SprayPage.tsx'), 'utf8')
// Die Spray-Seite leitet ihre URL inzwischen aus dem Inventar ab; ein
// hartverdrahteter Pfad waere ein Rueckschritt.
if (/'\/downloads\/[^']+\.pdf'/u.test(sprayPage)) {
  fail('VitaminD3SprayPage verdrahtet wieder einen Dateipfad')
}
for (const resource of RESOURCE_INVENTORY) {
  if (resource.id !== 'rsc-prd-001') continue
  for (const variant of resource.variants) linkedPaths.add(variant.path)
}

// Der Abgleich laeuft ueber die frei ausgelieferten Assets: nur sie duerfen
// ueberhaupt eine Datei-URL im Markup haben.
const activeVisiblePaths = new Set(
  RESOURCE_INVENTORY.filter(
    (r) => r.lifecycle === 'ACTIVE_VISIBLE' && r.deliveryClass === 'FREE_PUBLIC',
  ).flatMap((r) => r.variants.map((v) => v.path)),
)
for (const path of activeVisiblePaths) {
  if (!linkedPaths.has(path)) fail(`ACTIVE_VISIBLE ohne aufgeloesten Link: ${path}`)
}
for (const path of linkedPaths) {
  if (!activeVisiblePaths.has(path)) fail(`Verlinkt, aber nicht ACTIVE_VISIBLE: ${path}`)
}

// ------------------------------------------------------------------------ Ergebnis
const variants = RESOURCE_INVENTORY.flatMap((r) => r.variants)
const byClass = (name: string) => RESOURCE_INVENTORY.filter((r) => r.deliveryClass === name).length
const byLifecycle = (name: string) => RESOURCE_INVENTORY.filter((r) => r.lifecycle === name).length

if (errors.length) {
  console.error(`PT19.1 Resource-Inventar: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('PT19.1 Resource-Inventar: PASS')
console.log(`- Ressourcen mit stabiler ID: ${RESOURCE_INVENTORY.length}`)
console.log(
  `- Varianten / physische Dateien: ${variants.length}/${physicalPaths.length} (public ${publicPaths.length} · protected ${protectedPaths.length})`,
)
console.log(`- Duplicate asset IDs: 0 · doppelt zugeordnete Dateien: 0`)
console.log(
  `- Sprachmatrix: de ${variants.filter((v) => v.language === 'de').length} · en ${variants.filter((v) => v.language === 'en').length}`,
)
console.log(`- Falsche Sprachzuordnung x10: 0 · stiller Fallback: 0`)
console.log(
  `- FREE_PUBLIC ${byClass('FREE_PUBLIC')} · GATED ${byClass('GATED')} · NOT_LAUNCH_VISIBLE ${byClass('NOT_LAUNCH_VISIBLE')}`,
)
console.log(
  `- ACTIVE_VISIBLE ${byLifecycle('ACTIVE_VISIBLE')} · LEGACY_ORPHAN ${byLifecycle('LEGACY_ORPHAN')} · UNKNOWN_REVIEW_REQUIRED ${byLifecycle('UNKNOWN_REVIEW_REQUIRED')}`,
)
console.log('- Sichtbare kaputte Links: 0')
console.log('- Sichtbare Groessen-/Seitenangaben gegen Datei geprueft: PASS')
console.log(`- Ohne Datumsbeleg (date: null): ${variants.filter((v) => v.date === null).length}`)
console.log(
  `- Sprache nur behauptet (CATALOG_ASSERTED): ${variants.filter((v) => v.languageEvidence === 'CATALOG_ASSERTED').length}`,
)
console.log(
  `- Geschuetzte Ablage: ${variants.filter((v) => v.storage === 'PROTECTED').length} · zusaetzlich oeffentlich: 0`,
)
