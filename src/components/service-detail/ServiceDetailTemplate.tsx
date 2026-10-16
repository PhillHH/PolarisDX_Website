import { useTranslation } from 'react-i18next'
import { useAreaShell } from '../area/areaShell'
import { serviceDetailEntries } from '../../data/serviceDetail'
import { SEOHead } from '../seo'
import FAQSection from '../sections/FAQSection'
import PageSidebar from '../sections/PageSidebar'
import TrustBar from '../sections/TrustBar'
import PageTransition from '../ui/PageTransition'
import ServiceDetailHero from './ServiceDetailHero'
import ServiceDetailSalesCta from './ServiceDetailSalesCta'
import ServiceDetailSections from './ServiceDetailSections'
import type { ServiceDetailViewModel } from './model'
import { createServiceDetailStructuredData } from './structuredData'

export function ServiceDetailTemplate({ model }: { model: ServiceDetailViewModel }) {
  const { i18n } = useTranslation()
  const { t: tCommon } = useTranslation('common')
  const { AreaNav, NextSteps, diagnosticsAreaItems, serviceNeighbours } = useAreaShell()
  const { content } = model
  const serviceId = model.entry.service.id
  const neighbours = serviceNeighbours(
    tCommon,
    serviceDetailEntries.map((e) => ({ id: e.service.id, to: e.route.path })),
    serviceId,
  )
  return (
    <PageTransition>
      <SEOHead
        title={content.seo.title}
        description={content.seo.description}
        ogImage={content.seo.image}
        ogImageAlt={content.seo.imageAlt || content.hero.title}
        structuredData={createServiceDetailStructuredData(model, i18n.language)}
      />
      <ServiceDetailHero model={model} />
      <TrustBar />
      <AreaNav
        label={tCommon('nav.service')}
        items={diagnosticsAreaItems(tCommon)}
        currentKey={serviceId}
      />
      <div className="bg-paper" data-service-detail-template="v1">
        <div className="mx-auto flex max-w-container flex-col gap-8 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-8 lg:px-0 lg:py-16">
          <article className="min-w-0 space-y-10 text-gray-700">
            <ServiceDetailSections model={model} />
            <ServiceDetailSalesCta model={model} />
            {content.faq?.items.length ? (
              <FAQSection
                items={content.faq.items}
                caption={content.faq.caption}
                title={content.faq.title}
                showFooter={false}
              />
            ) : null}
          </article>
          <PageSidebar widgets={model.sidebarWidgets} />
        </div>
      </div>
      <NextSteps label={tCommon('area.nextLabel')} {...neighbours} />
    </PageTransition>
  )
}

export default ServiceDetailTemplate
