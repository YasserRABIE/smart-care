import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { relationId, validateProductCategory } from './validateProductCategory'

const makeReq = (category: { title: string; productLine: number }) =>
  ({ payload: { findByID: vi.fn().mockResolvedValue(category) } }) as unknown as PayloadRequest

const run = (data: Record<string, unknown>, req: PayloadRequest, originalDoc?: object) =>
  validateProductCategory({ data, originalDoc, req } as Parameters<
    typeof validateProductCategory
  >[0])

describe('relationId', () => {
  it('reads ids from raw values and populated docs', () => {
    expect(relationId(3)).toBe(3)
    expect(relationId({ id: 4 })).toBe(4)
    expect(relationId(null)).toBeUndefined()
  })
})

describe('validateProductCategory', () => {
  it('accepts a category from the same line', async () => {
    const req = makeReq({ title: 'Urology', productLine: 1 })
    await expect(run({ category: 5, productLine: 1 }, req)).resolves.toEqual({
      category: 5,
      productLine: 1,
    })
  })

  it('rejects a category from another line', async () => {
    const req = makeReq({ title: 'Urology', productLine: 1 })
    await expect(run({ category: 5, productLine: 2 }, req)).rejects.toThrow(/category/i)
  })

  it('checks against the saved line when only the category changes', async () => {
    const req = makeReq({ title: 'Urology', productLine: 1 })
    await expect(run({ category: 5 }, req, { productLine: { id: 2 } })).rejects.toThrow()
  })

  it('skips the lookup when there is no category', async () => {
    const req = makeReq({ title: 'Urology', productLine: 1 })
    await run({ productLine: 1 }, req)
    expect(req.payload.findByID).not.toHaveBeenCalled()
  })
})
