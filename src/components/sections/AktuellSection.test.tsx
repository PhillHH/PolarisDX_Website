import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AktuellSection from './AktuellSection'
import { getNextHomeEvent } from '../../data/events'
import { PANELS_ORIGIN } from '../../lib/shop'

const mount = () =>
  render(
    <MemoryRouter>
      <AktuellSection />
    </MemoryRouter>,
  )

describe('AktuellSection (SC-019)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('zeigt vor der MEDICA den Termin links und die Panel-Aktion rechts', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-28T12:00:00+01:00'))
    mount()

    const region = screen.getByRole('region', { name: 'aktuell.title' })
    const event = region.querySelector('[data-home-event]')
    expect(event).toHaveAttribute('data-home-event', 'medica_2026')
    expect(within(event as HTMLElement).getByRole('link')).toHaveAttribute('href', '/events')
    expect(event).toHaveTextContent('Düsseldorf')
    expect(event).toHaveTextContent('16.–19. Nov 2026')

    const panels = region.querySelector('[data-home-panels-promo] a')
    expect(panels?.getAttribute('href')?.startsWith(PANELS_ORIGIN)).toBe(true)
    expect(panels).toHaveAttribute('data-shop', 'panels')
    expect(region.querySelectorAll('a')).toHaveLength(2)
  })

  it('zeigt waehrend der MEDICA nur noch den Termin, danach den DGI-Kongress', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-18T08:00:00+01:00'))
    expect(getNextHomeEvent()?.id).toBe('medica_2026')
    const { unmount } = mount()
    expect(
      screen
        .queryByRole('region', { name: 'aktuell.title' })
        ?.querySelector('[data-home-panels-promo]'),
    ).toBeNull()
    unmount()

    vi.setSystemTime(new Date('2026-11-21T08:00:00+01:00'))
    expect(getNextHomeEvent()?.id).toBe('dgi_jahreskongress')
  })

  it('rendert nichts, wenn weder Termin noch Aktion anstehen', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-01T08:00:00+01:00'))
    expect(getNextHomeEvent()).toBeUndefined()
    const { container } = mount()
    expect(container).toBeEmptyDOMElement()
  })
})
