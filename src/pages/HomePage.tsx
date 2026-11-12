import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SEOHead,
  organizationSchema,
  createWebsiteSchema,
  createFAQSchema,
  serializeStructuredData,
  type FAQItem,
} from '../components/seo'
import HomeHero from '../components/home/HomeHero'
import HomeProducts from '../components/home/HomeProducts'
import HomeInformation from '../components/home/HomeInformation'
import HomeContact from '../components/home/HomeContact'
import HomeMore from '../components/home/HomeMore'
import { ResponsivePicture } from '../components/ui/ResponsivePicture'
import { PILLAR_DIAGNOSTICS_IMAGE } from '../assets/home/homeImages'
import homeStylesheet from '../components/home/home.css?url'

const LuminousTrace = lazy(() => import('../components/home/LuminousTrace'))

const HomePage = () => {
  const { t, i18n } = useTranslation('home')
  const [loadTrace, setLoadTrace] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadTrace(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const faqSchema = useMemo(() => {
    const faqItems: FAQItem[] = t('faq.items', { returnObjects: true }) as FAQItem[]
    return Array.isArray(faqItems) && faqItems.length > 0
      ? createFAQSchema(faqItems, i18n.language)
      : null
  }, [i18n.language, t])
  const structuredData = useMemo(
    () => [organizationSchema, createWebsiteSchema(i18n.language)],
    [i18n.language],
  )
  const faqJsonLd = useMemo(
    () => (faqSchema ? serializeStructuredData(faqSchema) : null),
    [faqSchema],
  )

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        ogImage="/og-image.jpg"
        ogImageAlt={t('seo.social_image_alt')}
        structuredData={structuredData}
      />
      <div id="home-page" className="sc025" data-home-stylesheet={homeStylesheet}>
        <HomeHero />
        <section aria-labelledby="home-intro-title" data-home-section className="sc025-s">
          <div className="sc025-inner">
            <span className="sc025-kicker">{t('business_pillars.pillars.igloo.title')}</span>
            <h2 id="home-intro-title" className="sc025-lit" data-home-lit>
              {t('business_pillars.pillars.igloo.headline')}
            </h2>
            <p className="sc025-lead">{t('hero.description')}</p>
            <dl className="sc025-kpi">
              <div>
                <dt>{t('hero.stat2.value')}</dt>
                <dd>{t('hero.stat2.label')}</dd>
              </div>
              <div>
                <dt>{t('hero.stat1.value')}</dt>
                <dd>{t('hero.stat1.label')}</dd>
              </div>
            </dl>
          </div>
        </section>
        <HomeProducts />
        <div className="sc025-band" data-home-band>
          <ResponsivePicture image={PILLAR_DIAGNOSTICS_IMAGE} alt="" sizes="100vw" />
          <p className="sc025-inner">{t('sc025.products.diagnostics_visual')}</p>
        </div>
        <HomeInformation />
        <HomeMore />
        <HomeContact />
        {faqJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
        )}
      </div>
      {loadTrace && (
        <Suspense fallback={null}>
          <LuminousTrace />
        </Suspense>
      )}
    </>
  )
}

export default HomePage
