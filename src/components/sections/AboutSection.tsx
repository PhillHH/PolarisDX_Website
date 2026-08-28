// Importiert wiederverwendbare UI-Komponenten und Icons.
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShieldCheck, Settings2, LifeBuoy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../ui/Button'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'

/**
 * AboutSection — IglooPro Performance-Setup.
 * Zwei-Spalten-Layout: links Gerät in einem gerundeten Navy-Panel mit CV-Chip,
 * rechts Eyebrow + h2 + Lede + 3 Beweis-Säulen + gefüllte Teal-Primär-CTA.
 * i18n-Namespace 'home', Keys unter about.*. SSR-sicher (kein window/localStorage).
 */
type Pillar = {
  icon: LucideIcon
  title: string
  text: string
}

const AboutSection = () => {
  const { t } = useTranslation('home')

  const pillars: Pillar[] = [
    {
      icon: ShieldCheck,
      title: t('about.pillar1.title', 'Validiert ab Tag 1'),
      text: t(
        'about.pillar1.text',
        'Wir nehmen Ihr IglooPro nach CLSI-Vorgaben in Betrieb und belegen die Messpräzision, bevor Sie den ersten Patienten testen.',
      ),
    },
    {
      icon: Settings2,
      title: t('about.pillar2.title', 'Workflow-fertig eingerichtet'),
      text: t(
        'about.pillar2.text',
        'Gerät, Software und Assay-Profile sind auf Ihren Praxisablauf abgestimmt — kein Konfigurationsaufwand auf Ihrer Seite.',
      ),
    },
    {
      icon: LifeBuoy,
      title: t('about.pillar3.title', 'Begleiteter Start'),
      text: t(
        'about.pillar3.text',
        'Einweisung Ihres Teams und ein direkter Ansprechpartner sorgen dafür, dass die diagnostische Exzellenz sofort nutzbar ist.',
      ),
    },
  ]

  return (
    <section id="about" className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-14">
      {/* Linke Spalte: Gerät in einem gerundeten Navy-Panel mit CV-Chip. */}
      <div className="relative flex min-h-[360px] flex-1 items-center justify-center rounded-2xl bg-brand-deep p-10 lg:min-h-[480px]">
        {/* CV-Chip oben rechts. */}
        <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-deep">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {t('about.cv_chip', 'CV < 2 %')}
        </span>

        <img
          src={IglooProImage}
          alt={t('about.device_alt', 'IglooPro POC-Reader')}
          width={448}
          height={448}
          className="w-full max-w-xs object-contain lg:max-w-sm"
        />
      </div>

      {/* Rechte Spalte: Textinhalt. */}
      <div className="flex flex-1 flex-col justify-center">
        {/* GENAU EIN Eyebrow. */}
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {t('about.caption', 'IHR PERFORMANCE-GARANT')}
        </p>

        <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading sm:text-4xl lg:text-[42px]">
          {t('about.title', 'Das IglooPro Performance-Setup: Validierte POC-Diagnostik ab Tag 1.')}
        </h2>

        <p className="mt-4 t-body">
          {t(
            'about.lede',
            'Das IglooPro ist ein Premium-Gerät — doch wahre Premium-Leistung entsteht erst durch eine perfektionierte, risikofreie Inbetriebnahme. Wir übernehmen die Verantwortung für das Ergebnis, damit Ihr POC-Workflow vom ersten Tag an sitzt.',
          )}
        </p>

        {/* 3 Beweis-Säulen. */}
        <ul className="mt-8 space-y-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <li key={pillar.title} className="flex gap-4">
                <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="t-h3">{pillar.title}</h3>
                  <p className="mt-1 t-small">{pillar.text}</p>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Gefüllte Teal-Primär-CTA + sekundärer Text-Link. */}
        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button
            to="/igloo-pro"
            variant="secondary"
            size="lg"
            className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
          >
            {t('about.cta', 'Zum IglooPro-System')}
          </Button>
          <Link
            to="/about"
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            {t('about.company_link', 'Mehr über PolarisDX →')}
          </Link>
        </div>
      </div>
    </section>
  )
}

// Exportiert die Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann.
export default AboutSection
