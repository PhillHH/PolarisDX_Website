import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import BlogSection from './BlogSection'
import FinalCtaSection from './FinalCtaSection'

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    hero: { cta_secondary: string }
    final_cta: {
      subtitle: string
      cta_primary: string
      chips: Record<string, string>
    }
  }
>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>)
}

describe('Homepage conversion contract', () => {
  it('uses the explicit GENERAL_SALES contract in the final action (SC-023: no ROI context)', () => {
    renderInRouter(<FinalCtaSection homepageSalesSection="final_cta" />)

    const final = screen.getByRole('link', { name: 'final_cta.cta_primary' })
    expect(final).toHaveAttribute(
      'href',
      '/contact?intent=quote&source=homepage&journey=general_sales&section=final_cta#kontaktformular',
    )
    expect(final).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
    expect(final).toHaveAttribute('data-cta-source', 'homepage')
    expect(final).toHaveAttribute('data-cta-journey', 'general_sales')
    expect(final).toHaveAttribute('data-cta-section', 'final_cta')
    // Owner 2026-11-03: kein ROI-Rechner mehr — auch kein zweiter Knopf im Schluss-CTA.
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.queryByRole('link', { name: 'final_cta.cta_secondary' })).toBeNull()
  })

  it('exposes a real knowledge entry as secondary conversion', () => {
    renderInRouter(<BlogSection />)
    const knowledge = screen.getByRole('link', { name: /blog\.all_articles/ })
    expect(knowledge).toHaveAttribute('href', '/articles')
    expect(knowledge).toHaveAttribute('data-home-secondary-conversion', 'knowledge')
    expect(screen.getAllByRole('article')).toHaveLength(3)
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/^\/services(?:\/|$)/)
    }
  })

  it('provides x10 natural primary CTA parity and claim-safe final copy', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/home.json`]
      expect(resource.hero.cta_secondary.trim().length).toBeGreaterThan(0)
      expect(resource.final_cta.cta_primary.trim().length).toBeGreaterThan(0)
      expect(resource.final_cta.subtitle.trim().length).toBeGreaterThan(0)
      expect(Object.values(resource.final_cta.chips)).toHaveLength(3)
      expect(
        Object.values(resource.final_cta.chips).every((value) => value.trim().length > 0),
      ).toBe(true)
    }

    expect(localeModules['/public/locales/de/home.json'].hero.cta_secondary).toBe(
      'Infotermin buchen',
    )
    expect(JSON.stringify(localeModules['/public/locales/de/home.json'].final_cta)).not.toMatch(
      /<\s*24|3\s*[–-]\s*5\s*Werktage|garant/i,
    )
  })
})
