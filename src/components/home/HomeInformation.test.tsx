import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeInformation from './HomeInformation'

const renderSection = () =>
  render(
    <MemoryRouter>
      <HomeInformation />
    </MemoryRouter>,
  )

describe('SC-025 homepage information and events', () => {
  afterEach(() => vi.useRealTimers())

  it('keeps three POC signals and a semantic three-step table without old benefit cards', () => {
    renderSection()
    const section = screen.getByRole('region', { name: 'why.title' })
    expect(section.querySelectorAll('[data-poc-signal]')).toHaveLength(3)
    expect(section.querySelectorAll('[data-benefit-audience]')).toHaveLength(0)
    const process = screen.getByRole('table', { name: 'steps.aria_label' })
    expect(process.querySelectorAll('thead th')).toHaveLength(2)
    expect(
      [...process.querySelectorAll('[data-process-step]')].map((row) =>
        row.getAttribute('data-process-step'),
      ),
    ).toEqual(['application', 'result', 'context'])
    expect(process.querySelectorAll('tbody th[scope="row"]')).toHaveLength(3)
  })

  it.each([
    ['2026-11-15', ['medica_2026', 'dgi_jahreskongress']],
    ['2026-11-20', ['dgi_jahreskongress']],
    ['2026-11-27', ['dgi_jahreskongress']],
    ['2026-11-29', []],
  ])('projects the real upcoming events on %s', (day, expected) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(`${day}T12:00:00+01:00`))
    const { container } = renderSection()
    expect(
      [...container.querySelectorAll('[data-home-event]')].map((row) =>
        row.getAttribute('data-home-event'),
      ),
    ).toEqual(expected)
    expect(container.querySelector('[data-home-events]') !== null).toBe(expected.length > 0)
  })
})
