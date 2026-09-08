/**
 * Lead-Magnet-Kandidatenmatrix (AP19 PT19.4).
 *
 * Diese Datei beantwortet EINE Frage je realem Kandidaten: taugt er als
 * gegateter Lead-Magnet, und wenn nicht — warum nicht?
 *
 * Sie erfindet keinen Kandidaten, um eine Mindestzahl zu erreichen. Was hier
 * steht, existiert: jede `assetId` ist eine reale Ressource aus
 * `resourceInventory.ts`, und der eine Eintrag ohne Asset-ID sagt genau das.
 *
 * Die Auslieferungsklasse selbst steht NICHT hier — sie steht im Inventar.
 * Diese Matrix begruendet die Entscheidung; `assertCandidateMatrix()` haelt
 * beide zusammen, damit eine Begruendung nicht von der Wirklichkeit abdriften
 * kann.
 */

import { RESOURCE_INVENTORY, findResource, type ResourceRecord } from './resourceInventory'

/** Der aktive Lead-Magnet. Eine Konstante, damit ihn keine Seite abtippt. */
export const SAMPLE_BUNDLE_ASSET_ID = 'rsc-epi-019'

export type CandidateStatus =
  | 'GATED_LAUNCH_ACTIVE'
  | 'FREE_LAUNCH_ACTIVE'
  | 'READY_NOT_ACTIVE'
  | 'DEFERRED'
  | 'NOT_EXISTS'

export type DeliveryMethod = 'PROTECTED_LINK' | 'PUBLIC_STATIC' | 'TRANSACTIONAL_MAIL' | 'NONE'

export interface LeadMagnetCandidate {
  readonly key: string
  /** `null` nur dort, wo es wirklich kein Asset gibt. */
  readonly assetId: string | null
  readonly audience: string
  readonly useCase: string
  readonly status: CandidateStatus
  /** Ist die x10-Gate-Copy fuer diesen Kandidaten vorhanden? */
  readonly gateCopyReady: boolean
  readonly deliveryMethod: DeliveryMethod
  /** CRM-Ziel der Journey, oder warum es keines gibt. */
  readonly crmContext: string
  /** Kann die Ressource an einem Gate vorbei oeffentlich geholt werden? */
  readonly bypassState: 'NOT_APPLICABLE_FREE' | 'PROTECTED_NO_BYPASS' | 'PUBLIC_BY_DESIGN'
  readonly rationale: string
}

