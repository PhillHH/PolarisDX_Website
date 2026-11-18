import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent, RefObject } from 'react'
import { ArrowRight, Maximize, Minimize } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PolarisOneBridge from './PolarisOneBridge'
import PolarisOneRegie from './PolarisOneRegie'
import { CHAPTER_STARTS, preorderHref } from './polarisOneOrder'
import type { PolarisOneMode } from './PolarisOneStage'

type Chapter = { label: string; title: string; text: string }
type Note = { title: string; text: string }
type Props = {
  videoRef: RefObject<HTMLVideoElement | null>
  frameRef: RefObject<HTMLDivElement | null>
  mode: PolarisOneMode
  onMode: (mode: PolarisOneMode) => void
}

const END = 35.7
const LOG_STARTS = [0.6, 7, 11.6, 15, 20, 21.6, 26.2]
/** Lage der drei Punkte im Standbild, als Anteil des Filmbilds (1920 × 1080). */
const HOTSPOTS: Array<[number, number]> = [
  [0.55, 0.31],
  [0.56, 0.47],
  [0.42, 0.78],
]

const clock = (seconds: number) => `0:${String(Math.floor(seconds)).padStart(2, '0')}`
const lastStarted = (starts: number[], time: number) => {
  let index = -1
  starts.forEach((start, position) => {
    if (time >= start) index = position
  })
  return index
}

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

/**
 * SC-030: Steuerung des Polaris-One-Films – Kopfzeile mit Preis, der Schritt mit einem Satz über
 * seinem Abschnitt der Zeitleiste (wandert mit, Owner 2026-11-18: möglichst viel vom Film frei),
 * das Messprotokoll als eine Zeile mit dem aktuellen Schritt, Vollbild,
 * Zeitleiste mit Kapiteln, Ton, und am Ende das Standbild mit Vorbestell-Karte und drei Punkten.
 * Wird von `PolarisOneStage` nachgeladen, sobald der Besucher den Film startet.
 */
