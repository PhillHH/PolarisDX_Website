/**
 * KANONISCHE RESOURCE-/ASSET-WAHRHEIT (AP19 PT19.1).
 *
 * Eine einzige belastbare Metadatenquelle fuer jede launchrelevante Ressource.
 * Card-, Katalog- und Gate-Listen leiten sich hieraus ab; sie sind keine
 * zweite Wahrheit. `scripts/check-resource-inventory.ts` beweist gegen das
 * Dateisystem und gegen alle zehn Locale-Dateien, dass diese Datei stimmt.
 *
 * IDENTITAET: `id` ist die technische Identitaet einer Ressource. Sie ist
 * eindeutig, stabil, pfadunabhaengig und unabhaengig von Sprache und Titel.
 * Dateiname und Ablageort sind Implementierungsdetail und stehen ausschliesslich
 * auf der Variante.
 *
 * WAHRHEIT: `bytes`, `sha256`, `pages`, `mime` und `date` sind gemessen, nicht
 * behauptet. Wo eine Datei kein Datum traegt, steht `date: null` mit
 * `dateEvidence: 'NONE'` — es wird keines erfunden. Kein Asset deklariert eine
 * Version; `version` ist deshalb ueberall `null`.
 *
 * SPRACHE: `languageEvidence` trennt maschinell geprueften Textinhalt
 * (`TEXT_VERIFIED`) von reiner Katalogbehauptung (`CATALOG_ASSERTED`). Die drei
 * bildbasierten Flyer enthalten keinen extrahierbaren Text; ihre Sprache ist
 * nicht maschinell belegbar und wird nicht als belegt ausgewiesen.
 *
 * GATING: PT19.1 inventarisiert nur. Es existiert heute keine `GATED`
 * Ressource und keine geschuetzte Ablage; `storage` ist ueberall
 * `PUBLIC_STATIC`. Das gegatete Lead-Magnet-Asset nach `DEC-RL-014` ist
 * Aufgabe von PT19.3/PT19.4.
 */

/** Sprachen, in denen tatsaechlich Dateien vorliegen — nicht die zehn UI-Locales. */
export type ResourceAssetLanguage = 'de' | 'en'

/** Genau eine Auslieferungsklasse je sichtbarer Ressource. */
export type ResourceDeliveryClass = 'FREE_PUBLIC' | 'GATED' | 'NOT_LAUNCH_VISIBLE'

/** Bestandsklassifikation inklusive verwaister Reste. */
export type ResourceLifecycle =
  | 'ACTIVE_VISIBLE'
  | 'ACTIVE_HIDDEN'
  | 'LEGACY_ORPHAN'
  | 'REPLACED'
  | 'UNKNOWN_REVIEW_REQUIRED'

/** Heute ist alles oeffentlich statisch; PROTECTED ist fuer PT19.3 reserviert. */
export type ResourceStorageClass = 'PUBLIC_STATIC' | 'PROTECTED'

export type ResourceMime = 'application/pdf' | 'application/zip'

export type ResourceDomain = 'EPIGENETICS' | 'PRODUCT'

export type ResourceCategory =
  | 'INFO_SHEET'
  | 'INFO_SHEET_BUNDLE'
  | 'SAMPLE_REPORT'
  | 'SAMPLE_REPORT_BUNDLE'
  | 'PARAMETER_GUIDE'
  | 'VALUES_GUIDE'
  | 'PRODUCT_FLYER'

/** Woher ein Datum stammt. `NONE` heisst: es gibt keines — und es wird keines erfunden. */
export type ResourceDateEvidence = 'FILE_EMBEDDED' | 'ARCHIVE_ENTRY' | 'CATALOG_ASSERTED' | 'NONE'

/** Woher die Sprachzuordnung stammt. */
export type ResourceLanguageEvidence = 'TEXT_VERIFIED' | 'CATALOG_ASSERTED'

