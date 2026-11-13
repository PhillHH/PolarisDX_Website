import { useTranslation } from 'react-i18next'
import SubHead from '../sub/SubHead'

/** SC-028: Kopf mit Einleitung, die beiden Felder als Spalten mit Linie, der Begriff als Randnotiz. */
const DiagnosticsLandscapeSection = () => {
  const { t } = useTranslation('services')

  return (
    <section
      aria-labelledby="diagnostics-landscape-title"
      data-diagnostics-landscape
      data-sub-section
      className="sc025-s sc025-tint"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('overview.ia.eyebrow')}
          title={t('overview.ia.title')}
          titleId="diagnostics-landscape-title"
          lead={t('overview.ia.intro')}
        />
        <div className="sc028-cols grid gap-12 lg:grid-cols-2">
          <article>
            <h3>{t('overview.ia.poc.title')}</h3>
            <p className="sc025-text">{t('overview.ia.poc.text')}</p>
          </article>
          <article>
            <h3>{t('overview.ia.extended.title')}</h3>
            <p className="sc025-text">{t('overview.ia.extended.text')}</p>
          </article>
        </div>
        <p className="sc025-note">
          <strong className="font-semibold text-heading">{t('overview.ia.term.label')}</strong>{' '}
          {t('overview.ia.term.text')}
        </p>
      </div>
    </section>
  )
}

export default DiagnosticsLandscapeSection
