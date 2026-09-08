const { createHash, randomBytes, randomUUID } = require('node:crypto')

/**
 * Entitlements — der Anspruch, eine gegatete Ressource abzuholen.
 *
 * REGELN, die hier und nicht im Endpunkt stehen:
 *
 *  1. Das Token existiert genau einmal im Klartext: im Rueckgabewert von
 *     `issue()`. Gespeichert wird ausschliesslich `sha256(token)`. Es gibt
 *     keinen Weg, aus der Datenbank einen gueltigen Link zu rekonstruieren.
 *  2. Ein Anspruch ist an Lead UND Asset gebunden. Ein Token fuer Asset A
 *     oeffnet Asset B nicht, auch wenn derselbe Lead beide angefragt hat.
 *  3. Ansprueche laufen ab und sind widerrufbar. Beides wird serverseitig
 *     geprueft, nicht im Link kodiert.
 *  4. Kein Klartext-Token in Logs, Fehlern oder Rueckgabewerten ausser dem
 *     einen Ausstellungspfad.
 */

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000
const DEFAULT_MAX_DOWNLOADS = 5
const TOKEN_BYTES = 32
/** base64url aus 32 Byte — 43 Zeichen, keine Sonderzeichen in URLs. */
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

const hashToken = (token) => createHash('sha256').update(String(token)).digest('hex')

/** Nie ein Token in eine Meldung schreiben — auch nicht gekuerzt. */
const REDACTED = '[redacted]'

class EntitlementError extends Error {
  constructor(code) {
    super(code)
    this.name = 'EntitlementError'
    this.code = code
  }
}

function parseRow(row) {
  if (!row) return null
  return {
    id: row.id,
    leadId: row.lead_id,
    journey: row.journey,
    assetId: row.asset_id,
    assetLanguage: row.asset_language,
    issuedAt: row.issued_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    downloadCount: row.download_count,
    maxDownloads: row.max_downloads,
    lastDownloadedAt: row.last_downloaded_at,
  }
}

class EntitlementRepository {
  constructor(
    db,
    {
      clock = () => new Date(),
      idFactory = randomUUID,
      tokenFactory = () => randomBytes(TOKEN_BYTES).toString('base64url'),
      ttlMs = DEFAULT_TTL_MS,
      maxDownloads = DEFAULT_MAX_DOWNLOADS,
    } = {},
  ) {
    this.db = db
    this.clock = clock
    this.idFactory = idFactory
    this.tokenFactory = tokenFactory
    this.ttlMs = ttlMs
    this.maxDownloads = maxDownloads
  }

  now() {
    return this.clock().toISOString()
  }

