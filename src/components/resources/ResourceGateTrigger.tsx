import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import ResourceGateForm from './ResourceGateForm'
import { findResource } from '../../content/resources/resourceInventory'
import { resolveResourceVariant } from '../../content/resources/resourceCenter'

/**
 * Einstieg in das Gate — an jeder Stelle einsetzbar, an der bisher ein
 * direkter Download-Link stand (AP19 PT19.4).
 *
 * Der Aufrufer uebergibt nur die Asset-ID. Sprache, Auslieferungsklasse und
 * Herkunft loest die Komponente selbst auf; die physische URL kommt nie in
 * ihre Naehe. Damit kann eine Seite ein gegatetes Asset anbieten, ohne etwas
 * ueber dessen Ablage zu wissen.
 *
 * Rendert bewusst NICHTS, wenn das Asset nicht gegatet ist: ein Gate vor einer
 * frei abrufbaren Datei waere eine Huerde ohne Zweck, und der Aufrufer soll
 * beim Umklassifizieren einer Ressource nicht stillschweigend falsch liegen.
 */

export interface ResourceGateTriggerProps {
  assetId: string
  /** Sichtbare Beschriftung — kommt aus dem Kontext des Aufrufers. */
  label: string
  className?: string
  icon?: ReactNode
}

const ResourceGateTrigger = ({ assetId, label, className, icon }: ResourceGateTriggerProps) => {
  const { t, i18n } = useTranslation('downloads')
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // AP24 PT24.2 — schliesst das Formular, kehrt der Fokus auf den Ausloeser
  // zurueck. Gemessen war vorher: nach „Abbrechen" verschwand das Formular
  // samt dem fokussierten Knopf, und der Fokus fiel auf `<body>` — wer mit der
  // Tastatur arbeitet, begann die Seite von vorn.
  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const resource = findResource(assetId)
  if (!resource || resource.deliveryClass !== 'GATED') return null
  const variant = resolveResourceVariant(resource, i18n.language)

  return (
    <div data-gate-trigger={assetId}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        data-gate-asset={assetId}
        data-gate-locale={i18n.language}
        data-resource-access="GATED"
        className={
          className ??
          'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
        }
      >
        {icon ?? <Lock className="h-4 w-4" aria-hidden="true" />}
        {label}
        <span className="sr-only"> — {t('access.gated')}</span>
      </button>

      {open && (
        <div className="mt-4">
          <ResourceGateForm
            assetId={assetId}
            assetLanguage={variant.language}
            resourceLabel={label}
            originRoute={location.pathname}
            onClose={closeAndRestoreFocus}
          />
        </div>
      )}
    </div>
  )
}

export default ResourceGateTrigger
