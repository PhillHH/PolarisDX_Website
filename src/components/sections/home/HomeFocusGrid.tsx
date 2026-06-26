import { useTranslation } from 'react-i18next'
import { Cpu, ShieldCheck, Thermometer, HeartPulse, FlaskConical, Layers, type LucideIcon } from 'lucide-react'
import SectionIntro from './SectionIntro'

/**
 * HomeFocusGrid — Diagnostik-Fokus (§NEWLOOK-HOME §4.6).
 *
 * Sechs ruhige, bordered Themenkarten mit Lucide-Icon, Titel und Text aus
 * `services.*`. Holt damit den bislang ungenutzten Services-Content auf die
 * Startseite — informativ, ohne erfundene Aussagen. Einheitlicher Icon-Typ
 * (`LucideIcon`) → typsichere Icon-Map.
 */
const HomeFocusGrid = () => {
  const { t } = useTranslation('home')

  const items: { id: string; icon: LucideIcon; title: string; description: string }[] = [
    {
      id: 'poc_systemloesungen',
      icon: Cpu,
      title: t('services.poc_systemloesungen.title', 'POC-Systemlösungen'),
      description: t('services.poc_systemloesungen.description', ''),
    },
    {
      id: 'praeventions_checks',
      icon: ShieldCheck,
      title: t('services.praeventions_checks.title', 'Präventive Gesundheits-Checks'),
      description: t('services.praeventions_checks.description', ''),
    },
    {
      id: 'infektion_entzuendung',
      icon: Thermometer,
      title: t('services.infektion_entzuendung.title', 'Infektion & Entzündungsmarker'),
      description: t('services.infektion_entzuendung.description', ''),
    },
    {
      id: 'stoffwechsel_herz',
      icon: HeartPulse,
      title: t('services.stoffwechsel_herz.title', 'Stoffwechsel & Herzgesundheit'),
      description: t('services.stoffwechsel_herz.description', ''),
    },
    {
      id: 'hormon_tests',
      icon: FlaskConical,
      title: t('services.hormon_tests.title', 'Hormon- & Endokrinologie-Tests'),
      description: t('services.hormon_tests.description', ''),
    },
    {
      id: 'kompatibilitaet_integration',
      icon: Layers,
      title: t('services.kompatibilitaet_integration.title', 'Herstellerübergreifende Kompatibilität'),
      description: t('services.kompatibilitaet_integration.description', ''),
    },
  ]

  return (
    <section id="focus" className="bg-bg">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <SectionIntro
          eyebrow={t('services.caption', 'Diagnostik-Fokus')}
          title={t('services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map(({ id, icon: Icon, title, description }) => (
            <article
              key={id}
              className="flex flex-col rounded-3xl border border-border bg-surface p-7 shadow-1 transition-shadow duration-300 hover:shadow-2"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy/5 text-brand-blue">
                <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg-heading">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeFocusGrid
