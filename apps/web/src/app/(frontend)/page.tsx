import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-(--container-page) flex-col justify-center gap-4 px-6">
      <h1 className="font-display text-5xl tracking-tight">Smart Care Medical</h1>
      <p className="text-lg text-fg-tertiary">
        Site under construction. The design system arrives in Phase 2.
      </p>
      <Link
        href="/admin"
        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
      >
        Open the admin panel
      </Link>
    </main>
  )
}
