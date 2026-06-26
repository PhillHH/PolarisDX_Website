import * as React from 'react'

/**
 * Tooth — lokales SVG-Icon im lucide-Stil (kein lucide-Export für „Zahn").
 *
 * Akzeptiert die üblichen `SVGProps` (u. a. `className`, `strokeWidth`,
 * `aria-hidden`), damit es API-gleich zu den lucide-Icons verwendet werden kann
 * (z. B. gemeinsam in einer Icon-Map). Default-`strokeWidth` = 2 (byte-stabil zu
 * bestehenden Aufrufen ohne explizite Stärke).
 */
export const Tooth = ({ className, strokeWidth = 2, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M7 20v-5" />
    <path d="M17 20v-5" />
    <path d="M12 20v-8" />
    <path d="M7.4 6.8c-1.4 1.4-1.8 3.5-.6 5.2l.6.9v3a2 2 0 0 0 2 2h5.2a2 2 0 0 0 2-2v-3l.6-.9c1.2-1.7.8-3.8-.6-5.2a5.5 5.5 0 0 0-7.2 0Z" />
  </svg>
)