  /**
   * Stellt einen Anspruch aus oder rotiert das Token eines bestehenden.
   *
   * Rotation statt zweitem Anspruch: ein wiederholter Submit soll dem Leser
   * einen funktionierenden Link geben, ohne dass sich Ansprueche vermehren.
   * Der vorherige Link wird dabei bewusst ungueltig — es gibt pro Lead und
   * Asset immer genau einen lebenden Link.
   */
  issue({ leadId, journey, assetId, assetLanguage }) {
    if (!leadId || !journey || !assetId || !assetLanguage) {
      throw new TypeError('leadId, journey, assetId and assetLanguage are required')
    }
    const token = this.tokenFactory()
    if (!TOKEN_PATTERN.test(token)) throw new TypeError('token factory produced an unusable token')
    const tokenHash = hashToken(token)
    const now = this.now()
    const expiresAt = new Date(Date.parse(now) + this.ttlMs).toISOString()

    const write = this.db.transaction(() => {
      const existing = this.db
        .prepare('SELECT * FROM resource_entitlements WHERE lead_id = ? AND asset_id = ?')
        .get(leadId, assetId)
      if (existing) {
        this.db
          .prepare(
            `UPDATE resource_entitlements SET token_hash = ?, asset_language = ?, issued_at = ?,
              expires_at = ?, revoked_at = NULL, download_count = 0, updated_at = ?
            WHERE id = ?`,
          )
          .run(tokenHash, assetLanguage, now, expiresAt, now, existing.id)
        return { entitlement: this.getById(existing.id), rotated: true }
      }
      const id = this.idFactory()
      this.db
        .prepare(
          `INSERT INTO resource_entitlements (
            id, token_hash, lead_id, journey, asset_id, asset_language, issued_at, expires_at,
            max_downloads, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          id,
          tokenHash,
          leadId,
          journey,
          assetId,
          assetLanguage,
          now,
          expiresAt,
          this.maxDownloads,
          now,
          now,
        )
      return { entitlement: this.getById(id), rotated: false }
    })

    const { entitlement, rotated } = write.immediate()
    // Das einzige Mal, dass das Klartext-Token den Prozess verlaesst.
    return { entitlement, token, rotated }
  }

  getById(id) {
    return parseRow(
      this.db.prepare('SELECT * FROM resource_entitlements WHERE id = ?').get(String(id ?? '')),
    )
  }

  /**
   * Prueft einen Link. Gibt bei Erfolg den Anspruch zurueck und zaehlt den
   * Abruf; sonst wirft sie eine klassifizierte, tokenfreie Fehlermeldung.
   *
   * `assetId` kommt aus der URL und MUSS mit dem gebundenen Asset
   * uebereinstimmen — ein gueltiges Token fuer ein anderes Asset ist kein
   * Zugang. Das ist die Ersetzungspruefung (wrong asset substitution).
   */
  redeem({ entitlementId, token, assetId }) {
    if (!TOKEN_PATTERN.test(String(token ?? ''))) throw new EntitlementError('INVALID_TOKEN')
    const row = this.db
      .prepare('SELECT * FROM resource_entitlements WHERE id = ? AND token_hash = ?')
      .get(String(entitlementId ?? ''), hashToken(token))
    const entitlement = parseRow(row)
    if (!entitlement) throw new EntitlementError('INVALID_TOKEN')
    if (entitlement.assetId !== assetId) throw new EntitlementError('ASSET_MISMATCH')
    if (entitlement.revokedAt) throw new EntitlementError('ENTITLEMENT_REVOKED')

    const now = this.now()
    if (Date.parse(entitlement.expiresAt) <= Date.parse(now)) {
      throw new EntitlementError('ENTITLEMENT_EXPIRED')
    }
    if (entitlement.downloadCount >= entitlement.maxDownloads) {
      throw new EntitlementError('ENTITLEMENT_EXHAUSTED')
    }

    const consume = this.db.transaction(() => {
      const update = this.db
        .prepare(
          `UPDATE resource_entitlements SET download_count = download_count + 1,
            last_downloaded_at = ?, updated_at = ?
          WHERE id = ? AND download_count = ? AND revoked_at IS NULL`,
        )
        .run(now, now, entitlement.id, entitlement.downloadCount)
      // Zwei parallele Abrufe: der Verlierer sieht einen veraenderten Zaehler
      // und wird abgewiesen, statt still ueber das Limit zu laufen.
      if (update.changes === 0) throw new EntitlementError('ENTITLEMENT_CONFLICT')
      return this.getById(entitlement.id)
    })
    return consume.immediate()
  }

  revoke(id) {
    const now = this.now()
    this.db
      .prepare(
        'UPDATE resource_entitlements SET revoked_at = ?, updated_at = ? WHERE id = ? AND revoked_at IS NULL',
      )
      .run(now, now, String(id ?? ''))
    return this.getById(id)
  }

  listForLead(leadId) {
    return this.db
      .prepare('SELECT * FROM resource_entitlements WHERE lead_id = ? ORDER BY created_at, id')
      .all(String(leadId ?? ''))
      .map(parseRow)
  }
}

module.exports = {
  DEFAULT_MAX_DOWNLOADS,
  DEFAULT_TTL_MS,
  EntitlementError,
  EntitlementRepository,
  REDACTED,
  TOKEN_PATTERN,
  hashToken,
}
