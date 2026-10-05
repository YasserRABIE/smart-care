import Image from 'next/image'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { HomePage } from '@/payload-types'

import { statSpan } from './bento'

export function AboutStats({ about }: { about: HomePage['about'] }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2.5">
          <Image
            src="/brand/logo.svg"
            alt=""
            width={291}
            height={55}
            unoptimized
            style={{ height: 'auto' }}
            className="w-48 md:w-72"
          />
          <h2 className="font-display text-display-md text-brand-500 md:text-display-lg">
            {about.title}
          </h2>
        </div>
        <p className="max-w-120 text-md text-fg-secondary md:text-lg">{about.intro}</p>
      </div>

      <ul className="grid gap-3 lg:grid-cols-3">
        {about.stats?.map((stat, index) => (
          <Card
            as="li"
            variant="muted"
            key={stat.id}
            className={cn(
              'flex min-h-48 flex-col justify-between gap-8 px-6 py-5 lg:min-h-64',
              statSpan(index) === 'wide' && 'lg:col-span-2',
            )}
          >
            <p className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="font-display text-display-md leading-none text-fg-primary md:text-display-lg md:leading-none">
                {stat.value}
              </span>
              <span className="font-display text-xl text-fg-tertiary md:text-display-xs">
                {stat.label}
              </span>
            </p>
            <p className="font-display text-xl text-fg-tertiary md:text-display-sm">
              {stat.description}
            </p>
          </Card>
        ))}
      </ul>
    </div>
  )
}
