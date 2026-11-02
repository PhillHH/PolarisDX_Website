/**
 * HeroSlides — Folien 2 und 3 der Startseiten-Bühne plus Bedienung (SC-020, neu gefasst in
 * SC-021: Owner 2026-11-02 „die Hero-Section soll als Slider auftreten, die MEDICA in der Hero").
 *
 * Folie 1 (H1, Fotokarte) bleibt das serverseitig gerenderte LCP-Element in `HeroSection`; diese
 * Datei lädt erst im Browser nach dem ersten Bild (dynamischer Import) und kostet darum weder
 * Startseiten-HTML noch Initial-JS. Layout-Klassen kommen als Prop `stage` aus `HeroSection`.
 *
 * Folie 2 = nächster Termin (SC-019-Daten) mit Navy-Kachel rechts (Datum, Halle/Stand, Countdown,
 * Standtermin) — Idee 3 der Owner-Runde; Folie 3 = Panel-Aktion mit echtem Musterbefund. Ohne
 * Termin und ohne Aktion gibt es keinen Slider. Nur die aktive Folie steht im DOM.
 *
 * Bedienung (Pfeile, Punkte, Pause/Weiter — WCAG 2.2.2) steht unter den Buttons der aktiven
 * Folie: `HeroSection` und jede Folie reservieren dafür einen Platzhalter (`mt-7 h-11`), die eine
 * Bedienleiste wird per Portal hineingesetzt; der zuletzt gedrückte Knopf behält den Fokus.
 * Wechsel alle 8 s, angehalten bei Zeigerkontakt und Fokus; bei reduzierter Bewegung kein
 * automatischer Wechsel.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import reportImage from '../../assets/home/report-preview-800w.webp'
import { getEventStatus, getNextHomeEvent, toEventDay } from '../../data/events'
import { daysUntil, formatEventRange } from '../../lib/eventDates'
import { isPanelsPromoActive, panelsUrl } from '../../lib/shop'
import { Button } from '../ui/Button'
import type { Stage } from './heroStage'

const INTERVAL_MS = 8000
const CONTROL =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-brand-deep hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

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
    {aside && <div className="hidden w-full lg:block lg:justify-self-end">{aside}</div>}
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
  const { t, i18n } = useTranslation(['home', 'events', 'common'])
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

  let slide: Omit<SlideProps, 'stage' | 'host'> | null = null
  if (current === 'event' && event) {
    const today = toEventDay(new Date())
    const ongoing = getEventStatus(event, today) === 'ongoing'
    const days = daysUntil(event.date, today)
    const short = t(`events:items.${event.id}.short`, '')
    slide = {
      label: slideLabel(active + 1),
      eyebrow: `${t('aktuell.event_eyebrow')} · ${t(`events:items.${event.id}.tag`, '')}`,
      title: (
        <>
          {t(`events:items.${event.id}.title`)}
          <span className="block text-accent">{t('hero_slides.event_invite')}</span>
        </>
      ),
      lead: t(`events:items.${event.id}.description`, ''),
      actions: (
        <>
          <Button to="/contact" variant="secondary" className={stage.primary}>
            {t('hero_slides.meet')}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Button>
          <Button to="/events" variant="ghost" className={stage.ghost}>
            {t('aktuell.event_cta')}
          </Button>
        </>
      ),
      aside: (
        <div className="aurora flex aspect-[16/10] w-full flex-col rounded-card bg-brand-deep p-7 text-white shadow-card">
          <p className="t-eyebrow-dark">
            {t(`events:items.${event.id}.title`)} · {event.location}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight xl:text-5xl">
            <time dateTime={event.date}>
              {formatEventRange(i18n.language, event.date, event.endDate)}
            </time>
          </p>
          {short && <p className="mt-2 text-lg text-white/85">{short}</p>}
          <div className="mt-auto flex items-end justify-between gap-4">
            <p className="text-sm text-white/80">
              <span className="block text-3xl font-semibold tracking-tight text-white">
                {ongoing || days <= 0 ? t('common:event_band.now') : days}
              </span>
              {ongoing || days <= 0
                ? ''
                : days === 1
                  ? t('common:event_band.day_label')
                  : t('common:event_band.days_label')}
            </p>
            <Button to="/contact" variant="light" size="sm" className="whitespace-nowrap">
              {t('common:event_popup.meet')}
            </Button>
          </div>
        </div>
      ),
    }
  } else if (current === 'panels') {
    slide = {
      label: slideLabel(active + 1),
      eyebrow: t('shop_teaser.promo_eyebrow'),
      title: t('shop_teaser.promo_title'),
      lead: t('shop_teaser.promo_text'),
      actions: (
        <Button href={panelsUrl(i18n.language)} variant="secondary" className={stage.primary}>
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
          className="mx-auto h-auto max-h-[420px] w-auto rounded-card shadow-card"
        />
      ),
    }
  }

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
            className="flex h-11 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <span
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-8 bg-accent-line' : 'w-3 bg-slate-300'
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
      {slide && <Slide {...slide} stage={stage} host={setSlideHost} />}
      {target && createPortal(controls, target)}
    </div>
  )
}

export default HeroSlides
