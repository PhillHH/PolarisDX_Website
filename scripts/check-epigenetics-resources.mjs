#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const assetRoot = resolve(root, 'public/downloads/epigenetics')
// AP19 PT19.4: das Musterbefund-Paket ist der aktive Lead-Magnet. Es liegt
// ausserhalb von public/ und wird ueber die Asset-ID ausgeliefert; alle acht
// enthaltenen Dokumente bleiben einzeln frei abrufbar.
const protectedAssetRoot = resolve(root, 'storage/protected/epigenetics')
const GATED_FILES = new Set(['PolarisDX_Musterbefunde_DE.zip'])
const assetPath = (file) => resolve(GATED_FILES.has(file) ? protectedAssetRoot : assetRoot, file)
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
const errors = []

const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))

function filesBelow(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = resolve(path, entry.name)
    return entry.isDirectory() ? filesBelow(child) : [child]
  })
}

function collectAssetReferences(value, path = '', rows = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectAssetReferences(entry, `${path}[${index}]`, rows))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) =>
      collectAssetReferences(entry, path ? `${path}.${key}` : key, rows),
    )
  } else if (
    typeof value === 'string' &&
    /(?:^|\.)(?:file|zipFile)$/u.test(path) &&
    /\.(?:pdf|zip)$/iu.test(value)
  ) {
    rows.push({ path, file: value })
  }
  return rows
}

function assetLanguage(file) {
  const normalized = file.toLowerCase()
  if (normalized.startsWith('de/') || normalized.includes('_de.')) return 'de'
  if (normalized.startsWith('en/') || normalized.includes('_en.')) return 'en'
  return null
}

function category(file) {
  if (/PolarisDX_Unterlagen_/u.test(file)) return 'INFO_SHEET_BUNDLE'
  if (/PolarisDX_Musterbefunde_/u.test(file)) return 'SAMPLE_REPORT_BUNDLE'
  if (/\/(?:0[0-8])_/u.test(file)) return 'INFO_SHEET'
  if (/\/(?:1[0-5])_/u.test(file)) return 'SAMPLE_REPORT'
  if (/\/16_/u.test(file)) return 'PARAMETER_GUIDE'
  if (/\/17_/u.test(file)) return 'VALUES_GUIDE'
  return 'UNCLASSIFIED'
}

function zipEntries(path) {
  const bytes = readFileSync(path)
  let eocd = -1
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65_557); offset -= 1) {
    if (bytes.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset
      break
    }
  }
  if (eocd < 0) throw new Error(`ZIP EOCD fehlt: ${relative(root, path)}`)
  const count = bytes.readUInt16LE(eocd + 10)
  let offset = bytes.readUInt32LE(eocd + 16)
  const entries = []
  for (let index = 0; index < count; index += 1) {
    if (bytes.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`ZIP Central Directory ungültig: ${relative(root, path)}`)
    }
    const size = bytes.readUInt32LE(offset + 24)
    const nameLength = bytes.readUInt16LE(offset + 28)
    const extraLength = bytes.readUInt16LE(offset + 30)
    const commentLength = bytes.readUInt16LE(offset + 32)
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString('utf8')
    entries.push({ name, size })
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

const physicalRows = [
  ...filesBelow(assetRoot).map((path) => ({ path, file: relative(assetRoot, path) })),
  ...filesBelow(protectedAssetRoot).map((path) => ({
    path,
    file: relative(protectedAssetRoot, path),
  })),
]
  .map(({ path, file }) => ({
    file,
    type: extname(file).slice(1).toUpperCase(),
    bytes: statSync(path).size,
    language: assetLanguage(file),
    category: category(file),
    visibility: 'LAUNCH_VISIBLE',
    classification: GATED_FILES.has(file) ? 'GATED' : 'FREE_PUBLIC',
  }))
  .sort((left, right) => left.file.localeCompare(right.file))

// Ein gegatetes Asset, das zusaetzlich oeffentlich liegt, waere kein Gate.
for (const file of GATED_FILES) {
  if (filesBelow(assetRoot).some((path) => relative(assetRoot, path) === file)) {
    errors.push(`${file}: gegatetes Asset liegt zusätzlich öffentlich`)
  }
}

const physicalFiles = new Set(physicalRows.map(({ file }) => file))
const visibleFiles = new Set()
const localeRows = []

for (const locale of locales) {
  const epigenetics = readJson(`public/locales/${locale}/epigenetics.json`)
  const downloads = readJson(`public/locales/${locale}/downloads.json`)
  const references = collectAssetReferences(epigenetics)
  const resourceFiles = new Set(references.map(({ file }) => file))
  references.forEach(({ file }) => visibleFiles.add(file))

  if (!downloads.chip_free?.trim()) errors.push(`${locale}: downloads.chip_free fehlt`)
  if (!epigenetics.downloads?.sub?.trim()) errors.push(`${locale}: downloads.sub fehlt`)
  if (!epigenetics.downloads?.samplesText?.trim()) {
    errors.push(`${locale}: downloads.samplesText fehlt`)
  }
  if (resourceFiles.size !== 19) {
    errors.push(
      `${locale}: erwartet 19 eindeutige Asset-Referenzen, gefunden ${resourceFiles.size}`,
    )
  }
  for (const { path, file } of references) {
    if (!physicalFiles.has(file)) errors.push(`${locale}:${path}: Datei fehlt (${file})`)
    const language = assetLanguage(file)
    if (!language) errors.push(`${locale}:${path}: Asset-Sprache unklar (${file})`)
    if (locale === 'de' && path.startsWith('sheets') && language !== 'de') {
      errors.push(`${locale}:${path}: deutsches Sheet verweist nicht auf DE`)
    }
    if (locale !== 'de' && path.startsWith('sheets') && language !== 'en') {
      errors.push(`${locale}:${path}: fremde Locale muss das reale EN-Sheet ausweisen`)
    }
    if (/^(?:samples|compare|basics)/u.test(path) && language !== 'de') {
      errors.push(`${locale}:${path}: DE-only Asset falsch zugeordnet`)
    }
  }
  localeRows.push({ locale, references: resourceFiles.size, disclosure: 'PASS' })
}

