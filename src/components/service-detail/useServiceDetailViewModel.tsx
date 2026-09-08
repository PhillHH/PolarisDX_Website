import { useTranslation } from 'react-i18next'
import { articles } from '../../data/articles'
import {
  getServiceDetailArticleRoute,
  getServiceDetailStaticRoute,
  serviceDetailEntries,
  type ServiceDetailEntry,
} from '../../data/serviceDetail'
import type { FAQItem } from '../seo'
import type { SidebarWidget } from '../sections/PageSidebar'
import type {
  ServiceDetailContent,
  ServiceDetailTextSection,
  ServiceDetailViewModel,
} from './model'

type ExistingSection = { heading?: string; content?: string; listItems?: string[] }
type ExistingConclusion = { heading?: string; text?: string }
type PageStat = { value: string; label: string }
type StructuredTextSection = {
  heading?: string
  content?: string
  paragraphs?: string[]
  items?: string[]
}
type StructuredWorkflow = { heading?: string; steps?: Array<{ title?: string; text?: string }> }
type StructuredFaq = { caption?: string; title?: string; items?: FAQItem[] }
type StructuredDetail = {
  hero?: { eyebrow?: string; title?: string; subtitle?: string }
  problem?: StructuredTextSection
  audiences?: StructuredTextSection
  questions?: StructuredTextSection
  parameters?: StructuredTextSection
  workflow?: StructuredWorkflow
  faq?: StructuredFaq
  crosslinks?: Record<string, { label?: string; description?: string }>
  cta?: { title?: string; text?: string }
  disclaimer?: StructuredTextSection
  seo?: { title?: string; description?: string; imageAlt?: string }
}

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const asSections = (value: unknown): ExistingSection[] =>
  Array.isArray(value) ? (value as ExistingSection[]) : []

const asStructuredDetail = (value: unknown): StructuredDetail | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as StructuredDetail)
    : undefined

const asTextSection = (
  id: string,
  value?: StructuredTextSection,
): ServiceDetailTextSection | undefined => {
  if (!value) return undefined
  const paragraphs = asStringArray(value.paragraphs)
  const items = asStringArray(value.items)
  if (!value.heading && !value.content && !paragraphs.length && !items.length) return undefined
  return {
    id,
    heading: value.heading,
    content: value.content,
    paragraphs: paragraphs.length ? paragraphs : undefined,
    items: items.length ? items : undefined,
  }
}

const truncateAtWord = (text: string, max: number) => {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const body = lastSpace > 60 ? cut.slice(0, lastSpace) : cut
  return body.replace(/[-–—\s.,;:]+$/, '') + '…'
}

