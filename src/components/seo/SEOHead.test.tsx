import { renderToString } from 'react-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n'
import { SEOHead } from './SEOHead'
import {
  PUBLIC_SEO_ORIGIN,
  hreflangUrls,
  publicSeoUrl,
  resolveCanonicalUrl,
} from './seoRouteSource'

const localeState = vi.hoisted(() => ({ current: 'de' as SupportedLanguage }))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      get language() {
        return localeState.current
      },
      get resolvedLanguage() {
        return localeState.current
      },
    },
  }),
}))

function renderHead(
  pathname: string,
  props: Partial<React.ComponentProps<typeof SEOHead>> = {},
): Document {
  const context: { helmet?: HelmetServerState } = {}
  const canUseDOM = HelmetProvider.canUseDOM
  HelmetProvider.canUseDOM = false
  try {
    renderToString(
      <HelmetProvider context={context}>
        <MemoryRouter initialEntries={[pathname]}>
          <SEOHead
            title="Diagnostics"
            description="Locale-aware diagnostics description."
            {...props}
          />
        </MemoryRouter>
      </HelmetProvider>,
    )
  } finally {
    HelmetProvider.canUseDOM = canUseDOM
  }

  const helmet = context.helmet!
  return new DOMParser().parseFromString(
    `<html><head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head></html>`,
    'text/html',
  )
}

describe('PT09.1 SEOHead contract', () => {
  it('emits one title, description and public canonical with a single brand suffix', () => {
    localeState.current = 'fr'
    const document = renderHead('/diagnostics/dental', { title: 'Dental | PolarisDX' })

    expect(document.querySelectorAll('title')).toHaveLength(1)
    expect(document.title).toBe('Dental | PolarisDX')
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Locale-aware diagnostics description.',
    )
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${PUBLIC_SEO_ORIGIN}/fr/diagnostics/dental`,
    )
  })

  it('emits the exact x10 locale cluster, German x-default and self-reference', () => {
    localeState.current = 'cs'
    const document = renderHead('/consumer/vitamin-d3-spray')
    const alternates = [...document.querySelectorAll('link[rel="alternate"]')]

    expect(alternates).toHaveLength(11)
    expect(alternates.filter((link) => link.getAttribute('hreflang') !== 'x-default')).toHaveLength(
      SUPPORTED_LANGUAGES.length,
    )
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(
        document.querySelector(`link[rel="alternate"][hreflang="${locale}"]`)?.getAttribute('href'),
      ).toBe(`${PUBLIC_SEO_ORIGIN}/${locale}/consumer/vitamin-d3-spray`)
    }
    expect(
      document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href'),
    ).toBe(`${PUBLIC_SEO_ORIGIN}/de/consumer/vitamin-d3-spray`)
    expect(
      document.querySelector('link[rel="alternate"][hreflang="cs"]')?.getAttribute('href'),
    ).toBe(`${PUBLIC_SEO_ORIGIN}/cs/consumer/vitamin-d3-spray`)
  })

  it('keeps OG and Twitter output aligned with canonical and the public image host', () => {
    localeState.current = 'pl'
    const document = renderHead('/s3_leitlinie', { ogImage: '/og-image.jpg' })
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')

    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      canonical,
    )
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Diagnostics | PolarisDX',
    )
    expect(document.querySelector('meta[property="og:description"]')).toBeTruthy()
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      `${PUBLIC_SEO_ORIGIN}/og-image.jpg`,
    )
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe(
      'Diagnostics',
    )
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
      'pl_PL',
    )
    expect(document.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(9)
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    )
    expect(document.querySelector('meta[name="twitter:url"]')?.getAttribute('content')).toBe(
      canonical,
    )
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toBeTruthy()
  })

  it('makes a 404 noindex, follow without canonical, hreflang or valid-page URL claims', () => {
    localeState.current = 'de'
    const document = renderHead('/does-not-exist', { notFound: true })

    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    )
    expect(document.querySelector('meta[name="googlebot"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    )
    expect(
      document.querySelector('meta[name="prerender-status-code"]')?.getAttribute('content'),
    ).toBe('404')
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(0)
    expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(0)
    expect(document.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(0)
    expect(document.querySelectorAll('meta[property="og:url"]')).toHaveLength(0)
    expect(document.querySelectorAll('meta[name="twitter:url"]')).toHaveLength(0)
  })

  it('supports every explicit indexability state without contradictory robots output', () => {
    const expected = {
      INDEX_FOLLOW: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      NOINDEX_FOLLOW: 'noindex, follow',
      NOINDEX_NOFOLLOW: 'noindex, nofollow',
      REDIRECT_SOURCE: 'noindex, nofollow',
      NON_PUBLIC: 'noindex, nofollow',
    } as const

    for (const [indexability, robots] of Object.entries(expected)) {
      const document = renderHead('/state', {
        indexability: indexability as keyof typeof expected,
      })
      expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1)
      expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(robots)
      expect(document.querySelectorAll('meta[name="googlebot"]')).toHaveLength(1)
      expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(
        indexability === 'INDEX_FOLLOW' ? 11 : 0,
      )
      expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(
        indexability === 'REDIRECT_SOURCE' || indexability === 'NON_PUBLIC' ? 0 : 1,
      )
    }
  })

  it('accepts public overrides and rejects preview/dev hosts and query canonicals', () => {
    expect(resolveCanonicalUrl('/de/override', 'de', '/fallback')).toBe(
      `${PUBLIC_SEO_ORIGIN}/de/override`,
    )
    expect(resolveCanonicalUrl(`${PUBLIC_SEO_ORIGIN}/fr/override`, 'fr', '/fallback')).toBe(
      `${PUBLIC_SEO_ORIGIN}/fr/override`,
    )
    expect(() =>
      resolveCanonicalUrl('https://preview.polarisdx.net/de/override', 'de', '/fallback'),
    ).toThrow(PUBLIC_SEO_ORIGIN)
    expect(() =>
      resolveCanonicalUrl('http://localhost:5173/de/override', 'de', '/fallback'),
    ).toThrow(PUBLIC_SEO_ORIGIN)
    expect(() => resolveCanonicalUrl('/de/override?preview=1', 'de', '/fallback')).toThrow(
      'query string',
    )

    expect(() =>
      renderHead('/image-guard', { ogImage: 'https://preview.polarisdx.net/og-image.jpg' }),
    ).toThrow(PUBLIC_SEO_ORIGIN)
  })

  it('keeps the adapter path-list free while supporting an evidence-limited locale set', () => {
    expect(hreflangUrls('/published', ['de', 'fr'])).toEqual([
      { locale: 'de', url: publicSeoUrl('de', '/published') },
      { locale: 'fr', url: publicSeoUrl('fr', '/published') },
    ])

    localeState.current = 'fr'
    const document = renderHead('/published', { alternateLocales: ['de', 'fr'] })
    expect(document.querySelectorAll('link[rel="alternate"]')).toHaveLength(3)
    expect(document.querySelector('link[hreflang="en"]')).toBeNull()
    expect(document.querySelectorAll('meta[property="og:locale:alternate"]')).toHaveLength(1)
    expect(() => renderHead('/invalid', { alternateLocales: ['de', 'en'] })).toThrow(
      'current locale',
    )
  })
})
