import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import diagnosticsContract from '../../building-docs/DIAGNOSTICS-HUB-CONTRACT.md?raw'
import DiagnosticsFocusSection from '../components/sections/DiagnosticsFocusSection'
import DiagnosticsLandscapeSection from '../components/sections/DiagnosticsLandscapeSection'
import DiagnosticsSpecialtySection from '../components/sections/DiagnosticsSpecialtySection'
import DiagnosticsUseCasesSection from '../components/sections/DiagnosticsUseCasesSection'
import DiagnosticsRelatedArticlesSection from '../components/sections/DiagnosticsRelatedArticlesSection'
import { articles } from './articles'
import { services } from './services'
import {
  diagnosticsContextTargets,
  diagnosticsFocusAreas,
  diagnosticsHubServices,
  diagnosticsRelatedArticles,
  getDiagnosticsHubServices,
} from './diagnosticsHub'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const localeModules = import.meta.glob('/public/locales/*/services.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    overview: {
      focus: { eyebrow: string; title: string; intro: string }
      related: { eyebrow: string; title: string; intro: string; all_articles: string }
      ia: {
        eyebrow: string
        title: string
        intro: string
        poc: { title: string; text: string }
        extended: { title: string; text: string }
        term: { label: string; text: string }
        priority_label: string
        card_cta: string
        groups: Record<string, { eyebrow: string; title: string; text: string }>
        cards: Record<string, string>
      }
    }
    seo: { overview_title: string; overview_description: string; overview_image_alt: string }
  }
>

const homeLocaleModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    services: Record<string, { title: string }>
    business_pillars: {
      pillars: Record<string, { title: string; text: string; cta: string }>
    }
  }
>

describe('PT12.1 Diagnostics Hub information architecture', () => {
  it('projects exactly nine unique service families onto real canonical Registry routes', () => {
    expect(services).toHaveLength(9)
    expect(diagnosticsHubServices).toHaveLength(9)
    expect(new Set(services.map(({ id }) => id))).toHaveLength(9)

    for (const { service, route } of diagnosticsHubServices) {
      expect(route.familyId).toBe('service-detail')
      expect(route.sourceId).toBe(service.id)
      expect(route.path).toBe(`/diagnostics/${service.id}`)
      expect(route.path).not.toMatch(/^\/services(?:\/|$)/)
      expect(route.localeBehavior).toBe('LOCALIZED_X10')
    }
  })

  it('uses the evidence-backed 3 + 6 grouping and priority set', () => {
    const practice = getDiagnosticsHubServices('PRACTICE_CONTEXT')
    const workflow = getDiagnosticsHubServices('DIAGNOSTIC_WORKFLOW')

    expect(practice.map(({ service }) => service.id)).toEqual(['dental', 'beauty', 'longevity'])
    expect(workflow).toHaveLength(6)
    expect(practice.every(({ service }) => service.hubPriority === 'PRIMARY')).toBe(true)
    expect(workflow.every(({ service }) => service.hubPriority === 'STANDARD')).toBe(true)
    expect(services.every(({ specialtyTags }) => specialtyTags.length > 0)).toBe(true)
  })

  it('renders the orientation and every service as one semantic canonical link', () => {
    const { container } = render(
      <MemoryRouter>
        <DiagnosticsLandscapeSection />
        <DiagnosticsSpecialtySection />
        <DiagnosticsFocusSection />
      </MemoryRouter>,
    )

    expect(container.querySelector('[data-diagnostics-landscape]')).toBeInTheDocument()
    const links = [...container.querySelectorAll<HTMLAnchorElement>('[data-diagnostics-service]')]
    expect(links).toHaveLength(9)
    expect(new Set(links.map((link) => link.dataset.diagnosticsService))).toHaveLength(9)
    expect(links.filter((link) => link.dataset.hubPriority === 'PRIMARY')).toHaveLength(3)
    expect(links.some((link) => link.getAttribute('href')?.startsWith('/services'))).toBe(false)
  })

  it('provides complete PT12.1 information and teaser copy in exactly ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)
    const expectedCardKeys = services.map(({ translationKey }) => translationKey).sort()

    for (const locale of locales) {
      const ia = localeModules[`/public/locales/${locale}/services.json`]?.overview.ia
      expect(ia, `missing ${locale}.overview.ia`).toBeDefined()
      expect(Object.keys(ia.cards).sort()).toEqual(expectedCardKeys)
      expect(Object.keys(ia.groups).sort()).toEqual(['practice', 'workflow'])

      const values = [
        ia.eyebrow,
        ia.title,
        ia.intro,
        ia.poc.title,
        ia.poc.text,
        ia.extended.title,
        ia.extended.text,
        ia.term.label,
        ia.term.text,
        ia.priority_label,
        ia.card_cta,
        ...Object.values(ia.groups).flatMap(({ eyebrow, title, text }) => [eyebrow, title, text]),
        ...Object.values(ia.cards),
      ]
      for (const value of values) {
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/^overview\.ia\./)
      }
    }
  })

  it('keeps the evidence contract consistent with every source ID and canonical path', () => {
    expect(diagnosticsContract.match(/^\| DX-\d{2} /gm)).toHaveLength(9)
    for (const { service, route } of diagnosticsHubServices) {
      expect(
        diagnosticsContract.match(new RegExp('`' + service.id + '`', 'g'))?.length,
      ).toBeGreaterThan(0)
      expect(diagnosticsContract).toContain('`' + route.path + '`')
    }
    expect(diagnosticsContract).toContain('Hub legacy `/services/*` targets: 0')
    expect(diagnosticsContract).toContain('AP13 remains owner')
  })
})

