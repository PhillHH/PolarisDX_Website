import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import SectionHeader from '../components/ui/SectionHeader'
import Eyebrow from '../components/ui/Eyebrow'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import { articles } from '../data/articles'

const ArticlesIndexPage = () => {
  const { t } = useTranslation(['articles', 'shop', 'common'])

  return (
    <PageTransition>
      <SEOHead
        title={t(
          'articles:seo.index_title',
          'Fachartikel: POC-Diagnostik & Praxislabor Wissen | PolarisDX',
        )}
        description={t(
          'articles:seo.index_description',
          'Expertenwissen zu POCT, Chairside Diagnostik und Praxislabor. Praxisnahe Artikel für Zahnärzte, Ärzte und medizinisches Fachpersonal.',
        )}
        keywords={[
          'POC Fachartikel',
          'Diagnostik Wissen',
          'Schnelltest Artikel',
          'Medizintechnik Blog',
          'POCT Fachbeiträge',
        ]}
        structuredData={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Artikel', url: '/articles' },
        ])}
      />

      <SubpageHero
        breadcrumbs={[
          { label: t('shop:shop.home', 'Home'), href: '/' },
          { label: t('shop:shop.articles', 'Articles') },
        ]}
        eyebrow={t('articles:index.eyebrow', 'Fachwissen')}
        title={t('articles:index.title', 'Our Magazine')}
        subtitle={t(
          'articles:index.subtitle',
          'Insights, news, and expert knowledge on modern diagnostics and health.',
        )}
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            {/* Featured Article */}
            <div className="mb-12">
              <Eyebrow size="sm" className="mb-3">
                {t('articles:index.featured', 'Featured')}
              </Eyebrow>
              <Link
                to="/vitamin-d3-implantologie"
                className="group block rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-card lg:p-8"
              >
                <h2 className="text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                  Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden
                </h2>
                <p className="mt-3 leading-relaxed text-gray-700">
                  Wie ein optimaler Vitamin-D-Spiegel die Osseointegration fördert und
                  Implantatverluste reduziert. Wissenschaftlich fundiert mit praktischen
                  Handlungsempfehlungen.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:text-accent-strong">
                  Fachartikel lesen →
                </span>
              </Link>
            </div>

            <SectionHeader
              caption={t('articles:index.caption', 'Latest Posts')}
              title={t('articles:index.heading', 'Explore Our Articles')}
              align="left"
            />

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <Link
                  key={post.id}
                  to={`/articles/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {t(`common:category.${post.category}`, post.category)}
                  </span>
                  <h3 className="mt-4 text-lg font-medium text-heading">
                    {t(`articles:${post.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t(`articles:${post.id}.excerpt`)}
                  </p>
                  <p className="mt-3 text-xs text-gray-500">
                    {post.readTime} · {post.date}
                  </p>
                  <span className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:text-accent-strong">
                    {t('shop:shop.readMore', 'Weiterlesen')} →
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default ArticlesIndexPage
