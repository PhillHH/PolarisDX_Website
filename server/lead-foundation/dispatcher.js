const { crmLogFields } = require('./crm-delivery')

/**
 * AP22 PT22.4 — der fehlende Hintergrundlauf.
 *
 * Bis hierhin drehte sich die Outbox NUR, wenn jemand ein Formular
 * abschickte: jeder Journey-Slice ruft `processNext()` genau einmal am Ende
 * seines eigenen Submits. Ein Auftrag im Zustand `RETRY_PENDING` mit einem
 * Abstand in der Zukunft wurde damit erst beim naechsten fremden Submit
 * wieder angefasst — nachts also gar nicht. Die Wiederholung existierte auf
 * dem Papier und lief in der Praxis nicht.
 *
 * Der Dispatcher konsumiert die vorhandenen Services, statt einen zweiten
 * Zustellweg zu bauen: er ruft deren `processNext()` in der Runde auf. Damit
 * gelten Router, Zustellgrenze, DRY_RUN, Timeout und Zustaendigkeit je
 * Journey unveraendert weiter.
 */
class LeadDispatcher {
  /**
   * @param handles Liste von `{ name, processNext }` — typischerweise die
   *   Runtime-Services der Journeys.
   */
  constructor({
    handles,
    intervalMs = 30_000,
    /** Wie viele Auftraege ein Durchlauf je Handle hoechstens abarbeitet. */
    batchSize = 10,
    /**
     * AP22 PT22.8 — periodische Wartung auf DEMSELBEN Zeitgeber.
     *
     * Der Aufbewahrungslauf braucht einen Takt. Ein zweiter Scheduler waere
     * ein zweiter Weg mit eigenem Lebenszyklus, eigenem Abschaltschalter und
     * eigener Fehlerbehandlung — fuer einen Job, der einmal am Tag ein paar
     * Zeilen anfasst. Jedes Element ist `{ name, everyMs, run() }`; `everyMs`
     * ist ein MINDESTABSTAND, kein Cron: der Lauf haengt am Dispatcher-Takt
     * und faellt aus, solange der Prozess steht. Das ist die ehrliche Grenze
     * eines In-Process-Jobs und in `LEAD-DATA-CONTRACT.md` §26 so benannt.
     */
    jobs = [],
    logger = { info() {}, warn() {} },
    setTimer = setTimeout,
    clearTimer = clearTimeout,
  }) {
    if (!Array.isArray(handles) || handles.length === 0) {
      throw new TypeError('dispatcher requires at least one handle')
    }
    for (const handle of handles) {
      if (typeof handle?.processNext !== 'function') {
        throw new TypeError('dispatcher handle must provide processNext()')
      }
    }
    for (const job of jobs) {
      if (typeof job?.run !== 'function') throw new TypeError('dispatcher job must provide run()')
    }
    this.handles = [...handles]
    this.jobs = jobs.map((job) => ({
      name: job.name ?? 'unnamed',
      everyMs: Number.isInteger(job.everyMs) && job.everyMs > 0 ? job.everyMs : 0,
      run: job.run,
      lastRunAt: 0,
    }))
    this.intervalMs = intervalMs
    this.batchSize = batchSize
    this.logger = logger
    this.setTimer = setTimer
    this.clearTimer = clearTimer
    this.timer = null
    this.running = false
    this.stopped = true
  }

  /**
   * Einen Durchlauf abarbeiten.
   *
   * Ueberlappungsfrei: laeuft bereits ein Durchlauf, kehrt dieser sofort
   * zurueck. Zwei gleichzeitige Durchlaeufe waeren zwar durch den atomaren
   * Claim abgesichert, wuerden aber Leases unnoetig verbrennen.
   */
  async runOnce() {
    if (this.running) return { skipped: true, processed: 0, jobRuns: [] }
    this.running = true
    let processed = 0
    const failures = []
    const jobRuns = []
    try {
      for (const handle of this.handles) {
        for (let i = 0; i < this.batchSize; i += 1) {
          let lead
          try {
            lead = await handle.processNext()
          } catch (error) {
            // Ein Handle darf den Durchlauf nicht beenden — die uebrigen
            // Journeys haben mit seinem Fehler nichts zu tun.
            failures.push(handle.name ?? 'unknown')
            this.logger.warn('lead_dispatch_handle_failed', {
              handle: typeof handle.name === 'string' ? handle.name.slice(0, 64) : 'unknown',
              errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
            })
            break
          }
          if (!lead) break
          processed += 1
          this.logger.info(
            'lead_dispatch_processed',
            crmLogFields({ leadId: lead.id, journey: lead.journey, status: lead.status }),
          )
        }
      }
      // Wartung erst NACH der Zustellung: ein Aufbewahrungslauf, der einen
      // Vorgang anonymisiert, der gleich zugestellt werden soll, wuerde eine
      // leere Nachricht verschicken. `anonymizeLead` lehnt das ohnehin ab —
      // die Reihenfolge macht den Fall gar nicht erst wahrscheinlich.
      for (const job of this.jobs) {
        const elapsed = Date.now() - job.lastRunAt
        if (job.lastRunAt !== 0 && elapsed < job.everyMs) continue
        job.lastRunAt = Date.now()
        try {
          const summary = await job.run()
          jobRuns.push({ name: job.name, summary })
        } catch (error) {
          failures.push(job.name)
          this.logger.warn('lead_dispatch_job_failed', {
            job: typeof job.name === 'string' ? job.name.slice(0, 64) : 'unnamed',
            errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
          })
        }
      }
    } finally {
      this.running = false
    }
    return { skipped: false, processed, failures, jobRuns }
  }

  start() {
    if (!this.stopped) return this
    this.stopped = false
    const tick = async () => {
      if (this.stopped) return
      await this.runOnce()
      if (this.stopped) return
      this.timer = this.setTimer(tick, this.intervalMs)
      // Der Zeitgeber darf den Prozess nicht am Beenden hindern.
      if (typeof this.timer?.unref === 'function') this.timer.unref()
    }
    this.timer = this.setTimer(tick, this.intervalMs)
    if (typeof this.timer?.unref === 'function') this.timer.unref()
    return this
  }

  stop() {
    this.stopped = true
    if (this.timer) this.clearTimer(this.timer)
    this.timer = null
    return this
  }
}

module.exports = { LeadDispatcher }
