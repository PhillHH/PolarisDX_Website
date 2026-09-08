#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSitemapArtifact } from '../src/components/seo/sitemapGuard'
import { generateSitemapXml, getSitemapRouteFamilies } from '../src/components/seo/sitemap'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import {
  getCanonicalRouteEntries,
  getSitemapEligibleRouteEntries,
  resolveCanonicalRoute,
} from '../src/routing/routeRegistry'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const families = getSitemapRouteFamilies()
const xml = generateSitemapXml()

const BOT_POLICY = {
  SEARCH_ENGINE: [
    'Googlebot',
    'AdsBot-Google',
    'AdsBot-Google-Mobile',
    'Googlebot-Image',
    'Googlebot-News',
    'Googlebot-Video',
    'Bingbot',
    'AdIdxBot',
    'DuckDuckBot',
    'Yandex',
    'Baiduspider',
    'Applebot',
  ],
  SOCIAL_PREVIEW: [
    'FacebookBot',
    'facebookexternalhit',
    'Meta-ExternalFetcher',
    'LinkedInBot',
    'Twitterbot',
    'ChatGPT-User',
    'claude-user',
    'Perplexity-User',
    'MistralAI-User',
  ],
  AI_CRAWLER: [
    'Google-Extended',
    'GoogleOther',
    'GPTBot',
    'OAI-SearchBot',
    'anthropic-ai',
    'ClaudeBot',
    'Claude-Web',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'Amazonbot',
    'Bytespider',
    'PerplexityBot',
    'cohere-ai',
    'cohere-training-data-crawler',
    'CCBot',
    'DuckAssistBot',
    'Diffbot',
    'YouBot',
  ],
} as const

interface RobotsRule {
  directive: 'allow' | 'disallow'
  value: string
}

interface RobotsGroup {
  agents: string[]
  rules: RobotsRule[]
}

