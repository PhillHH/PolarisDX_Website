import { describe, expect, it } from 'vitest'

import {
  BACKLOG_NAMESPACES,
  DEFAULT_LANGUAGE,
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  FALLBACK_NS,
  LEGACY_NAMESPACES,
  NAMESPACES,
  PRODUCTIVE_NAMESPACES,
  SUPPORTED_LANGUAGES,
  extractLanguageFromPathname,
  getLanguageFromPathname,
  i18nConfig,
  normalizeLanguage,
} from './i18n'
import { ENGLISH_FALLBACK_STATUS, isEnglishFallback } from './lib/translationStatus'

describe('PT08.1 shared i18n contract', () => {
  it('defines exactly the ten decision-locked languages', () => {
    expect(SUPPORTED_LANGUAGES).toEqual([
      'de',
      'en',
      'pl',
      'fr',
      'it',
      'es',
      'pt',
      'da',
      'nl',
      'cs',
    ])
    expect(new Set(SUPPORTED_LANGUAGES).size).toBe(10)
    expect(i18nConfig.supportedLngs).toBe(SUPPORTED_LANGUAGES)
  })

  it('keeps default and defensive fallback as separate concepts', () => {
    expect(DEFAULT_LANGUAGE).toBe('de')
    expect(FALLBACK_LANGUAGE).toBe('en')
    expect(i18nConfig.fallbackLng).toBe(FALLBACK_LANGUAGE)
    expect(DEFAULT_NS).toBe('home')
    expect(FALLBACK_NS).toBe('common')
  })

  it('publishes one productive namespace list and keeps backlog namespaces inactive', () => {
    expect(NAMESPACES).toBe(PRODUCTIVE_NAMESPACES)
    expect(PRODUCTIVE_NAMESPACES).toEqual([
      'common',
      'home',
      'about',
      'articles',
      'contact',
      'services',
      'events',
      'downloads',
      'epigenetics',
      'legal',
      'products',
      'support',
      'vitd3spray',
      'specialty',
      'consumer',
    ])
    expect(LEGACY_NAMESPACES).toEqual([])
    expect(BACKLOG_NAMESPACES).toEqual(['casestudies', 'shop'])
    expect(PRODUCTIVE_NAMESPACES).not.toContain('casestudies')
    expect(PRODUCTIVE_NAMESPACES).not.toContain('shop')
  })

  it('normalizes explicit language codes without creating another locale', () => {
    expect(normalizeLanguage('DE-de')).toBe('de')
    expect(normalizeLanguage('en-GB')).toBe('en')
    expect(normalizeLanguage('xx')).toBe(DEFAULT_LANGUAGE)
    expect(normalizeLanguage(undefined)).toBe(DEFAULT_LANGUAGE)
  })

  it('distinguishes a canonical URL prefix from a safe default', () => {
    expect(getLanguageFromPathname('/pl/diagnostics')).toBe('pl')
    expect(getLanguageFromPathname('/xx/diagnostics')).toBeNull()
    expect(getLanguageFromPathname('/de-DE/diagnostics')).toBeNull()
    expect(getLanguageFromPathname('/diagnostics')).toBeNull()
    expect(extractLanguageFromPathname('/xx/diagnostics')).toBe(DEFAULT_LANGUAGE)
  })

  it('recognizes only the explicit English-fallback marker', () => {
    expect(isEnglishFallback(ENGLISH_FALLBACK_STATUS)).toBe(true)
    expect(isEnglishFallback('translated')).toBe(false)
    expect(isEnglishFallback('')).toBe(false)
    expect(isEnglishFallback(undefined)).toBe(false)
  })
})
