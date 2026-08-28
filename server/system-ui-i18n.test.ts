// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type JsonObject = { [key: string]: string | JsonObject }

function localeJson(locale: string, namespace: string): JsonObject {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), `public/locales/${locale}/${namespace}.json`), 'utf8'),
  ) as JsonObject
}

function textAt(root: JsonObject, path: string): string {
  const direct = root[path]
  if (typeof direct === 'string') return direct
  const value = path.split('.').reduce<string | JsonObject>((node, key) => {
    if (typeof node === 'string') throw new Error(`Non-object before ${path}`)
    return node[key]
  }, root)
  if (typeof value !== 'string') throw new Error(`Expected string at ${path}`)
  return value
}

describe('PT08.5 current form and system UI', () => {
  it.each(SUPPORTED_LANGUAGES)(
    '%s has Contact, Support, ROI and Consumer system states',
    (locale) => {
      const contact = localeJson(locale, 'contact')
      const support = localeJson(locale, 'support')
      const home = localeJson(locale, 'home')
      const consumer = localeJson(locale, 'consumer')

      for (const [resource, path] of [
        [contact, 'contact.form.errors.name'],
        [contact, 'contact.form.errors.email'],
        [contact, 'contact.form.errors.consent'],
        [contact, 'contact.form.sending'],
        [contact, 'contact.form.success'],
        [contact, 'contact.form.error'],
        [support, 'support.form.submitting'],
        [support, 'support.form.success'],
        [support, 'support.form.error'],
        [home, 'roi.form.sending'],
        [home, 'roi.form.success'],
        [home, 'roi.form.error'],
        [consumer, 'order_form.name_required'],
        [consumer, 'order_form.email_invalid'],
        [consumer, 'order_form.required_fields'],
        [consumer, 'order_form.consent_required'],
        [consumer, 'order_form.error_default'],
        [consumer, 'order_form.sending'],
        [consumer, 'order_form.copy_011'],
      ] as const) {
        expect(textAt(resource, path).trim()).not.toBe('')
      }
    },
  )

  it('keeps GENERAL_SALES as a genuine quote intent in all ten locales', () => {
    const expected = {
      de: 'Angebot anfragen',
      en: 'Request a quote',
      pl: 'Poproś o ofertę',
      fr: 'Demander un devis',
      it: 'Richiedi un preventivo',
      es: 'Solicitar presupuesto',
      pt: 'Pedir orçamento',
      da: 'Anmod om tilbud',
      nl: 'Offerte aanvragen',
      cs: 'Vyžádat nabídku',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(textAt(localeJson(locale, 'common'), 'nav.cta_quote')).toBe(expected[locale])
    }
  })

  it('propagates the canonical route locale through every current request flow', () => {
    const files = [
      'src/components/sections/ContactForm.tsx',
      'src/components/sections/SupportForm.tsx',
      'src/components/sections/PraxisOrderForm.tsx',
      'src/components/sections/RoiCalculatorSection.tsx',
      'src/pages/consumer/OrderForm.tsx',
    ]
    for (const file of files) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8')
      expect(source, file).toContain('normalizeLanguage(i18n.resolvedLanguage)')
    }
  })

  it('does not expose raw backend messages in Consumer Order', () => {
    const api = readFileSync(resolve(process.cwd(), 'src/api/consumerOrder.ts'), 'utf8')
    const form = readFileSync(resolve(process.cwd(), 'src/pages/consumer/OrderForm.tsx'), 'utf8')
    expect(api).not.toMatch(/body\?\.error/)
    expect(form).not.toMatch(/res\.error/)
  })
})
