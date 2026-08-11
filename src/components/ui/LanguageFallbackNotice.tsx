/**
 * LanguageFallbackNotice
 *
 * Acht der zehn Sprachen zeigen die Epigenetik-Strecke bislang auf Englisch
 * (Marker `_translationStatus` im Namensraum `epigenetics`). Bisher war das
 * nirgends sichtbar und — schlimmer — der englische Text lief unter dem
 * lang-Attribut der jeweiligen Sprache. Ein Screenreader hat ihn dann mit
 * franzoesischer oder polnischer Aussprache vorgelesen, und Suchmaschinen
 * bekamen eine falsche Sprachauszeichnung gemeldet.
 *
 * Die Seiten setzen deshalb lang="en" auf ihren Inhaltscontainer. Dieser
 * Hinweis steht darin, traegt aber wieder die Seitensprache — deshalb das
 * eigene lang-Attribut.
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
