import { describe, expect, it } from 'vitest'

import { getPageRange } from './page-range'

describe('getPageRange', () => {
  it('lists every page when they all fit', () => {
    expect(getPageRange(1, 1)).toEqual([1])
    expect(getPageRange(2, 3)).toEqual([1, 2, 3])
    expect(getPageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('collapses the end near the start', () => {
    expect(getPageRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20])
    expect(getPageRange(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20])
  })

  it('collapses the start near the end', () => {
    expect(getPageRange(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20])
    expect(getPageRange(17, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20])
  })

  it('collapses both sides in the middle', () => {
    expect(getPageRange(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20])
  })

  it('always has the same length once collapsed', () => {
    for (let page = 1; page <= 30; page++) expect(getPageRange(page, 30)).toHaveLength(7)
  })

  it('clamps out-of-range pages', () => {
    expect(getPageRange(99, 20)).toEqual(getPageRange(20, 20))
    expect(getPageRange(-3, 20)).toEqual(getPageRange(1, 20))
  })
})
