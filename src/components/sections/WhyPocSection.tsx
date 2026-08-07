import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Truck, UserCheck, Coins, Play } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * WhyPocSection — Argument fuer Point-of-Care in der eigenen Praxis.
 * Split-Layout: links 3 gestapelte Nutzen-Karten (kein Laborversand /
 * Patient bleibt im Stuhl / neuer Selbstzahler-Umsatz), rechts ein
 * gruenes Media-Panel mit Play-Platzhalter (kein echtes Video).
 * i18n-Namespace 'home', Keys unter why.*. SSR-sicher (kein window/localStorage).
 */
type WhyCard = {
  icon: LucideIcon
  title: string
  text: string
  bg: string
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
      bg: 'bg-brand-deep',
    },
    {
      icon: UserCheck,
      title: t('why.card2.title', 'Patient bleibt im Stuhl'),
      text: t(
        'why.card2.text',
        'Werte messen und den nächsten Schritt direkt im selben Termin besprechen — ohne erneute Einbestellung.',
      ),
      bg: 'bg-accent-strong',
    },
    {
      icon: Coins,
      title: t('why.card3.title', 'Neuer Selbstzahler-Umsatz'),
      text: t(
        'why.card3.text',
        'POC erschließt neue Selbstzahler-Leistungen in Ihrer Praxis, statt Umsatz an das externe Labor abzugeben.',
      ),
      bg: 'bg-brand-deep',
    },
  ]

  return (
    <section id="warum-poc" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        {/* Kopf */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
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

        {/* Split-Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LINKS: 3 gestapelte Karten */}
          <div className="flex flex-col gap-4">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} className={`rounded-2xl p-7 text-white ${card.bg}`}>
                  <span className="inline-flex rounded-lg bg-white/10 p-2">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-medium">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white">{card.text}</p>
                  <Link
                    to="/diagnostics"
                    className="mt-4 inline-block text-sm text-white hover:underline"
                  >
                    {t('why.card_cta', 'Mehr erfahren') + ' →'}
                  </Link>
                </div>
              )
            })}
          </div>

          {/* RECHTS: gruenes Media-Panel (Play = Platzhalter, kein echtes Video) */}
          <div className="relative h-full min-h-[20rem] overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent-strong">
            <span className="absolute top-4 left-4 text-xs font-medium text-white/60">
              {t('why.video_label', 'ANWENDUNGSVIDEO')}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex rounded-full bg-white/90 p-4 text-brand-deep">
                <Play size={28} aria-hidden="true" />
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white px-4 py-3 text-sm text-heading shadow">
              {t('why.video_caption', 'So läuft der Test in Ihrer Praxis – in 3 Minuten')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyPocSection
