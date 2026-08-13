import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { useContactForm } from '../../hooks/useContactForm'

/**
 * Einrichtungstypen der Epigenetik-Strecke. Der Wert wandert unveraendert als
 * `area` in die Benachrichtigung — deshalb der lesbare Praefix statt eines
 * Slugs. Das Backend nimmt eine feste Feldliste an (name, email, company,
 * phone, area, requirements, consent); zusaetzliche Felder wuerden still
 * verworfen. Die Consumer-Bestellung codiert ihren Kontext aus demselben Grund
 * schon heute in `area`.
 */
const EPI_AREAS = ['longevity', 'nutrition', 'sports', 'bgm', 'practice', 'other'] as const

export const ContactForm = () => {
  const { t } = useTranslation('contact')
  const { isSubmitting, submitStatus, submit } = useContactForm()
  const [params] = useSearchParams()

  // Wer ueber "Konditionen anfragen" aus der Epigenetik-Strecke kommt, landete
  // bisher in einem Formular, das nach Anforderungen an den IglooPro-Reader
  // fragt und als Einsatzbereich Apotheke, Veterinaermedizin oder Labor
  // anbietet — nichts davon passt. Mit ?topic=epigenetik zeigt das Formular
  // die passenden Angaben, und die Herkunft steht in der Benachrichtigung.
  // Zwei Herkunfts-Vertraege zeigen auf dieses Formular: der ChapterNav-CTA
  // schickt ?topic=epigenetik, der Deckblatt-CTA der Musterbefund-Seiten
  // ?intent=quote&source=epigenetics. Bisher zaehlte nur der erste - der
  // Deckblatt-Link verlor damit den Panel-Kontext vollstaendig, obwohl er ihn
  // als ?panel= mitbringt. Beide Vertraege gelten jetzt.
  const isEpigenetics =
    params.get('topic') === 'epigenetik' || params.get('source') === 'epigenetics'
  const panel = params.get('panel')?.slice(0, 60) ?? ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const success = await submit(formData)
    if (success) {
      e.currentTarget.reset()
    }
  }

  return (
    <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
      {isEpigenetics ? (
        <p className="rounded-xl border border-accent-border bg-accent-soft px-4 py-3 text-sm text-accent-strong">
          {panel
            ? t('contact.form.epigenetics.context_panel', { panel })
            : t('contact.form.epigenetics.context')}
        </p>
      ) : null}
      {/* Honeypot — visually & semantically hidden; bots tend to fill it */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          height: 1,
          width: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="contact-hp">Leave this field blank</label>
        <input id="contact-hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Input
        id="company"
        name="company"
        type="text"
        required
        label={t('contact.form.company_label')}
        placeholder={t('contact.form.company_placeholder')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          name="name"
          type="text"
          required
          label={t('contact.form.name')}
          placeholder={t('contact.form.name_placeholder')}
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          label={t('contact.form.phone')}
          placeholder={t('contact.form.phone_placeholder')}
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        required
        label={t('contact.form.email')}
        placeholder={t('contact.form.email_placeholder')}
      />

      <div className="space-y-1">
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
          {isEpigenetics ? t('contact.form.epigenetics.area_label') : t('contact.form.area_label')}
        </label>
        {/* Select is not yet an Atom, so keeping native styling consistent with Input atom for now */}
        <select
          id="area"
          name="area"
          className="flex w-full rounded-md border border-ui-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {isEpigenetics ? (
            EPI_AREAS.map((key) => {
              const label = t(`contact.form.epigenetics.area_options.${key}`)
              return (
                <option key={key} value={`Epigenetik · ${label}`}>
                  {label}
                </option>
              )
            })
          ) : (
            <>
              <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
              <option value="practice">{t('contact.form.area_options.practice')}</option>
              <option value="vet">{t('contact.form.area_options.vet')}</option>
              <option value="lab">{t('contact.form.area_options.lab')}</option>
              <option value="other">{t('contact.form.area_options.other')}</option>
            </>
          )}
        </select>
      </div>

      <Textarea
        id="requirements"
        name="requirements"
        rows={4}
        required
        label={
          isEpigenetics
            ? t('contact.form.epigenetics.requirements_label')
            : t('contact.form.requirements_label')
        }
        placeholder={
          isEpigenetics
            ? t('contact.form.epigenetics.requirements_placeholder')
            : t('contact.form.requirements_placeholder')
        }
        defaultValue={
          isEpigenetics && panel
            ? t('contact.form.epigenetics.panel_prefill', { panel })
            : undefined
        }
      />

      {submitStatus === 'success' && (
        <Alert variant="success">
          {t('contact.form.success', 'Vielen Dank! Ihre Nachricht wurde gesendet.')}
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          {t(
            'contact.form.error',
            'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
          )}
        </Alert>
      )}

      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3">
          <div className="flex h-6 items-center">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
            />
          </div>
          <label htmlFor="consent" className="text-sm text-gray-600">
            {t(
              'contact.form.consent',
              'Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen bis zu 12 Monate gespeichert werden.',
            )}
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sende...' : t('contact.form.submit')}
        </Button>
      </div>
    </form>
  )
}
