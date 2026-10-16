import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SEOHead,
  organizationSchema,
  createWebsiteSchema,
  createFAQSchema,
  serializeStructuredData,
  type FAQItem,
} from '../components/seo'
import HeroSection from '../components/sections/HeroSection'
import TrustBar from '../components/sections/TrustBar'
import BusinessPillarsSection from '../components/sections/BusinessPillarsSection'
import ShopTeaserSection from '../components/sections/ShopTeaserSection'
import WhyPocSection from '../components/sections/WhyPocSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import StepsSection from '../components/sections/StepsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import RoiCalculatorSection from '../components/sections/RoiCalculatorSection'
import FAQSection from '../components/sections/FAQSection'
import BlogSection from '../components/sections/BlogSection'

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

  // Organisation und Website stehen im <head> (SEOHead). Das FAQ-Schema steht seit SC-006
  // (2026-10-16) im Body direkt hinter der FAQ: JSON-LD darf ueberall im Dokument liegen,
  // und so liegen Fragen und Antworten im gzip-Fenster ihrer sichtbaren Zwillinge — die
  // ~150 KB entfernte Kopie im <head> kostete gemessen 508 B der 34,7 KB htmlBytes (pl).
  // Sichtbare FAQ und Schema kommen weiter aus demselben `faq.items`-Array (HOMEPAGE-CONTRACT §7).
  const structuredData = useMemo(
    () => [organizationSchema, createWebsiteSchema(i18n.language)],
    [i18n.language],
  )
  const faqJsonLd = useMemo(
    () => (faqSchema ? serializeStructuredData(faqSchema) : null),
    [faqSchema],
  )

  // Scroll-Eintritte (`rv`) setzen die Sektionen selbst an ihren Bloecken; die frueheren
  // <Reveal>-Huellen (zwei Div-Ebenen plus Inline-Style je Sektion) entfallen (SC-006).
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
      <ShopTeaserSection />
      <WhyPocSection />
      <StepsSection />
      <div className="pt-20 lg:pt-24">
        <TestimonialsSection />
      </div>
      <RoiCalculatorSection />
      <div className="mx-auto w-full max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <BlogSection />
      </div>
      <div className="mx-auto flex max-w-container flex-col px-4 pb-24 pt-4 lg:px-0 lg:pb-32">
        <FAQSection />
      </div>
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}
      <FinalCtaSection homepageSalesSection="final_cta" />
    </>
  )
}

export default HomePage
