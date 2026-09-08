import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { diagnosticsGeneralSalesTarget } from '../../data/diagnosticsHub'
import DiagnosticsHero from './DiagnosticsHero'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

type HeroEntry = {
  breadcrumb_label: string
  eyebrow: string
  title: string
  description: string
  primary_cta: string
  secondary_cta: string
  trust_label: string
  trust: { services: string; audience: string; context: string }
  visual: { eyebrow: string; title: string; text: string; alt: string }
}

const localeModules = import.meta.glob('/public/locales/*/services.json', {
  eager: true,
  import: 'default',
}) as Record<string, { overview: { hero: { entry: HeroEntry } } }>

const renderHero = () =>
  render(
    <MemoryRouter>
      <DiagnosticsHero />
    </MemoryRouter>,
  )

describe('PT12.2 Diagnostics Hero contract', () => {
  it('renders one H1, a registry-backed GENERAL_SALES action and a distinct service entry', () => {
    renderHero()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    const primary = screen.getByRole('link', {
      name: 'services:overview.hero.entry.primary_cta',
    })
    expect(primary).toHaveAttribute('href', diagnosticsGeneralSalesTarget)
    expect(primary).toHaveAttribute('href', '/contact?intent=quote#kontaktformular')
    expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
    expect(primary).toHaveAttribute('data-cta-source', 'diagnostics')
    expect(primary).toHaveAttribute('data-cta-journey', 'general_sales')

    const secondary = screen.getByRole('link', {
      name: 'services:overview.hero.entry.secondary_cta',
    })
    expect(secondary).toHaveAttribute('href', '#diagnostics-services')
    expect(secondary).not.toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
  })

  it('keeps the text, actions and factual trust context before the visual in DOM order', () => {
    renderHero()

    const heading = screen.getByRole('heading', { level: 1 })
    const primary = screen.getByRole('link', {
      name: 'services:overview.hero.entry.primary_cta',
    })
    const trust = screen.getByLabelText('services:overview.hero.entry.trust_label')
    const visual = screen.getByRole('figure')

    expect(heading.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(primary.compareDocumentPosition(trust) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(trust.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(trust.querySelectorAll('li')).toHaveLength(3)
  })

  it('uses one real dimensioned eager visual without carousel or direct interaction', () => {
    renderHero()

    const image = screen.getByRole('img', { name: 'services:overview.hero.entry.visual.alt' })
    expect(image).toHaveAttribute('width', '650')
    expect(image).toHaveAttribute('height', '650')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('fetchpriority', 'high')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /carousel/i })).not.toBeInTheDocument()
  })

  it('keeps both actions keyboard-focusable', () => {
    renderHero()

    const links = screen.getAllByRole('link')
    for (const link of links) {
      link.focus()
      expect(link).toHaveFocus()
    }
  })

  it('provides complete claim-safe entry copy for exactly ten project locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const entry = localeModules[`/public/locales/${locale}/services.json`]?.overview.hero.entry
      expect(entry, `missing ${locale}.overview.hero.entry`).toBeDefined()

      const values = [
        entry.breadcrumb_label,
        entry.eyebrow,
        entry.title,
        entry.description,
        entry.primary_cta,
        entry.secondary_cta,
        entry.trust_label,
        ...Object.values(entry.trust),
        ...Object.values(entry.visual),
      ]
      for (const value of values) {
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/^overview\.hero\.entry\./)
      }

      const visibleCopy = JSON.stringify(entry)
      expect(visibleCopy).not.toMatch(/90\s*%|3\s*(min|Min)|34\s*ng|2:47/i)
      expect(visibleCopy).not.toMatch(/garant|guarante|garantier|gewinn|profit|umsatz/i)
    }

    expect(localeModules['/public/locales/de/services.json'].overview.hero.entry.primary_cta).toBe(
      'Angebot anfragen',
    )
  })
})
