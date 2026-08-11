/**
 * Erkennt, ob ein i18n-Namensraum in der aktuellen Sprache nur als englischer
 * Platzhalter vorliegt. Die betroffenen Locale-Dateien tragen dafuer den
 * Schluessel `_translationStatus`; de und en tragen ihn nicht.
 */
export function isEnglishFallback(status: unknown): boolean {
  return typeof status === 'string' && status.length > 0
}
