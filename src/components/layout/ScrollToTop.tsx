import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Springt nach einem Pfadwechsel an den Seitenanfang.
 *
 * Ausnahme: Ziel-URLs mit Hash (z. B. "/#roi-rechner"). Der Effect lief
 * frueher bedingungslos - auch beim ersten Mount nach einer harten
 * Navigation - und hat damit den Ankersprung wieder auf scrollY 0 gezogen.
 * Ist ein Hash gesetzt, gehoert das Scrollen <ScrollToHash> in App.tsx: das
 * sucht das lazy gerenderte Ziel ueber mehrere Frames per
 * requestAnimationFrame und rechnet die Hoehe des fixierten Headers heraus.
 *
 * SSR-sicher: window wird nur im Effect angefasst.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop
