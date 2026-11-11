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
    expect(screen.getAllByText(/27\./).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Hamburg · Nobel Biocare').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'team.cta' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'team.cta_secondary' })).toHaveAttribute(
      'href',
      '/events',
    )
    // Nachtrag 7: kein Foto mehr — Kongress-Ticket mit Live-Countdown (2026-11-03 → 24 Tage).
    expect(container.querySelector('img')).toBeNull()
    const ticket = container.querySelector('[data-home-team-ticket]')!
    expect(ticket).toHaveTextContent('24')
    expect(ticket).toHaveTextContent('team.countdown_days')
    expect(ticket).toHaveTextContent('events:items.dgi_jahreskongress.title')
  })

  it('sagt waehrend des Kongresses „jetzt vor Ort" statt zu zaehlen', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-27T12:00:00+01:00'))
    renderSection()
    expect(screen.getByText('common:event_band.now')).toBeInTheDocument()
    expect(screen.queryByText('team.countdown_days')).toBeNull()
  })

  it.each([
    ['2026-11-15', true],
    ['2026-11-20', true],
    ['2026-11-27', true],
    ['2026-11-28', true],
    ['2026-11-29', false],
  ])('bleibt am %s nur bis einschliesslich Kongressende sichtbar', (day, visible) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${day}T12:00:00+01:00`))
    const { container } = renderSection()
    expect(container.querySelector('[data-home-team]') !== null).toBe(visible)
    expect(container.querySelector('[data-home-team-ticket]') !== null).toBe(visible)
  })
})
