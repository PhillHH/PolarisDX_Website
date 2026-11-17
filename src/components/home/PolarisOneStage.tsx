import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { HOME_TARGETS } from './homeTargets'
import { prefersReducedMotion } from './motion'

export type PolarisOneMode = 'gate' | 'play' | 'done'

const loadPlayer = () => import('./PolarisOnePlayer')
const PolarisOnePlayer = lazy(loadPlayer)

const MEDIA = '/media/polaris-one'
/** Der Trailer ist ein eigener stummer Zusammenschnitt: fünf Szenen zu je 1,9 Sekunden. */
const CUT_COUNT = 5
const CUT_SECONDS = 1.9
const wide = () => window.innerWidth > 900

/**
 * SC-030 (Owner 2026-11-16, Entwurf „Trailer"): Die Startseiten-Bühne zeigt den Polaris One.
 * Hinter Überschrift und Preis läuft stumm ein Zusammenschnitt aus fünf Szenen, zu jeder steht
 * ein großes Wort im Bild. „Film mit Ton starten" holt den ganzen Film; Steuerung, Einblendungen
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

  const changeMode = (next: PolarisOneMode) => {
    modeRef.current = next
    setMode(next)
  }

  const startFilm = () => {
    const video = videoRef.current
    if (!video) return
    // Erst jetzt wird der ganze Film geholt. Abspielen muss in diesem Klick beginnen, sonst
    // verweigert der Browser den Ton.
    video.loop = false
    video.src = `${MEDIA}/polaris-one-${wide() ? '1080' : '720'}.mp4`
    video.muted = false
    video.load()
    video.play()?.catch(() => {
      video.muted = true
      video.play()?.catch(() => undefined)
    })
    changeMode('play')
  }

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const autoplay = !prefersReducedMotion() && !connection?.saveData
    const readyFrame = window.requestAnimationFrame(() => setReady(true))
    let seen = true
    let resume = false
    let timer = 0

    let shown = -1
    const onTime = () => {
      if (modeRef.current !== 'gate') return
      const next = Math.min(CUT_COUNT - 1, Math.floor(video.currentTime / CUT_SECONDS))
      if (next === shown) return
      shown = next
      setCut(next)
      cutRef.current?.animate?.(
        [
          { opacity: 0, transform: 'scale(1.28)', filter: 'blur(16px)' },
          { opacity: 1, transform: 'scale(1.23)', filter: 'blur(0)', offset: 0.16 },
          { opacity: 1, transform: 'scale(1.04)', filter: 'blur(0)', offset: 0.84 },
          { opacity: 0, transform: 'scale(1)', filter: 'blur(0)' },
        ],
        { duration: 1850, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
      )
    }
    video.addEventListener('timeupdate', onTime)

    // Außerhalb des Bildschirms ruht der Film und läuft beim Zurückkommen weiter.
    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          seen = entries[0]?.isIntersecting ?? false
          if (!seen) {
            resume = !video.paused
            video.pause()
          } else if (resume) {
            video.play()?.catch(() => undefined)
          }
        },
        { threshold: 0.2 },
      )
      observer.observe(section)
    }

    // Erst nach dem Laden der Seite: der erste Seitenaufbau bleibt vom Film unberührt.
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!autoplay || modeRef.current !== 'gate') return
        void loadPlayer().catch(() => undefined)
        video.loop = true
        video.src = `${MEDIA}/polaris-one-trailer-${wide() ? '720' : '480'}.mp4`
        video.load()
        if (seen) video.play()?.catch(() => undefined)
        else resume = true
      }, 350)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.cancelAnimationFrame(readyFrame)
      window.clearTimeout(timer)
      window.removeEventListener('load', schedule)
      video.removeEventListener('timeupdate', onTime)
      observer?.disconnect()
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
            <div className="p1s-cut" aria-hidden="true">
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
                <button type="button" className="p1s-btn p1s-btn-light" onClick={startFilm}>
                  <span aria-hidden="true">▶</span>
                  {t('polaris_one.start')}
                </button>
                <Button
                  to={HOME_TARGETS.contact}
                  variant="secondary"
                  data-home-hero-cta
                  className="sc025-button"
                >
                  {t('polaris_one.preorder')}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="p1s-ticks" aria-hidden="true">
              {Array.from({ length: CUT_COUNT }, (_, index) => (
                <i key={index} className={index === cut ? 'is-on' : undefined} />
              ))}
            </div>
          </div>
        ) : (
          <Suspense fallback={null}>
            <PolarisOnePlayer
              videoRef={videoRef}
              frameRef={frameRef}
              mode={mode}
              onMode={changeMode}
            />
          </Suspense>
        )}
      </div>
    </section>
  )
}

export default PolarisOneStage
