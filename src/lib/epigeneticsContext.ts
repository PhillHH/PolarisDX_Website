import { BEFUND_ORDER } from '../content/befunde/meta'

/**
 * Shareable UI context for the existing Epigenetics route family.
 *
 * This is deliberately not a route or content source. It only validates the
 * two query values used by the Hub journey and builds links to routes that
 * continue to come from the AP10 registry.
 */
export const EPIGENETICS_FOCUS_KEYS = [
  'longevity',
  'nutrition',
  'sports',
  'bgm',
  'practice',
] as const

export type EpigeneticsFocus = (typeof EPIGENETICS_FOCUS_KEYS)[number]
export type EpigeneticsPanel = (typeof BEFUND_ORDER)[number]
export type EpigeneticsInquirySource = 'epigenetics' | 'musterbefund'

export interface EpigeneticsContext {
  focus: EpigeneticsFocus | null
  panel: EpigeneticsPanel | null
}

const includes = <T extends string>(values: readonly T[], value: string | null): value is T =>
  value !== null && values.includes(value as T)

const campaignValue = (campaign: string): string => campaign.trim().slice(0, 128)

export const readEpigeneticsInquirySource = (
  params: Pick<URLSearchParams, 'get'>,
): EpigeneticsInquirySource =>
  params.get('source') === 'musterbefund' ? 'musterbefund' : 'epigenetics'

export const readEpigeneticsContext = (
  params: Pick<URLSearchParams, 'get'>,
): EpigeneticsContext => {
  const focus = params.get('focus')
  const panel = params.get('panel')

  return {
    focus: includes(EPIGENETICS_FOCUS_KEYS, focus) ? focus : null,
    panel: includes(BEFUND_ORDER, panel) ? panel : null,
  }
}

const contextQuery = ({ focus, panel }: Partial<EpigeneticsContext>, campaign = ''): string => {
  const params = new URLSearchParams()
  if (panel && includes(BEFUND_ORDER, panel)) params.set('panel', panel)
  if (focus && includes(EPIGENETICS_FOCUS_KEYS, focus)) params.set('focus', focus)
  const safeCampaign = campaignValue(campaign)
  if (safeCampaign) params.set('campaign', safeCampaign)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const epigeneticsHubHref = (
  context: Partial<EpigeneticsContext> = {},
  anchor: 'vergleich' | 'analysen' | 'musterbefunde' = 'analysen',
  campaign = '',
): string => `/epigenetics${contextQuery(context, campaign)}#${anchor}`

export const musterbefundHref = (
  panel: EpigeneticsPanel,
  focus: EpigeneticsFocus | null = null,
  campaign = '',
): string => `/epigenetics/musterbefund/${panel}${contextQuery({ panel, focus }, campaign)}`

export const epigeneticsInquiryHref = (
  panel: EpigeneticsPanel | null = null,
  focus: EpigeneticsFocus | null = null,
  campaign = '',
  source: EpigeneticsInquirySource = 'epigenetics',
): string => {
  const params = new URLSearchParams({ source })
  if (panel) params.set('panel', panel)
  if (focus) params.set('focus', focus)
  const safeCampaign = campaignValue(campaign)
  if (safeCampaign) params.set('campaign', safeCampaign)
  return `/epigenetics?${params.toString()}#inquiry`
}
