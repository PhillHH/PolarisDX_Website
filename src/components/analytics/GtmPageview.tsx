/**
 * GtmPageview — sendet bei jedem clientseitigen Routenwechsel einen GA4 page_view.
 *
 * Warum: polarisdx.net ist eine React-SPA. GTM (und das darin geladene GA4
 * Google-Tag) feuert einen page_view nur beim initialen Dokumenten-Load.
 * Clientseitige Navigationen (z. B. /de/ → /de/contact, /en/…) ändern die URL
 * über die History-API OHNE Reload, deshalb sieht GA4 sie nie und zählt nur
 * EINEN page_view pro Sitzung. Diese Komponente schließt genau diese Lücke.
 *
 * Sie läuft site-weit (in App eingehängt, über der B2B-Shell UND den
 * Consumer-Landingpages), damit page_views für ALLE Sprachen und alle Routen
 * erfasst werden.
 *
 * Details:
 * - Der allererste Mount (Initial-Load) wird ÜBERSPRUNGEN, weil das Google-Tag
 *   von GTM diese Seite beim Laden bereits zählt → vermeidet Doppelzählung der
 *   Landingpage.
 * - Wir lesen bewusst window.location (nicht die Router-Location): der
 *   BrowserRouter hat basename=`/${lang}`, der das Sprachpräfix aus
 *   location.pathname entfernt. window.location behält /de bzw. /en, damit GA4
 *   nach Sprache segmentieren kann.
 * - Der Versand wird einen Animation-Frame verzögert, damit react-helmet-async
 *   den neuen <title> committet hat, bevor wir document.title lesen.
 * - Zusätzlich wird ein sauberes dataLayer-Event 'virtual_pageview' gepusht
 *   (für GTM-verwaltete Tags / Meta / LinkedIn). Es ist derzeit inert, solange
 *   kein passender GTM-Trigger existiert. HINWEIS: Falls künftig ein
 *   GTM-Tag auf 'virtual_pageview' einen GA4 page_view sendet, muss der direkte
 *   gtag('event','page_view')-Aufruf unten entfernt werden, sonst Doppelzählung.
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function GtmPageview() {
  const location = useLocation()
  const isFirst = useRef(true)
  const prevHref = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void
      dataLayer?: Array<Record<string, unknown>>
      requestAnimationFrame?: (cb: () => void) => number
      cancelAnimationFrame?: (id: number) => void
    }

    // Initial-Load überspringen — das Google-Tag von GTM zählt ihn bereits.
    if (isFirst.current) {
      isFirst.current = false
      prevHref.current = window.location.href
      return
    }

    // Referrer SYNCHRON beim Erkennen der Navigation festhalten, bevor die
    // (verzögerte) rAF-Callback läuft. So kann eine abgebrochene rAF bei
    // zwei schnellen Navigationen die Referrer-Kette nicht mehr desynchronisieren.
    const referrerForThisNav = prevHref.current || document.referrer || undefined
    prevHref.current = window.location.href

    const fire = () => {
      const page_location = window.location.href
      const page_path = window.location.pathname + window.location.search
      const page_title = document.title
      const page_referrer = referrerForThisNav
      const page_language = document.documentElement.lang || undefined

      const params: Record<string, unknown> = {
        page_location,
        page_path,
        page_title,
        page_language,
        // Deterministisches Routing auf das einzige GA4-Ziel im Container.
        // Heute funktioniert das Broadcast-Routing implizit (nur ein Ziel);
        // send_to macht es robust, falls je ein zweites GA4/Ads-Ziel ins
        // GTM-Container kommt. Keine Doppelzählung (weiterhin 1 Event/Navi).
        send_to: 'G-PLZNWGKW0P',
      }
      if (page_referrer) params.page_referrer = page_referrer

      // Primär: echter GA4 page_view über das von GTM geladene Google-Tag.
      // Funktioniert ohne GTM-Container-Änderung (gtag ist global definiert).
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'page_view', params)
      }

      // Sekundär: sauberes dataLayer-Event für GTM-verwaltete Tags.
      w.dataLayer = w.dataLayer || []
      w.dataLayer.push({ event: 'virtual_pageview', ...params })
    }

    if (typeof w.requestAnimationFrame === 'function') {
      const id = w.requestAnimationFrame(fire)
      return () => {
        if (typeof w.cancelAnimationFrame === 'function') w.cancelAnimationFrame(id)
      }
    }
    fire()
  }, [location.pathname, location.search])

  return null
}

export default GtmPageview
