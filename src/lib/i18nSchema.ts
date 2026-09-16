/**
 * AP27 PT27.1 — Schema-Vergleich fuer Locale-Dateien.
 *
 * Aus `scripts/check-i18n.ts` (G4-Guard) herausgeloest, damit die Erkennung fehlender,
 * unerwarteter und typverschiedener Keys als schneller Unit-Test beweisbar ist. Der Guard
 * benutzt genau diese Funktionen — es gibt keine zweite Implementierung, die auseinanderlaufen
 * koennte. Keine Dateisystemzugriffe: Einlesen bleibt Sache des Guards.
 */

export type LocaleJson =
  | null
  | boolean
  | number
  | string
  | LocaleJson[]
  | { [key: string]: LocaleJson }

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/

/**
 * Pluralformen sind sprachabhaengig (`pl`/`cs` brauchen `_few`/`_many`, `de` nicht). Fuer das
 * Schema zaehlt deshalb nur der Stamm; sonst meldete der Guard jede korrekte Pluralform als Drift.
 */
export function normalizedLocaleKey(key: string): string {
  return key.replace(PLURAL_SUFFIX, '')
}

/** Pfad → Blatttyp. `_translationStatus` ist ein Marker, kein Inhalt, und zaehlt nicht. */
export function flattenLocaleSchema(
  value: LocaleJson,
  prefix = '',
  out = new Map<string, string>(),
): Map<string, string> {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => flattenLocaleSchema(entry, `${prefix}[${index}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (key === '_translationStatus') continue
      const path = prefix ? `${prefix}.${normalizedLocaleKey(key)}` : normalizedLocaleKey(key)
      flattenLocaleSchema(entry, path, out)
    }
  } else {
    out.set(prefix, value === null ? 'null' : typeof value)
  }
  return out
}

export type LocaleSchemaIssue =
  | { kind: 'missing'; path: string }
  | { kind: 'type'; path: string; expected: string; actual: string }
  | { kind: 'unexpected'; path: string }

/**
 * Abweichungen eines Kandidaten gegen die Schemareferenz, in stabiler Reihenfolge: zuerst die
 * Referenzpfade (fehlend oder anderer Typ), danach Pfade, die nur der Kandidat kennt.
 */
export function findLocaleSchemaDrift(
  reference: LocaleJson,
  candidate: LocaleJson,
): LocaleSchemaIssue[] {
  const left = flattenLocaleSchema(reference)
  const right = flattenLocaleSchema(candidate)
  const issues: LocaleSchemaIssue[] = []
  for (const [path, type] of left) {
    const actual = right.get(path)
    if (actual === undefined) issues.push({ kind: 'missing', path })
    else if (actual !== type) issues.push({ kind: 'type', path, expected: type, actual })
  }
  for (const path of right.keys()) {
    if (!left.has(path)) issues.push({ kind: 'unexpected', path })
  }
  return issues
}

/**
 * Welche Namespace-Dateien einer Locale fehlen oder keiner Klasse (produktiv, Legacy, Backlog,
 * Owner-verschoben) zugeordnet sind. Eine unklassifizierte Datei waere ein stiller Nebenweg.
 */
export function findNamespaceFileDrift(
  files: readonly string[],
  classified: ReadonlySet<string>,
): { unclassified: string[]; missing: string[] } {
  return {
    unclassified: files.filter((namespace) => !classified.has(namespace)),
    missing: [...classified].filter((namespace) => !files.includes(namespace)),
  }
}
