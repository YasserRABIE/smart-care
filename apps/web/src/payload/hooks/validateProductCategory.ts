import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

type RelationValue = number | string | { id: number | string } | null | undefined

export const relationId = (value: RelationValue) =>
  value && typeof value === 'object' ? value.id : (value ?? undefined)

/** A product's category must belong to the product's line. */
export const validateProductCategory: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const categoryId = relationId(data?.category ?? originalDoc?.category)
  const productLineId = relationId(data?.productLine ?? originalDoc?.productLine)
  if (!categoryId || !productLineId) return data

  const category = await req.payload.findByID({
    collection: 'categories',
    id: categoryId,
    depth: 0,
    req,
  })

  if (String(relationId(category.productLine)) !== String(productLineId)) {
    throw new ValidationError({
      collection: 'products',
      errors: [
        {
          path: 'category',
          message: `"${category.title}" belongs to a different product line.`,
        },
      ],
    })
  }
  return data
}
