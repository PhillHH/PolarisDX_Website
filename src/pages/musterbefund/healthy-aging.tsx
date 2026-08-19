/**
 * Routenmodul fuer /epigenetics/musterbefund/healthy-aging.
 *
 * Es importiert AUSSCHLIESSLICH seine beiden Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in beiden Sprachen in
 * einen gemeinsamen zu packen — vorher 287 KB fuer 24 KB Anzeige.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/healthy-aging.de.json'
import en from '../../content/befunde/healthy-aging.en.json'
import type { Befund } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const HealthyAging = () => (
  <MusterbefundPage slug="healthy-aging" befunde={{ de: de as Befund, en: en as Befund }} />
)

export default HealthyAging
