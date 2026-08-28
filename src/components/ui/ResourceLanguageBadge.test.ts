// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { resourceLanguageFromPath } from '../../lib/resourceLanguage'

describe('resourceLanguageFromPath', () => {
  it.each([
    ['de/01_Metabolic_Health_PolarisDX.pdf', 'de'],
    ['PolarisDX_Unterlagen_DE.zip', 'de'],
    ['PolarisDX_Musterbefunde_DE.zip', 'de'],
    ['en/01_Metabolic_Health_PolarisDX.pdf', 'en'],
    ['PolarisDX_Unterlagen_EN.zip', 'en'],
  ])('classifies %s as %s', (path, language) => {
    expect(resourceLanguageFromPath(path)).toBe(language)
  })
})
