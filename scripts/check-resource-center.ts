#!/usr/bin/env node
/**
 * AP19 PT19.2 — Resource-Center-Guard.
 *
 * Prueft die Praesentationsschicht gegen das kanonische Inventar aus PT19.1:
 *
 *  1. Die sichtbare Menge ist exakt `ACTIVE_VISIBLE` — nichts fehlt, nichts
 *     erscheint doppelt, und `NOT_LAUNCH_VISIBLE` taucht nirgends auf.
 *  2. Keine leere Kategorie und keine Fuellkategorie.
 *  3. Ueber alle zehn Locales loest jede Karte Titel, Beschreibung und
 *     Gruppenueberschrift zu echtem Text auf — kein sichtbarer Schluessel.
 *  4. Die Sprachaufloesung folgt der in PT19.1 bewiesenen Regel; jede Karte,
 *     die eine andere Sprache ausliefert als die Oberflaeche spricht, ist als
 *     Fallback markiert und traegt damit die sichtbare Offenlegung.
 *  5. FREE_PUBLIC hat genau eine aufloesbare Datei-URL, GATED keine.
 *  6. Die Seite laedt keine PDF-/ZIP-Nutzlast eager und importiert keine.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { RESOURCE_INVENTORY, type ResourceRecord } from '../src/content/resources/resourceInventory'
import {
  buildResourceCenter,
  freeResourceHref,
  GATE_MODE,
  LAUNCH_VISIBLE_RESOURCES,
  RESOURCE_GROUPS,
} from '../src/content/resources/resourceCenter'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const errors: string[] = []
const fail = (message: string) => errors.push(message)

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(root, path), 'utf8')) as Record<string, unknown>

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

const namespaces = ['downloads', 'epigenetics']
const bundles = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    Object.fromEntries(
      namespaces.map((ns) => [ns, readJson(`public/locales/${locale}/${ns}.json`)]),
    ),
  ]),
) as Record<string, Record<string, Record<string, unknown>>>

/** `downloads:groups.guides` → echter Text im gegebenen Locale, sonst undefined. */
const translate = (locale: string, key: string): string | undefined => {
  const [ns, pointer] = key.includes(':') ? key.split(/:(.+)/u) : ['downloads', key]
  const value = readKey(bundles[locale]?.[ns], pointer)
  return typeof value === 'string' && value.trim() ? value : undefined
}

// ------------------------------------------------------------- 1./2. Sichtbare Menge
const expected = new Set(LAUNCH_VISIBLE_RESOURCES.map((resource) => resource.id))
const notLaunchVisible = new Set(
  RESOURCE_INVENTORY.filter((resource) => resource.lifecycle !== 'ACTIVE_VISIBLE').map((r) => r.id),
)

const referenceGroups = buildResourceCenter('de')
const rendered = referenceGroups.flatMap((group) => group.cards.map((card) => card.resource.id))
if (new Set(rendered).size !== rendered.length)
  fail('Resource Center rendert eine Ressource doppelt')
for (const id of expected) {
  if (!rendered.includes(id)) fail(`ACTIVE_VISIBLE fehlt im Resource Center: ${id}`)
}
for (const id of rendered) {
  if (notLaunchVisible.has(id)) fail(`Nicht launchsichtbare Ressource wird gerendert: ${id}`)
  if (!expected.has(id)) fail(`Unbekannte Ressource im Resource Center: ${id}`)
}
for (const group of referenceGroups) {
  if (group.cards.length === 0) fail(`Leere Kategorie wird gerendert: ${group.id}`)
}
const emptyDefinitions = RESOURCE_GROUPS.filter(
  (group) => !referenceGroups.some((rendered) => rendered.id === group.id),
)
for (const group of emptyDefinitions) {
  fail(`Fuellkategorie ohne reale Ressource definiert: ${group.id}`)
}

