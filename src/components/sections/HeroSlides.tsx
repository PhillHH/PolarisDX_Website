/**
 * HeroSlides — Folien 2 und 3 der Startseiten-Bühne plus Bedienung (SC-020).
 *
 * Owner 2026-10-27: „in der Hero einen Slider". Folie 1 (H1, Foto, Produktkarte) bleibt das
 * serverseitig gerenderte LCP-Element in `HeroSection`; diese Datei lädt erst im Browser nach
 * dem ersten Bild (dynamischer Import) und kostet darum weder Startseiten-HTML noch Initial-JS.
 * Layout-Klassen kommen als Prop `stage` aus `HeroSection` (einmal im Hauptbündel, hier nur
 * referenziert — kein eigener Export, siehe heroStage.ts).
 *
 * Keine KI-Bilder (Owner 2026-10-27): Folie 2 zeigt den nächsten Termin (der Lageplan bleibt auf der
 * Terminseite — als Karte überdeckte er im Folienbild das Gerät), Folie 3 die Panel-Aktion mit dem
 * echten Musterbefund.
 * Owner 2026-10-29 („Das Herobild darf nicht das gleiche wie der Startseite sein"): ab lg tragen
 * die Themenfolien eigene Hintergründe aus dem freigegebenen Motiv-Pool (`public/home/*.avif`
 * aus `build-photo-look.mjs`, Verlauf eingebacken; feste Pfade statt Import — Budget); das
 * Bühnenfoto blendet dann aus, auf Telefonen bleibt die Navy-Bühne.
 * Ohne Termin und ohne Aktion gibt es keinen Slider. Nur die aktive Folie steht im DOM.
 *
 * Bedienung (Pfeile, Punkte, Pause/Weiter — WCAG 2.2.2) steht unter den Buttons der aktiven
 * Folie: `HeroSection` und jede Folie reservieren dafür einen Platzhalter (`mt-7 h-11`, kein
 * Layoutsprung), die eine Bedienleiste wird per Portal hineingesetzt. Unten im Bühnenrand
 * läge sie hinter dem Vertrauensband (PT24.6 fand den abgefangenen Klick). Beim Wechsel der
 * Folie wandert die Leiste mit; der zuletzt gedrückte Knopf bekommt den Fokus zurück.
 * Wechsel alle 8 s, angehalten bei Zeigerkontakt und Fokus; bei reduzierter Bewegung kein
 * automatischer Wechsel.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import reportImage from '../../assets/home/report-preview-800w.webp'
import { getNextHomeEvent } from '../../data/events'
import { formatEventRange } from '../../lib/eventDates'
import { isPanelsPromoActive, panelsUrl } from '../../lib/shop'
import { Button } from '../ui/Button'
import type { Stage } from './heroStage'

const INTERVAL_MS = 8000
/** Hintergruende der Themenfolien ab lg (2:1, 1440w AVIF; ohne AVIF zeigt alt="" nichts → Navy). */
const PHOTO = { event: '/home/event.avif', panels: '/home/panels.avif' }
const CONTROL =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'

type Host = (element: HTMLDivElement | null) => void

interface SlideProps {
  stage: Stage
  label: string
  eyebrow: ReactNode
  title: ReactNode
  lead: ReactNode
  actions: ReactNode
  aside?: ReactNode
  host: Host
}

const Slide = ({ stage, label, eyebrow, title, lead, actions, aside, host }: SlideProps) => (
  <div
    role="group"
    aria-roledescription="slide"
    aria-label={label}
    className={`absolute inset-0 ${stage.grid}`}
  >
    <div className={stage.column}>
      <p className={stage.eyebrow}>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
        {eyebrow}
      </p>
      <h2 className={`${stage.title} text-balance text-4xl sm:text-5xl`}>{title}</h2>
      <p className={stage.lead}>{lead}</p>
      <div className={stage.actions}>{actions}</div>
      <div ref={host} className="mt-7 h-11" />
    </div>
    {aside && <div className="hidden lg:block lg:justify-self-end">{aside}</div>}
  </div>
)

interface HeroSlidesProps {
  active: number
  onChange: (index: number) => void
  stage: Stage
  /** Platzhalter unter den Buttons von Folie 1 (HeroSection). */
  host: HTMLDivElement | null
}

