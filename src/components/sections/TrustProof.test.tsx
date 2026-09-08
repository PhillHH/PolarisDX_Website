import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TrustBar from './TrustBar'
import TestimonialsSection from './TestimonialsSection'

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    trustbar: Record<string, string>
    testimonials: Record<string, unknown> & {
      bastian_wessing: Record<string, string>
    }
  }
>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

describe('PT11.2 Homepage Trust and Proof contract', () => {
  it('renders exactly four sourced product signals with stable claim IDs', () => {
    render(<TrustBar />)

    const trustbar = screen.getByRole('region', { name: 'trustbar.aria' })
    const items = within(trustbar).getAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items.map((item) => item.getAttribute('data-claim-id'))).toEqual([
      'HCL-002',
      'HCL-003',
      'HCL-004',
      'HCL-005',
    ])
    expect(trustbar).toHaveTextContent('trustbar.cv')
    expect(trustbar).toHaveTextContent('trustbar.ivdr')
    expect(trustbar).toHaveTextContent('trustbar.minutes')
    expect(trustbar).toHaveTextContent('trustbar.compat')
    expect(within(trustbar).queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders one named existing reference without rating or carousel semantics', () => {
    render(<TestimonialsSection />)

    const proof = screen.getByRole('region', { name: 'testimonials.title' })
    const figure = within(proof).getByRole('figure')
    expect(figure).toHaveAttribute('data-testimonial-id', 'bastian_wessing')
    expect(figure).toHaveAttribute('data-claim-id', 'HCL-006')
    expect(within(figure).getByText('Dr. Bastian Wessing')).toBeInTheDocument()
    expect(
      within(figure).getByText(/testimonials\.bastian_wessing\.proof_text/),
    ).toBeInTheDocument()
    expect(within(figure).getByRole('blockquote')).toBeInTheDocument()
    expect(within(proof).queryByRole('button')).not.toBeInTheDocument()
    expect(within(proof).queryByRole('link')).not.toBeInTheDocument()
    expect(proof).not.toHaveAttribute('aria-roledescription', 'carousel')

    const image = figure.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('width', '300')
    expect(image).toHaveAttribute('height', '300')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('has x10 localized proof copy and exact locked claim semantics', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/home.json`]
      expect(resource, `missing ${locale} home resource`).toBeDefined()
      for (const key of ['aria', 'cv', 'ivdr', 'minutes', 'compat']) {
        expect(resource.trustbar[key], `${locale}.trustbar.${key}`).toBeTruthy()
      }
      expect(resource.trustbar.cv, `${locale}.trustbar.cv`).toBe('IglooPro · CV < 2 %')
      expect(resource.trustbar).not.toHaveProperty('partner')
      expect(resource.trustbar).not.toHaveProperty('delivery')

      const reference = resource.testimonials.bastian_wessing
      for (const key of ['role', 'practice', 'proof_text']) {
        expect(reference[key], `${locale}.testimonials.bastian_wessing.${key}`).toBeTruthy()
      }
      expect(reference.proof_text).not.toMatch(
        /guarantee|garant|therap|treatment|behandlung|revenue|profit|rating|reviewCount/i,
      )
    }
  })
})
