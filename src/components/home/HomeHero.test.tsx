import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomeHero from './HomeHero'

const renderHero = () =>
  render(
    <MemoryRouter>
      <HomeHero />
    </MemoryRouter>,
  )

describe('SC-025 animated homepage hero', () => {
  it('keeps the complete H1 in the accessibility tree and one real info-call target', () => {
    const { container } = renderHero()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveAccessibleName('hero.title')
    expect(headings[0].querySelector('.sr-only')).toHaveTextContent('hero.title')
    expect(headings[0].querySelector('[aria-hidden="true"]')).not.toBeNull()

    const action = screen.getByRole('link', { name: 'hero.cta_secondary' })
    expect(action).toHaveAttribute('href', '/contact')
    expect(action).toHaveAttribute('data-home-hero-cta')
    expect(action).not.toHaveAttribute('data-cta-intent')
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(container.querySelectorAll('[data-home-hero-photo]')).toHaveLength(0)
  })

  it('offers progress dashes and a keyboard-operable pause/play control', () => {
    const { container } = renderHero()
    const pause = screen.getByRole('button', { name: 'sc025.hero.pause' })
    expect(container.querySelectorAll('.sc025-dashes i')).toHaveLength(
      container.querySelectorAll('.sc025-hero-words > span').length,
    )
    expect(pause).toHaveAttribute('aria-pressed', 'false')
    pause.focus()
    fireEvent.keyDown(pause, { key: 'Enter' })
    fireEvent.click(pause)
    expect(screen.getByRole('button', { name: 'sc025.hero.play' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(container.querySelector('[data-home-hero]')).toHaveAttribute('data-paused', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'sc025.hero.play' }))
    expect(screen.getByRole('button', { name: 'sc025.hero.pause' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
