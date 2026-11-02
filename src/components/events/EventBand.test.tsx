import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import EventBand from './EventBand'

const renderBand = () =>
  render(
    <MemoryRouter>
      <EventBand />
    </MemoryRouter>,
  )

/** Messe-Band (SC-021 Nachtrag): naechster belegter Termin, Countdown, Weg zum Standtermin. */
describe('EventBand', () => {
  afterEach(() => vi.useRealTimers())

  it('zeigt den naechsten Termin mit Countdown und fuehrt zu Kontakt und Terminen', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-02T12:00:00+01:00'))
    const { container } = renderBand()
    expect(container.querySelector('[data-event-band="medica_2026"]')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('event_band.title')
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('event_band.days_label')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /event_popup.meet/ })).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(screen.getByRole('link', { name: 'event_band.all' })).toHaveAttribute('href', '/events')
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('sagt waehrend des Termins „jetzt vor Ort" statt einen Countdown zu zeigen', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-17T12:00:00+01:00'))
    renderBand()
    expect(screen.getByText('event_band.now')).toBeInTheDocument()
    expect(screen.queryByText('event_band.days_label')).not.toBeInTheDocument()
  })
})
