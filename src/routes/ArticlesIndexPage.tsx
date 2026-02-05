import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import SectionHeader from '../components/ui/SectionHeader'
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
        title={t('articles:seo.index_title', 'Fachartikel zu POC-Diagnostik & Medizintechnik')}
        description={t('articles:seo.index_description', 'Expertenwissen zu Point-of-Care Diagnostik, Schnelltests und moderner Labormedizin. Praxisnahe Artikel für Ärzte und medizinisches Fachpersonal.')}
        canonical="https://polarisdx.net/articles"
        keywords={['POC Fachartikel', 'Diagnostik Wissen', 'Schnelltest Artikel', 'Medizintechnik Blog', 'POCT Fachbeiträge']}
        structuredData={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Artikel', url: '/articles' },
        ])}
      />
      <div className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-hero max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <div className="mb-4 text-sm text-white/70">
                  <Link to="/" className="hover:text-brand-secondary">
                    {t('shop:shop.home', 'Home')}
                  </Link>{' '}
                  / <span>{t('shop:shop.articles', 'Articles')}</span>
                </div>

                <h1 className="mb-4 text-hero-sm leading-[47px] font-medium tracking-[-0.02em] sm:text-hero-md sm:leading-[58px] lg:text-hero-lg lg:leading-[69px]">
                  {t('articles:index.title', 'Our Magazine')}
                </h1>
                <p className="max-w-2xl text-lg text-white/80">
                  {t('articles:index.subtitle', 'Insights, news, and expert knowledge on modern diagnostics and health.')}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Content Section */}
        <div className="mx-auto max-w-container px-4 py-16 lg:px-10 lg:py-24">
          <Reveal width="100%">
            {/* Featured Article */}
            <div className="mb-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                {t('articles:index.featured', 'Featured')}
              </p>
              <Link
                to="/vitamin-d3-implantologie"
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-brand-primary/30"
              >
                <div className="p-6 lg:p-8">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors lg:text-2xl">
                    Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden
                  </h2>
                  <p className="mt-3 text-sm text-gray-500 lg:text-base">
                    Wie ein optimaler Vitamin-D-Spiegel die Osseointegration fördert und Implantatverluste reduziert. Wissenschaftlich fundiert mit praktischen Handlungsempfehlungen.
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
