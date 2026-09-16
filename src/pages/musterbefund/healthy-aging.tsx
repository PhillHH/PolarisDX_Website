/**
 * Routenmodul fuer /epigenetics/musterbefund/healthy-aging.
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
  const befunde = await loadBefundFamily('healthy-aging', {
    de: () => import('../../content/befunde/healthy-aging.de.json'),
    en: () => import('../../content/befunde/healthy-aging.en.json'),
    pl: () => import('../../content/befunde/healthy-aging.pl.json'),
    fr: () => import('../../content/befunde/healthy-aging.fr.json'),
    it: () => import('../../content/befunde/healthy-aging.it.json'),
    es: () => import('../../content/befunde/healthy-aging.es.json'),
    pt: () => import('../../content/befunde/healthy-aging.pt.json'),
    da: () => import('../../content/befunde/healthy-aging.da.json'),
    nl: () => import('../../content/befunde/healthy-aging.nl.json'),
    cs: () => import('../../content/befunde/healthy-aging.cs.json'),
  })
  const HealthyAging = () => <MusterbefundPage slug="healthy-aging" befunde={befunde} />
  return { default: HealthyAging }
}
