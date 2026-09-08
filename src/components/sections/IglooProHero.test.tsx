import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import IglooProHero from './IglooProHero'
import IglooProductProof from './IglooProductProof'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

type ProductResource = {
  hero: {
    caption: string
    title: string
    description: string
    cta_order: string
    cta_secondary: string
    subline: string
    visual: { device_alt: string; context: string }
  }
  proof: {
    aria_label: string
    eyebrow: string
    title: string
    description: string
    items: Record<string, { title: string; text: string }>
  }
}

const localeModules = import.meta.glob('/public/locales/*/products.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProductResource>

const renderEntry = () =>
  render(
    <MemoryRouter>
      <IglooProHero />
      <IglooProductProof />
    </MemoryRouter>,
  )

describe('PT14.2 IglooPro Hero and proof contract', () => {
  it('renders one H1, a real GENERAL_SALES target and a distinct resource link', () => {
    renderEntry()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    const primary = screen.getByRole('link', { name: 'products:hero.cta_order' })
    expect(primary).toHaveAttribute('href', '/contact')
    expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')

    const secondary = screen.getByRole('link', { name: 'products:hero.cta_secondary' })
    expect(secondary).toHaveAttribute('href', '/#roi-rechner')
    expect(secondary).not.toHaveAttribute('data-cta-intent')
  })

  it('uses the real dimensioned LCP image and exposes no interactive visual', () => {
    renderEntry()

    const image = screen.getByRole('img', { name: 'products:hero.visual.device_alt' })
    expect(image).toHaveAttribute('width', '650')
    expect(image).toHaveAttribute('height', '650')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('fetchpriority', 'high')
    expect(image.getAttribute('src')).toContain('Igloo-pro-frontal')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders three evidence-bounded proof signals without numeric or certification proof', () => {
    renderEntry()

    const proof = screen.getByLabelText('proof.aria_label')
    expect(within(proof).getAllByRole('listitem')).toHaveLength(3)
    expect(proof.textContent).not.toMatch(/CV\s*<|<\s*5\s*%|600\s*g|3.?15|24\s*h/i)
    expect(proof.textContent).not.toMatch(/IVDR|\bCE\b|certif|accredit|rating|review/i)
  })

  it('provides complete, distinct and claim-safe Hero/proof content for exactly ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    const titles = new Set<string>()
    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/products.json`]
      expect(resource, `missing ${locale} products resource`).toBeDefined()

      const visibleValues = [
        resource.hero.caption,
        resource.hero.title,
        resource.hero.description,
        resource.hero.cta_order,
        resource.hero.cta_secondary,
        resource.hero.subline,
        resource.hero.visual.device_alt,
        resource.hero.visual.context,
        resource.proof.aria_label,
        resource.proof.eyebrow,
        resource.proof.title,
        resource.proof.description,
        ...Object.values(resource.proof.items).flatMap(({ title, text }) => [title, text]),
      ]
      expect(Object.keys(resource.proof.items)).toEqual(['reader', 'audience', 'enquiry'])
      for (const value of visibleValues) {
        expect(value.trim().length, `${locale} visible Hero/proof value`).toBeGreaterThan(0)
        expect(value).not.toMatch(/^[a-z0-9_.-]+$/i)
      }

      const visibleCopy = visibleValues.join(' ')
      expect(visibleCopy, `${locale} claim wall`).not.toMatch(
        /CV\s*<|<\s*5\s*%|600\s*g|3.?15\s*(min|Min)|24\s*h|IVDR|LIS\/HIS/i,
      )
      expect(visibleCopy, `${locale} unsupported proof`).not.toMatch(
        /certif|accredit|rating|review|lab[- ]grade|laborgenau|garant/i,
      )
      titles.add(resource.hero.title)
    }

    expect(titles.size).toBe(10)
    expect(localeModules['/public/locales/de/products.json'].hero.cta_order).toBe(
      'Angebot anfragen',
    )
  })
})
