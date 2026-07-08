import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'

const CODE = 'POLARIS10'

type Props = {
  /** 'banner' = full marketing band (home), 'card' = compact box above the form */
  variant?: 'banner' | 'card'
}

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * Reusable voucher promotion for the POLARIS10 (10% off) code.
 * - variant='banner': elegant dark gradient band for the homepage.
 * - variant='card':   compact tinted box placed at the top of the contact form.
 */
const VoucherPromo = ({ variant = 'banner' }: Props) => {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(CODE)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* clipboard unavailable — the code is visible for manual copy */
    }
  }

  // ---- CARD (contact form) -------------------------------------------------
  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-accent-border bg-accent-soft p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-strong">
              {t('voucher_promo.badge')}
            </span>
            <p className="text-base font-semibold text-brand-deep">{t('voucher_promo.title')}</p>
            <p className="text-xs leading-relaxed text-gray-600">{t('voucher_promo.hint')}</p>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-accent bg-white px-3 py-2 sm:shrink-0">
            <span className="font-mono text-base font-bold tracking-[0.18em] text-brand-primary">
              {CODE}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={t('voucher_promo.copy')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-accent-strong transition hover:bg-accent-soft"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? t('voucher_promo.copied') : t('voucher_promo.copy')}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- BANNER (homepage) ---------------------------------------------------
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deep via-brand-primary to-brand-deep px-6 py-10 text-white shadow-card sm:px-10 lg:px-14 lg:py-12">
      {/* decorative glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-brand-secondary/30 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark ring-1 ring-inset ring-accent/30">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-on-dark" />
            {t('voucher_promo.badge')}
          </span>
          <h2 className="mt-4 text-2xl font-medium leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            {t('voucher_promo.title')}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {t('voucher_promo.text')}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-4 sm:min-w-[300px]">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/40 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                Code
              </span>
              <span className="font-mono text-lg font-bold tracking-[0.2em] text-white">
                {CODE}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={t('voucher_promo.copy')}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? t('voucher_promo.copied') : t('voucher_promo.copy')}</span>
            </button>
          </div>
          <Button to="/contact" variant="primary" className="w-full justify-center">
            {t('cta.button')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default VoucherPromo
