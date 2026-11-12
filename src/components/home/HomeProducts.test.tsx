import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { resolveCanonicalRoute } from '../../routing'
import HomeProducts from './HomeProducts'

const renderSection = () =>
  render(
    <MemoryRouter>
      <HomeProducts />
    </MemoryRouter>,
  )

describe('SC-025 homepage products', () => {
  it('renders the three independent pillars with registry-backed targets', () => {
    renderSection()
    const section = screen.getByRole('region', { name: 'sc025.products.lead' })
    expect(section.querySelectorAll('[data-business-pillar]')).toHaveLength(3)
    const expected = {
      diagnostics: { routeId: 'diagnostics', href: '/diagnostics' },
      igloo: { routeId: 'igloo-pro', href: '/igloo-pro' },
      epigenetics: { routeId: 'epigenetics', href: '/epigenetics' },
    }
    for (const [pillarId, target] of Object.entries(expected)) {
      const pillar = section.querySelector(`[data-business-pillar="${pillarId}"]`)
      expect(pillar).toHaveAttribute('href', target.href)
      expect(pillar).toHaveAttribute('data-route-id', target.routeId)
      expect(resolveCanonicalRoute(target.href)?.id).toBe(target.routeId)
      expect(within(pillar as HTMLElement).queryByRole('link')).not.toBeInTheDocument()
    }
  })

  it('uses real table headers, existing claims and only lazy product media', () => {
    const { container } = renderSection()
    const table = screen.getByRole('table', { name: 'sc025.products.metrics_caption' })
    expect(table.querySelectorAll('thead th')).toHaveLength(3)
    expect(table.querySelectorAll('tbody th[scope="row"]')).toHaveLength(5)
    expect(table).toHaveTextContent('hero.stat2.value')
    expect(table).toHaveTextContent('hero.stat1.value')
    expect(table).toHaveTextContent('segments.dental.bio')
    expect(container.querySelectorAll('img[loading="lazy"]')).toHaveLength(3)
    expect(container.querySelectorAll('img[loading="eager"]')).toHaveLength(0)
  })
})
