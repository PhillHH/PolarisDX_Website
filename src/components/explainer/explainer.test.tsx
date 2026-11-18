import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  EXPLAINER_CHAPTER_IDS,
  fill,
  loadExplainerContent,
  type ExplainerContent,
} from '../../content/articles/was-ist-epigenetik'
import de from '../../content/articles/was-ist-epigenetik/de.json'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n'
import { Chain, Muscle, Sorter, Trend } from './widgetsContext'
import { Mechanisms, Pult } from './widgetsRegulation'

/** Alle Sprachfassungen, so wie sie im Ordner liegen: Dateiname = Sprache. */
const explainerContent = Object.fromEntries(
  Object.entries(
    import.meta.glob<ExplainerContent>('../../content/articles/was-ist-epigenetik/*.json', {
      eager: true,
      import: 'default',
    }),
  ).map(([path, document]) => [path.slice(path.lastIndexOf('/') + 1, -'.json'.length), document]),
) as Record<SupportedLanguage, ExplainerContent>

/** Form eines Dokuments: Schlüssel, Reihenfolge und Feldlängen, ohne die Texte selbst. */
const shape = (value: unknown): string =>
  Array.isArray(value)
    ? `[${value.map(shape).join(',')}]`
    : value && typeof value === 'object'
      ? `{${Object.entries(value)
          .map(([key, inner]) => `${key}:${shape(inner)}`)
          .join(',')}}`
      : 's'
const texts = (value: unknown, path = ''): Array<[string, string]> =>
  typeof value === 'string'
    ? [[path, value]]
    : value && typeof value === 'object'
      ? Object.entries(value).flatMap(([key, inner]) => texts(inner, `${path}.${key}`))
      : []
const placeholders = (text: string) => (text.match(/{{\w+}}/g) ?? []).sort().join()

describe('SC-031 explainer content x10', () => {
  it('keeps structure, list lengths and placeholders identical in all ten locales', () => {
    expect(Object.keys(explainerContent).sort()).toEqual([...SUPPORTED_LANGUAGES].sort())
    const source = new Map(texts(de))
    for (const locale of SUPPORTED_LANGUAGES) {
      const document = explainerContent[locale]
      expect(shape(document), `${locale}: structure`).toBe(shape(de))
      for (const [path, text] of texts(document)) {
        expect(text.trim(), `${locale}${path}: empty`).not.toBe('')
        expect(placeholders(text), `${locale}${path}: placeholders`).toBe(
          placeholders(source.get(path) ?? ''),
        )
      }
    }
  })

  it('is independently localized and has one chapter per anchor', () => {
    expect(de.chapters).toHaveLength(EXPLAINER_CHAPTER_IDS.length)
    expect(de.stage.steps).toHaveLength(6)
    const answers = SUPPORTED_LANGUAGES.map((locale) => explainerContent[locale].chapters[0].answer)
    expect(new Set(answers).size).toBe(SUPPORTED_LANGUAGES.length)
  })

  it('fills placeholders and leaves unknown ones untouched', () => {
    expect(fill('{{n}} von {{total}}', { n: 2, total: 6 })).toBe('2 von 6')
    expect(fill('{{name}} bleibt', {})).toBe('{{name}} bleibt')
  })

  it('loads only the language of the URL in the browser', async () => {
    const calls: string[] = []
    const loaders = Object.fromEntries(
      SUPPORTED_LANGUAGES.map((locale) => [
        locale,
        () => {
          calls.push(locale)
          return Promise.resolve({ default: explainerContent[locale] })
        },
      ]),
    ) as Parameters<typeof loadExplainerContent>[0]

    window.history.replaceState(null, '', '/fr/articles/was-ist-epigenetik')
    const loaded = await loadExplainerContent(loaders)
    expect(calls).toEqual(['fr'])
    expect(Object.keys(loaded)).toEqual(['fr'])
    expect(loaded.fr?.chapters).toHaveLength(EXPLAINER_CHAPTER_IDS.length)
    window.history.replaceState(null, '', '/')
  })
})

