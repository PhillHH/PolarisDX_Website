import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * SC-028: src/components/sub/base.css ist eine wortgleiche Auswahl aus dem Stylesheet der
 * Startseite. Dieser Test hält die Kopie an der Quelle: jede Regel aus base.css muss genauso in
 * home.css stehen. Schlägt er fehl, wurde eine der gemeinsamen Regeln nur an einer Stelle geändert.
 */
const normalize = (css: string) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Zerlegt CSS in seine Blöcke der obersten Ebene. */
function blocks(css: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    else if (css[index] === '}') {
      depth -= 1
      if (depth === 0) {
        out.push(css.slice(start, index + 1).trim())
        start = index + 1
      }
    }
  }
  return out
}

/** Regeln einer Ebene; `@media` wird in seine inneren Regeln aufgelöst, `@keyframes` bleibt ganz. */
function rules(css: string): string[] {
  return blocks(css).flatMap((block) =>
    block.startsWith('@media') ? blocks(block.slice(block.indexOf('{') + 1, -1)) : [block],
  )
}

describe('sub/base.css', () => {
  const base = normalize(readFileSync('src/components/sub/base.css', 'utf8'))
  const home = new Set(rules(normalize(readFileSync('src/components/home/home.css', 'utf8'))))

  it('enthält nur Regeln, die wortgleich im Stylesheet der Startseite stehen', () => {
    const copied = rules(base)
    expect(copied.length).toBeGreaterThan(20)
    expect(copied.filter((rule) => !home.has(rule))).toEqual([])
  })
})
