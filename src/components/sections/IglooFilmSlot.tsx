import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const IglooFilm = lazy(() => import('../home/HomeHero'))

/**
 * SC-030: Platz für den IglooPro-Lichtfilm (3D-Gerät). Film, Blatt und 3D-Modell werden erst
 * geholt, wenn der Besucher sich dem Abschnitt nähert – Seitenaufbau und Budgets bleiben unberührt.
 */
const IglooFilmSlot = () => {
  const slot = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!window.IntersectionObserver) return undefined
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setShow(true),
      { rootMargin: '50% 0px' },
    )
    observer.observe(slot.current!)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={slot}>
      {show && (
        <Suspense fallback={null}>
          <IglooFilm />
        </Suspense>
      )}
    </div>
  )
}

export default IglooFilmSlot