function parseRobots(value: string): { groups: RobotsGroup[]; sitemaps: string[] } {
  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  let agents: string[] = []
  let rules: RobotsRule[] = []

  const finishGroup = () => {
    if (agents.length) groups.push({ agents, rules })
    agents = []
    rules = []
  }

  for (const [index, originalLine] of value.split(/\r?\n/).entries()) {
    const line = originalLine.replace(/\s+#.*$/, '').trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error(`robots.txt invalid syntax at line ${index + 1}`)
    const directive = line.slice(0, separator).trim().toLowerCase()
    const directiveValue = line.slice(separator + 1).trim()
    if (!directiveValue) throw new Error(`robots.txt empty directive at line ${index + 1}`)

    if (directive === 'user-agent') {
      if (rules.length) finishGroup()
      agents.push(directiveValue)
    } else if (directive === 'allow' || directive === 'disallow') {
      if (!agents.length) throw new Error(`robots.txt rule without user-agent at line ${index + 1}`)
      rules.push({ directive, value: directiveValue })
    } else if (directive === 'sitemap') {
      finishGroup()
      sitemaps.push(directiveValue)
    } else {
      throw new Error(`robots.txt unsupported directive at line ${index + 1}: ${directive}`)
    }
  }
  finishGroup()
  return { groups, sitemaps }
}

function robotsPatternMatches(pattern: string, pathname: string): boolean {
  const endsAtPathEnd = pattern.endsWith('$')
  const source = (endsAtPathEnd ? pattern.slice(0, -1) : pattern)
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*')
  return new RegExp(`^${source}${endsAtPathEnd ? '$' : ''}`).test(pathname)
}

function robotsAllows(groups: RobotsGroup[], userAgent: string, pathname: string): boolean {
  const normalizedAgent = userAgent.toLowerCase()
  const matchingGroups = groups.filter((group) =>
    group.agents.some((agent) => agent === '*' || agent.toLowerCase() === normalizedAgent),
  )
  const specificity = Math.max(
    ...matchingGroups.flatMap((group) =>
      group.agents
        .filter((agent) => agent === '*' || agent.toLowerCase() === normalizedAgent)
        .map((agent) => (agent === '*' ? 0 : agent.length)),
    ),
  )
  const rules = matchingGroups
    .filter((group) =>
      group.agents.some(
        (agent) =>
          (agent === '*' ? 0 : agent.toLowerCase() === normalizedAgent ? agent.length : -1) ===
          specificity,
      ),
    )
    .flatMap((group) => group.rules)
    .filter((rule) => robotsPatternMatches(rule.value, pathname))
    .sort((left, right) => right.value.length - left.value.length)
  if (!rules.length) return true
  const longest = rules[0].value.length
  return rules
    .filter((rule) => rule.value.length === longest)
    .some((rule) => rule.directive === 'allow')
}

function assertRobotsAndMetaEvidence(): { botCount: number; hostFiles: number } {
  const robots = fs.readFileSync(path.join(repositoryRoot, 'public/robots.txt'), 'utf8')
  const parsed = parseRobots(robots)
  if (parsed.sitemaps.length !== 1 || parsed.sitemaps[0] !== `${PUBLIC_ORIGIN}/sitemap.xml`) {
    throw new Error('robots.txt must contain exactly the productive sitemap directive')
  }
  const expectedBots = Object.values(BOT_POLICY).flat()
  const actualBots = parsed.groups.flatMap((group) => group.agents).filter((agent) => agent !== '*')
  if (
    new Set(actualBots).size !== expectedBots.length ||
    expectedBots.some((agent) => !actualBots.includes(agent))
  ) {
    throw new Error('robots.txt changed the existing bot-specific policy inventory')
  }

  for (const userAgent of ['unnamed-crawler', ...expectedBots]) {
    for (const apiPath of ['/api', '/api/contact', '/api/consumer-order']) {
      if (robotsAllows(parsed.groups, userAgent, apiPath)) {
        throw new Error(`robots.txt exposes technical API path to ${userAgent}: ${apiPath}`)
      }
    }
    for (const publicPath of [
      '/de/',
      '/de/consumer/vitamin-d3-spray',
      '/assets/application.js',
      '/locales/de/home.json',
    ]) {
      if (!robotsAllows(parsed.groups, userAgent, publicPath)) {
        throw new Error(`robots.txt blocks public/render path for ${userAgent}: ${publicPath}`)
      }
    }
  }

  const seoHead = fs.readFileSync(
    path.join(repositoryRoot, 'src/components/seo/SEOHead.tsx'),
    'utf8',
  )
  for (const marker of [
    'SEOHead requires a non-empty title and description',
    'SEOHead received a visible translation key',
    'SEOHead requires visible social-image alternative text',
    '<meta property="og:image:alt" content={cleanOgImageAlt}',
    '<meta name="twitter:image:alt" content={cleanOgImageAlt}',
  ]) {
    if (!seoHead.includes(marker))
      throw new Error(`Meta-quality runtime evidence missing: ${marker}`)
  }

  const productiveHostFiles = [
    'public/robots.txt',
    'index.html',
    'src/components/seo/SEOHead.tsx',
    'src/components/seo/seoRouteSource.ts',
    'src/components/seo/sitemap.ts',
    'src/components/seo/structuredData.ts',
    ...fs
      .readdirSync(path.join(repositoryRoot, 'src/pages'), { recursive: true })
      .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.tsx'))
      .map((entry) => `src/pages/${entry}`),
  ]
  for (const filename of productiveHostFiles) {
    const source = fs.readFileSync(path.join(repositoryRoot, filename), 'utf8')
    if (/preview\.polarisdx\.net|https?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/]|$)/i.test(source)) {
      throw new Error(`Preview/dev SEO host found in productive source: ${filename}`)
    }
  }
  if (/preview\.polarisdx\.net|localhost|127\.0\.0\.1/i.test(xml)) {
    throw new Error('Preview/dev SEO host found in generated sitemap')
  }
  return { botCount: expectedBots.length, hostFiles: productiveHostFiles.length }
}

