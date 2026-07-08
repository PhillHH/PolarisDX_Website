/**
 * Compact Sommer-Deal reminder shown on the "Angebot anfordern" (contact) page.
 * Clicking it opens the DealPopup in place via a window event (no navigation).
 */
const openDeal = () => window.dispatchEvent(new CustomEvent('polaris:open-deal'))

const DealHint = () => (
  <button
    type="button"
    onClick={openDeal}
    className="group flex w-full items-center gap-4 rounded-xl border border-accent-border bg-accent-soft p-4 text-left transition hover:border-accent sm:p-5"
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-strong">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
        <circle cx="7" cy="7" r="1.2" />
      </svg>
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
        Sommer-Deal · bis 31.08.2026
      </span>
      <span className="mt-0.5 block text-sm font-semibold text-brand-deep">
        Igloo Pro Reader-Paket für € 1.900,00 statt € 2.437,40
      </span>
      <span className="mt-0.5 block text-xs text-gray-600">
        Erwähnen Sie den Deal in Ihrer Anfrage – 22 % Ersparnis sichern.
      </span>
    </span>
    <span className="hidden shrink-0 text-sm font-semibold text-accent-strong group-hover:underline sm:inline">
      Deal ansehen →
    </span>
  </button>
)

export default DealHint
