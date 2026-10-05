import type { PayloadRequest } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/env', () => ({
  env: {
    CONTACT_FALLBACK_EMAIL: 'fallback@smartcare.test',
    NEXT_PUBLIC_SITE_URL: 'https://smartcare.test',
  },
}))

const { sendInquiryEmail } = await import('./sendInquiryEmail')

const sendEmail = vi.fn()
const logger = { warn: vi.fn(), error: vi.fn() }
const findByID = vi.fn(async ({ collection }: { collection: string }) =>
  collection === 'products'
    ? { title: 'Tungsten Needle Holder' }
    : { title: 'Surgical Specialties', notifyEmail: lineEmail },
)
let lineEmail: string | null = 'surgical@smartcare.test'

const req = { payload: { sendEmail, logger, findByID } } as unknown as PayloadRequest
const doc = {
  id: 9,
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Needing help with Tungsten Needle Holder',
  message: 'Please send a quote.',
  product: 3,
  productLine: 1,
  sourcePage: '/contact',
}
const run = (overrides: Record<string, unknown> = {}, operation = 'create') =>
  sendInquiryEmail({ doc: { ...doc, ...overrides }, operation, req } as Parameters<
    typeof sendInquiryEmail
  >[0])

describe('sendInquiryEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    lineEmail = 'surgical@smartcare.test'
  })

  it("emails the product line's inbox with reply-to set to the customer", async () => {
    await run()
    expect(sendEmail).toHaveBeenCalledOnce()
    const message = sendEmail.mock.calls[0]?.[0]
    expect(message.to).toBe('surgical@smartcare.test')
    expect(message.replyTo).toBe('ahmed@example.com')
    expect(message.subject).toBe('New inquiry: Needing help with Tungsten Needle Holder')
    expect(message.text).toContain('https://smartcare.test/admin/collections/inquiries/9')
  })

  it('falls back to CONTACT_FALLBACK_EMAIL when the line has no inbox or there is no line', async () => {
    lineEmail = null
    await run()
    expect(sendEmail.mock.calls[0]?.[0].to).toBe('fallback@smartcare.test')
    sendEmail.mockClear()
    await run({ product: null, productLine: null })
    expect(sendEmail.mock.calls[0]?.[0].to).toBe('fallback@smartcare.test')
  })

  it('only sends on create', async () => {
    await run({}, 'update')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('logs instead of throwing when sending fails', async () => {
    sendEmail.mockRejectedValueOnce(new Error('Resend down'))
    await expect(run()).resolves.toMatchObject({ id: 9 })
    expect(logger.error).toHaveBeenCalledOnce()
  })
})
