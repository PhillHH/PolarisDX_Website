import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
  // SC-021 Nachtrag 12 (Owner 2026-11-06): das Vertrauensband ist von der Startseite entfernt (Unterseiten
  // behalten es); die vier Signal-Strings werden unten auf x10-Vollstaendigkeit geprueft.
  it('renders the four sourced voices as an operable slider without rating or links (SC-014)', () => {
    render(<TestimonialsSection />)

    const proof = screen.getByRole('region', { name: 'testimonials.title' })
    const slides = [...proof.querySelectorAll('[data-testimonial-id]')]
    expect(slides.map((item) => item.getAttribute('data-testimonial-id'))).toEqual([
      'bastian_wessing',
      'richard_pollock',
      'kristian_grimm',
      'goran_stojanovic',
    ])
    expect(slides.map((item) => item.getAttribute('data-claim-id'))).toEqual([
      'HCL-006',
      'HCL-017',
      'HCL-017',
      'HCL-017',
    ])
    for (const slide of slides) {
      expect(slide).toHaveAttribute('role', 'group')
      expect(slide).toHaveAttribute('aria-roledescription', 'slide')
    }
    expect(within(proof).queryByText(/martin_fischer|Martin Fischer/)).not.toBeInTheDocument()
    expect(within(proof).queryByRole('link')).not.toBeInTheDocument()
    expect(proof.querySelector('[aria-roledescription="carousel"]')).not.toBeNull()

    // Bedienung: zurueck/weiter und ein Zaehler; am Anfang ist „zurueck" gesperrt.
    expect(within(proof).getAllByRole('button')).toHaveLength(2)
    expect(within(proof).getByRole('button', { name: 'testimonials.prev' })).toBeDisabled()
    expect(within(proof).getByRole('button', { name: 'testimonials.next' })).toBeEnabled()
    expect(within(proof).getByText('1 / 4')).toHaveAttribute('aria-live', 'polite')

    const first = slides[0] as HTMLElement
    expect(within(first).getByText('Dr. Bastian Wessing')).toBeInTheDocument()
    // Anfuehrungszeichen kommen je Sprache aus der Locale, nicht fest „…".
    expect(within(first).getByRole('blockquote')).toHaveTextContent(
      'testimonials.q_opentestimonials.bastian_wessing.proof_texttestimonials.q_close',
    )

    const image = first.querySelector('img')
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

      // „Behandlungsstuhl" (goran_stojanovic, de) ist ein Ort, kein Behandlungsversprechen.
      for (const id of [
        'bastian_wessing',
        'richard_pollock',
        'kristian_grimm',
        'goran_stojanovic',
      ]) {
        const reference = resource.testimonials[id] as Record<string, string>
        for (const key of ['role', 'proof_text']) {
          expect(reference[key], `${locale}.testimonials.${id}.${key}`).toBeTruthy()
        }
        expect(reference.text, `${locale}.testimonials.${id}.text`).toContain(reference.proof_text)
        expect(reference.proof_text, `${locale}.testimonials.${id}.proof_text`).not.toMatch(
          /guarantee|garant|therap|treatment|behandlung(?!sstuhl)|revenue|profit|rating|reviewCount/i,
        )
      }
      expect(resource.testimonials.bastian_wessing.practice).toBeTruthy()
      for (const key of ['prev', 'next', 'slide', 'q_open', 'q_close']) {
        expect(resource.testimonials[key], `${locale}.testimonials.${key}`).toBeTruthy()
      }
    }
  })
})
