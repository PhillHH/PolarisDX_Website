import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../../data/services'

const ServicesSection = () => {
  const { t } = useTranslation()

  return (
    <section id="services" className="space-y-10">
      <SectionHeader
        caption={t('services.caption', 'DIAGNOSTIK-FOKUS')}
        title={t('services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={t(`services.${service.translationKey}.title`)}
            description={t(`services.${service.translationKey}.description`)}
          />
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
