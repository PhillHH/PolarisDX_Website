// @vitest-environment node

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Header from '../layout/Header'
import TeamEventSection from '../sections/TeamEventSection'
import EventBand from './EventBand'

const renderSchedule = () =>
  renderToString(
    <HelmetProvider>
      <MemoryRouter>
        <Header />
        <EventBand />
        <TeamEventSection />
        <section data-following-content>Weiterer Inhalt</section>
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('SSR-Terminwechsel (SC-024)', () => {
  afterEach(() => vi.useRealTimers())

  it.each([
    ['2026-11-15', 'medica_2026', true],
    ['2026-11-20', 'dgi_jahreskongress', true],
    ['2026-11-27', 'dgi_jahreskongress', true],
    ['2026-11-29', undefined, false],
  ])('rendert am %s neu statt einen Build-Stand wiederzuverwenden', (day, eventId, teamVisible) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${day}T12:00:00+01:00`))
    const html = renderSchedule()

    expect(html.includes('data-event-strip')).toBe(true)
    expect(html.includes(`data-event-band="${eventId ?? ''}"`)).toBe(Boolean(eventId))
    expect(html.includes('data-home-team')).toBe(teamVisible)
    expect(html.includes('events:items.medica_2026.title')).toBe(eventId === 'medica_2026')
    expect(html.includes('events:items.dgi_jahreskongress.title')).toBe(teamVisible)
    expect(html).toContain('data-following-content')
    expect(html).toContain('Weiterer Inhalt')
    expect(html).toContain('nav.blog')
  })
})
