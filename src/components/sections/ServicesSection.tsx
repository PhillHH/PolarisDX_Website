import SectionHeader from '../ui/SectionHeader'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../../data/services'

const ServicesSection = () => {
  return (
    <section id="services" className="space-y-10">
      <SectionHeader
        caption="DIAGNOSTIK-FOKUS"
        title="Schlüsselbereiche der Präventivdiagnostik"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  )
}

export default ServicesSection


