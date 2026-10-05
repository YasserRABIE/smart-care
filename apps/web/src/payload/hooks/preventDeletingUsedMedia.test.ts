import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { preventDeletingUsedMedia } from './preventDeletingUsedMedia'

const makeReq = (
  docsByCollection: Record<string, object[]>,
  globals: Record<string, object> = {},
) =>
  ({
    payload: {
      find: vi.fn(async ({ collection }: { collection: string }) => ({
        docs: docsByCollection[collection] ?? [],
      })),
      findGlobal: vi.fn(async ({ slug }: { slug: string }) => globals[slug] ?? {}),
    },
  }) as unknown as PayloadRequest

const run = (req: PayloadRequest, id = 5) =>
  preventDeletingUsedMedia({ id, req } as Parameters<typeof preventDeletingUsedMedia>[0])

describe('preventDeletingUsedMedia', () => {
  it('allows deleting an unused image', async () => {
    await expect(run(makeReq({}))).resolves.toBeUndefined()
  })

  it('names every place that still uses the image', async () => {
    const req = makeReq(
      { 'product-lines': [{ title: 'Surgical Specialties' }], partners: [{ name: 'Medicone' }] },
      { 'home-page': { hero: { image: 5 } } },
    )
    await expect(run(req)).rejects.toThrow(
      'This image is still used by: Product line "Surgical Specialties", Partner "Medicone", Home page hero.',
    )
  })

  it('ignores globals that use a different image', async () => {
    const req = makeReq({}, { 'contact-page': { hero: { image: { id: 9 } } } })
    await expect(run(req)).resolves.toBeUndefined()
  })
})
