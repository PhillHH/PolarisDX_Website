/**
 * Hero info badge with a derivation popover — used on all three consumer
 * landing pages. The Spray and Duo variants frame a price-value hook,
 * the Mask variant frames a feature/quantity hook in the same visual.
 *
 * Behaviour:
 *   - Popover is portaled into <body> so the hero's `overflow-hidden`
 *     never clips it. Position is computed via getBoundingClientRect(),
 *     centred on the trigger and clamped to the viewport.
 *   - Opens on tap (mobile) AND hover/focus (desktop). Closes on
 *     Escape, outside pointer-down, mouseleave-of-popover, scroll/resize
 *     re-measures while open.
 *   - Respects `prefers-reduced-motion`.
 *
 * Pricing / claims posture:
 *   - No list price is rendered in the DOM. The € figures are
 *     marketing positioning ("< €1 / week", "< €2 / month"); CONFIRM-
 *     flags live in this file's BADGE_COPY map.
 *   - The Mask variant carries NO € figure — just product facts.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'

import type { ConsumerOrderProduct } from '../../api/consumerOrder'

// =============================================================================
// PER-PRODUCT COPY
// =============================================================================
//
// CONFIRM-FLAGS for the marketing team (already raised earlier in the project,
// repeated here next to the live copy so they don't get lost):
//
//   spray.highlight = "< €1"  — verified vs. the FINAL 12-pack list price?
//                                Derivation: 71 sprays / 5 days / 12 people.
//   duo.highlight   = "< €2"  — final figure for the Duo add-on per month?
//                                Basis: spray-only add-on to a masks order.

interface BadgeCopy {
  /** Text before the highlight (e.g. "Weekday support for"). */
  intro: string
  /** Highlighted value (e.g. "< €1"). Set to null to skip the highlight. */
  highlight: string | null
  /** Dotted-underlined affordance text (e.g. "per employee / week"). */
  trigger: string
  /** Short caps title at the top of the popover. */
  popoverEyebrow: string
  /** Bulleted derivation lines. */
  derivation: string[]
  /** Two-cell result strip at the bottom: label + value. Both stay if both set. */
  resultLabel: string
  resultValue: string
  /** Small muted footnote line. */
  footnote: string
  /** aria-label for the trigger button. */
  ariaShow: string
  ariaHide: string
  /** aria-label for the popover dialog. */
  dialogLabel: string
}

const BADGE_COPY: Record<ConsumerOrderProduct, BadgeCopy> = {
  spray: {
    intro: 'Weekday support for',
    highlight: '< €1',
    trigger: 'per employee / week',
    popoverEyebrow: 'How we get there',
    derivation: [
      '71 sprays per bottle — 1 / day',
      'Weekday use (Mon–Fri) — ≈ 14 weeks / bottle',
      '12-pack across the team — 12 people stocked',
    ],
    resultLabel: 'Per employee / week',
    resultValue: '< €1',
    footnote: 'Based on the 12-pack list price. Indicative — not a per-person subscription.',
    ariaShow: 'Show how the under-€1 per week figure is calculated',
    ariaHide: 'Hide explanation of the under-€1 per week figure',
    dialogLabel: 'How the under-€1 per week figure is built',
  },
  masks: {
    intro: 'A calm hydration ritual —',
    highlight: '5 sessions',
    trigger: 'per box',
    popoverEyebrow: "What's in one box",
    derivation: [
      '5 individually packed sachets',
      '15 ml serum-soaked sheet mask per sachet',
      '15–30 minutes per session — leave on, then massage in',
    ],
    resultLabel: 'Per box',
    resultValue: '5 sessions',
    footnote:
      'Frequency adjusts to your routine and skin tolerance. Cosmetic product, external use only.',
    ariaShow: 'Show what each box contains',
    ariaHide: 'Hide details about box contents',
    dialogLabel: 'What is included in the 5-pack box',
  },
  duo: {
    intro: 'Add daily D3+K2 for',
    highlight: '< €2',
    trigger: 'per month',
    popoverEyebrow: 'How we get there',
    derivation: [
      'Hydrating Masks 5-pack — your masks order',
      '+ Vitamin D3+K2 Spray 12-pack',
      'Spray applied 1× daily — ≈ 71 days / bottle',
    ],
    resultLabel: 'Add-on per month',
    resultValue: '< €2',
    footnote:
      'Indicative price uplift vs. a masks-only order. Final price confirmed by sales at checkout.',
    ariaShow: 'Show how the under-€2 per month figure is calculated',
    ariaHide: 'Hide explanation of the under-€2 per month figure',
    dialogLabel: 'How the under-€2 per month add-on figure is built',
  },
}

