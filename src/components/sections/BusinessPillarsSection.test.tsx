import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { resolveCanonicalRoute } from '../../routing'
import BusinessPillarsSection from './BusinessPillarsSection'

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    business_pillars: {
      eyebrow: string
      title: string
      intro: string
      pillars: Record<string, { title: string; text: string; cta: string }>
      core: { eyebrow: string; title: string; intro: string }
    }
  }
>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const renderSection = () =>
  render(
    <MemoryRouter>
      <BusinessPillarsSection />
    </MemoryRouter>,
  )

describe('PT11.3 Homepage business pillar contract', () => {
  it('renders Diagnostics, IglooPro and Epigenetics as three equal registry-backed pillars', () => {
    renderSection()

    const section = screen.getByRole('region', { name: 'business_pillars.title' })
    const pillars = section.querySelectorAll('[data-business-pillar]')
    expect(pillars).toHaveLength(3)

    const expected = {
      diagnostics: { routeId: 'diagnostics', href: '/diagnostics' },
      igloo: { routeId: 'igloo-pro', href: '/igloo-pro' },
      epigenetics: { routeId: 'epigenetics', href: '/epigenetics' },
    }

    for (const [pillarId, target] of Object.entries(expected)) {
      const pillar = section.querySelector(`[data-business-pillar="${pillarId}"]`)
      expect(pillar).toHaveAttribute('href', target.href)
      expect(pillar).toHaveAttribute('data-route-id', target.routeId)
      expect(resolveCanonicalRoute(target.href)?.id).toBe(target.routeId)
      expect(within(pillar as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
        `business_pillars.pillars.${pillarId}.title`,
      )
    }
  })

  it('prioritizes three real service-source routes without legacy service links', () => {
    renderSection()

    const expected = {
      dental: '/diagnostics/dental',
      beauty: '/diagnostics/beauty',
      longevity: '/diagnostics/longevity',
    }

    for (const [sourceId, href] of Object.entries(expected)) {
      const link = document.querySelector(`[data-core-service="${sourceId}"]`)
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('data-route-id', `service-detail:${sourceId}`)
      expect(resolveCanonicalRoute(href)?.sourceId).toBe(sourceId)
    }

    expect(document.querySelector('a[href^="/services"]')).not.toBeInTheDocument()
  })

  it('keeps every card keyboard-focusable with no nested controls', () => {
    renderSection()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)
    for (const link of links) {
      link.focus()
      expect(link).toHaveFocus()
      expect(within(link).queryByRole('link')).not.toBeInTheDocument()
      expect(within(link).queryByRole('button')).not.toBeInTheDocument()
    }
  })

  it('provides complete, non-key copy for exactly ten project locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/home.json`]?.business_pillars
      expect(resource, `missing ${locale}.business_pillars`).toBeDefined()

      const values = [
        resource.eyebrow,
        resource.title,
        resource.intro,
        resource.core.eyebrow,
        resource.core.title,
        resource.core.intro,
        ...Object.values(resource.pillars).flatMap(({ title, text, cta }) => [title, text, cta]),
      ]
      expect(Object.keys(resource.pillars)).toEqual(['diagnostics', 'igloo', 'epigenetics'])
      for (const value of values) {
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/^(business_pillars|segments)\./)
      }
    }
  })
})
