import { describe, expect, it } from 'vitest'

import { createRateLimiter } from './rate-limit'

describe('createRateLimiter', () => {
  it('allows up to the limit within the window, then blocks', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 })
    expect(limiter.check('ip', 0).ok).toBe(true)
    expect(limiter.check('ip', 100).ok).toBe(true)
    expect(limiter.check('ip', 200).ok).toBe(true)
    const blocked = limiter.check('ip', 300)
    expect(blocked).toEqual({ ok: false, retryAfterMs: 700 })
  })

  it('frees a slot as old hits leave the window', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 })
    limiter.check('ip', 0)
    limiter.check('ip', 500)
    expect(limiter.check('ip', 900).ok).toBe(false)
    expect(limiter.check('ip', 1001).ok).toBe(true)
  })

  it('tracks keys independently', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 })
    expect(limiter.check('a', 0).ok).toBe(true)
    expect(limiter.check('b', 0).ok).toBe(true)
    expect(limiter.check('a', 1).ok).toBe(false)
  })

  it('evicts the least recently used key past maxKeys', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 })
    limiter.check('a', 0)
    limiter.check('b', 0)
    limiter.check('c', 0) // evicts "a"
    expect(limiter.check('a', 1).ok).toBe(true)
  })
})
