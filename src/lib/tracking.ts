/**
 * AP23 PT23.2 — die EINE Grenze, die Geschaeftscode fuer Messung sieht.
 *
 * Vorher gab es drei Wege nebeneinander, alle drei consent-gated, aber ohne
 * gemeinsames Vokabular und ohne gemeinsame Pruefung:
 *
 *  1. `GtmPageview` rief `gtag('event','page_view', …)` direkt auf UND pushte
 *     zusaetzlich `virtual_pageview` in den dataLayer — zwei Ereignisse fuer
 *     einen Seitenwechsel.
 *  2. `pages/consumer/tracking.ts` schrieb selbst in `window.dataLayer`.
 *  3. Dieses Modul war eine Fassade ohne Anbieter: `setTrackingProvider`
 *     wurde nirgends aufgerufen, die vier Epigenetik-Ereignisse liefen ins
 *     Leere.
 *
 * Jetzt kennt der Geschaeftscode genau vier Funktionen — `setTrackingProvider`,
 * `setTrackingConsent`, `trackingActive`, `track` — und keinen Anbieter. Wer
 * `dataLayer` oder `gtag` sagt, steht in `trackingProvider.ts` und nirgendwo
 * sonst; ein Test haelt das fest.
 *
 * AP23 PT23.3 — das Vokabular ist auf die kanonische Taxonomie erweitert:
 * ein Seitenaufruf, sechs Journey-Konversionen, ein Zustellereignis und vier
 * Engagement-Ereignisse. Jede Konversion haengt an einem PERSISTIERTEN
 * Geschaeftszustand, nicht am Klick — die Regel steht bei den Typen.
 *
 * Zwei Sperren bleiben, beide standardmaessig zu:
 *
 *  - **KEIN ANBIETER.** Ohne `setTrackingProvider` ist `track` eine leere
 *    Funktion. Dieses Modul laedt kein Skript und oeffnet keine Verbindung.
 *  - **KEINE EINWILLIGUNG.** Auch mit Anbieter bleibt `track` still, bis
 *    `setTrackingConsent(true)` gerufen wurde. Der Ausgangswert ist `false`
 *    und wird NICHT gespeichert. Ereignisse vor der Einwilligung werden
 *    VERWORFEN und nicht nachgesendet — ein Puffer waere Vorratsdatenhaltung.
 */

import { MERK_SLUGS, type MerkSlug } from './merkliste'

// =============================================================================
// DAS EREIGNISVOKABULAR
// =============================================================================

/** Die Consumer-Landingpages. Stabile Kennungen, keine Uebersetzung. */
export type ConsumerPage = 'spray' | 'masks' | 'duo'

/**
 * Wo ein CTA steht. Bewusst eine Aufzaehlung: vorher floss `cta_label` mit —
 * der UEBERSETZTE Knopftext. In zehn Sprachen ergab dasselbe Ereignis zehn
 * verschiedene Werte, und der Text ist Freitext aus dem Content, der sich mit
 * jeder Redaktion aendert. Der Ort ist die Information, die die Frage
 * beantwortet; die Beschriftung ist es nicht.
 */
export type CtaLocation =
  | 'header'
  | 'header-mobile'
  | 'hero'
  | 'hero-secondary'
  | 'final'
  | 'final-secondary'
  | 'bridge'
  | 'bridge-to-duo'
  | 'audience'
  | 'included-card'
  | '5-pack-offer'

/**
 * Abgeleitet aus den Orten, die im Quellbaum wirklich vorkommen — nicht
 * erfunden. Ein neuer Ort muss hier eingetragen werden; bis dahin wird das
 * Ereignis verworfen, statt einen unbekannten Wert nach draussen zu geben.
 */
export const CTA_LOCATIONS: readonly CtaLocation[] = [
  'header',
  'header-mobile',
  'hero',
  'hero-secondary',
  'final',
  'final-secondary',
  'bridge',
  'bridge-to-duo',
  'audience',
  'included-card',
  '5-pack-offer',
] as const

/**
 * Seitenaufruf.
 *
 * `pfad` ist der PFAD OHNE Query und Fragment — normalisiert in `track()`.
 * Der bisherige Aufruf schickte `window.location.href` samt Query. Die Seite
 * traegt Parameter wie `?panel=`, `?intent=`, `?source=`, und ein Link aus
 * einer Mail kann jeden beliebigen weiteren mitbringen. Was dort steht, hat
 * in einer fremden Auswertung nichts verloren.
 */
