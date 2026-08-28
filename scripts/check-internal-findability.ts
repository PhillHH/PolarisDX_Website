import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { articles } from '../src/data/articles'
import { services } from '../src/data/services'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message)
}

const overview =
  read('src/components/sections/DiagnosticsSpecialtySection.tsx') +
  read('src/components/sections/DiagnosticsFocusSection.tsx')
const articlePage = read('src/pages/ArticlePage.tsx')
const servicePage = read('src/pages/ServicePage.tsx')
const epigeneticsPage = read('src/pages/EpigeneticsPage.tsx')
const befundPage = read('src/pages/MusterbefundPage.tsx')
const downloadsPage = read('src/pages/DownloadsPage.tsx')
const eventsPage = read('src/pages/EventsPage.tsx')
const consumerPages = ['SprayPage.tsx', 'MaskPage.tsx', 'DuoPage.tsx']
  .map((file) => read(`src/pages/consumer/${file}`))
  .join('\n')
const matrix = read('building-docs/AP07-FINDABILITY-MATRIX.md')

assert(services.length === 9, `expected 9 current services, found ${services.length}`)
for (const service of services) {
  assert(
    overview.includes(`id: '${service.id}'`),
    `diagnostics hub does not expose service ${service.id}`,
  )
}

const serviceIds = new Set(services.map(({ id }) => id))
const articleIds = new Set(articles.map(({ id }) => id))
for (const article of articles) {
  assert(article.relatedServiceIds?.length, `article ${article.id} has no relevant service mapping`)
  for (const id of article.relatedServiceIds ?? []) {
    assert(serviceIds.has(id), `article ${article.id} references unknown service ${id}`)
  }
}
for (const service of services) {
  for (const id of service.relatedArticleIds ?? []) {
    assert(articleIds.has(id), `service ${service.id} references unknown article ${id}`)
    assert(
      articles.find((article) => article.id === id)?.relatedServiceIds?.includes(service.id),
      `article/service relationship is not reciprocal: ${id} -> ${service.id}`,
    )
  }
}
assert(articlePage.includes('to={`/diagnostics/${service.id}`}'), 'article -> service link missing')
assert(
  !servicePage.includes('articles.slice(0, 3)'),
  'service page still fills irrelevant articles',
)

for (const route of [
  '/epigenetics/grundlagen',
  '/epigenetics/studienlage',
  '/epigenetics/unterlagen',
]) {
  assert(
    read('src/components/epigenetics/tokens.ts').includes(`to: '${route}'`),
    `${route} missing`,
  )
}
assert(
  epigeneticsPage.includes('VERTIEFUNGEN.map'),
  'epigenetics hub does not link deepening routes',
)
for (const anchor of ['vergleich', 'musterbefunde']) {
  assert(epigeneticsPage.includes(`id="${anchor}"`), `epigenetics anchor #${anchor} missing`)
}
assert(
  read('src/components/sections/RoiCalculatorSection.tsx').includes('id="roi-rechner"'),
  'lead-magnet anchor #roi-rechner missing',
)
assert(befundPage.includes('to="/epigenetics#musterbefunde"'), 'sample report -> hub link missing')

for (const route of ['/igloo-pro', '/diagnostics', '/epigenetics']) {
  assert(downloadsPage.includes(`to="${route}"`), `downloads context link ${route} missing`)
}
assert(eventsPage.includes('to="/contact"'), 'events -> inquiry link missing')
for (const route of [
  '/consumer/vitamin-d3-spray',
  '/consumer/hydrating-masks',
  '/consumer/inside-out-duo',
]) {
  assert(consumerPages.includes(`to="${route}"`), `consumer crosslink ${route} missing`)
}

const productionFiles = [
  ...readdirSync(join(root, 'src/pages'))
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => `src/pages/${file}`),
  ...readdirSync(join(root, 'src/components'), { recursive: true })
    .filter(
      (file): file is string =>
        typeof file === 'string' && file.endsWith('.tsx') && !file.includes('.test.'),
    )
    .map((file) => `src/components/${file}`),
  'src/hooks/useSearch.ts',
]
for (const path of productionFiles) {
  assert(!/to=["'{`]\/services(?:\/|["'}`])/.test(read(path)), `legacy /services target in ${path}`)
}

for (const locale of ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']) {
  const servicesLocale = read(`public/locales/${locale}/services.json`)
  const articleLocale = JSON.parse(read(`public/locales/${locale}/articles.json`)) as {
    detail?: { related_services?: string }
  }
  const commonLocale = JSON.parse(read(`public/locales/${locale}/common.json`)) as {
    read_more?: string
  }
  assert(articleLocale.detail?.related_services?.trim(), `${locale}: related service label missing`)
  assert(commonLocale.read_more?.trim(), `${locale}: deepening label missing`)
  assert(
    servicesLocale.includes(`href='/${locale}/vitamin-d3-implantologie'`),
    `${locale}: canonical implantology context link missing`,
  )
  assert(
    !servicesLocale.includes(`/${locale}/blog/vitamin-d3-implantologie`),
    `${locale}: dead legacy implantology link remains`,
  )
  assert(
    !servicesLocale.includes(`/${locale}/case-studies/32reasons`),
    `${locale}: unavailable backlog case-study link remains`,
  )
}

assert(matrix.includes('## 2.4 PT07.3-Messung'), 'Section B measurement missing')
assert(
  !/^\| `\/.*\|.*UNINTENDED_DIRECT_URL_ONLY/m.test(matrix),
  'unintended direct URL row remains',
)
for (const id of ['DLI-01', 'DLI-02']) {
  assert(matrix.includes(`### ${id}`), `${id} missing from deferred register`)
}

console.log(
  `Internal findability PASS: ${services.length}/9 services, ${articles.length}/6 article mappings, ` +
    '3 deepening routes, 6 reports, 10 locale labels, 0 legacy /services targets',
)
