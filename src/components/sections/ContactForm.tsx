import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
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
          {t('contact.form.area_label')}
        </label>
        {/* Select is not yet an Atom, so keeping native styling consistent with Input atom for now */}
        <select
          id="area"
          name="area"
          className="flex w-full rounded-md border border-ui-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
          <option value="practice">{t('contact.form.area_options.practice')}</option>
          <option value="vet">{t('contact.form.area_options.vet')}</option>
          <option value="lab">{t('contact.form.area_options.lab')}</option>
          <option value="other">{t('contact.form.area_options.other')}</option>
        </select>
      </div>

      <Textarea
        id="requirements"
        name="requirements"
        rows={4}
        required
        label={t('contact.form.requirements_label')}
        placeholder={t('contact.form.requirements_placeholder')}
      />

      {submitStatus === 'success' && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">
          {t('contact.form.success', 'Vielen Dank! Ihre Nachricht wurde gesendet.')}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {t('contact.form.error', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')}
        </div>
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
            {t('contact.form.consent', 'Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen bis zu 12 Monate gespeichert werden.')}
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full justify-center md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Sende...' : t('contact.form.submit')}
        </Button>
      </div>
    </form>
  )
}