export interface SeitenaufrufEreignis {
  name: 'page_view'
  pfad: string
  sprache?: string
  titel?: string
}

/**
 * AP23 PT23.3 — `consumer_page_view` ist ENTFALLEN.
 *
 * Es feuerte beim Mount einer Consumer-Seite, waehrend `page_view` denselben
 * Wechsel bereits meldete: ein Routenwechsel auf /de/consumer/… erzeugte
 * ZWEI Seitenaufruf-Ereignisse. Die Dimension „welche Consumer-Seite" steckt
 * im Pfad und ist daraus ableitbar; ein zweites Ereignis dafuer war eine
 * Doppelzaehlung mit anderem Namen.
 */

/**
 * Klick auf einen Handlungsaufruf.
 *
 * KEINE Konversion — ein Klick sagt nichts darueber, ob etwas entstanden ist.
 * Die Konversionen unten haengen ausnahmslos an einem persistierten Zustand.
 */
export interface CtaKlickEreignis {
  name: 'cta_click'
  /** Wo der Aufruf stand. Aufzaehlung, kein uebersetzter Text. */
  ort: CtaLocation
  /** Optional die Consumer-Seite; auf B2B-Seiten leer. */
  seite?: ConsumerPage
}

export interface ConsumerBestellmodalEreignis {
  name: 'consumer_order_modal_open' | 'consumer_order_modal_close'
  seite: ConsumerPage
  produkt: string
  ort?: CtaLocation
}

/**
 * Bestellanfrage abgeschickt — **Engagement, keine Konversion**.
 *
 * Wird ausschliesslich NACH bestaetigter Persistenz gemeldet (der Aufrufer
 * prueft `res.ok`). Es geht weder Vorgangsnummer noch Kontaktdatum mit —
 * `produkt` und `menge` sind serverseitig allowlistete Bestellfakten.
 *
 * AP23, Stand 2026-09-11: Der Verkauf liegt bei Shopify. Dieses Ereignis
 * misst die ANFRAGE aus der AP22-Journey `consumer_order` (ein Lead), nicht
 * einen Kauf, und wird ausdruecklich nicht als Konversion gefuehrt. Shopifys
 * Kaufereignisse werden hier weder nachgebaut noch gespiegelt.
 */
/**
 * Die Mengen, die die Bestellstrecke kennt. Deckungsgleich mit
 * `ConsumerOrderQuantity` in `src/api/consumerOrder.ts` — bewusst hier noch
 * einmal aufgezaehlt, damit die Fassade nicht am API-Modul haengt; ein Test
 * haelt beide Listen zusammen. `'MORE'` ist eine echte Auswahl, keine Zahl:
 * sie als Zahl zu melden waere erfunden.
 */
export type ConsumerMenge = 1 | 2 | 3 | 'MORE'
export const CONSUMER_MENGEN: readonly ConsumerMenge[] = [1, 2, 3, 'MORE'] as const

export interface ConsumerBestellEreignis {
  name: 'consumer_order_submit'
  seite: ConsumerPage
  produkt: string
  menge: ConsumerMenge
}

/**
 * Die FUENF Journey-Konversionen der Website.
 *
 * **Jede feuert erst nach bestaetigter Persistenz** — also nachdem der Server
 * den Vorgang angenommen (202) und der Client das bestaetigt bekommen hat.
 * Ein Klick auf „Senden" ist keine Konversion: das Formular kann serverseitig
 * scheitern, und ein Ereignis an dieser Stelle haette einen Lead behauptet,
 * den es nie gab. Die Aufrufstellen stehen jeweils IM `result.ok`-Zweig.
 *
 * Es geht ausschliesslich die Journey-Kennung mit — keine Vorgangsnummer,
 * keine Lead-ID, kein Kontaktdatum, kein Freitext. Eine Vorgangsnummer waere
 * ein personenbeziehbarer Schluessel in einer fremden Auswertung.
 *
 * **AP23, Stand 2026-09-11 — `consumer_order_submit` ist KEINE Konversion
 * mehr.** Der Produktverkauf laeuft ueber Shopify; die Website baut dafuer
 * keinen eigenen Bestell-Konversionsweg und dupliziert Shopifys
 * Ecommerce-Ereignisse (`view_item`, `add_to_cart`, `begin_checkout`,
 * `purchase`) ausdruecklich NICHT. Das Ereignis selbst bleibt bestehen und
 * feuert unveraendert nach bestaetigter Persistenz — es misst die
 * Bestell-ANFRAGE der AP22-Journey `consumer_order`, also einen Lead, nicht
 * einen Kauf. Es steht jetzt unter Engagement (siehe dort) und verlangt
 * keinen Conversion-Tag im Container.
 */
