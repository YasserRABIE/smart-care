import Link from 'next/link'

import { Container } from './Container'
import { HeaderNav } from './HeaderNav'
import { Logo } from './Logo'
import { mainNav } from './navigation'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-white/95 backdrop-blur-sm">
      <Container size="wide" className="flex h-16 items-center justify-between gap-6 md:h-19">
        <Link href="/" aria-label="Smart Care Medical, home" className="rounded-xs focus-ring">
          <Logo priority className="w-32 md:w-auto" />
        </Link>
        <HeaderNav items={mainNav} />
      </Container>
    </header>
  )
}
