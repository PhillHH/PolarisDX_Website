/**
 * Meldet die Lesetiefe einer langen Seite als dataLayer-Ereignis.
 *
 * WARUM: Aus den Serverlogs laesst sich ablesen, dass jemand eine Seite
 * geoeffnet hat — nicht, ob er sie gelesen hat. Bei einer Seite von mehreren
 * tausend Pixeln ist das der Unterschied zwischen "abgesprungen" und
 * "durchgelesen und trotzdem nicht angefragt". Das sind zwei verschiedene
 * Probleme mit zwei verschiedenen Loesungen.
 *
 * Je Seitenaufruf feuert jede Schwelle hoechstens einmal. Wer zurueckscrollt
 * und wieder nach unten geht, erzeugt keine zweite Meldung.
 *
 * Wie alles in tracking.ts ist das nur ein Push in den dataLayer. Ob daraus
 * ein GA4-Ereignis wird, entscheidet der GTM-Container; ohne Einwilligung
 * haelt der Consent Mode die Tags zurueck.
 */

import { useEffect } from 'react'
import { trackEvent } from './tracking'

const SCHWELLEN = [25, 50, 75, 100]

export function useScrollDepth(seitentyp: string, kennung?: string): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Pro Seitenaufruf ein frischer Satz: der Hook laeuft bei jedem
    // Panelwechsel neu, und die Tiefe der vorigen Seite zaehlt dort nicht.
    const gemeldet = new Set<number>()
    let frame = 0

    const messen = () => {
      frame = 0
      const doc = document.documentElement
      // Kuerzer als der Viewport: es gibt nichts zu scrollen, also auch keine
      // Lesetiefe. Ohne diese Pruefung waere jede kurze Seite sofort 100 %.
      const strecke = doc.scrollHeight - window.innerHeight
      if (strecke <= 0) return
      const anteil = ((window.scrollY || doc.scrollTop) / strecke) * 100
      for (const schwelle of SCHWELLEN) {
        if (anteil >= schwelle && !gemeldet.has(schwelle)) {
          gemeldet.add(schwelle)
          trackEvent('scroll_depth', {
            page_type: seitentyp,
            ...(kennung ? { panel: kennung } : {}),
            percent: schwelle,
          })
        }
      }
    }

    // Gebuendelt auf den naechsten Frame: scroll feuert sonst dutzendfach je
    // Radumdrehung, und jeder Durchlauf liest scrollHeight — das erzwingt ein
    // Layout.
    const beiScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(messen)
    }

    window.addEventListener('scroll', beiScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', beiScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [seitentyp, kennung])
}
