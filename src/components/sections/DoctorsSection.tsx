import PrimaryButton from '../ui/PrimaryButton'
import SectionHeader from '../ui/SectionHeader'
import IglooProImage from '../../assets/Igloo-pro-frontal.png'

const DiagnosticsPitchSection = () => {
  // Name der Komponente angepasst
  return (
    <section
      id="diagnostics-pitch" // ID angepasst
      className="grid items-center gap-10 lg:grid-cols-5"
    >
      <div className="relative order-2 lg:order-1 lg:col-span-3">
        <SectionHeader
          // Kicker-Text angepasst
          caption="DIAGNOSTIK-FOKUS"
          // Titel auf Kernbotschaft umgestellt
          title="Präzise Diagnostik. Sofortige Ergebnisse am Point-of-Care."
          align="left"
        />
        {/* Fließtext auf Mehrwert für Kunden angepasst */}
        <p className="mt-6 text-sm leading-relaxed text-gray-500 sm:text-base">
          Entdecken Sie mit Systemen wie dem Igloo Pro von DX365, wie Sie
          Ihre Patientenversorgung optimieren und wichtige Diagnosen direkt am
          Behandlungsort stellen können – mit laborgenaue Resultaten in

          Minutenschnelle.
        </p>
        <PrimaryButton as="a" href="/produkte/igloo-pro" className="mt-8">
          {/* Button-Text angepasst */}
          Zum Igloo Pro System
        </PrimaryButton>
      </div>

      <div className="relative order-1 lg:order-2 lg:col-span-2">
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