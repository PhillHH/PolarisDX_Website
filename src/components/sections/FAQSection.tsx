import { Fragment, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import Eyebrow from '../ui/Eyebrow'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  /** i18n namespace to load FAQ items from (default: 'home') */
  namespace?: string
  /** i18n key path for the items array (default: 'faq.items') */
  faqKey?: string
  /** Override caption text (falls back to i18n) */
  caption?: string
  /** Override title text (falls back to i18n) */
  title?: string
  /** Show the footer with links to services/contact (default: true) */
  showFooter?: boolean
  /** Pass FAQ items directly, bypassing i18n lookup */
  items?: FAQItem[]
}

const FOOTER_LINK =
  'rounded-sm font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

/**
 * FAQ-Akkordeon (Startseite #faq und Service-Seiten).
 *
 * SC-006 (2026-10-16): der Kopf steht linksbuendig im Raster der Startseite (Eyebrow +
 * `t-display`) statt zentriert, die Fusszeile "Noch Fragen?" folgt dem Akkordeon;
 * jede Frage traegt eine laufende Nummer, der Chevron sitzt in einer `icon-tile`,
 * die im offenen Zustand Navy wird, und die Antwort klappt ueber `faq-panel` weich
 * auf. Semantik unveraendert: Button mit aria-expanded/aria-controls, Antwort als
 * `role="region"` mit `hidden`.
 *
 * Die Nummer ist Dekor und steht NEBEN dem Button, nicht darin: der Textinhalt des
 * Buttons muss exakt die Frage sein (E2E `toHaveText`, Abgleich mit dem FAQ-Schema),
 * und Screenreader sollen keine "01" vor jeder Frage hoeren (aria-hidden). Sie liegt
 * absolut ueber dem linken Innenabstand (`pl-10`) der Zeile und laesst Zeigerereignisse
 * durch — die ganze Zeile bleibt Treffer- und Hover-Flaeche des Buttons. Die Antwort
 * ist bewusst ein Geschwister der Fragezeile (kein gemeinsamer Wrapper), damit
 * `inset-y-0` die Nummer nur auf der Frage zentriert und nie ueber die offene Antwort
 * streckt; die Trennlinien traegt deshalb jede Zeile ab der zweiten selbst.
 */
const FAQSection = ({
  namespace = 'home',
  faqKey = 'faq.items',
  caption,
  title,
  showFooter = true,
  items,
}: FAQSectionProps) => {
  const { t } = useTranslation(namespace)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const idPrefix = useId().replace(/:/g, '')

  // Use direct items when provided, otherwise load from i18n
  const faqItems: FAQItem[] = items ?? (t(faqKey, { returnObjects: true }) as FAQItem[])

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq">
      <div className="rv">
        <Eyebrow>{caption ?? t('faq.caption', 'FAQ')}</Eyebrow>
        <h2 className="mt-3 t-display">
          {title ?? t('faq.title', 'Häufige Fragen zu PolarisDX und Point-of-Care Diagnostik')}
        </h2>
      </div>

      <div className="rv mt-12 overflow-hidden rounded-card border border-paper-line bg-white shadow-card">
        {Array.isArray(faqItems) &&
          faqItems.map((item, index) => {
            const buttonId = `${idPrefix}-faq-question-${index}`
            const answerId = `${idPrefix}-faq-answer-${index}`
            const open = openIndex === index

            return (
              <Fragment key={item.question}>
                <div className={index ? 'relative border-t border-paper-line' : 'relative'}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold tabular-nums text-accent-strong"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center gap-3 px-5 py-4 pl-10 text-left transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
                    aria-expanded={open}
                    aria-controls={answerId}
                  >
                    <span className="min-w-0 flex-1 text-base font-medium text-heading sm:text-lg">
                      {item.question}
                    </span>
                    {/* Das Lucide-Icon ist selbst aria-hidden; Bewegungsreduktion faengt das
                        Sicherheitsnetz am Ende von index.css ab. */}
                    <span className={`icon-tile ${open ? 'bg-brand-deep text-white' : ''}`}>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ease-out ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </button>
                </div>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="faq-panel"
                >
                  {/* Gleicher linker Einzug wie der Fragetext (pl-10): Antwort und Frage
                      stehen auf einer Kante, die Nummer bleibt allein in der Randspalte. */}
                  <p className="max-w-[61ch] px-5 pb-6 pl-10 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </Fragment>
            )
          })}
      </div>

      {/* Die beiden Ausstiegswege bleiben die FUSSZEILE der FAQ (HOMEPAGE-CONTRACT §8 „FAQ footer"):
          im DOM und in der Tab-Reihenfolge nach den Fragen — „Noch Fragen?" setzt gelesene Fragen voraus. */}
      {showFooter && (
        <p className="rv mt-8 max-w-xl text-base leading-7 text-gray-700">
          {t('faq.more', 'Noch Fragen?')}{' '}
          <Link to="/diagnostics" className={FOOTER_LINK}>
            {t('faq.link_services', 'Diagnostik-Services ansehen')}
          </Link>{' '}
          {t('faq.or', 'oder')}{' '}
          <Link to="/contact" className={FOOTER_LINK}>
            {t('faq.link_contact', 'direkt Kontakt aufnehmen')}
          </Link>
        </p>
      )}
    </section>
  )
}

export default FAQSection
