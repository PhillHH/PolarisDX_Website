export const HOMEPAGE_SALES_SOURCE = 'homepage' as const
export const HOMEPAGE_SALES_JOURNEY = 'general_sales' as const

export const HOMEPAGE_SALES_SECTIONS = ['hero', 'roi', 'final_cta'] as const
export type HomepageSalesSection = (typeof HOMEPAGE_SALES_SECTIONS)[number]

export interface HomepageSalesContext {
  source: typeof HOMEPAGE_SALES_SOURCE
  journey: typeof HOMEPAGE_SALES_JOURNEY
  section: HomepageSalesSection
}

export function getHomepageSalesContext(section: HomepageSalesSection): HomepageSalesContext {
  return {
    source: HOMEPAGE_SALES_SOURCE,
    journey: HOMEPAGE_SALES_JOURNEY,
    section,
  }
}

export function getHomepageSalesTarget(section: HomepageSalesSection): string {
  const context = getHomepageSalesContext(section)
  const params = new URLSearchParams({
    intent: 'quote',
    source: context.source,
    journey: context.journey,
    section: context.section,
  })
  return `/contact?${params.toString()}#kontaktformular`
}

/**
 * Accept only the explicit Homepage GENERAL_SALES contract. URL values are
 * never forwarded merely because a caller supplied them.
 */
export function resolveHomepageSalesContext(
  params: Pick<URLSearchParams, 'get'>,
): HomepageSalesContext | null {
  const source = params.get('source')
  const journey = params.get('journey')
  const section = params.get('section')

  if (
    source !== HOMEPAGE_SALES_SOURCE ||
    journey !== HOMEPAGE_SALES_JOURNEY ||
    !HOMEPAGE_SALES_SECTIONS.includes(section as HomepageSalesSection)
  ) {
    return null
  }

  return getHomepageSalesContext(section as HomepageSalesSection)
}
