import type { ReactNode } from 'react'
import type { FAQItem } from '../seo'
import type { SidebarWidget } from '../sections/PageSidebar'
import type { HeroValueChip } from '../sections/SubpageHero'
import type { ServiceDetailEntry } from '../../data/serviceDetail'

export type ServiceDetailTextSection = {
  id: string
  heading?: string
  content?: string
  paragraphs?: string[]
  items?: string[]
}

export type ServiceDetailWorkflow = {
  heading: string
  steps: Array<{ title: string; text?: string }>
}

export type ServiceDetailProof = {
  heading: string
  intro?: string
  items: Array<{ value?: string; label: string; text?: string }>
}

export type ServiceDetailRelatedLink = {
  id: string
  label: string
  to: string
  description?: string
}

/**
 * Reusable AP13 content contract. Optional fields must be omitted when no
 * approved evidence exists; the renderer never manufactures placeholder copy.
 */
export type ServiceDetailContent = {
  hero: {
    eyebrow?: string
    title: string
    subtitle?: string
    icon?: ReactNode
    chips?: string[]
    gauge?: string
    valueChips?: HeroValueChip[]
  }
  problem?: ServiceDetailTextSection
  audiences?: ServiceDetailTextSection
  questions?: ServiceDetailTextSection
  parameters?: ServiceDetailTextSection
  workflow?: ServiceDetailWorkflow
  proof?: ServiceDetailProof
  detailSections?: ServiceDetailTextSection[]
  conclusion?: ServiceDetailTextSection
  faq?: { caption?: string; title: string; items: FAQItem[] }
  related?: ServiceDetailRelatedLink[]
  crosslinks?: ServiceDetailRelatedLink[]
  disclaimer?: ServiceDetailTextSection
  /** Transitional rendering only; the nine PT13 content tasks remove it family by family. */
  legacyRichContent?: string
  seo: { title: string; description: string; image?: string; imageAlt?: string }
}

export type ServiceDetailLabels = {
  home: string
  diagnostics: string
  primaryCta: string
  helpTitle: string
  helpText: string
  introEyebrow: string
  parametersLabel: string
  detailEyebrow: string
  conclusionEyebrow: string
}

export type ServiceDetailViewModel = {
  entry: ServiceDetailEntry
  content: ServiceDetailContent
  labels: ServiceDetailLabels
  stats: Array<{ value: string; label: string }>
  sidebarWidgets: SidebarWidget[]
}
