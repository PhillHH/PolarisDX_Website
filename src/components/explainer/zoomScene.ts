/**
 * SC-031: Zeichnung der Zoom-Bühne („Reise ins Innere") auf einer Leinwand. Sieben Zustände,
 * `progress` läuft von 0 bis knapp 7: Titel und Körper (Figur nach Leonardos Proportionsstudie),
 * Zelle, Zellkern, Verpackung (Histone), DNA, Markierung. Zwischen zwei Bildern fährt die Ansicht
 * in den Mittelpunkt hinein. Schematische Darstellung ohne Messdaten; nur Palettenfarben.
 */
export type ZoomLabels = {
  cell: string
  nucleus: string
  dna: string
  methyl: string
  loose: string
  dense: string
  /** Ein Satz je Schritt, der sagt, was im Bild zu sehen ist (unter der Zeichnung). */
  legend: string[]
}

type SceneOptions = {
  labels: ZoomLabels
  /** Höhe der festen Kopfzeile der Website in Pixeln. */
  headerHeight: () => number
  /** Oberkante des Textblocks in der Bühne — am Telefon endet die Zeichnung darüber. */
  textTop: () => number
  /** Oberkante der Fußleiste der Bühne (Schritte, Zähler) — die Zeichnung endet darüber. */
  footTop: () => number
  /** „Bewegung reduzieren": keine zeitabhängige Bewegung, nur der Scroll-Zustand. */
  still: boolean
}

const SEQUENCE = 'ATGCCGTACGATCGGATT'
/** Welches Bild zu welchem der sieben Zustände gehört. */
const SCENE_OF_STATE = [0, 0, 1, 2, 3, 4, 4]
const TAU = Math.PI * 2

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value))
const smooth = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}
const white = (alpha: number) => `rgba(255,255,255,${alpha})`
const ghost = (alpha: number) => `rgba(238,242,246,${alpha})`
const light = (alpha: number) => `rgba(143,216,251,${alpha})`
const blue = (alpha: number) => `rgba(47,111,160,${alpha})`
const accent = (alpha: number) => `rgba(27,103,177,${alpha})`
const dim = (alpha: number) => `rgba(159,182,204,${alpha})`

