import Image from 'next/image'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import { toImage, populated } from '@/lib/media'
import type { Category, Media } from '@/payload-types'
import { messages } from '@/messages/en'

export type ProductCardData = {
  id: number
  title: string
  slug: string
  description: string
  image: number | Media
  category?: number | Pick<Category, 'id' | 'title' | 'slug'> | null
}

export function ProductCard({
  product,
  priority,
}: {
  product: ProductCardData
  priority?: boolean
}) {
  const image = toImage(product.image)
  const category = populated(product.category)

  return (
    <Card as="article" className="flex h-full flex-col">
      <div className="relative flex h-60 items-start p-3 sm:h-80">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 612px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {category && <Badge className="relative">{category.title}</Badge>}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h2 className="text-xl font-bold text-fg-primary">{product.title}</h2>
        <p className="line-clamp-2 text-md text-fg-secondary">{product.description}</p>
      </div>
      <div className="mt-auto px-5 pt-0 pb-5 sm:py-4">
        <Button
          href={`/contact?product=${encodeURIComponent(product.slug)}#inquiry`}
          fullWidth
          trailingIcon={ArrowUpRightIcon}
        >
          {messages.common.sendInquiry}
          <span className="sr-only">: {product.title}</span>
        </Button>
      </div>
    </Card>
  )
}
