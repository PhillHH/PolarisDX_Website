import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'

const track = vi.fn()
vi.mock('./tracking', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./tracking')>()),
  track: (...args: unknown[]) => track(...args),
}))

import { useOutboundTracking } from './useOutboundTracking'

const Harness = ({ href }: { href: string }) => {
  useOutboundTracking()
  return (
    <a href={href} onClick={(e) => e.preventDefault()}>
      Ziel
    </a>
  )
}

const klick = (href: string) => {
  const { getByText } = render(<Harness href={href} />)
  getByText('Ziel').click()
}

describe('useOutboundTracking (SC-004: Shop und ndu Clinic)', () => {
  afterEach(() => {
    cleanup()
    track.mockReset()
  })

  it('meldet den Shop nur mit seiner Domain, ohne Pfad', () => {
    klick('https://shop.polarisdx.net/en/collections/test-kits?ref=x')
    expect(track).toHaveBeenCalledWith({ name: 'outbound_click', domain: 'shop.polarisdx.net' })
  })

  it('fuehrt www.nduclinic.com auf die registrierbare Domain zurueck', () => {
    klick('https://www.nduclinic.com/')
    expect(track).toHaveBeenCalledWith({ name: 'outbound_click', domain: 'nduclinic.com' })
  })

  it('verwirft unbekannte Domains', () => {
    klick('https://example.org/termin')
    expect(track).not.toHaveBeenCalled()
  })
})
