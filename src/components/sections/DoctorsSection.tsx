import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton'
import SectionHeader from '../ui/SectionHeader'
import IglooProImage from '../../assets/Igloo-pro-frontal.png'
import IglooProFlyer from '../../assets/downloads/igloo-pro-flyer.pdf'

const DiagnosticsPitchSection = () => {
  const { t } = useTranslation('home')

  // Name der Komponente angepasst
  return (
    <section
      id="diagnostics-pitch" // ID angepasst
      className="grid items-center gap-8 lg:grid-cols-5 lg:gap-10"
    >
      <div className="relative order-2 space-y-6 lg:order-1 lg:col-span-3 lg:space-y-0">
        <SectionHeader
          // Kicker-Text angepasst
          caption={t('doctors.caption', 'DIAGNOSTIK-FOKUS')}
          // Titel auf Kernbotschaft umgestellt
          title={t('doctors.title', 'Präzise Diagnostik. Sofortige Ergebnisse am Point-of-Care.')}
          align="center"
          titleClassName="text-[clamp(28px,6.2vw,48px)] leading-[clamp(34px,6.8vw,56px)] font-medium tracking-[-0.02em] text-gray-900"
        />
        {/* Fließtext auf Mehrwert für Kunden angepasst */}
        <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg lg:mt-6">
          {t('doctors.description', 'Entdecken Sie mit Systemen wie dem Igloo Pro von DX365...')}
        </p>
<<<<<<< HEAD
        <div className="mt-6 flex justify-center lg:mt-8 lg:justify-start">
=======
        <div className="mt-8 flex justify-start lg:mt-12">
>>>>>>> 73ecd2543f1ed48d84e1232641a50c2598f38202
          <PrimaryButton as="a" href={IglooProFlyer} target="_blank" rel="noopener noreferrer" size="sm">
            {/* Button-Text angepasst */}
            {t('doctors.cta', 'Zum Igloo Pro System')}
          </PrimaryButton>
        </div>
      </div>

      <div className="hidden lg:relative lg:order-2 lg:col-span-2 lg:block">
        <div className="absolute -right-4 bottom-5 top-10 w-60 rounded-3xl bg-primary" />
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={IglooProImage}
            alt="Igloo Pro device"
            className="object-cover w-full h-full scale-[1.375] translate-x-8 transform"
          />
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsPitchSection
