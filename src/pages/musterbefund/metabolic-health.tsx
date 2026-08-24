/**
 * Routenmodul fuer /epigenetics/musterbefund/metabolic-health.
 *
 * Es importiert AUSSCHLIESSLICH seine beiden Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in beiden Sprachen in
 * einen gemeinsamen zu packen — vorher 287 KB fuer 24 KB Anzeige.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/metabolic-health.de.json'
import en from '../../content/befunde/metabolic-health.en.json'
import type { Befund } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const MetabolicHealth = () => (
  <MusterbefundPage slug="metabolic-health" befunde={{ de: de as Befund, en: en as Befund }} />
)

export default MetabolicHealth
