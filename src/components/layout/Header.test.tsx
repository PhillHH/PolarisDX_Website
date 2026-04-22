import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './Header'

describe('Header', () => {
  it('rendert ein navigation element', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </HelmetProvider>,
    )
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
  })
})
