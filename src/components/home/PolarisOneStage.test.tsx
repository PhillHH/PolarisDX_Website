import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import PolarisOneStage from './PolarisOneStage'

const renderStage = () =>
  render(
    <MemoryRouter>
      <PolarisOneStage />
    </MemoryRouter>,
  )

describe('SC-030 Polaris One Trailer stage', () => {
  it('keeps the complete H1 and offers the pre-order target before the film starts', () => {
    const { container } = renderStage()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('hero.title')

    const stage = container.querySelector('[data-home-hero]')
    expect(stage).toHaveAttribute('data-mode', 'gate')
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/contact')
    expect(links[0]).toHaveAttribute('data-home-hero-cta')
    expect(links[0]).not.toHaveAttribute('data-cta-intent')
    expect(screen.getByText('polaris_one.price.amount')).toBeInTheDocument()
    expect(screen.getAllByText('polaris_one.price.deposit').length).toBeGreaterThan(0)
  })

  it('does not fetch the film during the first render and shows the poster with priority', () => {
    const { container } = renderStage()
    const video = container.querySelector('video')
    expect(video).toHaveAttribute('preload', 'none')
    expect(video).not.toHaveAttribute('src')
    expect(video).toHaveAttribute('aria-label', 'polaris_one.film_label')
    const poster = container.querySelector('.p1s-frame img')
    expect(poster).toHaveAttribute('alt', '')
    expect(poster).toHaveAttribute('fetchpriority', 'high')
  })

  it('switches to the film with controls and the development note on start', async () => {
    const { container } = renderStage()
    fireEvent.click(screen.getByRole('button', { name: /polaris_one\.start/ }))
    const stage = container.querySelector('[data-home-hero]')
    expect(stage).toHaveAttribute('data-mode', 'play')
    expect(container.querySelector('[data-polaris-gate]')).toBeNull()
    expect(container.querySelector('video')?.getAttribute('src')).toMatch(
      /^\/media\/polaris-one\/polaris-one-(720|1080)\.mp4$/,
    )
    expect(
      await screen.findByRole('slider', { name: 'polaris_one.controls.timeline' }),
    ).toBeVisible()
    expect(screen.getByText('polaris_one.dev_note')).toBeVisible()
  })
})
