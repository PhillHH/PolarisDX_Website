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

  it.each([
    ['2026-11-15', 'medica_2026'],
    ['2026-11-20', 'dgi_jahreskongress'],
    ['2026-11-27', 'dgi_jahreskongress'],
    ['2026-11-29', undefined],
  ])('schaltet am %s ohne eingefrorenen Build-Stand', (day, eventId) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${day}T12:00:00+01:00`))
    const { container } = renderBand()
    const band = container.querySelector('[data-event-band]')
    if (eventId) expect(band).toHaveAttribute('data-event-band', eventId)
    else expect(band).toBeNull()
  })

  it('rendert als „strip" ohne Foto und Beschreibung, mit Countdown und Knopf (Startseite)', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-02T12:00:00+01:00'))
    const { container } = render(
      <MemoryRouter>
        <EventBand variant="strip" />
      </MemoryRouter>,
    )
    expect(container.querySelector('[data-event-band-variant="strip"]')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('event_band.days_label')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /event_popup.meet/ })).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(screen.queryByRole('link', { name: 'event_band.all' })).toBeNull()
    expect(screen.queryByText(/events:items.medica_2026.description/)).toBeNull()
  })
})
