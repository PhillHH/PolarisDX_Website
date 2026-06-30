import { useTranslation } from 'react-i18next'
import { Truck, UserCheck, Coins } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

/**
 * WhyPocSection — Argument fuer Point-of-Care in der eigenen Praxis.
 * Full-width Section auf hellem Grund, 3 Nutzen-Karten (kein Laborversand /
 * Patient bleibt im Stuhl / neuer Selbstzahler-Umsatz).
 * i18n-Namespace 'home', Keys unter why.*. SSR-sicher (kein window/localStorage).
 */
type WhyCard = {
  icon: LucideIcon
  title: string
  text: string
}

const WhyPocSection = () => {
  const { t } = useTranslation('home')

  const cards: WhyCard[] = [
    {
      icon: Truck,
      title: t('why.card1.title', 'Kein Laborversand'),
      text: t(
        'why.card1.text',
        'Das Ergebnis liegt sofort vor Ort vor — keine Wartezeit auf den Befund aus dem externen Labor.',
      ),
    },
    {
      icon: UserCheck,
      title: t('why.card2.title', 'Patient bleibt im Stuhl'),
      text: t(
        'why.card2.text',
        'Werte messen und den nächsten Schritt direkt im selben Termin besprechen — ohne erneute Einbestellung.',
      ),
    },
    {
      icon: Coins,
      title: t('why.card3.title', 'Neuer Selbstzahler-Umsatz'),
      text: t(
        'why.card3.text',
        'POC erschließt neue Selbstzahler-Leistungen in Ihrer Praxis, statt Umsatz an das externe Labor abzugeben.',
      ),
    },
  ]

  return (
    <section id="warum-poc" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-20 lg:py-28">
        {/* Kopf */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {t('why.caption', 'Point of Care')}
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading sm:text-4xl lg:text-[42px]">
            {t('why.title', 'Warum POC in Ihrer Praxis?')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {t(
              'why.intro',
              'Diagnostik direkt am Behandlungsplatz: Ergebnis in Minuten statt Tage warten — das verändert Ablauf, Patientenerlebnis und Wirtschaftlichkeit Ihrer Praxis.',
            )}
          </p>
        </div>

        {/* Karten */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <ImagePlaceholder
                  label={t('why.image_label', 'Anwendungsbild')}
                  className="aspect-[4/3] w-full mb-4 bg-slate-100 border-slate-200"
                />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-heading">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{card.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyPocSection
