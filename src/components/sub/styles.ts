import frame from './sub.css?url'
import epigenetics from './pages/epigenetics.css?url'
import articles from './pages/articles.css?url'
import diagnostics from './pages/diagnostics.css?url'
import events from './pages/events.css?url'
import service from './pages/service.css?url'

/**
 * SC-028: die Stylesheets der Unterseiten. `frame` (sub.css) trägt jede umgestellte Seite; die
 * übrigen gehören je einer Seitenart und werden nur dort ausgeliefert — das CSS steht inline im
 * HTML, was eine Seite nicht braucht, soll sie nicht laden. `mark` ist die Kennung (Custom
 * Property auf `:root`), die das Blatt setzt: daran erkennt SubPage, ob es schon im Dokument ist.
 */
export const SUB_STYLES = {
  frame: { href: frame, mark: '--sc028-css' },
  epigenetics: { href: epigenetics, mark: '--sc028-epigenetics' },
  articles: { href: articles, mark: '--sc028-articles' },
  diagnostics: { href: diagnostics, mark: '--sc028-diagnostics' },
  events: { href: events, mark: '--sc028-events' },
  service: { href: service, mark: '--sc028-service' },
} as const

export type SubPageStyle = Exclude<keyof typeof SUB_STYLES, 'frame'>
