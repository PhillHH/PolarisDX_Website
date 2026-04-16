import type { ReactNode } from 'react'

/**
 * Inline SVG Flaggen für die 10 unterstützten Sprachen.
 * Ersetzt flag-icons Library (422KB) durch ~3KB inline SVGs.
 */

type FlagIconProps = {
  countryCode: string
  className?: string
}

// Einfache, flache Flaggen als inline SVG
const flags: Record<string, ReactNode> = {
  de: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000" d="M0 0h640v160H0z" />
      <path fill="#D00" d="M0 160h640v160H0z" />
      <path fill="#FFCE00" d="M0 320h640v160H0z" />
    </svg>
  ),
  gb: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#fff" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 82 480H0v-60l239-178L0 64V0h75z" />
      <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
      <path fill="#fff" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
    </svg>
  ),
  pl: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M0 0h640v240H0z" />
      <path fill="#dc143c" d="M0 240h640v240H0z" />
    </svg>
  ),
  fr: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#002654" d="M0 0h213.3v480H0z" />
      <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
      <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#009246" d="M0 0h213.3v480H0z" />
      <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
      <path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#c60b1e" d="M0 0h640v480H0z" />
      <path fill="#ffc400" d="M0 120h640v240H0z" />
    </svg>
  ),
  pt: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#006600" d="M0 0h240v480H0z" />
      <path fill="#ff0000" d="M240 0h400v480H240z" />
      <circle cx="240" cy="240" r="80" fill="#ffcc00" />
      <circle cx="240" cy="240" r="60" fill="#ff0000" />
      <circle cx="240" cy="240" r="40" fill="#fff" />
    </svg>
  ),
  dk: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#c8102e" d="M0 0h640v480H0z" />
      <path fill="#fff" d="M180 0h80v480h-80zM0 200h640v80H0z" />
    </svg>
  ),
  nl: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#21468b" d="M0 320h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#ae1c28" d="M0 0h640v160H0z" />
    </svg>
  ),
  cz: (
    <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M0 0h640v240H0z" />
      <path fill="#d7141a" d="M0 240h640v240H0z" />
      <path fill="#11457e" d="M0 0l320 240L0 480z" />
    </svg>
  ),
}

const FlagIcon = ({ countryCode, className = '' }: FlagIconProps) => {
  const flag = flags[countryCode.toLowerCase()]

  if (!flag) {
    // Fallback: Zeige Ländercode als Text
    return (
      <span
        className={`inline-flex items-center justify-center bg-gray-200 text-xs font-bold text-gray-600 uppercase ${className}`}
      >
        {countryCode}
      </span>
    )
  }

  return <span className={`inline-block overflow-hidden ${className}`}>{flag}</span>
}

export default FlagIcon
