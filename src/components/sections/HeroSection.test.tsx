import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
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

  it('uses one decorative eager stage photo and one lazy product image; the carousel loads only after the first paint', () => {
    const { container } = renderHero()

    // AP34 / SC-002: the art-directed Editorial photo is the only eager,
    // high-priority image; it is decorative and dimensioned.
    const eager = container.querySelectorAll('img[loading="eager"]')
    expect(eager).toHaveLength(1)
    const photo = eager[0]
    expect(photo).toHaveAttribute('alt', '')
    expect(photo).toHaveAttribute('fetchpriority', 'high')
    expect(photo).toHaveAttribute('width', '800')
    expect(photo).toHaveAttribute('height', '1800')
    expect(photo.closest('picture')).toHaveAttribute('data-home-hero-photo')
    expect(container.querySelectorAll('[fetchpriority="high"]')).toHaveLength(1)

    const visual = screen.getByRole('img', { name: 'hero.visual_alt' })
    expect(visual).toHaveAttribute('width', '320')
    expect(visual).toHaveAttribute('height', '320')
    expect(visual).toHaveAttribute('loading', 'lazy')
    expect(visual).not.toHaveAttribute('fetchpriority')
    // SC-020: das SSR-Markup traegt keine Bedienung und keine Karussell-Semantik — beides
    // kommt erst im Browser nach HERO_SLIDES_DELAY_MS als eigener Chunk (HeroSlides).
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('[aria-roledescription="carousel"]')).toBeNull()
    expect(container.querySelector('[data-hero-slide="main"]')).not.toHaveAttribute('aria-hidden')
  })

  it('adds slides and controls after the delay without touching the H1 (SC-020)', async () => {
    vi.useFakeTimers({
      toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
    })
    vi.setSystemTime(new Date('2026-10-28T12:00:00+01:00'))
    try {
      const { container } = renderHero()
      await act(async () => {
        vi.advanceTimersByTime(1600)
      })
      vi.useRealTimers()
      await screen.findByRole('button', { name: 'hero_slides.next' })
      expect(container.querySelector('[aria-roledescription="carousel"]')).not.toBeNull()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
      // Nur die aktive Folie steht im DOM; auf Folie 1 also keine Themenfolie.
      expect(container.querySelectorAll('[aria-roledescription="slide"]')).toHaveLength(0)
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(screen.getByRole('button', { name: 'hero_slides.pause' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      // Folie 2 (Termin): Folie 1 bleibt fuer Hoehe und H1 im DOM, aber unsichtbar und inert.
      await act(async () => {
        screen.getByRole('button', { name: 'hero_slides.next' }).click()
      })
      const main = container.querySelector('[data-hero-slide="main"]')
      expect(main).toHaveAttribute('aria-hidden', 'true')
      expect(main).toHaveAttribute('inert')
      expect(container.querySelectorAll('[aria-roledescription="slide"]')).toHaveLength(1)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'events:items.medica_2026.title',
      )
      expect(container.querySelectorAll('h1')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
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
