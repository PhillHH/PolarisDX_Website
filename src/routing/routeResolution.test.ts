// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { TFunction } from 'i18next'

import { BEFUND_ORDER } from '../content/befunde/meta'
import { services } from '../data/services'
import { getSitemapRouteFamilies } from '../components/seo/sitemap'
import { createSearchIndex } from '../hooks/useSearch'
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  extractLanguageFromPathname,
  getLanguageFromPathname,
  normalizeLanguage,
} from '../i18n'
import { INTENTIONAL_404_PATHS } from './legacyRedirects'
import {
  getCanonicalRouteEntries,
  getRedirectRegistryEntries,
  getRegistryRedirectTarget,
  getSearchEligibleRouteEntries,
  getSitemapEligibleRouteEntries,
  isKnownCanonicalPath,
  normalizeRoutePath,
  resolveCanonicalRoute,
} from './routeRegistry'

/**
 * AP27 PT27.1 — Route- und Locale-Aufloesung als Unit-Vertrag.
 *
 * `routeRegistry.test.ts` (AP10) beweist die Registry in sich. Hier stehen die Zusammensetzung
 * mit dem Locale-Praefix, das Segmentmodell, die Redirect-Stabilitaet und die Frage, ob Sitemap
 * und Suche wirklich aus der Registry leben. SSR-Statuscodes beweist dieser Test NICHT — das ist
 * HTTP-Verhalten (PT27.5); die Spiegel-Freiheit von `server.ts` prueft `check:routes` (G1).
 */

const localized = (pathname: string) => {
  const locale = getLanguageFromPathname(pathname)
  if (!locale) return { locale: null, route: undefined }
  return { locale, route: resolveCanonicalRoute(pathname.slice(locale.length + 1) || '/') }
}

const entriesOfType = (routeType: string) =>
  getCanonicalRouteEntries().filter((route) => route.routeType === routeType)

describe('PT27.1 · Locale-Praefix + Registry', () => {
  it('loest jede kanonische Route in allen zehn Sprachen auf dieselbe Familie auf', () => {
    for (const route of getCanonicalRouteEntries()) {
      for (const locale of SUPPORTED_LANGUAGES) {
        const suffix = route.path === '/' ? '/' : route.path
        const result = localized(`/${locale}${suffix}`)
        expect(result.locale, `/${locale}${suffix}`).toBe(locale)
        expect(result.route?.id, `/${locale}${suffix}`).toBe(route.id)
      }
    }
  })

  it('haelt unbekannte, umgeleitete und bewusst entfernte Pfade fuer unbekannt', () => {
    const unknown = [
      '/en/diagnostics/not-real',
      '/fr/consumer',
      '/de/About',
      '/pl/epigenetics/musterbefund/unknown',
      '/cs/services',
      '/it/services/dental',
      ...INTENTIONAL_404_PATHS.map((pathname) => `/de${pathname}`),
    ]
    for (const pathname of unknown) {
      const result = localized(pathname)
      expect(result.route, pathname).toBeUndefined()
    }
  })

  it('erkennt ohne gueltiges Praefix KEINE Sprache — auch nicht bei aehnlichen Segmenten', () => {
    for (const pathname of ['/about', '/xx/about', '/DE/about', '/dental', '/de-DE/about', '']) {
      expect(getLanguageFromPathname(pathname), pathname).toBeNull()
    }
    expect(getLanguageFromPathname('/cs')).toBe('cs')
    expect(extractLanguageFromPathname('/dental')).toBe(DEFAULT_LANGUAGE)
  })

  it('ordnet Sprachcodes nur einer der zehn Locales zu; Unbekanntes wird de, nie eine andere', () => {
    expect(normalizeLanguage('pt-BR')).toBe('pt')
    expect(normalizeLanguage('cs-CZ')).toBe('cs')
    expect(normalizeLanguage('nl-BE')).toBe('nl')
    expect(normalizeLanguage('da-DK')).toBe('da')
    expect(normalizeLanguage('EN')).toBe('en')
    for (const code of ['sv', 'zh-CN', 'deu', 'en_US', '', null]) {
      // `en_US` ist kein BCP-47-Code; der Vertrag faellt dann auf den Default, nicht auf `en`.
      expect(normalizeLanguage(code), String(code)).toBe(DEFAULT_LANGUAGE)
    }
  })

  it('normalisiert Pfade ohne Query, Fragment und abschliessenden Slash', () => {
    expect(normalizeRoutePath('/about/')).toBe('/about')
    expect(normalizeRoutePath('/about?utm=x#team')).toBe('/about')
    expect(normalizeRoutePath('about')).toBe('/about')
    expect(normalizeRoutePath('')).toBe('/')
    expect(normalizeRoutePath('///')).toBe('/')
  })
})

