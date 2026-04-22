import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

describe('SectionHeader', () => {
  it('rendert caption und title', () => {
    render(<SectionHeader caption="Über uns" title="PolarisDX" />)
    expect(screen.getByText('Über uns')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'PolarisDX' })).toBeInTheDocument()
  })
})
