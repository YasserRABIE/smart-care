import { Container } from '@/components/layout/Container'
import { Skeleton } from '@/components/ui/Skeleton'

export function CatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="bg-linear-169 from-brand-50 from-65% to-brand-50/0 to-75% py-10">
        <Container className="flex flex-col gap-3">
          <Skeleton className="h-5 w-48 bg-white/70" />
          <Skeleton className="h-12 w-80 max-w-full bg-white/70 md:h-15" />
          <Skeleton className="h-7 w-full max-w-200 bg-white/70" />
        </Container>
      </div>
      <Container size="wide" className="pt-10 pb-20">
        <div className="flex flex-wrap gap-2">
          {[40, 28, 36, 44].map((width) => (
            <Skeleton
              key={width}
              className="h-11 rounded-full"
              style={{ width: `${width * 4}px` }}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[33.375rem] rounded-xl" />
          ))}
        </div>
      </Container>
    </div>
  )
}
