/**
 * Praesentationsschicht des Resource Centers (AP19 PT19.2).
 *
 * Diese Datei entscheidet, WAS auf `/downloads` erscheint und in welcher
 * Sprachvariante — sie fuehrt aber keine eigene Ressourcenliste. Einzige
 * Wahrheit bleibt `resourceInventory.ts` (PT19.1, RI-01).
 *
 * DREI REGELN, die hier und nicht in der Seite stehen, damit ein Guard sie
 * pruefen kann:
 *
 *  1. Sichtbar ist ausschliesslich `lifecycle === 'ACTIVE_VISIBLE'`. Der
 *     entlinkte IglooPro-Flyer (`NOT_LAUNCH_VISIBLE`) taucht nirgends auf.
 *  2. Gruppen entstehen aus den realen Kategorien des Bestands. Eine Gruppe
 *     ohne Treffer wird nicht gerendert — es gibt keine Fuellkategorie.
 *  3. Die Sprachaufloesung ist dieselbe, die PT19.1 ueber zehn Locales
 *     bewiesen hat: `de` bekommt DE, alle uebrigen EN, und nur wenn es keine
 *     EN-Datei gibt, DE mit sichtbarer Offenlegung. Kein stiller Fallback.
 */

import {
  RESOURCE_INVENTORY,
  type ResourceAssetLanguage,
  type ResourceCategory,
  type ResourceRecord,
  type ResourceVariant,
} from './resourceInventory'

export interface ResourceGroupDefinition {
  readonly id: string
  /** i18n-Schluessel der Gruppenueberschrift, in allen zehn Locales vorhanden. */
  readonly labelKey: string
  /** Reale Kategorien aus dem Inventar — keine erfundene Einteilung. */
  readonly categories: readonly ResourceCategory[]
}

/**
 * Vier Gruppen aus sieben realen Kategorien. Buendel stehen bei den Blaettern
 * beziehungsweise Befunden, die sie enthalten; das ist eine reine
 * Darstellungsentscheidung und aendert keine Kategorie im Inventar.
 */
export const RESOURCE_GROUPS: readonly ResourceGroupDefinition[] = [
  {
    id: 'info-sheets',
    labelKey: 'downloads:groups.infoSheets',
    categories: ['INFO_SHEET', 'INFO_SHEET_BUNDLE'],
  },
  {
    id: 'sample-reports',
    labelKey: 'downloads:groups.sampleReports',
    categories: ['SAMPLE_REPORT', 'SAMPLE_REPORT_BUNDLE'],
  },
  {
    id: 'guides',
    labelKey: 'downloads:groups.guides',
    categories: ['PARAMETER_GUIDE', 'VALUES_GUIDE'],
  },
  {
    id: 'product-flyers',
    labelKey: 'downloads:groups.productFlyers',
    categories: ['PRODUCT_FLYER'],
  },
] as const

/**
 * Der Gate-Einstieg ist ein wiederverwendbares Formular an Ort und Stelle
 * (`ResourceGateForm`), keine eigene Route. Das haelt den Kontext — Asset-ID,
 * angefragtes Locale, Herkunft — ohne ihn durch eine URL schleusen zu muessen.
 */
export const GATE_MODE = 'INLINE_FORM' as const

export const LAUNCH_VISIBLE_RESOURCES = RESOURCE_INVENTORY.filter(
  (resource) => resource.lifecycle === 'ACTIVE_VISIBLE',
)

// Jede reale Kategorie muss genau einer Gruppe zugeordnet sein, sonst
// verschwaende eine Ressource lautlos aus dem Resource Center.
const groupedCategories = RESOURCE_GROUPS.flatMap((group) => group.categories)
for (const resource of LAUNCH_VISIBLE_RESOURCES) {
  if (!groupedCategories.includes(resource.category)) {
    throw new Error(`Resource Center: Kategorie ohne Gruppe (${resource.category})`)
  }
}
if (new Set(groupedCategories).size !== groupedCategories.length) {
  throw new Error('Resource Center: Kategorie in mehreren Gruppen')
}

// Spiegel der Serverregel: eine gegatete Ressource, deren Datei noch
// oeffentlich liegt, waere ueber ihre vorhersagbare URL umgehbar. Lieber beim
// Laden hart scheitern als ein Gate anzeigen, das keines ist.
for (const resource of LAUNCH_VISIBLE_RESOURCES) {
  if (resource.deliveryClass !== 'GATED') continue
  if (resource.variants.some((variant) => variant.storage !== 'PROTECTED')) {
    throw new Error(`Resource Center: GATED ohne geschuetzte Ablage (${resource.id})`)
  }
}

/**
 * Welche Datei ein Locale bekommt. Identisch zur in PT19.1 bewiesenen Regel.
 */
export const resolveResourceVariant = (
  resource: ResourceRecord,
  uiLocale: string,
): ResourceVariant => {
  const preferred: ResourceAssetLanguage = uiLocale === 'de' ? 'de' : 'en'
  return resource.variants.find((variant) => variant.language === preferred) ?? resource.variants[0]
}

