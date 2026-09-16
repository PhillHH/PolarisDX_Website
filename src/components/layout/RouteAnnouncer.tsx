import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * RouteAnnouncer — sagt an, dass eine neue Seite da ist.
 *
 * AP24 PT24.3. Gemessen war der Zustand davor so: ein Klick auf „Epigenetik"
 * in der Hauptnavigation tauscht den kompletten Inhalt aus, setzt die
 * Scrollposition auf 0 und wechselt die `h1` — und **nichts davon erreicht
 * eine Assistenztechnik**. Es gab keine Live-Region auf der Seite, und der
 * Fokus blieb auf dem Navigationslink stehen. Bei einem echten Seitenwechsel
 * liest ein Screenreader den neuen Titel vor; bei dieser Single-Page-App
 * passiert der Wechsel im laufenden Dokument, also passiert ohne Zutun gar
 * nichts. Wer nicht sieht, dass sich die Seite geaendert hat, erfaehrt es
 * nicht.
 *
 * **Warum keine Fokusverschiebung auf `h1` oder `main`.** Das ist die andere
 * gaengige Strategie, und sie ist hier die schlechtere: der Fokus steht nach
 * dem Klick auf dem Navigationspunkt, den die Nutzerin gerade betaetigt hat,
 * und die Kopfzeile bleibt ueber alle Routen hinweg dieselbe. Ihn wegzureissen
 * hiesse, dass die naechste Tabulatortaste NICHT beim naechsten
 * Navigationspunkt weitergeht — genau das, was jemand erwartet, der sich
 * gerade durch das Menue arbeitet. Gewaehlt ist deshalb die Kombination, die
 * die Spezifikation als eigene Option nennt: **Ansage plus Fokuserhalt.**
 *
 * Die Ansage ist `polite` — sie unterbricht nichts, sondern reiht sich ein.
 *
 * **Beim ersten Rendern bleibt die Region leer.** Den Erstaufruf kuendigt der
 * Browser selbst an; eine zusaetzliche Ansage waere eine Dopplung. Ausserdem
 * verlangt der Vertrag aus PT24.1, dass keine Seite mit einer belegten
 * Live-Region startet.
 */

/** Helmet schreibt den Titel im Commit nach dem Routenwechsel. */
const TITLE_SETTLE_MS = 120

/** U+200B ZERO WIDTH SPACE — macht eine wiederholte Ansage fuer die
 *  Live-Region zu einem neuen Text, ohne etwas Hoerbares hinzuzufuegen. */
const ZERO_WIDTH_MARKER = '\u200B'

export const RouteAnnouncer = () => {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    // Erster Durchlauf: Pfad merken, nichts ansagen.
    if (previousPath.current === null) {
      previousPath.current = pathname
      return
    }
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    // Kurz warten, bis `react-helmet-async` den neuen `document.title`
    // geschrieben hat — sonst saegen wir den Titel der VORIGEN Seite an.
    const id = window.setTimeout(() => {
      const title = document.title.trim()
      const heading = document.querySelector('h1')?.textContent?.trim()
      const next = title || heading || pathname
      // Identischer Text hintereinander wird von manchen Screenreadern
      // verschluckt. Ein angehaengtes schmales Leerzeichen macht die Zeichenkette
      // neu, ohne sie hoerbar zu veraendern. Bewusst als Escape-Folge und nicht
      // als literales Zeichen: unsichtbare Zeichen im Quelltext sind eine Falle
      // (und `no-irregular-whitespace` meldet sie zu Recht).
      setMessage((current) => (current === next ? `${next}${ZERO_WIDTH_MARKER}` : next))
    }, TITLE_SETTLE_MS)

    return () => window.clearTimeout(id)
  }, [pathname])

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  )
}

export default RouteAnnouncer
