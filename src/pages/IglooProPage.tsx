import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, iglooProProductSchema, createBreadcrumbSchema } from '../components/seo'
import IglooProHero from '../components/sections/IglooProHero'
import IglooFeaturesSection from '../components/sections/IglooFeaturesSection'
import IglooSpecsSection from '../components/sections/IglooSpecsSection'
import IglooParametersSection from '../components/sections/IglooParametersSection'
import DiagnosticsSpecialtySection from '../components/sections/DiagnosticsSpecialtySection'
import IglooProductFinalCta from '../components/sections/IglooProductFinalCta'

const IglooProPage: React.FC = () => {
  const { t } = useTranslation(['products', 'services', 'common'])

  return (
    <div>
      <SEOHead
        title={t('products:seo.title')}
        description={t('products:seo.description')}
        ogType="product"
        keywords={[
          'IglooPro',
          'POC Reader kaufen',
          'Point-of-Care Analysegerät',
          'Immunfluoreszenz',
          'Vitamin D Schnelltest Gerät',
        ]}
        structuredData={[
          iglooProProductSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'IglooPro', url: '/igloo-pro' },
          ]),
        ]}
      />

      <IglooProHero />
      <IglooFeaturesSection />
      <IglooSpecsSection />
      <IglooParametersSection />
      <DiagnosticsSpecialtySection
        eyebrow={t('products:application.eyebrow')}
        title={t('products:application.title')}
        subtitle={t('products:application.subtitle')}
        sectionClassName="bg-slate-50"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 lg:px-0 pb-24 lg:pb-28">
          <div className="flex flex-col gap-4 rounded-2xl bg-accent-strong p-7 lg:p-7 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{t('products:help.title')}</p>
              <p className="text-sm text-white">{t('products:help.text')}</p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep"
            >
              {t('products:help.cta')}
            </Link>
          </div>
        </div>
      </section>

      <IglooProductFinalCta />
    </div>
  )
}

export default IglooProPage
