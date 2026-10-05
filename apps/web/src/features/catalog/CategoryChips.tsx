import { Chip } from '@/components/ui/Chip'
import type { CategoryWithCount } from '@/lib/data/catalog'

import { catalogHref } from './params'

type CategoryChipsProps = {
  lineSlug: string
  allLabel: string
  total: number
  categories: CategoryWithCount[]
  activeCategory?: string
  query?: string
}

/** Filter links. Changing the category keeps the search and resets to page 1. */
export function CategoryChips({
  lineSlug,
  allLabel,
  total,
  categories,
  activeCategory,
  query,
}: CategoryChipsProps) {
  return (
    <nav aria-label="Categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Chip
            href={catalogHref(lineSlug, { q: query })}
            label={allLabel}
            count={total}
            active={!activeCategory}
          />
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Chip
              href={catalogHref(lineSlug, { category: category.slug, q: query })}
              label={category.title}
              count={category.count}
              active={activeCategory === category.slug}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