const CONSUMER_PAGES = [
  {
    path: '/consumer/vitamin-d3-spray',
    file: 'SprayPage.tsx',
    titleKey: 'spray.copy_046',
    descriptionKey: 'spray.copy_047',
    altKey: 'spray.copy_053',
    asset: 'spray-hero-12pack-office.jpeg',
    // AP21 PT21.2: die Seite bezieht Bildmasse und Slug aus dem
    // Produktmodell statt aus Literalen. Die Aussage bleibt dieselbe — die
    // Masse sind deklariert und stimmen mit der Datei ueberein; belegt wird
    // das jetzt zusaetzlich in `src/content/consumer/products.test.ts`, wo
    // sie aus dem JPEG gelesen werden.
    markers: [
      'ogImageWidth={SPRAY_PRODUCT.hero.width}',
      'ogImageHeight={SPRAY_PRODUCT.hero.height}',
      'url: `/consumer/${SPRAY_PRODUCT.slug}`',
    ],
  },
  {
    path: '/consumer/hydrating-masks',
    file: 'MaskPage.tsx',
    titleKey: 'mask.copy_031',
    descriptionKey: 'mask.copy_032',
    altKey: 'mask.copy_037',
    asset: 'mask-hero-botanical.jpeg',
    // AP21 PT21.3: wie die Spray-Seite bezieht auch diese Seite Bildmasse und
    // Slug aus dem Produktmodell. Die Aussage bleibt; die Masse werden in
    // `products.test.ts` zusaetzlich aus dem JPEG gelesen.
    markers: [
      'ogImageWidth={MASKS_PRODUCT.hero.width}',
      'ogImageHeight={MASKS_PRODUCT.hero.height}',
      'url: `/consumer/${MASKS_PRODUCT.slug}`',
    ],
  },
  {
    path: '/consumer/inside-out-duo',
    file: 'DuoPage.tsx',
    titleKey: 'duo.copy_015',
    descriptionKey: 'duo.seo_description',
    altKey: 'duo.copy_023',
    asset: 'duo-hero-products-together.jpeg',
  },
] as const

function assertConsumerSeoEvidence(): void {
  const english = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'public/locales/en/consumer.json'), 'utf8'),
  ) as Record<string, string>

  for (const locale of SUPPORTED_LANGUAGES) {
    const messages = JSON.parse(
      fs.readFileSync(path.join(repositoryRoot, `public/locales/${locale}/consumer.json`), 'utf8'),
    ) as Record<string, string>
    const titles = new Set<string>()
    const descriptions = new Set<string>()

    for (const page of CONSUMER_PAGES) {
      const source = fs.readFileSync(
        path.join(repositoryRoot, 'src/pages/consumer', page.file),
        'utf8',
      )
      const pageMarkers =
        'markers' in page
          ? (page.markers as readonly string[])
          : ['ogImageWidth={1122}', 'ogImageHeight={1402}', `url: '${page.path}'`]
      for (const marker of [
        'ogType="product"',
        'ogImageAlt={socialImageAlt}',
        'createProductSchema({',
        ...pageMarkers,
      ]) {
        if (!source.includes(marker)) {
          throw new Error(`Consumer SEO source evidence missing in ${page.file}: ${marker}`)
        }
      }
      if (!source.includes(page.asset)) {
        throw new Error(`Consumer social asset evidence missing in ${page.file}: ${page.asset}`)
      }
      if (
        !fs.existsSync(path.join(repositoryRoot, 'src/assets/landingpages-consumer', page.asset))
      ) {
        throw new Error(`Consumer social asset does not exist: ${page.asset}`)
      }

      for (const key of [page.titleKey, page.descriptionKey, page.altKey]) {
        const value = messages[key]?.trim()
        if (!value || value === key) {
          throw new Error(`Consumer ${locale} metadata is missing or unresolved: ${key}`)
        }
        if (locale !== 'en' && value === english[key]) {
          throw new Error(`Consumer ${locale} metadata regressed to English: ${key}`)
        }
      }
      titles.add(messages[page.titleKey].trim())
      descriptions.add(messages[page.descriptionKey].trim())
    }

    if (titles.size !== CONSUMER_PAGES.length || descriptions.size !== CONSUMER_PAGES.length) {
      throw new Error(`Consumer ${locale} product metadata is not product-specific`)
    }
  }

  const robots = fs.readFileSync(path.join(repositoryRoot, 'public/robots.txt'), 'utf8')
  if (/^\s*Disallow:\s*\/consumer(?:\/|\s|$)/im.test(robots)) {
    throw new Error('robots.txt blocks Consumer routes')
  }
  const server = fs.readFileSync(path.join(repositoryRoot, 'server.ts'), 'utf8')
  if (/\/en\/consumer/.test(server)) {
    throw new Error('Consumer EN-only server handling detected')
  }
}

