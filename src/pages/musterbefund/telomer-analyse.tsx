/**
 * Routenmodul fuer /epigenetics/musterbefund/telomer-analyse.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/telomer-analyse.de.json'
import en from '../../content/befunde/telomer-analyse.en.json'
import pl from '../../content/befunde/telomer-analyse.pl.json'
import fr from '../../content/befunde/telomer-analyse.fr.json'
import it from '../../content/befunde/telomer-analyse.it.json'
import es from '../../content/befunde/telomer-analyse.es.json'
import pt from '../../content/befunde/telomer-analyse.pt.json'
import da from '../../content/befunde/telomer-analyse.da.json'
import nl from '../../content/befunde/telomer-analyse.nl.json'
import cs from '../../content/befunde/telomer-analyse.cs.json'
import type { BefundSprachen } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const TelomerAnalyse = () => (
  <MusterbefundPage
    slug="telomer-analyse"
    befunde={{ de, en, pl, fr, it, es, pt, da, nl, cs } as BefundSprachen}
  />
)

export default TelomerAnalyse
