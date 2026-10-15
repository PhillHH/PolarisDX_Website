/**
 * Scroll-Spy fuer „Auf dieser Seite" — nachgeladen (eigener Chunk), damit er
 * nicht zum Route-JS der Leseseiten zaehlt (routeJsGzip-Budget §29). Er setzt
 * nur Darstellung: `aria-current="location"` auf den aktiven Link und die
 * Breite des Fortschrittsbalkens. Aktiv ist ein Abschnitt, sobald seine
 * Oberkante 35 % der Fensterhoehe erreicht — wie in ChapterNav.
 */
export function watchToc(nav: HTMLElement): () => void {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
  const bar = nav.querySelector<HTMLElement>('[data-toc-progress]')
  let frame = 0
  const messen = () => {
    frame = 0
    const line = window.innerHeight * 0.35
    let current = links[0]
    for (const link of links) {
      const el = document.getElementById(link.hash.slice(1))
      if (el && el.getBoundingClientRect().top <= line) current = link
    }
    for (const link of links) {
      const on = link === current
      if (on) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
      // Bestehende Klassen statt aria-Varianten: kein neues CSS (initialCss §29).
      link.classList.toggle('border-accent', on)
      link.classList.toggle('font-semibold', on)
      link.classList.toggle('text-heading', on)
      link.classList.toggle('border-transparent', !on)
      link.classList.toggle('text-gray-600', !on)
    }
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (bar) bar.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`
  }
  const plan = () => {
    if (!frame) frame = window.requestAnimationFrame(messen)
  }
  messen()
  window.addEventListener('scroll', plan, { passive: true })
  window.addEventListener('resize', plan)
  return () => {
    window.removeEventListener('scroll', plan)
    window.removeEventListener('resize', plan)
    if (frame) window.cancelAnimationFrame(frame)
  }
}
