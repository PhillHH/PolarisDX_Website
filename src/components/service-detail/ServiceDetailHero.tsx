import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import SubpageHero from '../sections/SubpageHero'
import type { ServiceDetailViewModel } from './model'

export function ServiceDetailHero({ model }: { model: ServiceDetailViewModel }) {
  const { content, entry, labels } = model
  return (
    <SubpageHero
      breadcrumbs={[
        { label: labels.home, href: '/' },
        { label: labels.diagnostics, href: '/diagnostics' },
        { label: content.hero.title },
      ]}
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      subtitle={content.hero.subtitle}
      primaryCta={{
        label: labels.primaryCta,
        to: serviceDetailGeneralSalesTarget,
        attributes: {
          'data-cta-intent': 'GENERAL_SALES',
          'data-cta-source': 'service_detail',
          'data-cta-journey': 'general_sales',
          'data-cta-section': 'hero',
          'data-service-family': entry.service.id,
        },
      }}
      chips={content.hero.chips}
      gauge={content.hero.gauge}
      valueChips={content.hero.valueChips}
      icon={content.hero.icon}
    />
  )
}

export default ServiceDetailHero
