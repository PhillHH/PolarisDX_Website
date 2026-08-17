/**
 * Meldet die Lesetiefe einer langen Seite.
 *
 * WARUM: Aus den Serverlogs laesst sich ablesen, dass jemand eine Seite
 * geoeffnet hat — nicht, ob er sie gelesen hat. Bei einer Seite von mehreren
 * tausend Pixeln ist das der Unterschied zwischen "abgesprungen" und
 * "durchgelesen und trotzdem nicht angefragt". Das sind zwei verschiedene
 * Probleme mit zwei verschiedenen Loesungen.
 *
 * Je Seitenaufruf feuert jede Stufe hoechstens einmal. Wer zurueckscrollt und
 * wieder nach unten geht, erzeugt keine zweite Meldung.
 *
 * Das Ereignis geht an die providerneutrale Schnittstelle in tracking.ts. Ohne
 * gesetzten Anbieter und ohne Einwilligung passiert dort nichts — der Hook
 * darf deshalb bedenkenlos auf jeder Seite laufen.
 */

import { useEffect } from 'react'
import { track, type Scrollstufe } from './tracking'
import { MERK_SLUGS, type MerkSlug } from './merkliste'

const SCHWELLEN: Scrollstufe[] = [25, 50, 75, 100]

const alsPanel = (v?: string): MerkSlug | null =>
  typeof v === 'string' && (MERK_SLUGS as readonly string[]).includes(v) ? (v as MerkSlug) : null

/**
 * @param seitentyp 'epigenetics' fuer die Uebersicht, sonst der Musterbefund.
 * @param kennung   Bei Musterbefunden der Panel-Slug.
 */
export function useScrollDepth(seitentyp: string, kennung?: string): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Das Ereignis kennt genau zwei Seitenarten. Ein Musterbefund ohne
    // bekannten Slug wird nicht gemeldet — lieber eine Luecke in der Messung
    // als ein Wert, der sich keiner Seite zuordnen laesst.
    const panel = alsPanel(kennung)
    const seite: 'landing' | MerkSlug | null = seitentyp === 'epigenetics' ? 'landing' : panel
    if (!seite) return

    // Pro Seitenaufruf ein frischer Satz: der Hook laeuft bei jedem
    // Panelwechsel neu, und die Tiefe der vorigen Seite zaehlt dort nicht.
    const gemeldet = new Set<Scrollstufe>()
    let frame = 0

    const messen = () => {
      frame = 0
      const doc = document.documentElement
      // Kuerzer als der Viewport: es gibt nichts zu scrollen, also auch keine
      // Lesetiefe. Ohne diese Pruefung waere jede kurze Seite sofort 100 %.
      const strecke = doc.scrollHeight - window.innerHeight
      if (strecke <= 0) return
      const anteil = ((window.scrollY || doc.scrollTop) / strecke) * 100
      for (const stufe of SCHWELLEN) {
        if (anteil >= stufe && !gemeldet.has(stufe)) {
          gemeldet.add(stufe)
          track({ name: 'scroll_depth', seite, stufe })
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
