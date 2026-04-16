import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../../data/services'
import { type Service } from '../../types/models'

const ServicesSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="services" className="space-y-10">
      <SectionHeader
        caption={t('services.caption', 'DIAGNOSTIK-FOKUS')}
        title={t('services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
      />

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {services.map((s) => {
          // Construct the Service object with translated content for the card
          // The Card expects a Service object.
          // Since the translation happens here, we might need to "hydrate" the service object with the translated strings
          // OR the card should do the translation.
          // Previous approach: Parent passes translated strings.
          // New approach: Card takes Service object.
          // BUT: The service object in data/services only has the key.
          // The ServiceCard code I wrote expects `service.title` to be the displayable string?
          // Let's check ServiceCard again. It renders `{service.title}` directly.
          // So I need to create a "displayable" service object here.

          const displayService: Service = {
            ...s,
            title: t(`services.${s.translationKey}.title`),
            description: t(`services.${s.translationKey}.description`)
          }

          return (
            <ServiceCard
              key={s.id}
              service={displayService}
            />
          )
        })}
      </div>
    </section>
  )
}

export default ServicesSection