export type KonversionsName =
  | 'contact_submit'
  | 'support_submit'
  | 'roi_report_request'
  | 'epigenetics_inquiry_submit'
  | 'lead_magnet_submit'

export const KONVERSIONEN: readonly KonversionsName[] = [
  'contact_submit',
  'support_submit',
  'roi_report_request',
  'epigenetics_inquiry_submit',
  'lead_magnet_submit',
] as const

export interface KontaktKonversionEreignis {
  name: 'contact_submit' | 'support_submit' | 'roi_report_request'
}

export interface EpigenetikKonversionEreignis {
  name: 'epigenetics_inquiry_submit'
  /** Allowlisteter Panel-Slug oder gar nichts. Nie ein Freitext. */
  panel?: MerkSlug
}

export interface LeadMagnetKonversionEreignis {
  name: 'lead_magnet_submit'
  /** Asset-Kennung, keine Datei- oder Titelbezeichnung. */
  asset: string
}

/**
 * Der Download ist WIRKLICH ausgeliefert worden.
 *
 * Bewusst getrennt von `lead_magnet_submit`: das Formular abzuschicken heisst,
 * einen Anspruch bekommen zu haben — nicht, die Datei erhalten zu haben. Ein
 * Anspruch kann abgelaufen, aufgebraucht oder widerrufen sein, und die
 * geschuetzte Auslieferung antwortet dann mit 403/410.
 *
 * Dieses Ereignis darf deshalb NUR nach einer beobachteten
 * HTTP-Erfolgsantwort der geschuetzten Route entstehen. Ein Klick auf den
 * Downloadknopf genuegt nicht.
 */
export interface DownloadZustellEreignis {
  name: 'download_delivered'
  asset: string
  sprache?: string
}

/**
 * Suche.
 *
 * Die eingegebene Zeichenkette geht NICHT mit. Eine Suchanfrage auf einer
 * Diagnostikseite kann ein Krankheitsbild, einen Medikamentennamen oder den
 * Namen einer Praxis enthalten — genau die Daten, die diese Website nicht in
 * eine fremde Auswertung gibt. Gemeldet wird, was die Frage beantwortet, ob
 * die Suche traegt: wie viele Treffer es gab und wie lang die Eingabe war.
 */
export interface SucheEreignis {
  name: 'search'
  treffer: number
  /** Laengenklasse statt Laenge: 1–3, 4–9, 10+ Zeichen. */
  laenge: 'kurz' | 'mittel' | 'lang'
}

/**
 * Klick auf ein Ziel ausserhalb der Website.
 *
 * Nur die Domain, niemals der vollstaendige Link: ein externer Link kann
 * Pfad und Parameter tragen, die eine Person beschreiben (ein geteiltes
 * Dokument, ein Terminlink). Unbekannte Domains werden verworfen statt
 * gemeldet.
 */
export const OUTBOUND_DOMAINS = [
  'instagram.com',
  'linkedin.com',
  'dx365.world',
  'ec.europa.eu',
] as const
export type OutboundDomain = (typeof OUTBOUND_DOMAINS)[number]

export interface OutboundEreignis {
  name: 'outbound_click'
  domain: OutboundDomain
}

/** Aufklapp-Rate je Block eines Musterbefunds. */
export interface AufklappEreignis {
  name: 'chapter_toggle'
  panel: MerkSlug
  block: string
  offen: boolean
}

/** Scrolltiefe in vier Stufen — mehr Aufloesung beantwortet keine Frage. */
export type Scrollstufe = 25 | 50 | 75 | 100

export interface ScrolltiefeEreignis {
  name: 'scroll_depth'
  seite: 'landing' | MerkSlug
  stufe: Scrollstufe
}

