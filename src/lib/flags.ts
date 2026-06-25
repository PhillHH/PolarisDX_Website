/**
 * lib/flags.ts — Feature-Flags (Foundation-Stub, §1.17)
 *
 * Risikoreiche / annahmebasierte UI-Aenderungen laufen hinter einem Flag und
 * werden zuerst fuer ein kleines Subset ausgerollt (Searcher statt Planner).
 * Defaults sind konservativ (aus = bestehendes Verhalten).
 *
 * Erweitern: Flag hier als `false`-Default ergaenzen, im Code via `flags.<name>`
 * lesen, und als „assumption — needs validation" markieren.
 */

export interface FeatureFlags {
  /** Beispiel-Platzhalter; durch echte Flags ersetzen, sobald Phase 5/6 sie braucht. */
  readonly placeholder: boolean
}

export const flags: FeatureFlags = {
  placeholder: false,
}

export const isEnabled = (name: keyof FeatureFlags): boolean => flags[name]
