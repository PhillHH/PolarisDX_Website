import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  HalfFloatType,
  HemisphereLight,
  LatheGeometry,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  OrthographicCamera,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'
import type { IUniform, Material, Object3D, Texture } from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * SC-026 (Owner 2026-11-13: „Dramatisch nehmen wir, bitte auf preview implementieren"):
 * der IglooPro als 3D-Modell mit Adapter, Testkassette und Blutstropfen in der Lichtstimmung
 * „Dramatisch" — Seitenlicht mit echtem Schattenwurf, spiegelnder Boden, Lichtring und Lichtlinie
 * als HDR-Lichtquellen mit Überstrahlen und filmischer Tonwertkurve.
 *
 * Das Modul wird nur nachgeladen (siehe HomeHero), nie bei „Bewegung reduzieren" und nie ohne
 * WebGL 2. Fällt es aus, bleiben die drei Gerätebilder des Lichtfilms stehen.
 */

export type IglooLabels = {
  /** Startanzeige des Geräts, z. B. „Neue Messung". */
  start: string
  /** Anzeige während der Messung, z. B. „Auswertung läuft". */
  running: string
  /** Messgröße der Beispielanzeige, z. B. „Vitamin D3". */
  analyte: string
  /** Einordnung des Beispielwerts, z. B. „Optimal". */
  verdict: string
  /** Beschriftung des Referenzbereichs. */
  range: string
}

export type IglooSceneOptions = {
  section: HTMLElement
  pin: HTMLElement
  views: HTMLElement
  phases: HTMLElement | null
  canvas: HTMLCanvasElement
  labels: IglooLabels
  fontFamily: string
  /** Der Grafikkontext ging verloren: die Bühne fällt auf die Bilder zurück. */
  onLost?: () => void
}

export type IglooScene = { dispose: () => void }

/** Beispielwert der Ergebnisanzeige — derselbe wie im Hersteller-Render der Geräteansicht. */
const RESULT = { value: '36', unit: 'ng/ml', range: '30–100 ng/ml' }

// Maße in Geräteradien, aus den Hersteller-Rendern ausgemessen.
const R = 1
const H = 1.9
const SY = 0.55
const SR = 0.285 / 2
const SA = 0.594
const E = 0.035
const RINGY = 0.575
const BEV = 0.1
const TOPB = 0.08
const RG = 0.9
const ALPHA = 0.95
const YB = SY - SR - 0.1
const YT = SY + SR + 0.1
const ZB = 0.15
const WA = 0.98
const LA = 2.5
const TA = 0.17
const WC = 0.5
const LC = 1.62
const TC = 0.11
const ZCAS = 0.22
const FOV = 26

// Lichtstimmung „Dramatisch".
const EXPOSURE = 0.8
const BLOOM = 0.4
const BLOOM_THRESHOLD = 1.2 / EXPOSURE
const VIGNETTE = 0.4
const MIRROR_OPACITY = 0.84
const KEY_ANGLE = 0.42
// three rechnet Lichtstärken physikalisch; die im Entwurf abgestimmten Werte galten für die
// frühere Skala und werden deshalb mit π übertragen.
const KEY_INTENSITY = 1.15 * Math.PI
const HEMI_INTENSITY = 0.08 * Math.PI
const RIM_INTENSITY = 0.9 * Math.PI
const RING_LIGHT = 0.9 * Math.PI * 0.9
const SLOT_LIGHT = Math.PI * 0.35

// Kamerafahrt: Fortschritt, Drehung des Geräts, Kamerahöhe, Größe im Bildfeld, Blickpunkt x/y/z.
const KEYS_DESKTOP = [
  [0.0, 0.62, 0.3, 0.5, 0.62, 0.66, 0.55],
  [0.3, 0.5, 0.33, 0.54, 0.38, 0.72, 0.35],
  [0.4, 0.16, 0.74, 0.6, 0.1, 0.94, 0.22],
  [0.62, 0.1, 0.76, 0.62, 0.08, 0.94, 0.2],
  [0.72, -0.24, 0.52, 0.64, 0.0, 0.9, 0.18],
  [1.0, -0.3, 0.5, 0.66, 0.0, 0.9, 0.18],
]
const KEYS_MOBILE = [
  [0.0, 0.7, 0.24, 0.44, 0.95, 0.7, 0.5],
  [0.3, 0.6, 0.26, 0.5, 0.52, 0.74, 0.3],
  [0.4, 0.16, 0.74, 0.66, 0.08, 0.92, 0.2],
  [0.62, 0.1, 0.76, 0.68, 0.06, 0.92, 0.18],
  [0.72, -0.24, 0.52, 0.7, 0.0, 0.88, 0.12],
  [1.0, -0.3, 0.5, 0.72, 0.0, 0.88, 0.12],
]

const QUAD_VERTEX =
  'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
const BRIGHT_FRAGMENT = `
uniform sampler2D t; uniform vec2 px; uniform float th; varying vec2 vUv;
vec3 pick(vec2 o){
  vec3 c = texture2D(t, vUv + o * px).rgb; float br = max(c.r, max(c.g, c.b)); float k = 0.25;
  float s = clamp(br - th + k, 0.0, 2.0 * k); s = s * s / (4.0 * k + 0.0001);
  return c * max(s, br - th) / max(br, 0.0001);
}
void main(){
  gl_FragColor = vec4((pick(vec2(-0.5,-0.5)) + pick(vec2(0.5,-0.5)) + pick(vec2(-0.5,0.5)) + pick(vec2(0.5,0.5))) * 0.25, 1.0);
}`
const DOWN_FRAGMENT = `
uniform sampler2D t; uniform vec2 px; varying vec2 vUv;
void main(){
  gl_FragColor = vec4((texture2D(t, vUv + vec2(-0.5,-0.5) * px).rgb + texture2D(t, vUv + vec2(0.5,-0.5) * px).rgb + texture2D(t, vUv + vec2(-0.5,0.5) * px).rgb + texture2D(t, vUv + vec2(0.5,0.5) * px).rgb) * 0.25, 1.0);
}`
const BLUR_FRAGMENT = `
uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;
void main(){
  vec3 c = texture2D(t, vUv).rgb * 0.227027;
  c += (texture2D(t, vUv + dir * 1.3846).rgb + texture2D(t, vUv - dir * 1.3846).rgb) * 0.316216;
  c += (texture2D(t, vUv + dir * 3.2308).rgb + texture2D(t, vUv - dir * 3.2308).rgb) * 0.070270;
  gl_FragColor = vec4(c, 1.0);
}`
const FINAL_FRAGMENT = `
uniform sampler2D tS, t0, t1, t2, t3, t4; uniform float strength, exposure, vig; varying vec2 vUv;
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
vec3 enc(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c)); }
void main(){
  vec3 c = texture2D(tS, vUv).rgb;
  vec3 bl = texture2D(t0, vUv).rgb + texture2D(t1, vUv).rgb * 0.8 + texture2D(t2, vUv).rgb * 0.6 + texture2D(t3, vUv).rgb * 0.4 + texture2D(t4, vUv).rgb * 0.28;
  c = aces((c + bl * strength) * exposure);
  vec2 q = vUv - 0.5; c *= 1.0 - dot(q, q) * vig;
  c = enc(c);
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(c + (n - 0.5) / 255.0, 1.0);
}`
const MIRROR_VERTEX =
  'uniform mat4 textureMatrix; varying vec4 vUv; void main(){ vUv = textureMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'
// Spiegelung leicht weichgezeichnet wie auf einem satinierten Boden; Lichtquellen spiegeln sich
// nicht heller als Weiß.
const MIRROR_FRAGMENT = `
uniform sampler2D tDiffuse; uniform vec2 px; varying vec4 vUv;
void main(){
  vec2 uv = vUv.xy / vUv.w;
  vec3 c = texture2D(tDiffuse, uv).rgb * 0.2;
  c += (texture2D(tDiffuse, uv + px * 1.5).rgb + texture2D(tDiffuse, uv - px * 1.5).rgb + texture2D(tDiffuse, uv + vec2(px.x, -px.y) * 1.5).rgb + texture2D(tDiffuse, uv + vec2(-px.x, px.y) * 1.5).rgb) * 0.125;
  c += (texture2D(tDiffuse, uv + vec2(px.x * 3.0, 0.0)).rgb + texture2D(tDiffuse, uv - vec2(px.x * 3.0, 0.0)).rgb + texture2D(tDiffuse, uv + vec2(0.0, px.y * 3.0)).rgb + texture2D(tDiffuse, uv - vec2(0.0, px.y * 3.0)).rgb) * 0.075;
  gl_FragColor = vec4(min(c, vec3(1.0)), 1.0);
}`

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (value: number) => {
  const v = clamp01(value)
  return v * v * v * (v * (v * 6 - 15) + 10)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const aces = (x: number) => clamp01((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14))
/** Szenenwert, der nach Belichtung und Tonwertkurve genau den Bildschirmwert `v` ergibt. */
const inverseTone = (v: number) => {
  let lo = 0
  let hi = 4
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (aces(mid * EXPOSURE) < v) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}
const screenColor = (hex: number) => {
  const c = new Color(hex)
  return new Color(inverseTone(c.r), inverseTone(c.g), inverseTone(c.b))
}
/** Abstand eines Elements zur Oberkante von `root` im Layout, unabhängig von Transformationen. */
const offsetWithin = (element: HTMLElement, root: HTMLElement) => {
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== root) {
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return y
}

export function createIglooScene(options: IglooSceneOptions): IglooScene | null {
  const { section, pin, views, phases, canvas, labels, fontFamily } = options

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
  } catch {
    return null
  }
  const small = window.innerWidth <= 900
  // Die Szene wird linear in ein Gleitkomma-Ziel gerechnet; Überstrahlen, Tonwertkurve und sRGB
  // folgen im letzten Schritt.
  renderer.outputColorSpace = LinearSRGBColorSpace
  renderer.toneMapping = NoToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  const hdr =
    renderer.extensions.has('EXT_color_buffer_float') ||
    renderer.extensions.has('EXT_color_buffer_half_float')
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

  const textures: Texture[] = []
  const background = screenColor(0x041a2e)
  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 1, 220)
  const device = new Group()
  const fog = new Fog(background, 15, 46)
  scene.add(device)
  scene.fog = fog
  scene.add(
    new Mesh(
      new SphereGeometry(110, 24, 16),
      new MeshBasicMaterial({ color: background, side: BackSide, fog: false }),
    ),
  )

  // Studio-Umgebung aus Leuchtflächen: Spiegelungen und weiches Fülllicht.
  const studio = new Scene()
  const panel = (size: number[], at: number[], rgb: number[]) => {
    const mesh = new Mesh(
      new BoxGeometry(size[0], size[1], size[2]),
      new MeshBasicMaterial({ color: new Color(rgb[0], rgb[1], rgb[2]), side: DoubleSide }),
    )
    mesh.position.set(at[0], at[1], at[2])
    studio.add(mesh)
  }
  studio.add(
    new Mesh(
      new BoxGeometry(44, 44, 44),
      new MeshBasicMaterial({ color: new Color(0.006, 0.016, 0.03), side: BackSide }),
    ),
  )
  panel([13, 0.2, 9], [-1, 12, 3], [2.4, 2.55, 2.75])
  panel([0.2, 8, 13], [-15, 5, 1], [0.8, 1.7, 2.8])
  panel([0.2, 6, 9], [15, 4, -3], [1.0, 1.15, 1.4])
  panel([11, 5, 0.2], [0, 5, 17], [0.4, 0.45, 0.55])
  panel([9, 2.5, 0.2], [2, 7, -17], [1.0, 1.8, 2.6])
  const pmrem = new PMREMGenerator(renderer)
  const environmentTarget = pmrem.fromScene(studio, 0.03)
  const environment = environmentTarget.texture
  pmrem.dispose()

  // Hauptlicht als Scheinwerfer von der Seite: Lichtkegel auf dem Boden, darin der Schattenwurf.
  const key = new SpotLight(0xffffff, KEY_INTENSITY, 0, KEY_ANGLE, 1, 0)
  key.position.set(-7.5, 6.2, 1.2)
  key.target.position.set(0, 0.5, 0.4)
  key.castShadow = true
  const shadowSize = small ? 1024 : 2048
  key.shadow.mapSize.set(shadowSize, shadowSize)
  key.shadow.camera.near = 3
  key.shadow.camera.far = 26
  key.shadow.bias = -0.0005
  key.shadow.radius = 2.5
  // Versatz in Texeln des Schattenbilds, damit streifendes Licht keine Streifen erzeugt.
  key.shadow.normalBias = Math.max(
    0.02,
    (4 * key.position.distanceTo(key.target.position) * Math.tan(KEY_ANGLE)) / shadowSize,
  )
  scene.add(key, key.target)
  scene.add(
    new HemisphereLight(
      new Color(0.749, 0.863, 1.0),
      new Color(0.039, 0.145, 0.251),
      HEMI_INTENSITY,
    ),
  )
  const rim = new DirectionalLight(new Color(0.298, 0.765, 1.0), RIM_INTENSITY)
  rim.position.set(4.5, 4, -6)
  scene.add(rim)
  const ringLight = new PointLight(new Color(0.208, 0.706, 1.0), RING_LIGHT, 6.5, 1)
  ringLight.position.set(0, RINGY, 0)
  scene.add(ringLight)
  const slotLight = new PointLight(new Color(0.184, 0.722, 1.0), 0, 2.6, 1)
  slotLight.position.set(0, SY + 0.05, 1.2)
  device.add(slotLight)

  const painted = <A extends unknown[]>(
    width: number,
    height: number,
    paint: (x: CanvasRenderingContext2D, w: number, h: number, ...args: A) => void,
    ...initial: A
  ) => {
    const source = document.createElement('canvas')
    source.width = width
    source.height = height
    const context = source.getContext('2d')
    const texture = new CanvasTexture(source)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = maxAnisotropy
    const redraw = (...args: A) => {
      if (!context) return
      paint(context, width, height, ...args)
      texture.needsUpdate = true
    }
    redraw(...initial)
    textures.push(texture)
    return { texture, redraw }
  }
  const geometry = (positions: number[], normals?: number[], index?: number[]) => {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    if (normals) g.setAttribute('normal', new Float32BufferAttribute(normals, 3))
    if (index) g.setIndex(index)
    if (!normals) g.computeVertexNormals()
    return g
  }
  const bend = (u: number, v: number, radius: number, out: number[], normals?: number[]) => {
    const t = u / R
    out.push(radius * Math.sin(t), v, radius * Math.cos(t))
    normals?.push(Math.sin(t), 0, Math.cos(t))
  }
  const arc = (cx: number, cy: number, r: number, from: number, to: number, steps: number) => {
    const points: Vector2[] = []
    for (let i = 0; i <= steps; i++) {
      const a = from + ((to - from) * i) / steps
      points.push(new Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a)))
    }
    return points
  }
  const solid = <T extends Object3D>(object: T) => {
    object.castShadow = true
    object.receiveShadow = true
    return object
  }

  const bodyMaterial = new MeshStandardMaterial({
    color: 0xe6e8eb,
    roughness: 0.36,
    metalness: 0,
    envMap: environment,
    envMapIntensity: 0.3,
    side: DoubleSide,
  })
  const tunnelMaterial = new MeshBasicMaterial({
    color: 0x000000,
    side: DoubleSide,
    vertexColors: true,
  })
  const tunnelOff = new Color(0.0015, 0.002, 0.003)
  const tunnelOn = new Color(0.12, 0.95, 1.7)
  const bezelMaterial = new MeshStandardMaterial({
    color: 0x14181c,
    roughness: 0.3,
    metalness: 0.1,
    envMap: environment,
    envMapIntensity: 0.9,
    side: DoubleSide,
  })

  // Gehäuse: unten, oben, dazwischen das Band mit dem echten Einschub.
  const lower = [new Vector2(0, 0), new Vector2(R - BEV, 0)].concat(
    arc(R - BEV, BEV, BEV, -Math.PI / 2, 0, 10),
    [new Vector2(R, YB)],
  )
  const upper = [new Vector2(R, YT)].concat(arc(R - TOPB, H - TOPB, TOPB, 0, Math.PI / 2, 10), [
    new Vector2(RG, H),
  ])
  device.add(solid(new Mesh(new LatheGeometry(lower, 128), bodyMaterial)))
  device.add(solid(new Mesh(new LatheGeometry(upper, 128), bodyMaterial)))
  const back = new CylinderGeometry(R, R, YT - YB, 128, 1, true, ALPHA, Math.PI * 2 - 2 * ALPHA)
  back.translate(0, (YB + YT) / 2, 0)
  device.add(solid(new Mesh(back, bodyMaterial)))

  const columns: number[] = []
  for (let i = 0; i < 12; i++) columns.push(-ALPHA * R + ((-SA + ALPHA * R) * i) / 12)
  for (let i = 0; i <= 16; i++)
    columns.push(-(SA - SR) - SR * Math.sin((Math.PI / 2) * (1 - i / 16)))
  for (let i = 1; i < 28; i++) columns.push(-(SA - SR) + (2 * (SA - SR) * i) / 28)
  for (let i = 0; i <= 16; i++) columns.push(SA - SR + SR * Math.sin((Math.PI / 2) * (i / 16)))
  for (let i = 1; i <= 12; i++) columns.push(SA + ((ALPHA * R - SA) * i) / 12)
  const slotHalfHeight = (u: number) => {
    const distance = Math.abs(u)
    if (distance >= SA) return 0
    if (distance <= SA - SR) return SR
    const d = distance - (SA - SR)
    return Math.sqrt(Math.max(0, SR * SR - d * d))
  }
  const bandPositions: number[] = []
  const bandNormals: number[] = []
  const bandIndex: number[] = []
  for (const u of columns) {
    const half = slotHalfHeight(u)
    bend(u, YB, R, bandPositions, bandNormals)
    bend(u, SY - half, R, bandPositions, bandNormals)
    bend(u, SY + half, R, bandPositions, bandNormals)
    bend(u, YT, R, bandPositions, bandNormals)
  }
  for (let j = 0; j < columns.length - 1; j++) {
    const a = 4 * j
    const b = 4 * (j + 1)
    bandIndex.push(a, b, b + 1, a, b + 1, a + 1, a + 2, b + 2, b + 3, a + 2, b + 3, a + 3)
  }
  device.add(solid(new Mesh(geometry(bandPositions, bandNormals, bandIndex), bodyMaterial)))

  // Einschub: das Licht kommt aus der Tiefe (vorn dunkel, hinten hell).
  const tunnel: number[] = []
  const triangle = (p: number[], q: number[], r: number[]) => tunnel.push(...p, ...q, ...r)
  const quad = (p: number[], q: number[], r: number[], s: number[]) => {
    triangle(p, q, r)
    triangle(p, r, s)
  }
  const onSurface = (u: number, v: number) => [R * Math.sin(u / R), v, R * Math.cos(u / R)]
  for (let j = 0; j < columns.length - 1; j++) {
    if (Math.abs(columns[j]) > SA + 1e-6 || Math.abs(columns[j + 1]) > SA + 1e-6) continue
    const h0 = slotHalfHeight(columns[j])
    const h1 = slotHalfHeight(columns[j + 1])
    const a0 = onSurface(columns[j], SY - h0)
    const a1 = onSurface(columns[j + 1], SY - h1)
    const c0 = onSurface(columns[j], SY + h0)
    const c1 = onSurface(columns[j + 1], SY + h1)
    const a0b = [a0[0], a0[1], ZB]
    const a1b = [a1[0], a1[1], ZB]
    const c0b = [c0[0], c0[1], ZB]
    const c1b = [c1[0], c1[1], ZB]
    quad(a0, a1, a1b, a0b)
    quad(c0, c0b, c1b, c1)
    quad(a0b, a1b, c1b, c0b)
  }
  const tunnelGeometry = geometry(tunnel)
  const tunnelColors: number[] = []
  for (let j = 2; j < tunnel.length; j += 3) {
    const depth = tunnel[j] <= ZB + 1e-4 ? 1 : 0.1
    tunnelColors.push(depth, depth, depth)
  }
  tunnelGeometry.setAttribute('color', new Float32BufferAttribute(tunnelColors, 3))
  device.add(new Mesh(tunnelGeometry, tunnelMaterial))

  const stadium = (half: number, r: number, round: number, straight: number) => {
    const points: number[][] = []
    for (let i = 0; i < straight; i++)
      points.push([-(half - r) + (2 * (half - r) * i) / straight, SY - r])
    for (let i = 0; i < round; i++) {
      const p = -Math.PI / 2 + (Math.PI * i) / round
      points.push([half - r + r * Math.cos(p), SY + r * Math.sin(p)])
    }
    for (let i = 0; i < straight; i++)
      points.push([half - r - (2 * (half - r) * i) / straight, SY + r])
    for (let i = 0; i < round; i++) {
      const p = Math.PI / 2 + (Math.PI * i) / round
      points.push([-(half - r) + r * Math.cos(p), SY + r * Math.sin(p)])
    }
    return points
  }
  const inner = stadium(SA, SR, 18, 24)
  const outer = stadium(SA + E, SR + E, 18, 24)
  const bezelPositions: number[] = []
  const bezelNormals: number[] = []
  const bezelIndex: number[] = []
  for (let j = 0; j < inner.length; j++) {
    bend(inner[j][0], inner[j][1], R + 0.004, bezelPositions, bezelNormals)
    bend(outer[j][0], outer[j][1], R + 0.004, bezelPositions, bezelNormals)
  }
  for (let j = 0; j < inner.length; j++) {
    const k = (j + 1) % inner.length
    bezelIndex.push(2 * j, 2 * j + 1, 2 * k + 1, 2 * j, 2 * k + 1, 2 * k)
  }
  const bezel = new Mesh(geometry(bezelPositions, bezelNormals, bezelIndex), bezelMaterial)
  bezel.receiveShadow = true
  device.add(bezel)

  // Lichtring: am Einschub unterbrochen, als Lichtquelle heller als Weiß (überstrahlt im Bild).
  const ringStart = (SA + E) / R + 0.012
  const ringGeometry = new CylinderGeometry(
    R + 0.003,
    R + 0.003,
    0.036,
    128,
    1,
    true,
    ringStart,
    Math.PI * 2 - 2 * ringStart,
  )
  ringGeometry.translate(0, RINGY, 0)
  const ringColor = hdr ? new Color(1.4, 3.9, 5.6).multiplyScalar(1.25) : new Color(0.55, 0.9, 1.0)
  const ringMaterial = new MeshBasicMaterial({ color: ringColor.clone(), fog: false })
  device.add(new Mesh(ringGeometry, ringMaterial))

  // Anzeige des Geräts in drei Zuständen: Start, Messung, Ergebnis.
  const font = (weight: number, size: number) => `${weight} ${size}px ${fontFamily}`
  const fit = (
    x: CanvasRenderingContext2D,
    text: string,
    weight: number,
    size: number,
    width: number,
  ) => {
    let current = size
    x.font = font(weight, current)
    while (current > 11 && x.measureText(text).width > width) {
      current -= 1
      x.font = font(weight, current)
    }
  }
  const startWords = labels.start.trim().split(/\s+/)
  const startLines =
    startWords.length > 1 ? [startWords[0], startWords.slice(1).join(' ')] : [labels.start.trim()]
  const display = painted(
    512,
    512,
    (x, w, h, state: number, progress: number) => {
      const cx = w / 2
      const cy = h / 2
      x.fillStyle = '#000'
      x.fillRect(0, 0, w, h)
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      if (state === 0) {
        x.strokeStyle = '#17283a'
        x.lineWidth = 3
        x.beginPath()
        x.arc(cx, cy, 172, 0, Math.PI * 2)
        x.stroke()
        const fill = x.createLinearGradient(0, cy - 100, 0, cy + 100)
        fill.addColorStop(0, '#2478c9')
        fill.addColorStop(1, '#0d3f7a')
        x.fillStyle = fill
        x.beginPath()
        x.arc(cx, cy, 100, 0, Math.PI * 2)
        x.fill()
        x.fillStyle = '#fff'
        const longest = startLines.reduce((a, b) => (a.length >= b.length ? a : b))
        fit(x, longest, 600, 30, 164)
        if (startLines.length > 1) {
          x.fillText(startLines[0], cx, cy - 18)
          x.fillText(startLines[1], cx, cy + 20)
        } else {
          x.fillText(startLines[0], cx, cy + 1)
        }
        x.fillStyle = '#8fd8fb'
        x.font = font(500, 20)
        x.fillText('IglooPro', cx, 104)
      } else if (state === 1) {
        x.strokeStyle = '#12283b'
        x.lineWidth = 12
        x.beginPath()
        x.arc(cx, cy, 158, 0, Math.PI * 2)
        x.stroke()
        const stroke = x.createLinearGradient(cx - 160, 0, cx + 160, 0)
        stroke.addColorStop(0, '#02a6e3')
        stroke.addColorStop(1, '#8fd8fb')
        x.strokeStyle = stroke
        x.lineCap = 'round'
        x.beginPath()
        x.arc(cx, cy, 158, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.004, progress))
        x.stroke()
        x.fillStyle = '#fff'
        x.font = font(300, 76)
        x.fillText(`${Math.round(progress * 100)} %`, cx, cy - 12)
        x.fillStyle = '#9fb6cc'
        fit(x, labels.running, 500, 20, 250)
        x.fillText(labels.running, cx, cy + 52)
      } else {
        x.fillStyle = '#fff'
        fit(x, labels.analyte, 600, 26, 300)
        x.fillText(labels.analyte, cx, 112)
        x.fillStyle = '#57c7b6'
        x.beginPath()
        x.arc(cx, cy + 6, 108, 0, Math.PI * 2)
        x.fill()
        x.fillStyle = '#fff'
        x.font = font(600, 88)
        x.fillText(RESULT.value, cx - 14, cy - 8)
        x.font = font(500, 20)
        x.fillText(RESULT.unit, cx + 66, cy - 26)
        fit(x, labels.verdict, 600, 24, 170)
        x.fillText(labels.verdict, cx, cy + 56)
        x.fillStyle = '#c9d6e2'
        fit(x, labels.range, 400, 17, 300)
        x.fillText(labels.range, cx, 398)
        x.font = font(400, 17)
        x.fillText(RESULT.range, cx, 420)
      }
    },
    0,
    0,
  )
  const glassGeometry = new CircleGeometry(RG + 0.002, 96)
  glassGeometry.rotateX(-Math.PI / 2)
  glassGeometry.translate(0, H - 0.002, 0)
  const glassMaterial = new MeshStandardMaterial({
    color: 0x06080a,
    roughness: 0.07,
    metalness: 0,
    envMap: environment,
    envMapIntensity: 0.6,
    emissive: 0xffffff,
    emissiveMap: display.texture,
    emissiveIntensity: 1.0,
  })
  const glass = new Mesh(glassGeometry, glassMaterial)
  glass.castShadow = true
  device.add(glass)

  // Adapter mit Testkassette, nach dem Tutorial des Herstellers.
  const slab = (width: number, length: number, thickness: number, r: number, bevel: number) => {
    const shape = new Shape()
    const x = -width / 2
    const y = -length / 2
    shape.moveTo(x + r, y)
    shape.lineTo(x + width - r, y)
    shape.quadraticCurveTo(x + width, y, x + width, y + r)
    shape.lineTo(x + width, y + length - r)
    shape.quadraticCurveTo(x + width, y + length, x + width - r, y + length)
    shape.lineTo(x + r, y + length)
    shape.quadraticCurveTo(x, y + length, x, y + length - r)
    shape.lineTo(x, y + r)
    shape.quadraticCurveTo(x, y, x + r, y)
    const g = new ExtrudeGeometry(shape, {
      depth: thickness - 2 * bevel,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: -bevel,
      bevelSegments: 3,
      curveSegments: 10,
      steps: 1,
    })
    const position = g.getAttribute('position')
    const uv: number[] = []
    for (let i = 0; i < position.count; i++)
      uv.push((position.getX(i) + width / 2) / width, (position.getY(i) + length / 2) / length)
    g.setAttribute('uv', new Float32BufferAttribute(uv, 2))
    g.translate(0, 0, bevel)
    g.rotateX(-Math.PI / 2)
    return g
  }
  const codePattern = (x: CanvasRenderingContext2D, px: number, py: number, size: number) => {
    const n = 15
    const cell = size / n
    let seed = 7
    x.fillStyle = '#fff'
    x.fillRect(px - 6, py - 6, size + 12, size + 12)
    x.fillStyle = '#20262c'
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        if ((i < 6 && j < 6) || (i < 6 && j > n - 7) || (i > n - 7 && j < 6)) continue
        if (seed % 100 < 46) x.fillRect(px + j * cell, py + i * cell, cell + 0.5, cell + 0.5)
      }
    const finder = (ix: number, iy: number) => {
      x.fillStyle = '#20262c'
      x.fillRect(px + ix * cell, py + iy * cell, 5 * cell, 5 * cell)
      x.fillStyle = '#fff'
      x.fillRect(px + (ix + 1) * cell, py + (iy + 1) * cell, 3 * cell, 3 * cell)
      x.fillStyle = '#20262c'
      x.fillRect(px + (ix + 2) * cell, py + (iy + 2) * cell, cell, cell)
    }
    finder(0, 0)
    finder(n - 5, 0)
    finder(0, n - 5)
  }
  const CASSETTE_HEIGHT = 832
  const WELL_Y = 676
  const cassette = painted(
    256,
    CASSETTE_HEIGHT,
    (x, w, h, red: number, lines: number) => {
      x.fillStyle = '#eef0f2'
      x.fillRect(0, 0, w, h)
      codePattern(x, 80, 60, 96)
      x.fillStyle = '#dfe6e6'
      x.strokeStyle = '#aab3bd'
      x.lineWidth = 3
      x.beginPath()
      x.rect(96, 300, 64, 200)
      x.fill()
      x.stroke()
      x.fillStyle = '#f7f9f9'
      x.fillRect(104, 308, 48, 184)
      x.strokeStyle = '#b23a4c'
      x.globalAlpha = lines
      x.lineWidth = 7
      x.lineCap = 'round'
      x.beginPath()
      x.moveTo(110, 356)
      x.lineTo(146, 356)
      x.stroke()
      x.beginPath()
      x.moveTo(110, 430)
      x.lineTo(146, 430)
      x.stroke()
      x.globalAlpha = 1
      x.fillStyle = '#7b8794'
      x.font = font(600, 22)
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      x.fillText('C', 70, 356)
      x.fillText('T', 70, 430)
      x.fillText('S', 196, WELL_Y)
      x.fillStyle = '#d6dce2'
      x.strokeStyle = '#aab3bd'
      x.lineWidth = 3
      x.beginPath()
      x.ellipse(128, WELL_Y, 42, 50, 0, 0, Math.PI * 2)
      x.fill()
      x.stroke()
      x.fillStyle = '#e8ecef'
      x.beginPath()
      x.ellipse(128, WELL_Y, 28, 34, 0, 0, Math.PI * 2)
      x.fill()
      if (red > 0) {
        x.fillStyle = '#aa1c18'
        x.globalAlpha = red
        x.beginPath()
        x.ellipse(128, WELL_Y, 26, 32, 0, 0, Math.PI * 2)
        x.fill()
        x.globalAlpha = 1
      }
    },
    0,
    0,
  )
  const adapterTop = painted(256, 640, (x, w, h) => {
    x.fillStyle = '#1d2125'
    x.fillRect(0, 0, w, h)
    x.strokeStyle = '#59636e'
    x.lineWidth = 5
    x.lineJoin = 'round'
    x.beginPath()
    x.moveTo(128, 30)
    x.lineTo(154, 72)
    x.lineTo(102, 72)
    x.closePath()
    x.stroke()
    x.strokeStyle = '#121518'
    x.lineWidth = 4
    x.strokeRect(58, 164, 140, 424)
  })
  const adapter = new Group()
  device.add(adapter)
  const adapterTopMaterial = new MeshStandardMaterial({
    map: adapterTop.texture,
    roughness: 0.62,
    envMap: environment,
    envMapIntensity: 0.3,
  })
  const adapterSideMaterial = new MeshStandardMaterial({
    color: 0x1a1e22,
    roughness: 0.62,
    envMap: environment,
    envMapIntensity: 0.3,
  })
  adapter.add(
    solid(new Mesh(slab(WA, LA, TA, 0.12, 0.025), [adapterTopMaterial, adapterSideMaterial])),
  )
  const railGeometry = new BoxGeometry(0.075, 0.05, LA - 0.5)
  for (const side of [-1, 1]) {
    const rail = solid(new Mesh(railGeometry, adapterSideMaterial))
    rail.position.set(side * (WA / 2 - 0.07), TA + 0.02, 0.05)
    adapter.add(rail)
  }
  const cassetteTopMaterial = new MeshStandardMaterial({
    map: cassette.texture,
    roughness: 0.42,
    envMap: environment,
    envMapIntensity: 0.3,
  })
  const cassetteSideMaterial = new MeshStandardMaterial({
    color: 0xeceef0,
    roughness: 0.42,
    envMap: environment,
    envMapIntensity: 0.3,
  })
  const cassetteMesh = solid(
    new Mesh(slab(WC, LC, TC, 0.07, 0.02), [cassetteTopMaterial, cassetteSideMaterial]),
  )
  cassetteMesh.position.set(0, TA - 0.045, ZCAS)
  adapter.add(cassetteMesh)
  const cassetteTop = TA - 0.045 + TC
  const wellZ = ZCAS + (WELL_Y / CASSETTE_HEIGHT - 0.5) * LC

  // Blutstropfen.
  const dropProfile: Vector2[] = []
  for (let i = 0; i <= 24; i++) {
    const t = (Math.PI * i) / 24
    dropProfile.push(
      new Vector2(
        Math.sin(t) * Math.pow(Math.sin(t / 2), 1.5) * 0.062 + 1e-5,
        Math.cos(t) * 0.062 * 1.3,
      ),
    )
  }
  const drop = new Mesh(
    new LatheGeometry(dropProfile, 32),
    new MeshPhysicalMaterial({
      color: 0xa81d18,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMap: environment,
      envMapIntensity: 1.4,
      side: DoubleSide,
    }),
  )
  drop.castShadow = true
  adapter.add(drop)

  // Boden: dunkel, mit Schatten; am Desktop liegt darunter eine gedämpfte Spiegelung.
  const floorColor = new Color(0.009, 0.04, 0.075)
  const floorMaterial = new MeshPhongMaterial({
    color: floorColor.clone(),
    specular: 0x000000,
    shininess: 1,
    transparent: true,
    opacity: MIRROR_OPACITY,
  })
  const floor = new Mesh(new PlaneGeometry(160, 160), floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  floor.renderOrder = 1
  scene.add(floor)
  const lightLine = new Group()
  scene.add(lightLine)
  let mirror: Reflector | null = null
  const dropMirror = () => {
    if (mirror) mirror.visible = false
    floorMaterial.transparent = false
    floorMaterial.opacity = 1
    floorMaterial.color.copy(floorColor).multiplyScalar(0.9)
    floorMaterial.needsUpdate = true
  }
  if (hdr && !small) {
    mirror = new Reflector(new PlaneGeometry(40, 40), {
      clipBias: 0.003,
      textureWidth: 1600,
      textureHeight: 1000,
      multisample: 0,
      shader: {
        uniforms: {
          color: { value: null },
          tDiffuse: { value: null },
          textureMatrix: { value: null },
          px: { value: new Vector2(1 / 1600, 1 / 1000) },
        },
        vertexShader: MIRROR_VERTEX,
        fragmentShader: MIRROR_FRAGMENT,
      },
    })
    mirror.rotation.x = -Math.PI / 2
    mirror.position.y = -0.003
    scene.add(mirror)
    // Die Lichtlinie spiegelt sich nicht im Boden: sie bleibt die eine Linie im Bild.
    const reflector = mirror
    const renderReflection = reflector.onBeforeRender
    reflector.onBeforeRender = (...args) => {
      lightLine.visible = false
      renderReflection.apply(reflector, args)
      lightLine.visible = true
    }
  } else {
    dropMirror()
  }
  const contactShadow = painted(128, 128, (x, w, h) => {
    const fill = x.createRadialGradient(w / 2, h / 2, 6, w / 2, h / 2, w / 2)
    fill.addColorStop(0, 'rgba(0,0,0,.7)')
    fill.addColorStop(0.5, 'rgba(0,0,0,.25)')
    fill.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = fill
    x.fillRect(0, 0, w, h)
  })
  const contact = new Mesh(
    new PlaneGeometry(3.1, 3.1),
    new MeshBasicMaterial({
      map: contactShadow.texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  )
  contact.rotation.x = -Math.PI / 2
  contact.position.y = 0.004
  contact.renderOrder = 2
  scene.add(contact)
  // Lichtschein des Rings auf dem Boden.
  const glowGradient = painted(256, 256, (x, w, h) => {
    const fill = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    fill.addColorStop(0, 'rgba(255,255,255,.9)')
    fill.addColorStop(0.36, 'rgba(255,255,255,.9)')
    fill.addColorStop(0.52, 'rgba(255,255,255,.34)')
    fill.addColorStop(0.75, 'rgba(255,255,255,.09)')
    fill.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = fill
    x.fillRect(0, 0, w, h)
  })
  const glowMaterial = new MeshBasicMaterial({
    color: new Color(0.02, 0.16, 0.3).multiplyScalar(1.2),
    map: glowGradient.texture,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    fog: false,
  })
  const glow = new Mesh(new PlaneGeometry(5.6, 5.6), glowMaterial)
  glow.rotation.x = -Math.PI / 2
  glow.position.y = 0.006
  glow.renderOrder = 3
  scene.add(glow)

  // Lichtlinie auf Ringhöhe: schließt links und rechts an den Ring an, der Einschub bleibt frei
  // (Owner 2026-11-12).
  const beamGradient = painted(256, 4, (x, w, h) => {
    const fill = x.createLinearGradient(0, 0, w, 0)
    fill.addColorStop(0, 'rgba(255,255,255,1)')
    fill.addColorStop(0.05, 'rgba(255,255,255,.62)')
    fill.addColorStop(0.14, 'rgba(255,255,255,.36)')
    fill.addColorStop(0.6, 'rgba(255,255,255,.22)')
    fill.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = fill
    x.fillRect(0, 0, w, h)
  })
  const BEAM_LENGTH = 30
  const beamMaterial = new MeshBasicMaterial({
    color: hdr ? new Color(2.6, 5.6, 7.6).multiplyScalar(1.25) : new Color(0.6, 0.92, 1.0),
    map: beamGradient.texture,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    fog: false,
  })
  for (const side of [-1, 1]) {
    const beam = new Mesh(new PlaneGeometry(BEAM_LENGTH, 0.03), beamMaterial)
    beam.position.set(side * (R + BEAM_LENGTH / 2), RINGY, 0)
    beam.scale.x = side
    lightLine.add(beam)
  }
  const pulseGradient = painted(128, 16, (x, w, h) => {
    const fill = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    fill.addColorStop(0, 'rgba(255,255,255,1)')
    fill.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = fill
    x.fillRect(0, 0, w, h)
  })
  const pulseMaterial = new MeshBasicMaterial({
    color: new Color(5, 7, 8),
    map: pulseGradient.texture,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    fog: false,
  })
  const pulse = new Mesh(new PlaneGeometry(2.4, 0.06), pulseMaterial)
  pulse.position.set(0, RINGY, 0.005)
  lightLine.add(pulse)

  // Nachbearbeitung: Überstrahlen in fünf Stufen, filmische Tonwertkurve, Vignette.
  const fullscreen = (fragmentShader: string, uniforms: Record<string, IUniform>) =>
    new ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    })
  const brightPass = fullscreen(BRIGHT_FRAGMENT, {
    t: { value: null },
    px: { value: new Vector2() },
    th: { value: BLOOM_THRESHOLD },
  })
  const downPass = fullscreen(DOWN_FRAGMENT, { t: { value: null }, px: { value: new Vector2() } })
  const blurPass = fullscreen(BLUR_FRAGMENT, { t: { value: null }, dir: { value: new Vector2() } })
  const finalPass = fullscreen(FINAL_FRAGMENT, {
    tS: { value: null },
    t0: { value: null },
    t1: { value: null },
    t2: { value: null },
    t3: { value: null },
    t4: { value: null },
    strength: { value: hdr ? BLOOM : 0 },
    exposure: { value: EXPOSURE },
    vig: { value: VIGNETTE },
  })
  const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const quadScene = new Scene()
  const quadMesh = new Mesh(new PlaneGeometry(2, 2), finalPass)
  quadMesh.frustumCulled = false
  quadScene.add(quadMesh)
  const runPass = (material: ShaderMaterial, target: WebGLRenderTarget | null) => {
    quadMesh.material = material
    renderer.setRenderTarget(target)
    renderer.render(quadScene, quadCamera)
  }
  const LEVELS = 5
  type Level = { a: WebGLRenderTarget; b: WebGLRenderTarget; w: number; h: number }
  let sceneTarget: WebGLRenderTarget | null = null
  let levels: Level[] = []
  let bufferWidth = 2
  let bufferHeight = 2
  const textureType = hdr ? HalfFloatType : UnsignedByteType
  const bloomTarget = (w: number, h: number) =>
    new WebGLRenderTarget(Math.max(2, w), Math.max(2, h), {
      type: textureType,
      depthBuffer: false,
      stencilBuffer: false,
    })
  const releaseTargets = () => {
    sceneTarget?.dispose()
    for (const level of levels) {
      level.a.dispose()
      level.b.dispose()
    }
    levels = []
  }
  const allocate = (width: number, height: number) => {
    releaseTargets()
    sceneTarget = new WebGLRenderTarget(width, height, { type: textureType, samples: 4 })
    // Ohne Gleitkomma-Ziel wird sRGB-kodiert gespeichert, damit dunkle Verläufe nicht stufen.
    if (!hdr) sceneTarget.texture.colorSpace = SRGBColorSpace
    bufferWidth = width
    bufferHeight = height
    let w = width
    let h = height
    for (let n = 0; n < LEVELS; n++) {
      w = Math.floor(w / 2)
      h = Math.floor(h / 2)
      levels.push({
        a: bloomTarget(w, h),
        b: bloomTarget(w, h),
        w: Math.max(2, w),
        h: Math.max(2, h),
      })
    }
  }
  const draw = () => {
    if (!sceneTarget) return
    renderer.setRenderTarget(sceneTarget)
    renderer.render(scene, camera)
    let previousWidth = bufferWidth
    let previousHeight = bufferHeight
    for (let n = 0; hdr && n < LEVELS; n++) {
      const level = levels[n]
      const source = n === 0 ? brightPass : downPass
      source.uniforms.t.value = n === 0 ? sceneTarget.texture : levels[n - 1].a.texture
      source.uniforms.px.value.set(1 / previousWidth, 1 / previousHeight)
      runPass(source, level.a)
      blurPass.uniforms.t.value = level.a.texture
      blurPass.uniforms.dir.value.set(1 / level.w, 0)
      runPass(blurPass, level.b)
      blurPass.uniforms.t.value = level.b.texture
      blurPass.uniforms.dir.value.set(0, 1 / level.h)
      runPass(blurPass, level.a)
      previousWidth = level.w
      previousHeight = level.h
    }
    finalPass.uniforms.tS.value = sceneTarget.texture
    for (let n = 0; n < LEVELS; n++) finalPass.uniforms[`t${n}`].value = levels[n].a.texture
    runPass(finalPass, null)
  }

  let pinWidth = 1
  let pinHeight = 1
  let box = 500
  let mobile = false
  let offsetX = 0
  let offsetY = 0
  let lineY = 0
  let quality = 1
  const target = new Vector3()
  const probe = new Vector3()
  const drawingSize = new Vector2()
  const sample = (progress: number) => {
    const keys = mobile ? KEYS_MOBILE : KEYS_DESKTOP
    const last = keys.length - 1
    let from = 0
    while (from < last - 1 && progress > keys[from + 1][0]) from++
    const eased = smooth((progress - keys[from][0]) / (keys[from + 1][0] - keys[from][0]))
    return keys[from].slice(1).map((value, index) => lerp(value, keys[from + 1][index + 1], eased))
  }
  // Der Lichtring bleibt auf einer festen Bildhöhe: die Lichtlinie steht still, das Gerät bewegt
  // sich um sie.
  const place = () => {
    camera.setViewOffset(pinWidth, pinHeight, offsetX, offsetY, pinWidth, pinHeight)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    probe.set(0, RINGY, 0).project(camera)
    camera.setViewOffset(
      pinWidth,
      pinHeight,
      offsetX,
      offsetY + (((1 - probe.y) / 2) * pinHeight - lineY),
      pinWidth,
      pinHeight,
    )
    camera.updateProjectionMatrix()
  }
  const pose = (progress: number, time: number, pointerX: number, pointerY: number) => {
    const [turn, elevation, scale, tx, ty, tz] = sample(progress)
    const yaw = turn + 0.03 * Math.sin(time * 0.5) + pointerX * 0.14
    const height = elevation - pointerY * 0.05
    const distance = (H * pinHeight) / (2 * Math.tan((FOV * Math.PI) / 360) * scale * box)
    fog.near = distance + 5
    fog.far = distance + 36
    device.rotation.y = yaw
    target.set(tx, ty, tz)
    camera.position.set(
      target.x,
      target.y + distance * Math.sin(height),
      target.z + distance * Math.cos(height),
    )
    camera.lookAt(target)
  }
  const resize = () => {
    const width = pin.clientWidth
    const height = pin.clientHeight
    if (!width || !height) return
    // Auflösung im Pixelbudget; läuft es auf einem Gerät zu langsam, sinkt `quality` schrittweise.
    renderer.setPixelRatio(
      Math.min(
        small ? 1.5 : 2,
        window.devicePixelRatio || 1,
        Math.sqrt((small ? 1.5e6 : 3.2e6) / (width * height)),
      ) * quality,
    )
    renderer.setSize(width, height, false)
    renderer.getDrawingBufferSize(drawingSize)
    allocate(drawingSize.x, drawingSize.y)
    const pinBounds = pin.getBoundingClientRect()
    const viewBounds = views.getBoundingClientRect()
    const viewTop = viewBounds.top - pinBounds.top
    pinWidth = width
    pinHeight = height
    box = viewBounds.height || 400
    mobile = width <= 900
    camera.aspect = width / height
    offsetX = width / 2 - (viewBounds.left - pinBounds.left + viewBounds.width / 2)
    offsetY = height / 2 - (viewTop + viewBounds.height / 2)
    lineY = mobile ? viewTop + viewBounds.height * 0.62 : height * 0.6
    // Am Desktop steht der Text über der Lichtlinie und der Knopf darunter; verschoben wird nur
    // per Transformation, damit sich beim Einblenden nichts im Layout verschiebt.
    const shift =
      !mobile && phases ? lineY - 13 - (offsetWithin(phases, pin) + phases.offsetHeight) : 0
    pin.style.setProperty('--sc025-copy-shift', `${Math.round(shift)}px`)
    for (const phase of Array.from(phases?.children ?? [])) {
      if (!(phase instanceof HTMLElement)) continue
      const first = phase.firstElementChild
      const last = phase.lastElementChild
      const content =
        first instanceof HTMLElement && last instanceof HTMLElement
          ? last.offsetTop + last.offsetHeight - first.offsetTop
          : phase.offsetHeight
      const down = mobile ? 0 : Math.round((phase.offsetHeight - content) / 2) - 9
      phase.style.setProperty('--sc025-phase-shift', `${down}px`)
    }
    // Die Seitenlinie entspringt dem Gerät auf Höhe des Lichtrings.
    views.dataset.ringLine = ((lineY - viewTop) / (viewBounds.height || 1)).toFixed(4)
  }

  let displayState = -1
  let displayPercent = -1
  let soakStep = -1
  let lineStep = -1
  let pointerTargetX = 0
  let pointerTargetY = 0
  let pointerX = 0
  let pointerY = 0
  let eased = -1
  let running = false
  let disposed = false
  let frameId = 0
  let slowFrames = 0
  let lastFrame = 0
  const startedAt = performance.now()
  const scrollProgress = () => {
    const range = Math.max(1, section.offsetHeight - window.innerHeight)
    return clamp01((window.scrollY - section.offsetTop) / range)
  }
  const frame = (now: number) => {
    frameId = 0
    if (disposed) return
    const time = (now - startedAt) / 1000
    const delta = now - lastFrame
    lastFrame = now
    if (delta < 200) {
      slowFrames = delta > 26 ? slowFrames + 1 : Math.max(0, slowFrames - 1)
      if (slowFrames > 45 && quality > 0.56) {
        quality *= 0.8
        slowFrames = 0
        if (quality < 0.7 && mirror?.visible) dropMirror()
        resize()
      }
    }
    const progress = scrollProgress()
    eased = eased < 0 ? progress : eased + (progress - eased) * 0.14
    pointerX += (pointerTargetX - pointerX) * 0.06
    pointerY += (pointerTargetY - pointerY) * 0.06
    pose(eased, time, pointerX, pointerY)
    place()

    // Der Tropfen fällt und wird aufgenommen; der Adapter fährt mit dem Pfeil voran ein und
    // bleibt während der Messung stecken.
    const fall = clamp01((eased - 0.03) / 0.085)
    const soak = smooth((eased - 0.115) / 0.05)
    const inserted = smooth((eased - 0.17) / 0.13)
    const hover = 0.03 * Math.sin(time * 1.6) * (1 - clamp01(eased / 0.03))
    drop.position.set(0, cassetteTop + 0.085 + (1 - fall * fall) * 1.55 + hover, wellZ)
    drop.scale.set(1 + soak * 0.6, Math.max(0.001, 1 - soak), 1 + soak * 0.6)
    drop.visible = soak < 0.999
    const nextSoak = Math.round(soak * 8)
    const nextLines = eased > 0.6 ? 1 : 0
    if (nextSoak !== soakStep || nextLines !== lineStep) {
      soakStep = nextSoak
      lineStep = nextLines
      cassette.redraw(nextSoak / 8, nextLines)
    }
    adapter.position.set(
      0,
      SY - SR + 0.028 + 0.02 * Math.sin(time * 1.2) * (1 - inserted),
      lerp(2.75, 0.82, inserted),
    )
    adapter.rotation.x = -0.05 * (1 - inserted)

    // Anzeige, Lichtring und Licht im Einschub.
    const state = eased < 0.31 ? 0 : eased < 0.655 ? 1 : 2
    const measured = clamp01((eased - 0.36) / 0.26)
    const percent = state === 1 ? Math.round(measured * 100) : 0
    if (state !== displayState || percent !== displayPercent) {
      displayState = state
      displayPercent = percent
      display.redraw(state, measured)
    }
    const flash = state === 2 ? Math.exp(-Math.pow((eased - 0.67) / 0.03, 2)) : 0
    const busy = state === 1 ? 1 : 0
    const beat = 0.5 + 0.5 * Math.sin(time * 5)
    glassMaterial.emissiveIntensity = 1.0 + flash * 1.4
    tunnelMaterial.color.copy(tunnelOff).lerp(tunnelOn, busy * (0.55 + 0.35 * Math.sin(time * 7)))
    slotLight.intensity = busy * (1.1 + 0.6 * Math.sin(time * 7)) * SLOT_LIGHT
    const ring = 1 + busy * 0.55 * beat + flash * 0.9
    ringMaterial.color.copy(ringColor).multiplyScalar(ring)
    glowMaterial.opacity = Math.min(1, 0.7 * ring)
    ringLight.intensity = RING_LIGHT * ring
    const sweep = (time % 4.2) / 4.2
    pulse.position.x = lerp(-13, 13, sweep)
    pulseMaterial.opacity = Math.sin(sweep * Math.PI)

    draw()
    if (running) frameId = window.requestAnimationFrame(frame)
  }
  const start = () => {
    if (running || disposed) return
    running = true
    lastFrame = performance.now()
    if (!frameId) frameId = window.requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const bounds = pin.getBoundingClientRect()
    pointerTargetX = (event.clientX - bounds.left) / bounds.width - 0.5
    pointerTargetY = (event.clientY - bounds.top) / bounds.height - 0.5
  }
  const onPointerLeave = () => {
    pointerTargetX = 0
    pointerTargetY = 0
  }
  const repaint = () => {
    displayState = -1
    soakStep = -1
    lineStep = -1
  }
  const onContextLost = (event: Event) => {
    event.preventDefault()
    stop()
    options.onLost?.()
  }

  resize()
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null
  resizeObserver?.observe(pin)
  window.addEventListener('resize', resize)
  section.addEventListener('pointermove', onPointerMove)
  section.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('webglcontextlost', onContextLost)
  const visibility =
    'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) start()
            else stop()
          }
        })
      : null
  if (visibility) visibility.observe(section)
  else start()
  // Die Beschriftungen nutzen die Schrift der Seite; ist sie nachgeladen, wird neu gezeichnet.
  void document.fonts?.ready.then(() => {
    if (disposed) return
    repaint()
    resize()
  })
  // Erstes Bild sofort, damit die Bühne beim Einblenden nicht leer ist.
  frame(performance.now())

  return {
    dispose: () => {
      disposed = true
      stop()
      window.cancelAnimationFrame(frameId)
      resizeObserver?.disconnect()
      visibility?.disconnect()
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      pin.style.removeProperty('--sc025-copy-shift')
      for (const phase of Array.from(phases?.children ?? []))
        if (phase instanceof HTMLElement) phase.style.removeProperty('--sc025-phase-shift')
      delete views.dataset.ringLine
      const materials = new Set<Material>()
      for (const root of [scene, studio, quadScene]) {
        root.traverse((object) => {
          if (!(object instanceof Mesh)) return
          object.geometry.dispose()
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material])
            materials.add(material)
        })
      }
      for (const material of [brightPass, downPass, blurPass, finalPass]) materials.add(material)
      for (const material of materials) material.dispose()
      for (const texture of textures) texture.dispose()
      mirror?.dispose()
      environmentTarget.dispose()
      releaseTargets()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
