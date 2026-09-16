import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SUPPORTED_LANGUAGES } from '../../i18n'
import type { LocaleRouteLocation } from '../../lib/localeRoute'
import LanguageSwitcher from './LanguageSwitcher'

/**
 * AP27 PT27.1 — Sprachumschalter als zentrales UI-Pattern.
 *
 * Die URL-Berechnung selbst beweist `localeRoute.test.ts`. Hier steht, dass der Umschalter genau
 * die zehn Sprachen anbietet, den aktuellen Zustand programmatisch meldet, per Tastatur bedienbar
 * ist und beim Wechsel wirklich navigiert. jsdom kann nicht zu einem anderen Pfad navigieren und
 * `location.assign` ist dort nicht ersetzbar; deshalb liefert der (echte, umhuellte) URL-Bauer
 * eine Hash-URL, deren Wirkung am `location.hash` sichtbar wird.
 */

// Eigener i18n-Mock mit veraenderbarer Sprache (der globale in `src/test/setup.ts` ist fest `de`).
const i18n = vi.hoisted(() => ({ language: 'de' }))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n }),
}))

const switchCalls = vi.hoisted(
  () => [] as Array<{ location: LocaleRouteLocation; language: string; url: string }>,
)

vi.mock('../../lib/localeRoute', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../lib/localeRoute')>()
  return {
    ...original,
    buildLanguageSwitchUrl: (
      location: LocaleRouteLocation,
      language: Parameters<typeof original.buildLanguageSwitchUrl>[1],
    ) => {
      const url = original.buildLanguageSwitchUrl(location, language)
      switchCalls.push({ location, language, url })
      return `#switch=${encodeURIComponent(url)}`
    },
  }
})

const LANGUAGE_NAMES = [
  'Deutsch',
  'English',
  'Polski',
  'Français',
  'Italiano',
  'Español',
  'Português',
  'Dansk',
  'Nederlands',
  'Čeština',
]

const renderSwitcher = (path = '/about') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageSwitcher />
    </MemoryRouter>,
  )

const trigger = () => screen.getByRole('button', { name: 'a11y.select_language' })
const options = () => screen.getAllByRole('button').filter((button) => button !== trigger())

afterEach(() => {
  cleanup()
  i18n.language = 'de'
  switchCalls.length = 0
  window.location.hash = ''
})

describe('LanguageSwitcher — Zustand und Angebot', () => {
  it('ist ein benannter, zugeklappter Knopf ohne Liste im DOM', () => {
    renderSwitcher()
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveAttribute('type', 'button')
    expect(trigger()).toHaveTextContent('de')
    expect(options()).toHaveLength(0)
  })

  it('bietet genau die zehn Sprachen in kanonischer Reihenfolge an', () => {
    renderSwitcher()
    fireEvent.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(SUPPORTED_LANGUAGES).toHaveLength(LANGUAGE_NAMES.length)
    expect(options().map((option) => option.textContent)).toEqual(LANGUAGE_NAMES)
  })

  it('meldet die aktive Sprache programmatisch — genau eine', () => {
    renderSwitcher()
    fireEvent.click(trigger())
    const current = options().filter((option) => option.getAttribute('aria-current') === 'true')
    expect(current.map((option) => option.textContent)).toEqual(['Deutsch'])
  })

  it('ordnet einen Regionscode (en-US) der Basissprache zu, nicht dem Default', () => {
    i18n.language = 'en-US'
    renderSwitcher()
    expect(trigger()).toHaveTextContent('en')
    fireEvent.click(trigger())
    const current = options().filter((option) => option.getAttribute('aria-current') === 'true')
    expect(current.map((option) => option.textContent)).toEqual(['English'])
  })
})

describe('LanguageSwitcher — Tastatur und Schliessen', () => {
  it('Pfeil ab oeffnet und setzt den Fokus auf die erste Sprache', async () => {
    renderSwitcher()
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' })
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(options()[0]).toHaveFocus())
  })

  it('Ende, Anfang und Pfeil auf wandern durch die Liste und laufen um', () => {
    renderSwitcher()
    fireEvent.click(trigger())
    options()[0].focus()
    fireEvent.keyDown(options()[0], { key: 'End' })
    expect(options()[9]).toHaveFocus()
    fireEvent.keyDown(options()[9], { key: 'Home' })
    expect(options()[0]).toHaveFocus()
    fireEvent.keyDown(options()[0], { key: 'ArrowUp' })
    expect(options()[9]).toHaveFocus()
    fireEvent.keyDown(options()[9], { key: 'ArrowDown' })
    expect(options()[0]).toHaveFocus()
  })

  it('Escape schliesst und gibt den Fokus an den Ausloeser zurueck', () => {
    renderSwitcher()
    fireEvent.click(trigger())
    options()[3].focus()
    fireEvent.keyDown(options()[3], { key: 'Escape' })
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(options()).toHaveLength(0)
    expect(trigger()).toHaveFocus()
  })

  it('ein Klick ausserhalb schliesst die Liste', () => {
    renderSwitcher()
    fireEvent.click(trigger())
    fireEvent.mouseDown(document.body)
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('LanguageSwitcher — Wechsel', () => {
  it('navigiert zur selben logischen Seite in der Zielsprache, mit Query und Hash', () => {
    renderSwitcher('/diagnostics/dental?utm_source=nav#ablauf')
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: /Polski/ }))

    expect(switchCalls).toHaveLength(1)
    expect(switchCalls[0].language).toBe('pl')
    expect(switchCalls[0].url).toBe('/pl/diagnostics/dental?utm_source=nav#ablauf')
    // Die Navigation ist wirklich ausgeloest worden, nicht nur berechnet.
    expect(decodeURIComponent(window.location.hash.replace('#switch=', ''))).toBe(
      switchCalls[0].url,
    )
    expect(options()).toHaveLength(0)
  })
})