export function createZoomScene(canvas: HTMLCanvasElement, options: SceneOptions) {
  const context = canvas.getContext('2d')
  if (!context) return null
  const ctx: CanvasRenderingContext2D = context
  const { labels, headerHeight, textTop, footTop, still } = options
  let width = 0
  let height = 0

  const resize = () => {
    const ratio = Math.min(2, window.devicePixelRatio || 1)
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  const label = (
    text: string,
    x: number,
    y: number,
    alpha: number,
    align: CanvasTextAlign,
    color: (alpha: number) => string,
  ) => {
    ctx.font = '500 11px "Inter Variable", Inter, system-ui, sans-serif'
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color(alpha)
    ctx.letterSpacing = '1.6px'
    ctx.fillText(text.toUpperCase(), x, y)
    ctx.letterSpacing = '0px'
  }

  /** Körper: Kreis um den Nabel, Quadrat, zwei überlagerte Haltungen, Maßstab. */
  const drawBody = (radius: number, zoom: number, time: number) => {
    const h = radius * 1.62
    const line = (alpha: number, w: number) => {
      ctx.strokeStyle = ghost(alpha)
      ctx.lineWidth = w / zoom
    }
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, 0, h * 0.604, 0, TAU)
    ctx.strokeStyle = light(0.62)
    ctx.lineWidth = 1.3 / zoom
    ctx.stroke()
    ctx.strokeStyle = light(0.42)
    ctx.strokeRect(-h * 0.5, -h * 0.396, h, h)
    ctx.setLineDash([3 / zoom, 6 / zoom])
    ctx.beginPath()
    ctx.moveTo(0, -h * 0.396)
    ctx.lineTo(0, h * 0.604)
    ctx.moveTo(-h * 0.5, -h * 0.215)
    ctx.lineTo(h * 0.5, -h * 0.215)
    ctx.strokeStyle = light(0.22)
    ctx.lineWidth = 1 / zoom
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(-h * 0.5, h * 0.655)
    ctx.lineTo(h * 0.5, h * 0.655)
    for (let i = 0; i <= 8; i++) {
      const x = -h * 0.5 + (i * h) / 8
      ctx.moveTo(x, h * 0.655)
      ctx.lineTo(x, h * (i % 4 ? 0.643 : 0.631))
    }
    ctx.strokeStyle = light(0.45)
    ctx.stroke()
    const limb = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
      const dx = x2 - x1
      const dy = y2 - y1
      const length = Math.hypot(dx, dy)
      const nx = -dy / length
      const ny = dx / length
      ctx.beginPath()
      ctx.moveTo(x1 + nx * w1, y1 + ny * w1)
      ctx.lineTo(x2 + nx * w2, y2 + ny * w2)
      ctx.lineTo(x2 - nx * w2, y2 - ny * w2)
      ctx.lineTo(x1 - nx * w1, y1 - ny * w1)
      ctx.stroke()
    }
    for (const side of [1, -1]) {
      // zweite Haltung, zart: Arme erhoben bis an den Kreis, Beine gespreizt
      line(0.38, 1.2)
      limb(side * h * 0.115, -h * 0.2, side * h * 0.456, -h * 0.396, h * 0.024, h * 0.011)
      limb(side * h * 0.05, h * 0.1, side * h * 0.27, h * 0.54, h * 0.042, h * 0.018)
      // erste Haltung: Arme waagerecht bis an das Quadrat, Beine geschlossen
      line(0.92, 1.6)
      limb(side * h * 0.115, -h * 0.2, side * h * 0.5, -h * 0.215, h * 0.024, h * 0.011)
      limb(side * h * 0.05, h * 0.1, side * h * 0.035, h * 0.604, h * 0.042, h * 0.018)
    }
    line(0.92, 1.6)
    ctx.beginPath()
    ctx.moveTo(-h * 0.025, -h * 0.272)
    ctx.lineTo(-h * 0.03, -h * 0.245)
    ctx.quadraticCurveTo(-h * 0.07, -h * 0.23, -h * 0.125, -h * 0.222)
    ctx.lineTo(-h * 0.092, -h * 0.02)
    ctx.quadraticCurveTo(-h * 0.085, h * 0.04, -h * 0.1, h * 0.09)
    ctx.lineTo(0, h * 0.112)
    ctx.lineTo(h * 0.1, h * 0.09)
    ctx.quadraticCurveTo(h * 0.085, h * 0.04, h * 0.092, -h * 0.02)
    ctx.lineTo(h * 0.125, -h * 0.222)
    ctx.quadraticCurveTo(h * 0.07, -h * 0.23, h * 0.03, -h * 0.245)
    ctx.lineTo(h * 0.025, -h * 0.272)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, -h * 0.334, h * 0.062, 0, TAU)
    ctx.stroke()
    // die Zelle im Mittelpunkt des Kreises
    const pulse = still ? 0.5 : (time * 0.6) % 1
    ctx.beginPath()
    ctx.arc(0, 0, h * (0.02 + pulse * 0.075), 0, TAU)
    ctx.strokeStyle = light(1 - pulse)
    ctx.lineWidth = 1.5 / zoom
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, h * 0.018, 0, TAU)
    ctx.fillStyle = light(1)
    ctx.fill()
  }

  const drawCell = (radius: number, zoom: number, time: number) => {
    ctx.beginPath()
    for (let i = 0; i <= 72; i++) {
      const angle = (i / 72) * TAU
      const r =
        radius *
        (0.94 + 0.035 * Math.sin(angle * 3 + time * 0.7) + 0.02 * Math.sin(angle * 5 - time))
      if (i) ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
      else ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    }
    ctx.closePath()
    ctx.fillStyle = light(0.05)
    ctx.fill()
    ctx.strokeStyle = light(0.75)
    ctx.lineWidth = 1.6 / zoom
    ctx.stroke()
    const organelles = [
      [-0.52, -0.3, 0.1, 0.4],
      [-0.42, 0.42, 0.12, -0.5],
      [0.5, 0.46, 0.09, 0.9],
      [0.58, -0.44, 0.08, 0.2],
      [-0.08, 0.64, 0.07, 1.4],
      [-0.62, 0.06, 0.06, 2],
      [0.02, -0.68, 0.07, 0.6],
    ]
    for (const [x, y, r, turn] of organelles) {
      ctx.beginPath()
      ctx.ellipse(x * radius, y * radius, r * radius, r * radius * 0.55, turn, 0, TAU)
      ctx.strokeStyle = light(0.4)
      ctx.lineWidth = 1.1 / zoom
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(radius * 0.1, -radius * 0.04, radius * 0.32, 0, TAU)
    ctx.fillStyle = accent(0.3)
    ctx.fill()
    ctx.strokeStyle = ghost(0.9)
    ctx.lineWidth = 1.8 / zoom
    ctx.stroke()
  }

  const drawNucleus = (radius: number, zoom: number, time: number) => {
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, TAU)
    ctx.fillStyle = accent(0.16)
    ctx.fill()
    ctx.strokeStyle = ghost(0.8)
    ctx.lineWidth = 1.8 / zoom
    ctx.stroke()
    const strands = [
      [-0.7, -0.2, -0.2, -0.8, 0.1, 0.1, 0.6, -0.4],
      [-0.6, 0.4, -0.1, 0.1, 0.2, 0.8, 0.7, 0.3],
      [-0.3, -0.6, 0.4, -0.7, 0.5, -0.1, 0.1, 0.2],
      [-0.75, 0.1, -0.4, 0.5, 0.1, 0.3, 0.3, 0.7],
      [0.2, -0.5, 0.75, -0.3, 0.6, 0.3, 0.2, 0.55],
    ]
    strands.forEach((c, index) => {
      ctx.beginPath()
      ctx.moveTo(c[0] * radius, c[1] * radius)
      ctx.bezierCurveTo(
        c[2] * radius,
        c[3] * radius + Math.sin(time * 0.6 + index) * radius * 0.03,
        c[4] * radius,
        c[5] * radius,
        c[6] * radius,
        c[7] * radius,
      )
      ctx.strokeStyle = index === 2 ? light(0.95) : light(0.38)
      ctx.lineWidth = (index === 2 ? 2.4 : 1.4) / zoom
      ctx.stroke()
    })
  }

  /** Verpackung: fünf Spulen, die sich lockern und verdichten. Gibt zurück, ob gerade „dicht". */
  const drawPackaging = (radius: number, zoom: number, time: number) => {
    const density = still ? 0.2 : 0.5 + 0.5 * Math.sin(time * 0.9)
    const spools = [-0.72, -0.36, 0, 0.36, 0.72].map((x) => x * radius * (1 - 0.52 * density))
    ctx.beginPath()
    for (let i = 0; i <= 60; i++) {
      const x = -radius * 0.9 + (i / 60) * radius * 1.8
      const y = Math.sin((i / 60) * 12 + time * 0.5) * radius * 0.035
      if (i) ctx.lineTo(x, y)
      else ctx.moveTo(x, y)
    }
    ctx.strokeStyle = ghost(0.6)
    ctx.lineWidth = 1.6 / zoom
    ctx.setLineDash([4 / zoom, 5 / zoom])
    ctx.stroke()
    ctx.setLineDash([])
    for (const x of spools) {
      ctx.beginPath()
      ctx.arc(x, 0, radius * 0.17, 0, TAU)
      ctx.fillStyle = 'rgb(10,47,78)'
      ctx.fill()
      ctx.strokeStyle = light(0.95)
      ctx.lineWidth = 2 / zoom
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(x, 0, radius * 0.17, radius * 0.06, 0.5, 0, TAU)
      ctx.strokeStyle = ghost(0.5)
      ctx.lineWidth = 1 / zoom
      ctx.stroke()
    }
    return density > 0.55
  }

  const drawHelix = (
    radius: number,
    zoom: number,
    time: number,
    compact: boolean,
    letters: number,
    marks: number,
  ) => {
    const count = compact ? 14 : 18
    const span = radius * 1.8
    const step = span / (count - 1)
    const amplitude = radius * 0.42
    const turn = still ? 0.6 : time * 0.5
    ctx.font = `500 ${12 / zoom}px "Inter Variable", Inter, system-ui, sans-serif`
    ctx.textBaseline = 'middle'
    for (const side of [1, -1]) {
      ctx.beginPath()
      for (let u = 0; u <= count - 1 + 1e-6; u += 0.2) {
        const x = side * Math.sin(u * 0.5 + turn) * amplitude
        const y = -span / 2 + u * step
        if (u) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
      }
      ctx.strokeStyle = side > 0 ? ghost(0.55) : blue(0.9)
      ctx.lineWidth = 1.4 / zoom
      ctx.stroke()
    }
    for (let i = 0; i < count; i++) {
      const phase = i * 0.5 + turn
      const sine = Math.sin(phase)
      const depth = Math.cos(phase)
      const y = -span / 2 + i * step
      const x1 = sine * amplitude
      const x2 = -sine * amplitude
      const outward = sine >= 0 ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(x1, y)
      ctx.lineTo(x2, y)
      ctx.strokeStyle = light(0.1 + Math.abs(sine) * 0.22)
      ctx.lineWidth = 1 / zoom
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x1, y, (3.4 + depth * 1.7) / zoom, 0, TAU)
      ctx.fillStyle = white(0.55 + depth * 0.4)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x2, y, (3.4 - depth * 1.7) / zoom, 0, TAU)
      ctx.fillStyle = light(0.55 - depth * 0.4)
      ctx.fill()
      if (letters > 0.01) {
        ctx.textAlign = outward > 0 ? 'left' : 'right'
        ctx.fillStyle = white(letters * (0.3 + 0.7 * Math.abs(sine)))
        ctx.fillText(SEQUENCE[i], x1 + (outward * 26) / zoom, y)
      }
      if (marks > 0 && i % 3 === 1) {
        const grown = clamp(marks * 7 - (i - 1) / 3)
        if (grown > 0) {
          ctx.save()
          ctx.shadowColor = light(0.95)
          ctx.shadowBlur = 16
          ctx.beginPath()
          ctx.arc(
            x1 + (outward * (12 + (1 - grown) * 28)) / zoom,
            y - 1 / zoom,
            (5.6 * grown) / zoom,
            0,
            TAU,
          )
          ctx.fillStyle = light(grown * (0.78 + 0.22 * depth))
          ctx.fill()
          ctx.restore()
        }
      }
    }
  }

  /** Zeichnet ein Bild; gibt für die Verpackung zurück, ob sie gerade dicht ist. */
  const drawScene = (
    scene: number,
    zoom: number,
    alpha: number,
    time: number,
    radius: number,
    compact: boolean,
    letters: number,
    marks: number,
  ) => {
    if (alpha < 0.01) return false
    let dense = false
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.scale(zoom, zoom)
    if (scene === 0) drawBody(radius, zoom, time)
    else if (scene === 1) drawCell(radius, zoom, time)
    else if (scene === 2) drawNucleus(radius, zoom, time)
    else if (scene === 3) dense = drawPackaging(radius, zoom, time)
    else drawHelix(radius, zoom, time, compact, letters, marks)
    ctx.restore()
    return dense
  }

  const draw = (progress: number, now: number) => {
    const time = still ? 2.2 : now / 1000
    const compact = width < 820
    // Am Telefon: unter dem Pfad beginnen, über dem Textblock enden.
    const top = headerHeight() + (compact ? 56 : 70)
    // Unter der Zeichnung bleibt Platz für die Bildzeile — außer auf niedrigen Telefonen: Dort
    // braucht die Zeichnung selbst jeden Pixel.
    const captioned = !compact || textTop() - top >= 200
    const bottom = compact ? Math.max(top + 96, textTop() - (captioned ? 50 : 16)) : footTop() - 58
    const centerY = (top + bottom) / 2
    const centerX = compact ? width / 2 : width * 0.66
    const radius = Math.min((bottom - top) / 2, compact ? width * 0.36 : width * 0.17)
    const state = Math.min(6, Math.floor(progress))
    const within = progress - state
    const current = SCENE_OF_STATE[state]
    const next = SCENE_OF_STATE[Math.min(6, state + 1)]
    const letters = smooth(4.75, 5.2, progress)
    const marks = smooth(5.85, 6.5, progress)
    const travel = current !== next ? smooth(0.6, 1, within) : 0

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(centerX, centerY)
    const dense = drawScene(
      current,
      1 + travel * travel * 8,
      1 - travel,
      time,
      radius,
      compact,
      letters,
      marks,
    )
    if (travel > 0)
      drawScene(next, 0.22 + 0.78 * travel, travel, time, radius, compact, letters, marks)
    if (current === 3 && travel < 0.4) {
      label(
        dense ? labels.dense : labels.loose,
        0,
        radius * 0.5,
        1 - travel / 0.4,
        'center',
        dense ? dim : ghost,
      )
    }
    ctx.restore()

    // Bildzeile: sagt in einem Satz, was gerade zu sehen ist — auf jeder Bildschirmbreite.
    // Sie blendet mit der Fahrt aus und nach einem Bildwechsel wieder ein.
    const caption = labels.legend[Math.max(0, state - 1)]
    const arrived = state > 0 && SCENE_OF_STATE[state] !== SCENE_OF_STATE[state - 1]
    const captionAlpha = Math.max(0, 1 - travel / 0.3) * (arrived ? smooth(0, 0.12, within) : 1)
    if (captioned && caption && captionAlpha > 0.01) {
      const face = '"Inter Variable", Inter, system-ui, sans-serif'
      let size = compact ? 13 : 14
      ctx.font = `500 ${size}px ${face}`
      const room = compact ? width - 40 : radius * 2.6
      const wide = ctx.measureText(caption).width
      if (wide > room) size = Math.max(11, Math.floor((size * room) / wide))
      ctx.font = `500 ${size}px ${face}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = light(captionAlpha)
      ctx.fillText(caption, centerX, bottom + (compact ? 24 : 30))
    }

    // Beschriftungen rechts neben dem Bild — nur, wo dafür Platz ist
    if (width >= 1180 && travel < 0.3) {
      const alpha = 1 - travel / 0.3
      const side = centerX + radius + 30
      const pointer = (fromX: number, y: number, text: string) => {
        ctx.beginPath()
        ctx.moveTo(fromX, y)
        ctx.lineTo(side + 8, y)
        ctx.strokeStyle = ghost(0.7 * alpha)
        ctx.lineWidth = 1
        ctx.stroke()
        label(text, side + 16, y, alpha, 'left', light)
      }
      if (state <= 1) pointer(centerX + radius * 0.07, centerY, labels.cell)
      else if (state === 2)
        pointer(centerX + radius * 0.44, centerY - radius * 0.04, labels.nucleus)
      else if (state === 3) label(labels.dna, side, centerY - radius * 0.3, alpha, 'left', light)
      else if (state === 6 && marks > 0.3)
        label(labels.methyl, side - radius * 0.3, centerY - radius * 0.78, marks, 'left', light)
    }
  }

  return { resize, draw }
}
