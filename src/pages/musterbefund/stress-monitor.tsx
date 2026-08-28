/**
 * Routenmodul fuer /epigenetics/musterbefund/stress-monitor.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/stress-monitor.de.json'
import en from '../../content/befunde/stress-monitor.en.json'
import pl from '../../content/befunde/stress-monitor.pl.json'
import fr from '../../content/befunde/stress-monitor.fr.json'
import it from '../../content/befunde/stress-monitor.it.json'
import es from '../../content/befunde/stress-monitor.es.json'
import pt from '../../content/befunde/stress-monitor.pt.json'
import da from '../../content/befunde/stress-monitor.da.json'
import nl from '../../content/befunde/stress-monitor.nl.json'
import cs from '../../content/befunde/stress-monitor.cs.json'
import type { BefundSprachen } from '../../content/befunde/meta'
import MusterbefundPage from '../MusterbefundPage'

const StressMonitor = () => (
  <MusterbefundPage
    slug="stress-monitor"
    befunde={{ de, en, pl, fr, it, es, pt, da, nl, cs } as BefundSprachen}
  />
)

export default StressMonitor
