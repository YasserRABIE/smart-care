import { ProductLineCard } from '@/features/catalog/ProductLineCard'
import type { ProductLine } from '@/payload-types'

export function ProductLinesGrid({ lines }: { lines: ProductLine[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-10 md:grid-cols-3">
      {lines.map((line) => (
        <li key={line.id}>
          <ProductLineCard line={line} />
        </li>
      ))}
    </ul>
  )
}
