import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TFunction } from 'i18next'
import { articles } from '../src/data/articles'
import { services } from '../src/data/services'
import { BEFUND_ORDER } from '../src/content/befunde/meta'
import { createSearchIndex, type SearchResult } from '../src/hooks/useSearch'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { getSearchEligibleRouteEntries } from '../src/routing/routeRegistry'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FORBIDDEN_PREFIXES = [
  '/services',
  '/shop',
  '/casestudys',
  '/case-studies',
  '/deal',
  '/voucher',
  '/api/chat',
]
const SEARCH_MODAL_UI_KEYS = [
  'search.modal.title',
  'search.modal.label',
  'search.modal.placeholder',
  'search.modal.close',
  'search.modal.escapeHint',
  'search.modal.initialTitle',
  'search.modal.initialDescription',
  'search.modal.loading',
  'search.modal.emptyTitle',
  'search.modal.emptyDescription',
  'search.modal.errorTitle',
  'search.modal.errorDescription',
  'search.modal.results_zero',
  'search.modal.results_one',
  'search.modal.results_other',
  'search.modal.groups.page',
  'search.modal.groups.service',
  'search.modal.groups.article',
  'search.modal.groups.epigenetics',
  'search.modal.groups.befund',
  'search.modal.groups.resource',
  'search.modal.groups.event',
  'search.modal.groups.consumer',
] as const

function readJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8')) as Record<
    string,
    unknown
  >
}

function valueAt(source: Record<string, unknown>, dottedPath: string): unknown {
  return dottedPath.split('.').reduce<unknown>((value, segment) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[segment]
  }, source)
}

function translatorFor(language: string): TFunction {
  const cache = new Map<string, Record<string, unknown>>()
  return ((key: string) => {
    const separator = key.indexOf(':')
    const namespace = separator === -1 ? 'common' : key.slice(0, separator)
    const nestedKey = separator === -1 ? key : key.slice(separator + 1)
    if (!cache.has(namespace)) {
      cache.set(namespace, readJson(`public/locales/${language}/${namespace}.json`))
    }
    const value = valueAt(cache.get(namespace)!, nestedKey)
    return typeof value === 'string' ? value : key
  }) as TFunction
}

