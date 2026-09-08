import { useParams } from 'react-router-dom'
import { getServiceDetailEntry } from '../data/serviceDetail'
import ServiceDetailNotFound from '../components/service-detail/ServiceDetailNotFound'
import ServiceDetailTemplate from '../components/service-detail/ServiceDetailTemplate'
import { useServiceDetailViewModel } from '../components/service-detail/useServiceDetailViewModel'
import type { ServiceDetailEntry } from '../data/serviceDetail'

function ResolvedServicePage({ entry }: { entry: ServiceDetailEntry }) {
  const model = useServiceDetailViewModel(entry)
  return <ServiceDetailTemplate model={model} />
}

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>()
  const entry = getServiceDetailEntry(slug)
  return entry ? <ResolvedServicePage entry={entry} /> : <ServiceDetailNotFound />
}

export default ServicePage
