/**
 * GtmPageview — meldet bei jedem clientseitigen Routenwechsel einen Seitenaufruf.
 *
 * Warum: polarisdx.net ist eine React-SPA. Ein Provider zaehlt einen page_view
 * nur beim initialen Dokumenten-Load. Clientseitige Navigationen (z. B.
 * /de/ → /de/contact) aendern die URL ueber die History-API OHNE Reload,
 * deshalb sieht die Auswertung sie nie und zaehlt nur EINEN page_view pro
 * Sitzung. Diese Komponente schliesst genau diese Luecke.
 *
 * Sie laeuft site-weit (in App eingehaengt, ueber der B2B-Shell UND den
 * Consumer-Landingpages), damit Seitenaufrufe fuer ALLE Sprachen und Routen
 * erfasst werden.
 *
 * AP23 PT23.2 — diese Komponente kennt Google nicht mehr:
 *
 * - Sie meldet an die Fassade (`lib/tracking.ts`). Ob und wie daraus ein
 *   Providerereignis wird, entscheidet allein `lib/trackingProvider.ts`.
 *   Vorher standen hier `gtag(...)` und `dataLayer.push(...)` nebeneinander.
 * - **Die Doppelzaehlung ist damit weg.** Vorher ging bei JEDEM Wechsel ein
 *   `gtag('event','page_view')` UND ein `dataLayer.push({virtual_pageview})`
 *   raus. Solange kein Container-Trigger auf `virtual_pageview` stand, fiel
 *   das nicht auf — sobald einer eingerichtet wuerde, haette GA4 jeden
 *   Seitenwechsel doppelt gezaehlt, rueckwirkend unbemerkt.
 * - **Die URL geht ohne Query und Fragment raus.** Vorher wurde
 *   `window.location.href` samt `?panel=`, `?intent=`, `?source=` gemeldet.
 *   Aus demselben Grund entfaellt `page_referrer`: eine Referrer-URL bringt
 *   fremde Parameter mit, ueber die diese Seite nichts weiss.
 * - Es gibt hier keinen Consent-Check mehr. Ohne Einwilligung oder ohne
 *   Anbieter ist `track` eine leere Funktion — und puffert nichts.
 *
 * AP23 PT23.3 — genau EIN Seitenaufruf je Navigation:
 *
 * - **Der Pfad wird verglichen, nicht die Location.** Der Effekt haengt an
 *   `pathname` UND `search`; eine reine Parameteraenderung
 *   (`/de/contact?intent=quote` → `/de/contact?panel=x`) loeste ihn deshalb
 *   erneut aus. Da die Fassade die Query ohnehin verwirft, waeren das ZWEI
 *   identische Seitenaufrufe fuer denselben Pfad gewesen. Der zuletzt
 *   gemeldete Pfad wird jetzt festgehalten und ein unveraenderter Pfad
 *   uebersprungen.
 * - Ein spaeter erteiltes Einverstaendnis loest hier NICHTS aus: die
 *   Komponente bleibt montiert, der Effekt laeuft nicht erneut. Den aktuellen
 *   Seitenaufruf zaehlt der Container beim Laden.
 *
 * Details:
 * - Der allererste Mount (Initial-Load) wird UEBERSPRUNGEN, weil der Provider
 *   diese Seite beim Laden bereits zaehlt. **Das ist eine Annahme ueber die
 *   Container-Konfiguration** (GA4-Konfigurationstag sendet `page_view` beim
 *   Laden) und in diesem Repository nicht pruefbar — Owner der externen
 *   Verifikation ist PT23.4, gefuehrt als `CTC-10`.
 * - Wir lesen bewusst `window.location` (nicht die Router-Location): der
 *   BrowserRouter hat basename=`/${lang}`, der das Sprachpraefix aus
 *   `location.pathname` entfernt. `window.location` behaelt /de bzw. /en,
 *   damit die Auswertung nach Sprache segmentieren kann.
 * - Der Versand wird einen Animation-Frame verzoegert, damit
 *   react-helmet-async den neuen <title> committet hat.
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { track } from '../../lib/tracking'

function GtmPageview() {
  const location = useLocation()
  const isFirst = useRef(true)
  /** Zuletzt gemeldeter Pfad — die Schranke gegen Doppelzaehlung. */
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial-Load überspringen — der Provider zählt ihn bereits.
    if (isFirst.current) {
      isFirst.current = false
      lastPath.current = window.location.pathname
      return
    }

    const fire = () => {
      const pfad = window.location.pathname
      // Gleicher Pfad, nur andere Parameter: kein zweiter Seitenaufruf.
      if (pfad === lastPath.current) return
      lastPath.current = pfad
      track({
        name: 'page_view',
        pfad,
        sprache: document.documentElement.lang || undefined,
        titel: document.title,
      })
    }

    if (typeof window.requestAnimationFrame === 'function') {
      const id = window.requestAnimationFrame(fire)
      return () => window.cancelAnimationFrame(id)
    }
    fire()
  }, [location.pathname, location.search])

  return null
}

export default GtmPageview
