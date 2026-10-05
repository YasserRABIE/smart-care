import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionSlug,
  type GlobalSlug,
} from 'payload'

/** Required upload fields. Deleting media they point at would fail in Postgres (NOT NULL). */
const collectionUsages: {
  collection: CollectionSlug
  field: string
  label: string
  titleField: string
}[] = [
  { collection: 'product-lines', field: 'coverImage', label: 'Product line', titleField: 'title' },
  { collection: 'products', field: 'image', label: 'Product', titleField: 'title' },
  { collection: 'partners', field: 'logo', label: 'Partner', titleField: 'name' },
]

const globalUsages: { global: GlobalSlug; path: string[]; label: string }[] = [
  { global: 'home-page', path: ['hero', 'image'], label: 'Home page hero' },
  { global: 'contact-page', path: ['hero', 'image'], label: 'Contact page hero' },
]

const idOf = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value ? (value as { id: unknown }).id : value

/** Block deleting an image that content still requires, with a message naming where it is used. */
export const preventDeletingUsedMedia: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { payload } = req
  const uses: string[] = []

  for (const { collection, field, label, titleField } of collectionUsages) {
    const { docs } = await payload.find({
      collection,
      where: { [field]: { equals: id } },
      depth: 0,
      limit: 5,
      draft: true,
      req,
    })
    for (const doc of docs)
      uses.push(`${label} "${String((doc as unknown as Record<string, unknown>)[titleField])}"`)
  }

  for (const { global, path, label } of globalUsages) {
    const doc = (await payload.findGlobal({ slug: global, depth: 0, req })) as unknown as Record<
      string,
      unknown
    >
    const value = path.reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      doc,
    )
    if (String(idOf(value)) === String(id)) uses.push(label)
  }

  if (uses.length > 0) {
    throw new APIError(
      `This image is still used by: ${uses.join(', ')}. Replace it there first, then delete it.`,
      400,
      { uses },
      true,
    )
  }
}