export interface ResourceVariant {
  readonly language: ResourceAssetLanguage
  readonly storage: ResourceStorageClass
  /** Pfad relativ zu `public/downloads` — Implementierungsdetail, keine Identitaet. */
  readonly path: string
  readonly mime: ResourceMime
  readonly bytes: number
  readonly sha256: string
  /** Seitenzahl bei PDF, `null` bei Archiven. */
  readonly pages: number | null
  readonly date: string | null
  readonly dateEvidence: ResourceDateEvidence
  /** Kein Asset deklariert eine Version. */
  readonly version: null
  readonly languageEvidence: ResourceLanguageEvidence
}

export interface ResourceRecord {
  readonly id: string
  readonly domain: ResourceDomain
  readonly category: ResourceCategory
  readonly deliveryClass: ResourceDeliveryClass
  readonly lifecycle: ResourceLifecycle
  /** i18n-Schluessel, die diese Ressource heute beschriften. */
  readonly labelKeys: readonly string[]
  readonly descriptionKeys: readonly string[]
  /** Schluessel mit sichtbaren Groessen-/Seitenangaben. */
  readonly declaredMetaKeys: readonly string[]
  /** Alle Stellen, die die Datei benennen — auch inerte. */
  readonly referenceKeys: readonly string[]
  /** Teilmenge davon, die produktiv einen Link erzeugt. */
  readonly renderedReferenceKeys: readonly string[]
  readonly visibleFrom: readonly string[]
  /** Frueher vergebene, nicht mehr kanonische Katalog-IDs. */
  readonly legacyCatalogIds: readonly string[]
  readonly variants: readonly ResourceVariant[]
}