describe('PT12.3 Diagnostics Hub service cards', () => {
  it('renders all nine entries through one consistent semantic card and grid contract', () => {
    const { container } = render(
      <MemoryRouter>
        <DiagnosticsSpecialtySection />
        <DiagnosticsFocusSection />
      </MemoryRouter>,
    )

    const grids = [...container.querySelectorAll<HTMLElement>('[data-diagnostics-card-grid]')]
    const cards = [...container.querySelectorAll<HTMLAnchorElement>('[data-diagnostics-card]')]

    expect(grids).toHaveLength(2)
    expect(grids.map((grid) => grid.className)).toEqual([
      expect.stringContaining('md:grid-cols-2 lg:grid-cols-3'),
      expect.stringContaining('md:grid-cols-2 lg:grid-cols-3'),
    ])
    expect(cards).toHaveLength(9)
    expect(new Set(cards.map((card) => card.dataset.diagnosticsService))).toHaveLength(9)
    expect(new Set(cards.map((card) => card.getAttribute('href')))).toHaveLength(9)

    for (const card of cards) {
      expect(card).toHaveClass('min-h-[280px]', 'border-t-4', 'focus-visible:ring-2')
      expect(card).toHaveAttribute('aria-label', expect.stringMatching(/.+: .+/))
      expect(card.querySelectorAll('a, button, input, select, textarea')).toHaveLength(0)
      expect(card.querySelectorAll('h3')).toHaveLength(1)
      expect(card.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument()
    }
  })

  it('keeps every card target Registry-backed, unique, canonical and free of legacy paths', () => {
    const { container } = render(
      <MemoryRouter>
        <DiagnosticsSpecialtySection />
        <DiagnosticsFocusSection />
      </MemoryRouter>,
    )
    const cards = [...container.querySelectorAll<HTMLAnchorElement>('[data-diagnostics-card]')]

    expect(cards.map((card) => card.getAttribute('href'))).toEqual(
      diagnosticsHubServices.map(({ route }) => route.path),
    )
    expect(cards.every((card) => !card.getAttribute('href')?.includes('/services'))).toBe(true)
    expect(cards.filter((card) => card.dataset.hubPriority === 'PRIMARY')).toHaveLength(3)
    expect(cards.filter((card) => card.dataset.hubPriority === 'STANDARD')).toHaveLength(6)
  })

  it('provides balanced titles, teasers, categories and CTA labels in exactly ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)
    expect(Object.keys(homeLocaleModules)).toHaveLength(10)

    for (const locale of locales) {
      const ia = localeModules[`/public/locales/${locale}/services.json`]?.overview.ia
      const homeServices = homeLocaleModules[`/public/locales/${locale}/home.json`]?.services

      expect(ia.card_cta.trim().length).toBeGreaterThan(0)
      expect(ia.groups.practice.eyebrow.trim().length).toBeGreaterThan(0)
      expect(ia.groups.workflow.eyebrow.trim().length).toBeGreaterThan(0)

      for (const service of services) {
        const title = homeServices[service.translationKey]?.title
        const teaser = ia.cards[service.translationKey]
        expect(title?.trim().length, `${locale}:${service.id} title`).toBeGreaterThan(0)
        expect(teaser?.trim().length, `${locale}:${service.id} teaser`).toBeGreaterThanOrEqual(50)
        expect(teaser?.trim().length, `${locale}:${service.id} teaser`).toBeLessThanOrEqual(180)
        expect(`${title}${teaser}`).not.toMatch(/(?:^|\s)(?:home|services):[\w.-]+/)
      }
    }
  })
})