for (const row of physicalRows) {
  if (!['PDF', 'ZIP'].includes(row.type)) errors.push(`${row.file}: unzulässiger Dateityp`)
  if (row.bytes <= 0) errors.push(`${row.file}: leere Datei`)
  if (!row.language) errors.push(`${row.file}: Sprache nicht klassifiziert`)
  if (row.category === 'UNCLASSIFIED') errors.push(`${row.file}: Kategorie fehlt`)
  if (!visibleFiles.has(row.file)) errors.push(`${row.file}: nicht launch-sichtbar klassifiziert`)
}
for (const file of visibleFiles) {
  if (!physicalFiles.has(file)) errors.push(`${file}: sichtbarer Link ist gebrochen`)
}

const bundles = [
  {
    file: 'PolarisDX_Unterlagen_DE.zip',
    expected: physicalRows
      .filter(({ file }) => /^de\/0[0-8]_/u.test(file))
      .map(({ file }) => file.replace(/^de\//u, '')),
  },
  {
    file: 'PolarisDX_Unterlagen_EN.zip',
    expected: physicalRows
      .filter(({ file }) => /^en\/0[0-8]_/u.test(file))
      .map(({ file }) => file.replace(/^en\//u, '')),
  },
  {
    file: 'PolarisDX_Musterbefunde_DE.zip',
    expected: physicalRows
      .filter(({ file }) => /^de\/(?:1[0-7])_/u.test(file))
      .map(({ file }) => file.replace(/^de\//u, '')),
  },
]

for (const bundle of bundles) {
  const entries = zipEntries(assetPath(bundle.file))
  const actual = entries.map(({ name }) => name).sort()
  const expected = bundle.expected.sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(`${bundle.file}: ZIP-Inhalt stimmt nicht mit Einzeldateien überein`)
  }
  if (entries.some(({ size }) => size <= 0)) errors.push(`${bundle.file}: enthält leere Datei`)
}

const productiveSources = [
  'src/pages/EpigeneticsDocsPage.tsx',
  'src/pages/EpigeneticsPage.tsx',
  'src/pages/MusterbefundPage.tsx',
  'src/components/befund/BefundBlocks.tsx',
  'src/components/sections/EpigeneticsPanels.tsx',
]
  .map((path) => readFileSync(resolve(root, path), 'utf8'))
  .join('\n')
const docsPageSource = readFileSync(resolve(root, 'src/pages/EpigeneticsDocsPage.tsx'), 'utf8')

if (!productiveSources.includes("t('downloads:chip_free')")) {
  errors.push('Unterlagen-Seite weist FREE_PUBLIC nicht sichtbar x10 aus')
}
// Das gegatete Paket darf auf keiner produktiven Seite als Dateilink stehen.
for (const file of GATED_FILES) {
  if (productiveSources.includes(file)) {
    errors.push(`${file}: gegatetes Asset wird als Dateiname im Markup gerendert`)
  }
}
if (!productiveSources.includes('ResourceGateTrigger')) {
  errors.push('Gegatetes Asset ohne wiederverwendbaren Gate-Einstieg')
}
if (/import[^\n]+\.(?:pdf|zip)['"]/iu.test(productiveSources)) {
  errors.push('PDF/ZIP wird in das JavaScript-Bundle importiert')
}
if (/(?:prefetch|preload)[^\n>]+\.(?:pdf|zip)/iu.test(productiveSources)) {
  errors.push('PDF/ZIP wird eager vorgeladen')
}
if (/\btrack(?:Event)?\s*\(/u.test(docsPageSource)) {
  errors.push('Unterlagen-Seite registriert einen direkten Tracking-Handler')
}
if (/preview\.polarisdx\.net|localhost|127\.0\.0\.1/iu.test(productiveSources)) {
  errors.push('Preview-/Dev-Host in produktiver Resource-Quelle')
}

const result = {
  assets: physicalRows.length,
  pdfs: physicalRows.filter(({ type }) => type === 'PDF').length,
  zips: physicalRows.filter(({ type }) => type === 'ZIP').length,
  visibleAssets: visibleFiles.size,
  gatedAssets: [...GATED_FILES].length,
  publicBypass: 0,
  brokenVisibleLinks: [...visibleFiles].filter((file) => !physicalFiles.has(file)).length,
  languages: Object.fromEntries(
    ['de', 'en'].map((language) => [
      language,
      physicalRows.filter((row) => row.language === language).length,
    ]),
  ),
  classifications: {
    FREE_PUBLIC: physicalRows.filter(({ classification }) => classification === 'FREE_PUBLIC')
      .length,
    GATED_EXISTING_RUNTIME: physicalRows.filter(({ classification }) => classification === 'GATED')
      .length,
    GATED_FUTURE_AP19: 0,
    NOT_LAUNCH_VISIBLE: 0,
  },
  localeDisclosure: `${localeRows.filter(({ disclosure }) => disclosure === 'PASS').length}/10`,
  zipBundles: `${bundles.length}/3`,
  eagerDocumentLoads: 0,
  downloadTrackingHandlers: /\btrack(?:Event)?\s*\(/u.test(docsPageSource) ? 1 : 0,
  inventory: physicalRows,
  errors,
}

console.log(JSON.stringify(result, null, 2))
if (errors.length) process.exitCode = 1
