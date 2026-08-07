import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/blogPosts'
import { getArticleImageUrl } from '../../assets/articleImages'

const BlogSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="blog" className="space-y-14">
      <SectionHeader
        caption={t('blog.caption', 'Blog & News')}
        title={t('blog.title', 'Our Articles About Health')}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-deep transition-colors"
        >
          {t('blog.all_articles', 'Alle Fachartikel anzeigen')} →
        </Link>
      </div>
    </section>
  )
}

export default BlogSection
