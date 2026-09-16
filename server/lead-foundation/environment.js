/**
 * AP22 PT22.8 — welche Umgebung laeuft hier, und darf sie zustellen?
 *
 * Der Befund, der dieses Modul noetig macht: `DRY_RUN` war ein reiner
 * Startparameter der Preview-Instanz. Wer ihn vergisst, betreibt eine
 * Preview-Umgebung mit einem echten Providerschluessel — und schickt echte
 * Mail an echte Menschen. `DEPLOYMENT-CONTRACT.md` DD-11 haelt genau das
 * fest: „`DRY_RUN` nur als Startparameter, in keiner Konfigurationsdatei
 * deklariert".
 *
 * Was hier NICHT behauptet wird: dass eine falsch konfigurierte Umgebung
 * technisch unmoeglich waere. `NODE_ENV` kann das nicht leisten — die
 * Preview-Instanz laeuft laut Runbook selbst mit `NODE_ENV=production`, weil
 * sie einen Produktionsbuild bedient. Eine Umgebung, die sich nicht
 * benennt, ist von der Produktion nicht unterscheidbar.
 *
 * Deshalb zwei Schichten:
 *
 *  1. **Erzwingung, wo die Umgebung sich benennt.** `APP_ENV=preview` oder
 *     `staging` schaltet den Trockenlauf ZWINGEND ein. `DRY_RUN=0` hebt das
 *     nicht auf — eine Umgebung, die sich als Vorschau ausweist, darf keinen
 *     Weg haben, doch zuzustellen.
 *  2. **Sichtbarkeit, wo sie es nicht tut.** `describeRuntimeIsolation()`
 *     meldet die Kombinationen, die betrieblich falsch sind: Vorschau mit
 *     Live-Zustellung, Produktion im Trockenlauf, undeklarierte Umgebung mit
 *     Providerschluessel. Ein Fehlbetrieb wird damit gemeldet, statt still zu
 *     bleiben.
 */

const RUNTIME_ENVIRONMENTS = Object.freeze({
  PRODUCTION: 'production',
  PREVIEW: 'preview',
  STAGING: 'staging',
  DEVELOPMENT: 'development',
  TEST: 'test',
})

/** Umgebungen, in denen echte Nebenwirkungen ausgeschlossen sein muessen. */
const NON_PRODUCTION_ENVIRONMENTS = Object.freeze([
  RUNTIME_ENVIRONMENTS.PREVIEW,
  RUNTIME_ENVIRONMENTS.STAGING,
])

const ALIASES = Object.freeze({
  prod: RUNTIME_ENVIRONMENTS.PRODUCTION,
  production: RUNTIME_ENVIRONMENTS.PRODUCTION,
  preview: RUNTIME_ENVIRONMENTS.PREVIEW,
  stage: RUNTIME_ENVIRONMENTS.STAGING,
  staging: RUNTIME_ENVIRONMENTS.STAGING,
  dev: RUNTIME_ENVIRONMENTS.DEVELOPMENT,
  development: RUNTIME_ENVIRONMENTS.DEVELOPMENT,
  test: RUNTIME_ENVIRONMENTS.TEST,
})

const isTruthyFlag = (value) => value === '1' || value === 'true'

/**
 * Die Umgebung, wie sie sich SELBST benennt.
 *
 * `APP_ENV`/`DEPLOY_ENV` haben Vorrang vor `NODE_ENV`, weil `NODE_ENV`
 * beschreibt, wie gebaut wurde — nicht, wo es laeuft. `declared` haelt
 * fest, ob es eine ausdrueckliche Angabe gab; ohne sie ist eine
 * Preview-Instanz von der Produktion nicht zu unterscheiden.
 */
function resolveRuntimeEnvironment(env = process.env) {
  const explicit = String(env.APP_ENV || env.DEPLOY_ENV || '')
    .trim()
    .toLowerCase()
  if (explicit && ALIASES[explicit]) {
    return {
      environment: ALIASES[explicit],
      declared: true,
      source: env.APP_ENV ? 'APP_ENV' : 'DEPLOY_ENV',
    }
  }
  const nodeEnv = String(env.NODE_ENV || '')
    .trim()
    .toLowerCase()
  return {
    environment: ALIASES[nodeEnv] || RUNTIME_ENVIRONMENTS.DEVELOPMENT,
    declared: false,
    source: 'NODE_ENV',
  }
}

