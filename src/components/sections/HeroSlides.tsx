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
import { HERO_CARD, HERO_EVENT, HERO_SHOW } from '../../assets/home/homeImages'
import { getEventStatus, getNextHomeEvent, toEventDay } from '../../data/events'
import { daysUntil, formatEventRange } from '../../lib/eventDates'
import { isPanelsPromoActive, panelsUrl } from '../../lib/shop'
import { Button } from '../ui/Button'
import type { Stage } from './heroStage'
import { heroSteps } from './heroSteps'

const INTERVAL_MS = 8000
/** Diashow der Folie 1: drei Motive, je 4 s; nach dem letzten geht es zu Folie 2. */
const PHOTO_MS = 4000
const PHOTOS = 3
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
  /** Aktives Motiv der Diashow auf Folie 1 (0..2). */
  photo: number
  onPhoto: (index: number) => void
  stage: Stage
  /** Platzhalter unter den Buttons von Folie 1 (HeroSection). */
  host: HTMLDivElement | null
  /** Fotorahmen der Folie 1 — hier landen Bild 2/3, Bildzeile und Restzeit-Balken. */
  frameHost: HTMLDivElement | null
  /** Platz unter dem Fotorahmen fuer die Zeitleiste der drei Schritte. */
  stepsHost: HTMLDivElement | null
}

const HeroSlides = ({
  active,
  onChange,
  photo,
  onPhoto,
  stage,
  host,
  frameHost,
  stepsHost,
}: HeroSlidesProps) => {
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

  // Folie 1: alle PHOTO_MS das naechste Motiv, nach dem dritten die naechste Folie (sofern es
  // eine gibt); Themenfolien wechseln nach INTERVAL_MS. Beim Rueckkehr auf Folie 1 beginnt die
  // Diashow wieder beim ersten Motiv.
  useEffect(() => {
    if (!playing || held) return
    const onMain = active === 0
    const last = photo >= PHOTOS - 1
    const id = window.setTimeout(
      () => {
        if (onMain && !last) onPhoto(photo + 1)
        else if (onMain && total === 1) onPhoto(0)
        else {
          onPhoto(0)
          onChange((active + 1) % total)
        }
      },
      onMain ? PHOTO_MS : INTERVAL_MS,
    )
    return () => window.clearTimeout(id)
  }, [active, photo, playing, held, total, onChange, onPhoto])

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
      // SC-021 Nachtrag 3 (Owner 2026-11-03): Messehalle mit PolarisDX-Stand als Folienbild; Datum,
      // Halle/Stand, Countdown und Standtermin liegen auf einem Navy-Verlauf am unteren Rand.
      aside: (
        <div className="relative flex aspect-[16/10] w-full flex-col justify-end overflow-hidden rounded-card bg-brand-deep p-6 text-white shadow-card">
          <picture>
            <source type="image/avif" srcSet={HERO_EVENT.avif} sizes={HERO_CARD.sizes} />
            <img
              src={HERO_EVENT.src}
              srcSet={HERO_EVENT.webp}
              sizes={HERO_CARD.sizes}
              alt=""
              width={HERO_EVENT.width}
              height={HERO_EVENT.height}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/70 to-transparent"
          />
          <p className="t-eyebrow-dark relative">
            {t(`events:items.${event.id}.title`)} · {event.location}
          </p>
          <p className="relative mt-2 text-3xl font-semibold tracking-tight xl:text-4xl">
            <time dateTime={event.date}>
              {formatEventRange(i18n.language, event.date, event.endDate)}
            </time>
            {short && <span className="block text-base font-medium text-white/85">{short}</span>}
          </p>
          <div className="relative mt-4 flex items-end justify-between gap-4">
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

  const steps = heroSteps(t)
  const timeline = (
    <ol
      data-home-hero-steps
      aria-label={t('hero.steps_aria')}
      className="mt-5 flex items-center gap-2 sm:gap-3"
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={`flex min-w-0 items-center gap-2 sm:gap-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}
        >
          <button
            type="button"
            data-k={`s${index}`}
            aria-current={photo === index ? 'step' : undefined}
            onClick={() => onPhoto(index)}
            className="group flex min-h-[44px] min-w-0 items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <span
              className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] text-sm font-bold transition-colors motion-reduce:transition-none ${
                photo === index
                  ? 'border-accent-line bg-brand-deep text-white'
                  : photo > index
                    ? 'border-accent-line bg-white text-heading'
                    : 'border-paper-line bg-white text-heading'
              }`}
            >
              0{index + 1}
              {photo === index && (
                <span
                  aria-hidden="true"
                  className="hero-pulse-ring absolute -inset-[3px] rounded-full border-[3px] border-accent-line"
                />
              )}
            </span>
            <span
              className={`hidden whitespace-nowrap text-sm sm:inline ${
                photo === index ? 'font-semibold text-heading' : 'font-medium text-gray-700'
              }`}
            >
              {step.title}
            </span>
          </button>
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="relative h-[3px] min-w-4 flex-1 overflow-hidden rounded-full bg-paper-line"
            >
              <span
                className={`absolute inset-y-0 left-0 rounded-full bg-accent-line transition-[width] duration-700 motion-reduce:transition-none ${
                  photo > index ? 'w-full' : 'w-0'
                }`}
              />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
  // Diashow in Folie 1: Bild 2/3 ueber Bild 1 (das bleibt im SSR), Bildzeile und Restzeit-Balken.
  const show = (
    <>
      {HERO_SHOW.map((img, k) => {
        const index = k + 1
        return (
          <picture key={index}>
            <source type="image/avif" srcSet={img.avif} sizes={HERO_CARD.sizes} />
            <img
              src={img.src}
              srcSet={img.webp}
              sizes={HERO_CARD.sizes}
              alt=""
              width={HERO_CARD.width}
              height={HERO_CARD.height}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover ${stage.fade} ${photo === index ? '' : 'opacity-0'}`}
            />
          </picture>
        )
      })}
      <p
        key={photo}
        className="hero-caption absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-semibold text-heading shadow-card"
      >
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-line" />
        <span className="truncate">
          {steps[photo]?.title} · {steps[photo]?.text}
        </span>
        <span className="sr-only">{t('hero_slides.photo', { n: photo + 1, total: PHOTOS })}</span>
      </p>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
        <span
          key={`${active}-${photo}-${playing && !held}`}
          className={`block h-full bg-accent-line ${active === 0 && playing && !held ? 'hero-progress' : 'w-0'}`}
          style={{ animationDuration: `${PHOTO_MS}ms` }}
        />
      </span>
    </>
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
      {frameHost && createPortal(show, frameHost)}
      {stepsHost && createPortal(timeline, stepsHost)}
    </div>
  )
}

export default HeroSlides
