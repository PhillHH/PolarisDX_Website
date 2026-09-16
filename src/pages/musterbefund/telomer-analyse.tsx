/**
 * Routenmodul fuer /epigenetics/musterbefund/telomer-analyse.
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
  const befunde = await loadBefundFamily('telomer-analyse', {
    de: () => import('../../content/befunde/telomer-analyse.de.json'),
    en: () => import('../../content/befunde/telomer-analyse.en.json'),
    pl: () => import('../../content/befunde/telomer-analyse.pl.json'),
    fr: () => import('../../content/befunde/telomer-analyse.fr.json'),
    it: () => import('../../content/befunde/telomer-analyse.it.json'),
    es: () => import('../../content/befunde/telomer-analyse.es.json'),
    pt: () => import('../../content/befunde/telomer-analyse.pt.json'),
    da: () => import('../../content/befunde/telomer-analyse.da.json'),
    nl: () => import('../../content/befunde/telomer-analyse.nl.json'),
    cs: () => import('../../content/befunde/telomer-analyse.cs.json'),
  })
  const TelomerAnalyse = () => <MusterbefundPage slug="telomer-analyse" befunde={befunde} />
  return { default: TelomerAnalyse }
}