export function validateSearchTargets(index: readonly SearchResult[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const paths = new Set<string>()
  const expectedPaths = new Set(getSearchEligibleRouteEntries().map((route) => route.path))

  for (const item of index) {
    if (ids.has(item.id)) errors.push(`duplicate search id: ${item.id}`)
    if (paths.has(item.path)) errors.push(`duplicate search target: ${item.path}`)
    ids.add(item.id)
    paths.add(item.path)

    if (
      FORBIDDEN_PREFIXES.some(
        (prefix) => item.path === prefix || item.path.startsWith(`${prefix}/`),
      )
    ) {
      errors.push(`forbidden search target: ${item.path}`)
    }
    if (item.path === '/diagnostics/sports') errors.push('dead sports target is indexed')

    if (!expectedPaths.has(item.path)) errors.push(`target is not search-eligible: ${item.path}`)
  }

  for (const expected of expectedPaths) {
    if (!paths.has(expected)) errors.push(`missing registry search target: ${expected}`)
  }
  if (paths.size !== expectedPaths.size)
    errors.push('search index differs from registry eligibility')

  return errors
}

function main(): void {
  const metadataErrors: string[] = []
  const matrixErrors: string[] = []
  let referenceIndex: SearchResult[] | undefined

  for (const language of SUPPORTED_LANGUAGES) {
    const common = readJson(`public/locales/${language}/common.json`)
    for (const key of SEARCH_MODAL_UI_KEYS) {
      const value = valueAt(common, key)
      if (typeof value !== 'string' || !value.trim()) {
        metadataErrors.push(`${language}: missing SearchModal UI label ${key}`)
      }
    }

    const index = createSearchIndex(translatorFor(language))
    referenceIndex ??= index
    for (const item of index) {
      if (!item.title.trim() || /^[a-z][a-z0-9_-]*:[a-z]/.test(item.title)) {
        metadataErrors.push(`${language}/${item.id}: missing search title`)
      }
      if (!item.description.trim() || /^[a-z][a-z0-9_-]*:[a-z]/.test(item.description)) {
        metadataErrors.push(`${language}/${item.id}: missing search description`)
      }
      if (!item.typeLabel.trim() || /^[a-z][a-z0-9_-]*:[a-z]/.test(item.typeLabel)) {
        metadataErrors.push(`${language}/${item.id}: missing result type label`)
      }
      const localizedUrl = `/${language}${item.path === '/' ? '/' : item.path}`
      if (!localizedUrl.startsWith(`/${language}/`)) {
        metadataErrors.push(`${language}/${item.id}: URL is not locale-aware`)
      }
    }
  }

  const targetErrors = validateSearchTargets(referenceIndex ?? [])

  const matrix = fs.readFileSync(
    path.join(ROOT, 'building-docs/AP07-FINDABILITY-MATRIX.md'),
    'utf8',
  )
  const classifiedRoutes = [
    ...(referenceIndex ?? []).map((item) => item.path),
    '/consumer/vitamin-d3-spray',
    '/consumer/hydrating-masks',
    '/consumer/inside-out-duo',
    '/privacy',
    '/imprint',
    '/terms',
    '/vitamin-d3-implantologie',
    '/s3_leitlinie',
  ]
  for (const route of classifiedRoutes) {
    if (!matrix.split('\n').some((line) => line.startsWith('|') && line.includes(`\`${route}\``))) {
      matrixErrors.push(`matrix has no row for ${route}`)
    }
  }
  for (const item of referenceIndex ?? []) {
    const row = matrix
      .split('\n')
      .find(
        (line) =>
          line.startsWith('|') &&
          line.includes(`\`${item.path}\``) &&
          line.includes(`\`${item.id}\``) &&
          line.includes('10/10'),
      )
    if (!row || (row.match(/10\/10/g)?.length ?? 0) < 2) {
      matrixErrors.push(`active matrix row is incomplete: ${item.path}`)
    }
  }
  for (const id of ['DSI-01', 'DSI-02', 'DSI-03', 'DSI-04']) {
    if (
      !matrix.includes(`#### ${id}`) ||
      !matrix.split('\n').some((line) => line.startsWith('| ID') && line.includes(`\`${id}\``))
    ) {
      matrixErrors.push(`deferred register entry is missing: ${id}`)
    }
  }
  if (/\| Status \| (READY|RESOLVED) \|/.test(matrix)) {
    matrixErrors.push('deferred register contains a false-ready status')
  }

  // Negative controls: the validator itself must reject the three critical classes.
  const sample = referenceIndex?.[0]
  if (sample) {
    for (const badPath of ['/diagnostics/sports', '/services/dental', '/future-route']) {
      const errors = validateSearchTargets([
        { ...sample, id: `negative-${badPath}`, path: badPath },
      ])
      if (!errors.length) targetErrors.push(`negative control was accepted: ${badPath}`)
    }
  }

  const errors = [...targetErrors, ...metadataErrors, ...matrixErrors]
  if (errors.length) {
    console.error(`Search index guard failed (${errors.length}):`)
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
  }

  console.log(
    `Search index guard passed: ${referenceIndex?.length ?? 0} targets, ` +
      `${services.length}/${services.length} services, ${articles.length}/${articles.length} articles, ` +
      `${BEFUND_ORDER.length}/${BEFUND_ORDER.length} reports, ${SUPPORTED_LANGUAGES.length} locales, ` +
      `SearchModal UI copy ${SUPPORTED_LANGUAGES.length}/${SUPPORTED_LANGUAGES.length}.`,
  )
}

main()
