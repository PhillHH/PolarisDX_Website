// @vitest-environment node

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Header from '../layout/Header'
import HomeInformation from '../home/HomeInformation'
import HomeContact from '../home/HomeContact'
import EventBand from './EventBand'

const renderSchedule = () =>
  renderToString(
    <HelmetProvider>
      <MemoryRouter>
        <Header />
        <EventBand />
        <HomeInformation />
        <HomeContact />
        <section data-following-content>Weiterer Inhalt</section>
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('SSR-Terminwechsel (SC-024/SC-025)', () => {
  afterEach(() => vi.useRealTimers())

  it.each([
    ['2026-11-15', 'medica_2026', true],
    ['2026-11-20', 'dgi_jahreskongress', true],
    ['2026-11-27', 'dgi_jahreskongress', true],
    ['2026-11-29', undefined, false],
  ])(
    'rendert am %s neu statt einen Build-Stand wiederzuverwenden',
    (day, eventId, eventVisible) => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(`${day}T12:00:00+01:00`))
      const html = renderSchedule()

      expect(html.includes('data-event-strip')).toBe(true)
      expect(html.includes(`data-event-band="${eventId ?? ''}"`)).toBe(Boolean(eventId))
      expect(html.includes('data-home-events')).toBe(eventVisible)
      expect(html.includes(`data-home-event-card="${eventId ?? ''}"`)).toBe(Boolean(eventId))
      expect(html.includes('data-home-event="medica_2026"')).toBe(day === '2026-11-15')
      expect(html.includes('data-home-event="dgi_jahreskongress"')).toBe(eventVisible)
      expect(html).toContain('data-following-content')
      expect(html).toContain('Weiterer Inhalt')
      expect(html).toContain('nav.blog')
    },
  )
})
