import type { PointerEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../ui/Card'
import { ResponsivePicture } from '../ui/ResponsivePicture'
import {
  PILLAR_DIAGNOSTICS_IMAGE,
  PILLAR_PRAXIS,
  PILLAR_READER,
  PILLAR_READER_IMAGE,
  PILLAR_SAMPLE,
  PILLAR_SAMPLE_IMAGE,
} from '../../assets/home/homeImages'
import { CORE_SERVICES, HOME_TARGETS } from './homeTargets'
import { prefersReducedMotion } from './motion'

const tilt = (event: PointerEvent<HTMLDivElement>) => {
  if (event.pointerType !== 'mouse' || prefersReducedMotion()) return
  const bounds = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width - 0.5
  const y = (event.clientY - bounds.top) / bounds.height - 0.5
  const image = event.currentTarget.querySelector('img')
  if (image) image.style.transform = `rotateY(${x * 26}deg) rotateX(${-y * 16}deg) scale(1.04)`
}

const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
  const image = event.currentTarget.querySelector('img')
  if (image) image.style.transform = ''
}

const HomeProducts = () => {
  const { t } = useTranslation('home')
  const pillar = (id: 'igloo' | 'diagnostics' | 'epigenetics') => (
    <div className="sc025-panel-body">
      <div>
        <span className="sc025-label">{t(`business_pillars.pillars.${id}.title`)}</span>
        <h3 className="sc025-mid">{t(`business_pillars.pillars.${id}.headline`)}</h3>
      </div>
      <div>
        <p className="sc025-text">{t(`business_pillars.pillars.${id}.text`)}</p>
        <span className="sc025-underlink">
          <span>{t(`business_pillars.pillars.${id}.cta`)}</span>
          <ArrowRight aria-hidden="true" />
        </span>
      </div>
    </div>
  )

  return (
    <>
      <section
        id="produkte"
        aria-labelledby="home-products-title"
        data-home-business-pillars
        data-home-section
        data-home-hz
        className="sc025-hz sc025-dark"
      >
        <div className="sc025-hz-pin">
          <div className="sc025-inner sc025-hz-head">
            <div>
              <span className="sc025-kicker">{t('business_pillars.eyebrow')}</span>
              <h2 id="home-products-title" className="sc025-h2">
                {t('business_pillars.title')}
              </h2>
            </div>
            <span className="sc025-hz-count" aria-hidden="true">
              <b data-home-hz-count>01</b> / 03
            </span>
          </div>
          <div className="sc025-hz-track" data-home-hz-track>
            <Card
              to={HOME_TARGETS.igloo}
              data-business-pillar="igloo"
              data-route-id="igloo-pro"
              className="sc025-panel"
            >
              <div
                className="sc025-visual sc025-device"
                onPointerMove={tilt}
                onPointerLeave={resetTilt}
              >
                <ResponsivePicture image={PILLAR_READER_IMAGE} alt="" sizes={PILLAR_READER.sizes} />
                <span className="sc025-cap">{t('sc025.products.tilt')}</span>
              </div>
              {pillar('igloo')}
            </Card>
            <Card
              to={HOME_TARGETS.diagnostics}
              data-business-pillar="diagnostics"
              data-route-id="diagnostics"
              className="sc025-panel"
            >
              <div className="sc025-visual">
                <ResponsivePicture
                  image={PILLAR_DIAGNOSTICS_IMAGE}
                  alt=""
                  sizes={PILLAR_PRAXIS.sizes}
                />
              </div>
              {pillar('diagnostics')}
            </Card>
            <Card
              to={HOME_TARGETS.epigenetics}
              data-business-pillar="epigenetics"
              data-route-id="epigenetics"
              className="sc025-panel"
            >
              <div className="sc025-visual">
                <ResponsivePicture image={PILLAR_SAMPLE_IMAGE} alt="" sizes={PILLAR_SAMPLE.sizes} />
              </div>
              {pillar('epigenetics')}
            </Card>
          </div>
          <div className="sc025-inner">
            <div className="sc025-hz-bar" aria-hidden="true">
              <i data-home-hz-bar />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="home-fit-title" data-home-fit data-home-section className="sc025-s">
        <div className="sc025-inner">
          <div className="sc025-head">
            <span className="sc025-kicker">{t('sc025.products.metrics_label')}</span>
            <h2 id="home-fit-title" className="sc025-h2">
              {t('sc025.products.fit_title')}
            </h2>
            <p>{t('business_pillars.core.intro')}</p>
          </div>
          <table className="sc025-numbers">
            <caption className="sr-only">{t('sc025.products.metrics_caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('sc025.table.metric')}</th>
                <th scope="col">{t('sc025.table.value')}</th>
                <th scope="col" className="sc025-detail">
                  {t('sc025.table.detail')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t('sc025.products.precision_label')}</th>
                <td className="sc025-value">{t('hero.stat2.value')}</td>
                <td className="sc025-detail">{t('sc025.products.precision_detail')}</td>
              </tr>
              <tr>
                <th scope="row">{t('sc025.products.delivery_label')}</th>
                <td className="sc025-value">{t('hero.stat1.value')}</td>
                <td className="sc025-detail">{t('hero.stat1.label')}</td>
              </tr>
              {CORE_SERVICES.map(({ sourceId }) => (
                <tr key={sourceId}>
                  <th scope="row">{t(`segments.${sourceId}.title`)}</th>
                  <td className="sc025-value">{t(`segments.${sourceId}.bio`)}</td>
                  <td className="sc025-detail">{t(`segments.${sourceId}.benefit`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default HomeProducts
