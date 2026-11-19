import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { useHref } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HOME_TARGETS } from './homeTargets'
import { prefersReducedMotion } from './motion'

export type PolarisOneMode = 'gate' | 'play' | 'done'

const loadPlayer = () => import('./PolarisOnePlayer')
const PolarisOnePlayer = lazy(loadPlayer)

const MEDIA = '/media/polaris-one'
/** Der Trailer ist ein eigener stummer Zusammenschnitt: fünf Szenen zu je 1,9 Sekunden. */
const CUT_COUNT = 5
const CUT_SECONDS = 1.9
/**
 * Ab 1300 Gerätepixeln Breite (Laptop, Desktop, Tablet) kommt die 1080er-Fassung, am Telefon 720.
 * Owner 2026-11-19 („etwas unscharf"): vorher lief am Desktop der 720er-Zusammenschnitt
 * hochskaliert. Die Dateien `-v2-` sind neu aus dem Original gerechnet (SC-032).
 */
const sharp = () => innerWidth * devicePixelRatio > 1299
const run = (video: HTMLVideoElement) => video.play()?.catch(() => 0)
const CUT_FRAMES = [
  { opacity: 0, transform: 'translateY(8px)' },
  { opacity: 1, transform: 'none', offset: 0.16 },
  { opacity: 1, offset: 0.86 },
  { opacity: 0 },
]
const CUT_TIMING = {
  duration: 1850,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  fill: 'forwards' as const,
}

/**
 * SC-030 (Owner 2026-11-16, Entwurf „Trailer"): Die Startseiten-Bühne zeigt den Polaris One.
 * Hinter Überschrift und Preis läuft stumm ein Zusammenschnitt aus fünf Szenen, zu jeder steht
 * ein Wort im Bild. Owner 2026-11-18 („volle Regie"): dazu Sucherecken, Lichtlinie, Zähler,
 * der Schritt mit einem Satz und eine beschriftete Leiste, die den Film am gewählten Schritt
 * startet. Owner 2026-11-18 („wandernd"): Wort und Satz stehen klein über dem aktiven Schritt der
 * Leiste und wandern mit; die Bildmitte bleibt frei, damit möglichst viel vom Film zu sehen ist. Vorbestellt wird per E-Mail. „Film mit Ton starten" holt den ganzen Film; Steuerung, Einblendungen
 * und Standbild liegen in `PolarisOnePlayer` und werden erst nach dem Seitenaufbau geladen.
 *
 * Der Trailer wird erst nach dem Laden der Seite geholt, nie im Datensparmodus und nie bei
 * „Bewegung reduzieren" – dort bleibt das Standbild stehen, bis der Besucher den Film startet.
 */
