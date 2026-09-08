import React from 'react'
import { useTranslation } from 'react-i18next'
import { SEOHead, createProductSchema, createBreadcrumbSchema } from '../components/seo'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'
import IglooProHero from '../components/sections/IglooProHero'
import IglooProductProof from '../components/sections/IglooProductProof'
import IglooFeaturesSection from '../components/sections/IglooFeaturesSection'
import IglooWorkflowSection from '../components/sections/IglooWorkflowSection'
import IglooCompatibilitySection from '../components/sections/IglooCompatibilitySection'
import IglooSpecsSection from '../components/sections/IglooSpecsSection'
import IglooProductFinalCta from '../components/sections/IglooProductFinalCta'

const IglooProPage: React.FC = () => {
  const { t, i18n } = useTranslation(['products', 'services', 'common'])

  return (
    <div>
      <SEOHead
        title={t('products:seo.title')}
        description={t('products:seo.description')}
        ogType="product"
        keywords={['IglooPro', 'Point-of-Care Reader', 'Point-of-Care Workflow']}
        structuredData={[
          createProductSchema({
            name: 'IglooPro',
            description: t('products:hero.description'),
            image: iglooProImage,
            url: '/igloo-pro',
            language: i18n.language,
          }),
          createBreadcrumbSchema(
            [
              { name: 'Home', url: '/' },
              { name: 'IglooPro', url: '/igloo-pro' },
            ],
            i18n.language,
          ),
        ]}
      />

      <IglooProHero />
      <IglooProductProof />
      <IglooFeaturesSection />
      <IglooWorkflowSection />
      <IglooCompatibilitySection />
      <IglooSpecsSection />
      <IglooProductFinalCta />
    </div>
  )
}

export default IglooProPage