export interface PanelwahlEreignis {
  name: 'panel_select'
  panel: MerkSlug
  weg: 'karte' | 'vergleich' | 'merkliste' | 'befund'
}

/** Der Weg „Angebot anfragen" wurde begonnen — der KLICK, nicht der Versand. */
export interface AnfrageEreignis {
  name: 'quote_request'
  panels: MerkSlug[]
  quelle: 'landing' | 'befund'
}

/** Genau diese Ereignisse kennt die Website. */
export type TrackingEreignis =
  | SeitenaufrufEreignis
  | CtaKlickEreignis
  | KontaktKonversionEreignis
  | EpigenetikKonversionEreignis
  | LeadMagnetKonversionEreignis
  | ConsumerBestellmodalEreignis
  | ConsumerBestellEreignis
  | DownloadZustellEreignis
  | SucheEreignis
  | OutboundEreignis
  | AufklappEreignis
  | ScrolltiefeEreignis
  | PanelwahlEreignis
  | AnfrageEreignis

export type TrackingEreignisName = TrackingEreignis['name']

/** Fuer Tests und Freigabe: die Namen als Liste. */
export const TRACKING_EREIGNISSE = [
  // Seitenaufruf
  'page_view',
  // Die fuenf Journey-Konversionen (state-gated)
  'contact_submit',
  'support_submit',
  'roi_report_request',
  'epigenetics_inquiry_submit',
  'lead_magnet_submit',
  // Zustellung (nur nach beobachtetem Erfolg)
  'download_delivered',
  // Engagement
  'cta_click',
  'panel_select',
  'search',
  'outbound_click',
  // Bestand aus AP15/AP19/AP21 — Engagement, keine Konversionen.
  // `consumer_order_submit` steht seit dem Shopify-Beschluss hier und nicht
  // mehr oben: es misst eine Bestellanfrage (Lead), keinen Kauf.
  'consumer_order_submit',
  'consumer_order_modal_open',
  'consumer_order_modal_close',
  'chapter_toggle',
  'scroll_depth',
  'quote_request',
] as const satisfies readonly TrackingEreignisName[]

// =============================================================================
// ANBIETER UND EINWILLIGUNG
// =============================================================================

/**
 * Ein Anbieter nimmt ein fertiges, geprueftes Ereignis entgegen. Mehr verlangt
 * dieses Modul nicht — welche Bibliothek dahinter steht, bleibt aus diesem
 * Verzeichnis heraus.
 */
export type TrackingProvider = (ereignis: TrackingEreignis) => void

let provider: TrackingProvider | null = null
let einwilligung = false

/**
 * Anbieter registrieren. Ohne Aufruf bleibt `track` ein No-Op.
 *
 * Ein ZWEITER Aufruf mit demselben Anbieter ersetzt ihn, statt einen zweiten
 * zu fuehren: es gibt genau einen, sonst entstuende jedes Ereignis doppelt.
 * `null` entfernt ihn — der Weg, den der Widerruf nimmt.
 */
export function setTrackingProvider(next: TrackingProvider | null): void {
  provider = next
}

/**
 * Einwilligung setzen. Ausgangswert `false`, und dieser Zustand wird bewusst
 * nirgends abgelegt: er lebt nur im Speicher dieses Tabs. Die dauerhafte
 * Speicherung ist Sache von `consentState.ts`.
 */
export function setTrackingConsent(erteilt: boolean): void {
  einwilligung = erteilt === true
}

export function trackingAktiv(): boolean {
  return provider !== null && einwilligung
}

/** Englischer Name derselben Funktion — der Vertrag nennt sie so. */
export const trackingActive = trackingAktiv

/** Nur fuer Tests: beide Sperren wieder schliessen. */
export function resetTrackingForTests(): void {
  provider = null
  einwilligung = false
}

// =============================================================================
// PRUEFUNG DER NUTZLAST
// =============================================================================

const istSlug = (v: string): v is MerkSlug => (MERK_SLUGS as readonly string[]).includes(v)
const istConsumerSeite = (v: unknown): v is ConsumerPage =>
  v === 'spray' || v === 'masks' || v === 'duo'
const istOrt = (v: unknown): v is CtaLocation =>
  typeof v === 'string' && (CTA_LOCATIONS as readonly string[]).includes(v)

