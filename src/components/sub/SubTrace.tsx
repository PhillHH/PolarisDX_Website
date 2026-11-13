import { useEffect, useRef } from 'react'

/**
 * SC-028: die Lichtlinie der Unterseiten. Sie zweigt von der Lichtlinie der Bühne ab, bleibt je
 * Abschnitt im Rand und zeichnet sich beim Scrollen durch die Seite — wie auf der Startseite
 * (LuminousTrace), aber ohne deren Bühnen- und Galerie-Logik. Bei „Bewegung reduzieren" steht
 * die Linie fertig da; der Lichtkegel der dunklen Flächen folgt nur der Maus.
 */
const SubTrace = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const root = svg?.parentElement
    if (!svg || !root) return
    const path = svg.querySelector<SVGPathElement>('[data-trace-path]')
    const dot = svg.querySelector<SVGCircleElement>('[data-trace-dot]')
    const gradient = svg.querySelector<SVGLinearGradientElement>('[data-trace-gradient]')
    if (!path || !dot || !gradient) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let total = 0
    let frame = 0
    let buildFrame = 0

    const draw = () => {
      frame = 0
      if (!total) return
      const rootTop = root.getBoundingClientRect().top + window.scrollY
      const targetY = window.scrollY + window.innerHeight * 0.62 - rootTop
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
      dot.style.display = motion.matches || length < 1 ? 'none' : ''
    }
    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw)
    }
    const build = () => {
      buildFrame = 0
      const bounds = root.getBoundingClientRect()
      const width = root.clientWidth
      const height = root.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', `${width}`)
      svg.setAttribute('height', `${height}`)
      svg.style.height = `${height}px`
      gradient.setAttribute('y2', `${height}`)
      const gutter = Math.max(14, (width - 1240) / 2 - 26)
      const left = gutter
      const right = width - gutter
      const stage = root.querySelector<HTMLElement>('[data-sub-stage]')
      const line = root.querySelector<HTMLElement>('[data-sub-line]')
      const points: Array<[number, number]> = [[width * 0.84, 0]]
      // Am Desktop zweigt die Linie von der Lichtlinie der Bühne ab, am Handy beginnt sie an
      // deren Fuß, damit sie nicht über die Eckdaten läuft.
      if (line && width > 900) {
        const lineBounds = line.getBoundingClientRect()
        points[0] = [
          Math.min(right, lineBounds.right - bounds.left - 40),
          lineBounds.top - bounds.top,
        ]
      } else if (stage) {
        const stageBounds = stage.getBoundingClientRect()
        points[0] = [right, stageBounds.bottom - bounds.top - 2]
      }
      let side = 1
      root.querySelectorAll<HTMLElement>('[data-sub-section]').forEach((section) => {
        const sectionBounds = section.getBoundingClientRect()
        const top = sectionBounds.top - bounds.top
        const x = side ? left : right
        const pad = Math.min(90, sectionBounds.height * 0.2)
        points.push([x, top + pad], [x, top + sectionBounds.height - pad])
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
      if (!buildFrame) buildFrame = window.requestAnimationFrame(build)
    }
    const spot = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches) return
      const dark = (event.target as HTMLElement).closest<HTMLElement>('.sc025-dark')
      if (!dark) return
      const darkBounds = dark.getBoundingClientRect()
      dark.style.setProperty('--mx', `${event.clientX - darkBounds.left}px`)
      dark.style.setProperty('--my', `${event.clientY - darkBounds.top}px`)
    }
    const observer = new ResizeObserver(requestBuild)
    observer.observe(root)
    window.addEventListener('scroll', requestDraw, { passive: true })
    window.addEventListener('resize', requestBuild)
    window.addEventListener('load', requestBuild)
    motion.addEventListener('change', requestDraw)
    root.addEventListener('pointermove', spot as EventListener)
    void document.fonts?.ready.then(requestBuild)
    build()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestDraw)
      window.removeEventListener('resize', requestBuild)
      window.removeEventListener('load', requestBuild)
      motion.removeEventListener('change', requestDraw)
      root.removeEventListener('pointermove', spot as EventListener)
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(buildFrame)
    }
  }, [])

  return (
    <svg ref={svgRef} className="sc028-trace" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id="sc028-gradient"
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
        <filter id="sc028-glow" x="-20%" y="-5%" width="140%" height="110%">
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
        stroke="url(#sc028-gradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
        filter="url(#sc028-glow)"
      />
      <circle
        data-trace-dot
        r="4.5"
        fill="#fff"
        stroke="#02a6e3"
        strokeWidth="2"
        filter="url(#sc028-glow)"
      />
    </svg>
  )
}

export default SubTrace