export const LEAD_MAGNET_CANDIDATES: readonly LeadMagnetCandidate[] = [
  {
    key: 'sample-report-bundle',
    assetId: SAMPLE_BUNDLE_ASSET_ID,
    audience: 'Fachanwender in Praxis, Klinik und Beratung',
    useCase:
      'Acht vollstaendige Musterbefunde und Leitfaeden am Stueck — die Unterlage, die im Auswahlgespraech tatsaechlich gebraucht wird.',
    status: 'GATED_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PROTECTED_LINK',
    crmContext: 'content_download → resources',
    bypassState: 'PROTECTED_NO_BYPASS',
    rationale:
      'Hoechster Fachwert im Bestand und der einzige Kandidat, bei dem ein Gate nichts wegnimmt: alle acht enthaltenen Dokumente bleiben einzeln frei abrufbar. Gegatet ist die Bequemlichkeit, nicht die Information.',
  },
  {
    key: 'info-sheet-bundle',
    assetId: 'rsc-epi-018',
    audience: 'Fachanwender, Erstkontakt',
    useCase: 'Die neun Infoblaetter am Stueck, DE und EN.',
    status: 'READY_NOT_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'content_download → resources (bei Aktivierung)',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Technisch sofort gate-faehig — zweisprachig, klar abgegrenzt. Bleibt bewusst frei: das Paket ist der Einstiegskontakt in die Strecke, und zwei Gates hintereinander wuerden denselben Leser zweimal ausbremsen. Aktivierbar ohne Codeaenderung.',
  },
  {
    key: 'epigenetics-info-sheets',
    assetId: 'rsc-epi-001',
    audience: 'Fachanwender, Vertiefung je Panel',
    useCase: 'Neun Einzelblaetter zu Portfolio, Panels, Konditionen und Studienlage.',
    status: 'FREE_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'keiner — freie Auslieferung ohne Lead',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Argumentationsmaterial fuer die Strecke selbst. Ein Gate davor kostet Reichweite genau dort, wo ueberzeugt wird. Stellvertretend fuer rsc-epi-001 bis rsc-epi-009.',
  },
  {
    key: 'sample-reports-single',
    assetId: 'rsc-epi-010',
    audience: 'Fachanwender, konkrete Befundbewertung',
    useCase: 'Sechs vollstaendige Musterbefunde einzeln, je Panel.',
    status: 'FREE_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'keiner — freie Auslieferung ohne Lead',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Bleiben frei, damit das Gate auf dem Sammelpaket ehrlich ist: niemand muss Daten hinterlassen, um einen Musterbefund zu sehen. Stellvertretend fuer rsc-epi-010 bis rsc-epi-015.',
  },
  {
    key: 'parameter-guide',
    assetId: 'rsc-epi-016',
    audience: 'Fachanwender, Methodenvergleich',
    useCase: 'Parameteruebersicht der sechs Panels.',
    status: 'FREE_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'keiner — freie Auslieferung ohne Lead',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Nur auf Deutsch verfuegbar und eng an der Vergleichstabelle der Programmseite. Als eigenstaendiger Lead-Magnet zu schmal.',
  },
  {
    key: 'values-guide',
    assetId: 'rsc-epi-017',
    audience: 'Fachanwender und Patientengespraech',
    useCase: '"Werte verstehen" — Einordnung der Messgroessen.',
    status: 'FREE_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'keiner — freie Auslieferung ohne Lead',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Erklaerungsmaterial mit Aufklaerungscharakter. Ein Gate davor waere gegenueber dem Patientengespraech schwer zu rechtfertigen.',
  },
  {
    key: 'product-flyer-vitd3',
    assetId: 'rsc-prd-001',
    audience: 'Endkunde und Handel',
    useCase: 'Produktflyer Vitamin D3+K2 Spray, DE und EN.',
    status: 'FREE_LAUNCH_ACTIVE',
    gateCopyReady: true,
    deliveryMethod: 'PUBLIC_STATIC',
    crmContext: 'keiner — freie Auslieferung ohne Lead',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Consumer-Produktwerbung. Ein Formular vor einem Werbeflyer bringt keinen qualifizierten Fachlead und kostet Konversion.',
  },
  {
    key: 'igloo-pro-flyer',
    assetId: 'rsc-prd-002',
    audience: 'Fachanwender, POC-Reader',
    useCase: 'IglooPro Systemflyer.',
    status: 'DEFERRED',
    gateCopyReady: false,
    deliveryMethod: 'NONE',
    crmContext: 'keiner — nicht launchsichtbar',
    bypassState: 'NOT_APPLICABLE_FREE',
    rationale:
      'Bildbasierter Altbestand mit ungepruefen technischen Angaben, in PT14.4 entlinkt und weiterhin OWNER_BOUND_AP14. Ein nicht freigegebenes Dokument zum Lead-Magneten zu machen, waere die falsche Reihenfolge.',
  },
  {
    key: 'roi-report',
    assetId: null,
    audience: 'Praxis- und Klinikleitung',
    useCase: 'Wirtschaftlichkeitsrechnung aus dem ROI-Rechner, als PDF per Mail.',
    status: 'DEFERRED',
    gateCopyReady: false,
    deliveryMethod: 'TRANSACTIONAL_MAIL',
    crmContext: 'keiner — Legacy-Mailendpunkt ohne Lead-Persistenz',
    bypassState: 'PUBLIC_BY_DESIGN',
    rationale:
      'Existiert real als `/api/roi-report`, erzeugt aber KEIN statisches Asset: das PDF wird je Eingabe erzeugt und per Mail zugestellt. Es hat deshalb keine Asset-ID und passt nicht in die content_download-Journey. Der Pfad ist bereits e-mail-gegatet, aber ohne durable Persistenz, Outbox und Retry — die Umstellung auf die geteilte Foundation ist eine Journey-Migration und gehoert zu AP22, nicht zu AP19.',
  },
] as const

