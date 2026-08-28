/**
 * Erkennt, ob ein i18n-Namensraum in der aktuellen Sprache nur als englischer
 * Platzhalter vorliegt. Die betroffenen Locale-Dateien tragen dafuer den
 * Schluessel `_translationStatus`; de und en tragen ihn nicht.
 *
 * Der Marker steht nicht zwingend an der Wurzel eines Namensraums. Ist nur ein
 * Teilbaum englisch geblieben, steht er an diesem Teilbaum und gilt auch nur
 * fuer ihn: im Namensraum `contact` liegt er unter `contact.form`, weil dort
 * der Panel-Hinweis, die vier mit der Epigenetik-Strecke dazugekommenen
 * Feldoptionen und die Feldfehler englisch sind, der uebrige Namensraum aber
 * uebersetzt ist. Der Wert nennt den Umfang im Klartext.
 */
export const ENGLISH_FALLBACK_STATUS = 'English fallback — translation pending'

export function isEnglishFallback(status: unknown): boolean {
  return status === ENGLISH_FALLBACK_STATUS
}
