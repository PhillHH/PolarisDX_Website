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
import { Chain, Muscle, Ring, Sorter, Trend } from './widgetsContext'
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
  /** Der Satz unter dem Baustein (im Schritt „ansehen" steht er am Telefon zusätzlich oben). */
  const said = (text: string | RegExp) =>
    expect(document.querySelector('.xp-say')).toHaveTextContent(text)

  it('Pult: a stimulus moves faders, the sequence stays and one sentence explains it', () => {
    const { container } = render(<Pult texts={de.widgets} ui={de.ui} />)
    const switches = screen.getAllByRole('switch')
    expect(switches).toHaveLength(6)
    const sequence = container.querySelector('.xp-seq')?.textContent
    said(de.widgets.pult.sayIdle)

    fireEvent.click(switches[0])
    expect(switches[0]).toHaveAttribute('aria-checked', 'true')
    expect(container.querySelectorAll('.xp-faders .is-moved').length).toBeGreaterThan(0)
    said(/1 von 6 Reizen aktiv/)
    expect(container.querySelector('.xp-seq')?.textContent).toBe(sequence)

    fireEvent.click(switches[0])
    said(de.widgets.pult.sayNone)
    expect(container.querySelectorAll('.xp-faders .is-moved')).toHaveLength(0)
  })

  it('Methyl: the effect of a mark depends on its position', () => {
    render(<Mechanisms texts={de.widgets} ui={de.ui} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    const site = (n: number) =>
      screen.getByRole('button', { name: fill(de.widgets.methyl.site, { n }) })

    fireEvent.click(site(1))
    expect(site(1)).toHaveAttribute('aria-pressed', 'true')
    said(fill(de.widgets.methyl.saySetLower, { n: 1 }))

    fireEvent.click(site(3))
    said(fill(de.widgets.methyl.saySetHigher, { n: 3 }))

    fireEvent.click(site(3))
    said(fill(de.widgets.methyl.sayRemoved, { n: 3 }))
  })

  it('Mechanisms: the RNA tab docks and releases the microRNA', () => {
    render(<Mechanisms texts={de.widgets} ui={de.ui} />)
    fireEvent.click(screen.getByRole('tab', { name: /RNA/ }))
    const button = screen.getByRole('button', { name: de.widgets.rna.dock })
    fireEvent.click(button)
    said(de.widgets.rna.sayDocked)
    fireEvent.click(screen.getByRole('button', { name: de.widgets.rna.undock }))
    said(de.widgets.rna.sayFree)
  })

  it('Chain: walks the five levels and starts over', () => {
    render(<Chain texts={de.widgets} ui={de.ui} chain="chainPsy" />)
    const steps = de.widgets.chainPsy.steps
    said(steps[0].text)
    for (let index = 1; index < steps.length; index++) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${de.ui.next}`) }))
      said(steps[index].text)
    }
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${de.ui.restart}`) }))
    said(steps[0].text)
  })

  it('Muscle: the three phases unlock one after another', () => {
    render(<Muscle texts={de.widgets} ui={de.ui} />)
    const t = de.widgets.muscle
    const button = (index: number) =>
      screen.getByRole('button', { name: `${index + 1} · ${t.buttons[index]}` })
    expect(button(1)).toBeDisabled()
    fireEvent.click(button(0))
    said(t.say[0])
    fireEvent.click(button(1))
    fireEvent.click(button(2))
    said(t.say[2])
    fireEvent.click(screen.getByRole('button', { name: t.reset }))
    said(t.sayReset)
  })

  it('Trend: one value is no trend, several measurements are', () => {
    render(<Trend texts={de.widgets} ui={de.ui} />)
    const t = de.widgets.trend
    said(t.sayOne)
    fireEvent.change(screen.getByRole('slider', { name: t.countAria }), { target: { value: '4' } })
    said(fill(t.sayMany, { n: 4 }))
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
    said(fill(t.result, { right: 5, total: 6 }))
    expect(screen.getByText(t.importantItems[0])).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: t.again }))
    expect(screen.getByText(t.usefulItems[0])).toBeInTheDocument()
  })

  it('SC-033 guide: leads step by step, shows the result and ends with the take-away', () => {
    const { container } = render(<Pult texts={de.widgets} ui={de.ui} />)
    const g = de.ui.guide
    const guide = de.widgets.pult.guide
    const [first, second, , fourth] = de.widgets.influences.short
    const widget = container.querySelector('[data-explainer-widget="pult"]')!
    const coach = container.querySelector('.xp-coach')!
    const switches = screen.getAllByRole('switch')

    // Zweck, erster Handgriff mit der echten Beschriftung, markiertes Bedienelement
    expect(container.querySelector('.xp-shows')).toHaveTextContent(guide.shows)
    expect(widget).toHaveAttribute('data-phase', 'do')
    expect(coach).toHaveTextContent(fill(g.step, { n: 1, total: 2 }))
    expect(coach).toHaveTextContent(fill(guide.steps[0], { label: first }))
    expect(switches[0]).toHaveClass('is-coach')
    expect(container.querySelector('.xp-tag')).toHaveTextContent(g.tap)
    expect(screen.queryByRole('button', { name: new RegExp(g.next) })).toBeNull()

    // Handgriff getan: Blick auf das Ergebnis, „Weiter" erscheint
    fireEvent.click(switches[0])
    expect(widget).toHaveAttribute('data-phase', 'see')
    expect(coach).toHaveTextContent(g.look)
    expect(container.querySelector('.xp-faders')).toHaveClass('is-watch')
    expect(switches[0]).not.toHaveClass('is-coach')
    expect(container.querySelector('.xp-tag')).toBeNull()
    fireEvent.click(container.querySelector('.xp-res-next')!)

    // Zweiter Handgriff: der Fokus liegt auf dem nächsten Bedienelement
    expect(widget).toHaveAttribute('data-phase', 'do')
    expect(coach).toHaveTextContent(fill(guide.steps[1], { label: fourth }))
    expect(switches[3]).toHaveClass('is-coach')
    expect(switches[3]).toHaveFocus()
    fireEvent.click(switches[1])
    expect(widget).toHaveAttribute('data-phase', 'see')
    expect(container.querySelector('.xp-res-next')).toHaveTextContent(g.understood)
    fireEvent.click(container.querySelector('.xp-res-next')!)

    // Merksatz, frei weiter; „Noch einmal von vorn" setzt den Baustein zurück
    expect(widget).toHaveAttribute('data-phase', 'learn')
    expect(coach).toHaveTextContent(guide.learn)
    const again = screen.getByRole('button', { name: g.again })
    expect(again).toHaveFocus()
    expect(second).toBeTruthy()
    fireEvent.click(again)
    const fresh = screen.getAllByRole('switch')
    expect(fresh.every((item) => item.getAttribute('aria-checked') === 'false')).toBe(true)
    expect(container.querySelector('[data-explainer-widget="pult"]')).toHaveAttribute(
      'data-phase',
      'do',
    )
    expect(fresh[0]).toHaveFocus()
  })

  it('SC-033 guide: the keyboard completes a step and a single step says how it works', () => {
    const { container } = render(<Ring texts={de.widgets} ui={de.ui} />)
    const nodes = container.querySelectorAll('.xp-ring g[role="button"]')
    expect(nodes[3]).toHaveClass('is-coach')
    fireEvent.keyDown(nodes[3], { key: 'Enter' })
    expect(container.querySelector('[data-explainer-widget="ring"]')).toHaveAttribute(
      'data-phase',
      'see',
    )
    expect(nodes[3]).toHaveClass('is-on')

    const single = render(<Trend texts={de.widgets} ui={de.ui} />)
    const coach = single.container.querySelector('.xp-coach')!
    expect(coach).toHaveTextContent(de.ui.guide.how)
    expect(single.container.querySelector('.xp-coach-dots')).toBeNull()
    expect(single.container.querySelector('.xp-tag')).toHaveTextContent(de.ui.guide.drag)
  })

  it('SC-033 guide: every step text names a control label in all ten locales', () => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const { ui, widgets } = explainerContent[locale]
      for (const key of Object.keys(ui.guide) as Array<keyof typeof ui.guide>) {
        expect(ui.guide[key].length, `${locale} ui.guide.${key}`).toBeGreaterThan(1)
      }
      expect(widgets.pult.guide.steps[0], locale).toContain('{{label}}')
      expect(widgets.sort.guide.steps[0], locale).toContain('{{other}}')
      expect(explainerContent[locale].stage.canvas.legend).toHaveLength(6)
    }
  })
})
