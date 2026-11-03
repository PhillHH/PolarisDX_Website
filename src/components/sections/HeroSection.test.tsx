import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import HeroSection from './HeroSection'

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  )

/**
 * Startseiten-Bühne (SC-021, Entwurf 13A-4): statisch, SSR-first, ohne Slider.
 * `src/test/setup.ts` mockt `react-i18next` so, dass `t(key)` den Key zurückgibt.
 */
describe('Homepage Hero contract', () => {
  it('renders one stable H1 and two distinct, real route intents', () => {
    renderHero()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('hero.title')

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
    expect(secondary).toHaveAttribute('href', '/contact')
    expect(secondary).not.toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
  })

  it('keeps caption, headline, sentence and both actions before the photo in DOM order', () => {
    const { container } = renderHero()

    const heading = screen.getByRole('heading', { level: 1 })
    const primary = screen.getByRole('link', { name: 'hero.cta' })
    const secondary = screen.getByRole('link', { name: 'hero.cta_secondary' })
    const visual = container.querySelector('[data-home-hero-visual]')!

    expect(screen.getByText('hero.caption').compareDocumentPosition(heading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(heading.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(
      primary.compareDocumentPosition(secondary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      secondary.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('uses exactly one decorative, eager, dimensioned photo card and no carousel', () => {
    const { container } = renderHero()

    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(1)
    const photo = images[0]
    expect(photo).toHaveAttribute('alt', '')
    expect(photo).toHaveAttribute('loading', 'eager')
    expect(photo).toHaveAttribute('fetchpriority', 'high')
    expect(photo).toHaveAttribute('width', '1280')
    expect(photo).toHaveAttribute('height', '800')
    expect(photo).toHaveAttribute('sizes')
    expect(photo.closest('picture')).toHaveAttribute('data-home-hero-photo')
    expect(photo.closest('picture')!.querySelectorAll('source')).toHaveLength(1)
    expect(container.querySelectorAll('[fetchpriority="high"]')).toHaveLength(1)

    // Das SSR-Markup traegt keine Slider-Bedienung und keine Karussell-Semantik — beides kommt
    // erst im Browser nach HERO_SLIDES_DELAY_MS als eigener Chunk (HeroSlides). Die drei Schritte
    // der Diashow stehen statisch (Schritt 1 aktiv).
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('[data-home-hero-steps]')).toBeNull()
    expect(container.querySelector('[aria-roledescription]')).toBeNull()
    expect(container.querySelector('[data-hero-slide="main"]')).not.toHaveAttribute('aria-hidden')
  })

  it('adds slides and controls after the delay without touching the H1 (SC-021 slider)', async () => {
    vi.useFakeTimers({
      toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
    })
    vi.setSystemTime(new Date('2026-11-02T12:00:00+01:00'))
    try {
      const { container } = renderHero()
      await act(async () => {
        vi.advanceTimersByTime(1600)
      })
      vi.useRealTimers()
      await screen.findByRole('button', { name: 'hero_slides.next' })
      expect(container.querySelector('[aria-roledescription="carousel"]')).not.toBeNull()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
      expect(container.querySelectorAll('[aria-roledescription="slide"]')).toHaveLength(0)
      // Zeitleiste der Diashow kommt mit dem Chunk; Schritt 1 ist aktiv.
      expect(container.querySelectorAll('[data-home-hero-steps] button')).toHaveLength(3)
      expect(
        container.querySelector('[data-home-hero-steps] [aria-current="step"]'),
      ).toHaveTextContent('01')
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      // Folie 2 (Termin mit Navy-Kachel): Folie 1 bleibt fuer Hoehe und H1 im DOM, aber unsichtbar und inert.
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
      // Countdown der Kachel (Tageszahl haengt vom echten Datum ab — nach useRealTimers).
      expect(screen.getByText('common:event_band.days_label')).toBeInTheDocument()
      expect(container.querySelectorAll('h1')).toHaveLength(1)
      // Diashow in Folie 1: Bild 2/3 sind nachgeladen (lazy) und nur eines sichtbar.
      expect(container.querySelectorAll('[data-home-hero-visual] img')).toHaveLength(3)
      expect(
        container.querySelectorAll('[data-home-hero-visual] img[loading="lazy"]'),
      ).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })
})
