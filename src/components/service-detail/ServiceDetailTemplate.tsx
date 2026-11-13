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
import SubPage from '../sub/SubPage'
import type { ServiceDetailViewModel } from './model'
import { createServiceDetailStructuredData } from './structuredData'
import EventBand from '../events/EventBand'

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
      <SubPage page="service">
        <ServiceDetailHero model={model} />
        <TrustBar />
        <EventBand />
        <AreaNav
          label={tCommon('nav.service')}
          items={diagnosticsAreaItems(tCommon)}
          currentKey={serviceId}
        />
        <div data-service-detail-template="v1">
          <article>
            <ServiceDetailSections model={model} />
            <div className="sc025-s sc028-after" data-sub-section>
              <div className="sc025-inner">
                <ServiceDetailSalesCta model={model} />
                {content.faq?.items.length ? (
                  <FAQSection
                    items={content.faq.items}
                    caption={content.faq.caption}
                    title={content.faq.title}
                    showFooter={false}
                  />
                ) : null}
              </div>
            </div>
          </article>
          {/* Die Inhalte der früheren Randspalte stehen als eigener Abschnitt unter dem Artikel.
              Die Randspalte bleibt Enkel des Vorlagen-Rahmens (`> div > aside`, e2e service-detail-closure). */}
          <div className="sc025-s sc025-tint sc028-more" data-sub-section>
            <PageSidebar widgets={model.sidebarWidgets} />
          </div>
        </div>
        <NextSteps label={tCommon('area.nextLabel')} {...neighbours} />
      </SubPage>
    </PageTransition>
  )
}

export default ServiceDetailTemplate
