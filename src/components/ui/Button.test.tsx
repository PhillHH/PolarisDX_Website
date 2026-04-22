import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button } from './Button'

describe('Button', () => {
  it('rendert mit variant primary', () => {
    render(
      <MemoryRouter>
        <Button variant="primary">Klick</Button>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
