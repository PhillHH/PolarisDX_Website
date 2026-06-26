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
// NEWLOOK-Startseite (§docs/NEWLOOK-HOME.md): heller Medtech-Auftritt
// (Philips/Siemens-Anmutung) — neue, atomare Section-Komponenten unter
// components/sections/home/. FAQ + Schluss-CTA werden bewusst wiederverwendet
// (ein dunkles Band pro Seite, [FRO] keine Duplikate).
import HomeHero from '../components/sections/home/HomeHero'
import HomeTrustBar from '../components/sections/home/HomeTrustBar'
import HomeProductSpotlight from '../components/sections/home/HomeProductSpotlight'
import HomeDomains from '../components/sections/home/HomeDomains'
import HomeApproach from '../components/sections/home/HomeApproach'
import HomeFocusGrid from '../components/sections/home/HomeFocusGrid'
import HomeVoices from '../components/sections/home/HomeVoices'
import HomeMagazine from '../components/sections/home/HomeMagazine'
import FAQSection from '../components/sections/FAQSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'

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
      {/* NEWLOOK-Komposition (§NEWLOOK-HOME §4): Aufmerksamkeit → Glaubwürdigkeit →
          Produkt → Anwendung → Vorgehen → Tiefe → Stimmen → Wissen → Fragen →
          Abschluss. Jede Sektion ist voll-breit und bringt ihren eigenen Grund &
          Rhythmus mit (großer Weißraum, ein dunkles Schluss-Band). */}
      <HomeHero />
      <HomeTrustBar />
      <HomeProductSpotlight />
      <HomeDomains />
      <HomeApproach />
      <HomeFocusGrid />
      <HomeVoices />
      <HomeMagazine />

      {/* FAQ — wiederverwendetes Bauteil, in ein helles Band gefasst. */}
      <div className="bg-surface">
        <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
          <FAQSection />
        </div>
      </div>

      {/* Schluss-CTA-Band (Navy-Gradient) — der eine dunkle Moment der Seite. */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
