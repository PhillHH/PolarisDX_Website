import '@testing-library/jest-dom'
import { vi } from 'vitest'

const t = (key: string) => key
const i18n = {
  changeLanguage: () => new Promise(() => {}),
  language: 'de',
}
const useTranslationResult = { t, i18n }

vi.mock('react-i18next', () => ({
  useTranslation: () => useTranslationResult,
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: () => {} },
}))