export const RESOURCE_INVENTORY: readonly ResourceRecord[] = [
  {
    id: 'rsc-epi-001',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[0].title'],
    descriptionKeys: ['epigenetics:sheets[0].desc'],
    declaredMetaKeys: ['epigenetics:sheets[0].meta'],
    referenceKeys: ['epigenetics:sheets[0].file'],
    renderedReferenceKeys: ['epigenetics:sheets[0].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/00_Portfolio_Uebersicht_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 80798,
        sha256: '50b3df18530833db8add931ce09d09acfb6d6c6476305e870b525b2d53164ac1',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/00_Portfolio_Overview_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 80231,
        sha256: '596b40f351326fa78dc595af9659b82b3f96409e87d1b3e03dcefa2f5979a728',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-002',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[1].title'],
    descriptionKeys: ['epigenetics:sheets[1].desc'],
    declaredMetaKeys: ['epigenetics:sheets[1].meta'],
    referenceKeys: ['epigenetics:sheets[1].file'],
    renderedReferenceKeys: ['epigenetics:sheets[1].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/01_Metabolic_Health_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 82637,
        sha256: '32fedd31dc617be107652e988e6d4d727d6af631059c36007f72d79fc7e071c1',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/01_Metabolic_Health_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 81560,
        sha256: 'd62e961213de532ebda62171f2454245bd1feda18fd65cb3f63adb7bec8cc9f6',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-003',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[2].title'],
    descriptionKeys: ['epigenetics:sheets[2].desc'],
    declaredMetaKeys: ['epigenetics:sheets[2].meta'],
    referenceKeys: ['epigenetics:sheets[2].file'],
    renderedReferenceKeys: ['epigenetics:sheets[2].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/02_Healthy_Aging_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 75500,
        sha256: '7e8b7188fe808d5eaa0b5b966b7b7b3e2fe816069670dfb7f211feb0699c7557',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/02_Healthy_Aging_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 74331,
        sha256: '2c87718703faeb8cb7630868d74ae0af09e21c7e3232abcdd5985f96dec70c0d',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-004',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[3].title'],
    descriptionKeys: ['epigenetics:sheets[3].desc'],
    declaredMetaKeys: ['epigenetics:sheets[3].meta'],
    referenceKeys: ['epigenetics:sheets[3].file'],
    renderedReferenceKeys: ['epigenetics:sheets[3].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/03_Biologisches_Alter_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 81378,
        sha256: 'a9dcd7318291efb12500953e8f38c445302295463e894d0f75296f71161de2be',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/03_Biological_Age_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 80636,
        sha256: '7ffd670f56acf30e3724bdad38ac0c752fc793b90fad8394190f782592602a76',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-005',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[4].title'],
    descriptionKeys: ['epigenetics:sheets[4].desc'],
    declaredMetaKeys: ['epigenetics:sheets[4].meta'],
    referenceKeys: ['epigenetics:sheets[4].file'],
    renderedReferenceKeys: ['epigenetics:sheets[4].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/04_Telomer_Analyse_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 74794,
        sha256: 'aeb33d918c5f66fada8c3338d0a7ca000232092bcebbf3a07594dd7fbc86c5bf',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/04_Telomere_Analysis_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 74037,
        sha256: 'e3fc4fb021bd98d1a76047abbae934b3196d3746d9ce7e538192b285f72892ce',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-006',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[5].title'],
    descriptionKeys: ['epigenetics:sheets[5].desc'],
    declaredMetaKeys: ['epigenetics:sheets[5].meta'],
    referenceKeys: ['epigenetics:sheets[5].file'],
    renderedReferenceKeys: ['epigenetics:sheets[5].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/05_Stress_Monitor_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 80758,
        sha256: '9ec4754fe1249957e72e988dc8ddc886fd1663a3b620db168d8d3ae0850e62ef',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/05_Stress_Monitor_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 80126,
        sha256: 'f12217da9611ff3fe055f739c8d3e367baf694cf29c51c1cd9ff3da5dc08d820',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-007',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[6].title'],
    descriptionKeys: ['epigenetics:sheets[6].desc'],
    declaredMetaKeys: ['epigenetics:sheets[6].meta'],
    referenceKeys: ['epigenetics:sheets[6].file'],
    renderedReferenceKeys: ['epigenetics:sheets[6].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/06_Healthy_Sport_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 82939,
        sha256: 'eaa6d0b3b78a112ad35b314b1bdadfa21ad6ca24e7e54a2f3be7abc363fe8558',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/06_Healthy_Sport_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 82076,
        sha256: '864b01a01e55a88059ce0b9209258e57a3f45453068d3ad7215a7d0054810b9c',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-008',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[7].title'],
    descriptionKeys: ['epigenetics:sheets[7].desc'],
    declaredMetaKeys: ['epigenetics:sheets[7].meta'],
    referenceKeys: ['epigenetics:sheets[7].file'],
    renderedReferenceKeys: ['epigenetics:sheets[7].file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/07_Konditionen_Anfrage_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 71642,
        sha256: 'e1bed1a3c9ba07b5e8143c56b1e441ce6466f548b3463a8d90a717e52738c469',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/07_Terms_Enquiry_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 71358,
        sha256: '73fcc52d4ec0d3dc9b09fa0fcd460376308b18ba2671f429eac4973e70d69653',
        pages: 2,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-009',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:sheets[8].title'],
    descriptionKeys: ['epigenetics:sheets[8].desc'],
    declaredMetaKeys: ['epigenetics:sheets[8].meta'],
    referenceKeys: ['epigenetics:sheets[8].file', 'epigenetics:evidence.file'],
    renderedReferenceKeys: ['epigenetics:sheets[8].file'],
    visibleFrom: [
      'src/pages/EpigeneticsPage.tsx',
      'src/pages/EpigeneticsDocsPage.tsx',
      'src/pages/EpigeneticsEvidencePage.tsx',
    ],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/08_Evidenz_Studienlage_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 81339,
        sha256: '71704a9c4957444f083eb7622f600fbd4ee7a013faaad6083e34de1359e5991a',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/en/08_Evidence_Base_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 79858,
        sha256: '6abac0b680e4669c85d4989ea0ddaefe87f7ed3084c1d550fce9a015ea88081e',
        pages: 3,
        date: '2026-08-05',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-010',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[0].panel'],
    descriptionKeys: ['epigenetics:samples.items[0].what'],
    declaredMetaKeys: ['epigenetics:samples.items[0].pages'],
    referenceKeys: ['epigenetics:samples.items[0].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[0].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/10_Musterbefund_Metabolic_Health_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 1018990,
        sha256: 'd6f94479f044dde02f8d65ce592826106059606c4cf5cfeb0f205a3dca5803da',
        pages: 15,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-011',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[1].panel'],
    descriptionKeys: ['epigenetics:samples.items[1].what'],
    declaredMetaKeys: ['epigenetics:samples.items[1].pages'],
    referenceKeys: ['epigenetics:samples.items[1].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[1].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/11_Musterbefund_Healthy_Aging_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 725693,
        sha256: 'bd36712833b06390c86f58ec4bbe856117c736824c49da4f9750c99a41fc8571',
        pages: 9,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-012',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[2].panel'],
    descriptionKeys: ['epigenetics:samples.items[2].what'],
    declaredMetaKeys: ['epigenetics:samples.items[2].pages'],
    referenceKeys: ['epigenetics:samples.items[2].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[2].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/12_Musterbefund_Biologische_Altersuhr_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 699325,
        sha256: 'bc67a00123b7715e57399ae08b3d0e6d931e533bdda11164005984f412a65793',
        pages: 10,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-013',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[3].panel'],
    descriptionKeys: ['epigenetics:samples.items[3].what'],
    declaredMetaKeys: ['epigenetics:samples.items[3].pages'],
    referenceKeys: ['epigenetics:samples.items[3].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[3].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/13_Musterbefund_Telomer_Analyse_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 640247,
        sha256: 'b3e602c67072bb18400363ccb0c01e2c563ca156073b158bce1f117a4101647b',
        pages: 9,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-014',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[4].panel'],
    descriptionKeys: ['epigenetics:samples.items[4].what'],
    declaredMetaKeys: ['epigenetics:samples.items[4].pages'],
    referenceKeys: ['epigenetics:samples.items[4].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[4].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/14_Musterbefund_Stress_Monitor_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 716851,
        sha256: '0a472712d8402c3fe075d0dc867cbcb9df37515c5f904122c4ddffb39955f43c',
        pages: 9,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-015',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.items[5].panel'],
    descriptionKeys: ['epigenetics:samples.items[5].what'],
    declaredMetaKeys: ['epigenetics:samples.items[5].pages'],
    referenceKeys: ['epigenetics:samples.items[5].file'],
    renderedReferenceKeys: ['epigenetics:samples.items[5].file'],
    visibleFrom: ['src/pages/MusterbefundPage.tsx', 'src/components/befund/BefundBlocks.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/15_Musterbefund_Healthy_Sport_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 842658,
        sha256: '3cc422b7d68cc9901c1fed2e1aaf0877c4c54b03b4c983218b085cd1c7a34ac1',
        pages: 12,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-016',
    domain: 'EPIGENETICS',
    category: 'PARAMETER_GUIDE',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:compare.cta'],
    descriptionKeys: ['epigenetics:compare.lead'],
    declaredMetaKeys: [],
    referenceKeys: ['epigenetics:compare.file'],
    renderedReferenceKeys: ['epigenetics:compare.file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/16_Parameteruebersicht_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 322248,
        sha256: '9e4bed36a1bf45dfa1c5d7582273322f53ab02f5491909802701d6f93641f706',
        pages: 2,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-017',
    domain: 'EPIGENETICS',
    category: 'VALUES_GUIDE',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:basics.cta'],
    descriptionKeys: ['epigenetics:basics.lead'],
    declaredMetaKeys: [],
    referenceKeys: ['epigenetics:basics.file'],
    renderedReferenceKeys: ['epigenetics:basics.file'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/de/17_Werte_verstehen_PolarisDX.pdf',
        mime: 'application/pdf',
        bytes: 400320,
        sha256: '508c9d47717c9820aa15e6c0fc0cabb7ef5021d7385c1859f4c744e12471aad9',
        pages: 5,
        date: '2026-08-10',
        dateEvidence: 'FILE_EMBEDDED',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-018',
    domain: 'EPIGENETICS',
    category: 'INFO_SHEET_BUNDLE',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:downloads.zipLabel'],
    descriptionKeys: ['epigenetics:downloads.sub'],
    declaredMetaKeys: ['epigenetics:downloads.zipLabel'],
    referenceKeys: ['epigenetics:downloads.zipFile'],
    renderedReferenceKeys: ['epigenetics:downloads.zipFile'],
    visibleFrom: ['src/pages/EpigeneticsPage.tsx', 'src/pages/EpigeneticsDocsPage.tsx'],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/PolarisDX_Unterlagen_DE.zip',
        mime: 'application/zip',
        bytes: 603986,
        sha256: '15ad5c69b62ddd1d27e2a26b196666fec680b9a0c94f0d0e5cd288f4ce8ebd21',
        pages: null,
        date: '2026-08-05',
        dateEvidence: 'ARCHIVE_ENTRY',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'epigenetics/PolarisDX_Unterlagen_EN.zip',
        mime: 'application/zip',
        bytes: 595985,
        sha256: 'f0a5526af77e968c340b9e86d2b2ec707dbe4f6efee71731fac95a6e08668c29',
        pages: null,
        date: '2026-08-05',
        dateEvidence: 'ARCHIVE_ENTRY',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-epi-019',
    domain: 'EPIGENETICS',
    category: 'SAMPLE_REPORT_BUNDLE',
    // AP19 PT19.4 — der aktive Lead-Magnet. Gegatet wird bewusst nur das
    // Sammelpaket: alle acht enthaltenen Dokumente bleiben einzeln
    // FREE_PUBLIC. Hinter das Gate wandert also kein Inhalt, sondern die
    // Bequemlichkeit eines einzigen Downloads. Die Datei liegt seither
    // ausschliesslich unter storage/protected/ und ist ueber keine
    // oeffentliche URL erreichbar.
    deliveryClass: 'GATED',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['epigenetics:samples.zipLabel'],
    descriptionKeys: ['epigenetics:downloads.samplesText'],
    declaredMetaKeys: ['epigenetics:samples.zipLabel'],
    // Der Dateiname steht weiter im Locale-Bestand, erzeugt aber keinen
    // oeffentlichen Link mehr: die Auslieferung laeuft ueber die Asset-ID.
    referenceKeys: ['epigenetics:samples.zipFile'],
    renderedReferenceKeys: [],
    visibleFrom: [
      'src/pages/DownloadsPage.tsx',
      'src/pages/EpigeneticsDocsPage.tsx',
      'src/components/sections/EpigeneticsPanels.tsx',
    ],
    legacyCatalogIds: [],
    variants: [
      {
        language: 'de',
        storage: 'PROTECTED',
        path: 'epigenetics/PolarisDX_Musterbefunde_DE.zip',
        mime: 'application/zip',
        bytes: 4262171,
        sha256: '648280b58aced8bb15519c1cc5d15f7d785119dbb3a5ed92df8a77f9e27e0fb4',
        pages: null,
        date: '2026-08-10',
        dateEvidence: 'ARCHIVE_ENTRY',
        version: null,
        languageEvidence: 'TEXT_VERIFIED',
      },
    ],
  },
  {
    id: 'rsc-prd-001',
    domain: 'PRODUCT',
    category: 'PRODUCT_FLYER',
    deliveryClass: 'FREE_PUBLIC',
    lifecycle: 'ACTIVE_VISIBLE',
    labelKeys: ['downloads:assets.vitd3De.title', 'downloads:assets.vitd3En.title'],
    descriptionKeys: [
      'downloads:assets.vitd3De.description',
      'downloads:assets.vitd3En.description',
    ],
    declaredMetaKeys: [],
    referenceKeys: ['catalog:im-vitd3-spray-de', 'catalog:im-vitd3-spray-en'],
    renderedReferenceKeys: ['catalog:im-vitd3-spray-de', 'catalog:im-vitd3-spray-en'],
    visibleFrom: ['src/pages/DownloadsPage.tsx', 'src/pages/VitaminD3SprayPage.tsx'],
    legacyCatalogIds: ['im-vitd3-spray-de', 'im-vitd3-spray-en'],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'vitamin-d3-spray-de.pdf',
        mime: 'application/pdf',
        bytes: 1045006,
        sha256: '1adb74b43e5c27fb4eda5ad1340893dbd70d8c8cc76fd58f7d5676e62a044c68',
        pages: 2,
        date: null,
        dateEvidence: 'NONE',
        version: null,
        languageEvidence: 'CATALOG_ASSERTED',
      },
      {
        language: 'en',
        storage: 'PUBLIC_STATIC',
        path: 'vitamin-d3-spray-en.pdf',
        mime: 'application/pdf',
        bytes: 1014799,
        sha256: 'f0fef6de37fd5135291521ebacfc6f1e7970c817b4404dba285c7ae02a10c704',
        pages: 2,
        date: null,
        dateEvidence: 'NONE',
        version: null,
        languageEvidence: 'CATALOG_ASSERTED',
      },
    ],
  },
  {
    id: 'rsc-prd-002',
    domain: 'PRODUCT',
    category: 'PRODUCT_FLYER',
    deliveryClass: 'NOT_LAUNCH_VISIBLE',
    lifecycle: 'LEGACY_ORPHAN',
    labelKeys: [],
    descriptionKeys: [],
    declaredMetaKeys: [],
    referenceKeys: [],
    renderedReferenceKeys: [],
    visibleFrom: [],
    legacyCatalogIds: ['im-de-igloo-pro'],
    variants: [
      {
        language: 'de',
        storage: 'PUBLIC_STATIC',
        path: 'igloo-pro-flyer.pdf',
        mime: 'application/pdf',
        bytes: 494862,
        sha256: 'ae726928cf750b21df3d409469df97c5f5e55cd11a0b25c938fda680b24a8f7b',
        pages: 2,
        date: null,
        dateEvidence: 'NONE',
        version: null,
        languageEvidence: 'CATALOG_ASSERTED',
      },
    ],
  },
] as const

export const RESOURCE_IDS = RESOURCE_INVENTORY.map((resource) => resource.id)

export const findResource = (id: string): ResourceRecord | undefined =>
  RESOURCE_INVENTORY.find((resource) => resource.id === id)

/** Alle Varianten flach — die Sicht, die Guards und Auslieferung brauchen. */
export const RESOURCE_VARIANTS = RESOURCE_INVENTORY.flatMap((resource) =>
  resource.variants.map((variant) => ({ resource, variant })),
)

/**
 * Sprachmatrix: welche Ressource liegt in welchen Sprachen real vor.
 * Sie sagt nichts ueber die zehn UI-Locales aus — die Web-x10-Oberflaeche ist
 * davon unabhaengig und darf keine Asset-Parität behaupten, die es nicht gibt.
 */
export const resourceLanguages = (resource: ResourceRecord): ResourceAssetLanguage[] =>
  resource.variants.map((variant) => variant.language)

/** True, wenn eine Ressource nur auf Deutsch existiert und deshalb offengelegt werden muss. */
export const requiresLanguageDisclosure = (resource: ResourceRecord): boolean =>
  !resource.variants.some((variant) => variant.language === 'en')
