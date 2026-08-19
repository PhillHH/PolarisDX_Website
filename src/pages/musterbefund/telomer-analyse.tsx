/**
 * Routenmodul fuer /epigenetics/musterbefund/telomer-analyse.
 *
 * Es importiert AUSSCHLIESSLICH seine beiden Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in beiden Sprachen in
 * einen gemeinsamen zu packen — vorher 287 KB fuer 24 KB Anzeige.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/telomer-analyse.de.json'
import en from '../../content/befunde/telomer-analyse.en.json'
import type { Befund } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const TelomerAnalyse = () => (
  <MusterbefundPage slug="telomer-analyse" befunde={{ de: de as Befund, en: en as Befund }} />
)

export default TelomerAnalyse
