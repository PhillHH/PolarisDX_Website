import { describe, expect, it } from 'vitest'

import { buildLanguageSwitchUrl } from './localeRoute'

describe('PT08.4 locale route switching', () => {
  it('keeps the same static logical page', () => {
    expect(buildLanguageSwitchUrl({ pathname: '/support' }, 'fr')).toBe('/fr/support')
  })

  it('keeps neutral dynamic slugs', () => {
    expect(
      buildLanguageSwitchUrl({ pathname: '/epigenetics/musterbefund/metabolic-health' }, 'pl'),
    ).toBe('/pl/epigenetics/musterbefund/metabolic-health')
  })

  it('preserves query and hash', () => {
    expect(
      buildLanguageSwitchUrl(
        {
          pathname: '/epigenetics',
          search: '?source=language-switch',
          hash: '#musterbefunde',
        },
        'cs',
      ),
    ).toBe('/cs/epigenetics?source=language-switch#musterbefunde')
  })

  it('replaces an existing locale prefix without duplicating it', () => {
    expect(buildLanguageSwitchUrl({ pathname: '/de/articles/die-gruene-praxis' }, 'en')).toBe(
      '/en/articles/die-gruene-praxis',
    )
  })

  it('keeps the home route canonical', () => {
    expect(buildLanguageSwitchUrl({ pathname: '/' }, 'da')).toBe('/da/')
  })
})
