import { describe, expect, it } from 'vitest'

import { isActivePath } from './navigation'

describe('isActivePath', () => {
  it('matches home only on the root path', () => {
    expect(isActivePath('/', '/')).toBe(true)
    expect(isActivePath('/products', '/')).toBe(false)
  })

  it('matches a section and its children, but not lookalike paths', () => {
    expect(isActivePath('/products', '/products')).toBe(true)
    expect(isActivePath('/products/surgical-specialties', '/products')).toBe(true)
    expect(isActivePath('/products-old', '/products')).toBe(false)
  })
})
