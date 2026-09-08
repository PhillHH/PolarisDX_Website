// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SUPPORTED_LANGUAGES } from '../../i18n'
import { BEFUND_ORDER, RADAR_VALUES } from '../../content/befunde/meta'
import { BefundBlock } from './BefundBlocks'
import { RadarChart } from './BefundCharts'

const reportDocuments = import.meta.glob('../../content/befunde/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, { blocks: Array<{ type: string; axes?: unknown[] }> }>

describe('report block and chart rendering', () => {
  it('fails loudly when an unknown productive block reaches the renderer', () => {
    expect(() =>
      renderToStaticMarkup(
        <BefundBlock block={{ id: 'invalid', type: 'unknown-productive-block' } as never} />,
      ),
    ).toThrow(/Unhandled report block/u)
  })

  it('renders the exact radar vectors as a semantic text alternative', () => {
    const html = renderToStaticMarkup(
      <RadarChart
        axes={['Axis A', 'Axis B']}
        profile={[3, 8]}
        reference={[5, 4]}
        labels={{ profile: 'Profile', reference: 'Reference' }}
        max={10}
        beschreibung="Two-axis comparison"
      />,
    )

    expect(html).toContain('Two-axis comparison')
    expect(html).toContain('<dt class="text-sm font-semibold text-heading">Axis A</dt>')
    expect(html).toContain('Profile: 3 / 10')
    expect(html).toContain('Reference: 5 / 10')
    expect(html).toContain('Profile: 8 / 10')
    expect(html).toContain('Reference: 4 / 10')
    expect(html).toContain('stroke-dasharray="8 5"')
  })

  it('keeps every localized radar label vector complete and aligned with its source values', () => {
    for (const slug of BEFUND_ORDER) {
      const values = RADAR_VALUES[slug]
      if (!values) continue
      for (const locale of SUPPORTED_LANGUAGES) {
        const report = reportDocuments[`../../content/befunde/${slug}.${locale}.json`]
        expect(report, `${slug}.${locale}: report source`).toBeDefined()
        const radar = report.blocks.find(({ type }) => type === 'radar')
        expect(radar, `${slug}.${locale}: radar block`).toBeDefined()
        expect(radar!.axes, `${slug}.${locale}: profile vector`).toHaveLength(values.profile.length)
        if (values.reference) {
          expect(radar!.axes, `${slug}.${locale}: reference vector`).toHaveLength(
            values.reference.length,
          )
        }
        expect(
          radar!.axes!.every((axis) => typeof axis === 'string' && axis.trim().length > 0),
          `${slug}.${locale}: translated axes`,
        ).toBe(true)
      }
    }
  })
})
