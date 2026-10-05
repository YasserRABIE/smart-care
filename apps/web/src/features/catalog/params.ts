import { z } from 'zod'

type RawSearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const schema = z.object({
  category: z
    .string()
    .regex(/^[a-z0-9-]{1,100}$/)
    .optional()
    .catch(undefined),
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .catch(undefined)
    .transform((value) => value || undefined),
  page: z.coerce.number().int().min(1).max(1000).catch(1),
})

export type CatalogParams = z.infer<typeof schema>

/** Catalog state from the URL. Invalid values fall back to defaults instead of erroring. */
export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  return schema.parse({
    category: first(searchParams.category),
    q: first(searchParams.q),
    page: first(searchParams.page) ?? 1,
  })
}

/** URL for a catalog state. Defaults (no category, no query, page 1) are left out. */
export function catalogHref(lineSlug: string, params: Partial<CatalogParams> = {}) {
  const search = new URLSearchParams()
  if (params.category) search.set('category', params.category)
  if (params.q) search.set('q', params.q)
  if (params.page && params.page > 1) search.set('page', String(params.page))
  const query = search.toString()
  return `/products/${lineSlug}${query ? `?${query}` : ''}`
}