const HeroSlides = ({ active, onChange, stage, host }: HeroSlidesProps) => {
  const { t, i18n } = useTranslation(['home', 'events'])
  const event = getNextHomeEvent()
  const promo = isPanelsPromoActive()
  const ids = ['main', ...(event ? ['event'] : []), ...(promo ? ['panels'] : [])]
  const total = ids.length
  // Der Chunk laeuft nur im Browser (dynamischer Import nach dem ersten Bild) — kein SSR-Guard noetig.
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [playing, setPlaying] = useState(!reduce)
  const [held, setHeld] = useState(false)
  const [slideHost, setSlideHost] = useState<HTMLDivElement | null>(null)
  const focusKey = useRef<string | null>(null)
  const target = active === 0 ? host : slideHost

  useEffect(() => {
    if (!playing || held) return
    const id = window.setTimeout(() => onChange((active + 1) % total), INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [active, playing, held, total, onChange])

  // Nach einem Klick zieht die Leiste in die neue Folie um — der gedrückte Knopf behält den Fokus.
  useEffect(() => {
    const key = focusKey.current
    focusKey.current = null
    if (key) target?.querySelector<HTMLElement>(`[data-k="${key}"]`)?.focus()
  }, [target])

  const jump = (index: number, key: string) => () => {
    focusKey.current = key
    onChange((index + total) % total)
  }
  const slideLabel = (n: number) => t('hero_slides.slide', { n, total })
  const current = ids[active]

  const slide: Omit<SlideProps, 'stage' | 'host'> | null =
    current === 'event' && event
      ? {
          label: slideLabel(active + 1),
          eyebrow: `${t('aktuell.event_eyebrow')} · ${t(`events:items.${event.id}.tag`, '')}`,
          title: (
            <>
              {t(`events:items.${event.id}.title`)}
              <span className="block text-accent-on-dark">
                {t(`events:items.${event.id}.short`, event.location)}
              </span>
            </>
          ),
          lead: (
            <>
              <time dateTime={event.date}>
                {formatEventRange(i18n.language, event.date, event.endDate)}
              </time>
              {' · '}
              {event.location}
            </>
          ),
          actions: (
            <>
              <Button to="/events" variant="light" className={stage.primary}>
                {t('aktuell.event_cta')}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button to="/contact" variant="ghost" className={stage.ghost}>
                {t('hero_slides.meet')}
              </Button>
            </>
          ),
        }
      : current === 'panels'
        ? {
            label: slideLabel(active + 1),
            eyebrow: t('shop_teaser.promo_eyebrow'),
            title: t('shop_teaser.promo_title'),
            lead: t('shop_teaser.promo_text'),
            actions: (
              <Button href={panelsUrl(i18n.language)} variant="light" className={stage.primary}>
                {t('shop_teaser.cta_panels')}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ),
            aside: (
              <img
                src={reportImage}
                alt=""
                width={800}
                height={1131}
                className="h-auto w-full max-w-xs rounded-card shadow-card"
              />
            ),
          }
        : null

  const controls = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        data-k="p"
        className={CONTROL}
        aria-label={t('hero_slides.prev')}
        onClick={jump(active - 1, 'p')}
      >
        <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2" role="tablist" aria-label={t('hero_slides.aria')}>
        {ids.map((id, index) => (
          <button
            key={id}
            type="button"
            role="tab"
            data-k={id}
            aria-selected={index === active}
            aria-label={slideLabel(index + 1)}
            onClick={jump(index, id)}
            className="flex h-11 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-8 bg-accent-on-dark' : 'w-3 bg-white/40'
              }`}
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        data-k="n"
        className={CONTROL}
        aria-label={t('hero_slides.next')}
        onClick={jump(active + 1, 'n')}
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={CONTROL}
        aria-pressed={!playing}
        aria-label={playing ? t('hero_slides.pause') : t('hero_slides.play')}
        onClick={() => setPlaying((value) => !value)}
      >
        {/* Pause = zwei Balken, Weiter = Dreieck: ein Inline-SVG statt zweier Icon-Module */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          {playing ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="M7 3l14 9-14 9z" />}
        </svg>
      </button>
    </div>
  )

  return (
    <div
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {/* Hintergrund der Themenfolie (ab lg); das Buehnenfoto darunter blendet in HeroSection aus */}
      {slide && (
        <img
          src={PHOTO[current as keyof typeof PHOTO]}
          alt=""
          className="absolute inset-0 -z-10 hidden h-full w-full object-cover animate-modal-backdrop-in motion-reduce:animate-none lg:block"
        />
      )}
      {slide && <Slide {...slide} stage={stage} host={setSlideHost} />}
      {target && createPortal(controls, target)}
    </div>
  )
}

export default HeroSlides
