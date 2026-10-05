import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('keeps a custom font size alongside a text color', () => {
    expect(cn('text-display-xl', 'text-white')).toBe('text-display-xl text-white')
    expect(cn('text-md text-fg-primary')).toBe('text-md text-fg-primary')
  })

  it('lets a later font size override an earlier one', () => {
    expect(cn('text-sm', 'text-display-md')).toBe('text-display-md')
  })

  it('lets a later text color override an earlier one', () => {
    expect(cn('text-fg-primary', 'text-brand-600')).toBe('text-brand-600')
  })

  it('merges conflicting spacing and drops falsy values', () => {
    expect(cn('px-4', false, undefined, 'px-8')).toBe('px-8')
  })
})
