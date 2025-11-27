import { useTranslation } from 'react-i18next'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ServicesSection from '../components/sections/ServicesSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'
import SectionHeader from '../components/ui/SectionHeader'
import ProductCard from '../components/ui/ProductCard'
import { products } from '../data/products'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <>
      <HeroSection />
      <main className="mx-auto flex max-w-container flex-col gap-24 px-4 pt-16 lg:px-0 lg:gap-32">
        <AboutSection />
        <ServicesSection />
        <DoctorsSection />
      </main>

      {/* Testimonials section is pulled out to be full-width */}
      <div className="mt-24 lg:mt-32">
        <TestimonialsSection />
      </div>

      <main className="mx-auto flex max-w-container flex-col gap-24 px-4 py-24 lg:px-0 lg:gap-32 lg:py-32">
        <BlogSection />
        {/* Shop Teaser */}
        <section className="space-y-8">
          <SectionHeader
            caption={t('nav.shop', 'Shop')}
            title={t('shop.discoverTitle', 'Featured medical products')}
            align="left"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
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
        </section>
      </main>
    </>
  )
}

export default HomePage
