import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import SubStage from '../sub/SubStage'
import type { ServiceDetailViewModel } from './model'

/** SC-028: Bühne der Leistungs-Detailseiten im Stil der Startseite (ohne Bild, siehe SubStage). */
export function ServiceDetailHero({ model }: { model: ServiceDetailViewModel }) {
  const { content, entry, labels } = model
  const values = (content.hero.valueChips || []).slice(0, 3)
  return (
    <SubStage
      breadcrumbs={[
        { label: labels.home, href: '/' },
        { label: labels.diagnostics, href: '/diagnostics' },
        { label: content.hero.title },
      ]}
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      lead={content.hero.subtitle ? <p>{content.hero.subtitle}</p> : undefined}
      chips={content.hero.chips}
      actions={
        <Link
          to={serviceDetailGeneralSalesTarget}
          className="sc025-button"
          data-cta-intent="GENERAL_SALES"
          data-cta-source="service_detail"
          data-cta-journey="general_sales"
          data-cta-section="hero"
          data-service-family={entry.service.id}
        >
          {labels.primaryCta}
          <ArrowRight aria-hidden="true" />
        </Link>
      }
      aside={
        values.length > 0 ? (
          <dl className="sc028-aside-list">
            {values.map((chip) => (
              <div key={chip.label}>
                <dt>{chip.label}</dt>
                <dd>{chip.value}</dd>
              </div>
            ))}
          </dl>
        ) : undefined
      }
    />
  )
}

export default ServiceDetailHero
