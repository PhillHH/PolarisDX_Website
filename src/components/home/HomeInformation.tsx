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
    <section
      id="warum-poc"
      aria-labelledby="why-poc-title"
      data-home-information
      data-home-section
      className="sc025-information"
    >
      <div className="sc025-inner">
        <div className="sc025-split">
          <h2 id="why-poc-title" className="sc025-big">
            {t('why.title')}
          </h2>
          <p className="sc025-information-intro">{t('why.intro')}</p>
        </div>
        <div className="sc025-three">
          {signalIds.map((id) => (
            <div key={id} data-poc-signal={id}>
              <h3>{t(`why.signals.${id}.title`)}</h3>
              <p className="sc025-text">{t(`why.signals.${id}.text`)}</p>
            </div>
          ))}
        </div>

        <h3 className="sc025-subheading">{t('sc025.process.title')}</h3>
        <table className="sc025-table" id="ablauf">
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
        <HomeEventTable upcoming={upcoming} />
        <PracticeVoices />
      </div>
    </section>
  )
}

export default HomeInformation
