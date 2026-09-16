/**
 * AP22 PT22.4 — die Wiederholungspolitik.
 *
 * Bis hierhin war der Abstand eine feste Zahl: `retryDelayMs = 1_000`, drei
 * Versuche, jedes Mal dieselbe Sekunde. Das hat zwei Nachteile, die bei einem
 * echten Providerausfall zusammenfallen: der Abstand waechst nicht mit der
 * Dauer der Stoerung, und alle wartenden Auftraege laufen im Gleichtakt — sie
 * treffen den sich gerade erholenden Provider gemeinsam.
 *
 * Deshalb exponentiell mit Streuung. Die Streuung ist einspeisbar, damit ein
 * Test die Politik pruefen kann, ohne von Zufall abzuhaengen.
 */

const DEFAULT_RETRY_POLICY = Object.freeze({
  maxAttempts: 3,
  baseDelayMs: 1_000,
  maxDelayMs: 5 * 60_000,
  /** Anteil des Abstands, der zufaellig abgezogen wird (0 = keine Streuung). */
  jitterRatio: 0.2,
})

function normalizePolicy(policy = {}) {
  const merged = { ...DEFAULT_RETRY_POLICY, ...policy }
  if (!Number.isInteger(merged.maxAttempts) || merged.maxAttempts < 1) {
    throw new TypeError('retry policy: maxAttempts must be a positive integer')
  }
  if (!Number.isFinite(merged.baseDelayMs) || merged.baseDelayMs < 0) {
    throw new TypeError('retry policy: baseDelayMs must be >= 0')
  }
  if (!Number.isFinite(merged.maxDelayMs) || merged.maxDelayMs < merged.baseDelayMs) {
    throw new TypeError('retry policy: maxDelayMs must be >= baseDelayMs')
  }
  if (!Number.isFinite(merged.jitterRatio) || merged.jitterRatio < 0 || merged.jitterRatio >= 1) {
    throw new TypeError('retry policy: jitterRatio must be in [0, 1)')
  }
  return Object.freeze(merged)
}

/**
 * Abstand bis zum naechsten Versuch.
 *
 * `attempt` ist der gerade fehlgeschlagene Versuch (1-basiert). Der Abstand
 * verdoppelt sich je Versuch, wird bei `maxDelayMs` gedeckelt und danach um
 * bis zu `jitterRatio` nach UNTEN gestreut — nie nach oben, damit die
 * Obergrenze wirklich eine Obergrenze bleibt.
 */
function nextAttemptDelayMs({ attempt, policy = {}, random = Math.random } = {}) {
  const { baseDelayMs, maxDelayMs, jitterRatio } = normalizePolicy(policy)
  if (!Number.isInteger(attempt) || attempt < 1) {
    throw new TypeError('retry policy: attempt must be a positive integer')
  }
  const exponential = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs)
  if (jitterRatio === 0) return Math.round(exponential)
  const spread = exponential * jitterRatio
  return Math.max(0, Math.round(exponential - spread * random()))
}

/** Darf nach diesem Fehlschlag ueberhaupt noch einmal versucht werden? */
function shouldRetry({ retryable, attempt, policy = {} }) {
  const { maxAttempts } = normalizePolicy(policy)
  return retryable === true && attempt < maxAttempts
}

module.exports = {
  DEFAULT_RETRY_POLICY,
  nextAttemptDelayMs,
  normalizePolicy,
  shouldRetry,
}
