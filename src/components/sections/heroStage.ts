/**
 * Gemeinsame Klassen der Startseiten-Bühne (SC-020): Folie 1 rendert `HeroSection` serverseitig,
 * Folien 2/3 kommen aus dem nachgeladenen Chunk `HeroSlides`. Die Strings liegen hier einmal im
 * Hauptbündel und wandern als Prop `stage` in den Chunk (hält `home.jsBytes`; kein Export aus dem
 * Hauptbündel, damit die Importnamen der übrigen Seiten-Chunks unverändert bleiben), und es
 * entsteht kein zweites CSS (hält `htmlBytes` auf jeder Seite, weil das App-CSS inline liegt).
 */
export const STAGE = {
  grid: 'mx-auto grid max-w-container gap-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:min-h-[820px] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end lg:gap-16 lg:px-0 lg:pb-32 lg:pt-40',
  column: 'flex min-w-0 flex-col items-start',
  eyebrow:
    'enter inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/25 sm:text-sm',
  title: 'enter mt-7 font-semibold leading-[0.98] tracking-[-0.045em]',
  lead: 'enter mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/85 sm:text-xl',
  actions:
    'enter mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5',
  primary: 'group w-full sm:w-auto',
  ghost:
    'group w-full text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-brand-deep sm:w-auto',
  /** Ein-/Ausblenden von Folie 1 und der Abdunkelung (gleiche Dauer, damit beides zusammen läuft). */
  fade: 'transition-opacity duration-500 motion-reduce:transition-none',
} as const

export type Stage = typeof STAGE
