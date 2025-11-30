import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import ProductCard from '../components/ui/ProductCard'
import { products } from '../data/products'

/**
 * ShopPage Komponente.
 * Zeigt eine Übersicht aller verfügbaren Produkte im Shop.
 */
const ShopPage = () => {
  const { t } = useTranslation(['shop', 'common'])

  return (
    <div className="bg-slate-50 text-gray-900">
      {/* Hero / Header Bereich */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[320px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
          <div className="max-w-container">
            {/* Breadcrumb Navigation */}
            <div className="mb-3 text-sm text-white/70">
              <Link to="/" className="hover:text-secondary">
                {t('shop:shop.home')}
              </Link>{' '}
              / <span>{t('common:nav.shop')}</span>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              {t('shop:shop.subtitle')}
            </p>
            <h1 className="text-[40px] leading-[47px] font-medium tracking-[-0.02em] sm:text-[48px] sm:leading-[58px] lg:text-[58px] lg:leading-[69px]">
              {t('shop:shop.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Produktgitter */}
      <main className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
        <div className="mb-8">
          <SectionHeader
            caption={t('common:nav.shop')}
            title={t('shop:shop.discoverTitle')}
            align="left"
          />
        </div>

        {/* Darstellung aller Produkte als Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              category={product.category}
              price={product.price}
              badge={product.badge}
              to={`/shop/${product.slug}`}
              image={product.image}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default ShopPage
