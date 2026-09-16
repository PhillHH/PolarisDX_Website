import { createContext, useContext } from 'react'

import type { CtaLocation } from './tracking'

/**
 * Kontext und Hook des Bestell-Dialogs.
 *
 * AP27 PT27.6: aus `OrderModal.tsx` herausgeloest, damit die Komponentendatei nur Komponenten
 * exportiert (react-refresh/only-export-components). Verhalten unveraendert.
 */
export interface OrderModalApi {
  /** Open the modal. `location` describes which CTA triggered it. */
  open: (location: CtaLocation) => void
}

export const OrderModalContext = createContext<OrderModalApi | null>(null)

/**
 * Get the order-modal API. Returns null if there's no provider above the
 * caller — components can use this to fall back to a plain anchor link.
 */
export function useOrderModal(): OrderModalApi | null {
  return useContext(OrderModalContext)
}
