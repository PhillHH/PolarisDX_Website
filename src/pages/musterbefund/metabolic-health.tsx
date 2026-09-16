/**
 * Routenmodul fuer /epigenetics/musterbefund/metabolic-health.
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
  const befunde = await loadBefundFamily('metabolic-health', {
    de: () => import('../../content/befunde/metabolic-health.de.json'),
    en: () => import('../../content/befunde/metabolic-health.en.json'),
    pl: () => import('../../content/befunde/metabolic-health.pl.json'),
    fr: () => import('../../content/befunde/metabolic-health.fr.json'),
    it: () => import('../../content/befunde/metabolic-health.it.json'),
    es: () => import('../../content/befunde/metabolic-health.es.json'),
    pt: () => import('../../content/befunde/metabolic-health.pt.json'),
    da: () => import('../../content/befunde/metabolic-health.da.json'),
    nl: () => import('../../content/befunde/metabolic-health.nl.json'),
    cs: () => import('../../content/befunde/metabolic-health.cs.json'),
  })
  const MetabolicHealth = () => <MusterbefundPage slug="metabolic-health" befunde={befunde} />
  return { default: MetabolicHealth }
}
