import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { createI18nInstance } from '../src/i18n.server'

const ROOT = process.cwd()
const NAMESPACES = ['consumer', 'specialty'] as const
const SOURCE_FILES = [
  'src/pages/S3LeitliniePage.tsx',
  'src/pages/VitaminD3ImplantologyPage.tsx',
  'src/pages/consumer/SprayPage.tsx',
  'src/pages/consumer/MaskPage.tsx',
  'src/pages/consumer/DuoPage.tsx',
  'src/pages/consumer/OrderForm.tsx',
  'src/pages/consumer/OrderModal.tsx',
  'src/pages/consumer/PriceBadge.tsx',
  'src/pages/consumer/shell.tsx',
] as const

const VISIBLE_PROPERTIES = new Set([
  'title',
  'description',
  'eyebrow',
  'lead',
  'label',
  'alt',
  'placeholder',
  'unit',
  'note',
  'caption',
  'body',
  'sub',
  'question',
  'answer',
  'q',
  'a',
  'cta',
  'intro',
  'trigger',
  'popoverEyebrow',
  'resultLabel',
  'resultValue',
  'footnote',
  'ariaShow',
  'ariaHide',
  'dialogLabel',
  'headline',
  'text',
  'name',
  'aria-label',
])

function localeFile(language: string, namespace: string): Record<string, string> {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, 'public', 'locales', language, `${namespace}.json`), 'utf8'),
  ) as Record<string, string>
}

function interpolationVariables(value: string): string[] {
  return (value.match(/{{\s*[\w.-]+\s*}}/g) ?? [])
    .map((variable) => variable.replace(/\s/g, ''))
    .sort()
}

function hardcodedVisibleStrings(file: string): string[] {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8')
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const findings: string[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isJsxText(node) && /[A-Za-zÀ-ž]/.test(node.text)) findings.push(node.text.trim())
    if (
      ts.isJsxAttribute(node) &&
      VISIBLE_PROPERTIES.has(node.name.getText(sourceFile)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      findings.push(node.initializer.text)
    }
    if (
      ts.isPropertyAssignment(node) &&
      VISIBLE_PROPERTIES.has(node.name.getText(sourceFile)) &&
      ts.isStringLiteral(node.initializer)
    ) {
      findings.push(node.initializer.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return findings.filter(Boolean)
}

describe('PT08.2 translation contract', () => {
  it('provides identical PT08.2 key sets in all ten languages', () => {
    for (const namespace of NAMESPACES) {
      const reference = localeFile('de', namespace)
      const expected = Object.keys(reference).sort()
      for (const language of SUPPORTED_LANGUAGES) {
        const copy = localeFile(language, namespace)
        expect(Object.keys(copy).sort(), `${language}/${namespace}`).toEqual(expected)
        expect(Object.values(copy).every((value) => value.trim().length > 0)).toBe(true)
        for (const key of expected) {
          expect(interpolationVariables(copy[key]), `${language}/${namespace}:${key}`).toEqual(
            interpolationVariables(reference[key]),
          )
        }
      }
    }
  })

  it('contains no remaining visible JSX or visible-prop literals in migrated files', () => {
    for (const file of SOURCE_FILES) expect(hardcodedVisibleStrings(file), file).toEqual([])
  })

  it.each(SUPPORTED_LANGUAGES)(
    'loads both PT08.2 namespaces in %s without fallback',
    async (language) => {
      const { instance, fallbackNamespaces, missingNamespaces } = await createI18nInstance(language)
      expect(instance.t('spray.copy_050', { ns: 'consumer' })).not.toBe('spray.copy_050')
      expect(instance.t('s3_leitlinie.copy_028', { ns: 'specialty' })).not.toBe(
        's3_leitlinie.copy_028',
      )
      expect(fallbackNamespaces).not.toContain('consumer')
      expect(fallbackNamespaces).not.toContain('specialty')
      expect(missingNamespaces).not.toContain('consumer')
      expect(missingNamespaces).not.toContain('specialty')
    },
  )
})
