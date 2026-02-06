import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SEOHead,
  websiteSchema,
  medicalBusinessSchema,
  iglooProProductSchema,
  createFAQSchema,
  createReviewSchema,
  type FAQItem,
  type ReviewSchemaOptions,
} from '../components/seo'
import { testimonials } from '../data/testimonials'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import IglooWidgetSection from '../components/sections/IglooWidgetSection'
// import FeaturedCaseStudy from '../components/sections/FeaturedCaseStudy' // temporarily disabled
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'
import FAQSection from '../components/sections/FAQSection'
import Reveal from '../components/ui/Reveal'

// Hero-Bild für LCP-Preload
import heroDoctor from '../assets/hero_doctor.webp'

const HomePage = () => {
  const { t } = useTranslation('home')

  // Generate FAQ schema from locale keys (keeps FAQ text in sync)
  const faqSchema = useMemo(() => {
    const faqItems: FAQItem[] = t('faq.items', { returnObjects: true }) as FAQItem[]
    if (Array.isArray(faqItems) && faqItems.length > 0) {
      return createFAQSchema(faqItems)
    }
    return null
  }, [t])

  // Generate Review schemas from testimonials
  const reviewSchemas = useMemo(() => {
    const reviews: ReviewSchemaOptions[] = testimonials.map((testimonial) => ({
      author: testimonial.name,
      reviewBody: t(`testimonials.${testimonial.id}.text`),
      ratingValue: testimonial.rating ?? 5,
      jobTitle: t(`testimonials.${testimonial.id}.title`),
    }))
    return createReviewSchema(reviews)
  }, [t])

  // Combine all structured data schemas
  const structuredData = useMemo(() => {
    const schemas: object[] = [websiteSchema, medicalBusinessSchema, iglooProProductSchema]
    if (faqSchema) {
      schemas.push(faqSchema)
    }
    schemas.push(...reviewSchemas)
    return schemas
  }, [faqSchema, reviewSchemas])

  return (
    <>
      <SEOHead
        title={t('seo.title', 'IglooPro POC-Reader | Point-of-Care Diagnostik')}
        description={t('seo.description', 'Laborergebnisse in 3 Minuten — direkt in Ihrer Praxis. Der IglooPro POC-Reader für Dental, Longevity & Beauty. Jetzt beraten lassen.')}
        keywords={['POC Diagnostik', 'Point-of-Care', 'IglooPro', 'Schnelltest Praxis', 'Vitamin D Test', 'CRP Schnelltest']}
        structuredData={structuredData}
        preloadImages={[heroDoctor]}
      />
      <HeroSection />
      <div className="mx-auto flex max-w-container flex-col gap-16 px-4 pt-16 lg:px-0 lg:gap-16 lg:pt-8">
        <Reveal width="100%">
          <AboutSection />
        </Reveal>
        <Reveal width="100%">
          <IglooWidgetSection />
        </Reveal>
        {/* <Reveal width="100%">
          <FeaturedCaseStudy />
        </Reveal> */}
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
        <Reveal width="100%">
          <FAQSection />
        </Reveal>
      </div>
    </>
  )
}

export default HomePage
