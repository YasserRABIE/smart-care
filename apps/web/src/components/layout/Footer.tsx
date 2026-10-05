import { cacheLife } from 'next/cache'
import Link from 'next/link'

import { Container } from './Container'
import { Logo } from './Logo'
import { mainNav } from './navigation'

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-white">
      <Container className="flex flex-col gap-8 pt-12 pb-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            aria-label="Smart Care Medical, home"
            className="w-fit rounded-xs focus-ring"
          >
            <Logo variant="mono" />
          </Link>
          <p className="text-sm text-fg-quaternary">
            © <CopyrightYear /> Smart Care Medical. All rights reserved.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-xs text-sm font-medium text-fg-secondary uppercase focus-ring transition-colors hover:text-brand-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}

/** Cached so the prerendered shell stays static; refreshes daily so the year rolls over. */
async function CopyrightYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}