describe('SC-031 explainer widgets', () => {
  afterEach(() => vi.useRealTimers())

  it('Pult: a stimulus moves faders, the sequence stays and one sentence explains it', () => {
    const { container } = render(<Pult texts={de.widgets} ui={de.ui} />)
    const switches = screen.getAllByRole('switch')
    expect(switches).toHaveLength(6)
    const sequence = container.querySelector('.xp-seq')?.textContent
    expect(screen.getByText(de.widgets.pult.sayIdle)).toBeInTheDocument()

    fireEvent.click(switches[0])
    expect(switches[0]).toHaveAttribute('aria-checked', 'true')
    expect(container.querySelectorAll('.xp-faders .is-moved').length).toBeGreaterThan(0)
    expect(screen.getByText(/1 von 6 Reizen aktiv/)).toBeInTheDocument()
    expect(container.querySelector('.xp-seq')?.textContent).toBe(sequence)

    fireEvent.click(switches[0])
    expect(screen.getByText(de.widgets.pult.sayNone)).toBeInTheDocument()
    expect(container.querySelectorAll('.xp-faders .is-moved')).toHaveLength(0)
  })

  it('Methyl: the effect of a mark depends on its position', () => {
    render(<Mechanisms texts={de.widgets} ui={de.ui} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    const site = (n: number) =>
      screen.getByRole('button', { name: fill(de.widgets.methyl.site, { n }) })

    fireEvent.click(site(1))
    expect(site(1)).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(fill(de.widgets.methyl.saySetLower, { n: 1 }))).toBeInTheDocument()

    fireEvent.click(site(3))
    expect(screen.getByText(fill(de.widgets.methyl.saySetHigher, { n: 3 }))).toBeInTheDocument()

    fireEvent.click(site(3))
    expect(screen.getByText(fill(de.widgets.methyl.sayRemoved, { n: 3 }))).toBeInTheDocument()
  })

  it('Mechanisms: the RNA tab docks and releases the microRNA', () => {
    render(<Mechanisms texts={de.widgets} ui={de.ui} />)
    fireEvent.click(screen.getByRole('tab', { name: /RNA/ }))
    const button = screen.getByRole('button', { name: de.widgets.rna.dock })
    fireEvent.click(button)
    expect(screen.getByText(de.widgets.rna.sayDocked)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: de.widgets.rna.undock }))
    expect(screen.getByText(de.widgets.rna.sayFree)).toBeInTheDocument()
  })

  it('Chain: walks the five levels and starts over', () => {
    render(<Chain texts={de.widgets} ui={de.ui} chain="chainPsy" />)
    const steps = de.widgets.chainPsy.steps
    expect(screen.getByText(steps[0].text)).toBeInTheDocument()
    for (let index = 1; index < steps.length; index++) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${de.ui.next}`) }))
      expect(screen.getByText(steps[index].text)).toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${de.ui.restart}`) }))
    expect(screen.getByText(steps[0].text)).toBeInTheDocument()
  })

  it('Muscle: the three phases unlock one after another', () => {
    render(<Muscle texts={de.widgets} ui={de.ui} />)
    const t = de.widgets.muscle
    const button = (index: number) =>
      screen.getByRole('button', { name: `${index + 1} · ${t.buttons[index]}` })
    expect(button(1)).toBeDisabled()
    fireEvent.click(button(0))
    expect(screen.getByText(t.say[0])).toBeInTheDocument()
    fireEvent.click(button(1))
    fireEvent.click(button(2))
    expect(screen.getByText(t.say[2])).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: t.reset }))
    expect(screen.getByText(t.sayReset)).toBeInTheDocument()
  })

  it('Trend: one value is no trend, several measurements are', () => {
    render(<Trend texts={de.widgets} ui={de.ui} />)
    const t = de.widgets.trend
    expect(screen.getByText(t.sayOne)).toBeInTheDocument()
    fireEvent.change(screen.getByRole('slider', { name: t.countAria }), { target: { value: '4' } })
    expect(screen.getByText(fill(t.sayMany, { n: 4 }))).toBeInTheDocument()
  })

  it('Sorter: counts correct answers and ends with the overview', () => {
    vi.useFakeTimers()
    render(<Sorter texts={de.widgets} ui={de.ui} />)
    const t = de.widgets.sort
    // abwechselnd sinnvoll / nicht sinnvoll; die letzte Antwort absichtlich falsch
    const picks = [t.useful, t.notUseful, t.useful, t.notUseful, t.useful, t.useful]
    for (const name of picks) {
      fireEvent.click(screen.getByRole('button', { name }))
      act(() => {
        vi.advanceTimersByTime(1200)
      })
    }
    expect(screen.getByText(fill(t.result, { right: 5, total: 6 }))).toBeInTheDocument()
    expect(screen.getByText(t.importantItems[0])).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: t.again }))
    expect(screen.getByText(t.usefulItems[0])).toBeInTheDocument()
  })
})
