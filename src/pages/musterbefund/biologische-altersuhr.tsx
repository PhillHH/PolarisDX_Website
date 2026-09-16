/**
 * Routenmodul fuer /epigenetics/musterbefund/biologische-altersuhr.
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
  const befunde = await loadBefundFamily('biologische-altersuhr', {
    de: () => import('../../content/befunde/biologische-altersuhr.de.json'),
    en: () => import('../../content/befunde/biologische-altersuhr.en.json'),
    pl: () => import('../../content/befunde/biologische-altersuhr.pl.json'),
    fr: () => import('../../content/befunde/biologische-altersuhr.fr.json'),
    it: () => import('../../content/befunde/biologische-altersuhr.it.json'),
    es: () => import('../../content/befunde/biologische-altersuhr.es.json'),
    pt: () => import('../../content/befunde/biologische-altersuhr.pt.json'),
    da: () => import('../../content/befunde/biologische-altersuhr.da.json'),
    nl: () => import('../../content/befunde/biologische-altersuhr.nl.json'),
    cs: () => import('../../content/befunde/biologische-altersuhr.cs.json'),
  })
  const BiologischeAltersuhr = () => (
    <MusterbefundPage slug="biologische-altersuhr" befunde={befunde} />
  )
  return { default: BiologischeAltersuhr }
}
