import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

import type { CacheTag } from '@/lib/data/tags'

/**
 * Expire the given cache tags after a content change, so the next visitor gets fresh data.
 * `{ expire: 0 }` rather than `'max'`: editors expect to see their change on the next reload.
 *
 * Skipped when `req.context.disableRevalidate` is set (the seed script runs outside Next.js,
 * where `revalidateTag` is unavailable).
 */
export function revalidate(req: PayloadRequest, tags: readonly CacheTag[]) {
  if (req.context.disableRevalidate) return
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 })
    } catch (error) {
      req.payload.logger.warn(
        { err: error, tag },
        'revalidateTag failed (outside a Next.js request?)',
      )
    }
  }
}

/** afterChange + afterDelete hooks for a collection. */
export function revalidateCollection(...tags: CacheTag[]) {
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    revalidate(req, tags)
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    revalidate(req, tags)
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

/** afterChange hook for a global. */
export function revalidateGlobal(...tags: CacheTag[]) {
  const afterChange: GlobalAfterChangeHook = ({ doc, req }) => {
    revalidate(req, tags)
    return doc
  }
  return { afterChange: [afterChange] }
}
