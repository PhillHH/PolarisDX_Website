/**
 * AP22 PT22.4 — Betriebswerkzeug fuer die Lead-Warteschlange.
 *
 * Bewusst eine CLI und KEIN HTTP-Endpunkt. Eine Betriebssicht auf Vorgaenge
 * und ein Knopf "nochmal zustellen" brauchen Autorisierung; ein neuer
 * ungeschuetzter Endpunkt waere eine zusaetzliche Angriffsflaeche fuer genau
 * die Daten, die AP22 gerade schuetzt. Wer diese CLI ausfuehren kann, hat
 * bereits Zugriff auf den Server und die Datenbank.
 *
 * AP22 PT22.8 erweitert dasselbe Werkzeug um Datenschutz und Sicherung —
 * ausdruecklich hier und nicht als zweites Produkt. Wer eine Auskunft
 * erteilen oder loeschen darf, ist dieselbe Person, die schon heute die
 * Warteschlange bedient; ein eigener Admin-Dienst waere eine zusaetzliche
 * Angriffsflaeche fuer genau die Daten, um deren Schutz es geht.
 *
 * Aufrufe:
 *   node scripts/lead-ops.mjs metrics
 *   node scripts/lead-ops.mjs dead-letters [--journey=support] [--limit=50]
 *   node scripts/lead-ops.mjs reconciliation
 *   node scripts/lead-ops.mjs requeue --lead=<id> --actor=<name> --reason="<grund>"
 *   node scripts/lead-ops.mjs alerts
 *   node scripts/lead-ops.mjs isolation
 *   node scripts/lead-ops.mjs retention-policy
 *   node scripts/lead-ops.mjs retention [--apply] [--limit=500]
 *   node scripts/lead-ops.mjs dsar-lookup --email=<adresse>
 *   node scripts/lead-ops.mjs dsar-export --email=<adresse>
 *   node scripts/lead-ops.mjs dsar-erase  --email=<adresse> --actor=<name> --reason="<grund>"
 *   node scripts/lead-ops.mjs legal-hold  --lead=<id> --until=YYYY-MM-DD|none --actor=<n> --reason="<g>"
 *   node scripts/lead-ops.mjs backup --out=<pfad>
 *
 * `requeue` ist ausdruecklich, protokolliert und wiederholungssicher: Person
 * und Grund sind Pflicht, es wirkt nur aus einem Endzustand, und ein zweiter
 * Aufruf fuer denselben, bereits wartenden Vorgang tut nichts. Dasselbe gilt
 * fuer `dsar-erase` und `legal-hold`.
 *
 * `retention` LOESCHT NICHTS, solange `--apply` fehlt: der Standardlauf
 * berichtet, was faellig waere. `dsar-export` gibt personenbezogene Daten aus
 * — die Ausgabe gehoert in eine Datei mit passenden Rechten, nicht in ein
 * geteiltes Terminalprotokoll.
 */

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  LeadPrivacyService,
  LeadRepository,
  createLeadBackup,
  describeBackupScope,
  describeRuntimeIsolation,
  evaluateAlerts,
  openLeadDatabase,
  resolveRetentionPolicy,
  retentionDaysFromPolicy,
  runRetention,
} = require('../server/lead-foundation')

const args = process.argv.slice(2)
const command = args[0]
const flag = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : undefined
}
const has = (name) => args.includes(`--${name}`)

const usage = () => {
  console.error(
    [
      'Nutzung:',
      '  lead-ops metrics',
      '  lead-ops dead-letters [--journey=<journey>] [--limit=<n>]',
      '  lead-ops reconciliation',
      '  lead-ops requeue --lead=<id> --actor=<name> --reason="<grund>"',
      '  lead-ops alerts',
      '  lead-ops isolation',
      '  lead-ops retention-policy',
      '  lead-ops retention [--apply] [--limit=<n>]',
      '  lead-ops dsar-lookup --email=<adresse>',
      '  lead-ops dsar-export --email=<adresse>',
      '  lead-ops dsar-erase --email=<adresse> --actor=<name> --reason="<grund>"',
      '  lead-ops legal-hold --lead=<id> --until=<YYYY-MM-DD|none> --actor=<name> --reason="<grund>"',
      '  lead-ops backup --out=<pfad>',
    ].join('\n'),
  )
  process.exit(2)
}

if (!command) usage()

const db = openLeadDatabase()
const retentionPolicy = resolveRetentionPolicy(process.env)
const repository = new LeadRepository(db, {
  retentionPolicy: retentionDaysFromPolicy(retentionPolicy),
})
const privacy = () =>
  new LeadPrivacyService({
    repository,
    storageRoot: process.env.SUPPORT_UPLOAD_DIR || null,
  })

