/** Owner 2026-11-18: Vorbestellungen des Polaris One gehen per E-Mail an diese drei Postfächer. */
const PREORDER_TO = ['ulrikes@polarisdx.net', 'adrianoz@polarisdx.net', 'danielaj@polarisdx.net']

/** Beginn der fünf Filmkapitel in Sekunden. */
export const CHAPTER_STARTS = [0, 4, 14, 19.5, 25]

export const preorderHref = (subject: string, body: string) =>
  `mailto:${PREORDER_TO.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
