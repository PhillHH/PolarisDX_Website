import { useTranslation } from 'react-i18next'
import { Button } from '~/design-system'
import SectionIntro from './SectionIntro'
import iglooExplode from '../../../assets/igloo_explode.webp'

/**
 * HomeApproach — „Performance-Setup / Einsatzbereit ab Tag 1" (§NEWLOOK-HOME §4.5).
 *
 * Zweispaltig: links das freigestellte Explosions-/Komponentenbild auf heller
 * Panel-Fläche, rechts Eyebrow/Titel/Text (`about.*`) plus drei nummerierte
 * Schritte (Konfiguration → validierte Inbetriebnahme → erste Messung) und ein
 * CTA. Schritte sind aus dem bestehenden About-Text abgeleitet (keine neuen Fakten).
 */
const HomeApproach = () => {
  const { t } = useTranslation('home')

  const steps = [
    { title: t('approach.step1_title', 'Konfiguration'), text: t('approach.step1_text', 'Vorkonfiguriert und exakt auf Ihren Praxis-Workflow abgestimmt.') },
    { title: t('approach.step2_title', 'Validierte Inbetriebnahme'), text: t('approach.step2_text', 'Wir übernehmen die Verantwortung für das Ergebnis — von der Einrichtung bis zur Freigabe.') },
    { title: t('approach.step3_title', 'Erste validierte Messung'), text: t('approach.step3_text', 'Diagnostische Präzision ab dem ersten Tag, ohne Umweg über ein Zentrallabor.') },
  ]

  return (
    <section id="approach" className="bg-surface">
      <div className="mx-auto grid max-w-container items-center gap-12 px-4 py-24 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:py-32">
        {/* Bild */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-bg-subtle via-surface to-brand-blue/10 ring-1 ring-border">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/12 blur-3xl"
            />
            <img
              src={iglooExplode}
              alt="IglooPro — vorkonfiguriert und validiert ausgeliefert"
              width={600}
              height={450}
              loading="lazy"
              decoding="async"
              className="relative h-full w-full object-contain p-6 drop-shadow-xl"
            />
          </div>
        </div>

        {/* Inhalt */}
        <div>
          <SectionIntro
            eyebrow={t('about.caption', 'Performance-Setup')}
            title={t('about.title', 'Einsatzbereit ab Tag 1 — validierte POC-Diagnostik.')}
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg sm:text-lg">
            {t(
              'about.text1',
              'Ein Premium-Gerät entfaltet seine Leistung erst durch eine reibungslose Inbetriebnahme. Statt Ihnen die Komplexität zu überlassen, übernehmen wir die Verantwortung für das Ergebnis: von der Konfiguration bis zur ersten validierten Messung.',
            )}
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-sm font-semibold text-brand-blue">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-fg-heading">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Button to="/contact" variant="primary" size="lg">
              {t('about.cta', 'Performance-Setup anfragen')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeApproach
