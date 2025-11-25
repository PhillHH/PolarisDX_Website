import SectionHeader from '../ui/SectionHeader'
import BlogCard from '../ui/BlogCard'
import { blogPosts } from '../../data/blogPosts'

const BlogSection = () => {
  return (
    <section id="blog" className="space-y-10">
      <SectionHeader
        caption="Blog & News"
        title="Our Articles About Health"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.slice(0, 3).map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            to={`/articles/${post.slug}`}
          />
        ))}
      </div>
    </section>
  )
}

export default BlogSection


