/**
 * Routenmodul fuer /epigenetics/musterbefund/healthy-sport.
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
  const befunde = await loadBefundFamily('healthy-sport', {
    de: () => import('../../content/befunde/healthy-sport.de.json'),
    en: () => import('../../content/befunde/healthy-sport.en.json'),
    pl: () => import('../../content/befunde/healthy-sport.pl.json'),
    fr: () => import('../../content/befunde/healthy-sport.fr.json'),
    it: () => import('../../content/befunde/healthy-sport.it.json'),
    es: () => import('../../content/befunde/healthy-sport.es.json'),
    pt: () => import('../../content/befunde/healthy-sport.pt.json'),
    da: () => import('../../content/befunde/healthy-sport.da.json'),
    nl: () => import('../../content/befunde/healthy-sport.nl.json'),
    cs: () => import('../../content/befunde/healthy-sport.cs.json'),
  })
  const HealthySport = () => <MusterbefundPage slug="healthy-sport" befunde={befunde} />
  return { default: HealthySport }
}
