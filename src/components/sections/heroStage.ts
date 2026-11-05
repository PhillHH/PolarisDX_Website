/**
 * Gemeinsame Klassen der Startseiten-Bühne (SC-021 Nachtrag): Folie 1 rendert `HeroSection`
 * serverseitig auf der Papierfläche, Folien 2/3 kommen aus dem nachgeladenen Chunk `HeroSlides`.
 * Die Strings liegen hier einmal im Hauptbündel und wandern als Prop `stage` in den Chunk
 * (hält `home.jsBytes`; kein zweites CSS, weil das App-CSS inline liegt).
 */
export const STAGE = {
  grid: 'mx-auto grid max-w-container gap-10 px-4 pb-16 pt-page-top sm:px-6 lg:min-h-[600px] lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,1fr)] lg:items-center lg:gap-14 lg:px-0 lg:pb-20 xl:pt-page-top-xl',
  /** Termin-Folie (SC-021 Nachtrag 4, Owner: das MEDICA-Bild darf groesser): rechte Spalte breiter. */
  gridWide:
    'mx-auto grid max-w-container gap-10 px-4 pb-16 pt-page-top sm:px-6 lg:min-h-[600px] lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1.15fr)] lg:items-center lg:gap-14 lg:px-0 lg:pb-20 xl:pt-page-top-xl',
  column: 'flex min-w-0 flex-col items-start [container-type:inline-size]',
  /** Nachtrag 10: die zweizeilige Eyebrow-Zeile entfaellt auf dem Telefon (ruhigere Buehne). */
  eyebrow: 't-eyebrow enter hidden items-center gap-2 sm:flex',
  title: 'enter mt-5 font-semibold leading-[0.98] tracking-[-0.045em] text-heading',
  lead: 't-lead enter mt-6 max-w-xl text-pretty',
  actions:
    'enter mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4',
  primary: 'group w-full sm:w-auto',
  /** Outline-Pille (DESIGN-SYSTEM-CONTRACT §3.4): Rahmen ist Dekor, erkannt wird die Fläche. */
  ghost: 'w-full border border-slate-300 bg-white hover:border-brand-primary sm:w-auto',
  /** Ein-/Ausblenden von Folie 1 (Text und Fotokarte zusammen). */
  fade: 'transition-opacity duration-500 motion-reduce:transition-none',
} as const

export type Stage = typeof STAGE
