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

/**
 * HomePage Komponente.
 * Zeigt die Startseite der Anwendung mit verschiedenen Sektionen (Hero, About, Services, etc.).
 */
const HomePage = () => {
  // Lädt Übersetzungen aus den Namespaces 'home', 'shop' und 'common'
  const { t } = useTranslation(['home', 'shop', 'common'])

  return (
    <>
      {/* Hero-Bereich (Oberster Bereich der Seite) */}
      <HeroSection />

      {/* Hauptinhalt: About, Services, Ärzte */}
      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 pt-24 lg:px-0 lg:gap-32 lg:pt-16">
        <AboutSection />
        <ServicesSection />
        <DoctorsSection />
      </main>

      {/* Testimonials (Kundenstimmen) - volle Breite */}
      <div className="mt-32 lg:mt-32">
        <TestimonialsSection />
      </div>

      {/* Blog & Shop Teaser */}
      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 py-32 lg:px-0 lg:gap-32 lg:py-32">
        <BlogSection />

        {/* Shop Teaser Sektion */}
        <section className="space-y-10 lg:space-y-8">
          <SectionHeader
            caption={t('common:nav.shop', 'Shop')}
            title={t('shop:shop.discoverTitle', 'Featured medical products')}
            align="left"
          />
          {/* Zeigt die ersten 3 Produkte als Vorschau an */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
