import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HOME_TARGETS } from './homeTargets'

/**
 * SC-030 (Owner 2026-11-18, „sinnvoll in die Seite einbinden"): Übergang von der Polaris-One-Bühne
 * zur übrigen Startseite. Steht unter dem Filmfeld; Regie-Einblendungen und Filmsteuerung bringen
 * ihn jeweils mit, damit er nicht im Startpaket der Seite liegt. Nennt den Liefertermin und führt zum Gerät, das heute lieferbar ist.
 */
const PolarisOneBridge = () => {
  const { t } = useTranslation('home')
  return (
    <p className="p1s-bridge">
      <span>{t('polaris_one.bridge.note')}</span>
      <Link to={HOME_TARGETS.igloo}>
        {t('polaris_one.bridge.today')}
        <ArrowRight aria-hidden="true" />
      </Link>
    </p>
  )
}

export default PolarisOneBridge
