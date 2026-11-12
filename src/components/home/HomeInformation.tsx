import { useTranslation } from 'react-i18next'
import { events, splitEventsByDate } from '../../data/events'
import { HomeEventTable } from '../events/EventBand'
import PracticeVoices from './PracticeVoices'

const signalIds = ['access', 'workflow', 'conversation'] as const
const stepIds = ['application', 'result', 'context'] as const

const HomeInformation = () => {
  const { t } = useTranslation('home')
  const upcoming = splitEventsByDate(events, new Date()).upcoming

  return (
    <>
      <section
        id="warum-poc"
        aria-labelledby="why-poc-title"
        data-home-information
        data-home-section
        className="sc025-s sc025-tint"
      >
        <div className="sc025-inner">
          <div className="sc025-head">
            <span className="sc025-kicker">{t('why.caption')}</span>
            <h2 id="why-poc-title" className="sc025-h2">
              {t('why.title')}
            </h2>
            <p>{t('why.intro')}</p>
          </div>
          <div className="sc025-cols3">
            {signalIds.map((id) => (
              <div key={id} data-poc-signal={id}>
                <h3>{t(`why.signals.${id}.title`)}</h3>
                <p className="sc025-text">{t(`why.signals.${id}.text`)}</p>
              </div>
            ))}
          </div>
          <div className="sc025-gap" />
          <div className="sc025-head">
            <span className="sc025-kicker">{t('sc025.process.title')}</span>
            <h3 className="sc025-h2">{t('steps.title')}</h3>
          </div>
          <table className="sc025-table sc025-proc" id="ablauf">
            <caption className="sr-only">{t('steps.aria_label')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('sc025.table.step')}</th>
                <th scope="col">{t('sc025.table.action')}</th>
              </tr>
            </thead>
            <tbody>
              {stepIds.map((id, index) => (
                <tr key={id} data-process-step={id}>
                  <th scope="row">
                    {String(index + 1).padStart(2, '0')} · {t(`steps.items.${id}.title`)}
                  </th>
                  <td>{t(`steps.items.${id}.text`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="sc025-note">{t('steps.safety_note')}</p>
        </div>
      </section>
      <section
        aria-labelledby="home-voices-title"
        data-home-voices
        data-home-section
        className="sc025-s sc025-dark"
      >
        <div className="sc025-inner">
          <div className="sc025-head">
            <span className="sc025-kicker">{t('testimonials.caption')}</span>
            <h2 id="home-voices-title" className="sc025-h2">
              {t('testimonials.title')}
            </h2>
          </div>
          <PracticeVoices />
          <HomeEventTable upcoming={upcoming} />
        </div>
      </section>
    </>
  )
}

export default HomeInformation
