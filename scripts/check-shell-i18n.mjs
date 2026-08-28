#!/usr/bin/env node
/**
 * Shell-i18n-Guard (AP06 / PT06.5).
 *
 * Header, Mega-Menue, Footer und die globalen Hilfselemente muessen in **allen
 * zehn** Sprachen beschriftet sein (`DEC-RL-001`). Eine fehlende Uebersetzung
 * faellt im Betrieb nicht auf — i18next liefert still den Key oder die
 * englische Fassung aus, und die Navigation ist auf einmal zweisprachig.
 *
 * Der Guard prueft zwei Dinge, die man von Hand zuverlaessig uebersieht:
 *
 *   1. VOLLSTAENDIGKEIT — jeder von der Shell benutzte Key existiert in jedem
 *      der zehn `common.json`.
 *   2. ECHTE UEBERSETZUNG — der Wert ist nicht in acht Sprachen derselbe
 *      englische String. Reine Markennamen sind davon ausgenommen: "IglooPro"
 *      ist in jeder Sprache "IglooPro", und das ist richtig so.
 *
 * Die Key-Liste wird NICHT gepflegt, sondern aus den Shell-Quellen gelesen —
 * eine handgefuehrte Liste haette genau den Drift, den der Guard verhindern
 * soll.
 *
 * Aufruf: npm run check:shell-i18n
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const LOCALES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']

/** Quellen der Shell — hier stehen die Beschriftungen, die geprueft werden. */
const SHELL_FILES = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/SkipLink.tsx',
  'src/components/ui/LanguageSwitcher.tsx',
]

/**
 * Markennamen und Eigennamen. Sie duerfen in allen Sprachen gleich lauten,
 * ohne dass das als fehlende Uebersetzung gilt.
 */
const BRAND_KEYS = new Set(['nav.iglooPro', 'footer.london', 'footer.hamburg'])

/** Keys, die im Code stehen, aber bewusst aus anderen Namespaces kommen. */
const IGNORED_PREFIXES = ['contact.', 'searchPlaceholder']

function shellKeys() {
  const keys = new Set()
  for (const file of SHELL_FILES) {
    const src = readFileSync(join(ROOT, file), 'utf8')
    // t('nav.foo') / t('footer.bar', ...) / t(`nav.${...}`) wird ueber die
    // Datenlisten unten mitgenommen.
    for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) keys.add(m[1])
    // Die Navigations- und Footer-Daten referenzieren Keys als String-Literale
    // in `label:`/`heading:`-Feldern.
    for (const m of src.matchAll(/\b(?:label|heading|hubLabel):\s*'([a-zA-Z0-9_.]+)'/g)) {
      const raw = m[1]
      keys.add(raw.includes('.') ? raw : `nav.${raw}`)
    }
  }
  return [...keys].filter((k) => k.includes('.') && !IGNORED_PREFIXES.some((p) => k.startsWith(p)))
}

const read = (locale) =>
  JSON.parse(readFileSync(join(ROOT, `public/locales/${locale}/common.json`), 'utf8'))

const lookup = (obj, path) =>
  path.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), obj)

const bundles = Object.fromEntries(LOCALES.map((l) => [l, read(l)]))
const keys = shellKeys().sort()

const missing = []
const untranslated = []

for (const key of keys) {
  const values = {}
  for (const locale of LOCALES) {
    const value = lookup(bundles[locale], key)
    if (typeof value !== 'string' || value.trim() === '') missing.push(`${locale}: ${key}`)
    else values[locale] = value
  }

  if (BRAND_KEYS.has(key)) continue

  // SIGNATUR EINES DURCHGEREICHTEN FALLBACKS:
  // Deutsch ist uebersetzt, die uebrigen Sprachen tragen woertlich den
  // englischen Wert. Genau so sieht eine nur DE+EN gepflegte Datei aus.
  //
  // Ein Lehnwort sieht anders aus: dort ist AUCH Deutsch gleich Englisch
  // ("Blog" heisst in allen zehn Sprachen "Blog"). Ohne diese Unterscheidung
  // meldete der Guard jedes Internationalismus-Label als Fehler und waere
  // nach kurzer Zeit abgeschaltet.
  const english = values.en
  if (!english || values.de === english) continue
  const sameAsEnglish = LOCALES.filter((l) => l !== 'en' && l !== 'de' && values[l] === english)
  if (sameAsEnglish.length >= 7) {
    untranslated.push(`${key} — ${sameAsEnglish.length} Sprachen tragen woertlich "${english}"`)
  }
}

let failed = false

if (missing.length) {
  failed = true
  console.error(`\n✖ Shell-i18n: ${missing.length} fehlende Beschriftung(en)\n`)
  for (const entry of missing) console.error(`   ${entry}`)
}

if (untranslated.length) {
  failed = true
  console.error(`\n✖ Shell-i18n: englischer Fallback als Dauerzustand\n`)
  for (const entry of untranslated) console.error(`   ${entry}`)
}

if (failed) {
  console.error(
    '\nDie Shell wird in zehn Sprachen ausgeliefert (DEC-RL-001). Ein fehlender Key' +
      '\nfaellt im Betrieb nicht auf — i18next liefert still den Key aus.\n',
  )
  process.exit(1)
}

console.log(
  `✓ Shell-i18n: ${keys.length} Beschriftungen in ${LOCALES.length} Sprachen vollstaendig ` +
    `(${readdirSync(join(ROOT, 'public/locales')).length} Locale-Verzeichnisse vorhanden).`,
)
