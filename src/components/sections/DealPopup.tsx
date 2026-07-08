import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../ui/Button'
import iglooImg from '../../assets/igloo_front.webp'

const STORAGE_KEY = 'polaris_sommerdeal_2026_seen'
const OPEN_DELAY = 1100
const DEADLINE = '31.08.2026'

const STATS = [
  { big: '60', small: 'Tests im Paket' },
  { big: '€ 11,00', small: 'Ø pro Testbox-Test' },
  { big: '6 gratis', small: 'Flaschen D3-Spray' },
]

const ROWS = [
  { item: 'Igloo Pro Reader inkl. Heizadapter', qty: '1', price: '€ 1.700,00', deal: 'enthalten' },
  {
    item: 'Vitamin D Testbox',
    qty: '25 Tests',
    price: '€ 15,00 / Test = € 375,00',
    deal: 'enthalten',
  },
  { item: 'CRP Testbox', qty: '25 Tests', price: '€ 6,60 / Test = € 165,00', deal: 'enthalten' },
  {
    item: 'Lipid 5-1 Panel (TC, TG, HDL-C, LDL, GLU)',
    qty: '10 Tests',
    price: '€ 12,00 / Test = € 120,00',
    deal: 'enthalten',
  },
  {
    item: '6 × Vitamin-D3-Spray Polaris Liposomal',
    qty: '6 Flaschen',
    price: '€ 12,90 / Flasche = € 77,40',
    deal: 'kostenfrei',
  },
  { item: 'Lanzetten', qty: 'inklusive', price: '—', deal: 'gratis' },
]

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

/**
 * PolarisDX Sommer-Deal popup (home page). Interactive, fully legible native
 * rendering (not an image) with an offer view and a price-breakdown view.
 * Shows once per browser session, dismissible via close / backdrop / Escape.
 */
