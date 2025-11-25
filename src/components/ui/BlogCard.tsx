import { Link } from 'react-router-dom'

type BlogCardProps = {
  title: string
  excerpt: string
  imageUrl?: string
  to?: string
}

const BlogCard = ({ title, excerpt, imageUrl, to }: BlogCardProps) => {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="aspect-[4/3] w-full bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-medium tracking-tight text-gray-900">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">{excerpt}</p>
        {to && (
          <Link
            to={to}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary"
          >
            Read More
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogCard


