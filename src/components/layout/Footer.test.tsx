import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Footer from './Footer'

describe('Footer', () => {
  it('rendert mit Impressum-Link', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </HelmetProvider>,
    )
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
