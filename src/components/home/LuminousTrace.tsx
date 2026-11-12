import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const LuminousTrace = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const root = document.getElementById('root')
    if (!svg || !root) return

    const path = svg.querySelector<SVGPathElement>('[data-trace-path]')
    const dot = svg.querySelector<SVGCircleElement>('[data-trace-dot]')
    const gradient = svg.querySelector<SVGLinearGradientElement>('[data-trace-gradient]')
    if (!path || !dot || !gradient) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let total = 0
    let frame = 0
    let resizeFrame = 0

    const draw = () => {
      frame = 0
      const targetY = window.scrollY + window.innerHeight * 0.62
      let low = 0
      let high = total
      for (let index = 0; index < 18; index += 1) {
        const middle = (low + high) / 2
        if (path.getPointAtLength(middle).y < targetY) low = middle
        else high = middle
      }
      const length = motion.matches ? total : Math.min(total, low)
      path.style.strokeDashoffset = `${total - length}`
      const point = path.getPointAtLength(length)
      dot.setAttribute('cx', `${point.x}`)
      dot.setAttribute('cy', `${point.y}`)
      dot.style.display = motion.matches ? 'none' : ''
    }

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw)
    }

    const build = () => {
      resizeFrame = 0
      const width = document.documentElement.clientWidth
      const height = root.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', `${width}`)
      svg.setAttribute('height', `${height}`)
      svg.style.height = `${height}px`
      gradient.setAttribute('y2', `${height}`)

      const gutter = Math.max(14, (width - 1240) / 2 - 26)
      const left = gutter
      const right = width - gutter
      const views = document.querySelector<HTMLElement>('[data-home-film-views]')
      const film = views?.closest<HTMLElement>('[data-home-hero]')
      const pin = views?.closest<HTMLElement>('.sc025-film-pin')
      const points: Array<[number, number]> = [[width * 0.84, 0]]
      if (views && film && pin) {
        // Lichtfilm: Die Linie entspringt dem Lichtring des Geräts in der letzten Ansicht.
        const viewBounds = views.getBoundingClientRect()
        const pinBounds = pin.getBoundingClientRect()
        const filmTop = film.getBoundingClientRect().top + window.scrollY
        points[0] = [
          viewBounds.left + viewBounds.width * 0.5,
          filmTop +
            film.offsetHeight -
            pin.offsetHeight +
            (viewBounds.top - pinBounds.top) +
            viewBounds.height * 0.57,
        ]
      }
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-home-section], footer, .sc025-footer-mark'),
      )
      let side = 1
      sections.forEach((section, index) => {
        const bounds = section.getBoundingClientRect()
        const top = bounds.top + window.scrollY
        if (index === 0 && views) {
          points.push([width * 0.14, top + bounds.height + 40])
          side = 0
          return
        }
        if (index === 0) {
          points.push([right + (width > 900 ? 20 : 0), top + bounds.height * 0.42])
          points.push([width * 0.18, top + bounds.height + 40])
          side = 0
          return
        }
        // Die Linie bleibt je Abschnitt im Rand und wechselt die Seite nur an den Abschnittsgrenzen.
        const x = side ? left : right
        const pad = Math.min(90, bounds.height * 0.2)
        points.push([x, top + pad])
        points.push([x, top + bounds.height - pad])
        side = 1 - side
      })
      points.push([width * 0.5, height - 30])

      let definition = `M${points[0][0]} ${points[0][1]}`
      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1]
        const current = points[index]
        const dy = (current[1] - previous[1]) * 0.5
        definition += ` C${previous[0]} ${previous[1] + dy},${current[0]} ${current[1] - dy},${current[0]} ${current[1]}`
      }
      path.setAttribute('d', definition)
      total = path.getTotalLength()
      path.style.strokeDasharray = `${total}`
      draw()
    }

    const requestBuild = () => {
      if (!resizeFrame) resizeFrame = window.requestAnimationFrame(build)
    }
    const onMotionChange = () => requestDraw()
    const observer = new ResizeObserver(requestBuild)
    observer.observe(root)
    window.addEventListener('scroll', requestDraw, { passive: true })
    window.addEventListener('resize', requestBuild)
    window.addEventListener('load', requestBuild)
    motion.addEventListener('change', onMotionChange)
    document.fonts.ready.then(requestBuild)
    build()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestDraw)
      window.removeEventListener('resize', requestBuild)
      window.removeEventListener('load', requestBuild)
      motion.removeEventListener('change', onMotionChange)
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(resizeFrame)
    }
  }, [])

  useEffect(() => {
    const page = document.getElementById('home-page')
    const svg = svgRef.current
    if (!page || !svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cleanups: Array<() => void> = []
    const on = <K extends keyof WindowEventMap>(type: K, handler: () => void) => {
      window.addEventListener(type, handler, { passive: true })
      cleanups.push(() => window.removeEventListener(type, handler))
    }
    page.classList.add('sc025-fx')
    cleanups.push(() => page.classList.remove('sc025-fx'))

    // Einblenden beim Scrollen: nur Elemente, die beim Start noch unterhalb des Bildschirms liegen.
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }),
      { rootMargin: '0px 0px -6% 0px' },
    )
    cleanups.push(() => observer.disconnect())
    page
      .querySelectorAll<HTMLElement>(
        '.sc025-s .sc025-inner > *, .sc025-cols3 > div, .sc025-numbers tbody tr, .sc025-band, .sc025-proc',
      )
      .forEach((element) => {
        const isBand = element.matches('.sc025-band, .sc025-proc')
        if (!isBand) element.classList.add('sc025-rv')
        if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add('is-in')
        else observer.observe(element)
      })

    // Der Satz im Auftakt färbt sich Wort für Wort ein.
    const lit = page.querySelector<HTMLElement>('[data-home-lit]')
    const words: HTMLElement[] = []
    if (lit && lit.children.length === 0) {
      const text = lit.textContent ?? ''
      const firstStop = text.indexOf('. ')
      let offset = 0
      lit.textContent = ''
      text.split(/(\s+)/).forEach((part) => {
        if (part.trim()) {
          const span = document.createElement('span')
          span.textContent = part
          if (firstStop >= 0 && offset > firstStop) span.className = 'is-accent'
          lit.append(span)
          words.push(span)
        } else lit.append(part)
        offset += part.length
      })
    }

    const hz = page.querySelector<HTMLElement>('[data-home-hz]')
    const track = page.querySelector<HTMLElement>('[data-home-hz-track]')
    const bar = page.querySelector<HTMLElement>('[data-home-hz-bar]')
    const count = page.querySelector<HTMLElement>('[data-home-hz-count]')
    const bandImage = page.querySelector<HTMLElement>('[data-home-band] img')
    let frame = 0
    const update = () => {
      frame = 0
      if (lit && words.length) {
        const bounds = lit.getBoundingClientRect()
        const progress =
          (window.innerHeight * 0.88 - bounds.top) / (bounds.height + window.innerHeight * 0.38)
        const lit_count = Math.round(Math.max(0, Math.min(1, progress)) * words.length)
        words.forEach((word, index) => word.classList.toggle('is-on', index < lit_count))
      }
      if (hz && track && window.innerWidth > 900) {
        const range = Math.max(1, hz.offsetHeight - window.innerHeight)
        const top = hz.getBoundingClientRect().top
        const progress = Math.max(0, Math.min(1, -top / range))
        track.style.transform = `translate3d(${-(track.scrollWidth - window.innerWidth) * progress}px,0,0)`
        if (bar) bar.style.transform = `scaleX(${progress})`
        if (count) count.textContent = `0${Math.min(3, Math.floor(progress * 3) + 1)}`
      } else if (track) track.style.transform = ''
      if (bandImage) {
        const bounds = bandImage.parentElement!.getBoundingClientRect()
        const shift = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight
        bandImage.style.transform = `translateY(${shift * -40}px)`
      }
    }
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    on('scroll', request)
    on('resize', request)
    request()
    cleanups.push(() => window.cancelAnimationFrame(frame))

    // Lichtkegel in dunklen Flächen und leicht mitziehender Hauptknopf (nur mit Maus).
    const spot = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const dark = (event.target as HTMLElement).closest<HTMLElement>('.sc025-dark')
      if (!dark) return
      const bounds = dark.getBoundingClientRect()
      dark.style.setProperty('--mx', `${event.clientX - bounds.left}px`)
      dark.style.setProperty('--my', `${event.clientY - bounds.top}px`)
    }
    page.addEventListener('pointermove', spot)
    cleanups.push(() => page.removeEventListener('pointermove', spot))

    // Lichtimpuls auf dem zuletzt gezeichneten Stück der Linie.
    const path = svg.querySelector<SVGPathElement>('[data-trace-path]')
    const pulse = svg.querySelector<SVGPathElement>('[data-trace-pulse]')
    let pulseFrame = 0
    if (path && pulse) {
      const start = performance.now()
      const tick = (now: number) => {
        const definition = path.getAttribute('d') ?? ''
        if (pulse.getAttribute('d') !== definition) pulse.setAttribute('d', definition)
        const total = definition ? path.getTotalLength() : 0
        const drawn = total - parseFloat(path.style.strokeDashoffset || `${total}`)
        const phase = ((now - start) % 4200) / 4200
        pulse.style.strokeDasharray = `46 ${total + 100}`
        pulse.style.strokeDashoffset = `${-(Math.max(0, drawn - 900) + Math.min(900, drawn) * phase)}`
        pulse.style.opacity = drawn > 60 ? `${0.9 * Math.sin(phase * Math.PI)}` : '0'
        pulseFrame = window.requestAnimationFrame(tick)
      }
      pulseFrame = window.requestAnimationFrame(tick)
      cleanups.push(() => window.cancelAnimationFrame(pulseFrame))
    }

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  return createPortal(
    <svg ref={svgRef} className="sc025-trace" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id="sc025-gradient"
          data-trace-gradient
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="1000"
        >
          <stop offset="0" stopColor="#8fd8fb" />
          <stop offset=".35" stopColor="#02a6e3" />
          <stop offset=".7" stopColor="#1b67b1" />
          <stop offset="1" stopColor="#02a6e3" />
        </linearGradient>
        <filter id="sc025-glow" x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        data-trace-path
        fill="none"
        stroke="url(#sc025-gradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
        filter="url(#sc025-glow)"
      />
      <path
        data-trace-pulse
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        style={{ opacity: 0 }}
      />
      <circle
        data-trace-dot
        r="4.5"
        fill="#fff"
        stroke="#02a6e3"
        strokeWidth="2"
        filter="url(#sc025-glow)"
      />
    </svg>,
    document.getElementById('root')!,
  )
}

export default LuminousTrace