/**
 * Darf in dieser Umgebung wirklich zugestellt werden?
 *
 * @returns `{ dryRun, forced, reason, environment, declared }` —
 *   `forced` heisst: die Entscheidung haengt an der Umgebung und ist durch
 *   kein Flag aufhebbar.
 */
function resolveDeliveryMode(env = process.env) {
  const { environment, declared, source } = resolveRuntimeEnvironment(env)
  if (NON_PRODUCTION_ENVIRONMENTS.includes(environment)) {
    return {
      dryRun: true,
      forced: true,
      reason: 'NON_PRODUCTION_ENVIRONMENT',
      environment,
      declared,
      source,
    }
  }
  if (isTruthyFlag(env.DRY_RUN)) {
    return { dryRun: true, forced: false, reason: 'DRY_RUN_FLAG', environment, declared, source }
  }
  return { dryRun: false, forced: false, reason: 'LIVE_DELIVERY', environment, declared, source }
}

/**
 * Betrieblich falsche Kombinationen — als Befunde, nicht als Ausnahme.
 *
 * Ein `throw` beim Start waere hier falsch: eine Produktionsinstanz, die
 * wegen einer fehlenden Variable gar nicht startet, verliert Anfragen. Die
 * Befunde gehen stattdessen in die Betriebssicht und in die Alarme.
 */
function describeRuntimeIsolation(env = process.env) {
  const mode = resolveDeliveryMode(env)
  const providerConfigured = Boolean(String(env.SENDGRID_API_KEY || '').trim())
  const findings = []

  if (NON_PRODUCTION_ENVIRONMENTS.includes(mode.environment) && !mode.dryRun) {
    findings.push({
      code: 'PREVIEW_WITH_LIVE_DELIVERY',
      severity: 'critical',
      detail: 'Vorschau-/Staging-Umgebung ohne Trockenlauf.',
    })
  }
  if (mode.environment === RUNTIME_ENVIRONMENTS.PRODUCTION && mode.dryRun) {
    findings.push({
      code: 'PRODUCTION_IN_DRY_RUN',
      severity: 'critical',
      // Kein Datenverlust — die Vorgaenge bleiben gespeichert und
      // wiedervorlagefaehig. Aber niemand liest sie.
      detail: 'Produktion stellt nichts zu; Vorgaenge bleiben liegen.',
    })
  }
  // AP26 PT26.4 — gemessen: die Preview-Instanz traegt denselben Providerschluessel wie
  // die Produktion und verlaesst sich allein auf den Trockenlauf. Ein Trockenlauf braucht
  // keinen Schluessel; wer einen mitgibt, ist ein Konfigurationsschritt von echter
  // Zustellung mit Produktions-Credentials entfernt.
  if (mode.dryRun && providerConfigured) {
    findings.push({
      code: 'DRY_RUN_WITH_PROVIDER_CREDENTIAL',
      severity: 'warning',
      detail: 'Trockenlauf mit gesetztem Providerschluessel; die Umgebung braucht keinen.',
    })
  }
  if (!mode.declared && providerConfigured) {
    findings.push({
      code: 'UNDECLARED_ENVIRONMENT_WITH_PROVIDER',
      severity: 'warning',
      detail:
        'APP_ENV ist nicht gesetzt; eine Vorschau waere von der Produktion nicht zu unterscheiden.',
    })
  }

  return {
    environment: mode.environment,
    declared: mode.declared,
    environmentSource: mode.source,
    dryRun: mode.dryRun,
    dryRunForced: mode.forced,
    dryRunReason: mode.reason,
    providerConfigured,
    findings,
  }
}

module.exports = {
  NON_PRODUCTION_ENVIRONMENTS,
  RUNTIME_ENVIRONMENTS,
  describeRuntimeIsolation,
  resolveDeliveryMode,
  resolveRuntimeEnvironment,
}
