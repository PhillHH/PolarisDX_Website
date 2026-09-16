/**
 * AP23 PT23.5 — die Entscheidung ueber technische Telemetrie, als Code.
 *
 * Bis hierhin stand sie nur in Prosa im Vertrag: „es ist kein Transport
 * registriert, und bevor einer kommt, braucht es Zweck, Datenkatalog,
 * Empfaenger, Auftragsverarbeitung, Speicherdauer und eine
 * Consent-Entscheidung." Eine Regel, die nur in einem Dokument steht, haelt
 * genau bis zu dem Tag, an dem jemand unter Zeitdruck einen RUM-Dienst
 * einhaengt — und dann ist die Entscheidung nicht getroffen, sondern
 * uebersprungen worden.
 *
 * Dieses Modul macht sie pruefbar. Es SENDET nichts und kennt keinen
 * Anbieter; es beantwortet genau eine Frage: **darf hier ueberhaupt ein
 * Transport registriert werden — und wenn nein, warum nicht.**
 *
 * Die Antwort blockiert keinen sicheren Codepfad. Ohne Transport laeuft die
 * Erhebung im Browser weiter und meldet an eine Senke, die es nicht gibt —
 * der datensparsamste Zustand, den es geben kann.
 */

/** Wie weit technische Telemetrie das Geraet verlassen darf. */
export type TelemetryScope =
  /** Nichts verlaesst den Browser. Auslieferungszustand. */
  | 'NONE'
  /** Eigener Endpunkt derselben Herkunft, kein Drittanbieter. */
  | 'FIRST_PARTY'
  /** Externer Dienst (RUM, Fehlerdienst). Braucht eine Policy-Entscheidung. */
  | 'THIRD_PARTY'

export const TELEMETRY_SCOPES: readonly TelemetryScope[] = [
  'NONE',
  'FIRST_PARTY',
  'THIRD_PARTY',
] as const

/**
 * Die Belege, die eine Aktivierung braucht. Kein Feld davon wird hier
 * erfunden — sie werden GESETZT, wenn die Entscheidung wirklich vorliegt.
 */
export interface TelemetryPolicyEvidence {
  /** Zweck, Datenkatalog und technische Notwendigkeit dokumentiert. */
  purposeDocumented: boolean
  /** Empfaenger benannt und Auftragsverarbeitung geklaert. */
  processorAgreed: boolean
  /** Speicherdauer festgelegt. */
  retentionDefined: boolean
  /** In der Datenschutzerklaerung genannt. */
  privacyNoticeUpdated: boolean
}

export interface TelemetryPolicy {
  scope: TelemetryScope
  evidence: TelemetryPolicyEvidence
  /** Wie sich die Umgebung benennt: `production`, `preview`, … */
  environment: string
}

export type TelemetryGateReason =
  /** Kein Transport gewuenscht — der Auslieferungszustand. */
  | 'NO_TRANSPORT_CONFIGURED'
  /** Externer Dienst ohne vollstaendige Entscheidung. */
  | 'BLOCKED_POLICY_DECISION'
  /** Vorschau ohne eigenen Endpunkt. */
  | 'BLOCKED_PREVIEW_ISOLATION'
  /** Freigegeben. */
  | 'ALLOWED'

export interface TelemetryGate {
  allowed: boolean
  reason: TelemetryGateReason
  /** Was fehlt, in Worten — fuer die Betriebssicht, ohne Werte. */
  missing: readonly (keyof TelemetryPolicyEvidence)[]
}

type EnvLike = Record<string, string | boolean | undefined>

const NON_PRODUCTION = ['preview', 'staging'] as const

function readEnv(): EnvLike {
  try {
    return (import.meta.env ?? {}) as EnvLike
  } catch {
    return {}
  }
}

const flag = (value: unknown) => value === true || value === 'true' || value === '1'

/**
 * Die geltende Politik aus der Umgebung.
 *
 * Standard ist `NONE` — nicht, weil nichts konfiguriert waere, sondern weil
 * das die einzige Voreinstellung ist, die ohne Entscheidung vertretbar ist.
 */
