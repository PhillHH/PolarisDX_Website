/**
 * Consumer-Produktmodell (AP21 PT21.2).
 *
 * Erste Produktmigration: die Vitamin-Seite trug ihre Produktzahlen bisher als
 * String-Literale im JSX. Das hatte zwei konkrete Folgen, beide gemessen:
 *
 *  1. `'1000 IU Vitamin D3 + 25 µg Vitamin K2'` stand fest im Code und wurde
 *     damit in ALLEN zehn Locales englisch ausgeliefert — obwohl die
 *     freigegebene Copy die Einheit lokalisiert (IE, UI, j.m., IU).
 *  2. Ein Listenpreis von 169 € stand im JSX, ohne Beleg irgendwo im
 *     Repository (§4 CONSUMER-CONTRACT).
 *
 * Dieses Modell trennt deshalb dreierlei:
 *  - die STABILE Identität (Route-Slug und die Bestell-ID, die der Server
 *    zulaesst) — kein freier Produktname als Backend-Autoritaet,
 *  - die MEDIEN mit realen, gemessenen Abmessungen,
 *  - die FAKTEN als i18n-Schluessel statt als Literal, damit jede Zahl mit
 *    ihrer lokalisierten Einheit erscheint.
 *
 * Was hier NICHT steht, steht bewusst nicht hier: Preis, Angebot,
 * Verfuegbarkeit, Lieferzeit, Bewertung, GTIN/SKU und Zertifikat. Es gibt
 * dafuer keine belegte Quelle, und AP21 erfindet keine.
 */

export type ConsumerProductKey = 'spray' | 'masks' | 'duo'

/** Woher eine Produktzahl stammt. Wird im Vertrag ausgewiesen. */
export type FactEvidence =
  /** Durch freigegebene x10-Copy in `consumer.json` gedeckt. */
  | 'APPROVED_LOCALE_COPY'
  /** Stand nur im Quelltext; nicht belegt, Owner muss bestaetigen. */
  | 'CODE_ONLY_UNVERIFIED'

export interface ConsumerProductMedia {
  /** Importierte Bildquelle (Vite-Asset-URL). */
  readonly src: string
  /** i18n-Schluessel des Alternativtexts — x10, nie hartkodiert. */
  readonly altKey: string
  /** Aus der Datei gemessen, nicht geschaetzt. */
  readonly width: number
  readonly height: number
}

export interface ConsumerProductFact {
  /** i18n-Schluessel der Beschriftung. */
  readonly labelKey: string
  /** i18n-Schluessel des Werts — auch Zahlen, weil Einheiten lokalisiert sind. */
  readonly valueKey: string
  readonly evidence: FactEvidence
}

export interface ConsumerProduct {
  /** Kanonischer Route-Slug: `/{locale}/consumer/<slug>`. */
  readonly slug: string
  /**
   * ID, die der Bestellpfad sendet. Sie ist serverseitig in
   * `CONSUMER_PRODUCT_LABELS` (server/server.js) allowlistet — der Client
   * schickt also eine feste Kennung, keinen freien Produktnamen.
   *
   * Sie weicht bewusst vom Route-Slug ab (`spray` vs. `vitamin-d3-spray`);
   * ein Angleich wuerde die Server-Allowlist aendern und gehoert damit zum
   * Bestell-Backend (PT21.4/PT21.5), nicht hierher.
   */
  readonly orderId: ConsumerProductKey
  /** i18n-Schluessel des echten Produktnamens (nicht der Marketing-Headline). */
  readonly nameKey: string
  /** i18n-Schluessel der Marketing-Headline (H1). */
  readonly headlineKey: string
  readonly seoTitleKey: string
  readonly seoDescriptionKey: string
  readonly hero: ConsumerProductMedia
  readonly gallery: readonly ConsumerProductMedia[]
  /** Kennzahlen der Faktenkachel-Reihe. */
  readonly stats: readonly ConsumerProductFact[]
  /** Zeilen der Spezifikationstabelle. */
  readonly specs: readonly ConsumerProductFact[]
  /**
   * Listenpreis. `null` heisst: es gibt keinen belegten Preis — und dann wird
   * auch keiner gerendert. Kein Platzhalter, keine Schaetzung.
   */
  readonly listPrice: null
}

export const SPRAY_PRODUCT: ConsumerProduct = {
  slug: 'vitamin-d3-spray',
  orderId: 'spray',
  nameKey: 'spray.copy_049',
  headlineKey: 'spray.copy_050',
  seoTitleKey: 'spray.copy_046',
  seoDescriptionKey: 'spray.copy_047',
  hero: {
    src: '',
    altKey: 'spray.copy_053',
    width: 1122,
    height: 1402,
  },
  gallery: [],
  stats: [
    {
      labelKey: 'spray.copy_071',
      valueKey: 'spray.stats.bottles_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.copy_058',
      valueKey: 'spray.stats.applications_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.copy_072',
      valueKey: 'spray.stats.d3_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    // 25 µg K2 stand ausschliesslich im Quelltext und ist durch keine
    // freigegebene Copy gedeckt. Der Wert wird weiter angezeigt — er ist
    // bestehender Bestand, nicht meine Erfindung —, aber als offen gefuehrt.
    {
      labelKey: 'spray.copy_073',
      valueKey: 'spray.stats.k2_value',
      evidence: 'CODE_ONLY_UNVERIFIED',
    },
  ],
  specs: [
    {
      labelKey: 'spray.facts.pack_size',
      valueKey: 'spray.facts.pack_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.facts.applications',
      valueKey: 'spray.copy_059',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.facts.format',
      valueKey: 'spray.facts.format_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.facts.dosage',
      valueKey: 'spray.facts.dosage_value',
      evidence: 'CODE_ONLY_UNVERIFIED',
    },
    {
      labelKey: 'spray.facts.suitable_for',
      valueKey: 'spray.copy_060',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'spray.facts.origin',
      valueKey: 'spray.copy_055',
      evidence: 'APPROVED_LOCALE_COPY',
    },
  ],
  listPrice: null,
}

export const CONSUMER_PRODUCTS: Readonly<Record<'spray', ConsumerProduct>> = {
  spray: SPRAY_PRODUCT,
}

/** Alle i18n-Schluessel eines Produkts — Grundlage der x10-Vollstaendigkeitspruefung. */
export const productContentKeys = (product: ConsumerProduct): string[] => [
  product.nameKey,
  product.headlineKey,
  product.seoTitleKey,
  product.seoDescriptionKey,
  product.hero.altKey,
  ...product.gallery.map((media) => media.altKey),
  ...product.stats.flatMap((fact) => [fact.labelKey, fact.valueKey]),
  ...product.specs.flatMap((fact) => [fact.labelKey, fact.valueKey]),
]
