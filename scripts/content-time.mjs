import { execFileSync } from 'node:child_process'
import { stat } from 'node:fs/promises'

const git = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

/**
 * AP27-CLOSURE — Zeitpunkt der letzten inhaltlichen Aenderung einer Datei.
 *
 * Die Dateizeit (mtime) taugt dafuer nur im eigenen Arbeitsbaum: ein frischer Checkout (CI)
 * setzt alle Dateien auf den Checkout-Zeitpunkt, ihre Reihenfolge ist dann Zufall. Fuer
 * versionierte, unveraenderte Dateien zaehlt deshalb der letzte Commit; lokal geaenderte,
 * unversionierte oder ignorierte Dateien behalten ihre mtime.
 */
export async function contentTimeMs(path) {
  const { mtimeMs } = await stat(path)
  try {
    if (git(['status', '--porcelain', '--', path]) !== '') return mtimeMs
    const committed = git(['log', '-1', '--format=%ct', '--', path])
    return committed ? Number(committed) * 1000 : mtimeMs
  } catch {
    // ohne Git (z. B. Archiv-Export) bleibt nur die mtime
    return mtimeMs
  }
}
