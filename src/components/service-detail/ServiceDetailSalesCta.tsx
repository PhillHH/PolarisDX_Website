import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import type { ServiceDetailViewModel } from './model'

export function ServiceDetailSalesCta({ model }: { model: ServiceDetailViewModel }) {
  return (
    <aside className="sc028-sales" aria-label={model.labels.helpTitle}>
      <div>
        <h2>{model.labels.helpTitle}</h2>
        <p>{model.labels.helpText}</p>
      </div>
      <Link
        to={serviceDetailGeneralSalesTarget}
        data-cta-intent="GENERAL_SALES"
        data-cta-source="service_detail"
        data-cta-journey="general_sales"
        data-cta-section="context"
        data-service-family={model.entry.service.id}
        className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {model.labels.primaryCta}
        <ArrowRight aria-hidden="true" />
      </Link>
    </aside>
  )
}

export default ServiceDetailSalesCta
