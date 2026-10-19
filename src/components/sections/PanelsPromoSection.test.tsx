import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PanelsPromoSection from './PanelsPromoSection'
import { PANELS_ORIGIN, SHOP_ORIGIN } from '../../lib/shop'

describe('PanelsPromoSection (SC-009)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('zeigt waehrend der Aktion den Panel-Shop zuerst und den Praxis-Shop als zweite Aktion', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-20T12:00:00+02:00'))
    render(<PanelsPromoSection />)

    const region = screen.getByRole('region', { name: 'shop_teaser.promo_title' })
    const links = region.querySelectorAll('a')
    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')?.startsWith(PANELS_ORIGIN)).toBe(true)
    expect(links[0]).toHaveAttribute('data-shop', 'panels')
    expect(links[1].getAttribute('href')?.startsWith(SHOP_ORIGIN)).toBe(true)
    expect(links[1]).toHaveAttribute('data-shop', 'practice')
  })

  it('rendert nach dem letzten Tag nichts mehr', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-17T08:00:00+01:00'))
    const { container } = render(<PanelsPromoSection />)
    expect(container).toBeEmptyDOMElement()
  })
})
