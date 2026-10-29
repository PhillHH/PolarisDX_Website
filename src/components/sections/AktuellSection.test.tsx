import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AktuellSection from './AktuellSection'
import { getNextHomeEvent } from '../../data/events'
import { PANELS_ORIGIN, SHOP_ORIGIN } from '../../lib/shop'

const mount = () =>
  render(
    <MemoryRouter>
      <AktuellSection />
    </MemoryRouter>,
  )

const shopLinks = (region: HTMLElement) =>
  [...region.querySelectorAll('[data-home-shops] a')].map((a) => a.getAttribute('data-shop'))

describe('AktuellSection (SC-019/SC-020)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('zeigt vor der MEDICA den Termin links und beide Shops rechts (Panel-Aktion aktiv)', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-28T12:00:00+01:00'))
    mount()

    const region = screen.getByRole('region', { name: 'aktuell.title' })
    const event = region.querySelector('[data-home-event]')
    expect(event).toHaveAttribute('data-home-event', 'medica_2026')
    expect(within(event as HTMLElement).getByRole('link')).toHaveAttribute('href', '/events')
    expect(event).toHaveTextContent('Düsseldorf')
    expect(event).toHaveTextContent('16.–19. Nov 2026')

    const shops = region.querySelector('[data-home-shops]') as HTMLElement
    expect(shops).toHaveTextContent('shop_teaser.promo_title')
    expect(shops).toHaveTextContent('shop_teaser.note_short')
    expect(shopLinks(region)).toEqual(['panels', 'practice'])
    const [panels, practice] = shops.querySelectorAll('a')
    expect(panels.getAttribute('href')?.startsWith(PANELS_ORIGIN)).toBe(true)
    expect(practice.getAttribute('href')?.startsWith(SHOP_ORIGIN)).toBe(true)
    expect(region.querySelectorAll('a')).toHaveLength(3)
  })

  it('behaelt beide Shops nach dem Ende der Panel-Aktion und rueckt den DGI-Kongress nach', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-21T08:00:00+01:00'))
    expect(getNextHomeEvent()?.id).toBe('dgi_jahreskongress')
    mount()
    const region = screen.getByRole('region', { name: 'aktuell.title' })
    const shops = region.querySelector('[data-home-shops]') as HTMLElement
    expect(shops).toHaveTextContent('shop_teaser.title')
    expect(shopLinks(region)).toEqual(['panels', 'practice'])
    expect(region.querySelector('[data-home-event]')).toHaveAttribute(
      'data-home-event',
      'dgi_jahreskongress',
    )
  })

  it('zeigt ohne Termin nur die Shop-Kachel in voller Breite', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-12-01T08:00:00+01:00'))
    expect(getNextHomeEvent()).toBeUndefined()
    mount()
    const region = screen.getByRole('region', { name: 'aktuell.title' })
    expect(region.querySelector('[data-home-event]')).toBeNull()
    expect(shopLinks(region)).toEqual(['panels', 'practice'])
  })
})