/** True, wenn der Leser eine andere Sprache bekommt, als seine Oberflaeche spricht. */
export const isLanguageFallback = (uiLocale: string, variant: ResourceVariant): boolean =>
  uiLocale === 'de' ? false : variant.language !== 'en'

/**
 * Oeffentliche URL einer frei zugaenglichen Datei.
 *
 * Fuer `GATED` gibt es bewusst KEINE URL: die physische Adresse darf gar nicht
 * erst in das Markup geraten, sonst waere das Gate durch Rechtsklick umgehbar.
 */
export const freeResourceHref = (
  resource: ResourceRecord,
  variant: ResourceVariant,
): string | null => {
  if (resource.deliveryClass !== 'FREE_PUBLIC') return null
  return `/downloads/${variant.path.split('/').map(encodeURIComponent).join('/')}`
}

/** Kontext, den die CTA in den Gate-Flow traegt — Asset-ID, nicht Dateipfad. */
export interface GateEntryContext {
  readonly assetId: string
  readonly requestedLocale: string
  readonly assetLanguage: ResourceAssetLanguage
  readonly source: 'resource-center'
}

export const gateEntryContext = (
  resource: ResourceRecord,
  uiLocale: string,
  variant: ResourceVariant,
): GateEntryContext => ({
  assetId: resource.id,
  requestedLocale: uiLocale,
  assetLanguage: variant.language,
  source: 'resource-center',
})

export interface ResourceCard {
  readonly resource: ResourceRecord
  readonly variant: ResourceVariant
  readonly languageFallback: boolean
  /** Gesetzt nur bei FREE_PUBLIC. */
  readonly href: string | null
  /** Gesetzt nur bei GATED. */
  readonly gate: GateEntryContext | null
  /** Der Beschriftungsschluessel, der zur ausgelieferten Variante gehoert. */
  readonly labelKey: string | null
  readonly descriptionKey: string | null
}

/**
 * Mehrsprachige Ressourcen fuehren je Sprache einen eigenen Beschriftungs-
 * schluessel (die beiden Vitamin-D3-Flyer). Einsprachige fuehren einen. Der
 * Index folgt der Variantenreihenfolge, sonst faellt der erste zurueck.
 */
/**
 * Das Inventar schreibt Array-Positionen als JSON-Pointer (`sheets[0].title`).
 * i18next kennt nur Punktnotation. Ohne diese Umschreibung liefert `t()` den
 * Schluessel als Text zurueck — in PT19.2 stand genau das auf den Karten.
 */
export const i18nKey = (pointer: string): string => pointer.replace(/\[(\d+)\]/gu, '.$1')

const keyForVariant = (
  keys: readonly string[],
  resource: ResourceRecord,
  variant: ResourceVariant,
): string | null => {
  if (keys.length === 0) return null
  if (keys.length === 1) return i18nKey(keys[0])
  const index = resource.variants.indexOf(variant)
  return i18nKey(keys[index] ?? keys[0])
}

export interface ResourceGroup {
  readonly id: string
  readonly labelKey: string
  readonly cards: readonly ResourceCard[]
}

/**
 * Nur nicht-leere Gruppen, in fester Reihenfolge, mit aufgeloester Sprache.
 *
 * `resources` ist ueberschreibbar, damit der Guard die beiden Regeln pruefen
 * kann, die der heutige Bestand nicht ausloest: eine leere Kategorie und eine
 * gegatete Ressource. Ohne diesen Einstieg waeren beide Zweige zwar
 * geschrieben, aber unbewiesen.
 */
export const buildResourceCenter = (
  uiLocale: string,
  resources: readonly ResourceRecord[] = LAUNCH_VISIBLE_RESOURCES,
): ResourceGroup[] =>
  RESOURCE_GROUPS.map((group) => {
    const cards = resources
      .filter((resource) => group.categories.includes(resource.category))
      .map((resource) => {
        const variant = resolveResourceVariant(resource, uiLocale)
        const gated = resource.deliveryClass === 'GATED'
        return {
          resource,
          variant,
          languageFallback: isLanguageFallback(uiLocale, variant),
          href: gated ? null : freeResourceHref(resource, variant),
          gate: gated ? gateEntryContext(resource, uiLocale, variant) : null,
          labelKey: keyForVariant(resource.labelKeys, resource, variant),
          descriptionKey: keyForVariant(resource.descriptionKeys, resource, variant),
        }
      })
    return { id: group.id, labelKey: group.labelKey, cards }
  }).filter((group) => group.cards.length > 0)

/** `1,0 MB` / `79 KB` — dieselbe Lesart, die die Blaetter selbst benutzen. */
export const formatResourceSize = (bytes: number, locale: string): string => {
  const useMegabytes = bytes >= 1024 * 1024
  const value = useMegabytes ? bytes / 1024 / 1024 : bytes / 1024
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: useMegabytes ? 1 : 0,
    maximumFractionDigits: useMegabytes ? 1 : 0,
  }).format(value)} ${useMegabytes ? 'MB' : 'KB'}`
}

export const resourceFormatLabel = (variant: ResourceVariant): 'PDF' | 'ZIP' =>
  variant.mime === 'application/zip' ? 'ZIP' : 'PDF'
