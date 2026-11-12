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

  return (
    <section
      id="produkte"
      aria-labelledby="home-products-title"
      data-home-business-pillars
      data-home-section
      className="sc025-products sc025-dark"
    >
      <div className="sc025-inner">
        <p id="home-products-title" className="sc025-product-lead">
          {t('sc025.products.lead')}
        </p>
        <div className="sc025-duo">
          <Card
            to={HOME_TARGETS.igloo}
            data-business-pillar="igloo"
            data-route-id="igloo-pro"
            className="sc025-card bg-transparent"
          >
            <div
              className="sc025-visual sc025-device"
              onPointerMove={tilt}
              onPointerLeave={resetTilt}
            >
              <ResponsivePicture image={PILLAR_READER_IMAGE} alt="" sizes={PILLAR_READER.sizes} />
              <span className="sc025-cap">{t('sc025.products.tilt')}</span>
            </div>
            <div className="sc025-card-body">
              <span className="sc025-label">
                {t('business_pillars.pillars.igloo.title')} · Point of Care
              </span>
              <h3 className="sc025-mid">{t('business_pillars.pillars.igloo.headline')}</h3>
              <p className="sc025-text">{t('business_pillars.pillars.igloo.text')}</p>
              <span className="sc025-underlink">
                <span>{t('business_pillars.pillars.igloo.cta')}</span>
                <ArrowRight aria-hidden="true" />
              </span>
            </div>
          </Card>
          <Card
            to={HOME_TARGETS.diagnostics}
            data-business-pillar="diagnostics"
            data-route-id="diagnostics"
            className="sc025-card bg-transparent"
          >
            <div className="sc025-visual">
              <ResponsivePicture
                image={PILLAR_DIAGNOSTICS_IMAGE}
                alt=""
                sizes={PILLAR_PRAXIS.sizes}
                className="sc025-photo"
              />
              <span className="sc025-cap">{t('sc025.products.diagnostics_visual')}</span>
            </div>
            <div className="sc025-card-body">
              <span className="sc025-label">{t('business_pillars.pillars.diagnostics.title')}</span>
              <h3 className="sc025-mid">{t('business_pillars.pillars.diagnostics.headline')}</h3>
              <p className="sc025-text">{t('business_pillars.pillars.diagnostics.text')}</p>
              <span className="sc025-underlink">
                <span>{t('business_pillars.pillars.diagnostics.cta')}</span>
                <ArrowRight aria-hidden="true" />
              </span>
            </div>
          </Card>
        </div>

        <div className="sc025-wide">
          <div className="sc025-wide-copy">
            <span className="sc025-label">{t('sc025.products.metrics_label')}</span>
            <h3 className="sc025-mid">{t('sc025.products.fit_title')}</h3>
            <p className="sc025-text">{t('business_pillars.core.intro')}</p>
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
                  <td className="sc025-value" colSpan={2}>
                    {t(`segments.${sourceId}.bio`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card
          to={HOME_TARGETS.epigenetics}
          data-business-pillar="epigenetics"
          data-route-id="epigenetics"
          className="sc025-wide sc025-epigenetics bg-transparent"
        >
          <div className="sc025-epigenetics-copy">
            <span className="sc025-label">{t('business_pillars.pillars.epigenetics.title')}</span>
            <h3 className="sc025-mid">{t('business_pillars.pillars.epigenetics.headline')}</h3>
            <p className="sc025-text">{t('business_pillars.pillars.epigenetics.text')}</p>
            <span className="sc025-underlink">
              <span>{t('business_pillars.pillars.epigenetics.cta')}</span>
              <ArrowRight aria-hidden="true" />
            </span>
          </div>
          <ResponsivePicture image={PILLAR_SAMPLE_IMAGE} alt="" sizes={PILLAR_SAMPLE.sizes} />
        </Card>
      </div>
    </section>
  )
}

export default HomeProducts
