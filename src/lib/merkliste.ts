/**
 * Merkliste der Epigenetik-Panels — reiner Browserzustand.
 *
 * WARUM ES SIE GIBT: zwischen "ich lese die sechs Panels" und "ich schreibe
 * eine Anfrage" gab es keine Zwischenstufe. Wer sich drei Panels gemerkt
 * hatte, musste sie beim Wechsel auf die naechste Seite im Kopf behalten.
 * Jetzt merkt er sie vor, und am Ende steht eine vorbefuellte Anfrage.
 *
 * DATENSCHUTZ — bitte beim Aendern erhalten:
 * - Gespeichert werden ausschliesslich die sechs bekannten Panel-SLUGS, in
 *   localStorage, auf dem Geraet des Nutzers. Keine Namen, keine Kennungen,
 *   kein Zeitstempel.
 * - Es gibt KEIN Backend und KEINE Uebertragung. Nichts verlaesst den Browser,
 *   solange der Nutzer nicht selbst das Kontaktformular absendet — und dort
 *   sieht er die Panelnamen im Freitext stehen und kann sie aendern.
 * - Kein Cookie, kein Tracking, keine Weitergabe an Dritte. Die Liste ist
 *   damit nicht einwilligungspflichtig; sie bleibt es nur, solange hier keine
 *   Uebertragung dazukommt.
 * - Der Nutzer kann sie jederzeit vollstaendig leeren (`clearMerkliste`), der
 *   Knopf dafuer steht neben der Liste.
 *
 * Kein useState in einem Modul, sondern ein winziger Store mit Abonnenten:
 * dieselbe Liste erscheint auf der Uebersichtsseite und in jedem Musterbefund,
 * und alle Ansichten muessen sich gemeinsam aendern.
 */

import { useCallback, useSyncExternalStore } from 'react'

/** Version im Schluessel, damit ein spaeteres Format alte Eintraege nicht erbt. */
const KEY = 'polaris-epi-merkliste-v1'

/**
 * Nur diese sechs Slugs werden gespeichert und gelesen. Ein manipulierter oder
 * veralteter localStorage-Eintrag kann damit nichts in die Oberflaeche tragen,
 * was nicht ohnehin auf der Seite steht.
 */
export const MERK_SLUGS = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

export type MerkSlug = (typeof MERK_SLUGS)[number]

const isSlug = (v: unknown): v is MerkSlug =>
  typeof v === 'string' && (MERK_SLUGS as readonly string[]).includes(v)

/** Dokumentreihenfolge statt Klickreihenfolge — dieselbe wie 01–06 auf /epigenetics. */
const sortiert = (slugs: MerkSlug[]): MerkSlug[] => MERK_SLUGS.filter((s) => slugs.includes(s))

/**
 * Eine feste, leere Liste. Sie ist die Antwort des Servers und muss ueber alle
 * Aufrufe dieselbe Referenz behalten — useSyncExternalStore vergleicht mit ===
 * und liefe sonst in eine Endlosschleife.
 */
const LEER: MerkSlug[] = []

let cache: MerkSlug[] | null = null
const listeners = new Set<() => void>()

function read(): MerkSlug[] {
  if (typeof window === 'undefined') return LEER
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return LEER
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return LEER
    const treffer = sortiert(parsed.filter(isSlug))
    return treffer.length === 0 ? LEER : treffer
  } catch {
    // Privater Modus, gesperrter Speicher, kaputter Eintrag: dann eben leer.
    return LEER
  }
}

/** Der aktuelle Stand. Erst beim ersten Lesen aus dem Speicher geholt. */
function snapshot(): MerkSlug[] {
  if (cache === null) cache = read()
  return cache
}

/** Auf dem Server gibt es keinen Speicher — dort ist die Liste immer leer. */
function serverSnapshot(): MerkSlug[] {
  return LEER
}

function melden() {
  listeners.forEach((fn) => fn())
}

/**
 * Ein zweiter Tab aendert die Liste. Der Zuhoerer haengt genau einmal am
 * Fenster, nicht einmal je Abonnent.
 */
let storageGebunden = false
const ausFremdemTab = (e: StorageEvent) => {
  if (e.key !== null && e.key !== KEY) return
  cache = read()
  melden()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  if (!storageGebunden && typeof window !== 'undefined') {
    storageGebunden = true
    window.addEventListener('storage', ausFremdemTab)
  }
  return () => {
    listeners.delete(onChange)
  }
}

function write(next: MerkSlug[]) {
  cache = next.length === 0 ? LEER : next
  try {
    if (typeof window !== 'undefined') {
      if (next.length === 0) window.localStorage.removeItem(KEY)
      else window.localStorage.setItem(KEY, JSON.stringify(next))
    }
  } catch {
    // Ohne Speicher haelt die Liste nur bis zum Neuladen. Das ist besser als
    // ein Fehler mitten im Klick.
  }
  melden()
}

export function toggleMerk(slug: string) {
  if (!isSlug(slug)) return
  const jetzt = snapshot()
  write(jetzt.includes(slug) ? jetzt.filter((s) => s !== slug) : sortiert([...jetzt, slug]))
}

export function removeMerk(slug: string) {
  if (!isSlug(slug)) return
  const jetzt = snapshot()
  if (!jetzt.includes(slug)) return
  write(jetzt.filter((s) => s !== slug))
}

export function clearMerkliste() {
  write(LEER)
}

/**
 * Die Liste als React-Zustand.
 *
 * useSyncExternalStore statt useState plus Effekt: der Server rendert dieselbe
 * Seite ohne localStorage. Waehrend der Hydration liefert `serverSnapshot` die
 * leere Liste — der Baum stimmt also mit dem Server-HTML ueberein —, danach
 * schaltet React von selbst auf den echten Stand um. Ein Effekt, der nach dem
 * Mounten nachtraegt, wuerde genau diese Zusicherung verlieren.
 */
export function useMerkliste() {
  const slugs = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const has = useCallback((slug: string) => slugs.includes(slug as MerkSlug), [slugs])
  return { slugs, has, toggle: toggleMerk, remove: removeMerk, clear: clearMerkliste }
}
