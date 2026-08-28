import { describe, expect, it } from 'vitest'

import { createProductSchema } from './structuredData'

describe('PT09.3 Consumer Product schema contract', () => {
  it('mirrors localized visible truth without inventing commercial fields', () => {
    const schema = createProductSchema({
      name: 'Inside-Out Care Duo',
      description: 'Visible localized product description.',
      image: '/assets/duo.jpeg',
      url: '/consumer/inside-out-duo',
      language: 'pl',
    })

    expect(schema).toMatchObject({
      '@type': 'Product',
      '@id': 'https://polarisdx.net/pl/consumer/inside-out-duo#product',
      image: 'https://polarisdx.net/assets/duo.jpeg',
      url: 'https://polarisdx.net/pl/consumer/inside-out-duo',
      inLanguage: 'pl',
    })
    expect(schema).not.toHaveProperty('offers')
    expect(schema).not.toHaveProperty('sku')
    expect(schema).not.toHaveProperty('gtin')
    expect(schema).not.toHaveProperty('aggregateRating')
    expect(schema).not.toHaveProperty('review')
  })
})
