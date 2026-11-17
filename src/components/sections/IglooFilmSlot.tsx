import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const IglooFilm = lazy(() => import('../home/HomeHero'))

/**
 * SC-030: Platz für den IglooPro-Lichtfilm (3D-Gerät, drei Ansichten beim Scrollen). Film und
 * 3D-Modell werden erst geholt, wenn der Besucher sich dem Abschnitt nähert – der Seitenaufbau
 * und die Ladezeit-Budgets der IglooPro-Seite bleiben unberührt.
 */
const IglooFilmSlot = () => {
  const slotRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setShow(true), 0)
      return () => clearTimeout(timer)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150% 0px' },
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={slotRef} data-igloo-film-slot>
      {show && (
        <Suspense fallback={null}>
          <IglooFilm />
        </Suspense>
      )}
    </div>
  )
}

export default IglooFilmSlot
