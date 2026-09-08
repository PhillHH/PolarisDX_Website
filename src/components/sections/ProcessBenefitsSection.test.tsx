import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StepsSection from './StepsSection'
import WhyPocSection from './WhyPocSection'

type LocalizedText = { title: string; text: string }

const localeModules = import.meta.glob('/public/locales/*/home.json', {
  eager: true,
  import: 'default',
}) as Record<
  string,
  {
    why: {
      caption: string
      title: string
      intro: string
      signals: Record<'access' | 'workflow' | 'conversation', LocalizedText>
      benefits: Record<'practice' | 'patient', LocalizedText & { label: string }>
    }
    steps: {
      caption: string
      title: string
      intro: string
      aria_label: string
      items: Record<'application' | 'result' | 'context', LocalizedText>
      safety_note: string
    }
  }
>

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

describe('PT11.4 Homepage process and benefit contract', () => {
  it('separates practice and patient benefits without adding interaction or media', () => {
    render(<WhyPocSection />)

    const section = screen.getByRole('region', { name: 'why.title' })
    expect(section.querySelectorAll('[data-poc-signal]')).toHaveLength(3)
    expect(section.querySelectorAll('[data-benefit-audience]')).toHaveLength(2)
    expect(section.querySelector('[data-benefit-audience="practice"]')).toHaveTextContent(
      'why.benefits.practice',
    )
    expect(section.querySelector('[data-benefit-audience="patient"]')).toHaveTextContent(
      'why.benefits.patient',
    )
    expect(within(section).queryByRole('link')).not.toBeInTheDocument()
    expect(within(section).queryByRole('button')).not.toBeInTheDocument()
    expect(within(section).queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders application, result and professional context as one ordered DOM sequence', () => {
    render(<StepsSection />)

    const section = screen.getByRole('region', { name: 'steps.title' })
    const list = within(section).getByRole('list', { name: 'steps.aria_label' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items.map((item) => item.getAttribute('data-process-step'))).toEqual([
      'application',
      'result',
      'context',
    ])
    expect(items.map((item) => item.querySelector('span')?.textContent)).toEqual(['01', '02', '03'])
    expect(within(section).queryByRole('link')).not.toBeInTheDocument()
    expect(within(section).queryByRole('button')).not.toBeInTheDocument()
  })

  it('provides claim-safe process and benefit copy in exactly ten project locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    const forbiddenCommercialClaims =
      /revenue|profit|guarantee|umsatz|gewinn|garant|rentabil|chiffre d'affaires|ricav|ingresos|receita|omsætning|omzet|příjem/i

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/home.json`]
      expect(resource, `missing ${locale} home resource`).toBeDefined()
      expect(Object.keys(resource.why.signals)).toEqual(['access', 'workflow', 'conversation'])
      expect(Object.keys(resource.why.benefits)).toEqual(['practice', 'patient'])
      expect(Object.keys(resource.steps.items)).toEqual(['application', 'result', 'context'])

      const values = [
        resource.why.caption,
        resource.why.title,
        resource.why.intro,
        ...Object.values(resource.why.signals).flatMap(({ title, text }) => [title, text]),
        ...Object.values(resource.why.benefits).flatMap(({ label, title, text }) => [
          label,
          title,
          text,
        ]),
        resource.steps.caption,
        resource.steps.title,
        resource.steps.intro,
        resource.steps.aria_label,
        ...Object.values(resource.steps.items).flatMap(({ title, text }) => [title, text]),
        resource.steps.safety_note,
      ]

      for (const value of values) {
        expect(value.trim().length, `${locale} contains empty PT11.4 copy`).toBeGreaterThan(0)
        expect(value, `${locale} contains visible translation key`).not.toMatch(/^(why|steps)\./)
        expect(value, `${locale} contains prohibited commercial claim`).not.toMatch(
          forbiddenCommercialClaims,
        )
      }
    }
  })
})
