import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { useContactForm } from '../../hooks/useContactForm'
import { resolvePanelNames } from '../../content/befunde/panelNames'
import { isEnglishFallback } from '../../lib/translationStatus'

/**
 * Einrichtungstypen der Epigenetik-Strecke. Der Wert wandert unveraendert als
 * `area` in die Benachrichtigung — deshalb der lesbare Praefix statt eines
 * Slugs. Das Backend nimmt eine feste Feldliste an (name, email, company,
 * phone, area, requirements, consent); zusaetzliche Felder wuerden still
 * verworfen. Die Consumer-Bestellung codiert ihren Kontext aus demselben Grund
 * schon heute in `area`.
 */
const EPI_AREAS = ['longevity', 'nutrition', 'sports', 'bgm', 'practice', 'other'] as const

/**
 * Lesereihenfolge des Formulars. Sie entscheidet, welches Feld nach einem
 * abgelehnten Absenden den Fokus bekommt — "erstes fehlerhaftes Feld" heisst:
 * das oberste, nicht das zuerst gepruefte.
 */
const ERROR_ORDER = ['company', 'name', 'email', 'requirements', 'consent'] as const
type ErrorKey = (typeof ERROR_ORDER)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  // `panel` kommt aus der URL und damit von jedem, der einen Link schreibt.
  // Ungeprueft stand hier jeder Text als Panelname im servergerenderten HTML —
  // also als Aussage von PolarisDX, crawlbar und zitierfaehig. Deshalb laeuft
  // der Parameter durch die bekannte Panelliste: die Merkliste haengt mehrere
  // Namen kommasepariert in EIN `panel`, jeder wird einzeln geprueft,
  // Unbekanntes faellt weg, ausgegeben wird immer die Schreibweise aus der
  // Liste. Die Laengengrenze steckt in resolvePanelNames.
  const panelParam = params.get('panel') ?? ''
  const panels = resolvePanelNames(panelParam)
  const panel = panels.join(', ')
  // Ein mitgeschickter, aber unbekannter Panelname ist kein Kontext, sondern
  // Fremdtext: dann faellt der Hinweis ganz weg, statt auf den allgemeinen
  // Satz zurueckzufallen. Ohne `panel` bleibt es beim allgemeinen Satz — das
  // ist der Weg ueber den ChapterNav-CTA, der nie ein Panel mitbringt.
  const showContext = isEpigenetics && (panels.length > 0 || panelParam.trim() === '')

  // Die Angaben der Epigenetik-Strecke — Kontexthinweis, Einrichtungsauswahl,
  // Freitextfeld — und die Feldfehler liegen in den acht Fallback-Sprachen nur
  // auf Englisch vor; der uebrige Namensraum `contact` ist uebersetzt. Bisher
  // lief dieser Text unter dem lang-Attribut der Seite, ein tschechischer
  // Screenreader hat ihn also mit tschechischer Phonetik vorgelesen (WCAG
  // 3.1.2, Level AA). Erkannt wird das ueber denselben Marker wie auf der
  // Epigenetik-Strecke, hier am Teilbaum `contact.form`; ausgezeichnet werden
  // nur die betroffenen Knoten, nicht das Formular.
  //
  // OFFEN: Die Meldungen an Firma, Name und E-Mail rendert das Input-Atom
  // selbst und reicht keine Sprache durch. Sie bleiben vorerst
  // unausgezeichnet; die Einwilligungsmeldung steht hier im Formular und
  // traegt die Auszeichnung.
  const fallbackLang = isEnglishFallback(t('contact.form._translationStatus', { defaultValue: '' }))
    ? 'en'
    : undefined
  // Nur im Epigenetik-Modus stehen Beschriftung und Auswahl auf Englisch; ohne
  // ihn kommen sie aus den uebersetzten Schluesseln.
  const epiLang = isEpigenetics ? fallbackLang : undefined

  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({})

  const companyRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const requirementsRef = useRef<HTMLTextAreaElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const clearError = (key: ErrorKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  // Nach dem Absenden fuehrt der Fokus weiter: bei Erfolg auf die
  // Bestaetigung (der deaktivierte Knopf haette ihn sonst auf BODY
  // abgeworfen), bei einem Transportfehler auf die Fehlermeldung.
  useEffect(() => {
    if (submitStatus === 'success') successRef.current?.focus()
    if (submitStatus === 'error') errorRef.current?.focus()
  }, [submitStatus])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // `currentTarget` ist nach dem ersten await nicht mehr gesetzt — deshalb
    // das Formular vorher festhalten.
    const form = e.currentTarget
    const formData = new FormData(form)

    const value = (key: string) => String(formData.get(key) ?? '').trim()

    // Jede Pflichtangabe bekommt ihre eigene Meldung. Die Browser-Validierung
    // ist dafuer abgeschaltet (noValidate): ihre Blase haengt nicht am Feld,
    // verschwindet beim ersten Tastendruck und ist nicht uebersetzbar.
    const next: Partial<Record<ErrorKey, string>> = {}
    if (!value('company')) next.company = t('contact.form.errors.company')
    if (value('name').length < 2) next.name = t('contact.form.errors.name')
    if (!EMAIL_RE.test(value('email'))) next.email = t('contact.form.errors.email')
    if (!value('requirements')) next.requirements = t('contact.form.errors.requirements')
    if (!formData.get('consent')) next.consent = t('contact.form.errors.consent')
    setErrors(next)

    const firstInvalid = ERROR_ORDER.find((key) => next[key])
    if (firstInvalid) {
      const target =
        firstInvalid === 'company'
          ? companyRef.current
          : firstInvalid === 'name'
            ? nameRef.current
            : firstInvalid === 'email'
              ? emailRef.current
              : firstInvalid === 'requirements'
                ? requirementsRef.current
                : consentRef.current
      target?.focus()
      return
    }

    const success = await submit(formData)
    if (success) {
      form.reset()
      setErrors({})
    }
  }

  const alertFocusClass =
    'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2'

  return (
    <form className="mt-4 space-y-5" onSubmit={handleSubmit} noValidate>
      {showContext ? (
        <p
          data-testid="panel-context"
          lang={fallbackLang}
          className="rounded-xl border border-accent-border bg-accent-soft px-4 py-3 text-sm text-accent-strong"
        >
          {panels.length
            ? t('contact.form.epigenetics.context_panel', {
                count: panels.length,
                panels: panels.join(', '),
              })
            : t('contact.form.epigenetics.context')}
        </p>
      ) : null}
      {/* Die Herkunft reiste bisher nur als vorbelegter Freitext mit: wer das
          Textfeld ueberschrieb, loeschte damit die einzige Spur, aus welcher
          Strecke und welchem Panel die Anfrage kam. Als eigenes Feld ueberlebt
          sie das. Es steht nichts darin, was der Absender nicht ohnehin sieht -
          der Panelname stammt aus der geprueften Liste, nicht aus der URL. */}
      {isEpigenetics ? (
        <input
          type="hidden"
          name="herkunft"
          value={['Epigenetik-Strecke', panel].filter(Boolean).join(' · ')}
        />
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
        ref={companyRef}
        error={errors.company}
        onChange={() => clearError('company')}
        label={t('contact.form.company_label')}
        placeholder={t('contact.form.company_placeholder')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          name="name"
          type="text"
          required
          ref={nameRef}
          error={errors.name}
          onChange={() => clearError('name')}
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
        ref={emailRef}
        error={errors.email}
        onChange={() => clearError('email')}
        label={t('contact.form.email')}
        placeholder={t('contact.form.email_placeholder')}
      />

      <div className="space-y-1" lang={epiLang}>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
          {isEpigenetics ? t('contact.form.epigenetics.area_label') : t('contact.form.area_label')}
        </label>
        {/* Select is not yet an Atom, so keeping native styling consistent with Input atom for now */}
        <select
          id="area"
          name="area"
          className="flex w-full rounded-md border border-ui-field bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
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

      {/* Beschriftung, Platzhalter, Vorbelegung und Fehlermeldung dieses Felds
          kommen im Epigenetik-Modus alle aus englischen Schluesseln — deshalb
          steht die Auszeichnung am Rahmen und nicht an vier Einzelstellen. */}
      <div lang={epiLang}>
        <Textarea
          id="requirements"
          name="requirements"
          rows={4}
          required
          ref={requirementsRef}
          error={errors.requirements}
          onChange={() => clearError('requirements')}
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
      </div>

      {submitStatus === 'success' && (
        <Alert
          ref={successRef}
          role="status"
          tabIndex={-1}
          className={alertFocusClass}
          variant="success"
        >
          {t('contact.form.success', 'Vielen Dank! Ihre Nachricht wurde gesendet.')}
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className={alertFocusClass}
          variant="destructive"
        >
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
              ref={consentRef}
              onChange={() => clearError('consent')}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
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
        {errors.consent && (
          <p id="consent-error" lang={fallbackLang} className="text-sm font-medium text-red-600">
            {errors.consent}
          </p>
        )}

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
