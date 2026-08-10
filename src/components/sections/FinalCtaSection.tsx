import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { SUPPORTED_LANGUAGES } from '../../i18n'

/**
 * FinalCtaSection — Full-width dunkle Schluss-CTA (B2B-Abschluss der HomePage).
 * Eyebrow (Teal) + grosse H2 + Untertitel, dann zwei CTAs nebeneinander:
 * Primaer (Teal)"Beratung buchen" -> /contact, Sekundaer (Outline)"ROI-Rechner" -> /#roi-rechner.
 * SSR-sicher (kein window/localStorage). i18n-NS 'home', alle Texte via t().
 */

/**
 * Sprachpraefix, das der Router selbst setzt: BrowserRouter (Client) und
 * StaticRouter (SSR) laufen mit basename="/<lang>". Ein hereingereichtes
 * Praefix wuerde sonst verdoppelt: /de/en/#roi-rechner.
 */
const LANG_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGUAGES.join('|')})(?=/|$)`, 'i')

/**
 * Normalisiert den von den Seiten hereingereichten ROI-Link auf einen
 * router-tauglichen `to`-Wert.
 *
 * Hintergrund: zehn Seiten reichen "/#roi-rechner" herein. Als rohes <a href>
 * war das eine harte Navigation auf den Origin-Root; der Server leitete auf
 * /de/ um und die Sprache ging verloren (gemessen: der Klick auf /en/about,
 * /fr/support und /it/services landete jedes Mal auf /de/#roi-rechner).
 * Als <Link to> haengt der Router das aktive Sprachpraefix selbst an, die
 * Navigation bleibt clientseitig, und <ScrollToHash> in App.tsx springt mit
 * Header-Offset auf den Anker.
 *
 * Die Normalisierung sitzt hier in der Komponente, damit die aufrufenden
 * Seiten unveraendert bleiben koennen.
 */
const normalizeRoiTo = (value: string): string => {
  const raw = (value || '').trim()
  // Externe/absolute Ziele gehen unveraendert durch.
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) return raw

  const hashIndex = raw.indexOf('#')
  const hash = hashIndex >= 0 ? raw.slice(hashIndex) : ''
  let path = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(LANG_PREFIX_RE, '')
  if (path === '') path = '/'
  return `${path}${hash}`
}

const FinalCtaSection = ({ roiHref = '/#roi-rechner' }: { roiHref?: string }) => {
  const { t } = useTranslation('home')
  const roiTo = normalizeRoiTo(roiHref)

  return (
    <section id="los-gehts" className="scroll-mt-[124px] lg:scroll-mt-[148px] bg-brand-deep text-white">
      <div className="mx-auto max-w-container px-4 py-24 lg:py-24 lg:px-0 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
          {t('final_cta.caption', 'Bereit loszulegen')}
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-medium tracking-[-0.02em] text-white text-[clamp(28px,5vw,48px)] leading-[clamp(34px,5.6vw,56px)]">
          {t('final_cta.title', 'Bereit für laborgenaue Diagnostik in Ihrer Praxis?')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {t(
            'final_cta.subtitle',
            'Sprechen Sie mit unserem Team oder berechnen Sie Ihr Einsparpotenzial — herstellerübergreifend, IVDR/CE-konform und in 3–5 Werktagen einsatzbereit.',
          )}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            to="/contact"
            variant="secondary"
            className="!bg-accent-strong hover:!brightness-110 focus-visible:!ring-accent"
          >
            {t('final_cta.cta_primary', 'Beratung buchen')}
          </Button>
          <Button to={roiTo} variant="outline">
            {t('final_cta.cta_secondary', 'ROI-Rechner')}
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.free', 'Kostenlos & unverbindlich')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.reply', 'Antwort < 24 h')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.delivery', 'Lieferung in 3–5 Werktagen')}
          </span>
        </div>
      </div>
    </section>
  )
}

export default FinalCtaSection
