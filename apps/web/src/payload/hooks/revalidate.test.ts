import type { PayloadRequest } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()
vi.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }))

const { revalidate } = await import('./revalidate')

const warn = vi.fn()
const makeReq = (context: Record<string, unknown> = {}) =>
  ({ context, payload: { logger: { warn } } }) as unknown as PayloadRequest

describe('revalidate', () => {
  beforeEach(() => {
    revalidateTag.mockReset()
    warn.mockReset()
  })

  it('expires every tag immediately', () => {
    revalidate(makeReq(), ['products', 'categories'])
    expect(revalidateTag).toHaveBeenCalledWith('products', { expire: 0 })
    expect(revalidateTag).toHaveBeenCalledWith('categories', { expire: 0 })
  })

  it('does nothing when revalidation is disabled (seed)', () => {
    revalidate(makeReq({ disableRevalidate: true }), ['products'])
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('logs instead of failing the save when revalidateTag throws', () => {
    revalidateTag.mockImplementation(() => {
      throw new Error('static generation store missing')
    })
    expect(() => revalidate(makeReq(), ['faqs'])).not.toThrow()
    expect(warn).toHaveBeenCalledOnce()
  })
})
