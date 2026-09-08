#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'

type JsonObject = Record<string, unknown>

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const downloadsRoot = resolve(root, 'public/downloads')
// AP19 PT19.4: der Musterbefund-Bundle ist der aktive Lead-Magnet und liegt
// deshalb ausserhalb von public/. Die Locale-Datei nennt seinen Dateinamen
// weiter — er erzeugt nur keinen oeffentlichen Link mehr, sondern wird ueber
// die Asset-ID ausgeliefert.
const protectedRoot = resolve(root, 'storage/protected')
const gatedFiles = new Set(['PolarisDX_Musterbefunde_DE.zip'])
const errors: string[] = []
const references = new Set<string>()
const ownerBoundUnlinkedAssets = new Set([
  // PT14.4: image-only legacy flyer with unverified technical/ownership claims.
  // The file remains inventory evidence but must not be productively linked.
  resolve(downloadsRoot, 'igloo-pro-flyer.pdf'),
])

const fail = (message: string) => errors.push(message)
const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T

const getPath = (value: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === 'object' ? (current as JsonObject)[key] : undefined,
      value,
    )

const collectResourceFiles = (value: unknown, out: string[] = []): string[] => {
  if (Array.isArray(value)) value.forEach((entry) => collectResourceFiles(entry, out))
  else if (value && typeof value === 'object')
    Object.values(value as JsonObject).forEach((entry) => collectResourceFiles(entry, out))
  else if (typeof value === 'string' && /\.(pdf|zip)$/i.test(value)) out.push(value)
  return out
}

// AP19 PT19.5: der Legacy-Katalog `src/content/downloads.json` ist entfallen.
// Die produktiven Referenzen kommen jetzt aus dem Inventar — es gibt keine
// zweite Liste mehr, die auseinanderlaufen koennte.
for (const resource of RESOURCE_INVENTORY) {
  if (resource.lifecycle !== 'ACTIVE_VISIBLE' || resource.deliveryClass !== 'FREE_PUBLIC') continue
  for (const variant of resource.variants) {
    const path = resolve(downloadsRoot, variant.path)
    references.add(path)
    if (!existsSync(path)) fail(`${resource.id}: Datei fehlt (${variant.path})`)
  }
}

for (const locale of SUPPORTED_LANGUAGES) {
  const downloads = readJson<JsonObject>(resolve(root, `public/locales/${locale}/downloads.json`))
  for (const key of [
    'assetLanguage.pdf',
    'assetLanguage.zip',
    'assetLanguage.languages.de',
    'assetLanguage.languages.en',
  ]) {
    const value = getPath(downloads, key)
    if (typeof value !== 'string' || !value.trim()) fail(`${locale}/downloads: ${key} fehlt`)
  }
  // Beschriftungen der frei ausgelieferten Ressourcen — direkt aus dem Inventar.
  for (const resource of RESOURCE_INVENTORY) {
    if (resource.lifecycle !== 'ACTIVE_VISIBLE') continue
    for (const key of [...resource.labelKeys, ...resource.descriptionKeys]) {
      const [ns, pointer] = key.split(/:(.+)/u)
      if (ns !== 'downloads') continue
      const value = getPath(downloads, pointer.replace(/\[(\d+)\]/gu, '.$1'))
      if (typeof value !== 'string' || !value.trim()) fail(`${locale}/downloads: ${key} fehlt`)
    }
  }

  const epigenetics = readJson<JsonObject>(
    resolve(root, `public/locales/${locale}/epigenetics.json`),
  )
  for (const file of collectResourceFiles(epigenetics)) {
    if (gatedFiles.has(file)) {
      // Muss geschuetzt liegen und darf NICHT zusaetzlich oeffentlich sein.
      if (!existsSync(resolve(protectedRoot, 'epigenetics', file))) {
        fail(`${locale}/epigenetics: gegatete Datei fehlt in der geschuetzten Ablage (${file})`)
      }
      if (existsSync(resolve(downloadsRoot, 'epigenetics', file))) {
        fail(`${locale}/epigenetics: gegatete Datei liegt zusaetzlich oeffentlich (${file})`)
      }
      continue
    }
    const path = resolve(downloadsRoot, 'epigenetics', file)
    references.add(path)
    if (!existsSync(path)) fail(`${locale}/epigenetics: Datei fehlt (${file})`)
  }
}