/** Projects the existing x10 services namespace into the reusable AP13 template model. */
export function useServiceDetailViewModel(entry: ServiceDetailEntry): ServiceDetailViewModel {
  const { service } = entry
  const { t } = useTranslation(['services', 'common', 'home', 'articles'])
  const key = service.translationKey
  const title = t(`services:${key}.title`, service.title)
  const headline = t(`services:${key}.headline`, { defaultValue: '', fallbackLng: false })
  const pageTitle = service.detailTitleSource === 'headline' && headline ? headline : title
  const structuredDetail = asStructuredDetail(
    t(`services:${key}.detail`, {
      returnObjects: true,
      defaultValue: undefined,
      fallbackLng: false,
    }),
  )
  const intro = asStringArray(
    t(`services:${key}.intro`, { returnObjects: true, defaultValue: [], fallbackLng: false }),
  )
  const currentSections = asSections(
    t(`services:${key}.sections`, { returnObjects: true, defaultValue: [], fallbackLng: false }),
  )
  const conclusionRaw = t(`services:${key}.conclusion`, {
    returnObjects: true,
    defaultValue: {},
    fallbackLng: false,
  }) as ExistingConclusion
  const richRaw = t(`services:${key}.richContent`, { defaultValue: '', fallbackLng: false })
  const legacyRichContent =
    !structuredDetail && typeof richRaw === 'string' && richRaw.length > 10 ? richRaw : undefined
  const faqItemsRaw = t(`services:${key}.faq.items`, {
    returnObjects: true,
    defaultValue: [],
    fallbackLng: false,
  })
  const faqItems = Array.isArray(faqItemsRaw) ? (faqItemsRaw as FAQItem[]) : []
  const parameterTags = service.detailParameterKey
    ? asStringArray(
        t(`services:${service.detailParameterKey}`, {
          returnObjects: true,
          defaultValue: [],
          fallbackLng: false,
        }),
      )
    : []
  const statsRaw = t('services:overview.page.stats', {
    returnObjects: true,
    defaultValue: [],
    fallbackLng: false,
  })
  const stats = Array.isArray(statsRaw) ? (statsRaw as PageStat[]) : []

  const problem: ServiceDetailTextSection | undefined = structuredDetail
    ? asTextSection('overview', structuredDetail.problem)
    : intro.length
      ? {
          id: 'overview',
          heading: t('services:overview.page.intro_eyebrow'),
          paragraphs: intro,
        }
      : undefined
  const parameters: ServiceDetailTextSection | undefined = structuredDetail
    ? asTextSection('parameters', structuredDetail.parameters)
    : parameterTags.length
      ? {
          id: 'parameters',
          heading: t('services:overview.page.biomarkers_label'),
          items: parameterTags,
        }
      : undefined
  const detailSections = currentSections.map((section, index) => ({
    id: `detail-${index + 1}`,
    heading: section.heading,
    content: section.content,
    items: section.listItems,
  }))
  const conclusion =
    !structuredDetail && (conclusionRaw?.heading || conclusionRaw?.text)
      ? {
          id: 'conclusion',
          heading: conclusionRaw.heading,
          content: conclusionRaw.text,
        }
      : undefined
  const ownDescription = t(`services:${key}.seo.description`, {
    defaultValue: '',
    fallbackLng: false,
  })
  const seoDescriptionFallback = intro[0] ? truncateAtWord(intro[0], 155) : headline || pageTitle

  const mappedArticles = service.relatedArticleIds?.length
    ? articles.filter((article) => service.relatedArticleIds?.includes(article.id)).slice(0, 3)
    : []
  const related = structuredDetail
    ? mappedArticles.map((article) => ({
        id: article.id,
        label: t(`articles:${article.id}.title`),
        to: getServiceDetailArticleRoute(article.id).path,
      }))
    : undefined
  const crosslinks = structuredDetail
    ? service.detailCrosslinks?.map((crosslink) => {
        const localized = structuredDetail.crosslinks?.[crosslink.id]
        return {
          id: crosslink.id,
          label: localized?.label || crosslink.id,
          description: localized?.description,
          to: getServiceDetailStaticRoute(crosslink.routeId).path,
        }
      })
    : undefined
  const workflowSteps = structuredDetail?.workflow?.steps
    ?.filter((step): step is { title: string; text?: string } => Boolean(step.title))
    .map((step) => ({ title: step.title, text: step.text }))

  const sidebarWidgets: SidebarWidget[] = [
    {
      kind: 'services',
      titleKey: 'home:services.title',
      items: serviceDetailSiblingItems(entry),
    },
    ...(mappedArticles.length
      ? [
          {
            kind: 'articles' as const,
            titleKey: 'articles:index.title',
            variant: 'plain' as const,
            items: mappedArticles.map((article) => ({
              id: article.id,
              slug: article.slug,
              category: article.category,
              readTime: article.readTime,
              datePublished: article.datePublished,
            })),
          },
        ]
      : []),
    { kind: 'epigenetics' },
    { kind: 'contact' },
  ]

  const content: ServiceDetailContent = {
    hero: {
      eyebrow: structuredDetail?.hero?.eyebrow || t('home:services.caption'),
      title: structuredDetail?.hero?.title || pageTitle,
      subtitle:
        structuredDetail?.hero?.subtitle ||
        (headline && headline !== pageTitle ? headline : undefined),
      icon: service.icon,
      chips: structuredDetail
        ? undefined
        : [
            t('services:overview.hero.chip_cv'),
            t('services:overview.hero.chip_results'),
            t('services:overview.hero.chip_lfa'),
          ],
      gauge: structuredDetail ? undefined : t('services:overview.hero.visual.gauge'),
      valueChips: structuredDetail
        ? undefined
        : [
            {
              value: t('services:overview.hero.visual.vitd_name'),
              label: t('services:overview.hero.visual.vitd_val'),
            },
            {
              value: t('services:overview.hero.visual.time_val'),
              label: t('services:overview.hero.visual.time_label'),
            },
            {
              value: t('services:overview.hero.visual.crp_name'),
              label: t('services:overview.hero.visual.crp_val'),
            },
          ],
    },
    problem,
    audiences: asTextSection('audiences', structuredDetail?.audiences),
    questions: asTextSection('questions', structuredDetail?.questions),
    parameters,
    detailSections: structuredDetail
      ? undefined
      : detailSections.length
        ? detailSections
        : undefined,
    workflow:
      structuredDetail?.workflow?.heading && workflowSteps?.length
        ? { heading: structuredDetail.workflow.heading, steps: workflowSteps }
        : undefined,
    conclusion,
    faq:
      structuredDetail?.faq?.title && structuredDetail.faq.items?.length
        ? {
            caption: structuredDetail.faq.caption,
            title: structuredDetail.faq.title,
            items: structuredDetail.faq.items,
          }
        : !structuredDetail && faqItems.length
          ? {
              caption: t(`services:${key}.faq.caption`, { fallbackLng: false }),
              title: t(`services:${key}.faq.title`, { fallbackLng: false }),
              items: faqItems,
            }
          : undefined,
    related,
    crosslinks,
    disclaimer: asTextSection('disclaimer', structuredDetail?.disclaimer),
    legacyRichContent,
    seo: {
      title: structuredDetail?.seo?.title || t(`services:${key}.seo.title`, title),
      description:
        structuredDetail?.seo?.description ||
        (typeof ownDescription === 'string' && ownDescription
          ? ownDescription
          : seoDescriptionFallback),
      imageAlt: structuredDetail?.seo?.imageAlt || pageTitle,
    },
  }

  return {
    entry,
    content,
    labels: {
      home: t('common:nav.home'),
      diagnostics: t('services:overview.hero.title'),
      primaryCta: t('home:hero.cta'),
      helpTitle: structuredDetail?.cta?.title || t('home:igloo_widget.help_title'),
      helpText: structuredDetail?.cta?.text || t('home:igloo_widget.help_text'),
      introEyebrow: t('services:overview.page.intro_eyebrow'),
      parametersLabel: t('services:overview.page.biomarkers_label'),
      detailEyebrow: t('services:overview.page.sections_eyebrow'),
      conclusionEyebrow: t('services:overview.page.conclusion_eyebrow'),
    },
    stats: structuredDetail ? [] : stats,
    sidebarWidgets,
  }
}

function serviceDetailSiblingItems(entry: ServiceDetailEntry) {
  return serviceDetailEntries
    .filter(({ service }) => service.id !== entry.service.id)
    .map(({ service, route }) => ({
      id: service.id,
      to: route.path,
      translationKey: service.translationKey,
      title: service.title,
      icon: service.icon,
    }))
}