// ------------------------------------------------- 3./4./5. x10 Text, Sprache, Zugang
for (const locale of SUPPORTED_LANGUAGES) {
  const groups = buildResourceCenter(locale)
  if (groups.length !== referenceGroups.length) {
    fail(`${locale}: abweichende Gruppenzahl (${groups.length} statt ${referenceGroups.length})`)
  }
  for (const group of groups) {
    if (!translate(locale, group.labelKey)) {
      fail(`${locale}: Gruppenueberschrift fehlt (${group.labelKey})`)
    }
    for (const card of group.cards) {
      const { resource, variant } = card

      if (!card.labelKey || !translate(locale, card.labelKey)) {
        fail(`${locale}/${resource.id}: Titel fehlt (${card.labelKey ?? '—'})`)
      }
      if (card.descriptionKey && !translate(locale, card.descriptionKey)) {
        fail(`${locale}/${resource.id}: Beschreibung fehlt (${card.descriptionKey})`)
      }

      // Dieselbe Regel, die PT19.1 ueber die Locale-Dateien bewiesen hat.
      const wanted =
        locale === 'de' ? 'de' : resource.variants.some((v) => v.language === 'en') ? 'en' : 'de'
      if (variant.language !== wanted) {
        fail(`${locale}/${resource.id}: Sprache ${variant.language}, erwartet ${wanted}`)
      }
      const shouldDisclose = locale !== 'de' && variant.language !== 'en'
      if (card.languageFallback !== shouldDisclose) {
        fail(
          `${locale}/${resource.id}: Offenlegung ${card.languageFallback}, erwartet ${shouldDisclose}`,
        )
      }

      if (resource.deliveryClass === 'FREE_PUBLIC') {
        if (!card.href) fail(`${locale}/${resource.id}: FREE_PUBLIC ohne Datei-URL`)
        else if (!existsSync(resolve(root, 'public', decodeURI(card.href).replace(/^\//u, '')))) {
          fail(`${locale}/${resource.id}: Datei-URL zeigt ins Leere (${card.href})`)
        }
        if (card.gate) fail(`${locale}/${resource.id}: FREE_PUBLIC mit Gate-Kontext`)
      }
      if (resource.deliveryClass === 'GATED') {
        if (card.href) fail(`${locale}/${resource.id}: GATED mit oeffentlicher Datei-URL`)
        if (freeResourceHref(resource, variant)) {
          fail(`${locale}/${resource.id}: GATED liefert trotzdem eine Datei-URL`)
        }
        if (!card.gate || card.gate.assetId !== resource.id) {
          fail(`${locale}/${resource.id}: Gate-CTA ohne Asset-ID`)
        }
        if (card.gate && card.gate.requestedLocale !== locale) {
          fail(`${locale}/${resource.id}: Gate-CTA ohne angefragtes Locale`)
        }
        // PT19.3: der Einstieg ist das wiederverwendbare Inline-Formular.
        if (GATE_MODE !== 'INLINE_FORM') fail(`${resource.id}: GATED ohne Gate-Einstieg`)
        if (resource.variants.some((variant) => variant.storage !== 'PROTECTED')) {
          fail(`${locale}/${resource.id}: GATED ohne geschuetzte Ablage`)
        }
      }
    }
  }
}

// ------------------------------- 5b. Die Zweige, die der heutige Bestand nicht ausloest
//
// Heute existiert keine GATED Ressource und keine leere Kategorie. Beide
// Regeln waeren damit ungeprueft. Der folgende Abschnitt fuehrt sie an einem
// synthetischen Datensatz vor — das Inventar bleibt unberuehrt.
const sample = LAUNCH_VISIBLE_RESOURCES.find((resource) => resource.category === 'INFO_SHEET')
if (!sample) fail('Fixture: keine INFO_SHEET Ressource vorhanden')
else {
  const gatedFixture: ResourceRecord = {
    ...sample,
    id: 'rsc-fixture-001',
    deliveryClass: 'GATED',
    variants: sample.variants.map((variant) => ({ ...variant, storage: 'PROTECTED' as const })),
  }
  const fixtureGroups = buildResourceCenter('pl', [gatedFixture])

  // Leere Kategorien duerfen auch im Fixture nicht erscheinen.
  if (fixtureGroups.length !== 1 || fixtureGroups[0].id !== 'info-sheets') {
    fail(
      `Fixture: leere Kategorien werden gerendert (${fixtureGroups.map((g) => g.id).join(', ') || 'keine'})`,
    )
  }
  const gatedCard = fixtureGroups[0]?.cards[0]
  if (!gatedCard) fail('Fixture: GATED Ressource wird nicht gerendert')
  else {
    if (gatedCard.href !== null)
      fail(`Fixture: GATED liefert eine oeffentliche URL (${gatedCard.href})`)
    if (freeResourceHref(gatedFixture, gatedCard.variant) !== null) {
      fail('Fixture: freeResourceHref gibt fuer GATED eine URL zurueck')
    }
    if (gatedCard.gate?.assetId !== gatedFixture.id) fail('Fixture: Gate-CTA ohne Asset-ID')
    if (gatedCard.gate?.requestedLocale !== 'pl') fail('Fixture: Gate-CTA ohne angefragtes Locale')
    if (gatedCard.gate?.assetLanguage !== gatedCard.variant.language) {
      fail('Fixture: Gate-CTA ohne Sprache der angeforderten Variante')
    }
    if (gatedCard.variant.storage !== 'PROTECTED') {
      fail('Fixture: GATED Variante ohne geschuetzte Ablage')
    }
  }
}

// --------------------------------------------------------------- 6. Keine eager Payload
const pageSource = readFileSync(resolve(root, 'src/pages/DownloadsPage.tsx'), 'utf8')
if (/import[^\n]+\.(?:pdf|zip)['"]/iu.test(pageSource)) {
  fail('DownloadsPage importiert eine PDF-/ZIP-Nutzlast in das Bundle')
}
if (/(?:prefetch|preload)[^\n>]+\.(?:pdf|zip)/iu.test(pageSource)) {
  fail('DownloadsPage laedt eine PDF-/ZIP-Nutzlast eager vor')
}
if (/\/downloads\/[^'"`\s]+\.(?:pdf|zip)/iu.test(pageSource)) {
  fail('DownloadsPage verdrahtet einen Dateipfad statt ihn aus dem Inventar zu beziehen')
}
if (pageSource.includes("from '../content/downloads.json'")) {
  fail('DownloadsPage liest wieder die parallele Katalogliste')
}
if (existsSync(resolve(root, 'src/content/downloads.json'))) {
  fail('Der Legacy-Katalog src/content/downloads.json ist zurueck')
}

// -------------------------------------------------------------------------- Ergebnis
const cards = referenceGroups.flatMap((group) => group.cards)
if (errors.length) {
  console.error(`PT19.2 Resource Center: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('PT19.2 Resource Center: PASS')
console.log(
  `- Sichtbare Ressourcen: ${cards.length}/${LAUNCH_VISIBLE_RESOURCES.length} ACTIVE_VISIBLE`,
)
console.log(`- Nicht launchsichtbar gerendert: 0 · Duplikate: 0`)
console.log(
  `- Gruppen gerendert: ${referenceGroups.length}/${RESOURCE_GROUPS.length} · leere Kategorien: 0`,
)
console.log(`  ${referenceGroups.map((group) => `${group.id}=${group.cards.length}`).join(' · ')}`)
console.log(
  `- x10 Titel/Beschreibung/Gruppenueberschrift: ${SUPPORTED_LANGUAGES.length}/10 Locales`,
)
console.log(
  `- Sprachoffenlegung: ${
    buildResourceCenter('pl')
      .flatMap((g) => g.cards)
      .filter((c) => c.languageFallback).length
  } Karten je Nicht-DE-Locale`,
)
console.log(`- FREE_PUBLIC mit aufloesbarer URL: ${cards.filter((c) => c.href).length}`)
console.log(`- GATED mit oeffentlicher URL: 0 · Gate-Einstieg: ${GATE_MODE}`)
console.log('- Fixture GATED: keine oeffentliche URL · CTA traegt Asset-ID, Locale, Sprache')
console.log('- Fixture leere Kategorie: nicht gerendert')
console.log('- Eager PDF-/ZIP-Payload: 0 · parallele Katalogliste: 0')
