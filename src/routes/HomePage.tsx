import { useTranslation } from 'react-i18next'
import { SEOHead, websiteSchema, organizationSchema } from '../components/seo'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import IglooWidgetSection from '../components/sections/IglooWidgetSection'
import FeaturedCaseStudy from '../components/sections/FeaturedCaseStudy'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'
import Reveal from '../components/ui/Reveal'

const HomePage = () => {
  const { t } = useTranslation('home')

  return (
    <>
      <SEOHead
        title={t('seo.title', 'IglooPro POC-Reader - Point-of-Care Diagnostik')}
        description={t('seo.description', 'Laborpräzise POC-Diagnostik in 3-15 Min. Vitamin D, CRP, HbA1c direkt in Ihrer Praxis. Ideal für Zahnarzt, Beauty & Longevity. Jetzt Demo anfragen!')}
        canonical="https://polarisdx.net/"
        keywords={['POC Diagnostik', 'Point-of-Care', 'IglooPro', 'Schnelltest Praxis', 'Vitamin D Test', 'CRP Schnelltest']}
        structuredData={[websiteSchema, organizationSchema]}
      />
      <HeroSection />
      <div className="mx-auto flex max-w-container flex-col gap-16 px-4 pt-16 lg:px-0 lg:gap-16 lg:pt-8">
        <Reveal width="100%">
          <AboutSection />
        </Reveal>
        <Reveal width="100%">
          <IglooWidgetSection />
        </Reveal>
        <Reveal width="100%">
          <FeaturedCaseStudy />
        </Reveal>
        <Reveal width="100%">
          <DoctorsSection />
        </Reveal>
      </div>

      {/* Testimonials section is po be full-width */}
      <div className="mt-32 lg:mt-32">
        <Reveal width="100%">
          <TestimonialsSection />
        </Reveal>
      </div>

      <div className="mx-auto flex max-w-container flex-col gap-32 px-4 py-32 lg:px-0 lg:gap-32 lg:py-32">
        <Reveal width="100%">
          <BlogSection />
        </Reveal>
      </div>
    </>
  )
}

export default HomePage
