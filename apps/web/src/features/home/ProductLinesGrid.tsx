import { ProductLineCard } from '@/features/catalog/ProductLineCard'
import type { ProductLine } from '@/payload-types'

type ProductLinesGridProps = {
  lines: ProductLine[]
  /** h2 when the grid sits directly under the page h1 (/products); h3 under a section h2. */
  headingLevel?: 'h2' | 'h3'
  /** Load images eagerly when the grid is above the fold. */
  priority?: boolean
}

export function ProductLinesGrid({ lines, headingLevel = 'h3', priority }: ProductLinesGridProps) {
  return (
    <ul className="grid gap-x-6 gap-y-10 md:grid-cols-3">
      {lines.map((line) => (
        <li key={line.id}>
          <ProductLineCard line={line} headingLevel={headingLevel} priority={priority} />
        </li>
      ))}
    </ul>
  )
}
