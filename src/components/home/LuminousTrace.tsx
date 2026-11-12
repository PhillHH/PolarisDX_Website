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
        points.push([side ? left : right, top + bounds.height * 0.5])
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
