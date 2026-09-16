const https = require('node:https')
const { applyMigrations, openLeadDatabase } = require('../database')
const { LeadRepository } = require('../repository')
const { EntitlementRepository, hashToken } = require('../entitlements')

/**
 * AP27 PT27.2 — gemeinsamer Harness fuer Integrationstests des Backends.
 *
 * Der echte Express-Server (`server.js`) laeuft IM Testprozess, gegen eine temporaere SQLite-Datei.
 * Echte Validierung, echte Persistenz, echter Worker, echte SendGrid-Adapter — ersetzt wird nur der
 * Transport am Rand (`sgMail.send`). Jeder Weg ins Netz zum Provider ist zusaetzlich gesperrt und
 * gezaehlt (`client.request`, `https.request` auf SendGrid-Hosts).
 *
 * Reihenfolge ist Pflicht: `isolateProviderEnv` → `instrumentMailTransport` → `require('server.js')`.
 */

/**
 * Providerbezogene Variablen, die ein Test NIE aus einer lokalen `.env` erben darf. `dotenv`
 * ueberschreibt gesetzte Variablen nicht — deshalb werden sie explizit (notfalls leer) gesetzt.
 */
const PROVIDER_ENV_NAMES = Object.freeze([
  'SENDGRID_API_KEY',
  'CONTACT_RECEIVER',
  'SENDER_EMAIL',
  'RESOURCE_LEAD_RECEIVER',
  'APP_ENV',
  'DEPLOY_ENV',
  'DRY_RUN',
  'FRONTEND_URL',
])

function isolateProviderEnv(values = {}) {
  const names = [...new Set([...PROVIDER_ENV_NAMES, ...Object.keys(values)])]
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]))
  for (const name of PROVIDER_ENV_NAMES) process.env[name] = ''
  Object.assign(process.env, values)
  return {
    restore() {
      for (const [name, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[name]
        else process.env[name] = value
      }
    },
  }
}

const responseError = (statusCode) =>
  Object.assign(new Error(`HTTP ${statusCode}`), {
    name: 'ResponseError',
    code: statusCode,
    response: { statusCode, body: {} },
  })

/**
 * Ersetzt den SendGrid-Transport durch ein Skript. Ausgaenge in der Form, die der echte Client
 * liefert, damit die echten Adapter sie selbst klassifizieren:
 *   delivered → Antwort 202 · retryable → ResponseError 503 · terminal → ResponseError 400 ·
 *   unknown → Transportabbruch ETIMEDOUT. Ein nicht geskripteter Versand scheitert sichtbar.
 */
function instrumentMailTransport() {
  const sgMail = require('@sendgrid/mail')
  const original = {
    send: sgMail.send,
    clientRequest: sgMail.client.request,
    httpsRequest: https.request,
  }
  const network = { client: 0, https: 0 }
  const queue = []
  const sends = []
  let onSend = null

  sgMail.client.request = async () => {
    network.client += 1
    throw new Error('PT27.2: provider network call blocked')
  }
  https.request = (...args) => {
    const target = String(args[0]?.hostname ?? args[0]?.host ?? args[0] ?? '')
    if (/sendgrid/i.test(target)) {
      network.https += 1
      throw new Error('PT27.2: provider network call blocked')
    }
    return original.httpsRequest(...args)
  }
  sgMail.send = async (message) => {
    const outcome = queue.shift() ?? 'unscripted'
    sends.push({ seq: sends.length + 1, outcome, to: message?.to })
    if (onSend) await onSend(message)
    if (outcome === 'delivered') return [{ statusCode: 202, headers: {} }, {}]
    if (outcome === 'retryable') throw responseError(503)
    if (outcome === 'terminal') throw responseError(400)
    if (outcome === 'unknown') {
      throw Object.assign(new Error('socket timeout'), { code: 'ETIMEDOUT' })
    }
    throw Object.assign(new Error('PT27.2: unscripted provider send'), { code: 'UNSCRIPTED_SEND' })
  }

  return {
    network,
    sends,
    script: (...outcomes) => queue.push(...outcomes),
    pending: () => queue.length,
    setOnSend: (handler) => {
      onSend = handler
    },
    restore() {
      sgMail.send = original.send
      sgMail.client.request = original.clientRequest
      https.request = original.httpsRequest
    },
  }
}

/** Sammelt jede Konsolenausgabe, damit Tests Logs auf Token/PII pruefen koennen. */
function captureConsole() {
  const lines = []
  const original = {}
  for (const level of ['log', 'info', 'warn', 'error']) {
    original[level] = console[level]
    console[level] = (...args) =>
      lines.push(
        args
          .map((arg) => {
            if (typeof arg === 'string') return arg
            try {
              return JSON.stringify(arg)
            } catch {
              return String(arg)
            }
          })
          .join(' '),
      )
  }
  return {
    lines,
    text: () => lines.join('\n'),
    restore: () => Object.assign(console, original),
  }
}

function listen(app) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      resolve({
        baseUrl: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((done) => server.close(done)),
      })
    })
    server.on('error', reject)
  })
}

let ipCounter = 0
/** Jede Anfrage bekommt eine eigene Dokumentations-IP (RFC 5737), damit der Limiter nicht mitmisst. */
const nextIp = () => `198.51.100.${(ipCounter++ % 250) + 1}`

async function postJson(baseUrl, route, body, { key } = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'Idempotency-Key': key } : {}),
      'X-Forwarded-For': nextIp(),
    },
    body: JSON.stringify(body),
  })
  return { status: response.status, json: await response.json() }
}

async function getRaw(baseUrl, pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: { 'X-Forwarded-For': nextIp() },
  })
  return {
    status: response.status,
    headers: response.headers,
    body: Buffer.from(await response.arrayBuffer()),
  }
}

/** Eine zweite, unabhaengige Verbindung auf dieselbe Datei — wie ein neu gestarteter Prozess. */
function openStore(filename) {
  const db = openLeadDatabase({ filename })
  applyMigrations(db)
  return {
    db,
    leads: new LeadRepository(db),
    entitlements: new EntitlementRepository(db),
    close: () => db.close(),
  }
}

/** Gesamter Datenbankinhalt als Text — fuer "steht nirgends im Klartext"-Pruefungen. */
function dumpDatabaseText(db) {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map(({ name }) => JSON.stringify(db.prepare(`SELECT * FROM "${name}"`).all()))
    .join('\n')
}

/**
 * Wartet, bis ein Outbox-Eintrag laut gespeichertem `available_at` faellig ist. Das ist der
 * vertraglich festgelegte Abstand der Wiederholungspolitik, kein geratenes Sleep.
 */
async function waitUntilDue(leads, leadId, { channel = 'CRM', maxWaitMs = 10_000 } = {}) {
  const row = leads.getOutboxForLead(leadId).find((entry) => entry.channel === channel)
  if (!row) throw new Error(`no ${channel} outbox row for lead`)
  const waitMs = Math.max(0, Date.parse(row.availableAt) - Date.now()) + 5
  if (waitMs > maxWaitMs) throw new Error(`outbox not due within ${maxWaitMs} ms`)
  await new Promise((resolve) => setTimeout(resolve, waitMs))
}

module.exports = {
  PROVIDER_ENV_NAMES,
  captureConsole,
  dumpDatabaseText,
  getRaw,
  hashToken,
  instrumentMailTransport,
  isolateProviderEnv,
  listen,
  openStore,
  postJson,
  waitUntilDue,
}
