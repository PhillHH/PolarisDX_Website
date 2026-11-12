import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeContact from './HomeContact'

const renderSection = () =>
  render(
    <MemoryRouter>
      <HomeContact />
    </MemoryRouter>,
  )

describe('SC-025 contact choices', () => {
  afterEach(() => vi.useRealTimers())

  it('links three practice contexts to the current info-call target and both real shops', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-12T12:00:00+01:00'))
    renderSection()
    const section = screen.getByRole('region', { name: 'sc025.contact.lead' })
    expect(section.querySelectorAll('[data-core-service]')).toHaveLength(3)
    for (const link of section.querySelectorAll('[data-core-service]')) {
      expect(link).toHaveAttribute('href', '/contact')
    }
    expect(section.querySelector('[data-home-event-card="medica_2026"]')).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(screen.getByRole('link', { name: 'common:nav.shop' })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.getByRole('link', { name: 'shop_teaser.cta_panels' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })

  it('removes the trade-fair card when no event remains', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-29T12:00:00+01:00'))
    const { container } = renderSection()
    expect(container.querySelector('[data-home-event-card]')).toBeNull()
    expect(container.querySelectorAll('[data-core-service]')).toHaveLength(3)
  })
})
