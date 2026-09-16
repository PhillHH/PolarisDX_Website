import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { applyGoogleConsent, withdrawGoogleConsent } from '../../lib/googleConsent'
import {
  CONSENT_REOPEN_EVENT,
  clearConsentDecision,
  readConsentDecision,
  writeConsentDecision,
} from '../../lib/consentState'

// =============================================================================
// TYPES
// =============================================================================

interface CookieCategory {
  id: string
  nameKey: string
  descriptionKey: string
  required: boolean
  enabled: boolean
}

/**
 * Extract consent preferences from category array
 */
const extractConsentFromCategories = (categories: CookieCategory[]) => {
  const analytics = categories.find((c) => c.id === 'analytics')
  const marketing = categories.find((c) => c.id === 'marketing')

  return {
    analytics: analytics?.enabled ?? false,
    marketing: marketing?.enabled ?? false,
  }
}

// =============================================================================
// COOKIE BANNER COMPONENT
// =============================================================================

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation('common')
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  const defaultCategories: CookieCategory[] = [
    {
      id: 'necessary',
      nameKey: 'cookie.categories.necessary.name',
      descriptionKey: 'cookie.categories.necessary.description',
      required: true,
      enabled: true,
    },
    {
      id: 'marketing',
      nameKey: 'cookie.categories.marketing.name',
      descriptionKey: 'cookie.categories.marketing.description',
      required: false,
      enabled: false,
    },
    {
      id: 'analytics',
      nameKey: 'cookie.categories.analytics.name',
      descriptionKey: 'cookie.categories.analytics.description',
      required: false,
      enabled: false,
    },
  ]

  const [categories, setCategories] = useState<CookieCategory[]>(defaultCategories)
  /** Gibt es ueberhaupt etwas zu widerrufen? Steuert den Widerruf-Knopf. */
  const [hasStoredDecision, setHasStoredDecision] = useState(false)

  /**
   * AP23 PT23.1 — der gespeicherte Zustand wird GEPRUEFT, nicht uebernommen.
   *
   * Vorher las diese Stelle `localStorage` roh und setzte das Ergebnis
   * ungeprueft in den State, aus dem unten eine Liste gerendert wird. Stand
   * dort etwas anderes als das erwartete Array — ein abgeschnittener String
   * aus einem vollen Speicher, ein Objekt aus einer aelteren Fassung, eine
   * Zahl — warf `categories.map` beim Rendern, und zwar auf JEDER Seite,
   * weil der Banner global unter `<Routes>` haengt. Ein kaputter
   * Speichereintrag legte damit die gesamte Website lahm.
   *
   * `readConsentDecision()` liefert stattdessen entweder eine gueltige,
   * versionierte Entscheidung oder `null`. `null` heisst „nicht entschieden"
   * — der Dialog erscheint, und das ist in jedem Zweifelsfall die richtige
   * Richtung.
   */
  useEffect(() => {
    // Erst nach der Hydrierung: der Server kennt den localStorage nicht und
    // wuerde sonst einen anderen Zustand ausliefern als der Browser.
    const decision = readConsentDecision()
    // Die Regel warnt vor kaskadierenden Renders durch setState im Effekt.
    // Hier ist genau das die Absicht und der einzige korrekte Weg: der
    // gespeicherte Zustand DARF erst nach der Hydrierung gelesen werden,
    // sonst liefert der Server einen anderen Baum aus als der Browser.
    /* eslint-disable react-hooks/set-state-in-effect */
    setHasStoredDecision(decision !== null)
    if (!decision) {
      setIsVisible(true)
      return
    }
    setCategories((prev) =>
      prev.map((category) =>
        category.required
          ? category
          : { ...category, enabled: decision[category.id as 'analytics' | 'marketing'] === true },
      ),
    )
    /* eslint-enable react-hooks/set-state-in-effect */
    applyGoogleConsent({ analytics: decision.analytics, marketing: decision.marketing })
  }, [])

  /**
   * Wiederaufruf von aussen (Fusszeile, Datenschutzerklaerung).
   *
   * Ohne diesen Weg war eine einmal getroffene Entscheidung endgueltig: der
   * Banner rendert nur ohne gespeicherte Entscheidung, und es gab keinen
   * einzigen Einstiegspunkt, ihn erneut zu oeffnen. Ein Widerruf war damit
   * technisch unmoeglich — obwohl er genauso einfach sein muss wie die
   * Zustimmung.
   */
  useEffect(() => {
    const reopen = () => {
      setHasStoredDecision(readConsentDecision() !== null)
      setIsVisible(true)
      setShowSettings(true)
    }
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen)
  }, [])

  /**
   * Der Banner liegt fixed ueber dem Seitenende. Bei 390x844 verdeckte er die
   * unteren 239px (28% des Viewports) — auf Seiten, deren Schluss-CTA kurz vor
   * dem Footer sitzt, lag dieser dadurch je nach Scrollposition komplett hinter
   * dem Banner (gemessen z. B. auf /pl/igloo-pro und /fr/diagnostics).
   *
   * Deshalb: solange der Banner sichtbar ist, bekommt <body> unten genau die
   * Bannerhoehe als Innenabstand. Jeder Inhalt laesst sich damit ueber die
   * Bannerkante scrollen. Zusaetzlich steht die Hoehe als CSS-Variable
   * --cookie-banner-height bereit (der MobileCallButton hebt sich damit an).
   */
  useEffect(() => {
    const root = document.documentElement
    const clear = () => {
      root.style.removeProperty('--cookie-banner-height')
      document.body.style.removeProperty('padding-bottom')
    }

    const el = bannerRef.current
    if (!isVisible || !el) {
      clear()
      return
    }

    const apply = () => {
      const height = Math.ceil(el.getBoundingClientRect().height)
      root.style.setProperty('--cookie-banner-height', `${height}px`)
      document.body.style.paddingBottom = `${height}px`
    }

    apply()

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(apply)
      observer.observe(el)
    }
    window.addEventListener('resize', apply)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', apply)
      clear()
    }
  }, [isVisible, showSettings])

  const saveConsent = useCallback((preferences: CookieCategory[]) => {
    const consentPrefs = extractConsentFromCategories(preferences)
    // Versioniert und ohne Personenbezug: nur Version, Zeitpunkt und zwei
    // Boolesche. Die Speicherung liegt im Zustandsmodul, damit Format und
    // Version genau EINE Quelle haben.
    writeConsentDecision(consentPrefs)
    applyGoogleConsent(consentPrefs)

    setHasStoredDecision(true)
    setIsVisible(false)
    setShowSettings(false)
  }, [])

  /**
   * Vollstaendiger Widerruf.
   *
   * Die Entscheidung wird geloescht (Zustand: „nicht entschieden"), die
   * Zustimmungssignale gehen sofort auf `denied`. Lief in diesem Dokument
   * bereits ein Container, ist ein Neuladen noetig: ein einmal ausgefuehrtes
   * Providerskript laesst sich nicht zuverlaessig zurueckrufen — Timer,
   * offene Verbindungen und registrierte Listener ueberleben das Entfernen
   * des Elements. Ohne geladenen Provider bleibt der Nutzer, wo er ist.
   */
  const handleWithdraw = useCallback(() => {
    clearConsentDecision()
    const { reloadRequired } = withdrawGoogleConsent()
    setCategories((prev) => prev.map((c) => ({ ...c, enabled: c.required })))
    setHasStoredDecision(false)
    setIsVisible(true)
    setShowSettings(true)
    if (reloadRequired) window.location.reload()
  }, [])

  const handleAcceptAll = useCallback(() => {
    const allEnabled = categories.map((c) => ({ ...c, enabled: true }))
    setCategories(allEnabled)
    saveConsent(allEnabled)
  }, [categories, saveConsent])

  const handleRejectAll = useCallback(() => {
    // Keep only necessary cookies enabled
    const onlyNecessary = categories.map((c) => ({
      ...c,
      enabled: c.required,
    }))
    setCategories(onlyNecessary)
    saveConsent(onlyNecessary)
  }, [categories, saveConsent])

  const handleSaveSettings = useCallback(() => {
    saveConsent(categories)
  }, [categories, saveConsent])

  const toggleCategory = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c)),
    )
  }, [])

  if (!isVisible) return null

  return (
    /*
       AP23 PT23.1 — der Banner war ein unbenanntes <div>. Ein Screenreader
       las den Inhalt als losen Text am Seitenende, ohne dass erkennbar war,
       worum es sich handelt oder dass hier eine Entscheidung verlangt wird.
       Bewusst ein <section> mit Namen (implizite Rolle `region`) und NICHT
       `dialog`: der Banner ist nicht modal, er
       sperrt die Seite nicht und faengt den Fokus nicht ein. Ein
       `role="dialog"` wuerde Verhalten versprechen (Fokusfalle, Escape,
       Hintergrund inert), das hier absichtlich nicht existiert — die Seite
       bleibt ohne Entscheidung vollstaendig bedienbar.
    */
    <section
      ref={bannerRef}
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-[70] p-3 bg-white border-t border-gray-200 shadow-lg md:p-6 animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary hidden md:block">
              <Shield size={24} />
            </div>
            <div>
              <h3
                id="cookie-banner-title"
                className="text-base md:text-lg font-semibold text-heading mb-1"
              >
                {t('cookie.title', 'Wir respektieren Ihre Privatsphäre')}
              </h3>
              <p className="text-gray-600 text-sm md:text-base max-w-3xl">
                {t(
                  'cookie.description',
                  'Wir nutzen Cookies, um Ihnen die bestmögliche Nutzung unserer Webseite zu ermöglichen und unsere Kommunikation mit Ihnen zu verbessern. Wir berücksichtigen hierbei Ihre Präferenzen und verarbeiten Daten nur, wenn Sie uns durch Klicken auf "Alle akzeptieren" Ihr Einverständnis geben oder über "Einstellungen" eine spezifische Auswahl treffen.',
                )}
              </p>
            </div>
          </div>

          {/* Mobil ein 2-spaltiges Raster statt drei gestapelter Zeilen: Ablehnen
              und Akzeptieren liegen gleich gross nebeneinander, "Einstellungen"
              darunter ueber beide Spalten. Die drei gestapelten Buttons waren mit
              138px der groesste Einzelposten der 239px hohen Bannerzeile.
              Ab md wieder eine Reihe. Alle Buttons min. 44px hoch (WCAG 2.5.5). */}
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:min-w-[300px] md:gap-3">
            <button
              onClick={handleRejectAll}
              className="inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-ui-field rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              {t('cookie.reject_all', 'Nur notwendige')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors shadow-sm"
            >
              {t('cookie.accept_all', 'Alle akzeptieren')}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              /* AP24 PT24.1: Das Panel wird erst beim Aufklappen gerendert.
                 `aria-controls` zeigte im zugeklappten Zustand auf eine Id,
                 die es nicht gab. Der Zustand steht in `aria-expanded`; die
                 Beziehung wird nur behauptet, wenn es sie gibt. */
              aria-controls={showSettings ? 'cookie-settings-panel' : undefined}
              className="col-span-2 inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-ui-field rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              {showSettings
                ? t('cookie.hide', 'Ausblenden')
                : t('cookie.settings', 'Einstellungen')}
              {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div
            id="cookie-settings-panel"
            className="mt-4 border-t border-gray-100 pt-4 animate-in fade-in duration-200"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border ${
                    category.enabled
                      ? 'border-brand-primary/30 bg-brand-primary/5'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-heading">{t(category.nameKey)}</span>
                    {/* min-h-[44px]: der sichtbare Schalter bleibt 44x24, die
                        Trefferflaeche des Labels waechst auf 44px Hoehe. Das
                        funktioniert nur, weil der Schalter-Div jetzt selbst
                        `relative` ist — der Knopf (after:) wurde vorher gegen das
                        Label positioniert und waere sonst nach oben verrutscht. */}
                    <label className="relative inline-flex min-h-[44px] items-center cursor-pointer">
                      {/* Der Schalter trug keinen Namen - ein Screenreader las
                          "Kontrollkaestchen, aktiviert", ohne zu sagen, wofuer.
                          Der Name steht sichtbar daneben, hier noch einmal fuer
                          die Sprachausgabe. */}
                      <span className="sr-only">{t(category.nameKey)}</span>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={category.enabled}
                        disabled={category.required}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <div
                        className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/40 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          category.required ? 'opacity-50 cursor-not-allowed' : ''
                        } peer-checked:bg-brand-primary`}
                      ></div>
                    </label>
                  </div>
                  {/* AP24 PT24.6: Die Kategorienkarte ist leicht getoent;
                      `gray-500` landet dort bei 4,45:1 und verfehlt AA um
                      Haaresbreite. `gray-600` bringt 6,7:1. Dieselbe Regel wie
                      auf der S3-Seite: `gray-500` fuer Weiss und slate-50, auf
                      getoenten Flaechen `gray-600`. */}
                  <p className="text-xs text-gray-600">{t(category.descriptionKey)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {/* Der Widerruf erscheint nur, wenn es etwas zu widerrufen gibt.
                  Er muss genauso erreichbar sein wie die Zustimmung — deshalb
                  hier, im selben Panel, mit derselben Trefferflaeche. */}
              {hasStoredDecision && (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="inline-flex min-h-[44px] items-center justify-center px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-ui-field rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                >
                  {t('cookie.withdraw', 'Einwilligung widerrufen')}
                </button>
              )}
              <button
                onClick={handleSaveSettings}
                className="inline-flex min-h-[44px] items-center justify-center px-6 py-2 text-sm font-medium text-white bg-brand-deep rounded-md hover:bg-brand-navy-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-deep transition-colors"
              >
                {t('cookie.save_selection', 'Auswahl speichern')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
