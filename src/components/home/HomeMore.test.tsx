import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomeMore from './HomeMore'

describe('SC-025 FAQ and real article teasers', () => {
  it('uses the shared accessible accordion and the article source with registry routes', () => {
    render(
      <MemoryRouter>
        <HomeMore
          items={Array.from({ length: 4 }, (_, index) => ({
            question: `Question ${index + 1}`,
            answer: `Answer ${index + 1}`,
          }))}
        />
      </MemoryRouter>,
    )
    const faq = document.querySelector('#faq')!
    const questions = faq.querySelectorAll('button[aria-expanded]')
    expect(questions).toHaveLength(4)
    expect(questions[0]).toHaveAttribute('aria-expanded', 'true')
    expect(questions[1]).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('link', { name: /blog\.all_articles/ })).toHaveAttribute(
      'href',
      '/articles',
    )
    expect(screen.getByRole('link', { name: /blog\.all_articles/ })).toHaveAttribute(
      'data-home-secondary-conversion',
      'knowledge',
    )
  })
})
