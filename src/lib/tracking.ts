/**
 * Ereignis-Schnittstelle der Epigenetik-Strecke — VORBEREITET, NICHT AKTIV.
 *
 * WARUM ES SIE GIBT: der Messplan fuer /epigenetics braucht vier Zahlen —
 * wie oft ein Wertekapitel aufgeklappt wird, wie weit gelesen wird, welches
 * Panel gewaehlt wird und mit welchem Panel angefragt wird. Ohne eine
 * gemeinsame Stelle wuerden diese vier Ereignisse verstreut in den Seiten
 * entstehen, jedes mit eigenem Namen und eigener Nutzlast. Dieses Modul legt
 * Namen und Nutzlast EINMAL fest, damit die Auswertung spaeter ohne Umbau der
 * Seiten angeschlossen werden kann.
 *
 * ES SENDET NICHTS. Zwei Sperren, beide standardmaessig zu:
 *
 *  1. KEIN ANBIETER. Solange niemand `setTrackingProvider` aufruft, ist
 *     `track` eine leere Funktion. Dieses Modul kennt weder Google Analytics
 *     noch den Google Tag Manager, laedt kein Skript, oeffnet keine
 *     Verbindung und schreibt nicht in `window.dataLayer`.
 *  2. KEINE EINWILLIGUNG. Auch mit Anbieter bleibt `track` still, bis
 *     `setTrackingConsent(true)` aufgerufen wurde. Der Ausgangswert ist
 *     `false`, und er wird NICHT gespeichert: kein Cookie, kein
 *     localStorage, kein sessionStorage. Ereignisse, die vor der
 *     Einwilligung entstehen, werden verworfen und nicht zwischengespeichert
 *     — ein Puffer waere bereits eine Vorratsdatenhaltung.
 *
 * WAS NOCH FEHLT, BEVOR HIER ETWAS SCHARFGESCHALTET WERDEN DARF (Veto Rolle 11):
 *  - Datenschutzerklaerung: Nennung des eingesetzten Dienstes, Zweck,
 *    Rechtsgrundlage, Drittlandtransfer, Speicherdauer, Server-Logfiles.
 *  - Ein Einwilligungsdialog, der `setTrackingConsent` bedient und ein
 *    Widerrufen ermoeglicht.
 *  - Auftragsverarbeitungsvertrag und Eintrag im Verarbeitungsverzeichnis.
 * Erst danach darf ein Anbieter registriert werden — und auch dann bleibt die
 * Regel: der Anbieter wird hier registriert, nicht importiert.
 *
 * KEINE PERSONENBEZOGENEN DATEN IN DER NUTZLAST. Die Typen unten lassen nur
 * bekannte Panel-Slugs, Blockkennungen und Zahlen zu. Freitext aus dem
 * Kontaktformular, Namen, E-Mail-Adressen oder die vollstaendige URL gehoeren
 * nicht hierher und sind durch die Typen ausgeschlossen.
 */

import { MERK_SLUGS, type MerkSlug } from './merkliste'

// =============================================================================
// DIE VIER EREIGNISSE
// =============================================================================

/**
 * Aufklapp-Rate je Block: welches Wertekapitel eines Musterbefunds wurde
 * geoeffnet oder wieder geschlossen. `block` ist die Anker-id des Kapitels,
 * also derselbe technische Bezeichner, der bereits in der URL steht.
 */
export interface AufklappEreignis {
  name: 'chapter_toggle'
  panel: MerkSlug
  block: string
  offen: boolean
}

/**
 * Scrolltiefe. Bewusst nur vier Stufen statt eines fortlaufenden Werts: mehr
 * Aufloesung beantwortet keine Frage des Messplans und macht die Bewegung
 * eines einzelnen Besuchers nachvollziehbarer, als sie sein muss.
 */
export type Scrollstufe = 25 | 50 | 75 | 100

export interface ScrolltiefeEreignis {
  name: 'scroll_depth'
  /** 'landing' fuer /epigenetics, sonst der Slug des Musterbefunds. */
  seite: 'landing' | MerkSlug
  stufe: Scrollstufe
}

/**
 * Panel-Auswahl: eines der sechs Panels wurde angesteuert. `weg` sagt, welcher
 * der bestehenden Wege dorthin gefuehrt hat — ohne diese Unterscheidung laesst
 * sich nicht sagen, ob die Vergleichstabelle oder die Kartenliste traegt.
 */
