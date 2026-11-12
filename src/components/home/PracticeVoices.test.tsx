import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PracticeVoices from './PracticeVoices'

describe('SC-025 four practice voices', () => {
  it('keeps all sourced voices in SSR and lets visitors page forward and back', () => {
    render(<PracticeVoices />)
    const proof = screen.getByRole('region', { name: 'testimonials.aria.carousel' })
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
    expect(within(proof).queryByText(/martin_fischer|Martin Fischer/)).not.toBeInTheDocument()
    expect(within(proof).queryByRole('link')).not.toBeInTheDocument()
    expect(within(proof).getByRole('button', { name: 'testimonials.prev' })).toBeDisabled()
    fireEvent.click(within(proof).getByRole('button', { name: 'testimonials.next' }))
    expect(within(proof).getByText('2 / 4')).toHaveAttribute('aria-live', 'polite')
    expect(within(proof).getByRole('button', { name: 'testimonials.prev' })).toBeEnabled()
  })
})
