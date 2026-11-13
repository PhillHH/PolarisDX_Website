import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import SubTrace from './SubTrace'
import { SUB_STYLES, type SubPageStyle } from './styles'

/**
 * Ist ein Stylesheet der Unterseiten schon im Dokument? Bei einem vollen Seitenaufruf liefert der
 * Server die Blätter der Seite inline mit (server.ts `inlineRouteStylesheet`, erkannt an
 * `data-sub-stylesheet`) — dann ist ihre Kennung gesetzt. Nur beim Seitenwechsel im Browser fehlt
 * ein Blatt und wird nachgeladen. Einmal geprüft, bleibt die Antwort für die Sitzung stehen.
 */
const known = new Map<string, boolean>()
const missing = (mark: string) => {
  let value = known.get(mark)
  if (value === undefined) {
    value = getComputedStyle(document.documentElement).getPropertyValue(mark).trim() === ''
    known.set(mark, value)
  }
  return value
}
const never = () => () => {}

/**
 * SC-028: Rahmen der Unterseiten im Stil der Startseite. Die Stylesheets — das Rahmen-Blatt und
 * mit `page` das Blatt der Seitenart — werden nur von den umgestellten Seiten geladen: inline im
 * Server-HTML, beim Seitenwechsel im Browser als `<link precedence>` (React hält den Wechsel
 * zurück, bis sie da sind — kein ungestalteter Zwischenzustand). Die Lichtlinie wird erst nach dem
 * ersten Bild eingehängt (sie misst das Layout), aber nicht nachgeladen: ein `import()` aus einem
 * nachgeladenen Seiten-Chunk lässt Vite das Haupt-Stylesheet als `<link>` nachtragen, obwohl es
 * inline im Dokument steht (Perf-Gate `stylesheetLinks`).
 */
const SubPage = ({
  children,
  id,
  page,
}: {
  children: ReactNode
  id?: string
  /** Seitenart mit eigenem Stylesheet (pages/*.css). */
  page?: SubPageStyle
}) => {
  const [trace, setTrace] = useState(false)
  const sheets = page ? [SUB_STYLES.frame, SUB_STYLES[page]] : [SUB_STYLES.frame]
  // Je Blatt '1' (fehlt) oder '0'; auf dem Server und beim Hydrieren fehlt keines.
  const pending = useSyncExternalStore(
    never,
    () => sheets.map((sheet) => (missing(sheet.mark) ? '1' : '0')).join(''),
    () => '',
  )
  useEffect(() => {
    const timer = window.setTimeout(() => setTrace(true), 0)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <div
      id={id}
      className="sc028"
      data-sub-page
      data-sub-stylesheet={sheets.map((sheet) => sheet.href).join(' ')}
    >
      {sheets.map((sheet, index) =>
        pending[index] === '1' ? (
          <link key={sheet.href} rel="stylesheet" href={sheet.href} precedence="default" />
        ) : null,
      )}
      {children}
      {trace && <SubTrace />}
    </div>
  )
}

export default SubPage
