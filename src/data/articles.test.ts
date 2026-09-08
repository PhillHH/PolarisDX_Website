// @vitest-environment node
/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { SUPPORTED_LANGUAGES } from '../i18n'
import { getArticleImageUrl } from '../assets/articleImages'
import { getCanonicalRouteEntries } from '../routing'
import type { ArticleContentByLocale } from '../content/articles/model'
import type { Article } from '../types'
import { articleInventory, articles, validateArticleMetadata } from './articles'

const staleLocaleOnlyIds = ['first_checkup', 'managing_diabetes', 'home_care'] as const

const localeDocument = (locale: string) =>
  JSON.parse(readFileSync(`public/locales/${locale}/articles.json`, 'utf8')) as Record<
    string,
    { title?: string; excerpt?: string; sections?: unknown[] }
  >

const articleContentDocument = (slug: string) =>
  JSON.parse(readFileSync(`src/content/articles/${slug}.json`, 'utf8')) as ArticleContentByLocale

describe('PT17.1 article inventory and published index contract', () => {
  it('exposes only explicitly published launch records with canonical slug identity', () => {
    expect(articleInventory).toHaveLength(6)
    expect(articles).toHaveLength(6)
    expect(articles.every(({ status }) => status === 'PUBLISHED_LAUNCH')).toBe(true)
    expect(new Set(articles.map(({ id }) => id)).size).toBe(articles.length)
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length)
    expect(() => validateArticleMetadata(articles)).not.toThrow()
    expect(articles.every(({ datePublished }) => /^\d{4}-\d{2}-\d{2}$/.test(datePublished))).toBe(
      true,
    )
    expect(articles.every(({ dateModified }) => dateModified === undefined)).toBe(true)
    expect(articles.every(({ reviewer }) => reviewer === undefined)).toBe(true)
    expect(articles.every(({ sources }) => sources === undefined)).toBe(true)

    const routes = getCanonicalRouteEntries().filter(
      ({ familyId }) => familyId === 'article-detail',
    )
    expect(routes.map(({ sourceId }) => sourceId)).toEqual(articles.map(({ id }) => id))
    expect(routes.map(({ path }) => path)).toEqual(articles.map(({ slug }) => `/articles/${slug}`))
  })

  it('hard-fails invented or malformed launch metadata', () => {
    const base = articles[0]
    const invalid = (patch: Partial<Article>) => [{ ...base, ...patch }] as Article[]

    expect(() => validateArticleMetadata(invalid({ datePublished: '2025-02-30' }))).toThrow(
      'invalid ISO datePublished',
    )
    expect(() => validateArticleMetadata(invalid({ dateModified: '2025-01-01' }))).toThrow(
      'dateModified precedes datePublished',
    )
    expect(() => validateArticleMetadata(invalid({ author: ' ' }))).toThrow('author is required')
    expect(() => validateArticleMetadata(invalid({ reviewer: ' ' }))).toThrow(
      'reviewer must be omitted',
    )
    expect(() => validateArticleMetadata(invalid({ sources: [] }))).toThrow(
      'sources must be omitted',
    )
    expect(() =>
      validateArticleMetadata(
        invalid({ sources: [{ title: 'Approved source', url: 'not-a-valid-url' }] }),
      ),
    ).toThrow()
  })

  it('keeps locale-only stale content outside the public inventory and Registry', () => {
    const publicPaths = new Set(
      getCanonicalRouteEntries()
        .filter(({ familyId }) => familyId === 'article-detail')
        .map(({ path }) => path),
    )

    for (const locale of SUPPORTED_LANGUAGES) {
      const resource = localeDocument(locale)
      for (const id of staleLocaleOnlyIds) {
        expect(resource[id], `${locale}/${id}: evidenced locale remnant`).toBeDefined()
        expect(articleInventory.some((article) => article.id === id)).toBe(false)
        expect(publicPaths.has(`/articles/${id}`)).toBe(false)
      }
    }
  })

  it('has complete, non-empty and independently localized launch content in all ten locales', () => {
    for (const article of articles) {
      const content = articleContentDocument(article.slug)
      expect(Object.keys(content).sort()).toEqual([...SUPPORTED_LANGUAGES].sort())

      const localizedDocuments = SUPPORTED_LANGUAGES.map((locale) => {
        const metadata = localeDocument(locale)[article.id]
        const localizedBody = content[locale]
        expect(metadata?.title?.trim(), `${locale}/${article.id}: title`).toBeTruthy()
        expect(metadata?.excerpt?.trim(), `${locale}/${article.id}: excerpt`).toBeTruthy()
        expect(
          metadata?.sections,
          `${locale}/${article.id}: body is not eager metadata`,
        ).toBeUndefined()
        expect(localizedBody.sections.length, `${locale}/${article.id}: lazy body`).toBeGreaterThan(
          0,
        )
        return JSON.stringify({ metadata, localizedBody })
      })
      expect(new Set(localizedDocuments).size, `${article.id}: no exact DE/EN fallback`).toBe(
        SUPPORTED_LANGUAGES.length,
      )
    }
  })

  it('resolves every declared card image and leaves image-free articles explicit', () => {
    const withImage = articles.filter((article) => article.sections[0]?.image)
    const withoutImage = articles.filter((article) => !article.sections[0]?.image)
    expect(withImage).toHaveLength(4)
    expect(
      withImage.every((article) => Boolean(getArticleImageUrl(article.sections[0]?.image))),
    ).toBe(true)
    expect(withoutImage.map(({ id }) => id)).toEqual([
      'rapid_setup_formula',
      'precision_point_of_care',
    ])
  })
})