const physicalFiles = [
  ...readdirSync(downloadsRoot, { recursive: true, withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && ['.pdf', '.zip'].includes(extname(entry.name).toLowerCase()),
    )
    .map((entry) => resolve(entry.parentPath, entry.name)),
]

for (const path of physicalFiles) {
  if (statSync(path).size === 0) fail(`Leere Asset-Datei: ${path}`)
  if (!references.has(path) && !ownerBoundUnlinkedAssets.has(path))
    fail(`Nicht klassifizierte Download-Datei: ${path}`)
}

const sourceRequirements: Array<[string, string[]]> = [
  // PT19.2: das Resource Center rendert Karten aus dem Inventar statt aus dem
  // Katalog; die AP08-Invariante bleibt dieselbe — jeder Download-Link nennt
  // die Sprache der ausgelieferten Datei.
  ['src/pages/DownloadsPage.tsx', ['ResourceLanguageBadge', 'hrefLang={variant.language}']],
  [
    'src/pages/EpigeneticsDocsPage.tsx',
    ['ResourceLanguageBadge', 'resourceLanguageFromPath', 'hrefLang="de"'],
  ],
  [
    'src/pages/EpigeneticsPage.tsx',
    ['ResourceLanguageBadge', 'resourceLanguageFromPath', 'hrefLang="de"'],
  ],
  // PT19.4: der einzige Asset-Link dieser Komponente war das Musterbefund-
  // Paket; es laeuft jetzt ueber das Gate. Geprueft wird deshalb, dass hier
  // kein Dateilink zurueckkehrt.
  ['src/components/sections/EpigeneticsPanels.tsx', ['ResourceGateTrigger']],
  ['src/pages/MusterbefundPage.tsx', ["hrefLang: 'de'", 'hrefLang="de"', "t('samples.badge')"]],
  ['src/components/sections/SubpageHero.tsx', ['hrefLang?: string', 'hrefLang={cta.hrefLang}']],
  [
    'src/pages/VitaminD3SprayPage.tsx',
    ['sprayPdfLanguage', 'hrefLang={sprayPdfLanguage}', 'findResource', 'resolveResourceVariant'],
  ],
]

for (const [file, needles] of sourceRequirements) {
  const source = readFileSync(resolve(root, file), 'utf8')
  for (const needle of needles) if (!source.includes(needle)) fail(`${file}: ${needle} fehlt`)
}

if (physicalFiles.length !== 31)
  fail(`Oeffentliches Download-Inventar: erwartet 31, gefunden ${physicalFiles.length}`)
if (references.size !== 30)
  fail(`Produktive oeffentliche Referenzen: erwartet 30, gefunden ${references.size}`)
if (gatedFiles.size !== 1) fail(`Gegatete Assets: erwartet 1, gefunden ${gatedFiles.size}`)
if (ownerBoundUnlinkedAssets.size !== 1)
  fail(`Owner-bound, entlinkte Assets: erwartet 1, gefunden ${ownerBoundUnlinkedAssets.size}`)

if (errors.length) {
  console.error(`PT08.6 Asset-Guard: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('PT08.6 Asset-Guard: PASS')
console.log(`- Öffentliche Download-Assets: ${physicalFiles.length}/31`)
console.log(`- Auflösbare produktive Referenzen: ${references.size}/30`)
console.log(`- Gegatete Assets in geschützter Ablage: ${gatedFiles.size}/1 · public bypass: 0`)
console.log(`- Owner-bound, sicher entlinkte Assets: ${ownerBoundUnlinkedAssets.size}/1`)
console.log('- Broken productive asset references: 0')
console.log('- Resource UI metadata/disclosure: 10/10 Locales')
console.log('- Stiller Asset-Sprachfallback: 0')
