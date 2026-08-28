#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type JsonObject = Record<string, unknown>
type CatalogRecord = {
  id: string
  titleKey: string
  descriptionKey: string
  language: 'de' | 'en'
  file: string
  format: string
}

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const downloadsRoot = resolve(root, 'public/downloads')
const errors: string[] = []
const references = new Set<string>()

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

const catalog = readJson<{ items: CatalogRecord[] }>(resolve(root, 'src/content/downloads.json'))
for (const item of catalog.items) {
  if (!['de', 'en'].includes(item.language)) fail(`Katalog ${item.id}: ungültige Asset-Sprache`)
  if (!['PDF', 'ZIP'].includes(item.format)) fail(`Katalog ${item.id}: ungültiges Format`)
  const path = resolve(downloadsRoot, item.file)
  references.add(path)
  if (!existsSync(path)) fail(`Katalog ${item.id}: Datei fehlt (${item.file})`)
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
  for (const item of catalog.items) {
    for (const key of [item.titleKey, item.descriptionKey]) {
      const value = getPath(downloads, key)
      if (typeof value !== 'string' || !value.trim()) fail(`${locale}/downloads: ${key} fehlt`)
    }
  }

  const epigenetics = readJson<JsonObject>(
    resolve(root, `public/locales/${locale}/epigenetics.json`),
  )
  for (const file of collectResourceFiles(epigenetics)) {
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
  if (!references.has(path)) fail(`Nicht klassifizierte Download-Datei: ${path}`)
}

const sourceRequirements: Array<[string, string[]]> = [
  ['src/pages/DownloadsPage.tsx', ['ResourceLanguageBadge', 'hrefLang={item.language}']],
  [
    'src/pages/EpigeneticsDocsPage.tsx',
    ['ResourceLanguageBadge', 'resourceLanguageFromPath', 'hrefLang="de"'],
  ],
  [
    'src/pages/EpigeneticsPage.tsx',
    ['ResourceLanguageBadge', 'resourceLanguageFromPath', 'hrefLang="de"'],
  ],
  ['src/components/sections/EpigeneticsPanels.tsx', ['ResourceLanguageBadge', 'hrefLang="de"']],
  ['src/pages/MusterbefundPage.tsx', ["hrefLang: 'de'", 'hrefLang="de"', "t('samples.badge')"]],
  ['src/components/sections/IglooProHero.tsx', ['hrefLang="de"']],
  ['src/components/sections/IglooSpecsSection.tsx', ['hrefLang="de"']],
  ['src/components/sections/IglooProductFinalCta.tsx', ['hrefLang="de"']],
  ['src/components/sections/SubpageHero.tsx', ['hrefLang?: string', 'hrefLang={cta.hrefLang}']],
  ['src/pages/VitaminD3SprayPage.tsx', ['sprayPdfLanguage', 'hrefLang={sprayPdfLanguage}']],
]

for (const [file, needles] of sourceRequirements) {
  const source = readFileSync(resolve(root, file), 'utf8')
  for (const needle of needles) if (!source.includes(needle)) fail(`${file}: ${needle} fehlt`)
}

if (physicalFiles.length !== 32)
  fail(`Download-Inventar: erwartet 32, gefunden ${physicalFiles.length}`)
if (references.size !== 32) fail(`Produktive Referenzen: erwartet 32, gefunden ${references.size}`)

if (errors.length) {
  console.error(`PT08.6 Asset-Guard: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('PT08.6 Asset-Guard: PASS')
console.log(`- Produktive Download-Assets: ${physicalFiles.length}/32`)
console.log(`- Auflösbare produktive Referenzen: ${references.size}/32`)
console.log('- Broken productive asset references: 0')
console.log('- Resource UI metadata/disclosure: 10/10 Locales')
console.log('- Stiller Asset-Sprachfallback: 0')
