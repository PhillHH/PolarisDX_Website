/**
 * Routenmodul fuer /epigenetics/musterbefund/biologische-altersuhr.
 *
 * Es importiert AUSSCHLIESSLICH seine zehn Inhaltsdateien. Dadurch legt Vite
 * je Slug einen eigenen Chunk an, statt alle sechs Panels in einen gemeinsamen
 * Inhalts-Chunk zu packen.
 *
 * Die Seite selbst steht in ../MusterbefundPage; hier kommt nur der Inhalt dazu.
 */

import de from '../../content/befunde/biologische-altersuhr.de.json'
import en from '../../content/befunde/biologische-altersuhr.en.json'
import pl from '../../content/befunde/biologische-altersuhr.pl.json'
import fr from '../../content/befunde/biologische-altersuhr.fr.json'
import it from '../../content/befunde/biologische-altersuhr.it.json'
import es from '../../content/befunde/biologische-altersuhr.es.json'
import pt from '../../content/befunde/biologische-altersuhr.pt.json'
import da from '../../content/befunde/biologische-altersuhr.da.json'
import nl from '../../content/befunde/biologische-altersuhr.nl.json'
import cs from '../../content/befunde/biologische-altersuhr.cs.json'
import { defineBefundFamily } from '../../content/befunde/model'
import MusterbefundPage from '../MusterbefundPage'

const befunde = defineBefundFamily('biologische-altersuhr', {
  de,
  en,
  pl,
  fr,
  it,
  es,
  pt,
  da,
  nl,
  cs,
})

const BiologischeAltersuhr = () => (
  <MusterbefundPage slug="biologische-altersuhr" befunde={befunde} />
)

export default BiologischeAltersuhr
