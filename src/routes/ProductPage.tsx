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
        <section className="space-y-8 text-gray-700">
          <div className="w-full overflow-hidden rounded-lg aspect-[4/3] bg-slate-200">
            {product.image && (
              <img
                src={new URL(`../assets/${product.image}`, import.meta.url).href}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            {product.detailedDescription ? (
              product.detailedDescription.map((p, i) => (
                <p key={i} className="text-sm leading-[32px] text-gray-500 sm:text-base">{p}</p>
              ))
            ) : (
              <p className="text-sm leading-[32px] text-gray-500 sm:text-base">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Features & Benefits
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Specs */}
          {product.techSpecs && product.techSpecs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Technical Specifications
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200/80 bg-white">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-200/80">
                    {product.techSpecs.map((spec) => (
                      <tr key={spec.parameter} className="divide-x divide-gray-200/80">
                        <td className="w-1/3 px-4 py-3 font-medium text-gray-800">{spec.parameter}</td>
                        <td className="px-4 py-3 text-gray-600">{spec.specification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delivery Scope */}
          {product.deliveryScope && product.deliveryScope.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                What's in the box?
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                {product.deliveryScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {product.note && (
                <p className="pt-2 text-xs text-gray-500">{product.note}</p>
              )}
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



