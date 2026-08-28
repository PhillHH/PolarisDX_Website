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
import WhyPocSection from '../components/sections/WhyPocSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import AboutSection from '../components/sections/AboutSection'
import IglooWidgetSection from '../components/sections/IglooWidgetSection'
import EpigeneticsTeaserSection from '../components/sections/EpigeneticsTeaserSection'
import StepsSection from '../components/sections/StepsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import RoiCalculatorSection from '../components/sections/RoiCalculatorSection'
import FAQSection from '../components/sections/FAQSection'
import Reveal from '../components/ui/Reveal'

// Hero-Bild für LCP-Preload
import heroDoctor from '../assets/hero_doctor.webp'

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
        title={t('seo.title', 'IglooPro POC-Reader: Laborergebnisse in 3 Min | PolarisDX')}
        description={t(
          'seo.description',
          'Point-of-Care Diagnostik für Zahnarztpraxen, Beauty-Center & Longevity-Kliniken. Chairside Schnelltests mit CV < 2 %. Jetzt Demo anfragen.',
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
      <TrustBar />
      <WhyPocSection />
      <div className="mx-auto max-w-container px-4 pt-16 lg:px-0 lg:pt-24">
        <Reveal width="100%">
          <AboutSection />
        </Reveal>
      </div>
      <IglooWidgetSection />
      <div className="mx-auto max-w-container px-4 pt-24 lg:px-0 lg:pt-32">
        <Reveal width="100%">
          <EpigeneticsTeaserSection />
        </Reveal>
      </div>
      <div className="mt-24 lg:mt-32">
        <Reveal width="100%">
          <TestimonialsSection />
        </Reveal>
      </div>
      <RoiCalculatorSection />
      <div className="mx-auto flex max-w-container flex-col px-4 py-24 lg:px-0 lg:py-32">
        <Reveal width="100%">
          <FAQSection />
        </Reveal>
      </div>
      <StepsSection />
      <FinalCtaSection />
    </>
  )
}

export default HomePage
