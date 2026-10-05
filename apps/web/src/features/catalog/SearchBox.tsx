'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { SearchInput } from '@/components/ui/SearchInput'
import { messages } from '@/messages/en'

import { catalogHref } from './params'

type SearchBoxProps = {
  lineSlug: string
  category?: string
  query?: string
  placeholder: string
}

const DEBOUNCE_MS = 300

/**
 * Updates `?q=` as the user types (debounced), keeping the category and resetting the page.
 * Also a plain GET form, so search works before hydration or without JavaScript.
 */
export function SearchBox({ lineSlug, category, query = '', placeholder }: SearchBoxProps) {
  const router = useRouter()
  const [value, setValue] = useState(query)
  const [isPending, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  // Follow external URL changes (back button, "Clear filters") unless the user is typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(query)
  }, [query])

  useEffect(() => () => clearTimeout(timer.current), [])

  const navigate = (next: string) => {
    clearTimeout(timer.current)
    const q = next.trim()
    if (q === query) return
    startTransition(() => {
      router.replace(catalogHref(lineSlug, { category, q }), { scroll: false })
    })
  }

  return (
    <form
      role="search"
      action={`/products/${lineSlug}`}
      method="get"
      onSubmit={(event) => {
        event.preventDefault()
        navigate(value)
      }}
      className="w-full md:w-56"
    >
      {category && <input type="hidden" name="category" value={category} />}
      <SearchInput
        ref={inputRef}
        name="q"
        value={value}
        onChange={(event) => {
          const next = event.target.value
          setValue(next)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => navigate(next), DEBOUNCE_MS)
        }}
        placeholder={placeholder}
        aria-label={messages.catalog.searchLabel}
        aria-busy={isPending || undefined}
        maxLength={100}
        autoComplete="off"
      />
    </form>
  )
}
