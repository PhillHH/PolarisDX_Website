import type { ReactNode } from 'react'

export type ProductCategory =
  | 'Diagnostics'
  | 'Monitoring'
  | 'Home Care'
  | 'Chronic Care'
  | 'Protection'
  | 'Hygiene'
  | 'Recovery'
  | 'Emergency'
  | 'Service'

export type ProductBadge = 'New' | 'Popular' | 'Limited'

export interface TechSpec {
  parameter: string
  specification: string
}

export interface Product {
  id: string
  slug: string
  category: ProductCategory
  price: number
  badge?: ProductBadge
  image?: string
}

export type ArticleCategory = 'Sustainability' | 'Telemedicine' | 'Economics' | 'Health Article'

export type ArticlePublicationStatus = 'PUBLISHED_LAUNCH' | 'DRAFT_OR_NON_PUBLIC'

export type IsoCalendarDate = `${number}-${number}-${number}`

export interface ArticleSection {
  heading?: string
  paragraphs: string[]
  listItems?: string[]
  image?: string
}

export interface ArticleSource {
  title: string
  url?: string
}

export interface Article {
  id: string
  slug: string
  status: ArticlePublicationStatus
  category: ArticleCategory
  author: string
  /** Canonical content date. Display formatting is locale-specific and never stored here. */
  datePublished: IsoCalendarDate
  /** Present only when a real approved modification date exists. */
  dateModified?: IsoCalendarDate
  reviewer?: string
  readTime: string
  imageAlt?: string
  imageCaption?: string
  sources?: readonly ArticleSource[]
  sections: ArticleSection[]
  relatedServiceIds?: ServiceId[]
}

export type ServiceId =
  | 'dental'
  | 'beauty'
  | 'longevity'
  | 'poc-systemloesungen'
  | 'praeventions-checks'
  | 'infektion-entzuendung'
  | 'stoffwechsel-herz'
  | 'hormon-tests'
  | 'kompatibilitaet-integration'

export type DiagnosticsHubCategory = 'PRACTICE_CONTEXT' | 'DIAGNOSTIC_WORKFLOW'

export type DiagnosticsHubPriority = 'PRIMARY' | 'STANDARD'

export type DiagnosticsSpecialtyTag =
  | 'DENTAL'
  | 'BEAUTY'
  | 'LONGEVITY'
  | 'PREVENTION'
  | 'CLINICAL_QUESTION'
  | 'SYSTEM_SOLUTION'
  | 'INTEGRATION'

export type ServiceDetailCrosslink = {
  /** Stable content key; localized labels stay in the existing services namespace. */
  id: string
  /** Static AP10 Route Registry ID. Never a local path mirror. */
  routeId: 'implantology' | 'igloo-pro' | 'epigenetics'
}

export interface Service {
  id: ServiceId
  title: string
  description: string
  translationKey: string
  icon?: ReactNode
  relatedArticleIds?: string[]
  hubCategory: DiagnosticsHubCategory
  hubPriority: DiagnosticsHubPriority
  specialtyTags: readonly DiagnosticsSpecialtyTag[]
  /** Existing localized overview tag key reused by the service-detail template. */
  detailParameterKey?: string
  /** Some established service pages use their localized headline as the single H1. */
  detailTitleSource?: 'title' | 'headline'
  /** Optional, Registry-resolved context links for the shared AP13 template. */
  detailCrosslinks?: readonly ServiceDetailCrosslink[]
}

export interface Testimonial {
  id: string
  role: string
  name: string
  title: string
  focus: string
  text: string
  avatar?: string
  rating?: number
}

export interface BlogPost {
  id: string
  slug: string
  image?: string
}

export interface SocialLink {
  label: string
  href: string
  icon: ReactNode
}

export interface AgbSection {
  id: string
  title: string
  content: string[]
}

export interface AgbData {
  title: string
  subtitle: string
  date: string
  sections: AgbSection[]
}
