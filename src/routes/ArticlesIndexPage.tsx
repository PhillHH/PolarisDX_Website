import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import BlogCard from '../components/ui/BlogCard'
import { blogPosts } from '../data/blogPosts'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const ArticlesIndexPage = () => {
  const { t } = useTranslation(['articles', 'shop', 'common'])

  return (
    <PageTransition>
      <div className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-deep to-gray-900 text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[300px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <div className="mb-4 text-sm text-white/70">
                  <Link to="/" className="hover:text-secondary">
                    {t('shop:shop.home', 'Home')}
                  </Link>{' '}
                  / <span>{t('shop:shop.articles', 'Articles')}</span>
                </div>

                <h1 className="mb-4 text-[40px] leading-[47px] font-medium tracking-[-0.02em] sm:text-[48px] sm:leading-[58px] lg:text-[58px] lg:leading-[69px]">
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
        <main className="mx-auto max-w-container px-4 py-16 lg:px-10 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('articles:index.caption', 'Latest Posts')}
              title={t('articles:index.heading', 'Explore Our Articles')}
              align="left"
            />

            <div className="mt-10 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {blogPosts.map((post) => {
                const imageUrl = post.image
                  ? new URL(`../assets/${post.image}`, import.meta.url).href
                  : undefined

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
        </main>
      </div>
    </PageTransition>
  )
}

export default ArticlesIndexPage
