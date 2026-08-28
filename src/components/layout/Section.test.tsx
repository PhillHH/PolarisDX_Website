import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Section, Container, CardGrid } from './Section'

describe('Section / Container', () => {
  it('rendert standardmaessig ein <section>', () => {
    const { container } = render(<Section>Inhalt</Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('kann das Element wechseln, ohne die Rolle zu verlieren', () => {
    render(<Section as="aside">Randnotiz</Section>)
    expect(screen.getByRole('complementary')).toHaveTextContent('Randnotiz')
  })

  it('setzt fuer die Kapitelnavigation Anker UND Scroll-Offset', () => {
    const { container } = render(<Section anchorId="kapitel-1">Text</Section>)
    const section = container.querySelector('section')!
    expect(section).toHaveAttribute('id', 'kapitel-1')
    // Ohne scroll-mt verdeckt die Sticky-Leiste die Ueberschrift beim Sprung.
    expect(section.className).toContain('scroll-mt-28')
  })

  it('setzt ohne Anker keinen Scroll-Offset', () => {
    const { container } = render(<Section>Text</Section>)
    expect(container.querySelector('section')!.className).not.toContain('scroll-mt-28')
  })

  it('traegt die Flaeche auf der Section, nicht auf dem Container', () => {
    const { container } = render(
      <Section surface="navy">
        <Container>Inhalt</Container>
      </Section>,
    )
    const section = container.querySelector('section')!
    const inner = section.firstElementChild!
    // Full-bleed: der Hintergrund gehoert nach aussen ...
    expect(section.className).toContain('bg-brand-deep')
    // ... die Breitenbegrenzung nach innen.
    expect(inner.className).toContain('max-w-container')
    expect(section.className).not.toContain('max-w-container')
  })

  it('Container kann den vertikalen Rhythmus abschalten', () => {
    const { container } = render(<Container rhythm="none">X</Container>)
    const el = container.firstElementChild!
    expect(el.className).toContain('max-w-container')
    expect(el.className).not.toContain('py-16')
  })

  it('reicht zusaetzliche Attribute durch', () => {
    render(
      <Section aria-label="Kennzahlen">
        <Container>Zahlen</Container>
      </Section>,
    )
    expect(screen.getByRole('region', { name: 'Kennzahlen' })).toBeInTheDocument()
  })
})

describe('CardGrid', () => {
  it('ist mobil immer einspaltig', () => {
    const { container } = render(<CardGrid columns={3}>x</CardGrid>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain('grid')
    // Spalten entstehen erst ab einem Breakpoint — es gibt keine
    // unpraefixierte grid-cols-Angabe.
    expect(cls).not.toMatch(/(^|\s)grid-cols-/)
  })

  it('schaltet die Spalten an Breakpoints', () => {
    const { container } = render(<CardGrid columns={4}>x</CardGrid>)
    const cls = container.firstElementChild!.className
    expect(cls).toContain('sm:grid-cols-2')
    expect(cls).toContain('lg:grid-cols-4')
  })

  it('streckt Karten auf gleiche Hoehe, wenn gewuenscht', () => {
    const { container } = render(<CardGrid equalHeight>x</CardGrid>)
    expect(container.firstElementChild!.className).toContain('items-stretch')
  })

  it('kann die gleiche Hoehe abschalten', () => {
    const { container } = render(<CardGrid equalHeight={false}>x</CardGrid>)
    expect(container.firstElementChild!.className).not.toContain('items-stretch')
  })
})