describe('PT12.4 Diagnostics Hub focus and boundary paths', () => {
  it('maps exactly six required focus areas onto tagged canonical service entries', () => {
    expect(diagnosticsFocusAreas.map(({ id }) => id)).toEqual([
      'dental',
      'beauty',
      'longevity',
      'prevention',
      'system-solutions',
      'integration',
    ])
    expect(diagnosticsFocusAreas.map(({ entry }) => entry.service.id)).toEqual([
      'dental',
      'beauty',
      'longevity',
      'praeventions-checks',
      'poc-systemloesungen',
      'kompatibilitaet-integration',
    ])

    for (const { entry, requiredTag } of diagnosticsFocusAreas) {
      expect(entry.service.specialtyTags).toContain(requiredTag)
      expect(entry.route.familyId).toBe('service-detail')
      expect(entry.route.path).toBe(`/diagnostics/${entry.service.id}`)
    }
  })

  it('renders six semantic focus blocks and two independent Registry-backed boundaries', () => {
    const { container } = render(
      <MemoryRouter>
        <DiagnosticsUseCasesSection />
      </MemoryRouter>,
    )

    const areas = [...container.querySelectorAll<HTMLElement>('[data-diagnostics-focus-area]')]
    const focusLinks = [...container.querySelectorAll<HTMLAnchorElement>('[data-focus-link]')]
    expect(areas).toHaveLength(6)
    expect(focusLinks).toHaveLength(6)
    expect(focusLinks.map((link) => link.getAttribute('href'))).toEqual(
      diagnosticsFocusAreas.map(({ entry }) => entry.route.path),
    )
    expect(areas.every((area) => area.querySelectorAll('h3').length === 1)).toBe(true)
    expect(focusLinks.every((link) => link.className.includes('focus-visible:ring-2'))).toBe(true)
    expect(focusLinks.some((link) => link.getAttribute('href')?.includes('/services'))).toBe(false)

    const igloo = container.querySelector<HTMLAnchorElement>('[data-context-link="igloo"]')
    const epigenetics = container.querySelector<HTMLAnchorElement>(
      '[data-context-link="epigenetics"]',
    )
    expect(igloo).toHaveAttribute('href', diagnosticsContextTargets.igloo.path)
    expect(igloo).toHaveAttribute('data-route-id', 'igloo-pro')
    expect(epigenetics).toHaveAttribute('href', diagnosticsContextTargets.epigenetics.path)
    expect(epigenetics).toHaveAttribute('data-route-id', 'epigenetics')
    expect(services.some(({ id }) => id === ('epigenetics' as string))).toBe(false)
  })

  it('provides focus headings and boundary copy in exactly ten locales without unsafe claims', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)
    expect(Object.keys(homeLocaleModules)).toHaveLength(10)

    for (const locale of locales) {
      const focus = localeModules[`/public/locales/${locale}/services.json`]?.overview.focus
      const pillars =
        homeLocaleModules[`/public/locales/${locale}/home.json`]?.business_pillars.pillars
      const values = [
        focus.eyebrow,
        focus.title,
        focus.intro,
        pillars.igloo.title,
        pillars.igloo.text,
        pillars.igloo.cta,
        pillars.epigenetics.title,
        pillars.epigenetics.text,
        pillars.epigenetics.cta,
      ]
      for (const value of values) {
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/(?:^|\s)(?:home|services):[\w.-]+/)
      }
      expect(values.slice(0, 3).join(' ')).not.toMatch(
        /guarantee|garant|heilversprechen|anti-aging|umsatz|gewinn|\d+\s*%/i,
      )
    }
  })
})

