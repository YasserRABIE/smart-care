import { beforeEach, describe, expect, it, vi } from 'vitest'

import { handleInquiry, inquiryErrors, type InquiryDeps } from './handle-inquiry'

const valid = {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Needing help with Tungsten Needle Holder',
  message: 'Please send a quote for 10 units.',
  sourcePage: '/contact',
}

const find = vi.fn()
const create = vi.fn()
const logger = { error: vi.fn() }
const rateLimit = vi.fn(() => ({ ok: true }))

const deps = (overrides: Partial<InquiryDeps> = {}): InquiryDeps => ({
  payload: { find, create, logger } as unknown as InquiryDeps['payload'],
  ip: '1.2.3.4',
  rateLimit,
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  find.mockResolvedValue({ docs: [{ id: 3, productLine: 1 }] })
  create.mockResolvedValue({ id: 10 })
  rateLimit.mockReturnValue({ ok: true })
})

describe('handleInquiry', () => {
  it('saves a valid inquiry with the product and line resolved on the server', async () => {
    const result = await handleInquiry({ ...valid, product: 'tungsten-needle-holder' }, deps())
    expect(result).toEqual({ status: 'success' })
    expect(find.mock.calls[0]?.[0].where).toEqual({
      and: [{ slug: { equals: 'tungsten-needle-holder' } }, { _status: { equals: 'published' } }],
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'inquiries',
        overrideAccess: true,
        data: expect.objectContaining({
          product: 3,
          productLine: 1,
          sourcePage: '/contact',
          status: 'new',
        }),
      }),
    )
  })

  it('returns field errors and the entered values for invalid input', async () => {
    const result = await handleInquiry({ ...valid, email: 'nope', message: 'hi' }, deps())
    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: { email: expect.any(String), message: expect.any(String) },
      values: { email: 'nope', message: 'hi' },
    })
    expect(create).not.toHaveBeenCalled()
  })

  it('pretends to succeed and saves nothing when the honeypot is filled', async () => {
    expect(await handleInquiry({ ...valid, website: 'http://spam.test' }, deps())).toEqual({
      status: 'success',
    })
    expect(create).not.toHaveBeenCalled()
    expect(rateLimit).not.toHaveBeenCalled()
  })

  it('stops rate-limited IPs before verification and saving', async () => {
    rateLimit.mockReturnValue({ ok: false })
    const verify = vi.fn()
    const result = await handleInquiry(valid, deps({ verifyTurnstile: verify }))
    expect(result).toMatchObject({ status: 'error', message: inquiryErrors.rateLimited })
    expect(verify).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it('rejects a failed Turnstile check', async () => {
    const verify = vi.fn().mockResolvedValue(false)
    const result = await handleInquiry(
      { ...valid, turnstileToken: 'bad' },
      deps({ verifyTurnstile: verify }),
    )
    expect(verify).toHaveBeenCalledWith('bad', '1.2.3.4')
    expect(result).toMatchObject({ status: 'error', message: inquiryErrors.verification })
    expect(create).not.toHaveBeenCalled()
  })

  it('ignores unknown or tampered product slugs but still saves the inquiry', async () => {
    find.mockResolvedValue({ docs: [] })
    await handleInquiry({ ...valid, product: 'does-not-exist' }, deps())
    expect(create.mock.calls[0]?.[0].data).toMatchObject({
      product: undefined,
      productLine: undefined,
    })

    vi.clearAllMocks()
    create.mockResolvedValue({ id: 11 })
    await handleInquiry({ ...valid, product: '1; drop table' }, deps())
    expect(find).not.toHaveBeenCalled()
    expect(create).toHaveBeenCalledOnce()
  })

  it('returns a friendly error and keeps the values when saving fails', async () => {
    create.mockRejectedValue(new Error('db down'))
    const result = await handleInquiry(valid, deps())
    expect(result).toMatchObject({
      status: 'error',
      message: inquiryErrors.server,
      values: { name: 'Ahmed Ali' },
    })
    expect(logger.error).toHaveBeenCalledOnce()
  })
})
