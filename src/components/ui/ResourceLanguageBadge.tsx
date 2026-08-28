import { useTranslation } from 'react-i18next'
import type { ResourceFormat, ResourceLanguage } from '../../lib/resourceLanguage'

interface ResourceLanguageBadgeProps {
  language: ResourceLanguage
  format?: ResourceFormat
  className?: string
}

const ResourceLanguageBadge = ({
  language,
  format = 'pdf',
  className = '',
}: ResourceLanguageBadgeProps) => {
  const { t } = useTranslation('downloads')

  return (
    <span className={className} data-resource-language={language}>
      {t(`assetLanguage.${format}`, {
        language: t(`assetLanguage.languages.${language}`),
      })}
    </span>
  )
}

export default ResourceLanguageBadge