function assertSourceEvidence(): void {
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'src/App.tsx'), 'utf8')
  for (const marker of ['getStaticAppRoutes', 'getDynamicAppRoutes', 'getBefundRouteEntries']) {
    if (!appSource.includes(marker)) throw new Error(`App registry evidence missing: ${marker}`)
  }
  const registrySitemapPaths = new Set(getSitemapEligibleRouteEntries().map((route) => route.path))
  const sitemapPaths = new Set(families.map((family) => family.path))
  if (
    registrySitemapPaths.size !== sitemapPaths.size ||
    [...registrySitemapPaths].some((routePath) => !sitemapPaths.has(routePath))
  ) {
    throw new Error('Sitemap differs from central Route Registry')
  }

  const legalFiles = ['PrivacyPage.tsx', 'ImprintPage.tsx', 'TermsPage.tsx']
  for (const filename of legalFiles) {
    const source = fs.readFileSync(path.join(repositoryRoot, 'src/pages', filename), 'utf8')
    if (!source.includes('noindex={true}')) {
      throw new Error(`Legal noindex evidence missing in ${filename}`)
    }
  }
  const supportSource = fs.readFileSync(
    path.join(repositoryRoot, 'src/pages/SupportPage.tsx'),
    'utf8',
  )
  const supportRoute = resolveCanonicalRoute('/support')
  if (
    !supportRoute ||
    supportRoute.indexability !== 'INDEX_FOLLOW' ||
    supportRoute.sitemap !== false ||
    supportSource.includes('noindex={true}')
  ) {
    throw new Error('Support classification drifted from INDEXABLE_EXCLUDED_INTENTIONAL')
  }
  if (getCanonicalRouteEntries().some((route) => !route.appRoute || !route.knownPath)) {
    throw new Error('Public Registry route is not App/Known-Path eligible')
  }
}

function assertStructuredDataEvidence(): void {
  const helper = fs.readFileSync(
    path.join(repositoryRoot, 'src/components/seo/structuredData.ts'),
    'utf8',
  )
  const seoHead = fs.readFileSync(
    path.join(repositoryRoot, 'src/components/seo/SEOHead.tsx'),
    'utf8',
  )
  for (const marker of [
    'export const organizationSchema',
    'export function createWebsiteSchema',
    'export function createBreadcrumbSchema',
    'export function createProductSchema',
    'export function createFAQSchema',
    'export function createArticleSchema',
    'export function createEventSchema',
    'export function validateStructuredData',
  ]) {
    if (!helper.includes(marker))
      throw new Error(`Structured Data helper evidence missing: ${marker}`)
  }
  for (const forbidden of [
    'export const medicalBusinessSchema',
    'export const localBusinessSchema',
    'export function createReviewSchema',
    'potentialAction:',
    'priceRange:',
    'openingHoursSpecification:',
  ]) {
    if (helper.includes(forbidden))
      throw new Error(`Unsafe Structured Data evidence found: ${forbidden}`)
  }
  if (!seoHead.includes('serializeStructuredData(structuredData)')) {
    throw new Error('SEOHead is not using the canonical Structured Data validation layer')
  }

  const productiveSources = [
    path.join(repositoryRoot, 'src/components/seo/structuredData.ts'),
    ...fs
      .readdirSync(path.join(repositoryRoot, 'src/pages'), { recursive: true })
      .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.tsx'))
      .map((entry) => path.join(repositoryRoot, 'src/pages', entry)),
  ]
  for (const filename of productiveSources) {
    const source = fs.readFileSync(filename, 'utf8')
    if (/preview\.polarisdx\.net|https?:\/\/(?:localhost|127\.0\.0\.1)/i.test(source)) {
      throw new Error(
        `Preview/dev Structured Data source found in ${path.relative(repositoryRoot, filename)}`,
      )
    }
  }

  const s3 = fs.readFileSync(path.join(repositoryRoot, 'src/pages/S3LeitliniePage.tsx'), 'utf8')
  if (s3.includes("'@type': 'HowTo'")) {
    throw new Error('Unverified page-local HowTo schema is active')
  }
  const home = fs.readFileSync(path.join(repositoryRoot, 'src/pages/HomePage.tsx'), 'utf8')
  if (/createReviewSchema|iglooProProductSchema|medicalBusinessSchema/.test(home)) {
    throw new Error('Homepage contains testimonial/product/medical schema amplification')
  }

  const iglooProduct = fs.readFileSync(
    path.join(repositoryRoot, 'src/pages/IglooProPage.tsx'),
    'utf8',
  )
  for (const marker of [
    'createProductSchema({',
    "name: 'IglooPro'",
    "url: '/igloo-pro'",
    "description: t('products:hero.description')",
    'image: iglooProImage',
  ]) {
    if (!iglooProduct.includes(marker)) {
      throw new Error(`IglooPro Product schema evidence missing: ${marker}`)
    }
  }
  for (const unsupported of [
    'brand:',
    'manufacturer:',
    'offers:',
    'aggregateRating:',
    'review:',
    'sku:',
    'gtin:',
    'seller:',
    'QuantitativeValue',
  ]) {
    if (iglooProduct.includes(unsupported)) {
      throw new Error(`IglooPro Product schema contains unsupported evidence: ${unsupported}`)
    }
  }

  const contract = fs.readFileSync(
    path.join(repositoryRoot, 'building-docs/SEO-CONTRACT.md'),
    'utf8',
  )
  for (const marker of [
    'SCHEMA-COVERAGE-MATRIX',
    'Diagnostics Hub',
    'Musterbefund',
    'Consumer Product',
    'Downloads/Resource',
    '404',
    'DG09-01',
  ]) {
    if (!contract.includes(marker))
      throw new Error(`Schema Coverage Matrix evidence missing: ${marker}`)
  }
}