const DealPopup = ({ autoOpen = true }: { autoOpen?: boolean }) => {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [tab, setTab] = useState<'offer' | 'prices'>(() =>
    typeof window !== 'undefined' && window.location.hash === '#preise' ? 'prices' : 'offer',
  )

  const openNow = useCallback((initialTab?: 'offer' | 'prices') => {
    if (initialTab) setTab(initialTab)
    setOpen(true)
    window.requestAnimationFrame(() => setShow(true))
  }, [])

  // Open on demand from anywhere (e.g. the "Deal ansehen" hint on the contact page).
  useEffect(() => {
    const onOpen = (e: Event) => openNow((e as CustomEvent).detail?.tab)
    window.addEventListener('polaris:open-deal', onOpen)
    return () => window.removeEventListener('polaris:open-deal', onOpen)
  }, [openNow])

  useEffect(() => {
    const hash = window.location.hash
    // Deep-link: open the deal immediately (and ignore the once-per-session flag).
    const forced = hash === '#deal' || hash === '#preise'
    if (!forced && !autoOpen) return
    if (!forced) {
      let seen = false
      try {
        seen = sessionStorage.getItem(STORAGE_KEY) === '1'
      } catch {
        /* storage blocked */
      }
      if (seen) return
    }
    const timer = window.setTimeout(
      () => openNow(forced && hash === '#preise' ? 'prices' : undefined),
      forced ? 0 : OPEN_DELAY,
    )
    return () => window.clearTimeout(timer)
  }, [autoOpen, openNow])

  const close = useCallback(() => {
    setShow(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setOpen(false), 220)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  if (!open) return null

  const tabBtn = (id: 'offer' | 'prices') =>
    'rounded-full px-4 py-1.5 text-sm font-semibold transition ' +
    (tab === id ? 'bg-white text-brand-deep shadow-sm' : 'text-white/70 hover:text-white')

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PolarisDX Sommer-Deal"
      onClick={close}
      className={
        'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 transition-opacity duration-200 ' +
        (show ? 'opacity-100' : 'opacity-0')
      }
      style={{ backgroundColor: 'rgba(8,51,88,0.72)', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          'relative flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-4xl flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep via-brand-primary to-brand-deep text-white shadow-2xl transition-all duration-200 ' +
          (show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0')
        }
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        {/* Header: eyebrow + tabs + close */}
        <div className="relative flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark ring-1 ring-inset ring-accent/30">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-on-dark" />
            Sommer-Deal · bis {DEADLINE}
          </span>
          <div className="order-3 flex w-full items-center justify-center gap-1 rounded-full bg-white/10 p-1 sm:order-none sm:ml-auto sm:mr-10 sm:w-auto sm:justify-start">
            <button type="button" onClick={() => setTab('offer')} className={tabBtn('offer')}>
              Angebot
            </button>
            <button type="button" onClick={() => setTab('prices')} className={tabBtn('prices')}>
              <span className="sm:hidden">Preise</span>
              <span className="hidden sm:inline">Preisübersicht</span>
            </button>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Schließen"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="relative overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          {tab === 'offer' ? (
            <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  Messwerte statt Vermutungen.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                  Igloo Pro Reader inkl. Heizadapter, Testboxen und 6 kostenfreie Flaschen
                  Vitamin-D3-Spray Polaris Liposomal.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {STATS.map((s) => (
                    <div
                      key={s.small}
                      className="min-w-0 rounded-xl bg-white/5 p-3 ring-1 ring-inset ring-white/10"
                    >
                      <div className="text-lg font-bold text-accent-on-dark sm:text-xl">
                        {s.big}
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-white/60">{s.small}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    to="/contact"
                    variant="primary"
                    onClick={close}
                    className="shrink-0 justify-center whitespace-nowrap"
                  >
                    Deal anfordern
                  </Button>
                  <span className="text-xs text-white/60">
                    Gültig bis {DEADLINE} bzw. solange der Vorrat reicht.
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <img
                  src={iglooImg}
                  alt="Igloo Pro Reader"
                  width={320}
                  height={320}
                  className="h-36 w-auto object-contain drop-shadow-xl sm:h-44"
                />
                <div className="w-full rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Sommer-Deal
                  </div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                      € 1.900,00
                    </span>
                    <span className="pb-1 text-sm text-white/60">netto</span>
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    statt <span className="line-through">€ 2.437,40</span> netto
                  </div>
                  <div className="mt-2 inline-flex rounded-md bg-accent/15 px-2.5 py-1 text-sm font-semibold text-accent-on-dark">
                    Sie sparen € 537,40 (22 %)
                  </div>
                  <div className="mt-2 text-xs text-white/50">zzgl. Versand</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Sommer-Deal für Dentalpraxen
              </h2>
              <p className="mt-2 text-sm text-white/70">
                6 Flaschen Vitamin-D3-Spray Polaris Liposomal sind als kostenlose Zugabe enthalten.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/15 text-xs uppercase tracking-wider text-white/50">
                      <th className="py-2 pr-4 font-semibold">Paketinhalt</th>
                      <th className="py-2 pr-4 font-semibold">Menge</th>
                      <th className="py-2 pr-4 font-semibold">Einzelpreis / Wert</th>
                      <th className="py-2 font-semibold">im Deal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r) => (
                      <tr key={r.item} className="border-b border-white/10 align-top">
                        <td className="py-2.5 pr-4 font-medium text-white">{r.item}</td>
                        <td className="py-2.5 pr-4 text-white/70">{r.qty}</td>
                        <td className="py-2.5 pr-4 text-white/70">{r.price}</td>
                        <td className="py-2.5 font-semibold text-accent-on-dark">{r.deal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/70">
                  Warenwert <span className="line-through">€ 2.437,40</span>
                  <span className="mx-2 text-white/40">→</span>
                  <span className="font-bold text-white">Sommer-Deal € 1.900,00</span>
                  <span className="ml-2 text-accent-on-dark">(Sie sparen € 537,40)</span>
                </div>
                <Button
                  to="/contact"
                  variant="primary"
                  onClick={close}
                  className="shrink-0 justify-center whitespace-nowrap"
                >
                  Deal anfordern
                </Button>
              </div>
              <p className="mt-3 text-xs text-white/50">
                Preise netto, zzgl. MwSt. und Versand. Angebot gültig bis {DEADLINE} bzw. solange
                der Vorrat reicht.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default DealPopup