/**
 * Haelt Matrix und Inventar zusammen.
 *
 * Ohne diese Pruefung koennte hier `GATED_LAUNCH_ACTIVE` stehen, waehrend die
 * Ressource in Wahrheit oeffentlich ausgeliefert wird — genau die Art
 * Falschmeldung, die dieser Vertrag verhindern soll.
 */
export function assertCandidateMatrix(): string[] {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const candidate of LEAD_MAGNET_CANDIDATES) {
    if (seen.has(candidate.key)) problems.push(`Doppelter Kandidat: ${candidate.key}`)
    seen.add(candidate.key)

    if (candidate.assetId === null) {
      if (candidate.status !== 'DEFERRED' && candidate.status !== 'NOT_EXISTS') {
        problems.push(`${candidate.key}: ohne Asset-ID nur DEFERRED oder NOT_EXISTS zulaessig`)
      }
      continue
    }

    const resource = findResource(candidate.assetId)
    if (!resource) {
      problems.push(`${candidate.key}: Asset-ID existiert nicht (${candidate.assetId})`)
      continue
    }
    problems.push(...describeMismatch(candidate, resource))
  }

  // Jede aktive Auslieferungsklasse im Inventar braucht eine Begruendung.
  const covered = new Set(LEAD_MAGNET_CANDIDATES.map((candidate) => candidate.assetId))
  const gatedWithoutCandidate = RESOURCE_INVENTORY.filter(
    (resource) => resource.deliveryClass === 'GATED' && !covered.has(resource.id),
  )
  for (const resource of gatedWithoutCandidate) {
    problems.push(`${resource.id}: GATED ohne Eintrag in der Kandidatenmatrix`)
  }

  if (!LEAD_MAGNET_CANDIDATES.some((candidate) => candidate.status === 'GATED_LAUNCH_ACTIVE')) {
    problems.push('Kein aktiver gegateter Lead-Magnet')
  }
  return problems
}

function describeMismatch(candidate: LeadMagnetCandidate, resource: ResourceRecord): string[] {
  const problems: string[] = []
  const gatedInInventory = resource.deliveryClass === 'GATED'

  if (candidate.status === 'GATED_LAUNCH_ACTIVE') {
    if (!gatedInInventory)
      problems.push(`${candidate.key}: als aktiv gegatet gefuehrt, aber nicht GATED`)
    if (candidate.deliveryMethod !== 'PROTECTED_LINK') {
      problems.push(`${candidate.key}: aktiv gegatet ohne geschuetzte Auslieferung`)
    }
    if (candidate.bypassState !== 'PROTECTED_NO_BYPASS') {
      problems.push(`${candidate.key}: aktiv gegatet mit offenem Bypass-Zustand`)
    }
    if (!candidate.gateCopyReady) problems.push(`${candidate.key}: aktiv gegatet ohne Gate-Copy`)
    if (resource.variants.some((variant) => variant.storage !== 'PROTECTED')) {
      problems.push(`${candidate.key}: aktiv gegatet ohne geschuetzte Ablage`)
    }
  } else if (gatedInInventory) {
    problems.push(`${candidate.key}: im Inventar GATED, in der Matrix ${candidate.status}`)
  }

  if (candidate.status === 'FREE_LAUNCH_ACTIVE' || candidate.status === 'READY_NOT_ACTIVE') {
    if (resource.deliveryClass !== 'FREE_PUBLIC') {
      problems.push(`${candidate.key}: als frei gefuehrt, im Inventar ${resource.deliveryClass}`)
    }
    if (resource.lifecycle !== 'ACTIVE_VISIBLE') {
      problems.push(`${candidate.key}: als aktiv gefuehrt, im Inventar ${resource.lifecycle}`)
    }
  }

  if (candidate.status === 'DEFERRED' && resource.lifecycle === 'ACTIVE_VISIBLE') {
    problems.push(`${candidate.key}: zurueckgestellt, aber launchsichtbar`)
  }
  return problems
}
