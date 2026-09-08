// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  epigeneticsHubHref,
  epigeneticsInquiryHref,
  musterbefundHref,
  readEpigeneticsContext,
  readEpigeneticsInquirySource,
} from './epigeneticsContext'

describe('Epigenetics URL context', () => {
  it('accepts only the six canonical panels and five known focus keys', () => {
    expect(readEpigeneticsContext(new URLSearchParams('panel=healthy-aging&focus=sports'))).toEqual(
      {
        panel: 'healthy-aging',
        focus: 'sports',
      },
    )
    expect(readEpigeneticsContext(new URLSearchParams('panel=seventh-panel&focus=price'))).toEqual({
      panel: null,
      focus: null,
    })
  })

  it('builds bookmarkable Hub and report links without a new route family', () => {
    expect(epigeneticsHubHref({ panel: 'stress-monitor', focus: 'bgm' }, 'analysen')).toBe(
      '/epigenetics?panel=stress-monitor&focus=bgm#analysen',
    )
    expect(musterbefundHref('healthy-sport', 'sports')).toBe(
      '/epigenetics/musterbefund/healthy-sport?panel=healthy-sport&focus=sports',
    )
    expect(musterbefundHref('healthy-sport', 'sports', 'partner autumn')).toBe(
      '/epigenetics/musterbefund/healthy-sport?panel=healthy-sport&focus=sports&campaign=partner+autumn',
    )
  })

  it('keeps the existing real inquiry route and encodes visible panel names', () => {
    expect(epigeneticsInquiryHref('telomer-analyse', 'longevity')).toBe(
      '/epigenetics?source=epigenetics&panel=telomer-analyse&focus=longevity#inquiry',
    )
    expect(epigeneticsInquiryHref()).toBe('/epigenetics?source=epigenetics#inquiry')
    expect(epigeneticsInquiryHref('healthy-aging', 'longevity', 'report', 'musterbefund')).toBe(
      '/epigenetics?source=musterbefund&panel=healthy-aging&focus=longevity&campaign=report#inquiry',
    )
  })

  it('accepts only the report source needed by the existing inquiry journey', () => {
    expect(readEpigeneticsInquirySource(new URLSearchParams('source=musterbefund'))).toBe(
      'musterbefund',
    )
    expect(readEpigeneticsInquirySource(new URLSearchParams('source=untrusted'))).toBe(
      'epigenetics',
    )
  })
})
