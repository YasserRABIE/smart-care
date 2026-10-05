import Link from 'next/link'
import { Suspense } from 'react'

import { Container } from './Container'
import { HeaderNav, HeaderNavView } from './HeaderNav'
import { Logo } from './Logo'
import { mainNav } from './navigation'

export function Header() {
  return (
    <header>
      <Container size="wide" className="flex h-16 items-center justify-between gap-6 md:h-19">
        <Link href="/" aria-label="Smart Care Medical, home" className="rounded-xs focus-ring">
          <Logo priority className="w-32 md:w-auto" />
        </Link>
        <Suspense fallback={<HeaderNavView items={mainNav} pathname={null} />}>
          <HeaderNav items={mainNav} />
        </Suspense>
      </Container>
    </header>
  )
}
