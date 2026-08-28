// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.unmock('react-i18next')

import {
  BACKLOG_NAMESPACES,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  LEGACY_NAMESPACES,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
} from '../src/i18n'
import { clearTranslationCache, createI18nInstance } from '../src/i18n.server'

afterEach(() => {
  vi.unstubAllEnvs()
  clearTranslationCache()
})

describe('PT08.1 server i18n contract', () => {
  it('keeps the shared module browser- and node-neutral', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/i18n.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')

    expect(source).not.toMatch(/from\s+['"]node:/)
    expect(source).not.toMatch(/\b(?:window|document|localStorage|navigator)\s*[.[]/)
    expect(source).not.toMatch(/\b(?:process|__dirname|require)\s*[.([]/)
  })

  it('has one classified namespace file set in every locale', () => {
    const expectedFiles = [...NAMESPACES, ...LEGACY_NAMESPACES, ...BACKLOG_NAMESPACES]
      .map((namespace) => `${namespace}.json`)
      .sort()

    for (const locale of SUPPORTED_LANGUAGES) {
      const files = readdirSync(resolve(process.cwd(), 'public', 'locales', locale))
        .filter((file) => file.endsWith('.json'))
        .sort()
      expect(files).toEqual(expectedFiles)
    }
  })

  it('has no persisted or browser-detected primary locale source', () => {
    const participatingSources = [
      'src/i18n.client.ts',
      'src/entry-client.tsx',
      'src/components/ui/LanguageSwitcher.tsx',
    ].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8'))
    const executableSources = participatingSources.map((source) =>
      source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''),
    )

    for (const source of executableSources) {
      expect(source).not.toMatch(/\b(?:localStorage|sessionStorage|navigator\.language)\b/)
      expect(source).not.toMatch(/LanguageDetector|cookie\s*:/)
    }
  })

  it.each(SUPPORTED_LANGUAGES)('loads every productive namespace before %s SSR', async (locale) => {
    vi.stubEnv('NODE_ENV', 'test')
    const result = await createI18nInstance(locale)

    expect(result.language).toBe(locale)
    expect(result.instance.language).toBe(locale)
    expect(result.instance.options.fallbackLng).toEqual([FALLBACK_LANGUAGE])
    expect(result.fallbackNamespaces).toEqual([])
    expect(result.missingNamespaces).toEqual([])
    for (const namespace of NAMESPACES) {
      expect(result.instance.hasResourceBundle(locale, namespace)).toBe(true)
    }
  })

  it('handles an unknown locale deterministically with the regular default', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    const result = await createI18nInstance('xx')

    expect(result.language).toBe(DEFAULT_LANGUAGE)
    expect(result.instance.language).toBe(DEFAULT_LANGUAGE)
  })
})
