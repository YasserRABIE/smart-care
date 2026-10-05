import { PageBanner } from '@/components/layout/PageBanner'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { getCategoriesWithCounts, getProducts } from '@/lib/data/catalog'
import type { ProductLine } from '@/payload-types'
import { messages } from '@/messages/en'

import { CategoryChips } from './CategoryChips'
import { ProductCard, type ProductCardData } from './ProductCard'
import { catalogHref, type CatalogParams } from './params'
import { SearchBox } from './SearchBox'

type CatalogProps = {
  line: ProductLine
  params: CatalogParams
}

export async function Catalog({ line, params }: CatalogProps) {
  const { total, categories } = await getCategoriesWithCounts(line.id)
  // Unknown category slugs fall back to "all".
  const activeCategory = categories.find((category) => category.slug === params.category)

  const { products, totalPages, page, totalDocs } = await getProducts({
    productLineId: line.id,
    categoryId: activeCategory?.id,
    query: params.q,
    page: params.page,
  })

  const hasFilters = Boolean(activeCategory || params.q)

  return (
    <>
      <PageBanner
        variant="gradient"
        breadcrumbs={[
          { label: messages.common.home, href: '/' },
          { label: messages.common.products, href: '/products' },
          { label: line.title },
        ]}
        title={line.title}
        description={line.description}
      />

      <Container size="wide" className="pt-10 pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CategoryChips
            lineSlug={line.slug}
            allLabel={line.catalog.allLabel}
            total={total}
            categories={categories}
            activeCategory={activeCategory?.slug}
            query={params.q}
          />
          <SearchBox
            lineSlug={line.slug}
            category={activeCategory?.slug}
            query={params.q}
            placeholder={line.catalog.searchPlaceholder}
          />
        </div>

        <p aria-live="polite" className="sr-only">
          {messages.catalog.resultsCount(totalDocs)}
        </p>

        {products.length > 0 ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product as ProductCardData} priority={index < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <Card
            variant="muted"
            className="mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center"
          >
            <h2 className="text-xl font-bold text-fg-primary">{messages.catalog.emptyTitle}</h2>
            <p className="max-w-md text-md text-fg-secondary">
              {params.q
                ? messages.catalog.emptyWithQuery(params.q)
                : messages.catalog.emptyCategory}
            </p>
            {hasFilters && (
              <Button href={catalogHref(line.slug)} variant="outline" size="sm" className="mt-2">
                {messages.catalog.clearFilters}
              </Button>
            )}
          </Card>
        )}

        <Pagination
          className="mt-14"
          currentPage={page}
          totalPages={totalPages}
          getHref={(target) =>
            catalogHref(line.slug, { category: activeCategory?.slug, q: params.q, page: target })
          }
        />
      </Container>
    </>
  )
}
