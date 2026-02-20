import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Parses text containing [[link text|/path]] syntax and returns
 * an array of strings and React Router <Link> components.
 *
 * Usage in JSX:
 *   <p>{renderTextWithLinks("Visit the [[IglooPro|/igloo-pro]] page.")}</p>
 *
 * Renders as:
 *   <p>Visit the <Link to="/igloo-pro">IglooPro</Link> page.</p>
 */
export function renderTextWithLinks(text: string): ReactNode {
  const linkRegex = /\[\[([^\]|]+)\|([^\]]+)\]\]/g
  const parts: (string | ReactNode)[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <Link
        key={match.index}
        to={match[2]}
        className="font-semibold text-brand-primary hover:underline"
      >
        {match[1]}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
