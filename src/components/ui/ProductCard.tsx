import { Link } from 'react-router-dom'

type ProductCardProps = {
  name: string
  category: string
  price: number
  description: string
  to: string
  badge?: 'New' | 'Popular' | 'Limited'
  image?: string
}

const ProductCard = ({ name, category, price, description, to, badge, image }: ProductCardProps) => {
  const imageUrl = image ? new URL(`../../assets/${image}`, import.meta.url).href : undefined

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/3] w-full">
        {/* Background gradient as a fallback */}
        <div className="h-full w-full bg-gradient-to-br from-primary/5 via-secondary/10 to-accentBlue/10" />

        {/* Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Overlayed UI */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {badge}
              </span>
            )}
          </div>
          <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold tracking-tight text-gray-900">
            {name}
          </h3>
          <span className="text-sm font-semibold text-primary">
            ${price}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">
          {description}
        </p>
        <Link
          to={to}
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary"
        >
          View details
          <span className="transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  )
}

export default ProductCard