describe('PT27.1 · Segmentmodell', () => {
  it('Consumer: nur CONSUMER_PRODUCT-Seiten unter /consumer/, eigene Shell, drei Seiten', () => {
    const consumer = entriesOfType('CONSUMER_PRODUCT')
    expect(consumer).toHaveLength(3)
    for (const route of consumer) {
      expect(route.path.startsWith('/consumer/'), route.path).toBe(true)
      expect(route.shell).toBe('CONSUMER')
      expect(route.indexability).toBe('INDEX_FOLLOW')
    }
    const consumerShell = getCanonicalRouteEntries().filter((route) => route.shell === 'CONSUMER')
    expect(consumerShell.map((route) => route.id)).toEqual(consumer.map((route) => route.id))
  })

  it('Shopify-only: keine interne Checkout-, Warenkorb- oder Kaufroute', () => {
    for (const route of getCanonicalRouteEntries()) {
      expect(route.path, route.path).not.toMatch(/checkout|cart|warenkorb|kasse|purchase/i)
    }
  })

  it('Epigenetik: Hub, drei Vertiefungen und sechs Musterbefunde unter /epigenetics', () => {
    const epigenetics = entriesOfType('EPIGENETICS')
    expect(epigenetics.map((route) => route.path)).toContain('/epigenetics')
    expect(epigenetics).toHaveLength(4)
    for (const route of epigenetics) {
      expect(route.path === '/epigenetics' || route.path.startsWith('/epigenetics/')).toBe(true)
      expect(route.path.startsWith('/epigenetics/musterbefund/')).toBe(false)
    }
    const reports = entriesOfType('REPORT')
    expect(reports.map((route) => route.path)).toEqual(
      BEFUND_ORDER.map((slug) => `/epigenetics/musterbefund/${slug}`),
    )
  })

  it('Ressourcen und Services: feste Ressourcenseiten, jeder Service unter /diagnostics/', () => {
    expect(
      entriesOfType('RESOURCE')
        .map((route) => route.path)
        .sort(),
    ).toEqual(['/downloads', '/vitamin-d3-spray'])
    expect(entriesOfType('SERVICE').map((route) => route.path)).toEqual(
      services.map((service) => `/diagnostics/${service.id}`),
    )
  })

  it('Legal: genau drei Seiten, noindex, weder Sitemap noch Suche', () => {
    const legal = entriesOfType('LEGAL')
    expect(legal.map((route) => route.path).sort()).toEqual(['/imprint', '/privacy', '/terms'])
    for (const route of legal) {
      expect(route.indexability).toBe('NOINDEX_NOFOLLOW')
      expect(route.sitemap).toBe(false)
      expect(route.searchEligible).toBe(false)
    }
  })
})

describe('PT27.1 · Redirect-Mapping', () => {
  const redirects = getRedirectRegistryEntries()

  it('bleibt stabil: 30 permanente Quellen, Services-Migration vollstaendig', () => {
    expect(redirects).toHaveLength(30)
    expect(getRegistryRedirectTarget('/services')).toBe('/diagnostics')
    for (const service of services) {
      expect(getRegistryRedirectTarget(`/services/${service.id}`)).toBe(
        `/diagnostics/${service.id}`,
      )
    }
  })

  it('loest jede Quelle auch mit abschliessendem Slash und Query auf dasselbe Ziel auf', () => {
    for (const redirect of redirects) {
      expect(getRegistryRedirectTarget(redirect.sourcePath)).toBe(redirect.targetPath)
      expect(getRegistryRedirectTarget(`${redirect.sourcePath}/?ref=alt`)).toBe(redirect.targetPath)
    }
  })

  it('ist kettenfrei: kein Ziel ist selbst Quelle, keine Quelle ist eine gueltige Seite', () => {
    for (const redirect of redirects) {
      expect(getRegistryRedirectTarget(redirect.targetPath), redirect.targetPath).toBeNull()
      expect(isKnownCanonicalPath(redirect.targetPath), redirect.targetPath).toBe(true)
      expect(isKnownCanonicalPath(redirect.sourcePath), redirect.sourcePath).toBe(false)
    }
  })

  it('leitet weder gueltige noch unbekannte Pfade um', () => {
    for (const route of getCanonicalRouteEntries()) {
      expect(getRegistryRedirectTarget(route.path), route.path).toBeNull()
    }
    expect(getRegistryRedirectTarget('/__unknown__')).toBeNull()
  })
})

describe('PT27.1 · Sitemap und Suche leben aus der Registry', () => {
  it('die Sitemap-Familien sind exakt die sitemap-faehigen Registry-Pfade', () => {
    expect(new Set(getSitemapRouteFamilies().map((route) => route.path))).toEqual(
      new Set(getSitemapEligibleRouteEntries().map((route) => route.path)),
    )
  })

  it('der Suchindex fuehrt exakt die suchfaehigen Registry-Pfade', () => {
    const t = ((key: string) => key) as unknown as TFunction
    expect(new Set(createSearchIndex(t).map((result) => result.path))).toEqual(
      new Set(getSearchEligibleRouteEntries().map((route) => route.path)),
    )
  })
})