export interface PanelwahlEreignis {
  name: 'panel_select'
  panel: MerkSlug
  weg: 'karte' | 'vergleich' | 'merkliste' | 'befund'
}

/**
 * Anfrage mit Panel-Kontext: der Weg "Angebot anfragen" wurde begonnen.
 * `panels` sind die vorgemerkten Slugs, `quelle` die Seite, von der aus es
 * losging. Das Ereignis meldet den KLICK, nicht den Formularversand — was im
 * Formular steht, geht die Messung nichts an.
 */
export interface AnfrageEreignis {
  name: 'quote_request'
  panels: MerkSlug[]
  quelle: 'landing' | 'befund'
}

/** Genau diese vier Ereignisse kennt die Strecke. */
export type TrackingEreignis =
  | AufklappEreignis
  | ScrolltiefeEreignis
  | PanelwahlEreignis
  | AnfrageEreignis

export type TrackingEreignisName = TrackingEreignis['name']

/** Fuer Testfaelle und fuer die Freigabe: die vier Namen als Liste. */
export const TRACKING_EREIGNISSE = [
  'chapter_toggle',
  'scroll_depth',
  'panel_select',
  'quote_request',
] as const satisfies readonly TrackingEreignisName[]

// =============================================================================
// ANBIETER UND EINWILLIGUNG
// =============================================================================

/**
 * Ein Anbieter ist eine Funktion, die ein fertiges Ereignis entgegennimmt.
 * Mehr verlangt dieses Modul nicht — welche Bibliothek dahinter steht, bleibt
 * seine Sache und bleibt aus diesem Verzeichnis heraus.
 */
export type TrackingProvider = (ereignis: TrackingEreignis) => void

let provider: TrackingProvider | null = null
let einwilligung = false

/**
 * Anbieter registrieren. Ohne Aufruf bleibt `track` ein No-Op.
 *
 * `null` entfernt den Anbieter wieder — der Weg, den ein Widerruf nimmt, wenn
 * der Dienst nicht nur stumm, sondern weg sein soll.
 */
export function setTrackingProvider(next: TrackingProvider | null): void {
  provider = next
}

/**
 * Einwilligung setzen. Ausgangswert ist `false`, und dieser Zustand wird
 * bewusst nirgends abgelegt: er lebt nur im Speicher dieses Tabs. Die
 * dauerhafte Speicherung ist Sache des Einwilligungsdialogs, den es noch nicht
 * gibt — und sie ist selbst eine Frage der Datenschutzerklaerung.
 */
export function setTrackingConsent(erteilt: boolean): void {
  einwilligung = erteilt
}

/** Nur fuer Tests und die Fehlersuche. */
export function trackingAktiv(): boolean {
  return provider !== null && einwilligung
}

// =============================================================================
// SENDEN
// =============================================================================

const istSlug = (v: string): v is MerkSlug => (MERK_SLUGS as readonly string[]).includes(v)

/**
 * Letzte Schranke vor dem Anbieter: nur bekannte Slugs verlassen das Modul.
 * Ein aus der URL oder aus localStorage stammender Fremdwert wuerde sonst als
 * frei waehlbarer Text in einer fremden Auswertung landen.
 */
function nutzlastIstSauber(ereignis: TrackingEreignis): boolean {
  switch (ereignis.name) {
    case 'chapter_toggle':
      return istSlug(ereignis.panel)
    case 'scroll_depth':
      return ereignis.seite === 'landing' || istSlug(ereignis.seite)
    case 'panel_select':
      return istSlug(ereignis.panel)
    case 'quote_request':
      return ereignis.panels.every(istSlug)
  }
}

/**
 * Ereignis melden.
 *
 * Ohne Anbieter, ohne Einwilligung oder ausserhalb des Browsers geschieht
 * nichts — und zwar geraeuschlos: ein Fehler an dieser Stelle wuerde eine
 * Bedienung unterbrechen, die auch ohne Messung funktionieren muss. Aus
 * demselben Grund faengt der Aufruf des Anbieters seine eigenen Fehler ab.
 */
export function track(ereignis: TrackingEreignis): void {
  if (typeof window === 'undefined') return
  if (!provider || !einwilligung) return
  if (!nutzlastIstSauber(ereignis)) return
  try {
    provider(ereignis)
  } catch {
    // Eine kaputte Messung darf die Seite nicht anhalten.
  }
}