describe('PT12.5 Diagnostics Hub SEO and internal-link integration', () => {
  it('projects only real published articles onto canonical Registry targets', () => {
    expect(diagnosticsRelatedArticles.map(({ article }) => article.id)).toEqual([
      'green_practice',
      'invisible_patient',
      'ecosystem_of_rapid_tests',
    ])
    expect(new Set(diagnosticsRelatedArticles.map(({ route }) => route.path)).size).toBe(3)

    for (const { article, route } of diagnosticsRelatedArticles) {
      expect(articles).toContain(article)
      expect(article.relatedServiceIds?.length).toBeGreaterThan(0)
      expect(route.familyId).toBe('article-detail')
      expect(route.sourceId).toBe(article.id)
      expect(route.path).toBe(`/articles/${article.slug}`)
    }
    expect(diagnosticsContextTargets.articles.id).toBe('articles')
    expect(diagnosticsContextTargets.articles.path).toBe('/articles')
  })

  it('renders three lazy related-article cards and a separate knowledge-hub link', () => {
    const { container } = render(
      <MemoryRouter>
        <DiagnosticsRelatedArticlesSection />
      </MemoryRouter>,
    )

    const cards = container.querySelectorAll('[data-diagnostics-related-article]')
    const links = container.querySelectorAll<HTMLAnchorElement>('[data-related-article-link]')
    expect(cards).toHaveLength(3)
    expect(links).toHaveLength(3)
    expect([...links].map((link) => link.getAttribute('href'))).toEqual(
      diagnosticsRelatedArticles.map(({ route }) => route.path),
    )
    expect(container.querySelectorAll('img[loading="lazy"]')).toHaveLength(3)
    expect(container.querySelectorAll('h2')).toHaveLength(1)
    expect(container.querySelectorAll('h3')).toHaveLength(3)
    expect(container.querySelector('[data-diagnostics-knowledge-link]')).toHaveAttribute(
      'href',
      '/articles',
    )
  })

  it('provides Hub-specific SEO and related-content copy in exactly ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/services.json`]
      const values = [
        resource.seo.overview_title,
        resource.seo.overview_description,
        resource.seo.overview_image_alt,
        resource.overview.related.eyebrow,
        resource.overview.related.title,
        resource.overview.related.intro,
        resource.overview.related.all_articles,
      ]
      for (const value of values) {
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/(?:^|\s)(?:home|services):[\w.-]+/)
      }
      expect(resource.seo.overview_description).not.toMatch(
        /guarantee|garant|heil|umsatz|gewinn|results? in minutes|in wenigen minuten|\d+\s*%/i,
      )
    }

    expect(
      new Set(
        locales.map(
          (locale) => localeModules[`/public/locales/${locale}/services.json`].seo.overview_title,
        ),
      ).size,
    ).toBe(10)
  })
})
