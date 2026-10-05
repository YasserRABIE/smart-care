import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { clientEnv } from '@/lib/env'

import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Smart Care Medical',
    template: '%s | Smart Care Medical',
  },
  description:
    'Surgical instruments, medical furniture, and AI diagnostics for hospitals across MENA.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  )
}
