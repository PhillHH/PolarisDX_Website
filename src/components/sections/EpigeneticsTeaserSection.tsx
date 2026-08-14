/**
 * EpigeneticsTeaserSection
 *
 * Teaser auf der Startseite, direkt unter den Anwendungsbereich-Widgets.
 * Fuehrt die zweite Saeule neben dem Point-of-Care-Geschaeft ein: die
 * Labordiagnostik des Epigenetik- und Genetik-Partnerprogramms (/epigenetics).
 *
 * Der dunkle Navy-Block ist Absicht — die Widget-Sektion darueber ist hell,
 * und derselbe Verlauf traegt auch das Dokumenten-Band auf der Zielseite.
 *
 * Texte kommen aus dem Locale-Namespace `epigenetics` (Block `teaser`), damit
 * die abgestimmten Formulierungen an einer Stelle gepflegt werden. Es gelten
 * dieselben Vorgaben wie auf der Zielseite: kein Partnername, kein CE-Zeichen,
 * keine Preise ausser "B2B nach Absprache", keine Befundlaufzeit.
 *
 * Der zweite Button fuehrt bewusst auf die Musterbefunde und nicht mehr auf die
 * Portfolio-Uebersicht als PDF: das Dokument liegt auf der Zielseite an drei
 * Stellen, die Musterbefunde sind der konkretere Grund fuer den Klick.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, FileText } from 'lucide-react'
import { isEnglishFallback } from '../../lib/translationStatus'

interface Fact {
  label: string
  value: string
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

const Sparkle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
    <path
      d="M50 2 C50 33 33 50 2 50 C33 50 50 67 50 98 C50 67 67 50 98 50 C67 50 50 33 50 2 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
)

const EpigeneticsTeaserSection = () => {
  const { t } = useTranslation('epigenetics')
  const facts = asArray<Fact>(t('teaser.facts', { returnObjects: true }))
  // Acht Sprachen fuehren den Namensraum `epigenetics` bislang auf Englisch.
  // Die Zielseite zeichnet das an ihrem Inhaltscontainer aus; dieser Abschnitt
  // steht dagegen mitten in einer uebersetzten Seite und braucht die
  // Auszeichnung deshalb selbst.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))

  return (
    <section aria-labelledby="epigenetics-teaser-title" lang={englishFallback ? 'en' : undefined}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] px-7 py-12 text-white lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-brand-secondary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-[280px] w-[280px] rounded-full bg-accent/20 blur-3xl" />
        <Sparkle className="pointer-events-none absolute -right-10 -top-10 hidden h-44 w-44 text-white/10 lg:block" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
              {t('teaser.eyebrow')}
            </p>
            <h2
              id="epigenetics-teaser-title"
              className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight"
            >
              {t('teaser.title')}
            </h2>
            <p className="mt-4 max-w-[60ch] text-base leading-7 text-white/80 lg:text-[17px] lg:leading-8">
              {t('teaser.text')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/epigenetics"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
              >
                {t('teaser.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {/* Hash laeuft ueber den Router; das Sprachpraefix haengt der
                  basename der BrowserRouter-Instanz an. */}
              <Link
                to="/epigenetics#musterbefunde"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4" />
                {t('teaser.ctaSamples')}
              </Link>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-base font-semibold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default EpigeneticsTeaserSection
