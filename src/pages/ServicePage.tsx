import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tooth } from '../components/ui/icons/Tooth'
import { Sparkles, Infinity as InfinityIcon, Check } from 'lucide-react'
import {
  SEOHead,
  createServiceSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  type FAQItem,
} from '../components/seo'
import { services } from '../data/services'
import { articles } from '../data/articles'
import FAQSection from '../components/sections/FAQSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import PageSidebar, { type SidebarWidget } from '../components/sections/PageSidebar'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'

// Helper function to render text with internal links
// Supports syntax: [[link text|/path]]
const renderTextWithLinks = (text: string) => {
  const linkRegex = /\[\[([^\]|]+)\|([^\]]+)\]\]/g
  const parts: (string | ReactNode)[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    // Add the link
    parts.push(
      <Link
        key={match.index}
        to={match[2]}
        className="font-semibold text-brand-primary hover:underline"
      >
        {match[1]}
      </Link>,
    )
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

type ServiceSection = {
  heading?: string
  content?: string
  listItems?: string[]
}

type ServiceConclusion = {
  heading?: string
  text?: string
}

// Slug-based SEO overrides for optimized titles & descriptions
const serviceSeoOverrides: Record<string, { title: string; description: string }> = {
  dental: {
    title: 'Blutdiagnostik Zahnarztpraxis: Chairside Testing Igloo Pro | PolarisDX',
    description:
      'Chairside Bluttest für Implantologie & Parodontitis. Vitamin D, CRP, HbA1c in 3 Min. S3-Leitlinie empfiehlt In-office-Schnelltests. Jetzt informieren.',
  },
  beauty: {
    title: 'Beauty-Diagnostik: Biomarker für Ästhetische Medizin | PolarisDX',
    description:
      'Hormondiagnostik & Mikronährstoff-Analyse direkt in der Praxis. Schilddrüse, Vitamin D, Ferritin — als IGeL-Leistung abrechenbar. Jetzt testen.',
  },
  longevity: {
    title: 'Longevity-Diagnostik: Präventive Biomarker-Analyse | PolarisDX',
    description:
      'Entzündungsmarker, Hormonstatus & Gesundheitscheck in 3 Min. POC-Diagnostik für Longevity-Kliniken und Präventionsmedizin. Demo anfragen.',
  },
  'poc-systemloesungen': {
    title: 'POCT-Systemlösungen für Praxen & Kliniken | PolarisDX',
    description:
      'Komplette POC-Diagnostik Infrastruktur: IglooPro Reader, Testkassetten, LIS/HIS-Integration & Schulung. Praxislabor schlüsselfertig einrichten.',
  },
}

const ServicePage = () => {
  const { t } = useTranslation(['services', 'common', 'home', 'articles'])
  const { slug } = useParams<{ slug: string }>()

  // Find service by slug (assuming slug maps to ID, or we check mapping)
  // In services.ts, id is 'poc-systemloesungen' etc. which matches our URL slug plan.
  const service = services.find((s) => s.id === slug)

  if (!service) {
    return <div className="p-20 text-center">Service not found</div>
  }

  // Determine translation key from service data
  const transKey = service.translationKey // e.g., 'poc_systemloesungen'

  const title = t(`services:${transKey}.title`, service.title)
  const headline = t(`services:${transKey}.headline`, '')
  const intro = t(`services:${transKey}.intro`, { returnObjects: true }) as string[]
  const sections = t(`services:${transKey}.sections`, { returnObjects: true }) as ServiceSection[]
  const conclusion = t(`services:${transKey}.conclusion`, {
    returnObjects: true,
  }) as ServiceConclusion

  // Rich HTML content support (for pillar pages like dental)
  const richContentRaw = t(`services:${transKey}.richContent`, '')
  const richContent =
    typeof richContentRaw === 'string' && richContentRaw.length > 10 ? richContentRaw : ''
  const hasRichContent = !!richContent

  // Load FAQ data (graceful fallback: no FAQ rendered if data missing)
  const faqItemsRaw = t(`services:${transKey}.faq.items`, { returnObjects: true })
  const faqItems: FAQItem[] = Array.isArray(faqItemsRaw) ? faqItemsRaw : []
  const hasFaq = faqItems.length > 0
  const faqCaption = hasFaq ? t(`services:${transKey}.faq.caption`, 'FAQ') : ''
  const faqTitle = hasFaq ? t(`services:${transKey}.faq.title`, 'Häufige Fragen') : ''

  const otherServices = services.filter((s) => s.id !== service.id)
  const mapped = service.relatedArticleIds?.length
    ? articles.filter((a) => service.relatedArticleIds!.includes(a.id))
    : []
  const relatedArticles = mapped.length > 0 ? mapped.slice(0, 3) : articles.slice(0, 3)

  // Use slug-based SEO overrides when available, otherwise fall back to dynamic generation
  const seoOverride = slug ? serviceSeoOverrides[slug] : undefined
  const seoTitle = seoOverride?.title ?? `${title} | PolarisDX`
  const seoDescription =
    seoOverride?.description ??
    (Array.isArray(intro) && intro.length > 0
      ? intro[0].substring(0, 155) + '...'
      : `${title} - Point-of-Care Diagnostik von PolarisDX für Ihre Praxis.`)

  return (
    <PageTransition>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={[title, 'POC Diagnostik', 'Schnelltest', 'Point-of-Care', service.title]}
        structuredData={[
          createServiceSchema({
            name: title,
            description: seoDescription,
            url: `/diagnostics/${slug}`,
          }),
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Diagnostik', url: '/diagnostics' },
            { name: title, url: `/diagnostics/${slug}` },
          ]),
          ...(hasFaq ? [createFAQSchema(faqItems)] : []),
        ]}
      />
      <SubpageHero
        breadcrumbs={[
          { label: t('common:nav.home', 'Home'), href: '/' },
          { label: t('services:overview.hero.title', 'Diagnostik'), href: '/diagnostics' },
          { label: title },
        ]}
        eyebrow={t('home:services.caption', 'Diagnostik-Fokus')}
        title={title}
        subtitle={headline || undefined}
        primaryCta={{ label: t('home:hero.cta', 'Beratung buchen'), to: '/contact' }}
        chips={[
          t('services:overview.hero.chip_cv', 'CV < 2 %'),
          t('services:overview.hero.chip_results', 'Ergebnis in 3–15 Min'),
          t('services:overview.hero.chip_lfa', 'IVDR/CE-konform'),
        ]}
        gauge={t('services:overview.hero.visual.gauge', '36°')}
        valueChips={[
          {
            value: t('services:overview.hero.visual.vitd_name', 'Vitamin D'),
            label: t('services:overview.hero.visual.vitd_val'),
          },
          {
            value: t('services:overview.hero.visual.time_val'),
            label: t('services:overview.hero.visual.time_label'),
          },
          {
            value: t('services:overview.hero.visual.crp_name', 'CRP'),
            label: t('services:overview.hero.visual.crp_val'),
          },
        ]}
      />
      <div className="bg-slate-50">
        <div className="mx-auto flex max-w-container flex-col gap-10 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">
          {/* Main Content */}
          <article className="space-y-10 text-gray-700">
            <Reveal width="100%">
              {hasRichContent ? (
                /* Rich HTML pillar-page content (dental) */
                <div className="rich-content" dangerouslySetInnerHTML={{ __html: richContent }} />
              ) : (
                <div className="space-y-8">
                  {/* Intro */}
                  {Array.isArray(intro) && intro.length > 0 && (
                    <div className="space-y-4">
                      {intro.map((paragraph, index) => (
                        <p
                          key={index}
                          className={
                            index === 0
                              ? 'text-lg leading-relaxed text-gray-700'
                              : 'leading-relaxed text-gray-700'
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Detailed Sections */}
                  {Array.isArray(sections) &&
                    sections.map((section, index) => (
                      <section key={index} className="space-y-4">
                        {section.heading && (
                          <h2 className="text-2xl font-medium tracking-tight text-heading">
                            {section.heading}
                          </h2>
                        )}
                        {section.content && (
                          <p className="leading-relaxed text-gray-700">{section.content}</p>
                        )}
                        {section.listItems && (
                          <ul className="space-y-2.5">
                            {section.listItems.map((item, lIndex) => (
                              <li key={lIndex} className="flex gap-3 leading-relaxed text-gray-700">
                                <Check
                                  className="mt-1 h-4 w-4 flex-shrink-0 text-accent"
                                  aria-hidden
                                />
                                <span>{renderTextWithLinks(item)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}

                  {/* Conclusion */}
                  {(conclusion?.heading || conclusion?.text) && (
                    <div className="rounded-2xl border border-accent/15 bg-accent/5 p-6">
                      {conclusion.heading && (
                        <h3 className="mb-2 font-semibold text-heading">{conclusion.heading}</h3>
                      )}
                      {conclusion.text && (
                        <p className="leading-relaxed text-gray-700">{conclusion.text}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Reveal>

            {/* Mid-Page Teal CTA-Band */}
            <div className="flex flex-col gap-4 rounded-2xl bg-accent p-6 text-white md:flex-row md:items-center md:justify-between lg:p-8">
              <div>
                <p className="font-medium">
                  {t('home:igloo_widget.help_title', 'Nicht sicher, welcher Test zu Ihrer Praxis passt?')}
                </p>
                <p className="text-sm text-white/85">
                  {t(
                    'home:igloo_widget.help_text',
                    '15 Minuten mit einem POC-Spezialisten – eine konkrete Empfehlung für Ihre Fachrichtung, keine Verkaufsshow.',
                  )}
                </p>
              </div>
              <Link
                to="/contact"
                className="whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep"
              >
                {t('home:igloo_widget.help_cta', 'Beratung buchen')}
              </Link>
            </div>

            {/* FAQ */}
            {hasFaq && (
              <FAQSection items={faqItems} caption={faqCaption} title={faqTitle} showFooter={false} />
            )}
          </article>

          {/* Sidebar */}
          <PageSidebar
            widgets={
              [
                {
                  kind: 'services',
                  titleKey: 'home:services.title',
                  titleFallback: 'Key Areas',
                  items: otherServices.map((s) => {
                    let IconComponent
                    if (s.id.includes('dental')) IconComponent = Tooth
                    else if (s.id.includes('beauty')) IconComponent = Sparkles
                    else IconComponent = InfinityIcon
                    return {
                      id: s.id,
                      translationKey: s.translationKey,
                      title: s.title,
                      icon: <IconComponent className="h-5 w-5" />,
                    }
                  }),
                },
                {
                  kind: 'articles',
                  titleKey: 'articles:index.title',
                  titleFallback: 'Unsere Artikel',
                  variant: 'plain',
                  items: relatedArticles.map((post) => ({
                    id: post.id,
                    slug: post.slug,
                    category: post.category,
                    readTime: post.readTime,
                    date: post.date,
                  })),
                },
                { kind: 'contact' },
              ] as SidebarWidget[]
            }
          />
        </div>
      </div>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default ServicePage
