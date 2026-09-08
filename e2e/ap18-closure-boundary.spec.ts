import { expect, test } from '@playwright/test'

import { events, getEventPageProjection, pastEvents } from '../src/data/events'

const fixedNow = process.env.POLARIS_FIXED_NOW
if (!fixedNow) throw new Error('POLARIS_FIXED_NOW is required')

const eventDay = fixedNow.slice(0, 10)
const expected = getEventPageProjection(events, pastEvents, eventDay)

function attributes(html: string, element: string, attribute: string): string[] {
  const pattern = new RegExp(`<${element}\\b[^>]*\\b${attribute}="([^"]+)"[^>]*>`, 'g')
  return [...html.matchAll(pattern)].map((match) => match[1])
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(fixedNow))
})

test(`AP18 closure SSR/client parity at fixed ${eventDay}`, async ({ page, request }) => {
  const hydrationErrors: string[] = []
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|did not match|server rendered/i.test(message.text())
    ) {
      hydrationErrors.push(message.text())
    }
  })

  const response = await request.get('/de/events', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(attributes(html, 'li', 'data-event-id')).toEqual(expected.listEvents.map(({ id }) => id))
  expect(attributes(html, 'li', 'data-past-event-id')).toEqual(expected.archive.map(({ id }) => id))
  expect(html.includes('data-event-highlight')).toBe(Boolean(expected.highlight))

  await page.goto('/de/events')
  expect(
    await page
      .locator('li[data-event-id]')
      .evaluateAll((items) => items.map((item) => item.getAttribute('data-event-id'))),
  ).toEqual(expected.listEvents.map(({ id }) => id))
  expect(
    await page
      .locator('[data-past-event-id]')
      .evaluateAll((items) => items.map((item) => item.getAttribute('data-past-event-id'))),
  ).toEqual(expected.archive.map(({ id }) => id))
  await expect(page.locator('[data-event-highlight]')).toHaveCount(expected.highlight ? 1 : 0)
  expect(hydrationErrors).toEqual([])
})
