/**
 * Routenmodul fuer /epigenetics/musterbefund/metabolic-health.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/metabolic-health.de.json'
import en from '../../content/befunde/metabolic-health.en.json'
import pl from '../../content/befunde/metabolic-health.pl.json'
import fr from '../../content/befunde/metabolic-health.fr.json'
import it from '../../content/befunde/metabolic-health.it.json'
import es from '../../content/befunde/metabolic-health.es.json'
import pt from '../../content/befunde/metabolic-health.pt.json'
import da from '../../content/befunde/metabolic-health.da.json'
import nl from '../../content/befunde/metabolic-health.nl.json'
import cs from '../../content/befunde/metabolic-health.cs.json'
import type { BefundSprachen } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const MetabolicHealth = () => (
  <MusterbefundPage
    slug="metabolic-health"
    befunde={{ de, en, pl, fr, it, es, pt, da, nl, cs } as BefundSprachen}
  />
)

export default MetabolicHealth
