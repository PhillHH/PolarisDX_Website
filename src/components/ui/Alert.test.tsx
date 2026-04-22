import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('rendert mit children', () => {
    render(<Alert>Hinweistext</Alert>)
    expect(screen.getByText('Hinweistext')).toBeInTheDocument()
  })
})
