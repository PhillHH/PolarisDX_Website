import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { useSupportForm } from '../../hooks/useSupportForm'

export const SupportForm = () => {
  const { t } = useTranslation('support')
  const { isSubmitting, submitStatus, submit } = useSupportForm()
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const success = await submit(formData)
    if (success) {
      e.currentTarget.reset()
      setFileName('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : '')
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
        <label htmlFor="support-hp">Leave this field blank</label>
        <input id="support-hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Input
        id="name"
        name="name"
        type="text"
        required
        label={t('support.form.name')}
        placeholder={t('support.form.name_placeholder')}
      />

      <Input
        id="email"
        name="email"
        type="email"
        required
        label={t('support.form.email')}
        placeholder={t('support.form.email_placeholder')}
      />

      <div>
        <Input
          id="udi"
          name="udi"
          type="text"
          required
          label={t('support.form.udi')}
          placeholder={t('support.form.udi_placeholder')}
        />
        <p
          className="mt-1 max-w-[61ch] text-xs text-gray-500 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('support.form.udi_help') }}
        />
      </div>

      <div>
        <Input
          id="swVersion"
          name="swVersion"
          type="text"
          required
          label={t('support.form.sw_version')}
          placeholder={t('support.form.sw_version_placeholder')}
        />
        <p
          className="mt-1 max-w-[61ch] text-xs text-gray-500 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('support.form.sw_version_help') }}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
          {t('support.form.issue_type')} *
        </label>
        <select
          id="issueType"
          name="issueType"
          required
          className="flex w-full rounded-md border border-ui-border bg-white px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          defaultValue=""
        >
          <option value="" disabled>
            {t('support.form.issue_type_placeholder')}
          </option>
          <option value="hardware">{t('support.form.issue_types.hardware')}</option>
          <option value="software">{t('support.form.issue_types.software')}</option>
          <option value="connectivity">{t('support.form.issue_types.connectivity')}</option>
          <option value="test_kit">{t('support.form.issue_types.test_kit')}</option>
          <option value="calibration">{t('support.form.issue_types.calibration')}</option>
          <option value="other">{t('support.form.issue_types.other')}</option>
        </select>
      </div>

      <Input
        id="subject"
        name="subject"
        type="text"
        required
        label={t('support.form.subject')}
        placeholder={t('support.form.subject_placeholder')}
      />

      <Textarea
        id="description"
        name="description"
        rows={4}
        label={t('support.form.description')}
        placeholder={t('support.form.description_placeholder')}
      />

      {/* File Upload */}
      <div className="space-y-1">
        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
          {t('support.form.attachment')}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center rounded-md border border-ui-border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('support.form.attachment_button')}
          </button>
          <span className="text-sm text-gray-500">
            {fileName || t('support.form.attachment_none')}
          </span>
          <input
            ref={fileInputRef}
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,image/png,image/jpeg,image/gif,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {submitStatus === 'success' && <Alert variant="success">{t('support.form.success')}</Alert>}

      {submitStatus === 'error' && <Alert variant="destructive">{t('support.form.error')}</Alert>}

      <div className="space-y-5 pt-2">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-gray-600">
            {t('support.form.consent')}
          </label>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-md bg-accent-strong px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 md:w-auto"
          >
            {isSubmitting ? t('support.form.submitting') : t('support.form.submit')}
          </button>
          <p className="text-xs text-gray-400">{t('support.form.microcopy')}</p>
        </div>
      </div>
    </form>
  )
}