/**
 * Muster, die auf einen Personenbezug hindeuten.
 *
 * Das ist eine LETZTE Schranke, kein Ersatz fuer die Typen: was hier
 * anschlaegt, ist bereits an einer falschen Stelle entstanden. Sie greift
 * trotzdem, weil ein Pfad oder eine Produkt-ID irgendwann aus einer Quelle
 * kommen kann, die heute noch niemand kennt.
 */
const PII_MUSTER: readonly RegExp[] = [
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, // E-Mail
  /\+?\d[\d\s().-]{7,}\d/, // Telefonnummer
  /\b[a-f0-9]{32,}\b/i, // Token/Hash
  /\b(?:token|jwt|bearer|secret|password|passwort)\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/, // Geburtsdatum-artig
]

/** Enthaelt der Wert etwas, das nicht in eine fremde Auswertung gehoert? */
function wirktPersonenbezogen(wert: string): boolean {
  return PII_MUSTER.some((muster) => muster.test(wert))
}

/** Obergrenze fuer die wenigen freien Zeichenketten, die es noch gibt. */
const MAX_TEXT = 120

/**
 * Pfad normalisieren: Query und Fragment fallen WEG.
 *
 * Der bisherige Aufruf schickte `window.location.href` samt `?panel=…`,
 * `?intent=…`, `?source=…` und allem, was ein Link aus einer Mail sonst
 * mitbringt. Ein einziger Parameter mit einem Namen oder einem Token haette
 * gereicht.
 */
export function normalisierePfad(roh: string): string | null {
  if (typeof roh !== 'string' || roh === '') return null
  let pfad = roh
  try {
    // Absolute URLs auf den Pfad reduzieren; relative bleiben, wie sie sind.
    pfad = roh.startsWith('http') ? new URL(roh).pathname : roh
  } catch {
    return null
  }
  pfad = pfad.split('?')[0].split('#')[0]
  if (!pfad.startsWith('/') || pfad.length > 256) return null
  if (wirktPersonenbezogen(pfad)) return null
  return pfad
}

/** Zwei Buchstaben, sonst nichts. */
function normalisiereSprache(roh: unknown): string | undefined {
  if (typeof roh !== 'string') return undefined
  const kurz = roh.trim().slice(0, 2).toLowerCase()
  return /^[a-z]{2}$/.test(kurz) ? kurz : undefined
}

/**
 * Seitentitel: Sitecopy, kein Nutzereingabe-Feld — aber gekuerzt und gegen
 * die PII-Muster geprueft, weil ein Titel kuenftig aus einem Inhalt entstehen
 * koennte, den jemand anderes setzt.
 */
function normalisiereTitel(roh: unknown): string | undefined {
  if (typeof roh !== 'string') return undefined
  const text = roh.trim().slice(0, MAX_TEXT)
  if (!text || wirktPersonenbezogen(text)) return undefined
  return text
}

/** Produkt-/Panel-Kennungen: nur schlanke, technische Bezeichner. */
function istKennung(wert: unknown): wert is string {
  return typeof wert === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(wert)
}

/**
 * Die letzte Schranke vor dem Anbieter.
 *
 * Gibt das GEPRUEFTE Ereignis zurueck oder `null`. Aufbauend, nicht filternd:
 * was hier nicht ausdruecklich uebernommen wird, verlaesst das Modul nicht —
 * ein spaeter ergaenztes Feld faellt damit nicht unbemerkt mit nach draussen.
 */
