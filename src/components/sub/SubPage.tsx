import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import subStylesheet from './sub.css?url'

const SubTrace = lazy(() => import('./SubTrace'))

/**
 * SC-028: Rahmen der Unterseiten im Stil der Startseite. Das Stylesheet wird nur von den
 * umgestellten Seiten geladen (`precedence`: React hält den Seitenwechsel zurück, bis es da ist —
 * kein ungestalteter Zwischenzustand); die Lichtlinie kommt nach dem ersten Bild nach.
 */
const SubPage = ({ children, id }: { children: ReactNode; id?: string }) => {
  const [trace, setTrace] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setTrace(true), 0)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <div id={id} className="sc028" data-sub-page>
      <link rel="stylesheet" href={subStylesheet} precedence="default" />
      {children}
      {trace && (
        <Suspense fallback={null}>
          <SubTrace />
        </Suspense>
      )}
    </div>
  )
}

export default SubPage
