import { describe, expect, it } from 'vitest'

import { catalogHref, parseCatalogParams } from './params'

describe('parseCatalogParams', () => {
  it('reads category, query, and page', () => {
    expect(parseCatalogParams({ category: 'urology', q: ' scissors ', page: '2' })).toEqual({
      category: 'urology',
      q: 'scissors',
      page: 2,
    })
  })

  it('defaults to the first page with no filters', () => {
    expect(parseCatalogParams({})).toEqual({ category: undefined, q: undefined, page: 1 })
  })

  it('ignores invalid values', () => {
    expect(parseCatalogParams({ category: '<script>', q: '   ', page: '-4' })).toEqual({
      category: undefined,
      q: undefined,
      page: 1,
    })
    expect(parseCatalogParams({ page: 'abc' }).page).toBe(1)
    expect(parseCatalogParams({ q: 'x'.repeat(101) }).q).toBeUndefined()
  })

  it('uses the first value of repeated params', () => {
    expect(parseCatalogParams({ category: ['urology', 'plastic-surgery'] }).category).toBe(
      'urology',
    )
  })
})

describe('catalogHref', () => {
  it('leaves out defaults', () => {
    expect(catalogHref('surgical-specialties')).toBe('/products/surgical-specialties')
    expect(catalogHref('surgical-specialties', { page: 1 })).toBe('/products/surgical-specialties')
  })

  it('encodes filters, query, and page', () => {
    expect(
      catalogHref('surgical-specialties', { category: 'urology', q: 'fine scissors', page: 3 }),
    ).toBe('/products/surgical-specialties?category=urology&q=fine+scissors&page=3')
  })
})
