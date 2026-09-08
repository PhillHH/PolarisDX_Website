#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TFunction } from 'i18next'
import { generateSitemapXml, getSitemapRouteFamilies } from '../src/components/seo/sitemap'
import { validateSitemapArtifact } from '../src/components/seo/sitemapGuard'
import { createSearchIndex } from '../src/hooks/useSearch'
import {
  DYNAMIC_ROUTE_DEFINITIONS,
  ROUTE_REGISTRY,
  getCanonicalRouteEntries,
  getDynamicSourceRecords,
  getRedirectRegistryEntries,
  getSearchEligibleRouteEntries,
  getSitemapEligibleRouteEntries,
  isKnownCanonicalPath,
  normalizeRoutePath,
} from '../src/routing/routeRegistry'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (relativePath: string) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8')
const setEquals = (left: Set<string>, right: Set<string>) =>
  left.size === right.size && [...left].every((value) => right.has(value))

function addDuplicateErrors(label: string, values: readonly string[], errors: string[]): void {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) errors.push(`duplicate ${label}: ${value}`)
    seen.add(value)
  }
}

function sourceRecordKeys(source: string, recordName: string): Set<string> {
  const block = new RegExp(`const\\s+${recordName}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`).exec(
    source,
  )?.[1]
  if (!block) return new Set()
  return new Set(
    [...block.matchAll(/^\s+(?:'([^']+)'|([a-z][\w-]*))\s*:/gm)].map(
      (match) => match[1] || match[2],
    ),
  )
}

