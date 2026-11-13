import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import SubHead from '../components/sub/SubHead'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import TrustBar from '../components/sections/TrustBar'
import { SupportForm } from '../components/sections/SupportForm'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import EventBand from '../components/events/EventBand'

const EMAIL = 'contact@polarisdx.net'
const PHONE_HREF = 'tel:+4915175011699'
const PHONE_LABEL = '+49 151 75011699'

type SupportChannel = {
  title: string
  desc: string
  action: string
  value?: string
  to?: string
  href?: string
}

const SupportPage = () => {
  const { t, i18n } = useTranslation(['support', 'common'])

  const channels: SupportChannel[] = [
    {
      title: t('support.channels.email.title'),
      desc: t('support.channels.email.desc'),
      action: t('support.channels.email.action'),
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      title: t('support.channels.phone.title'),
      desc: t('support.channels.phone.desc'),
      action: t('support.channels.phone.action'),
      value: PHONE_LABEL,
      href: PHONE_HREF,
    },
    {
      title: t('support.channels.docs.title'),
      desc: t('support.channels.docs.desc'),
      action: t('support.channels.docs.action'),
      to: '/downloads',
    },
  ]

  const helpfulLinks = [
    {
      to: '/downloads',
      label: t('support.sidebar_links.downloads', 'Downloads & Dokumentation'),
    },
    {
      to: '/contact',
      label: t('support.sidebar_links.contact', 'Allgemeine Kontaktanfrage'),
    },
    {
      to: '/igloo-pro',
      label: t('support.sidebar_links.igloo', 'IglooPro System'),
    },
  ]

  const prepareItems = [
    t('support.prepare.items.udi'),
    t('support.prepare.items.sw'),
    t('support.prepare.items.photo'),
    t('support.prepare.items.desc'),
  ]

  const faqRaw = t('support.faq.items', { returnObjects: true })
  const faqItems: { q: string; a: string }[] = Array.isArray(faqRaw)
    ? (faqRaw as { q: string; a: string }[])
    : []

  return (
    <PageTransition>
      <SEOHead
        title={t('support:seo.title', 'Support-Anfrage | PolarisDX')}
        description={t(
          'support:seo.description',
          'Haben Sie Probleme mit Ihrem Igloo Reader oder Testkits? Senden Sie uns eine Support-Anfrage.',
        )}
        structuredData={[
          createBreadcrumbSchema(
            [
              { name: t('common:nav.home'), url: '/' },
              { name: t('common:nav.support'), url: '/support' },
            ],
            i18n.language,
          ),
          ...(faqItems.length
            ? [
                createFAQSchema(
                  faqItems.map(({ q, a }) => ({ question: q, answer: a })),
                  i18n.language,
                ),
              ]
            : []),
        ]}
      />

      <SubPage>
        <SubStage
          breadcrumbs={[
            { label: t('common:nav.home', 'Home'), href: '/' },
            { label: t('support.hero.title') },
          ]}
          eyebrow={t('support.hero.kicker')}
          title={t('support.hero.title')}
          lead={<p>{t('support.hero.subtitle')}</p>}
          chips={[
            t('support.hero.chips.response'),
            t('support.hero.chips.channels'),
            t('support.hero.chips.attach'),
          ]}
          actions={
            <>
              <a href="#support-form" className="sc025-button">
                {t('support.hero.cta_primary')}
                <ArrowRight aria-hidden="true" />
              </a>
              <a href={PHONE_HREF} className="sc025-underlink">
                <span>{t('support.hero.cta_secondary')}</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </>
          }
          aside={
            <dl className="sc028-aside-list">
              {(['response', 'channels', 'attach'] as const).map((key) => (
                <div key={key}>
                  <dt>{t(`support.hero.value.${key}_label`)}</dt>
                  <dd>{t(`support.hero.value.${key}_value`)}</dd>
                </div>
              ))}
            </dl>
          }
        />
        <TrustBar />
        <EventBand />

        {/* Support-Kanäle */}
        <section className="sc025-s" data-sub-section>
          <div className="sc025-inner">
            <Reveal width="100%">
              <SubHead
                kicker={t('support.channels.caption')}
                title={t('support.channels.title')}
                lead={t('support.channels.subtitle')}
              />
            </Reveal>
            <div className="sc028-tiles">
              {channels.map((c, i) => {
                const body = (
                  <>
                    <h3>{c.title}</h3>
                    <p className="sc025-text">{c.desc}</p>
                    {c.value && <span className="sc028-big">{c.value}</span>}
                    <span className="sc025-underlink">
                      <span>{c.action}</span>
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </>
                )
                return (
                  <Reveal key={c.title} width="100%" delay={i * REVEAL_STAGGER}>
                    {c.to ? <Link to={c.to}>{body}</Link> : <a href={c.href}>{body}</a>}
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Formular und Begleitspalte */}
        <div className="sc025-s sc025-tint" data-sub-section>
          <div className="sc025-inner sc028-form-grid">
            <Reveal width="100%">
              <section id="support-form" className="sc028-form scroll-mt-28">
                <span className="sc025-kicker">{t('support.form_panel.caption')}</span>
                <h2 className="sc025-h2">{t('support.form_panel.title')}</h2>
                <p className="sc025-text">{t('support.intro')}</p>
                <SupportForm />
              </section>
            </Reveal>
            <aside>
              <Reveal width="100%" delay={REVEAL_STAGGER}>
                <section className="sc028-block">
                  <h2>{t('support.prepare.title')}</h2>
                  <p className="sc025-text">{t('support.prepare.subtitle')}</p>
                  <ul className="sc028-flat sc028-flat-sm">
                    {prepareItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="sc028-block">
                  <h2 id="support-helpful-links">
                    {t('support.sidebar_links.title', 'Hilfreiche Links')}
                  </h2>
                  <nav
                    aria-labelledby="support-helpful-links"
                    className="sc028-links sc028-links-col"
                  >
                    {helpfulLinks.map((link) => (
                      <Link key={link.to} to={link.to} className="sc025-underlink">
                        <span>{link.label}</span>
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    ))}
                  </nav>
                </section>
                <section className="sc028-card">
                  <h3>{t('support.info.title')}</h3>
                  <p className="sc025-text">{t('support.info.text')}</p>
                  <div className="sc028-direct">
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    <a href={PHONE_HREF}>{PHONE_LABEL}</a>
                  </div>
                </section>
              </Reveal>
            </aside>
          </div>
        </div>

        {/* Häufige Fragen */}
        {faqItems.length > 0 && (
          <section className="sc025-s sc025-dark" data-sub-section>
            <div className="sc025-inner">
              <Reveal width="100%">
                <SubHead kicker={t('support.faq.caption')} title={t('support.faq.title')} />
              </Reveal>
              <div className="sc028-qas">
                {faqItems.map((item, i) => (
                  <Reveal key={item.q} width="100%" delay={(i % 2) * REVEAL_STAGGER}>
                    <div className="sc028-qa">
                      <h3>{item.q}</h3>
                      <p className="sc025-text">{item.a}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <FinalCtaSection />
      </SubPage>
    </PageTransition>
  )
}

export default SupportPage