// =============================================================================
// POSITIONING HELPERS
// =============================================================================

interface PopoverPosition {
  left: number
  top: number
}

const POPOVER_WIDTH_PX = 360 // ≈ 22.5rem
const POPOVER_GAP_PX = 14
const POPOVER_VIEWPORT_MARGIN = 12

function computePosition(trigger: HTMLElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect()
  const popoverWidth = Math.min(POPOVER_WIDTH_PX, window.innerWidth - POPOVER_VIEWPORT_MARGIN * 2)
  const idealLeft = rect.left + rect.width / 2 - popoverWidth / 2
  const minLeft = POPOVER_VIEWPORT_MARGIN
  const maxLeft = window.innerWidth - popoverWidth - POPOVER_VIEWPORT_MARGIN
  const left = Math.max(minLeft, Math.min(maxLeft, idealLeft)) + window.scrollX
  const top = rect.bottom + POPOVER_GAP_PX + window.scrollY
  return { left, top }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PriceBadge({ product }: { product: ConsumerOrderProduct }) {
  const copy = BADGE_COPY[product]

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PopoverPosition | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const popoverId = useId()

  useEffect(() => setMounted(true), [])

  const measure = useCallback(() => {
    if (triggerRef.current) setPos(computePosition(triggerRef.current))
  }, [])

  useLayoutEffect(() => {
    if (open) measure()
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    function onPointer(e: PointerEvent) {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !popoverRef.current?.contains(t)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Avatar glyph differs slightly: € for Spray/Duo (price hook), star for Mask (feature hook).
  const avatarGlyph = product === 'masks' ? '✦' : '€'

  return (
    <>
      <span className="inline-flex items-center gap-3 rounded-full border border-brand-blue/40 bg-white px-5 py-3 text-sm text-gray-700 shadow-[0_2px_8px_rgba(15,95,149,0.12)]">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-base font-bold text-accent-strong"
        >
          {avatarGlyph}
        </span>
        <span className="leading-snug">
          {copy.intro}{' '}
          {copy.highlight && (
            <span className="font-semibold text-accent-strong">
              {copy.highlight.replace(/ /g, ' ')}
            </span>
          )}{' '}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            aria-expanded={open}
            aria-controls={popoverId}
            aria-label={open ? copy.ariaHide : copy.ariaShow}
            className="group inline-flex items-baseline gap-1 rounded-sm align-baseline text-gray-700 transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="border-b border-dotted border-current">{copy.trigger}</span>
            <Info className="h-3.5 w-3.5 translate-y-[1px] text-accent-strong" aria-hidden />
          </button>
        </span>
      </span>

      {mounted && open && pos
        ? createPortal(
            <div
              ref={popoverRef}
              id={popoverId}
              role="dialog"
              aria-label={copy.dialogLabel}
              onMouseLeave={() => setOpen(false)}
              style={{
                position: 'absolute',
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                width: `${Math.min(POPOVER_WIDTH_PX, window.innerWidth - POPOVER_VIEWPORT_MARGIN * 2)}px`,
              }}
              className="z-50 animate-popover-in rounded-2xl border-2 border-brand-blue bg-white p-5 text-left shadow-[0_18px_50px_rgba(15,95,149,0.22)] ring-1 ring-inset ring-accent-soft motion-reduce:animate-none"
            >
              <span
                aria-hidden
                className="absolute -top-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-[3px] border-l-2 border-t-2 border-brand-blue bg-white"
              />

              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent-line" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-brand-deep">
                  {copy.popoverEyebrow}
                </p>
                <span className="h-px flex-1 bg-slate-200" aria-hidden />
              </div>

              <ul className="mt-3 space-y-2 text-sm leading-snug text-gray-700">
                {copy.derivation.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-1 inline-block h-2 w-2 flex-none rotate-45 rounded-[2px] bg-accent"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent-border bg-accent-soft px-4 py-2.5">
                <span className="text-sm font-semibold text-brand-deep">{copy.resultLabel}</span>
                <span className="text-base font-bold tracking-tight text-accent-strong">
                  {copy.resultValue.replace(/ /g, ' ')}
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-gray-500">{copy.footnote}</p>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

// Backwards-compat alias — SprayPage already imports this name.
export const SprayPriceBadge = () => <PriceBadge product="spray" />