export function pruefeEreignis(ereignis: TrackingEreignis): TrackingEreignis | null {
  switch (ereignis.name) {
    case 'page_view': {
      const pfad = normalisierePfad(ereignis.pfad)
      if (!pfad) return null
      const geprueft: SeitenaufrufEreignis = { name: 'page_view', pfad }
      const sprache = normalisiereSprache(ereignis.sprache)
      if (sprache) geprueft.sprache = sprache
      const titel = normalisiereTitel(ereignis.titel)
      if (titel) geprueft.titel = titel
      return geprueft
    }
    case 'cta_click': {
      if (!istOrt(ereignis.ort)) return null
      const geprueft: CtaKlickEreignis = { name: 'cta_click', ort: ereignis.ort }
      if (istConsumerSeite(ereignis.seite)) geprueft.seite = ereignis.seite
      return geprueft
    }
    // Die drei kontextlosen Konversionen tragen NICHTS ausser ihrem Namen:
    // keine Vorgangsnummer, keine Lead-ID, kein Kontaktdatum.
    case 'contact_submit':
    case 'support_submit':
    case 'roi_report_request':
      return { name: ereignis.name }
    case 'epigenetics_inquiry_submit': {
      const geprueft: EpigenetikKonversionEreignis = { name: 'epigenetics_inquiry_submit' }
      if (typeof ereignis.panel === 'string' && istSlug(ereignis.panel)) {
        geprueft.panel = ereignis.panel
      }
      return geprueft
    }
    case 'lead_magnet_submit':
      return istKennung(ereignis.asset) ? { name: ereignis.name, asset: ereignis.asset } : null
    case 'download_delivered': {
      if (!istKennung(ereignis.asset)) return null
      const geprueft: DownloadZustellEreignis = {
        name: 'download_delivered',
        asset: ereignis.asset,
      }
      const sprache = normalisiereSprache(ereignis.sprache)
      if (sprache) geprueft.sprache = sprache
      return geprueft
    }
    case 'search':
      // Die Eingabe selbst kommt hier gar nicht erst an — der Aufrufer
      // uebergibt nur Trefferzahl und Laengenklasse.
      return Number.isInteger(ereignis.treffer) &&
        ereignis.treffer >= 0 &&
        ['kurz', 'mittel', 'lang'].includes(ereignis.laenge)
        ? { name: 'search', treffer: Math.min(ereignis.treffer, 999), laenge: ereignis.laenge }
        : null
    case 'outbound_click':
      return (OUTBOUND_DOMAINS as readonly string[]).includes(ereignis.domain)
        ? { name: 'outbound_click', domain: ereignis.domain }
        : null
    case 'consumer_order_modal_open':
    case 'consumer_order_modal_close': {
      if (!istConsumerSeite(ereignis.seite) || !istKennung(ereignis.produkt)) return null
      const geprueft: ConsumerBestellmodalEreignis = {
        name: ereignis.name,
        seite: ereignis.seite,
        produkt: ereignis.produkt,
      }
      if (istOrt(ereignis.ort)) geprueft.ort = ereignis.ort
      return geprueft
    }
    case 'consumer_order_submit':
      if (!istConsumerSeite(ereignis.seite) || !istKennung(ereignis.produkt)) return null
      if (!(CONSUMER_MENGEN as readonly unknown[]).includes(ereignis.menge)) return null
      return {
        name: ereignis.name,
        seite: ereignis.seite,
        produkt: ereignis.produkt,
        menge: ereignis.menge,
      }
    case 'chapter_toggle':
      return istSlug(ereignis.panel) && istKennung(ereignis.block)
        ? {
            name: ereignis.name,
            panel: ereignis.panel,
            block: ereignis.block,
            offen: ereignis.offen === true,
          }
        : null
    case 'scroll_depth':
      return (ereignis.seite === 'landing' || istSlug(ereignis.seite)) &&
        [25, 50, 75, 100].includes(ereignis.stufe)
        ? { name: ereignis.name, seite: ereignis.seite, stufe: ereignis.stufe }
        : null
    case 'panel_select':
      return istSlug(ereignis.panel) &&
        ['karte', 'vergleich', 'merkliste', 'befund'].includes(ereignis.weg)
        ? { name: ereignis.name, panel: ereignis.panel, weg: ereignis.weg }
        : null
    case 'quote_request':
      return Array.isArray(ereignis.panels) && ereignis.panels.every(istSlug)
        ? { name: ereignis.name, panels: [...ereignis.panels], quelle: ereignis.quelle }
        : null
    default:
      return null
  }
}

// =============================================================================
// SENDEN
// =============================================================================

/**
 * Ereignis melden.
 *
 * Ohne Anbieter, ohne Einwilligung oder ausserhalb des Browsers geschieht
 * nichts — und zwar geraeuschlos: ein Fehler an dieser Stelle wuerde eine
 * Bedienung unterbrechen, die auch ohne Messung funktionieren muss.
 */
export function track(ereignis: TrackingEreignis): void {
  if (typeof window === 'undefined') return
  if (!provider || !einwilligung) return
  const geprueft = pruefeEreignis(ereignis)
  if (!geprueft) return
  try {
    provider(geprueft)
  } catch {
    // Eine kaputte Messung darf die Seite nicht anhalten.
  }
}
