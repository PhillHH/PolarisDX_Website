import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/blogPosts'

const BlogSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="blog" className="space-y-10">
      <SectionHeader
        caption={t('blog.caption', 'Blog & News')}
        title={t('blog.title', 'Our Articles About Health')}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.slice(0, 3).map((post) => {
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
