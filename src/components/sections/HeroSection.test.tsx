import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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

    // Kein Slider mehr (SC-020 → SC-021): keine Bedienung, keine Karussell-Semantik.
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('[aria-roledescription]')).toBeNull()
  })
})
