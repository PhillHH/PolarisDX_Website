/**
 * Routenmodul für /articles/was-ist-epigenetik (SC-031, Owner 2026-11-18).
 *
 * Es kennt ausschließlich seine zehn Textdateien, jede als eigener dynamischer Import: Vite legt je
 * Sprache einen eigenen Chunk an. Der Server lädt alle zehn, der Browser nur die Sprache aus der
 * URL — dasselbe Muster wie bei den Musterbefunden (AP25 PT25.2, PERF-B03).
 *
 * `loadRoute` ist die Fabrik für `React.lazy` in App.tsx: Das Lazy-Promise löst erst auf, wenn die
 * Texte da sind — die Hydration findet exakt den Inhalt des SSR-HTML vor. Bewusst kein `await` auf
 * Modulebene (siehe `pages/musterbefund/*`).
 */

import type { ComponentType } from 'react'
import ExplainerArticle from '../../components/explainer/ExplainerArticle'
import { loadExplainerContent } from '../../content/articles/was-ist-epigenetik'

export const loadRoute = async (): Promise<{ default: ComponentType }> => {
  const contentByLocale = await loadExplainerContent({
    de: () => import('../../content/articles/was-ist-epigenetik/de.json'),
    en: () => import('../../content/articles/was-ist-epigenetik/en.json'),
    pl: () => import('../../content/articles/was-ist-epigenetik/pl.json'),
    fr: () => import('../../content/articles/was-ist-epigenetik/fr.json'),
    it: () => import('../../content/articles/was-ist-epigenetik/it.json'),
    es: () => import('../../content/articles/was-ist-epigenetik/es.json'),
    pt: () => import('../../content/articles/was-ist-epigenetik/pt.json'),
    da: () => import('../../content/articles/was-ist-epigenetik/da.json'),
    nl: () => import('../../content/articles/was-ist-epigenetik/nl.json'),
    cs: () => import('../../content/articles/was-ist-epigenetik/cs.json'),
  })
  const WasIstEpigenetik = () => <ExplainerArticle contentByLocale={contentByLocale} />
  return { default: WasIstEpigenetik }
}
