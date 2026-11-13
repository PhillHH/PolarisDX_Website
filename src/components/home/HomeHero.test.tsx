import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomeHero from './HomeHero'

const renderHero = () =>
  render(
    <MemoryRouter>
      <HomeHero />
    </MemoryRouter>,
  )

describe('SC-025 Lichtfilm homepage hero', () => {
  it('keeps the complete H1 in the accessibility tree and one real info-call target', () => {
    renderHero()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('hero.title')

    const action = screen.getByRole('link', { name: 'hero.cta_secondary' })
    expect(action).toHaveAttribute('href', '/contact')
    expect(action).toHaveAttribute('data-home-hero-cta')
    expect(action).not.toHaveAttribute('data-cta-intent')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('renders three device views, starts in the first phase and prioritises only the first image', () => {
    const { container } = renderHero()
    const hero = container.querySelector('[data-home-hero]')
    expect(hero).toHaveAttribute('data-phase', '0')
    const images = container.querySelectorAll('[data-home-film-views] img')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveClass('is-on')
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[1]).toHaveAttribute('loading', 'lazy')
    expect(images[2]).toHaveAttribute('loading', 'lazy')
    expect(container.querySelectorAll('[data-home-film-phases] > div')).toHaveLength(3)
    expect(container.querySelector('.sc025-film-beam')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the 3D stage as a decorative canvas and stays on the images where WebGL is missing', () => {
    const { container } = renderHero()
    const canvas = container.querySelector('[data-home-film-gl]')
    expect(canvas?.tagName).toBe('CANVAS')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-home-hero]')).not.toHaveAttribute('data-gl')
    expect(container.querySelector('[data-home-film-views] img')).toHaveAttribute(
      'alt',
      'business_pillars.pillars.igloo.title',
    )
  })
})
