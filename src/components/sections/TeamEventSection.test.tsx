import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TeamEventSection from './TeamEventSection'

const renderSection = () =>
  render(
    <MemoryRouter>
      <TeamEventSection />
    </MemoryRouter>,
  )

/** Team-Sektion (SC-021 Nachtrag 5, Entwurf T3): DGI-Jahreskongress aus den Termindaten. */
describe('TeamEventSection', () => {
  afterEach(() => vi.useRealTimers())

  it('zeigt Datum, Ort und Partner des DGI-Kongresses mit beiden Wegen', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-03T12:00:00+01:00'))
    const { container } = renderSection()
    expect(container.querySelector('[data-home-team]')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('team.title')
    expect(screen.getByText(/27\./)).toBeInTheDocument()
    expect(screen.getByText('Hamburg · Nobel Biocare')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'team.cta' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'team.cta_secondary' })).toHaveAttribute(
      'href',
      '/events',
    )
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('alt', 'team.alt')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('width', '1280')
    expect(img).toHaveAttribute('height', '960')
  })

  it('verschwindet nach dem letzten Kongresstag', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-29T12:00:00+01:00'))
    const { container } = renderSection()
    expect(container.querySelector('[data-home-team]')).toBeNull()
  })
})
