import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import BlogSection from './BlogSection'
import FinalCtaSection from './FinalCtaSection'
import RoiCalculatorSection from './RoiCalculatorSection'

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    hero: { cta: string }
    roi: { cta_consult: string }
    final_cta: {
      subtitle: string
      cta_primary: string
      cta_secondary: string
      chips: Record<string, string>
    }
  }
>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>)
}

describe('Homepage conversion contract', () => {
  it('uses the same explicit GENERAL_SALES contract in context and final actions', () => {
    renderInRouter(
      <>
        <RoiCalculatorSection />
        <FinalCtaSection homepageSalesSection="final_cta" />
      </>,
    )

    const context = screen.getByRole('link', { name: 'roi.cta_consult' })
    const final = screen.getByRole('link', { name: 'final_cta.cta_primary' })

    expect(context).toHaveAttribute(
      'href',
      '/contact?intent=quote&source=homepage&journey=general_sales&section=roi#kontaktformular',
    )
    expect(final).toHaveAttribute(
      'href',
      '/contact?intent=quote&source=homepage&journey=general_sales&section=final_cta#kontaktformular',
    )
    for (const [action, section] of [
      [context, 'roi'],
      [final, 'final_cta'],
    ] as const) {
      expect(action).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
      expect(action).toHaveAttribute('data-cta-source', 'homepage')
      expect(action).toHaveAttribute('data-cta-journey', 'general_sales')
      expect(action).toHaveAttribute('data-cta-section', section)
    }
  })

  it('keeps the real ROI report flow consent-gated and exposes a real knowledge entry', () => {
    const { unmount } = renderInRouter(<RoiCalculatorSection />)
    fireEvent.click(screen.getByRole('button', { name: 'roi.cta_report' }))
    expect(screen.getByRole('textbox', { name: 'roi.form.email' })).toBeRequired()
    expect(screen.getByRole('checkbox')).toBeRequired()
    expect(screen.getByRole('link', { name: 'roi.form.privacy' })).toHaveAttribute(
      'href',
      '/privacy',
    )
    expect(screen.getByRole('button', { name: 'roi.form.submit' })).toHaveAttribute(
      'type',
      'submit',
    )
    unmount()

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
      expect(resource.hero.cta).toBe(resource.roi.cta_consult)
      expect(resource.hero.cta).toBe(resource.final_cta.cta_primary)
      expect(resource.final_cta.cta_secondary.trim().length).toBeGreaterThan(0)
      expect(resource.final_cta.subtitle.trim().length).toBeGreaterThan(0)
      expect(Object.values(resource.final_cta.chips)).toHaveLength(3)
      expect(
        Object.values(resource.final_cta.chips).every((value) => value.trim().length > 0),
      ).toBe(true)
    }

    expect(localeModules['/public/locales/de/home.json'].hero.cta).toBe('Angebot anfragen')
    expect(JSON.stringify(localeModules['/public/locales/de/home.json'].final_cta)).not.toMatch(
      /<\s*24|3\s*[–-]\s*5\s*Werktage|garant/i,
    )
  })
})
