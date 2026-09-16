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

/**
 * Ein Preis, der wirklich freigegeben ist.
 *
 * Bis PT21.3 war `listPrice` schlicht `null` — weder Spray noch Masken hatten
 * einen belegten Preis, beide trugen nur ein Literal im JSX. Das Duo ist der
 * erste Fall mit echter Quelle: der Paketpreis steht in `duo.copy_016` in
 * allen zehn Locales. Deshalb traegt jeder Preis hier seinen Beleg mit sich.
 */
export interface ConsumerPrice {
  /** Betrag in der angegebenen Waehrung. Formatierung macht die Oberflaeche. */
  readonly amount: number
  readonly currency: 'EUR'
  readonly evidence: FactEvidence
  /** i18n-Schluessel, in dem der Betrag freigegeben steht — oder `null`. */
  readonly evidenceKey: string | null
}

export interface ConsumerProduct {
  /** Kanonischer Route-Slug: `/{locale}/consumer/<slug>`. */
  readonly slug: string
  /**
   * ID, die der Bestellpfad sendet. Sie ist serverseitig in
   * `PRODUCT_ALLOWLIST` (server/consumer-order.js) allowlistet — der Client
   * schickt also eine feste Kennung, keinen freien Produktnamen.
   *
   * Sie weicht bewusst vom Route-Slug ab (`spray` vs. `vitamin-d3-spray`).
   * PT21.5 hat das entschieden statt vereinheitlicht: die Server-Allowlist
   * in `server/consumer-order.js` fuehrt den Route-Slug als kanonische
   * Identitaet und akzeptiert diese kurze Bestell-ID als gebundenen Alias.
   * Beides sind feste Kennungen — keine davon ist ein freier Name.
   */
  readonly orderId: ConsumerProductKey
  /**
   * Das reale Gebinde, das bestellt wird (AP21 PT21.5). Der Server
   * allowlistet denselben Wert erneut; ein unbekannter Wert wird abgelehnt
   * statt still auf eine Standardvariante zu fallen.
   */
  readonly orderVariant: string
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
  readonly listPrice: ConsumerPrice | null
  /**
   * Bestandteile eines Bundles. Leer bei Einzelprodukten. Jeder Bestandteil
   * verweist auf die Produktkennung, aus der er stammt — damit eine Aussage
   * ueber den Packungsinhalt nicht der Wahrheit des Einzelprodukts
   * widersprechen kann.
   */
  readonly components: readonly ConsumerBundleComponent[]
}

export interface ConsumerBundleComponent {
  /** Bestell-ID des enthaltenen Produkts. */
  readonly of: ConsumerProductKey
  /** Stueckzahl dieses Bestandteils im Bundle. */
  readonly quantity: number
  /** i18n-Schluessel der sichtbaren Beschreibung. */
  readonly labelKey: string
}

export const SPRAY_PRODUCT: ConsumerProduct = {
  slug: 'vitamin-d3-spray',
  orderId: 'spray',
  orderVariant: 'pack-12',
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
  components: [],
}

export const MASKS_PRODUCT: ConsumerProduct = {
  slug: 'hydrating-masks',
  orderId: 'masks',
  orderVariant: 'box-5',
  // `copy_034` ist der Produktname, `copy_035` die H1-Marketingzeile. Das
  // Product-Schema nannte bisher die Marketingzeile — derselbe Befund wie beim
  // Spray, hier mit anderen Schluesseln.
  nameKey: 'mask.copy_034',
  headlineKey: 'mask.copy_035',
  seoTitleKey: 'mask.copy_031',
  seoDescriptionKey: 'mask.copy_032',
  hero: {
    src: '',
    altKey: 'mask.copy_037',
    width: 1122,
    height: 1402,
  },
  gallery: [],
  stats: [
    // Alle drei Zahlen sind durch freigegebene Copy gedeckt: `copy_038`
    // (5er-Pack), `copy_032`/`serum_mask` (15 ml) und `copy_036` (15 bis 30
    // Minuten). Neu ist nur, dass sie lokalisiert statt fest im JSX stehen —
    // die Zahlenspanne schreibt nicht jede Sprache mit demselben Trennzeichen.
    {
      labelKey: 'mask.copy_070',
      valueKey: 'mask.stats.masks_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'mask.copy_071',
      valueKey: 'mask.stats.serum_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
    {
      labelKey: 'mask.copy_072',
      valueKey: 'mask.stats.minutes_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
  ],
  // Die Masken-Seite fuehrt keine Spezifikationstabelle; die Produktfakten
  // stehen im FactStrip und in den Abschnitten. Eine leere Liste ist hier die
  // Wahrheit, kein Platzhalter.
  specs: [],
  listPrice: null,
  components: [],
}

export const DUO_PRODUCT: ConsumerProduct = {
  slug: 'inside-out-duo',
  orderId: 'duo',
  orderVariant: 'set',
  // Zum dritten Mal dasselbe Muster: `copy_019` ist die H1-Marketingzeile
  // ("Unterstuetzung von innen. Feuchtigkeitsspendende Pflege von aussen."),
  // `copy_018` der Produktname.
  nameKey: 'duo.copy_018',
  headlineKey: 'duo.copy_019',
  seoTitleKey: 'duo.copy_015',
  seoDescriptionKey: 'duo.seo_description',
  hero: {
    src: '',
    altKey: 'duo.copy_023',
    width: 1122,
    height: 1402,
  },
  gallery: [],
  stats: [
    {
      labelKey: 'duo.copy_027',
      valueKey: 'duo.stats.bundle_value',
      evidence: 'APPROVED_LOCALE_COPY',
    },
  ],
  specs: [],
  // Der Paketpreis ist der erste belegte Preis der Consumer-Strecke: er steht
  // in `duo.copy_016` in allen zehn Locales, nicht nur im Quelltext.
  listPrice: {
    amount: 49.9,
    currency: 'EUR',
    evidence: 'APPROVED_LOCALE_COPY',
    evidenceKey: 'duo.copy_016',
  },
  // 1 Spray-Flasche (nicht der 12er-Pack) plus eine Box mit 5 Masken —
  // deckungsgleich mit `CONSUMER_PRODUCT_LABELS.duo` auf dem Server und mit
  // der freigegebenen Copy (`copy_004`, `copy_025`, `copy_058`).
  components: [
    { of: 'spray', quantity: 1, labelKey: 'duo.copy_028' },
    { of: 'masks', quantity: 5, labelKey: 'duo.copy_029' },
  ],
}

export const CONSUMER_PRODUCTS: Readonly<Record<ConsumerProductKey, ConsumerProduct>> = {
  spray: SPRAY_PRODUCT,
  masks: MASKS_PRODUCT,
  duo: DUO_PRODUCT,
}

/**
 * Der monatliche Zusatzpreis, mit dem `duo.bundle_lead` befuellt wird.
 *
 * ACHTUNG, bewusst als ungedeckt gefuehrt: die Zahl stammt aus dem Quelltext,
 * nicht aus freigegebener Copy. `PriceBadge.tsx` traegt dazu ein offenes
 * CONFIRM-Flag ("final figure for the Duo add-on per month?"). Sie wird weiter
 * angezeigt, weil sie bestehender Bestand ist — aber sie ist owner-bound und
 * darf nicht als bestaetigt gelten.
 */
export const DUO_MONTHLY_ADD_ON: ConsumerPrice = {
  amount: 2,
  currency: 'EUR',
  evidence: 'CODE_ONLY_UNVERIFIED',
  evidenceKey: null,
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
