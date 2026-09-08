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
import { defineBefundFamily } from '../../content/befunde/model'
import MusterbefundPage from '../MusterbefundPage'

const befunde = defineBefundFamily('stress-monitor', { de, en, pl, fr, it, es, pt, da, nl, cs })

const StressMonitor = () => <MusterbefundPage slug="stress-monitor" befunde={befunde} />

export default StressMonitor
