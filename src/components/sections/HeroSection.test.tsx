import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HeroSection from './HeroSection'

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<string, { hero: Record<string, unknown> }>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  )

describe('Homepage Hero contract', () => {
  it('renders one stable H1 and two distinct, real route intents', () => {
    renderHero()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    const primary = screen.getByRole('link', { name: 'hero.cta' })
    expect(primary).toHaveAttribute(
      'href',
      '/contact?intent=quote&source=homepage&journey=general_sales&section=hero#kontaktformular',
    )
    expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
    expect(primary).toHaveAttribute('data-cta-source', 'homepage')
    expect(primary).toHaveAttribute('data-cta-journey', 'general_sales')
    expect(primary).toHaveAttribute('data-cta-section', 'hero')

    const secondary = screen.getByRole('link', { name: 'hero.cta_secondary' })
    expect(secondary).toHaveAttribute('href', '/diagnostics')
    expect(secondary).not.toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
  })

  it('keeps content and calls to action before the visual in DOM order', () => {
    renderHero()

    const heading = screen.getByRole('heading', { level: 1 })
    const primary = screen.getByRole('link', { name: 'hero.cta' })
    const secondary = screen.getByRole('link', { name: 'hero.cta_secondary' })
    const visual = screen.getByRole('img', { name: 'hero.visual_alt' })

    expect(heading.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      primary.compareDocumentPosition(secondary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      secondary.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('uses one dimensioned eager image and no carousel controls', () => {
    renderHero()

    const visual = screen.getByRole('img', { name: 'hero.visual_alt' })
    expect(visual).toHaveAttribute('width', '650')
    expect(visual).toHaveAttribute('height', '650')
    expect(visual).toHaveAttribute('loading', 'eager')
    expect(visual).toHaveAttribute('fetchpriority', 'high')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /carousel/i })).not.toBeInTheDocument()
  })

  it('provides keyboard-focusable actions', () => {
    renderHero()

    const primary = screen.getByRole('link', { name: 'hero.cta' })
    const secondary = screen.getByRole('link', { name: 'hero.cta_secondary' })
    primary.focus()
    expect(primary).toHaveFocus()
    secondary.focus()
    expect(secondary).toHaveFocus()
  })

  it('has complete localized Hero copy for exactly ten project locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/home.json`]
      expect(resource, `missing ${locale} home resource`).toBeDefined()
      for (const key of ['caption', 'title', 'description', 'cta', 'cta_secondary', 'visual_alt']) {
        const value = resource.hero[key]
        expect(typeof value, `${locale}.hero.${key}`).toBe('string')
        expect(String(value).trim().length, `${locale}.hero.${key}`).toBeGreaterThan(0)
        expect(String(value), `${locale}.hero.${key}`).not.toMatch(/^[a-z0-9_.-]+$/i)
      }
    }

    expect(localeModules['/public/locales/de/home.json'].hero.cta).toBe('Angebot anfragen')
  })
})