const PolarisOnePlayer = ({ videoRef, frameRef, mode, onMode }: Props) => {
  const { t } = useTranslation('home')
  const list = <T,>(key: string): T[] => {
    const value = t(key, { returnObjects: true }) as T[] | string
    return Array.isArray(value) ? value : []
  }
  const chapters = list<Chapter>('polaris_one.chapters')
  const log = list<Note>('polaris_one.log')
  const hotspots = list<Note>('polaris_one.hotspots')
  const orderHref = preorderHref(t('polaris_one.mail.subject'), t('polaris_one.mail.body'))

  const fillRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRefs = useRef<Array<HTMLDivElement | null>>([])
  const modeRef = useRef(mode)
  const dragging = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [sound, setSound] = useState(true)
  const [chapter, setChapter] = useState(0)
  const [step, setStep] = useState(-1)
  const [full, setFull] = useState(false)
  const [canFull, setCanFull] = useState(false)
  const [blackout, setBlackout] = useState(true)
  const [openSpot, setOpenSpot] = useState(-1)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const play = () => {
    videoRef.current?.play()?.catch(() => undefined)
  }
  const seek = (time: number) => {
    const video = videoRef.current
    if (!video) return
    if (modeRef.current === 'done') {
      modeRef.current = 'play'
      onMode('play')
      setOpenSpot(-1)
    }
    video.currentTime = Math.max(0, Math.min(END - 0.15, time))
  }
  const again = () => {
    seek(0)
    setStep(-1)
    play()
  }
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (modeRef.current === 'done') again()
    else if (video.paused) play()
    else video.pause()
  }
  const toggleFull = () => {
    const video = videoRef.current as WebkitVideo | null
    const stage = video?.closest('section')
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
    else if (stage?.requestFullscreen) void stage.requestFullscreen().catch(() => undefined)
    else video?.webkitEnterFullscreen?.()
  }
  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    if (!video.muted && video.paused && modeRef.current !== 'done') play()
  }

  const timeAt = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * END
  }
  const onSliderDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    videoRef.current?.pause()
    seek(timeAt(event))
  }
  const onSliderMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) seek(timeAt(event))
  }
  const onSliderUp = () => {
    if (!dragging.current) return
    dragging.current = false
    play()
  }
  const onSliderKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    if (event.key === 'ArrowRight') seek(video.currentTime + 2)
    else if (event.key === 'ArrowLeft') seek(video.currentTime - 2)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    let frame = 0
    let lastChapter = -1
    let lastStep = -1
    let clearTimer = 0

    const sync = () => {
      setPlaying(!video.paused)
      setSound(!video.muted)
      setCanFull(
        document.fullscreenEnabled || Boolean((video as WebkitVideo).webkitEnterFullscreen),
      )
    }
    const onFull = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFull)
    // Die Schwarzblende deckt den Wechsel vom Trailer zum Film, bis das erste Bild läuft.
    const clear = () => {
      clearTimer = window.setTimeout(() => setBlackout(false), 250)
    }
    const fallback = window.setTimeout(() => setBlackout(false), 6000)
    if (!video.paused && video.readyState > 2) clear()
    else video.addEventListener('playing', clear, { once: true })
    const onClick = () => {
      if (modeRef.current !== 'play') return
      if (video.paused) video.play()?.catch(() => undefined)
      else video.pause()
    }
    video.addEventListener('play', sync)
    video.addEventListener('pause', sync)
    video.addEventListener('volumechange', sync)
    video.addEventListener('click', onClick)
    sync()

    const tick = () => {
      frame = window.requestAnimationFrame(tick)
      const time = video.currentTime
      if (modeRef.current === 'play' && time >= END) {
        modeRef.current = 'done'
        video.pause()
        onMode('done')
      }
      video.volume = time > END - 0.8 ? Math.max(0, Math.min(1, (END - time) / 0.8)) : 1
      const progress = Math.min(1, time / END)
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`
      if (headRef.current) headRef.current.style.left = `${progress * 100}%`
      if (timeRef.current) {
        timeRef.current.textContent = `${clock(Math.min(time, END))} / ${clock(END)}`
      }
      sliderRef.current?.setAttribute('aria-valuenow', String(Math.round(time)))
      const nextChapter = Math.max(0, lastStarted(CHAPTER_STARTS, time))
      if (nextChapter !== lastChapter) {
        lastChapter = nextChapter
        setChapter(nextChapter)
      }
      const nextStep = lastStarted(LOG_STARTS, time)
      if (nextStep !== lastStep) {
        lastStep = nextStep
        setStep(nextStep)
      }
    }
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('fullscreenchange', onFull)
      window.clearTimeout(clearTimer)
      window.clearTimeout(fallback)
      video.removeEventListener('playing', clear)
      video.removeEventListener('play', sync)
      video.removeEventListener('pause', sync)
      video.removeEventListener('volumechange', sync)
      video.removeEventListener('click', onClick)
    }
  }, [videoRef, frameRef, onMode])

  // Der Text zum Schritt steht über dem Anfang seines Abschnitts der Zeitleiste und wandert mit.
  useEffect(() => {
    const slider = sliderRef.current
    const line = lineRef.current
    if (!slider || !line) return
    line.style.marginLeft = `${slider.offsetLeft + (slider.offsetWidth * CHAPTER_STARTS[chapter]) / END}px`
    line.animate?.({ opacity: [0, 1], transform: ['translateY(8px)', 'none'] }, 500)
  }, [chapter, mode, full])

  // Standbild: die drei Punkte sitzen auf dem beschnittenen Filmbild.
  useEffect(() => {
    if (mode !== 'done') return undefined
    const place = () => {
      const frameBox = frameRef.current
      const card = cardRef.current
      if (!frameBox || !card) return
      const frameBounds = frameBox.getBoundingClientRect()
      const cardBounds = card.getBoundingClientRect()
      // Die Punkte hängen an der Abschlussfläche; am Handy liegt sie unter dem Film.
      const endBounds = (card.parentElement ?? frameBox).getBoundingClientRect()
      const { width, height } = frameBounds
      const scale = Math.max(width / 1920, height / 1080)
      const left = (width - 1920 * scale) / 2
      const top = (height - 1080 * scale) / 2
      HOTSPOTS.forEach(([fx, fy], index) => {
        const spot = spotRefs.current[index]
        if (!spot) return
        const x = left + fx * 1920 * scale
        const y = top + fy * 1080 * scale
        const pageX = x + frameBounds.left
        const pageY = y + frameBounds.top
        const covered =
          pageX > cardBounds.left - 24 &&
          pageX < cardBounds.right + 24 &&
          pageY > cardBounds.top - 24 &&
          pageY < cardBounds.bottom + 24
        const outside = x < 16 || x > width - 16 || y < 16 || y > height - 16
        spot.style.left = `${x + frameBounds.left - endBounds.left}px`
        spot.style.top = `${y + frameBounds.top - endBounds.top}px`
        spot.hidden = covered || outside
        spot.dataset.side = x > width * 0.6 ? 'left' : 'right'
      })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [mode, frameRef])

  const activeChapter = chapters[chapter]

  return (
    <>
      {blackout && <i className="p1s-blackout" aria-hidden="true" />}
      <PolarisOneBridge />
      <div className="p1s-top">
        <strong>{t('polaris_one.name')}</strong>
        <span className="p1s-top-price">{t('polaris_one.price.short')}</span>
        <a href={orderHref} className="p1s-btn p1s-btn-order p1s-btn-sm">
          {t('polaris_one.preorder')}
          <ArrowRight aria-hidden="true" />
        </a>
        <span className="p1s-dev">{t('polaris_one.dev_note')}</span>
      </div>

      {mode === 'play' && (
        <p className="p1s-log" aria-hidden="true" title={t('polaris_one.log_note')}>
          <small>{t('polaris_one.log_title')}</small>
          {log[step] && (
            <span key={step}>
              {log[step].title}
              <small>{log[step].text}</small>
            </span>
          )}
        </p>
      )}

      {mode === 'play' && (
        <div
          className="p1s-dock"
          data-playing={playing ? 'true' : 'false'}
          data-sound={sound ? 'on' : 'off'}
        >
          <p className="p1s-line" ref={lineRef}>
            <b>{activeChapter?.title}</b>
            <span>{activeChapter?.text}</span>
          </p>
          <div className="p1s-controls">
            <button
              type="button"
              className="p1s-icon"
              onClick={togglePlay}
              aria-label={
                playing ? t('polaris_one.controls.pause') : t('polaris_one.controls.play')
              }
            >
              <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
            </button>
            <div
              ref={sliderRef}
              className="p1s-timeline"
              role="slider"
              tabIndex={0}
              aria-label={t('polaris_one.controls.timeline')}
              aria-valuemin={0}
              aria-valuemax={36}
              aria-valuenow={0}
              onPointerDown={onSliderDown}
              onPointerMove={onSliderMove}
              onPointerUp={onSliderUp}
              onPointerCancel={onSliderUp}
              onKeyDown={onSliderKey}
            >
              <i className="p1s-fill" ref={fillRef} />
              <i className="p1s-head" ref={headRef} />
              {chapters.map((item, index) => (
                <i
                  key={item.label}
                  className={index === chapter ? 'p1s-mark is-on' : 'p1s-mark'}
                  style={{ left: `${(CHAPTER_STARTS[index] / END) * 100}%` }}
                >
                  <span>{item.label}</span>
                </i>
              ))}
            </div>
            <span className="p1s-time" ref={timeRef} aria-hidden="true" />
            <button type="button" className="p1s-icon p1s-sound" onClick={toggleSound}>
              <span className="p1s-eq" aria-hidden="true"></span>
              <span>
                {sound ? t('polaris_one.controls.sound_off') : t('polaris_one.controls.sound_on')}
              </span>
            </button>
            {canFull && (
              <button
                type="button"
                className="p1s-icon"
                onClick={toggleFull}
                aria-label={
                  full
                    ? t('polaris_one.controls.fullscreen_exit')
                    : t('polaris_one.controls.fullscreen')
                }
              >
                {full ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      )}

      {mode === 'done' && (
        <div className="p1s-end">
          <div className="p1s-card" ref={cardRef}>
            <span className="p1s-eye">{t('polaris_one.end.eyebrow')}</span>
            <p className="p1s-card-title">{t('polaris_one.end.title')}</p>
            <p className="p1s-deposit">
              {t('polaris_one.price.vat')} · <b>{t('polaris_one.price.deposit')}</b>{' '}
              {t('polaris_one.end.deposit_note')}
            </p>
            <div className="p1s-actions">
              <a href={orderHref} className="p1s-btn p1s-btn-order">
                {t('polaris_one.preorder')}
                <ArrowRight aria-hidden="true" />
              </a>
              <button type="button" className="p1s-btn p1s-btn-line" onClick={again}>
                <span aria-hidden="true">↺</span>
                {t('polaris_one.end.again')}
              </button>
            </div>
          </div>
          {hotspots.slice(0, HOTSPOTS.length).map((spot, index) => (
            <div
              key={spot.title}
              className="p1s-spot"
              ref={(element) => {
                spotRefs.current[index] = element
              }}
            >
              <button
                type="button"
                aria-expanded={openSpot === index}
                aria-label={spot.title}
                onClick={() => setOpenSpot(openSpot === index ? -1 : index)}
              />
              {openSpot === index && (
                <p>
                  <b>{spot.title}</b>
                  {spot.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

type OverlayProps = Props & {
  cut: number
  slot: HTMLElement | null
  onStart: (from: number) => void
  onOrder: (href: string) => void
}

/** Vor dem Start die Regie-Einblendungen, danach Steuerung und Standbild. */
const PolarisOneOverlay = ({ cut, slot, onStart, onOrder, ...player }: OverlayProps) =>
  player.mode === 'gate' ? (
    <PolarisOneRegie cut={cut} slot={slot} onStart={onStart} onOrder={onOrder} />
  ) : (
    <PolarisOnePlayer {...player} />
  )

export default PolarisOneOverlay
