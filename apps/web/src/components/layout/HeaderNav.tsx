'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef } from 'react'

import { ListIcon, XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

import { Logo } from './Logo'
import { isActivePath, type NavItem } from './navigation'

/** Reads the current path for the active link. Render inside <Suspense> (path is request data). */
export function HeaderNav({ items }: { items: NavItem[] }) {
  return <HeaderNavView items={items} pathname={usePathname()} />
}

/**
 * Desktop links plus the mobile menu. `pathname: null` renders without an active link (the
 * Suspense fallback). The menu is a modal <dialog>, which gives focus trapping, Esc to close,
 * and an inert background for free.
 */
export function HeaderNavView({ items, pathname }: { items: NavItem[]; pathname: string | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuId = useId()

  // Close the menu after navigating.
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  return (
    <>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-12">
          {items.map((item) => {
            const active = pathname !== null && isActivePath(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-xs text-sm font-semibold uppercase focus-ring transition-colors',
                    active ? 'text-brand-600' : 'text-fg-secondary hover:text-brand-600',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls={menuId}
        className="-me-2 inline-flex size-10 items-center justify-center rounded-full text-fg-primary focus-ring hover:bg-surface-muted md:hidden"
      >
        <ListIcon aria-hidden size={24} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label="Menu"
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="ms-auto me-0 h-dvh max-h-dvh w-80 max-w-[85vw] bg-white p-0 text-fg-primary backdrop:bg-black/40 md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line-subtle px-4">
            <Logo className="w-32" />
            <button
              type="button"
              onClick={close}
              className="-me-2 inline-flex size-10 items-center justify-center rounded-full focus-ring hover:bg-surface-muted"
            >
              <XIcon aria-hidden size={24} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="flex flex-col p-2">
              {items.map((item) => {
                const active = pathname !== null && isActivePath(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={close}
                      className={cn(
                        'flex rounded-md px-3 py-3 text-lg font-semibold uppercase focus-ring transition-colors',
                        active
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-fg-secondary hover:bg-surface-muted',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  )
}
