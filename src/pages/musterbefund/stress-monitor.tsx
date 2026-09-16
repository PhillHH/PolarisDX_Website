/**
 * Routenmodul fuer /epigenetics/musterbefund/stress-monitor.
 *
 * Es kennt AUSSCHLIESSLICH seine zehn Inhaltsdateien, jede als eigener
 * dynamischer Import: Vite legt je Sprache einen eigenen Chunk an. Der Server
 * laedt alle zehn, der Browser nur die Sprache aus der URL (AP25 PT25.2,
 * PERF-B03).
 *
 * `loadRoute` ist die Fabrik fuer `React.lazy` in App.tsx: das Lazy-Promise
 * loest erst auf, wenn der Inhalt da ist — die Hydration findet exakt den
 * Inhalt des SSR-HTML vor. Bewusst KEIN `await` auf Modulebene: unter `tsx`
 * (Produktionsstart von server.ts) loest ein Modul-`await` in einem dynamisch
 * importierten SSR-Chunk nie auf; gemessen in PT25.2.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import type { ComponentType } from 'react'
import { loadBefundFamily } from '../../content/befunde/model'
import MusterbefundPage from '../MusterbefundPage'

export const loadRoute = async (): Promise<{ default: ComponentType }> => {
  const befunde = await loadBefundFamily('stress-monitor', {
    de: () => import('../../content/befunde/stress-monitor.de.json'),
    en: () => import('../../content/befunde/stress-monitor.en.json'),
    pl: () => import('../../content/befunde/stress-monitor.pl.json'),
    fr: () => import('../../content/befunde/stress-monitor.fr.json'),
    it: () => import('../../content/befunde/stress-monitor.it.json'),
    es: () => import('../../content/befunde/stress-monitor.es.json'),
    pt: () => import('../../content/befunde/stress-monitor.pt.json'),
    da: () => import('../../content/befunde/stress-monitor.da.json'),
    nl: () => import('../../content/befunde/stress-monitor.nl.json'),
    cs: () => import('../../content/befunde/stress-monitor.cs.json'),
  })
  const StressMonitor = () => <MusterbefundPage slug="stress-monitor" befunde={befunde} />
  return { default: StressMonitor }
}
