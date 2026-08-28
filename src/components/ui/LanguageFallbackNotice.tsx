/**
 * LanguageFallbackNotice
 *
 * Defensiver Hinweis fuer einen technisch erkannten englischen Fallback.
 * Produktive Namespaces sind seit PT08.3 x10 vollstaendig und verwenden ihn
 * nicht als regulaere Content-Strategie. Falls ein spaeterer Ladefehler einen
 * Marker liefert, zeichnet der Consumer den betroffenen Bereich als Englisch
 * aus; der Hinweis selbst traegt wieder die Seitensprache.
 */

import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

const LanguageFallbackNotice = ({ lang }: { lang: string }) => {
  const { t } = useTranslation('common')

  return (
    <div lang={lang} className="border-b border-slate-200 bg-slate-100">
      <div className="mx-auto flex max-w-container items-center gap-2.5 px-4 py-2.5 lg:px-0">
        <Languages className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
        <p className="text-sm text-gray-500">{t('languageFallback.notice')}</p>
      </div>
    </div>
  )
}

export default LanguageFallbackNotice