try {
  if (command === 'metrics') {
    console.log(JSON.stringify(repository.collectQueueMetrics(), null, 2))
  } else if (command === 'dead-letters') {
    const rows = repository.findDeadLetters({
      journey: flag('journey') ?? null,
      limit: Number(flag('limit') ?? 100),
    })
    console.log(JSON.stringify(rows, null, 2))
    console.error(`${rows.length} Vorgang/Vorgaenge in einem Endzustand.`)
  } else if (command === 'reconciliation') {
    const rows = repository.findReconciliationRequired()
    console.log(JSON.stringify(rows, null, 2))
    console.error(
      `${rows.length} Vorgang/Vorgaenge mit unbekanntem Providerergebnis. ` +
        'Vor einer Wiedervorlage beim Provider pruefen, ob die Nachricht doch ankam.',
    )
  } else if (command === 'requeue') {
    const leadId = flag('lead')
    const actor = flag('actor')
    const reason = flag('reason')
    if (!leadId || !actor || !reason) usage()
    const result = repository.requeueForDelivery({ leadId, actor, reason })
    console.log(JSON.stringify(result, null, 2))
    if (!result.requeued) process.exitCode = 1
  } else if (command === 'alerts') {
    const alerts = evaluateAlerts({
      queueMetrics: repository.collectQueueMetrics(),
      privacyMetrics: repository.collectPrivacyMetrics(),
      isolation: describeRuntimeIsolation(process.env),
    })
    console.log(JSON.stringify(alerts, null, 2))
    console.error(`${alerts.length} Alarm(e).`)
    // Ein Exitcode, den ein Cron auswerten kann, ohne JSON zu lesen.
    if (alerts.some((alert) => alert.severity === 'critical')) process.exitCode = 1
  } else if (command === 'isolation') {
    const isolation = describeRuntimeIsolation(process.env)
    console.log(JSON.stringify(isolation, null, 2))
    if (isolation.findings.some((finding) => finding.severity === 'critical')) process.exitCode = 1
  } else if (command === 'retention-policy') {
    console.log(
      JSON.stringify({ policy: retentionPolicy, backupScope: describeBackupScope() }, null, 2),
    )
  } else if (command === 'retention') {
    const summary = runRetention({
      repository,
      storageRoot: process.env.SUPPORT_UPLOAD_DIR || null,
      apply: has('apply'),
      limit: Number(flag('limit') ?? 500),
      actor: flag('actor') ?? 'lead-ops',
    })
    console.log(JSON.stringify(summary, null, 2))
    if (!summary.applied) {
      console.error(`Nur Bericht. ${summary.due} faellig — mit --apply wird anonymisiert.`)
    }
  } else if (command === 'dsar-lookup') {
    const email = flag('email')
    if (!email) usage()
    const rows = privacy().lookup(email)
    console.log(JSON.stringify(rows, null, 2))
    console.error(`${rows.length} Vorgang/Vorgaenge zu dieser Adresse.`)
  } else if (command === 'dsar-export') {
    const email = flag('email')
    if (!email) usage()
    console.log(JSON.stringify(privacy().export(email), null, 2))
    console.error('Enthaelt personenbezogene Daten — Ausgabe entsprechend behandeln.')
  } else if (command === 'dsar-erase') {
    const email = flag('email')
    const actor = flag('actor')
    const reason = flag('reason')
    if (!email || !actor || !reason) usage()
    const result = privacy().erase({ email, actor, reason })
    console.log(JSON.stringify(result, null, 2))
    if (result.deferred.length > 0) {
      console.error(
        `${result.deferred.length} Vorgang/Vorgaenge NICHT geloescht (Aufbewahrungspflicht oder ` +
          'laufende Zustellung) — Gruende stehen oben.',
      )
      process.exitCode = 1
    }
  } else if (command === 'legal-hold') {
    const leadId = flag('lead')
    const until = flag('until')
    const actor = flag('actor')
    const reason = flag('reason')
    if (!leadId || !until || !actor || !reason) usage()
    const result = repository.setLegalHold({
      leadId,
      until: until === 'none' ? null : until,
      actor,
      reason,
    })
    console.log(JSON.stringify(result, null, 2))
    if (!result.applied) process.exitCode = 1
  } else if (command === 'backup') {
    const out = flag('out')
    if (!out) usage()
    console.log(JSON.stringify(createLeadBackup({ db, destination: out }), null, 2))
    console.error(
      'Die Datenbank ist gesichert. Der Support-Upload-Ordner ist NICHT Teil dieser Datei — ' +
        'siehe `lead-ops retention-policy` (backupScope.filesystem).',
    )
  } else {
    usage()
  }
} finally {
  db.close()
}
