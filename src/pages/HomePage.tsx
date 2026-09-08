import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SEOHead,
  organizationSchema,
  createWebsiteSchema,
  createFAQSchema,
  type FAQItem,
} from '../components/seo'
import HeroSection from '../components/sections/HeroSection'
import TrustBar from '../components/sections/TrustBar'
import BusinessPillarsSection from '../components/sections/BusinessPillarsSection'
import WhyPocSection from '../components/sections/WhyPocSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import StepsSection from '../components/sections/StepsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import RoiCalculatorSection from '../components/sections/RoiCalculatorSection'
import FAQSection from '../components/sections/FAQSection'
import BlogSection from '../components/sections/BlogSection'
import Reveal from '../components/ui/Reveal'

const HomePage = () => {
  const { t, i18n } = useTranslation('home')

  // Generate FAQ schema from locale keys (keeps FAQ text in sync)
  const faqSchema = useMemo(() => {
    const faqItems: FAQItem[] = t('faq.items', { returnObjects: true }) as FAQItem[]
    if (Array.isArray(faqItems) && faqItems.length > 0) {
      return createFAQSchema(faqItems, i18n.language)
    }
    return null
  }, [i18n.language, t])

  // Combine all structured data schemas
  const structuredData = useMemo(() => {
    const schemas: object[] = [organizationSchema, createWebsiteSchema(i18n.language)]
    if (faqSchema) {
      schemas.push(faqSchema)
    }
    return schemas
  }, [faqSchema, i18n.language])

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        ogImage="/og-image.jpg"
        ogImageAlt={t('seo.social_image_alt')}
        structuredData={structuredData}
      />
      <HeroSection />
      <TrustBar />
      <BusinessPillarsSection />
      <WhyPocSection />
      <StepsSection />
      <div className="mt-24 lg:mt-32">
        <Reveal width="100%">
          <TestimonialsSection />
        </Reveal>
      </div>
      <RoiCalculatorSection />
      <div className="mx-auto w-full max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <Reveal width="100%">
          <BlogSection />
        </Reveal>
      </div>
      <div className="mx-auto flex max-w-container flex-col px-4 py-24 lg:px-0 lg:py-32">
        <Reveal width="100%">
          <FAQSection />
        </Reveal>
      </div>
      <FinalCtaSection homepageSalesSection="final_cta" />
    </>
  )
}

export default HomePage
