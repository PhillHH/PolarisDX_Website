import { useTranslation } from 'react-i18next'
import { Button } from '~/design-system'
import SectionIntro from './SectionIntro'
import iglooFrontal from '../../../assets/Igloo-pro-frontal.webp'

/**
 * HomeProductSpotlight — IglooPro als Held (§NEWLOOK-HOME §4.3).
 *
 * Großes, freigestelltes Produktfoto auf heller Panel-Fläche, daneben
 * Eyebrow/Titel/Text (`doctors.*`), drei Mini-Spezifikationen und genau ein CTA
 * zum Produkt. Premium, ruhig, viel Weißraum.
 */
const HomeProductSpotlight = () => {
  const { t } = useTranslation('home')

  const specs = [
    { value: t('spotlight.spec1_value', '3 Min'), label: t('spotlight.spec1_label', 'Ergebnis am Behandlungsstuhl') },
    { value: t('spotlight.spec2_value', 'CV < 2 %'), label: t('spotlight.spec2_label', 'Laborgenaue Präzision') },
    { value: t('spotlight.spec3_value', '90 %'), label: t('spotlight.spec3_label', 'Lateral-Flow kompatibel') },
  ]

  return (
    <section id="product" className="bg-surface">
      <div className="mx-auto grid max-w-container items-center gap-12 px-4 py-24 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:py-32">
        {/* Produktbild */}
        <div className="relative order-2 lg:order-1">
          <div className="relative mx-auto aspect-square max-w-lg overflow-hidden rounded-[2rem] bg-gradient-to-br from-bg-subtle via-surface to-brand-blue/10 ring-1 ring-border">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-3xl"
            />
            <img
              src={iglooFrontal}
              alt="IglooPro POC-Reader — kompaktes Analysegerät für die Praxisdiagnostik"
              width={560}
              height={560}
              loading="lazy"
              decoding="async"
              className="relative h-full w-full scale-90 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Inhalt */}
        <div className="order-1 lg:order-2">
          <SectionIntro
            eyebrow={t('doctors.caption', 'IglooPro System')}
            title={t('doctors.title', 'Laborgenaue Ergebnisse — direkt am Behandlungsstuhl.')}
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg sm:text-lg">
            {t(
              'doctors.description',
              'Der Igloo Pro von DX365 bringt das Labor an den Behandlungsort. Sie bestimmen relevante Biomarker chairside und treffen Therapieentscheidungen ohne den Umweg über ein Zentrallabor — mit laborgenauen Resultaten in Minuten.',
            )}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {specs.map((s) => (
              <div key={s.label}>
                <dd className="text-xl font-semibold tracking-tight text-fg-heading sm:text-2xl">
                  {s.value}
                </dd>
                <dt className="mt-1 text-xs leading-snug text-fg-muted sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <Button to="/igloo-pro" variant="primary" size="lg">
              {t('doctors.cta', 'Zum Igloo Pro System')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeProductSpotlight
