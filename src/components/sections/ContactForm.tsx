import { useTranslation } from 'react-i18next'
import { Alert, Button, FormField } from '~/design-system'
import { useContactForm } from '../../hooks/useContactForm'

export const ContactForm = () => {
  const { t } = useTranslation('contact')
  const { isSubmitting, submitStatus, submit } = useContactForm()

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

      <FormField
        id="company"
        name="company"
        type="text"
        required
        label={t('contact.form.company_label')}
        placeholder={t('contact.form.company_placeholder')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="name"
          name="name"
          type="text"
          required
          label={t('contact.form.name')}
          placeholder={t('contact.form.name_placeholder')}
        />
        <FormField
          id="phone"
          name="phone"
          type="tel"
          label={t('contact.form.phone')}
          placeholder={t('contact.form.phone_placeholder')}
        />
      </div>

      <FormField
        id="email"
        name="email"
        type="email"
        required
        label={t('contact.form.email')}
        placeholder={t('contact.form.email_placeholder')}
      />

      <FormField as="select" id="area" name="area" label={t('contact.form.area_label')}>
        <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
        <option value="practice">{t('contact.form.area_options.practice')}</option>
        <option value="vet">{t('contact.form.area_options.vet')}</option>
        <option value="lab">{t('contact.form.area_options.lab')}</option>
        <option value="other">{t('contact.form.area_options.other')}</option>
      </FormField>

      <FormField
        as="textarea"
        id="requirements"
        name="requirements"
        rows={4}
        required
        label={t('contact.form.requirements_label')}
        placeholder={t('contact.form.requirements_placeholder')}
      />

      {submitStatus === 'success' && (
        <Alert variant="success">
          {t('contact.form.success', 'Vielen Dank! Ihre Nachricht wurde gesendet.')}
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="danger">
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
              className="h-4 w-4 rounded border-[var(--color-border-strong)] text-brand-secondary focus:ring-brand-secondary"
            />
          </div>
          <label htmlFor="consent" className="text-sm text-fg">
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