function expectHardFailure(name: string, mutatedXml: string): void {
  try {
    validateSitemapArtifact(mutatedXml, families)
  } catch {
    return
  }
  throw new Error(`G3 hard-failure self-test did not reject: ${name}`)
}

function runHardFailureSelfTests(): void {
  const firstBlock = xml.match(/[ ]{2}<url>[^]*?[ ]{2}<\/url>\n/)?.[0]
  if (!firstBlock) throw new Error('Cannot construct G3 self-test fixtures')

  expectHardFailure('duplicate URL', xml.replace('</urlset>', `${firstBlock}</urlset>`))
  expectHardFailure(
    'missing locale / consumer locale',
    xml.replace(
      /[ ]{2}<url>\n[ ]{4}<loc>https:\/\/polarisdx\.net\/cs\/consumer\/vitamin-d3-spray<\/loc>[^]*?[ ]{2}<\/url>\n/,
      '',
    ),
  )
  expectHardFailure('404 URL', xml.replaceAll('/about', '/definitely-not-a-route'))
  expectHardFailure('noindex URL', xml.replaceAll('/about', '/privacy'))
  expectHardFailure('preview host', xml.replace(PUBLIC_ORIGIN, 'https://preview.polarisdx.net'))
  expectHardFailure('invalid XML', xml.replace('</urlset>', ''))

  const withoutLastmod = xml.replace(/[ ]{4}<lastmod>[^<]+<\/lastmod>\n/g, '')
  const fakeToday = withoutLastmod.replace(
    /[ ]{4}<changefreq>/g,
    '    <lastmod>2099-01-01</lastmod>\n    <changefreq>',
  )
  expectHardFailure('fake global lastmod', fakeToday)
}

const PUBLIC_ORIGIN = 'https://polarisdx.net'

assertSourceEvidence()
assertConsumerSeoEvidence()
assertStructuredDataEvidence()
const robotsAndMeta = assertRobotsAndMetaEvidence()
const result = validateSitemapArtifact(xml, families)
runHardFailureSelfTests()

console.log(
  `G3 SEO artifact coverage PASS: ${result.routeFamilyCount} families, ${result.urlCount} URLs, ${result.uniqueUrlCount} unique, ${result.lastmodCount} truthful lastmod entries; Consumer 3x10, PT09.4 Structured Data and PT09.5 robots/meta/host evidence PASS (${robotsAndMeta.botCount} specific bot agents, ${robotsAndMeta.hostFiles} productive host-sweep files); hard-failure self-tests PASS`,
)
