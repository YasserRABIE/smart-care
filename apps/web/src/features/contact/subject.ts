export const DEFAULT_PRODUCT_SUBJECT = 'Needing help with {product}'

/** Prefilled subject for a product inquiry, from the CMS template. */
export function productSubject(template: string | null | undefined, productTitle: string) {
  const pattern = template?.includes('{product}') ? template : DEFAULT_PRODUCT_SUBJECT
  return pattern.replaceAll('{product}', productTitle).slice(0, 200)
}
