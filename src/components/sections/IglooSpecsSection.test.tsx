import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createProductSchema } from '../seo'
import IglooSpecsSection from './IglooSpecsSection'

const localeModules = import.meta.glob('/public/locales/*/products.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>

describe('IglooPro claim-safe specification', () => {
  it('renders one semantic specification row without amplification', () => {
    render(<IglooSpecsSection />)

    const table = screen.getByRole('table', { name: 'specification.caption' })
    expect(within(table).getAllByRole('columnheader')).toHaveLength(3)
    expect(within(table).getByRole('rowheader')).toHaveTextContent('specification.metric')
    expect(within(table).getByText('specification.value')).toBeInTheDocument()
    expect(screen.getByText('specification.context')).toBeInTheDocument()
  })

  it('keeps the locked value and explicit validation boundary in all ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)
    for (const [path, resource] of Object.entries(localeModules)) {
      const specification = resource.specification as Record<string, unknown>
      expect(specification.value, path).toBe('CV < 2 %')
      expect(String(specification.description), path).not.toHaveLength(0)
      expect(String(specification.context), path).not.toHaveLength(0)
    }
  })

  it('does not amplify the claim through Product structured data', () => {
    for (const [path, resource] of Object.entries(localeModules)) {
      const hero = resource.hero as { description: string }
      const schema = createProductSchema({
        name: 'IglooPro',
        description: hero.description,
        image: '/igloo.webp',
        url: '/igloo-pro',
        language: path.split('/')[3],
      })
      const output = JSON.stringify(schema)
      expect(output, path).not.toContain('CV <')
      expect(output, path).not.toMatch(/Offer|AggregateRating|review|accuracy/i)
    }
  })
})
