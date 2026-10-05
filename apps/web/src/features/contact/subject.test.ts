import { describe, expect, it } from 'vitest'

import { productSubject } from './subject'

describe('productSubject', () => {
  it('fills the template', () => {
    expect(productSubject('Needing help with {product}', 'Tungsten Needle Holder')).toBe(
      'Needing help with Tungsten Needle Holder',
    )
  })

  it('falls back to the default when the template has no placeholder', () => {
    expect(productSubject('Hello', 'Scissors')).toBe('Needing help with Scissors')
    expect(productSubject(undefined, 'Scissors')).toBe('Needing help with Scissors')
  })

  it('stays within the subject length limit', () => {
    expect(productSubject('{product}', 'x'.repeat(300))).toHaveLength(200)
  })
})
