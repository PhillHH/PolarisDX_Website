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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'

import type { ConsumerOrderProduct } from '../../api/consumerOrder'
import { OrderForm } from './OrderForm'
import type { ConsumerPage } from './tracking'

// =============================================================================
// CONTEXT + HOOK
// =============================================================================

interface OrderModalApi {
  /** Open the modal. `location` describes which CTA triggered it. */
  open: (location: string) => void
}

const OrderModalContext = createContext<OrderModalApi | null>(null)

/**
 * Get the order-modal API. Returns null if there's no provider above the
 * caller — components can use this to fall back to a plain anchor link.
 */
export function useOrderModal(): OrderModalApi | null {
  return useContext(OrderModalContext)
}

// =============================================================================
// PROVIDER + MODAL DIALOG
// =============================================================================

const PRODUCT_TITLES: Record<
  ConsumerOrderProduct,
  { eyebrow: string; title: string; sub: string }
> = {
  spray: {
    eyebrow: 'Order request',
    title: 'Vitamin D3+K2 Spray · 12-Pack',
    sub: 'Tell us how many packs you need — we’ll come back with price and shipping.',
  },
  masks: {
    eyebrow: 'Order request',
    title: 'Hydrating Masks · 5-Pack',
    sub: 'Tell us how many boxes you need — we’ll come back with price and shipping.',
  },
  duo: {
    eyebrow: 'Order request',
    title: 'Inside-Out Care Duo',
    sub: 'One spray + one box of five masks. Let us know how many sets and we’ll be in touch.',
  },
}

function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

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
    (location: string) => {
      submittedRef.current = false
      setOpen(true)
      pushDataLayer({
        event: 'consumer_order_modal_open',
        consumer_page: page,
        product,
        cta_location: location,
      })
    },
    [page, product],
  )

  const handleClose = useCallback(() => {
    setOpen(false)
    if (!submittedRef.current) {
      pushDataLayer({
        event: 'consumer_order_modal_close',
        consumer_page: page,
        product,
      })
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
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const dirtyRef = useRef(false)
  const titleId = `order-modal-title-${product}`
  const titleCopy = PRODUCT_TITLES[product]

  // Guard against discarding a partly-filled form by accident. A plain
  // window.confirm is enough here — the action (losing typed data) is
  // reversible only by re-typing, so we ask before closing.
  const requestClose = useCallback(() => {
    if (
      dirtyRef.current &&
      typeof window !== 'undefined' &&
      !window.confirm('Discard your order request? Anything you typed will be lost.')
    ) {
      return
    }
    onClose()
  }, [onClose])

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  // Move focus to the close button on open (light a11y baseline).
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      {/* Backdrop — fades in with a soft blur build-up */}
      <button
        type="button"
        aria-label="Close order request"
        onClick={requestClose}
        tabIndex={-1}
        className="absolute inset-0 animate-modal-backdrop-in bg-brand-deep/70 backdrop-blur-sm motion-reduce:animate-none motion-reduce:opacity-100"
      />

      {/* Dialog card — translate + scale + brief teal halo on enter */}
      <div className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-bg shadow-3 animate-modal-card-in motion-reduce:animate-none motion-reduce:opacity-100 sm:max-h-[90vh] sm:rounded-2xl">
        {/* Header */}
        <div className="relative flex-none border-b border-[var(--color-border)] bg-surface px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-overline text-accent-strong">
            {titleCopy.eyebrow}
          </p>
          <h2 id={titleId} className="mt-1 pr-10 text-xl font-bold text-fg-heading sm:text-2xl">
            {titleCopy.title}
          </h2>
          <p className="mt-2 max-w-md pr-10 text-sm leading-relaxed text-fg">{titleCopy.sub}</p>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={requestClose}
            aria-label="Close order request"
            className="absolute right-4 top-4 flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Body — scrolls when the form is taller than the viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <OrderForm
            product={product}
            page={page}
            onSubmitted={onSubmitted}
            onDirtyChange={(dirty) => {
              dirtyRef.current = dirty
            }}
          />
        </div>
      </div>
    </div>
  )
}