const PolarisOneStage = () => {
  const { t } = useTranslation('home')
  const rawCuts = t('polaris_one.cuts', { returnObjects: true }) as string[] | string
  const cuts = Array.isArray(rawCuts) ? rawCuts : []
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modeRef = useRef<PolarisOneMode>('gate')
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<PolarisOneMode>('gate')
  // Das erste Wort steht schon im ausgelieferten HTML und passt zum Standbild. Das Element
  // bleibt dasselbe, nur sein Text wechselt – so zählt kein späteres Wort als neuer Hauptinhalt.
  const cutRef = useRef<HTMLElement>(null)
  const [cut, setCut] = useState(0)
  // Der Satz zum Wort wird nachgeladen und in denselben Block gesetzt.
  const [cutBox, setCutBox] = useState<HTMLDivElement | null>(null)

  // Vorbestellt wird per E-Mail. Adressen und Mailtext kommen mit den Regie-Einblendungen nach dem
  // Seitenaufbau; bis dahin – und ohne JavaScript – führt der Knopf zum Kontaktformular.
  const contactHref = useHref(HOME_TARGETS.contact)
  const [orderHref, setOrderHref] = useState('')

  const changeMode = (next: PolarisOneMode) => {
    modeRef.current = next
    setMode(next)
  }

  const startFilm = (from = 0) => {
    const video = videoRef.current
    if (!video) return
    // Erst jetzt wird der ganze Film geholt. Abspielen muss in diesem Klick beginnen, sonst
    // verweigert der Browser den Ton.
    video.loop = false
    video.src = `${MEDIA}/polaris-one-v2-${sharp() ? '1080' : '720'}.mp4${from ? `#t=${from}` : ''}`
    video.muted = false
    video.play()?.catch(() => {
      video.muted = true
      void run(video)
    })
    changeMode('play')
  }

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const autoplay = !prefersReducedMotion() && !connection?.saveData
    const readyFrame = requestAnimationFrame(() => setReady(true))
    let seen = true
    let resume = false
    let timer: ReturnType<typeof setTimeout> | undefined

    let shown = -1
    const onTime = () => {
      if (modeRef.current !== 'gate') return
      const next = Math.min(CUT_COUNT - 1, Math.floor(video.currentTime / CUT_SECONDS))
      if (next === shown) return
      shown = next
      setCut(next)
      cutRef.current?.animate?.(CUT_FRAMES, CUT_TIMING)
    }
    video.addEventListener('timeupdate', onTime)

    // Außerhalb des Bildschirms ruht der Film und läuft beim Zurückkommen weiter.
    const observer = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? false
        if (!seen) {
          resume = !video.paused
          video.pause()
        } else if (resume) {
          void run(video)
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(section)

    // Erst nach dem Laden der Seite: der erste Seitenaufbau bleibt vom Film unberührt.
    const schedule = () => {
      timer = setTimeout(() => {
        if (!autoplay || modeRef.current !== 'gate') return
        void loadPlayer().catch(() => undefined)
        video.loop = true
        video.src = `${MEDIA}/polaris-one-trailer-v2-${sharp() ? '1080' : '720'}.mp4`
        if (seen) void run(video)
        else resume = true
      }, 350)
    }
    if (document.readyState === 'complete') schedule()
    else addEventListener('load', schedule, { once: true })

    return () => {
      cancelAnimationFrame(readyFrame)
      clearTimeout(timer)
      removeEventListener('load', schedule)
      video.removeEventListener('timeupdate', onTime)
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      data-home-section
      data-mode={mode}
      data-animation-ready={ready ? 'true' : undefined}
      className="p1s sc025-dark"
    >
      <h1 id="home-hero-title" className="sr-only">
        {t('hero.title')}
      </h1>
      <div className="p1s-box">
        <div ref={frameRef} className="p1s-frame">
          <img
            src={`${MEDIA}/polaris-one-poster-960.webp`}
            srcSet={`${MEDIA}/polaris-one-poster-640.webp 640w, ${MEDIA}/polaris-one-poster-960.webp 960w, ${MEDIA}/polaris-one-poster-1280.webp 1280w`}
            sizes="100vw"
            width={1280}
            height={720}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
          <video
            ref={videoRef}
            playsInline
            muted
            preload="none"
            aria-label={t('polaris_one.film_label')}
          />
        </div>
        <div className="p1s-shade" aria-hidden="true" />
        {mode === 'gate' ? (
          <div className="p1s-gate" data-polaris-gate>
            <div className="p1s-gate-head">
              <span className="p1s-eye">{t('polaris_one.eyebrow')}</span>
              <p className="p1s-name">{t('polaris_one.name')}</p>
            </div>
            <div
              ref={setCutBox}
              className="p1s-cut"
              aria-hidden="true"
              style={{ '--n': cut } as CSSProperties}
            >
              <b ref={cutRef}>{cuts[cut]}</b>
            </div>
            <div className="p1s-gate-foot">
              <div>
                <div className="p1s-price">
                  {t('polaris_one.price.amount')}
                  <em>{t('polaris_one.price.label')}</em>
                  <small>{t('polaris_one.price.vat')}</small>
                </div>
                <p className="p1s-deposit">
                  <b>{t('polaris_one.price.deposit')}</b> {t('polaris_one.price.deposit_note')}
                </p>
              </div>
              <div className="p1s-actions">
                <button type="button" className="p1s-btn p1s-btn-light" onClick={() => startFilm()}>
                  <span aria-hidden="true">▶</span>
                  {t('polaris_one.start')}
                </button>
                <a
                  href={orderHref || contactHref}
                  data-home-hero-cta
                  className="p1s-btn p1s-btn-order"
                >
                  {t('polaris_one.preorder')}
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        ) : null}
        {/* Regie-Einblendungen vor dem Start, danach Steuerung und Standbild – ein Nachlade-Teil. */}
        {ready && (
          <Suspense fallback={null}>
            <PolarisOnePlayer
              videoRef={videoRef}
              frameRef={frameRef}
              mode={mode}
              onMode={changeMode}
              cut={cut}
              slot={cutBox}
              onStart={startFilm}
              onOrder={setOrderHref}
            />
          </Suspense>
        )}
      </div>
    </section>
  )
}

export default PolarisOneStage
