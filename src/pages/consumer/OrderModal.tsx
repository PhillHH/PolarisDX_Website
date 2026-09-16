/**
 * Consumer order modal — popup that opens from any "Order" / "Buy" CTA
 *
 * Pattern:
 *   - Each consumer page wraps its content in <OrderModalProvider>.
 *   - Any descendant that wants to open the order popup calls the
 *     `useOrderModal()` hook → `open(location)`.
 *   - The Provider renders <OrderForm> inside a centred dialog when open.
 *
 * UX:
 *   - Desktop: centred card with backdrop + blur.
 *   - Mobile: bottom-sheet style (full width, rounded top).
 *   - Closes on Escape, on backdrop click, and on success after a short delay.
 *   - Body scroll is locked while the dialog is open.
 *
 * Tracking:
 *   - Opening pushes `consumer_order_modal_open` to dataLayer with
 *     { consumer_page, product, cta_location }.
 *   - Closing without submitting pushes `consumer_order_modal_close`.
 *   - Submitting fires `consumer_order_submit` from OrderForm (existing).
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

import type { ConsumerOrderProduct } from '../../api/consumerOrder'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { OrderForm } from './OrderForm'
import {
  trackConsumerOrderModalClose,
  trackConsumerOrderModalOpen,
  type ConsumerPage,
  type CtaLocation,
} from './tracking'

// Kontext und Hook liegen in `./orderModalContext` (AP27 PT27.6).
import { OrderModalContext, type OrderModalApi } from './orderModalContext'

// =============================================================================
// PROVIDER + MODAL DIALOG
// =============================================================================

const getProductTitles = (
  t: TFunction,
): Record<ConsumerOrderProduct, { eyebrow: string; title: string; sub: string }> => ({
  spray: {
    eyebrow: t('order_modal.copy_001'),
    title: t('order_modal.copy_002'),
    sub: t('order_modal.copy_003'),
  },
  masks: {
    eyebrow: t('order_modal.copy_001'),
    title: t('order_modal.copy_004'),
    sub: t('order_modal.copy_005'),
  },
  duo: {
    eyebrow: t('order_modal.copy_001'),
    title: t('duo.copy_018'),
    sub: t('order_modal.copy_006'),
  },
})

export function OrderModalProvider({
  product,
  page,
  children,
}: {
  product: ConsumerOrderProduct
  page: ConsumerPage
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  // We track whether the user submitted (so closing afterwards isn't
  // counted as an abandonment in `consumer_order_modal_close`).
  const submittedRef = useRef(false)

  const handleOpen = useCallback(
    (location: CtaLocation) => {
      submittedRef.current = false
      setOpen(true)
      // AP23 PT23.2: typisiertes Ereignis statt roher dataLayer-Nutzlast.
      trackConsumerOrderModalOpen(page, product, location)
    },
    [page, product],
  )

  const handleClose = useCallback(() => {
    setOpen(false)
    if (!submittedRef.current) {
      trackConsumerOrderModalClose(page, product)
    }
  }, [page, product])

  const handleSubmitted = useCallback(() => {
    submittedRef.current = true
  }, [])

  const api: OrderModalApi = { open: handleOpen }

  return (
    <OrderModalContext.Provider value={api}>
      {children}
      {open && (
        <OrderModalDialog
          product={product}
          page={page}
          onClose={handleClose}
          onSubmitted={handleSubmitted}
        />
      )}
    </OrderModalContext.Provider>
  )
}

function OrderModalDialog({
  product,
  page,
  onClose,
  onSubmitted,
}: {
  product: ConsumerOrderProduct
  page: ConsumerPage
  onClose: () => void
  onSubmitted: () => void
}) {
  const { t } = useTranslation('consumer')
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const titleId = `order-modal-title-${product}`
  const titleCopy = getProductTitles(t)[product]

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // AP24 PT24.2 — Fokus hinein, Fokusfalle, Escape, Fokusrueckgabe.
  //
  // Vorher stand hier nur „Escape schliesst" plus ein Fokus auf den
  // Schliessen-Knopf. Beides blieb, aber die Falle fehlte: im Browser
  // gemessen ging es nach dem Absenden-Knopf per Tab in den Consent-Banner
  // und von dort auf `<body>` — waehrend `aria-modal="true"` der
  // Assistenztechnik genau das Gegenteil versprach. Ebenso fehlte die
  // Fokusrueckgabe: nach Escape landete der Fokus auf `<body>`, und die
  // Besucherin begann die Seite von vorn.
  //
  // Derselbe Haken wie in `Dialog` — eine Mechanik, nicht zwei.
  useFocusTrap({
    active: true,
    containerRef: panelRef,
    onEscape: onClose,
    initialFocusRef: closeBtnRef,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop. AP24 PT24.2: vorher ein `button` mit eigenem Namen — damit
          stand die Schliessen-Aktion zweimal im Accessibility-Tree, obwohl nur
          eine davon je den Fokus bekommen konnte. Der Backdrop ist Flaeche;
          der zugaengliche Weg hinaus ist der Schliessen-Knopf und Escape. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 animate-modal-backdrop-in bg-brand-deep/70 backdrop-blur-sm motion-reduce:animate-none motion-reduce:opacity-100"
      />

      {/* Dialog card — translate + scale + brief teal halo on enter */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-slate-50 shadow-2xl animate-modal-card-in focus:outline-none motion-reduce:animate-none motion-reduce:opacity-100 sm:max-h-[90vh] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="relative flex-none border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {titleCopy.eyebrow}
          </p>
          <h2 id={titleId} className="mt-1 pr-10 text-xl font-semibold text-heading sm:text-2xl">
            {titleCopy.title}
          </h2>
          <p className="mt-2 max-w-md pr-10 text-sm leading-relaxed text-gray-600">
            {titleCopy.sub}
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t('order_modal.copy_007')}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-slate-100 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Body — scrolls when the form is taller than the viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <OrderForm product={product} page={page} onSubmitted={onSubmitted} />
        </div>
      </div>
    </div>
  )
}
