import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstile } from './turnstile'

const mockFetch = (impl: () => Promise<Response>) =>
  vi.spyOn(globalThis, 'fetch').mockImplementation(impl)

afterEach(() => vi.restoreAllMocks())

describe('verifyTurnstile', () => {
  it('fails without a token, without calling Cloudflare', async () => {
    const fetchSpy = mockFetch(async () => Response.json({ success: true }))
    expect(await verifyTurnstile({ token: undefined, secret: 's' })).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('passes the secret, token and IP and reads success', async () => {
    const fetchSpy = mockFetch(async () => Response.json({ success: true }))
    expect(await verifyTurnstile({ token: 't', secret: 's', ip: '1.2.3.4' })).toBe(true)
    const body = fetchSpy.mock.calls[0]?.[1]?.body as URLSearchParams
    expect(Object.fromEntries(body)).toEqual({ secret: 's', response: 't', remoteip: '1.2.3.4' })
  })

  it('fails on a rejected token or a network error', async () => {
    mockFetch(async () => Response.json({ success: false }))
    expect(await verifyTurnstile({ token: 't', secret: 's' })).toBe(false)
    vi.restoreAllMocks()
    mockFetch(async () => {
      throw new Error('offline')
    })
    expect(await verifyTurnstile({ token: 't', secret: 's' })).toBe(false)
  })
})
