import { Link, useParams } from 'react-router-dom'
import PrimaryButton from '../components/ui/PrimaryButton'
import { products, getProductBySlug } from '../data/products'

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const fallbackProduct = products[0]
  const foundProduct = slug ? getProductBySlug(slug) : undefined
  const product = foundProduct ?? fallbackProduct

  const otherProducts = products.filter((p) => p.slug !== product.slug)

  return (
    <div className="bg-slate-50 text-gray-900">
      {/* Hero / Top */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[320px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
          <div className="max-w-container">
            <div className="mb-3 text-sm text-white/70">
              <Link to="/" className="hover:text-secondary">
                Home
              </Link>{' '}
              /{' '}
              <Link to="/shop" className="hover:text-secondary">
                Shop
              </Link>{' '}
              / <span>{product.name}</span>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              {product.category}
            </p>
            <h1 className="text-[32px] leading-[40px] font-medium tracking-[-0.02em] sm:text-[40px] sm:leading-[47px] lg:text-[48px] lg:leading-[58px]">
              {product.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-secondary">
              ${product.price}
            </p>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <main className="mx-auto max-w-container px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.5fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">
        <section className="space-y-6 text-gray-700">
          <p className="text-sm leading-[32px] text-gray-500 sm:text-base">
            {product.shortDescription}
          </p>

          {product.features.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Key features
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-primary/5 p-6 text-sm leading-[28px] text-gray-600 sm:text-base">
            Please note: This is a demo shop for design and layout purposes only. No real orders or
            payments are processed.
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <PrimaryButton as={Link} to="/shop" variant="secondary">
              Back to Shop
            </PrimaryButton>
            <span className="text-xs sm:text-sm">
              Need help choosing a product?{' '}
              <Link to="/contact" className="font-semibold text-secondary">
                Contact our team
              </Link>
              .
            </span>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="mt-10 space-y-8 lg:mt-0 lg:sticky lg:top-32">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-gray-900">
              Order information
            </h2>
            <p className="mb-3 text-xs leading-relaxed text-gray-500">
              This demo layout mimics a simple order box. In a real project, this is where you would
              show availability, shipping options and an “Add to cart” button.
            </p>
            <PrimaryButton className="w-full justify-center" disabled>
              Add to cart (demo)
            </PrimaryButton>
          </section>

          {otherProducts.length > 0 && (
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold tracking-tight text-gray-900">
                You might also like
              </h3>
              <div className="space-y-3 text-sm">
                {otherProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    to={`/shop/${p.slug}`}
                    className="flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.category} · ${p.price}
                      </p>
                    </div>
                    <span className="text-xs text-secondary">View</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  )
}

export default ProductPage



