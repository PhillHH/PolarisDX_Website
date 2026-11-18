import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import PolarisOneBridge from './PolarisOneBridge'
import { CHAPTER_STARTS, preorderHref } from './polarisOneOrder'

type Chapter = { label: string; title: string; text: string }
type Props = {
  cut: number
  /** Block des Szenenworts über der Leiste; der Satz wird dort eingehängt. */
  slot: HTMLElement | null
  onStart: (from: number) => void
  onOrder: (href: string) => void
}

const CAPTION_FRAMES = [
  { opacity: 0, transform: 'translateY(8px)' },
  { opacity: 1, transform: 'none', offset: 0.16 },
  { opacity: 1, offset: 0.86 },
  { opacity: 0 },
]

/**
 * SC-030 „volle Regie" (Owner 2026-11-18): Einblendungen vor dem Filmstart – Hinweis mit Zähler,
 * der Satz zum Schritt (wandert mit dem Wort über der Leiste, Owner 2026-11-18) und die beschriftete
 * Leiste, die den Film am gewählten Schritt startet – und die E-Mail-Adresse der Vorbestellung. Wird nach dem Seitenaufbau nachgeladen und steht deshalb nicht im ersten HTML.
 */
const PolarisOneRegie = ({ cut, slot, onStart, onOrder }: Props) => {
  const { t } = useTranslation('home')
  const raw = t('polaris_one.chapters', { returnObjects: true }) as Chapter[] | string
  const chapters = Array.isArray(raw) ? raw : []
  const captionRef = useRef<HTMLSpanElement>(null)

  const orderHref = preorderHref(t('polaris_one.mail.subject'), t('polaris_one.mail.body'))
  useEffect(() => onOrder(orderHref), [onOrder, orderHref])

  useEffect(() => {
    captionRef.current?.animate?.(CAPTION_FRAMES, {
      duration: 1850,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      fill: 'forwards',
    })
  }, [cut, slot])

  return (
    <>
      <div className="p1s-hud" aria-hidden="true">
        <span className="p1s-dev">{t('polaris_one.dev_note')}</span>
        <b>
          0{cut + 1} / 0{chapters.length}
        </b>
      </div>
      {slot &&
        createPortal(
          <span ref={captionRef} className="p1s-cap">
            {chapters[cut]?.text}
          </span>,
          slot,
        )}
      <div className="p1s-ticks">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.label}
            type="button"
            className={index === cut ? 'is-on' : undefined}
            aria-label={`${t('polaris_one.start')}: ${chapter.label}`}
            onClick={() => onStart(CHAPTER_STARTS[index] + 0.05)}
          >
            <span>{chapter.label}</span>
          </button>
        ))}
      </div>
      <PolarisOneBridge />
    </>
  )
}

export default PolarisOneRegie
