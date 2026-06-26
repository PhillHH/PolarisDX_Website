import { useTranslation } from 'react-i18next'
import CtaBand from './CtaBand'

/**
 * FinalCtaSection — Schluss-CTA-Band der Startseite (§RELAUNCH-PLAN A).
 *
 * Dünner Wrapper über das geteilte {@link CtaBand} ([FRO] keine Duplikate):
 * füllt das Navy-Gradient-Band mit den Home-Texten. Genau eine Primär- und eine
 * Sekundäraktion, on-dark-Tonalität via CtaBand (Overline teal-300, Subline
 * 80 % Weiß, Fokus-Ring weiß).
 */
const FinalCtaSection = () => {
  const { t } = useTranslation('home')

  return (
    <CtaBand
      id="final-cta"
      caption={t('final_cta.caption', 'Jetzt starten')}
      title={t('final_cta.title', 'Sehen Sie den IglooPro in Ihrer Praxis.')}
      text={t(
        'final_cta.text',
        'Vereinbaren Sie einen unverbindlichen Demo-Termin. Wir zeigen Ihnen den Workflow an Ihren Fragestellungen — und melden uns innerhalb eines Werktags.',
      )}
      primary={{ label: t('final_cta.cta_primary', 'Demo anfragen'), to: '/contact' }}
      secondary={{ label: t('final_cta.cta_secondary', 'Infomaterial herunterladen'), to: '/downloads' }}
    />
  )
}

export default FinalCtaSection
