#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const localesDirectory = join(scriptDirectory, '..', 'public', 'locales')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
const translationKeyPattern = /^[a-z][\w-]*(?::[\w-]+)?(?:\.[\w-]+)+$/i
const placeholderPattern = /\b(?:lorem ipsum|tbd|placeholder|preview copy|coming soon)\b/i
const nonPublicHostPattern = /(?:preview\.polarisdx\.net|localhost|127\.0\.0\.1)(?=[:/]|$)/i

function valueAtPath(value, path) {
  return path.split('.').reduce((current, segment) => current?.[segment], value)
}

function discoverExplicitSeoRecords(value, path = [], records = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return records

  const id = path.join('.') || 'root'
  if (
    path.includes('seo') &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  ) {
    records.push({
      id,
      titlePath: [...path, 'title'].join('.'),
      descriptionPath: [...path, 'description'].join('.'),
    })
  }
  if (typeof value.index_title === 'string' && typeof value.index_description === 'string') {
    records.push({
      id: `${id}.index`,
      titlePath: [...path, 'index_title'].join('.'),
      descriptionPath: [...path, 'index_description'].join('.'),
    })
  }
  if (typeof value.seo_title === 'string' && typeof value.seo_description === 'string') {
    records.push({
      id: `${id}.seo`,
      titlePath: [...path, 'seo_title'].join('.'),
      descriptionPath: [...path, 'seo_description'].join('.'),
    })
  }

  for (const [key, child] of Object.entries(value)) {
    discoverExplicitSeoRecords(child, [...path, key], records)
  }
  return records
}

function fail(message) {
  console.error(`  ✖ ${message}`)
  return 1
}

const localeFiles = readdirSync(join(localesDirectory, 'de'))
  .filter((filename) => filename.endsWith('.json'))
  .sort()
const referenceFiles = new Map()
const definitions = []

for (const filename of localeFiles) {
  const value = JSON.parse(readFileSync(join(localesDirectory, 'de', filename), 'utf8'))
  referenceFiles.set(filename, value)
  for (const record of discoverExplicitSeoRecords(value)) definitions.push({ filename, ...record })
}

let failures = 0
let warnings = 0
let checked = 0
let shortWarnings = 0
let longWarnings = 0

for (const locale of locales) {
  const localizedFiles = new Map()
  for (const filename of localeFiles) {
    try {
      localizedFiles.set(
        filename,
        JSON.parse(readFileSync(join(localesDirectory, locale, filename), 'utf8')),
      )
    } catch (error) {
      failures += fail(`${locale}/${filename}: not readable JSON — ${error.message}`)
    }
  }

  const descriptions = new Map()
  for (const definition of definitions) {
    const localized = localizedFiles.get(definition.filename)
    if (!localized) continue
    const title = String(valueAtPath(localized, definition.titlePath) ?? '').trim()
    const description = String(valueAtPath(localized, definition.descriptionPath) ?? '').trim()
    const label = `${locale}/${definition.filename}:${definition.id}`
    checked += 1

    if (!title) failures += fail(`${label}: title missing/empty`)
    if (!description) failures += fail(`${label}: description missing/empty`)
    if (translationKeyPattern.test(title) || translationKeyPattern.test(description)) {
      failures += fail(`${label}: visible translation key in metadata`)
    }
    if (
      placeholderPattern.test(title) ||
      placeholderPattern.test(description) ||
      /\bTODO\b/.test(title) ||
      /\bTODO\b/.test(description)
    ) {
      failures += fail(`${label}: preview/placeholder metadata`)
    }
    if (nonPublicHostPattern.test(title) || nonPublicHostPattern.test(description)) {
      failures += fail(`${label}: preview/dev host in metadata`)
    }
    if (description && description.length < 20) {
      failures += fail(`${label}: grotesquely short description (${description.length})`)
    } else if (description.length < 50) {
      warnings += 1
      shortWarnings += 1
      console.warn(`  ⚠ ${label}: short description heuristic (${description.length})`)
    }
    if (description.length > 500) {
      failures += fail(`${label}: grotesquely long description (${description.length})`)
    } else if (description.length > 200) {
      warnings += 1
      longWarnings += 1
      console.warn(`  ⚠ ${label}: long description heuristic (${description.length})`)
    }

    const reference = referenceFiles.get(definition.filename)
    const germanDescription = String(
      valueAtPath(reference, definition.descriptionPath) ?? '',
    ).trim()
    const englishFile = JSON.parse(
      readFileSync(join(localesDirectory, 'en', definition.filename), 'utf8'),
    )
    const englishDescription = String(
      valueAtPath(englishFile, definition.descriptionPath) ?? '',
    ).trim()
    if (locale !== 'de' && description && description === germanDescription) {
      failures += fail(`${label}: description is byte-identical to German`)
    }
    if (locale !== 'de' && locale !== 'en' && description && description === englishDescription) {
      failures += fail(`${label}: description is byte-identical to English`)
    }

    const duplicateIds = descriptions.get(description) ?? []
    duplicateIds.push(`${definition.filename}:${definition.id}`)
    descriptions.set(description, duplicateIds)
  }

  for (const [description, ids] of descriptions) {
    if (description && ids.length > 1) {
      failures += fail(`${locale}: exact description duplicate across ${ids.join(', ')}`)
    }
  }
}

if (failures) {
  console.error(
    `\nMeta Quality Guard FAIL: ${checked} explicit locale records checked, ${failures} hard findings, ${warnings} length warnings.`,
  )
  process.exit(1)
}

console.log(
  `Meta Quality Guard PASS: ${checked} explicit locale records checked; missing/empty/translation-key/placeholder/duplicate findings 0; ${warnings} length warnings (${shortWarnings} short, ${longWarnings} long). Dynamic and Consumer metadata remain covered by G3 SSR/source checks.`,
)
