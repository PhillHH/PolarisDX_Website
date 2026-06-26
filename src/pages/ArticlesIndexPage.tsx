import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs, Eyebrow, GradientHero, SectionHeader } from '~/design-system'
import BlogCard from '../components/ui/BlogCard'
import { blogPosts } from '../data/blogPosts'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { getArticleImageUrl } from '../assets/articleImages'

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
      <div className="bg-bg min-h-screen">
        {/* Header Section */}
        <GradientHero>
          <Reveal width="100%" yOffset={20}>
            <Breadcrumbs
              className="mb-4"
              items={[
                { label: t('shop:shop.home', 'Home'), href: '/' },
                { label: t('shop:shop.articles', 'Articles') },
              ]}
            />

            <Eyebrow size="sm" className="mb-3">
              {t('articles:index.eyebrow', 'Magazin')}
            </Eyebrow>
            <h1 className="mb-4 text-display-sm font-medium tracking-headline">
              {t('articles:index.title', 'Our Magazine')}
            </h1>
            <p className="max-w-2xl text-lg text-fg-on-dark/80">
              {t(
                'articles:index.subtitle',
                'Insights, news, and expert knowledge on modern diagnostics and health.',
              )}
            </p>
          </Reveal>
        </GradientHero>

        {/* Content Section */}
        <div className="mx-auto max-w-container px-4 py-16 lg:px-10 lg:py-24">
          <Reveal width="100%">
            {/* Featured Article */}
            <div className="mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-overline text-accent-strong">
                {t('articles:index.featured', 'Featured')}
              </p>
              <Link
                to="/vitamin-d3-implantologie"
                className="group block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-surface shadow-1 transition-all duration-300 hover:shadow-2 hover:border-brand-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
              >
                <div className="p-6 lg:p-8">
                  <h2 className="text-xl font-semibold text-fg-heading group-hover:text-brand-primary transition-colors lg:text-2xl">
                    Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden
                  </h2>
                  <p className="mt-3 text-sm text-fg-muted lg:text-base">
                    Wie ein optimaler Vitamin-D-Spiegel die Osseointegration fördert und
                    Implantatverluste reduziert. Wissenschaftlich fundiert mit praktischen
                    Handlungsempfehlungen.
                  </p>
                  <p className="mt-4 text-sm font-medium text-brand-primary group-hover:underline">
                    Fachartikel lesen →
                  </p>
                </div>
              </Link>
            </div>

            <SectionHeader
              caption={t('articles:index.caption', 'Latest Posts')}
              title={t('articles:index.heading', 'Explore Our Articles')}
              align="left"
            />

            <div className="mt-10 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {blogPosts.map((post) => {
                // SSR-safe: Verwende zentrale Bild-Imports
                const imageUrl = getArticleImageUrl(post.image)

                return (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    to={`/articles/${post.slug}`}
                    imageUrl={imageUrl}
                  />
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default ArticlesIndexPage
