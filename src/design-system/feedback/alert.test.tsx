import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from '../index'

describe('Alert', () => {
  it('rendert mit children', () => {
    render(<Alert>Hinweistext</Alert>)
    expect(screen.getByText('Hinweistext')).toBeInTheDocument()
  })

  it('kuendigt Fehler assertiv an (role="alert")', () => {
    render(<Alert variant="danger">Fehlertext</Alert>)
    expect(screen.getByRole('alert')).toHaveTextContent('Fehlertext')
  })
})
