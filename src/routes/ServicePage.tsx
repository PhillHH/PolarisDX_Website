import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import PrimaryButton from '../components/ui/PrimaryButton'
import { services } from '../data/services'
import { articles } from '../data/articles'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

type ServiceSection = {
  heading?: string
  content?: string
  listItems?: string[]
}

type ServiceConclusion = {
    heading?: string
    text?: string
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
  const conclusion = t(`services:${transKey}.conclusion`, { returnObjects: true }) as ServiceConclusion
  const ctaText = t(`services:${transKey}.cta`, 'Contact Us')

  const otherServices = services.filter(s => s.id !== service.id)
  const relatedArticles = articles.slice(0, 3)

  return (
    <PageTransition>
      <div className="bg-slate-50">
        {/* Hero / Header */}
        <section className="relative overflow-hidden bg-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[300px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <div className="mb-4 text-sm text-white/70">
                  <Link to="/" className="hover:text-secondary">
                    {t('common:nav.home', 'Home')}
                  </Link>{' '}
                  / <span>{t('home:services.caption', 'Services')}</span>
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                  {t('home:services.caption', 'DIAGNOSTICS FOCUS')}
                </p>
                <h1 className="mb-4 text-3xl font-medium tracking-tight sm:text-4xl lg:text-4xl">
                  {title}
                </h1>
              </div>
            </Reveal>
          </div>
        </section>

        <main className="mx-auto flex max-w-container flex-col gap-10 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">

          {/* Main Content */}
          <article className="space-y-8 text-gray-700">
            <Reveal width="100%">
              <SectionHeader
                caption={service.title} // Fallback title as caption
                title={headline}
                align="left"
              />

              {/* Intro Text */}
              <div className="space-y-4">
                {Array.isArray(intro) && intro.map((paragraph, index) => (
                    <p key={index} className="text-sm leading-[32px] text-gray-500 sm:text-base">
                        {paragraph}
                    </p>
                ))}
              </div>

              {/* Detailed Sections */}
              {Array.isArray(sections) && sections.map((section, index) => (
                <section key={index} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                      {section.heading}
                    </h2>
                  )}
                  {section.content && (
                    <p className="text-sm leading-[32px] text-gray-500 sm:text-base">
                      {section.content}
                    </p>
                  )}
                  {section.listItems && (
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                      {section.listItems.map((item, lIndex) => (
                        <li key={lIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Conclusion */}
              {(conclusion?.heading || conclusion?.text) && (
                  <div className="rounded-2xl bg-primary/5 p-6 text-sm leading-[28px] text-gray-600 sm:text-base">
                      {conclusion.heading && <h3 className="mb-2 font-semibold text-gray-900">{conclusion.heading}</h3>}
                      {conclusion.text && <p>{conclusion.text}</p>}
                  </div>
              )}

              {/* Content CTA Button */}
              <div className="mt-8 pt-4">
                  <PrimaryButton as={Link} to="/contact" variant="primary">
                      {ctaText}
                  </PrimaryButton>
              </div>
            </Reveal>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-32">
            <Reveal width="100%" delay={0.2}>
              {/* Other Services Widget */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {t('home:services.title', 'Key Areas')}
                </h2>
                <div className="space-y-2">
                  {otherServices.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className="block rounded-lg p-2 transition hover:bg-slate-50 hover:text-secondary"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {t(`home:services.${s.translationKey}.title`, s.title)}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Related Articles Widget */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mt-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {t('home:blog.title', 'Blog Articles')}
                </h2>
                <div className="space-y-4">
                    {relatedArticles.map((post) => (
                      <Link
                        key={post.id}
                        to={`/articles/${post.slug}`}
                        className="block group"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue mb-1">
                          {t(`common:category.${post.category}`, post.category)}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-secondary transition-colors">
                          {t(`articles:${post.id}.title`)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {post.readTime} · {post.date}
                        </p>
                      </Link>
                    ))}
                </div>
              </section>

              {/* Contact Widget */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mt-8">
                <h3 className="mb-2 text-sm font-semibold tracking-tight text-gray-900">
                  {t('shop:shop.needHelp', 'Need help right now?')}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-gray-500">
                  {t('shop:shop.contactText', 'Our medical team is available 24/7 to answer urgent questions and help you decide what to do next.')}
                </p>
                <PrimaryButton as={Link} to="/contact" variant="secondary" className="w-full justify-center">
                    {t('common:nav.contact', 'Contact Us')}
                </PrimaryButton>
              </section>
            </Reveal>
          </aside>
        </main>
      </div>
    </PageTransition>
  )
}

export default ServicePage
