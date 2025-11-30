import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/blogPosts'

/**
 * BlogSection Komponente.
 * Zeigt eine Vorschau der neuesten Blog-Artikel in einem Grid-Layout an.
 * Wird typischerweise auf der Startseite verwendet.
 */
const BlogSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="blog" className="space-y-10">
      {/* Header für den Blog-Bereich */}
      <SectionHeader
        caption={t('blog.caption', 'Blog & News')}
        title={t('blog.title', 'Our Articles About Health')}
      />

      {/* Grid für die Artikel-Karten (zeigt die ersten 3 Posts) */}
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {blogPosts.slice(0, 3).map((post) => {
          // Bild-URL dynamisch auflösen
          const imageUrl = post.image
            ? new URL(`../../assets/${post.image}`, import.meta.url).href
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
    </section>
  )
}

export default BlogSection
