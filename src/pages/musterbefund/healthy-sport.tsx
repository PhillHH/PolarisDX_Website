/**
 * Routenmodul fuer /epigenetics/musterbefund/healthy-sport.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/healthy-sport.de.json'
import en from '../../content/befunde/healthy-sport.en.json'
import pl from '../../content/befunde/healthy-sport.pl.json'
import fr from '../../content/befunde/healthy-sport.fr.json'
import it from '../../content/befunde/healthy-sport.it.json'
import es from '../../content/befunde/healthy-sport.es.json'
import pt from '../../content/befunde/healthy-sport.pt.json'
import da from '../../content/befunde/healthy-sport.da.json'
import nl from '../../content/befunde/healthy-sport.nl.json'
import cs from '../../content/befunde/healthy-sport.cs.json'
import type { BefundSprachen } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const HealthySport = () => (
  <MusterbefundPage
    slug="healthy-sport"
    befunde={{ de, en, pl, fr, it, es, pt, da, nl, cs } as BefundSprachen}
  />
)

export default HealthySport
