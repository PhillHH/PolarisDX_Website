import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { BEFUND_ORDER } from '../src/content/befunde/meta'
import { defineBefundFamily, validateBefundInventory } from '../src/content/befunde/model'
import { getBefundRouteEntries } from '../src/routing/routeRegistry'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDirectory = path.join(root, 'src/content/befunde')

const families = BEFUND_ORDER.map((slug) => {
  const locales = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((locale) => {
      const file = path.join(contentDirectory, `${slug}.${locale}.json`)
      if (!fs.existsSync(file)) throw new Error(`${slug}.${locale}: content file missing`)
      return [locale, JSON.parse(fs.readFileSync(file, 'utf8')) as unknown]
    }),
  )
  return { slug, content: defineBefundFamily(slug, locales) }
})

validateBefundInventory(families)

const routeEntries = getBefundRouteEntries()
if (
  routeEntries.length !== BEFUND_ORDER.length ||
  routeEntries.map((entry) => entry.sourceId).join(',') !== BEFUND_ORDER.join(',')
) {
  throw new Error('Registry report-detail entries do not match canonical Befund order')
}

const expectedFiles = new Set(
  BEFUND_ORDER.flatMap((slug) => SUPPORTED_LANGUAGES.map((locale) => `${slug}.${locale}.json`)),
)
const actualFiles = fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.json'))
const unexpectedFiles = actualFiles.filter((file) => !expectedFiles.has(file))
if (actualFiles.length !== expectedFiles.size || unexpectedFiles.length > 0) {
  throw new Error(
    `Befund content inventory must be exactly ${expectedFiles.size} files; unexpected: ${unexpectedFiles.join(',') || 'none'}`,
  )
}

for (const slug of BEFUND_ORDER) {
  const routeModule = path.join(root, 'src/pages/musterbefund', `${slug}.tsx`)
  const source = fs.readFileSync(routeModule, 'utf8')
  const importedLocaleFiles = SUPPORTED_LANGUAGES.filter((locale) =>
    source.includes(`/befunde/${slug}.${locale}.json`),
  )
  if (
    importedLocaleFiles.length !== SUPPORTED_LANGUAGES.length ||
    !source.includes(`defineBefundFamily('${slug}'`)
  ) {
    throw new Error(`${slug}: route module is not an explicit validated x10 family loader`)
  }
}

const appSource = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
for (const slug of BEFUND_ORDER) {
  if (!appSource.includes(`import('./pages/musterbefund/${slug}')`)) {
    throw new Error(`${slug}: App route is not family-level lazy loaded`)
  }
}
if (appSource.includes('content/befunde/') || appSource.includes('.json')) {
  throw new Error('App shell must not eagerly import Befund content')
}

console.log(
  `Befund contract PASS: ${families.length}/6 families, ${actualFiles.length}/60 locale documents, ${families.reduce((sum, family) => sum + Object.keys(family.content).length, 0)}/60 validated, ${routeEntries.length}/6 registry routes, lazy family modules 6/6`,
)
