import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  why: {
    title: string
    signals: Record<'access' | 'workflow' | 'conversation', { title: string }>
    benefits: Record<'practice' | 'patient', { label: string; title: string }>
  }
  steps: {
    title: string
    aria_label: string
    items: Record<'application' | 'result' | 'context', { title: string }>
  }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT11.4 ${locale} renders separated benefits and an ordered POC process`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const why = page.locator('#warum-poc')
    await expect(why.getByRole('heading', { level: 2 })).toHaveText(resources[locale].why.title)
    await expect(why.locator('[data-poc-signal]')).toHaveCount(3)
    for (const signalId of ['access', 'workflow', 'conversation'] as const) {
      await expect(
        why
          .locator(`[data-poc-signal="${signalId}"]`)
          .getByText(resources[locale].why.signals[signalId].title, { exact: true }),
      ).toBeVisible()
    }
    await expect(why.locator('[data-benefit-audience="practice"]')).toContainText(
      resources[locale].why.benefits.practice.label,
    )
    await expect(why.locator('[data-benefit-audience="patient"]')).toContainText(
      resources[locale].why.benefits.patient.label,
    )
    await expect(why.getByRole('link')).toHaveCount(0)
    await expect(why.getByRole('button')).toHaveCount(0)

    const process = page.locator('#ablauf')
    expect(
      await page.locator('#warum-poc, #ablauf').evaluateAll((nodes) => nodes.map(({ id }) => id)),
    ).toEqual(['warum-poc', 'ablauf'])
    await expect(process.getByRole('heading', { level: 2 })).toHaveText(
      resources[locale].steps.title,
    )
    const list = process.getByRole('list', { name: resources[locale].steps.aria_label })
    const items = list.getByRole('listitem')
    await expect(items).toHaveCount(3)
    for (const [index, stepId] of ['application', 'result', 'context'].entries()) {
      const item = items.nth(index)
      await expect(item).toHaveAttribute('data-process-step', stepId)
      await expect(item.getByRole('heading', { level: 3 })).toHaveText(
        resources[locale].steps.items[stepId as keyof HomeResource['steps']['items']].title,
      )
    }
    await expect(process.getByRole('link')).toHaveCount(0)
    await expect(process.getByRole('button')).toHaveCount(0)
  })
}

test('PT11.4 mobile preserves reading order and has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const why = page.locator('#warum-poc')
  const process = page.locator('#ablauf')
  await why.scrollIntoViewIfNeeded()
  await expect(why).toBeVisible()
  await process.scrollIntoViewIfNeeded()
  await expect(process).toBeVisible()

  const order = await process
    .locator('[data-process-step]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-process-step')))
  expect(order).toEqual(['application', 'result', 'context'])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
