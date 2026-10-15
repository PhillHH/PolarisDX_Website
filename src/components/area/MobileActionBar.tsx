import { useEffect, useState, type ReactNode } from 'react'

/**
 * AP34 PT34.2a (SC-003) — schwebende Aktionsleiste unter lg.
 *
 * - Erscheint erst nach der Buehne (ab 480 px Scrolltiefe) und verschwindet,
 *   sobald der Footer sichtbar ist — seine Links bleiben frei.
 * - Bleibt weg, solange der Cookie-Banner offen ist (er setzt
 *   `--cookie-banner-height`); die Einwilligung hat Vorrang.
 * - Wird erst im Browser gerendert: kein SSR-Markup, kein Layout-Shift (fixed).
 * - Bewusst NICHT per React.lazy: ein nachgeladener Chunk zieht das Haupt-
 *   Stylesheet als <link> nach (stylesheetLinks-Budget 0, §29).
 * - Hebt den MobileCallButton ueber sich (`--action-bar-height`).
 */
interface MobileActionBarProps {
  label: ReactNode
  action: ReactNode
}

const HEIGHT = 72

const MobileActionBar = ({ label, action }: MobileActionBarProps) => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let footerVisible = false
    const footer = document.querySelector('footer')
    const io = footer
      ? new IntersectionObserver(([entry]) => {
          footerVisible = entry.isIntersecting
          pruefen()
        })
      : null
    if (footer && io) io.observe(footer)
    let frame = 0
    function pruefen() {
      const banner = getComputedStyle(document.documentElement)
        .getPropertyValue('--cookie-banner-height')
        .trim()
      const bannerOffen = banner !== '' && banner !== '0px'
      const next = window.scrollY > 480 && !footerVisible && !bannerOffen
      setShown(next)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        pruefen()
      })
    }
    pruefen()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (shown) root.style.setProperty('--action-bar-height', `${HEIGHT}px`)
    else root.style.removeProperty('--action-bar-height')
    return () => {
      root.style.removeProperty('--action-bar-height')
    }
  }, [shown])

  if (!shown) return null
  return (
    <div
      data-mobile-action-bar
      className="fixed bottom-3 left-3 right-3 z-40 flex items-center justify-between gap-3 rounded-full bg-brand-deep py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-card lg:hidden"
    >
      <span className="min-w-0 truncate">{label}</span>
      {action}
    </div>
  )
}

export default MobileActionBar
