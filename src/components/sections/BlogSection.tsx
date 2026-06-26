import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '~/design-system'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/blogPosts'
import { getArticleImageUrl } from '../../assets/articleImages'

const BlogSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="blog" className="space-y-10">
      <SectionHeader
        caption={t('blog.caption', 'Blog & News')}
        title={t('blog.title', 'Our Articles About Health')}
      />

      {/* Featured Article - Vitamin D3 Implantologie */}
      <Link
        to="/vitamin-d3-implantologie"
        className="group block overflow-hidden rounded-2xl border border-brand-primary/20 bg-gradient-to-r from-brand-primary/5 to-transparent transition-all duration-300 hover:shadow-2 hover:border-brand-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
      >
        <div className="p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-overline text-accent-strong">
            {t('blog.featured', 'Fachartikel')}
          </p>
          <h3 className="text-lg font-semibold text-fg-heading group-hover:text-brand-primary transition-colors">
            Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden
          </h3>
          <p className="mt-2 text-sm text-fg-muted">
            Wissenschaftlich fundierte Erkenntnisse zur Rolle von Vitamin D bei der
            Osseointegration.
          </p>
        </div>
      </Link>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {blogPosts.slice(0, 3).map((post) => {
          // SSR-safe: Verwende zentrale Bild-Imports statt dynamischer URLs
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

      <div className="flex justify-center pt-4">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-brand-primary hover:text-brand-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          {t('blog.all_articles', 'Alle Fachartikel anzeigen')} →
        </Link>
      </div>
    </section>
  )
}

export default BlogSection
