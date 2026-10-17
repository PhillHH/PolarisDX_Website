import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ShopTeaserSection from './ShopTeaserSection'
import { PANELS_ORIGIN, SHOP_ORIGIN } from '../../lib/shop'

/**
 * SC-004 (O1) + SC-007 (2026-10-17): das Startseiten-Band fuehrt genau zwei
 * Shop-Ziele auf fremden Domains — Praxis-Shop (HCL-015) und Panel-Shop
 * (HCL-016). Beide als <a> mit voller Seitenladung im selben Tab; kein
 * weiterer Link, kein Button, kein Bild.
 */
describe('ShopTeaserSection — zwei Online-Shops', () => {
  it('verlinkt Praxis-Shop und Panel-Shop als einzige Aktionen', () => {
    render(<ShopTeaserSection />)

    const band = screen.getByRole('region', { name: 'shop_teaser.title' })
    const links = within(band).getAllByRole('link')
    expect(links).toHaveLength(2)

    const practice = within(band).getByRole('link', { name: /shop_teaser\.cta\b/ })
    expect(practice).toHaveAttribute('href', SHOP_ORIGIN)
    expect(practice).toHaveAttribute('data-shop', 'practice')

    const panels = within(band).getByRole('link', { name: /shop_teaser\.cta_panels/ })
    expect(panels).toHaveAttribute('href', PANELS_ORIGIN)
    expect(panels).toHaveAttribute('data-shop', 'panels')

    for (const link of links) {
      expect(link).not.toHaveAttribute('target')
      expect(link.tagName).toBe('A')
    }
    expect(within(band).queryByRole('button')).not.toBeInTheDocument()
    expect(within(band).queryByRole('img')).not.toBeInTheDocument()
    expect(band).toHaveTextContent('shop_teaser.note')
  })
})
