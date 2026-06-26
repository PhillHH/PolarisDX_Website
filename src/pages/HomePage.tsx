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
import FinalCtaSection from '../components/sections/FinalCtaSection'
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
        title={t('seo.title', 'IglooPro POC-Reader: Laborergebnisse in 3 Min | PolarisDX')}
        description={t(
          'seo.description',
          'Point-of-Care Diagnostik für Zahnarztpraxen, Beauty-Center & Longevity-Kliniken. Chairside Schnelltests mit CV <2%. Jetzt Demo anfragen.',
        )}
        keywords={[
          'POC Diagnostik',
          'Point-of-Care',
          'IglooPro',
          'Schnelltest Praxis',
          'Vitamin D Test',
          'CRP Schnelltest',
        ]}
        structuredData={structuredData}
        preloadImages={[heroDoctor]}
      />
      <HeroSection />

      {/* V2-Section-Rhythmus: Section-Gap 96px (gap-20 = --space-20), großzügige
          Hero-Luft (pt-20). Reihenfolge: Value → Produkt-Snippet (IglooPro) →
          Anwendungsbereiche → Trust-Block → Magazin → FAQ → Schluss-CTA. */}
      <div className="mx-auto flex max-w-container flex-col gap-20 px-4 pt-20 lg:px-0">
        <Reveal width="100%">
          <AboutSection />
        </Reveal>
        {/* Produkt-Snippet IglooPro */}
        <Reveal width="100%">
          <DoctorsSection />
        </Reveal>
        {/* <Reveal width="100%">
          <FeaturedCaseStudy />
        </Reveal> */}
        <Reveal width="100%">
          <IglooWidgetSection />
        </Reveal>
      </div>

      {/* Trust-Block (Autorität → Stimmen) — bewusst voll-breit auf Navy. */}
      <div className="mt-20">
        <Reveal width="100%">
          <TestimonialsSection />
        </Reveal>
      </div>

      <div className="mx-auto flex max-w-container flex-col gap-20 px-4 py-20 lg:px-0">
        <Reveal width="100%">
          <BlogSection />
        </Reveal>
        <Reveal width="100%">
          <FAQSection />
        </Reveal>
      </div>

      {/* Schluss-CTA-Band (Navy-Gradient) */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
