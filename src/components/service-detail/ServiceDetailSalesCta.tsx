import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import { Button } from '../ui/Button'
import type { ServiceDetailViewModel } from './model'

export function ServiceDetailSalesCta({ model }: { model: ServiceDetailViewModel }) {
  return (
    <aside
      className="flex flex-col gap-4 rounded-2xl bg-accent-strong p-7 text-white md:flex-row md:items-center md:justify-between"
      aria-label={model.labels.helpTitle}
    >
      <div>
        <h2 className="font-medium text-white">{model.labels.helpTitle}</h2>
        <p className="mt-1 text-sm leading-relaxed text-white/90">{model.labels.helpText}</p>
      </div>
      <Button
        to={serviceDetailGeneralSalesTarget}
        variant="primary"
        size="sm"
        data-cta-intent="GENERAL_SALES"
        data-cta-source="service_detail"
        data-cta-journey="general_sales"
        data-cta-section="context"
        data-service-family={model.entry.service.id}
        className="shrink-0 whitespace-nowrap focus-visible:ring-white"
      >
        {model.labels.primaryCta}
      </Button>
    </aside>
  )
}

export default ServiceDetailSalesCta
