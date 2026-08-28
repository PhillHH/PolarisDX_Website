/**
 * Routenmodul fuer /epigenetics/musterbefund/healthy-aging.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/healthy-aging.de.json'
import en from '../../content/befunde/healthy-aging.en.json'
import pl from '../../content/befunde/healthy-aging.pl.json'
import fr from '../../content/befunde/healthy-aging.fr.json'
import it from '../../content/befunde/healthy-aging.it.json'
import es from '../../content/befunde/healthy-aging.es.json'
import pt from '../../content/befunde/healthy-aging.pt.json'
import da from '../../content/befunde/healthy-aging.da.json'
import nl from '../../content/befunde/healthy-aging.nl.json'
import cs from '../../content/befunde/healthy-aging.cs.json'
import type { BefundSprachen } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const HealthyAging = () => (
  <MusterbefundPage
    slug="healthy-aging"
    befunde={{ de, en, pl, fr, it, es, pt, da, nl, cs } as BefundSprachen}
  />
)

export default HealthyAging
