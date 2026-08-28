export type ResourceLanguage = 'de' | 'en'
export type ResourceFormat = 'pdf' | 'zip'

export const resourceLanguageFromPath = (path: string): ResourceLanguage => {
  const normalized = path.toLowerCase()
  return normalized.startsWith('de/') || normalized.includes('_de.') ? 'de' : 'en'
}