export function resolveTelemetryPolicy(env: EnvLike = readEnv()): TelemetryPolicy {
  const roh = String(env.VITE_TELEMETRY_SCOPE ?? '')
    .trim()
    .toUpperCase()
  const scope = (TELEMETRY_SCOPES as readonly string[]).includes(roh)
    ? (roh as TelemetryScope)
    : 'NONE'

  return {
    scope,
    evidence: {
      purposeDocumented: flag(env.VITE_TELEMETRY_PURPOSE_DOCUMENTED),
      processorAgreed: flag(env.VITE_TELEMETRY_PROCESSOR_AGREED),
      retentionDefined: flag(env.VITE_TELEMETRY_RETENTION_DEFINED),
      privacyNoticeUpdated: flag(env.VITE_TELEMETRY_PRIVACY_NOTICE_UPDATED),
    },
    environment:
      String(env.VITE_APP_ENV ?? env.APP_ENV ?? '')
        .trim()
        .toLowerCase() || 'undeclared',
  }
}

/**
 * Darf ein Transport registriert werden?
 *
 * Drei Gruende, an denen es scheitern kann, und jeder ist ein anderer:
 *
 *  1. **`NO_TRANSPORT_CONFIGURED`** — niemand wollte einen. Kein Mangel,
 *     sondern der Auslieferungszustand.
 *  2. **`BLOCKED_POLICY_DECISION`** — ein EXTERNER Dienst ist gewuenscht,
 *     aber die Entscheidung ist unvollstaendig. `missing` sagt, was fehlt.
 *     Ein eigener Endpunkt derselben Herkunft braucht diese Belege NICHT in
 *     derselben Tiefe: es gibt keinen Dritten, keine Auftragsverarbeitung
 *     und keinen Drittlandtransfer.
 *  3. **`BLOCKED_PREVIEW_ISOLATION`** — eine Vorschau ohne eigenen Endpunkt.
 *     Dieselbe Regel wie bei den Marketingkennungen (PT23.4): Messwerte aus
 *     einer Vorschau in derselben Auswertung wie echte Besuche sind
 *     hinterher nicht mehr auseinanderzuhalten.
 */
export function mayRegisterTelemetryTransport(
  policy: TelemetryPolicy,
  options: { hasDedicatedPreviewEndpoint?: boolean } = {},
): TelemetryGate {
  if (policy.scope === 'NONE') {
    return { allowed: false, reason: 'NO_TRANSPORT_CONFIGURED', missing: [] }
  }

  if (policy.scope === 'THIRD_PARTY') {
    const missing = (Object.keys(policy.evidence) as (keyof TelemetryPolicyEvidence)[]).filter(
      (key) => policy.evidence[key] !== true,
    )
    if (missing.length > 0) {
      return { allowed: false, reason: 'BLOCKED_POLICY_DECISION', missing }
    }
  }

  const istVorschau = (NON_PRODUCTION as readonly string[]).includes(policy.environment)
  if (istVorschau && options.hasDedicatedPreviewEndpoint !== true) {
    return { allowed: false, reason: 'BLOCKED_PREVIEW_ISOLATION', missing: [] }
  }

  return { allowed: true, reason: 'ALLOWED', missing: [] }
}

/**
 * Ehrlicher Bericht fuer die Betriebssicht. Gibt KEINE Adresse und keinen
 * Anbieternamen aus — nur den Zustand der Entscheidung.
 */
export function describeTelemetryPolicy(env: EnvLike = readEnv()): {
  scope: TelemetryScope
  environment: string
  transport: TelemetryGateReason
  missing: readonly (keyof TelemetryPolicyEvidence)[]
} {
  const policy = resolveTelemetryPolicy(env)
  const gate = mayRegisterTelemetryTransport(policy)
  return {
    scope: policy.scope,
    environment: policy.environment,
    transport: gate.reason,
    missing: gate.missing,
  }
}
