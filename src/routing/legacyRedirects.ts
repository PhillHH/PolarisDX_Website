import { articles } from '../data/articles'
import { services } from '../data/services'

export interface LegacyRedirectMigration {
  sourcePath: string
  targetPath: string
  evidence: 'PRIMARY_ALIAS' | 'ARTICLE_ID' | 'SERVICE_TRANSLATION_KEY'
}

/**
 * Path migrations that predate the current canonical URL vocabulary.
 *
 * Paths are stored without a locale prefix. The HTTP layer reuses a supported
 * source locale (or DE for an unprefixed source), retains the query string and
 * emits the final target in one hop. Fragments deliberately do not belong in
 * this table because an HTTP request never contains them.
 *
 * This is a redirect-source map, not a route registry. Current route existence
 * continues to come from the existing application/data sources until PT10.3.
 */
const primaryAliases: LegacyRedirectMigration[] = [
  { sourcePath: '/agb', targetPath: '/terms', evidence: 'PRIMARY_ALIAS' },
  {
    sourcePath: '/s3-leitlinie',
    targetPath: '/s3_leitlinie',
    evidence: 'PRIMARY_ALIAS',
  },
]

const articleIdMigrations: LegacyRedirectMigration[] = articles.map((article) => ({
  sourcePath: `/articles/${article.id}`,
  targetPath: `/articles/${article.slug}`,
  evidence: 'ARTICLE_ID',
}))

const serviceSlugMigrations: LegacyRedirectMigration[] = services.flatMap((service) => {
  if (service.translationKey === service.id) return []

  return [
    {
      sourcePath: `/diagnostics/${service.translationKey}`,
      targetPath: `/diagnostics/${service.id}`,
      evidence: 'SERVICE_TRANSLATION_KEY' as const,
    },
    {
      sourcePath: `/services/${service.translationKey}`,
      targetPath: `/diagnostics/${service.id}`,
      evidence: 'SERVICE_TRANSLATION_KEY' as const,
    },
  ]
})

export const LEGACY_REDIRECT_MIGRATIONS: readonly LegacyRedirectMigration[] = [
  ...primaryAliases,
  ...articleIdMigrations,
  ...serviceSlugMigrations,
]

const legacyRedirectTargets = new Map<string, string>()
for (const migration of LEGACY_REDIRECT_MIGRATIONS) {
  const previous = legacyRedirectTargets.get(migration.sourcePath)
  if (previous && previous !== migration.targetPath) {
    throw new Error(
      `Conflicting legacy redirect for ${migration.sourcePath}: ${previous} vs ${migration.targetPath}`,
    )
  }
  legacyRedirectTargets.set(migration.sourcePath, migration.targetPath)
}

export function getLegacyRedirectTarget(pathWithoutLocale: string): string | null {
  return legacyRedirectTargets.get(pathWithoutLocale) ?? null
}

/**
 * Repository-known URL candidates with no current, truthful successor.
 * They remain direct 404 responses; in particular none is softened to Home.
 */
export const INTENTIONAL_404_PATHS = [
  '/articles/first_checkup',
  '/articles/managing_diabetes',
  '/articles/home_care',
  '/consumer',
  '/shop',
  '/casestudys/32reasons',
  '/case-studies/32reasons',
  '/deal',
  '/voucher',
] as const