function navigationErrors(): string[] {
  const errors: string[] = []
  const targets = new Set<string>()
  for (const relativePath of [
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
  ]) {
    const source = read(relativePath)
    for (const match of source.matchAll(/\b(?:to|route):\s*'([^']+)'/g)) targets.add(match[1])
    for (const match of source.matchAll(/\bto="([^"{]+)"/g)) targets.add(match[1])
  }

  const redirectSources = new Set(getRedirectRegistryEntries().map((entry) => entry.sourcePath))
  for (const target of targets) {
    if (!target.startsWith('/')) continue
    const routePath = normalizeRoutePath(target)
    if (redirectSources.has(routePath)) errors.push(`navigation targets redirect source: ${target}`)
    if (/^\/(shop|casestudys|case-studies|deal|voucher)(?:\/|$)/.test(routePath)) {
      errors.push(`navigation targets locked backlog route: ${target}`)
    }
    if (/chat|hihuman/i.test(target)) errors.push(`navigation targets excluded chat: ${target}`)
    if (!isKnownCanonicalPath(routePath)) errors.push(`navigation target is unknown: ${target}`)
  }
  return errors
}

export function validateRouteRegistryParity(): string[] {
  const errors: string[] = []
  const canonical = getCanonicalRouteEntries()
  const canonicalPaths = new Set(canonical.map((route) => route.path))

  // 1. App Route ↔ Registry. Component bindings are exhaustive Records in
  // App.tsx and therefore TypeScript-enforced; G1 also forbids literal mirrors.
  const appSource = read('src/App.tsx')
  for (const consumer of ['getStaticAppRoutes', 'getDynamicAppRoutes', 'getBefundRouteEntries']) {
    if (!appSource.includes(consumer)) errors.push(`App does not consume ${consumer}`)
  }
  const staticBindings = sourceRecordKeys(appSource, 'STATIC_ROUTE_ELEMENTS')
  const dynamicBindings = sourceRecordKeys(appSource, 'DYNAMIC_ROUTE_ELEMENTS')
  const befundBindings = sourceRecordKeys(appSource, 'BEFUND_ROUTE_ELEMENTS')
  const expectedStaticBindings = new Set(
    ROUTE_REGISTRY.filter((route) => !('dynamicSource' in route)).map((route) => route.id),
  )
  const expectedDynamicBindings = new Set(DYNAMIC_ROUTE_DEFINITIONS.map((route) => route.id))
  const expectedBefundBindings = new Set(
    getDynamicSourceRecords('BEFUNDE').map((record) => record.sourceId),
  )
  if (!setEquals(staticBindings, expectedStaticBindings)) errors.push('App static binding drift')
  if (!setEquals(dynamicBindings, expectedDynamicBindings)) errors.push('App dynamic binding drift')
  if (!setEquals(befundBindings, expectedBefundBindings)) errors.push('App Befund binding drift')
  const literalAppPaths = [...appSource.matchAll(/<Route[^>]*\bpath="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((routePath) => routePath !== '*')
  if (literalAppPaths.length) errors.push(`App contains literal route mirrors: ${literalAppPaths}`)

  const serverSource = read('server.ts')
  for (const marker of ['isKnownCanonicalPath(', 'getRegistryRedirectTarget(']) {
    if (!serverSource.includes(marker)) errors.push(`Server does not consume ${marker}`)
  }

  // 2. Registry ↔ server Known Paths.
  for (const route of canonical) {
    if (!isKnownCanonicalPath(route.path)) errors.push(`known-path miss: ${route.path}`)
  }
  for (const source of getRedirectRegistryEntries()) {
    if (isKnownCanonicalPath(source.sourcePath)) {
      errors.push(`redirect source classified as canonical known path: ${source.sourcePath}`)
    }
  }

  // 3. Registry ↔ Sitemap including the unchanged G3 XML contract.
  const registrySitemap = new Set(getSitemapEligibleRouteEntries().map((route) => route.path))
  const sitemapFamilies = getSitemapRouteFamilies()
  const actualSitemap = new Set(sitemapFamilies.map((route) => route.path))
  if (!setEquals(registrySitemap, actualSitemap)) errors.push('sitemap eligibility drift')
  try {
    validateSitemapArtifact(generateSitemapXml(), sitemapFamilies)
  } catch (error) {
    errors.push(`G3 sitemap contract failed: ${(error as Error).message}`)
  }

  // 4. Registry ↔ Search. Search owns copy, never path existence.
  const translator = ((key: string) => key) as TFunction
  const searchPaths = new Set(createSearchIndex(translator).map((result) => result.path))
  const registrySearch = new Set(getSearchEligibleRouteEntries().map((route) => route.path))
  if (!setEquals(registrySearch, searchPaths)) errors.push('search eligibility drift')

  // 5. Registry ↔ SEO route awareness.
  const seoHeadSource = read('src/components/seo/SEOHead.tsx')
  if (!seoHeadSource.includes('resolveCanonicalRoute(path)')) {
    errors.push('SEOHead is not registry-aware')
  }
  for (const route of canonical) {
    if (
      route.indexability === 'INDEX_FOLLOW' &&
      route.sitemap === false &&
      route.id !== 'support'
    ) {
      errors.push(`indexable route lacks explicit sitemap decision: ${route.path}`)
    }
    if (route.indexability !== 'INDEX_FOLLOW' && route.sitemap !== false) {
      errors.push(`noindex route is sitemap-eligible: ${route.path}`)
    }
  }

  // 6. Redirect targets exist and sources are explicit, unique legacy routes.
  const redirects = getRedirectRegistryEntries()
  addDuplicateErrors(
    'redirect source',
    redirects.map((route) => route.sourcePath),
    errors,
  )
  for (const redirect of redirects) {
    if (!canonicalPaths.has(redirect.targetPath)) {
      errors.push(`redirect target is unknown: ${redirect.sourcePath} -> ${redirect.targetPath}`)
    }
    if (redirect.sourcePath === redirect.targetPath)
      errors.push(`redirect loop: ${redirect.sourcePath}`)
  }

  // 7. Dynamic records are source-backed and unique.
  for (const family of DYNAMIC_ROUTE_DEFINITIONS) {
    const records = getDynamicSourceRecords(family.dynamicSource)
    if (!records.length) errors.push(`empty dynamic source: ${family.dynamicSource}`)
    addDuplicateErrors(
      `${family.dynamicSource} slug`,
      records.map((record) => record.slug),
      errors,
    )
  }

  // 8/9. Registry IDs, patterns and expanded canonical paths are unique.
  addDuplicateErrors(
    'route id',
    ROUTE_REGISTRY.map((route) => route.id),
    errors,
  )
  addDuplicateErrors(
    'route pattern',
    ROUTE_REGISTRY.map((route) => route.pathPattern),
    errors,
  )
  addDuplicateErrors(
    'canonical path',
    canonical.map((route) => route.path),
    errors,
  )

  // 10. Old route mirrors must not return under authoritative-looking names.
  const staleMirrorChecks: Array<[string, RegExp, string]> = [
    ['server.ts', /EXTRA_KNOWN_PATHS|const\s+KNOWN_PATHS|getSitemapRouteFamilies/, 'server mirror'],
    [
      'src/components/seo/sitemap.ts',
      /MANUAL_SITEMAP_FAMILIES|from ['"]\.\.\/\.\.\/(?:data|content)\//,
      'sitemap mirror',
    ],
    ['src/hooks/useSearch.ts', /SEARCH_PAGE_DEFINITIONS|\bpath:\s*['"]\//, 'search path mirror'],
    ['scripts/prerender.mjs', /const\s+ROUTES\s*=|\[\s*['"]\//, 'prerender route mirror'],
    ['scripts/check-nav-targets.mjs', /src\/App\.tsx|definedRoutes|<Route/, 'nav App parser'],
  ]
  for (const [file, pattern, label] of staleMirrorChecks) {
    if (pattern.test(read(file))) errors.push(`${label} remains in ${file}`)
  }
  if (!read('scripts/prerender.mjs').includes('LEGACY_NON_AUTHORITATIVE')) {
    errors.push('legacy prerender is not explicitly non-authoritative')
  }
  if (!read('e2e/url-smoke.spec.ts').includes('getRouteTestMatrix()')) {
    errors.push('URL/HTTP test matrix is not Registry-derived')
  }
  const ciSource = read('.github/workflows/ci.yml')
  if (!/\n {2}routing:\n/.test(ciSource) || !ciSource.includes('run: npm run check:routes')) {
    errors.push('G1 is not active in the independent Relaunch CI routing job')
  }

  errors.push(...navigationErrors())
  return errors
}

function main(): void {
  const navOnly = process.argv.includes('--nav-only')
  const errors = navOnly ? navigationErrors() : validateRouteRegistryParity()
  if (errors.length) {
    console.error(`G1 Route Registry Parity failed (${errors.length}):`)
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
  }

  if (navOnly) {
    console.log('G1 navigation target subset passed: all Header/Footer targets are registry-valid.')
    return
  }
  console.log(
    `G1 Route Registry Parity passed: ${ROUTE_REGISTRY.length} families, ` +
      `${getCanonicalRouteEntries().length} canonical paths, ` +
      `${getSitemapEligibleRouteEntries().length} sitemap, ` +
      `${getSearchEligibleRouteEntries().length} search, ` +
      `${getRedirectRegistryEntries().length} redirects; 0 stale route mirrors.`,
  )
}

main()
